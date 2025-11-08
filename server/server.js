import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pool } from './db.js';
import { nanoid } from 'nanoid';

const app= express();

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

await pool.execute(sql,params);

//created 

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

//Start server 
const PORT =process.env.PORT || 5174;
app.listen(PORT, () =>{

    console.log(`PapaPay API running on http://localhost:${PORT}`);
});