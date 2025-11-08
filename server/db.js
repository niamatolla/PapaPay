import mysql from 'mysql2/promise';

export const pool=mysql.createPool({

host:process.env.MYSQL_HOST,
port:Number(process.env.MYSQL_PORT || 3306),
user:process.env.MYSQL_USER,
password:process.env.MYSQL_PASSWORD,
database:process.env.MYSQL_DATABASE,
waitForConnections:true,
connectionLimit:10,

});

//quick test helper to call once if i want to 

export async function ping(){
    const [rows]=await pool.query('Select 1 as ok');
    return(rows[0].ok===1);
}