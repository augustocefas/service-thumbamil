import dotenv from "dotenv";
import path from "path";
dotenv.config();

export const URL_BASE =
  process.env.URL_BASE ||
  "https://server.arcadenoeunai.com.br/img/e4da3b7fbbce2345d7772b0674a318d5";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASS = process.env.DB_PASS || "root";
export const DB_NAME = process.env.DB_NAME || "arcadenoe_main";
export const FOTOS_SELECT_LIMIT = parseInt(
  process.env.FOTOS_SELECT_LIMIT || "5"
);
export const FT_CONDITION =
  process.env.FT_CONDITION || "year(created_at) = year(now()) and resize=0";

export const BUFFER_NAME = process.env.BUFFER_NAME || "buffer";
// crie uma const que retorna a root
export const ROOT = path.join(__dirname, "..");
export const IMG = path.join(ROOT, BUFFER_NAME);

export const FTP_HOST = process.env.FTP_HOST || "ftp.arcadenoeunai.com.br";
export const FTP_USER = process.env.FTP_USER || "arcadenoe";
export const FTP_PASS = process.env.FTP_PASS || "arcadenoe";
export const FTP_PORT = parseInt(process.env.FTP_PORT || "21");
