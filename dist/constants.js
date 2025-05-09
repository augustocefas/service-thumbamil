"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FTP_PORT = exports.FTP_PASS = exports.FTP_USER = exports.FTP_HOST = exports.IMG = exports.ROOT = exports.BUFFER_NAME = exports.FT_CONDITION = exports.FOTOS_SELECT_LIMIT = exports.DB_NAME = exports.DB_PASS = exports.DB_USER = exports.DB_HOST = exports.URL_BASE = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.URL_BASE = process.env.URL_BASE ||
    "https://server.arcadenoeunai.com.br/img/e4da3b7fbbce2345d7772b0674a318d5";
exports.DB_HOST = process.env.DB_HOST || "localhost";
exports.DB_USER = process.env.DB_USER || "root";
exports.DB_PASS = process.env.DB_PASS || "root";
exports.DB_NAME = process.env.DB_NAME || "arcadenoe_main";
exports.FOTOS_SELECT_LIMIT = parseInt(process.env.FOTOS_SELECT_LIMIT || "5");
exports.FT_CONDITION = process.env.FT_CONDITION || "year(created_at) = year(now()) and resize=0";
exports.BUFFER_NAME = process.env.BUFFER_NAME || "buffer";
// crie uma const que retorna a root
exports.ROOT = path_1.default.join(__dirname, "..");
exports.IMG = path_1.default.join(exports.ROOT, exports.BUFFER_NAME);
exports.FTP_HOST = process.env.FTP_HOST || "ftp.arcadenoeunai.com.br";
exports.FTP_USER = process.env.FTP_USER || "arcadenoe";
exports.FTP_PASS = process.env.FTP_PASS || "arcadenoe";
exports.FTP_PORT = parseInt(process.env.FTP_PORT || "21");
