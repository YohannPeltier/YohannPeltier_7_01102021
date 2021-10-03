// Imports
const express = require('express');
const { Sequelize } = require('sequelize');
const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');

// Connection database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIAL,
    port: process.env.DB_PORT,
  }
);
sequelize
  .authenticate()
  .then(() => console.log('Connexion à mariabd réussie !'))
  .catch(() => console.log('Connexion à mariabd échouée !'));

// Instantiate server
const app = express();

// Server options
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/users', usersRoutes);
app.use('/messages', messagesRoutes);

module.exports = app;
