require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  console.log(`Database '${process.env.DB_NAME}' is ready`);
  await connection.end();
}

async function syncModels() {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false
    }
  );

  const models = require('./models');

  await models.sequelize.sync({ alter: true });
  console.log('All models synced successfully!');
}

async function main() {
  try {
    await createDatabaseIfNotExists();
    await syncModels();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
