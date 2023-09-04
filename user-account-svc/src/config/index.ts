import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config();
moment.tz.setDefault("UTC");

const {
  PORT,
  ENV,
  DB_HOST,
  DB_PORT,
  DB_USN,
  DB_PASSWORD,
  DB_NAME
} = process.env;

if (ENV === "production") {
  console.log = () : void => {
  };
  console.debug = () : void => {
  };
}

export const configuration = {
  port : PORT,
  env : ENV,
  dbHost : DB_HOST,
  dbPort : parseInt(DB_PORT),
  dbUsn : DB_USN,
  dbPassword : DB_PASSWORD,
  dbName : DB_NAME
};

