import { Sequelize } from "sequelize";
import { configuration } from "config";

const {
  dbName,
  dbUsn,
  dbPassword,
  dbHost,
  dbPort
} = configuration;

const sequelize = new Sequelize(dbName, dbUsn, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  pool: {
    max: 3,
    min: 0,
    idle: 5000,
    acquire: 10000,
    evict: 30000
  },
  define: {
    charset: "utf8mb4_unicode_ci",
    underscored: true
  },
  sync: { force: false },
  logging: console.log
});

export default sequelize;
