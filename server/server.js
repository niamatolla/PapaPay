import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';
import { nanoid } from 'nanoid';

const app= express();

// JWT-based auth — works cross-origin without cookie restrictions
// Token is stored in localStorage on the frontend and sent as Authorization: Bearer <token>
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRY = '12h';

// CORS Configuration for production and development
// - Development: allows requests from http://localhost:5173
// - Production: allows requests from Vercel frontend (https://papa-pay.vercel.app)
const allowedOrigins = [
    'http://localhost:5173',           // Local development
    'http://localhost:5174',           // Local dev server
    'https://papa-pay.vercel.app',     // Production Vercel frontend
    process.env.FRONTEND_URL,          // Additional frontend URL from env (production)
    process.env.CORS_ORIGIN,           // Fallback from env (development)
].filter(Boolean); // Remove undefined/null values

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl requests, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS not allowed for origin: ${origin}`));
        }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

//Health check route 
app.get('/api/health',(req,res) =>{
    res.json({
        ok: true,
        env: process.env.NODE_ENV || 'local',
        isProduction,
        cookieConfig: {
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
        },
        receivedCookies: req.cookies,
    });
});

//create new request 
app.post('/api/requests',async(req,res)=>{

try{
    const{ requester,amount,reason,pitch,dad_mood,repay_plan}=req.body || {};

    console.log('POST /api/requests received', {
        requester,
        amount,
        reason,
        dad_mood,
        repay_plan,
        hasPitch: Boolean(pitch),
    });

    //basic validations

    if(!requester || !reason || !pitch || amount === undefined ){
        return (res.status(400).json({error:'requester,amount,reason,pitch are required'}));
    }

    const amt=Number(amount);

    if(Number.isNaN(amt)|| amt<0){

         return (res.status(400).json({error:'amount must a non-negative number '}));
    }
    
    const id=nanoid();
    const sql=`
     
    INSERT INTO requests
    (id, requester, amount, reason, dad_mood, repay_plan, pitch, status)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, 'pending')
`;

const params =[id,requester,amt,reason,dad_mood ||null,repay_plan || null,pitch ];

    console.log('POST /api/requests executing SQL', {
        sql: sql.trim(),
        params,
    });

    const [result] = await pool.execute(sql,params);

    console.log('POST /api/requests SQL result', result);

//created 
    console.log('POST /api/requests returning response', { id });
return res.status(201).json({id});


}
catch(err){
    console.error('POST /api/requests error:',err);
    return res.status(500).json({error:'failed to create request'});
}
});

//GET /api/requests ->newest request is first 
app.get('/api/requests', async(req, res) => {
try{
    const[ rows] =await pool.query(
        `SELECT id, created_at, requester, amount, reason, dad_mood, repay_plan, pitch, status, decided_at, decided_by, decision_note
        FROM requests
        ORDER BY created_at DESC`
    );
    return res.json(rows);
}
catch(err){
    console.error('GET/api/requests error:',err);
    return res.status(500).json({error:'failed to list requests'});

}
});

//POST/api/admin/login
app.post('/api/admin/login',(req,res) =>{
    const { code } = req.body || {};

    if (!code) return res.status(400).json({ error: 'code_required' });

    if (code === process.env.ADMIN_CODE) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        return res.status(200).json({ ok: true, token });
    }
    return res.status(401).json({ error: 'invalid code' });
});

//POST/api/admin/logout — token is stateless; client just deletes it from localStorage
app.post('/api/admin/logout',(_req,res) =>{
    res.json({ ok: true });
});

app.get('/api/dad/me', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ error: 'Not logged in' });

    try {
        jwt.verify(token, JWT_SECRET);
        return res.json({ loggedIn: true });
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Middleware: verify JWT token from Authorization header
function requireAdmin(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ error: 'admin_only' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
        next();
    } catch {
        return res.status(401).json({ error: 'invalid_token' });
    }
}

//PATCH/api/requests/:id/decision { action:"approve" | "deny", note?:string}
app.patch('/api/requests/:id/decision',requireAdmin,async(req,res) =>{

try{

    const {id }=req.params;
    const {action ,note}=req.body || {};

    if(!['approve','deny'].includes(action)){
        return res.status(400).json({error:'action_must_be_approve_or_deny'});

    }
    
    const newStatus =action === 'approve' ? 'approved' : 'denied';

    const [result] =await pool.query(

         `UPDATE requests 
             SET status =?, decided_at=NOW(), decided_by='dad', decision_note= ?
             WHERE id=? `,
        
        [newStatus,note ?? null,id]);

        if(result.affectedRows === 0) return res.status(404).json({error:'not_found'});
        const[rows]=await pool.query(`SELECT * FROM requests WHERE id =?`,[id]);
        return res.json(rows[0]);
}
catch(e){
    console.error(e);
    return res.status(500).json({error:'server_error'});
}
});

//Start server 
const PORT =process.env.PORT || 5174;
app.listen(PORT, () =>{

    console.log(`PapaPay API running on http://localhost:${PORT}`);
});