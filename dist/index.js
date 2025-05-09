"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ftpUpload = void 0;
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const db_1 = require("./db");
const fc_1 = require("./fc");
const promises_1 = require("fs/promises");
const outputDir = path_1.default.join(__dirname, constants_1.BUFFER_NAME);
async function main() {
    while (true) {
        const rows = await (0, db_1.getData)();
        if (!Array.isArray(rows)) {
            (0, fc_1.mylog)("Erro: getData() não retornou um array.");
            break;
        }
        if (rows.length === 0) {
            (0, fc_1.mylog)("Nenhum dado encontrado. Encerrando loop.");
            break;
        }
        for (const row of rows) {
            if (row.id > 0) {
                const outputPath = path_1.default.join(constants_1.IMG, `_${row.nome}`);
                if (await (0, fc_1.imagemExiste)(row.nome)) {
                    const sucesso = await (0, fc_1.baixarImagem)(row.nome, outputPath);
                    if (sucesso) {
                        (0, fc_1.mylog)("Imagem baixada com sucesso:", row.nome);
                        await (0, fc_1.geraImg)(outputPath, path_1.default.join(constants_1.IMG, "thumb", `thumb_${row.nome}`), 250, "thumb gerada com sucesso");
                        await (0, fc_1.geraImg)(outputPath, path_1.default.join(constants_1.IMG, "cover", `cover_${row.nome}`), 600, "cover gerada com sucesso");
                        await (0, db_1.updateData)(row.id);
                    }
                }
                else {
                    await (0, db_1.deleteData)(row.id);
                    (0, fc_1.mylog)("Imagem não encontrada:", row.nome);
                }
            }
        }
        if (rows.length < 5) {
            (0, fc_1.mylog)("Menos de 5 notificações. Finalizando loop.");
            break;
        }
    }
}
async function startLoop() {
    await (0, promises_1.mkdir)(outputDir, { recursive: true });
    while (true) {
        await main();
        await new Promise((resolve) => setTimeout(resolve, 15000));
    }
}
async function onlyOne() {
    await (0, promises_1.mkdir)(outputDir, { recursive: true });
    const rows = await (0, db_1.getData)();
    if (!Array.isArray(rows) || rows.length === 0) {
        (0, fc_1.mylog)("Nenhum dado encontrado.");
        return;
    }
    const row = rows[1];
    if (row.id > 0) {
        const outputPath = path_1.default.join(constants_1.IMG, `_${row.nome}`);
        if (await (0, fc_1.imagemExiste)(row.nome)) {
            await (0, fc_1.baixarImagem)(row.nome, outputPath);
            (0, fc_1.mylog)("Imagem baixada com sucesso:", row.nome);
            await (0, fc_1.geraImg)(outputPath, path_1.default.join(constants_1.IMG, "thumb", `thumb_${row.nome}`), 250, "thumb gerada com sucesso");
            await (0, fc_1.uploadImagem)(path_1.default.join(constants_1.IMG, "thumb", `thumb_${row.nome}`), `thumb_${row.nome}`);
            await (0, db_1.updateData)(row.id);
        }
        else {
            await (0, db_1.deleteData)(row.id);
            (0, fc_1.mylog)("Imagem não encontrada:", row.nome);
        }
    }
}
//onlyOne();
//startLoop();
//https://server.arcadenoeunai.com.br/img/e4da3b7fbbce2345d7772b0674a318d5/680e7c3ec9dc81745779774.jpg
const ftpUpload = async () => {
    try {
        const destino = "123.png";
        const origen = path_1.default.join(constants_1.IMG, "thumb", `thumb_${destino}`);
        await (0, fc_1.uploadImagem)(origen, destino);
    }
    catch (error) {
        console.error("Erro ao fazer upload:", error);
    }
};
exports.ftpUpload = ftpUpload;
(0, exports.ftpUpload)();
