import { config } from "../config/config.js";


const executeQuery = async(query, ...args) => {
  const client = await config.database.connect();
  try {
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
  return null;
}

export { executeQuery };