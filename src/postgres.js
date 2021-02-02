const { Client } = require("pg");

/** Get a new connection to the postgres database */
module.exports.getPostgresClient = async () => {
  const client = new Client({
    host: "ec2-54-205-248-255.compute-1.amazonaws.com",
    database: "d7hl0lisup2p0v",
    user: "jkmhfclvxzqbva",
    password:
      "c199d8ddd8216c804673fa209c3149d84604218102ff2ecc6abf9ac1b31c4c6b",
    port: 5432,
  });
  await client.connect();
  return client;
};
