const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to the database');
    connection.release(); // Release the connection back to the pool
  }
});


const query = (text, params) => {
  console.log('executed query:', text);
  return new Promise((resolve, reject) => {
    pool.query(text, params, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};



module.exports = {
  query
};