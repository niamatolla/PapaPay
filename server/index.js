import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app= express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,

    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

//Helth check route 
app.get('/api/health',(req,res) =>{
    res.json({ok :true,env:process.env.NODE_ENV || 'local'});
}
);


//Start server 
const PORT =process.env.PORT || 5174;
app.listen(PORT, () =>{

    console.logO('Papapay API running on https://localhost:${PORT}');
});