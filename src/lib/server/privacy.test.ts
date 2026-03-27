import { describe, it, expect } from "vitest";
import sharp from "sharp";

describe("Segurança & Privacidade: Remoção de Metadados (EXIF)", () => {
  it("deve remover metadados EXIF por padrão durante o processamento", async () => {
    // 1. Criar uma imagem real pequena com metadados
    const bufferWithMeta = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg()
      .withMetadata({ orientation: 6 }) // Metadado real de orientação
      .toBuffer();

    const metaBefore = await sharp(bufferWithMeta).metadata();
    // Verifica se os metadados foram criados (no JPEG eles são inseridos corretamente)
    expect(metaBefore.orientation).toBe(6);

    // 2. Processar a imagem SEM .withMetadata() (como fazemos no worker)
    const processedBuffer = await sharp(bufferWithMeta).webp().toBuffer();

    // 3. Verificar se o metadado SUMIU
    const metaAfter = await sharp(processedBuffer).metadata();
    expect(metaAfter.orientation).toBeUndefined(); // Metadados removidos com sucesso!
  });
});
