import path from "path";
import { BUFFER_NAME, IMG, ROOT } from "./constants";
import { deleteData, getData, updateData } from "./db";
import { baixarImagem, geraImg, imagemExiste, mylog, uploadImagem } from "./fc";
import { mkdir } from "fs/promises";

const outputDir = path.join(__dirname, BUFFER_NAME);

async function main() {
  while (true) {
    const rows = await getData();

    if (!Array.isArray(rows)) {
      mylog("Erro: getData() não retornou um array.");
      break;
    }

    if (rows.length === 0) {
      mylog("Nenhum dado encontrado. Encerrando loop.");
      break;
    }

    for (const row of rows as { id: number; nome: string }[]) {
      if (row.id > 0) {
        const outputPath = path.join(IMG, `_${row.nome}`);
        if (await imagemExiste(row.nome)) {
          const sucesso = await baixarImagem(row.nome, outputPath);
          if (sucesso) {
            mylog("Imagem baixada com sucesso:", row.nome);
            await geraImg(
              outputPath,
              path.join(IMG, "thumb", `thumb_${row.nome}`),
              250,
              "thumb gerada com sucesso"
            );
            await geraImg(
              outputPath,
              path.join(IMG, "cover", `cover_${row.nome}`),
              600,
              "cover gerada com sucesso"
            );
            await updateData(row.id);
          }
        } else {
          await deleteData(row.id);
          mylog("Imagem não encontrada:", row.nome);
        }
      }
    }

    if (rows.length < 5) {
      mylog("Menos de 5 notificações. Finalizando loop.");
      break;
    }
  }
}

async function startLoop() {
  await mkdir(outputDir, { recursive: true });
  while (true) {
    await main();
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
}

async function onlyOne() {
  await mkdir(outputDir, { recursive: true });
  const rows = await getData();
  if (!Array.isArray(rows) || rows.length === 0) {
    mylog("Nenhum dado encontrado.");
    return;
  }
  const row = rows[1] as { id: number; nome: string };
  if (row.id > 0) {
    const outputPath = path.join(IMG, `_${row.nome}`);
    if (await imagemExiste(row.nome)) {
      await baixarImagem(row.nome, outputPath);
      mylog("Imagem baixada com sucesso:", row.nome);
      await geraImg(
        outputPath,
        path.join(IMG, "thumb", `thumb_${row.nome}`),
        250,
        "thumb gerada com sucesso"
      );
      await uploadImagem(
        path.join(IMG, "thumb", `thumb_${row.nome}`),
        `thumb_${row.nome}`
      );
      await updateData(row.id);
    } else {
      await deleteData(row.id);
      mylog("Imagem não encontrada:", row.nome);
    }
  }
}
//onlyOne();
//startLoop();

//https://server.arcadenoeunai.com.br/img/e4da3b7fbbce2345d7772b0674a318d5/680e7c3ec9dc81745779774.jpg

export const ftpUpload = async () => {
  try {
    const destino = "123.png";

    const origen = path.join(IMG, "thumb", `thumb_${destino}`);
    await uploadImagem(origen, destino);
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
  }
};
ftpUpload();
