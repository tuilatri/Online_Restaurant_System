const sql = require('mssql');
const dbConfig = require('../config/db');

class Order {
  static async getAll() {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query('SELECT * FROM Orders');
    return result.recordset;
  }

  static async getById(id) {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM Orders WHERE id = @id');
    return result.recordset[0];
  }

  static async create(order, details) {
    let pool = await sql.connect(dbConfig);
    try {
      await pool.request()
        .input('id', sql.VarChar, order.id)
        .input('user_phone', sql.VarChar, order.user_phone)
        .input('delivery_method', sql.NVarChar, order.delivery_method)
        .input('delivery_date', sql.Date, order.delivery_date)
        .input('delivery_time', sql.NVarChar, order.delivery_time)
        .input('note', sql.NVarChar, order.note)
        .input('receiver_name', sql.NVarChar, order.receiver_name)
        .input('receiver_phone', sql.VarChar, order.receiver_phone)
        .input('receiver_address', sql.NVarChar, order.receiver_address)
        .input('total_amount', sql.Int, order.total_amount)
        .input('status', sql.Int, order.status || 1)
        .query(`
          INSERT INTO Orders (id, user_phone, delivery_method, delivery_date, delivery_time, note,
                             receiver_name, receiver_phone, receiver_address, total_amount, status)
          VALUES (@id, @user_phone, @delivery_method, @delivery_date, @delivery_time, @note,
                  @receiver_name, @receiver_phone, @receiver_address, @total_amount, @status)
        `);

      for (const detail of details) {
        await pool.request()
          .input('order_id', sql.VarChar, order.id)
          .input('product_id', sql.Int, detail.product_id)
          .input('quantity', sql.Int, detail.quantity)
          .input('price', sql.Int, detail.price)
          .input('note', sql.NVarChar, detail.note)
          .query(`
            INSERT INTO OrderDetails (order_id, product_id, quantity, price, note)
            VALUES (@order_id, @product_id, @quantity, @price, @note)
          `);
      }
    } catch (error) {
      throw error;
    }
  }

  static async update(id, order) {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.VarChar, id)
      .input('status', sql.Int, order.status)
      .query(`
        UPDATE Orders
        SET status = @status
        WHERE id = @id
      `);
  }
}

module.exports = Order;