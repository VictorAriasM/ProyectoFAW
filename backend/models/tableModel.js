import sql from "../db.js";

class Table {
  constructor(name) {
    this.name = name;
  }

  static async dropTable() {
    try {
      await sql`DROP TABLE IF EXISTS ${this.name}`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async describeTable() {
    try {
      const table =
        await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${this.name}`;
      return table;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default Table;
