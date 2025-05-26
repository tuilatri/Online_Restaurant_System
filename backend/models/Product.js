const sql = require('mssql');
const dbConfig = require('../config/db');

class Product {
  static async getAll() {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query('SELECT * FROM Products');
    return result.recordset;
  }

  static async getById(id) {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Products WHERE id = @id');
    return result.recordset[0];
  }

  static async create(product) {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('title', sql.NVarChar, product.title)
      .input('img', sql.NVarChar, product.img)
      .input('category', sql.NVarChar, product.category)
      .input('price', sql.Int, product.price)
      .input('description', sql.NVarChar, product.description)
      .input('status', sql.Int, product.status)
      .query(`
        INSERT INTO Products (title, img, category, price, description, status)
        VALUES (@title, @img, @category, @price, @description, @status)
      `);
  }

  static async update(id, product) {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, product.title)
      .input('img', sql.NVarChar, product.img)
      .input('category', sql.NVarChar, product.category)
      .input('price', sql.Int, product.price)
      .input('description', sql.NVarChar, product.description)
      .input('status', sql.Int, product.status)
      .query(`
        UPDATE Products
        SET title = @title, img = @img, category = @category, price = @price,
            description = @description, status = @status
        WHERE id = @id
      `);
  }

  static async delete(id) {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Products WHERE id = @id');
  }
}

module.exports = Product;