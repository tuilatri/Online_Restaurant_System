const sql = require('mssql');
const dbConfig = require('../config/db.config');

class Account {
  static async getAll() {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query('SELECT * FROM Accounts');
    return result.recordset;
  }

  static async getByPhone(phone) {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('phone', sql.VarChar, phone)
      .query('SELECT * FROM Accounts WHERE phone = @phone');
    return result.recordset[0];
  }

  static async create(account) {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('fullname', sql.NVarChar, account.fullname)
      .input('phone', sql.VarChar, account.phone)
      .input('password', sql.NVarChar, account.password) // Plain text password
      .input('email', sql.NVarChar, account.email)
      .input('address', sql.NVarChar, account.address)
      .input('status', sql.Int, account.status || 1)
      .input('join_date', sql.DateTime, new Date())
      .input('userType', sql.Int, account.userType || 0)
      .input('cart', sql.NVarChar, account.cart || '[]')
      .query(`
        INSERT INTO Accounts (fullname, phone, password, email, address, status, join_date, userType, cart)
        VALUES (@fullname, @phone, @password, @email, @address, @status, @join_date, @userType, @cart)
      `);
  }

  static async update(phone, account) {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('phone', sql.VarChar, phone)
      .input('fullname', sql.NVarChar, account.fullname)
      .input('password', sql.NVarChar, account.password) // Plain text password
      .input('email', sql.NVarChar, account.email)
      .input('address', sql.NVarChar, account.address)
      .input('status', sql.Int, account.status)
      .input('userType', sql.Int, account.userType)
      .input('cart', sql.NVarChar, account.cart)
      .query(`
        UPDATE Accounts
        SET fullname = @fullname, password = @password, email = @email, address = @address,
            status = @status, userType = @userType, cart = @cart
        WHERE phone = @phone
      `);
  }

  static async delete(phone) {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('phone', sql.VarChar, phone)
      .query('DELETE FROM Accounts WHERE phone = @phone');
  }
}

module.exports = Account;