import sql from "../db.js";
import Joi from "joi";
import Table from "./tableModel.js";

class Users extends Table {
  constructor() {
    super("users");
  }

  static requiredSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    birthday: Joi.date().required(),
    gender: Joi.string().valid("MASCULINO", "FEMENINO").required(),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  static async createTable() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            birthday DATE NOT NULL,
            gender TEXT NOT NULL
        )`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Modelo para manejo de usuarios en la base de datos.
   * @param {Object} newUser 
   * @param {string} newUser.email 
   * @param {string} newUser.password 
   * @param {string} newUser.name
   * @param {string} newUser.birthday 
   * @param {string} newUser.gender 
   * @returns {Promise<Object>} 
   * @throws {Error}
   */
  static async createUser(newUser) {
    try {
      await this.requiredSchema.validateAsync(newUser);
      const user = await sql`
            INSERT INTO users (email, password, name, birthday, gender)
            VALUES (${newUser.email}, ${newUser.password}, ${newUser.name}, ${newUser.birthday}, ${newUser.gender})
            RETURNING *`;
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getUsers() {
    try {
      const users = await sql`SELECT * FROM users`;

      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getUserById(userId) {
    try {
      const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
      return user[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async loginUser(email, password) {
    try {
      await this.loginSchema.validateAsync({ email, password });
      const user =
        await sql`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;

      if (!user[0]) {
        throw new Error("Invalid email or password");
      }

      return user[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

(async () => {
  await Users.createTable();
  // await Users.dropTable();
})();

export default Users;
