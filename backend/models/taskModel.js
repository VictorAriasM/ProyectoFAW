import Joi from "joi";
import sql from "../db.js";
import Table from "./tableModel.js";
import AppError from "../utils/AppError.js";

class Tasks extends Table {
  constructor() {
    super("tasks");
  }

  static requiredSchema = Joi.object({
    title: Joi.string().required(),
    priority: Joi.string().valid("ALTA", "MEDIA", "BAJA").required(),
    description: Joi.string().required(),
    owner: Joi.number().required(),
  });

  static optionalSchema = Joi.object().keys({
    title: Joi.string(),
    priority: Joi.string().valid("ALTA", "MEDIA", "BAJA"),
    description: Joi.string(),
    created_at: Joi.date(),
    owner: Joi.number(),
    status: Joi.string().valid("ACTIVA", "FINALIZADA"),
  });

  static filtersSchema = this.optionalSchema.keys({
    search: Joi.string(),
    sort: Joi.string().valid("asc", "desc"),
  });

  static async createTable() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            priority INT NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL,
            owner INT REFERENCES users(id),
            status TEXT NOT NULL
        )`;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  /**
   * Creates a new task in the database.
   * @param {Object} newTask - The task object containing the properties of the new task.
   * @param {string} newTask.title - The title of the task.
   * @param {string} newTask.priority - The priority of the task.
   * @param {string} newTask.description - The description of the task.
   * @param {string} newTask.created_at - The creation date of the task.
   * @param {string} newTask.owner - The owner of the task.
   * @param {string} newTask.status - The status of the task.
   * @returns {Promise<Object>} - A promise that resolves to the created task object.
   * @throws {Error} - If there is an error while creating the task.
   */
  static async createTask(newTask) {
    try {
      await this.requiredSchema.validateAsync(newTask);
      const created_at = new Date();
      newTask.priority =
        ["ALTA", "MEDIA", "BAJA"].indexOf(newTask.priority) + 1;
      const task = await sql`
      INSERT INTO tasks (title, priority, description, created_at, owner, status) 
      VALUES (${newTask.title}, ${newTask.priority}, ${newTask.description}, ${created_at}, ${newTask.owner}, 'ACTIVA') 
      RETURNING *`;
      return task[0];
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  // get all tasks
  static async getTasks(filters) {
    try {
      let query = "SELECT * FROM tasks";
      if (Object.keys(filters).length) {
        if (
          ["priority", "status", "owner", "created_at", "search"].some((key) =>
            Object.keys(filters).includes(key)
          )
        ) {
          query += " WHERE";
        }

        if (filters.search) {
          query += ` (title ILIKE '%${filters.search}%' OR description ILIKE '%${filters.search}%') AND`;
        }

        for (const key in filters) {
          if (["priority", "status", "owner", "created_at"].includes(key)) {
            query += ` ${key} = '${filters[key]}' AND`;
          }
        }

        if (query.endsWith("AND")) {
          query = query.slice(0, -3);
        }

        if (filters.sort) {
          query += ` ORDER BY priority ASC, created_at ${filters.sort.toUpperCase()}`;
        }
      }

      console.log(query);
      const tasks = await sql.unsafe(query);
      return tasks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // get a task by id
  static async getTaskById(id) {
    try {
      const task = await sql`SELECT * FROM tasks WHERE id = ${id}`;
      if (!task) {
        throw new AppError("Task not found", 404);
      }
      return task;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // update a task by id
  static async updateTask(id, updatedTask) {
    try {
      await this.optionalSchema.validateAsync(updatedTask);

      delete updatedTask.created_at;
      delete updatedTask.owner;

      let mutation = "";
      for (const key in updatedTask) {
        mutation += `${key} = '${updatedTask[key]}', `;
      }

      mutation = mutation.slice(0, -2);

      const task = await sql.unsafe(`
      UPDATE tasks
      SET ${mutation}
      WHERE id = ${id}
      RETURNING *
      `);

      return task;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

(async () => {
  await Tasks.createTable();
  // await Tasks.dropTable();
})();

export default Tasks;
