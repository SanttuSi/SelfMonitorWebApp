import { Pool } from "../deps.js";
let config = {};
const CONCURRENT_CONNECTIONS = 4;
if (Deno.env.get('TEST_ENVIRONMENT')) {
      config.database= new Pool({ hostname: Deno.env.get('PGHOST'),
      database: Deno.env.get('PGDATABASE'),
      user: Deno.env.get('PGDATABASE'),
      password: Deno.env.get('PGPASSWORD'),
      port: 5432 
    },CONCURRENT_CONNECTIONS);
} else {
  config.database = new Pool ({
   hostname: "some-address",
   database: "some-database",
   user: "some-database",
   password: "my-password",
   port: 5432},CONCURRENT_CONNECTIONS);
}


export { config }; 



