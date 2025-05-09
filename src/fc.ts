import sharp from "sharp";
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { writeFile } from "fs/promises";
import { FTP_HOST, FTP_PASS, FTP_PORT, FTP_USER, URL_BASE } from "./constants";
import { Client } from "basic-ftp";

export async function baixarImagem(
  nome: string,
  outputPath: string
): Promise<boolean> {
  const fullUrl = `${URL_BASE.replace(/\/$/, "")}/${nome.replace(/^\//, "")}`;
  mylog("🔗 Baixando imagem de:", fullUrl);

  try {
    const response = await axios.get(fullUrl, { responseType: "arraybuffer" });

    if (response.status !== 200) {
      const erroTexto = Buffer.from(response.data).toString("utf-8");
      console.error("❌ Erro HTTP", response.status, erroTexto);
      return false;
    }

    await writeFile(outputPath, response.data);
    mylog("✅ Imagem salva:", outputPath);
    return true;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const texto = Buffer.from(err.response?.data || []).toString("utf-8");
      console.error(`❌ Axios erro ${err.response?.status}:`, texto);
    } else {
      console.error("❌ Erro inesperado:", err);
    }
    return false;
  }
}
export async function geraImg(
  inputPath: string,
  outputPath: string,
  size: number,
  log?: string
) {
  await sharp(inputPath).resize(size).toFile(outputPath);
  mylog(`${log} : ${outputPath}`);
}

export async function imagemExiste(nome: string): Promise<boolean> {
  const fullUrl = `${URL_BASE.replace(/\/$/, "")}/${nome.replace(/^\//, "")}`;
  try {
    const response = await axios.head(fullUrl); // Faz apenas o HEAD (sem baixar o conteúdo)
    return response.status === 200;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      mylog(`🔍 Imagem não encontrada (${err.response?.status}):`, nome);
    } else {
      console.error("❌ Erro inesperado ao verificar imagem:", err);
    }
    return false;
  }
}

export async function uploadImagem(
  localPath: string,
  remotePath: string
): Promise<boolean> {
  const client = new Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
      port: FTP_PORT || 21,
      secure: true,
      secureOptions: {
        rejectUnauthorized: false,
      },
    });
    mylog("📤 Conectado ao FTP. Enviando:", remotePath);
    await client.uploadFrom(localPath, remotePath);
    mylog("✅ Upload concluído:", remotePath);
    return true;
  } catch (error) {
    console.error("❌ Erro ao enviar via FTP:", error);
    return false;
  } finally {
    client.close();
  }
}
export async function deleteImagem(localPath: string): Promise<boolean> {
  try {
    await fs.promises.unlink(localPath);
    mylog("🗑️ Imagem deletada:", localPath);
    return true;
  } catch (error) {
    console.error("❌ Erro ao deletar imagem:", error);
    return false;
  }
}

export function mylog(txt: string, txt2?: string, txt3?: string) {
  console.log(txt, txt2, txt3);
}
