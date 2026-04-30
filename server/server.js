import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pool } from './db.js';
import { nanoid } from 'nanoid';

const app= express();

//Cookie 
const ADMIN_COOKIE='pp_admin';

//Cookies & CORS for auth
app.use(cors({
    origin:process.env.CORS_ORIGIN,

    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

//Health check route 
app.get('/api/health',(req,res) =>{
    res.json({ok :true,env:process.env.NODE_ENV || 'local'});
}
);

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
    
const{ code }=req.body || {};

if(!code) return res.status(400).json({error:'code_required'});

if(code === process.env.ADMIN_CODE){

    res.cookie(ADMIN_COOKIE,'1',{
        
        httpOnly:true,
        sameSite: 'lax',
        secure:false, // local dev only
        maxAge:1000 * 60 * 60 * 12, //12h

    });
    return res.status(200).json({ok:true});
}
     return res.status(401).json({error:'invalid code'});

});

//POST/api/admin/logout
app.post('/api/admin/logout',(_req,res) =>{
    
    res.clearCookie(ADMIN_COOKIE,{sameSite:'lax',secure:false});
    res.json({ok:true});
});

//middleware check if User has admin cookie or not 
function requireAdmin(req, res, next){

    if (req.cookies?.[ADMIN_COOKIE] ==='1') return next();
    return res.status(401).json({error :'admin_only'});

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