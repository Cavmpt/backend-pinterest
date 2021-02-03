const { Client } = require("pg");

/** Get a new connection to the postgres database */
module.exports.getPostgresClient = async () => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password:process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });
  await client.connect();
  return client;
};
