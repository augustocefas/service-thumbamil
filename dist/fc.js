"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baixarImagem = baixarImagem;
exports.geraImg = geraImg;
exports.imagemExiste = imagemExiste;
exports.uploadImagem = uploadImagem;
exports.mylog = mylog;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const promises_1 = require("fs/promises");
const constants_1 = require("./constants");
const basic_ftp_1 = require("basic-ftp");
async function baixarImagem(nome, outputPath) {
    const fullUrl = `${constants_1.URL_BASE.replace(/\/$/, "")}/${nome.replace(/^\//, "")}`;
    mylog("🔗 Baixando imagem de:", fullUrl);
    try {
        const response = await axios_1.default.get(fullUrl, { responseType: "arraybuffer" });
        if (response.status !== 200) {
            const erroTexto = Buffer.from(response.data).toString("utf-8");
            console.error("❌ Erro HTTP", response.status, erroTexto);
            return false;
        }
        await (0, promises_1.writeFile)(outputPath, response.data);
        mylog("✅ Imagem salva:", outputPath);
        return true;
    }
    catch (err) {
        if (axios_1.default.isAxiosError(err)) {
            const texto = Buffer.from(err.response?.data || []).toString("utf-8");
            console.error(`❌ Axios erro ${err.response?.status}:`, texto);
        }
        else {
            console.error("❌ Erro inesperado:", err);
        }
        return false;
    }
}
async function geraImg(inputPath, outputPath, size, log) {
    await (0, sharp_1.default)(inputPath).resize(size).toFile(outputPath);
    mylog(`${log} : ${outputPath}`);
}
async function imagemExiste(nome) {
    const fullUrl = `${constants_1.URL_BASE.replace(/\/$/, "")}/${nome.replace(/^\//, "")}`;
    try {
        const response = await axios_1.default.head(fullUrl); // Faz apenas o HEAD (sem baixar o conteúdo)
        return response.status === 200;
    }
    catch (err) {
        if (axios_1.default.isAxiosError(err)) {
            mylog(`🔍 Imagem não encontrada (${err.response?.status}):`, nome);
        }
        else {
            console.error("❌ Erro inesperado ao verificar imagem:", err);
        }
        return false;
    }
}
async function uploadImagem(localPath, remotePath) {
    const client = new basic_ftp_1.Client();
    client.ftp.verbose = false;
    try {
        await client.access({
            host: constants_1.FTP_HOST,
            user: constants_1.FTP_USER,
            password: constants_1.FTP_PASS,
            port: constants_1.FTP_PORT || 21,
            secure: true,
            secureOptions: {
                rejectUnauthorized: false,
            },
        });
        mylog("📤 Conectado ao FTP. Enviando:", remotePath);
        await client.uploadFrom(localPath, remotePath);
        mylog("✅ Upload concluído:", remotePath);
        return true;
    }
    catch (error) {
        console.error("❌ Erro ao enviar via FTP:", error);
        return false;
    }
    finally {
        client.close();
    }
}
function mylog(txt, txt2, txt3) {
    console.log(txt, txt2, txt3);
}
