import mysql from "mysql2/promise";
import {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  FOTOS_SELECT_LIMIT,
  FT_CONDITION,
} from "./constants";

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

//crie uma funcao que retorne apenas as linhas do select
// e que tenha um loop infinito, com um delay de 15 segundos entre as execucoes

export async function getData() {
  const connection = await pool.getConnection();
  const limit = FOTOS_SELECT_LIMIT;
  const condition = FT_CONDITION;
  try {
    const [rows] = await connection.query(
      `SELECT id, nome FROM fotos WHERE ${condition} order by id ASC limit ${limit} `
    );
    return rows;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
  } finally {
    connection.release();
  }
}

export async function deleteData(id: number) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(`DELETE FROM fotos WHERE id = ?`, [
      id,
    ]);
    return result;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
  } finally {
    connection.release();
  }
}

export async function updateData(id: number) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE fotos SET resize=1 WHERE id = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
  } finally {
    connection.release();
  }
}
