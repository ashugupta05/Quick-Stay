import mysql from "mysql2/promise"


// Function to create a new MySQL connection
async function getDbConnection() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "quickstay"
  });
  console.log("Connection Successfully");
  return db;
}

export default getDbConnection;