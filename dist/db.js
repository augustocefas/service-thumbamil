"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.getData = getData;
exports.deleteData = deleteData;
exports.updateData = updateData;
const promise_1 = __importDefault(require("mysql2/promise"));
const constants_1 = require("./constants");
exports.pool = promise_1.default.createPool({
    host: constants_1.DB_HOST,
    user: constants_1.DB_USER,
    password: constants_1.DB_PASS,
    database: constants_1.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});
//crie uma funcao que retorne apenas as linhas do select
// e que tenha um loop infinito, com um delay de 15 segundos entre as execucoes
async function getData() {
    const connection = await exports.pool.getConnection();
    const limit = constants_1.FOTOS_SELECT_LIMIT;
    const condition = constants_1.FT_CONDITION;
    try {
        const [rows] = await connection.query(`SELECT id, nome FROM fotos WHERE ${condition} order by id ASC limit ${limit} `);
        return rows;
    }
    catch (error) {
        console.error("Erro ao executar a consulta:", error);
    }
    finally {
        connection.release();
    }
}
async function deleteData(id) {
    const connection = await exports.pool.getConnection();
    try {
        const [result] = await connection.query(`DELETE FROM fotos WHERE id = ?`, [
            id,
        ]);
        return result;
    }
    catch (error) {
        console.error("Erro ao executar a consulta:", error);
    }
    finally {
        connection.release();
    }
}
async function updateData(id) {
    const connection = await exports.pool.getConnection();
    try {
        const [result] = await connection.query(`UPDATE fotos SET resize=1 WHERE id = ?`, [id]);
        return result;
    }
    catch (error) {
        console.error("Erro ao executar a consulta:", error);
    }
    finally {
        connection.release();
    }
}
