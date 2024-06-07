import postgres from "postgres";


const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "taskmaster",
  username: "postgres",
  password: "root",
});


(async () => {
  try {
    await sql`SELECT 1`;
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed");
  }
})();

export default sql;
