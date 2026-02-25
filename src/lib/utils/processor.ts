import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export interface VideoStreamJobData {
  inputPath: string;
  outputDir: string; // pasta onde vai ficar o .m3u8 + segmentos
  qualities?: ("360p" | "720p" | "1080p")[];
}

const QUALITY_PRESETS = {
  "360p": {
    width: 640,
    height: 360,
    videoBitrate: "400k",
    audioBitrate: "64k",
  },
  "720p": {
    width: 1280,
    height: 720,
    videoBitrate: "2500k",
    audioBitrate: "128k",
  },
  "1080p": {
    width: 1920,
    height: 1080,
    videoBitrate: "5000k",
    audioBitrate: "192k",
  },
};

const generateMasterPlaylist = (qualities: string[]): string => {
  const bandwidths: Record<string, number> = {
    "360p": 500000,
    "720p": 2800000,
    "1080p": 5200000,
  };
  const resolutions: Record<string, string> = {
    "360p": "640x360",
    "720p": "1280x720",
    "1080p": "1920x1080",
  };

  const entries = qualities
    .map(
      (q) =>
        `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidths[q]},RESOLUTION=${resolutions[q]}\n${q}/playlist.m3u8`,
    )
    .join("\n");

  return `#EXTM3U\n#EXT-X-VERSION:3\n${entries}\n`;
};

const generateHLSQuality = (
  inputPath: string,
  outputDir: string,
  quality: keyof typeof QUALITY_PRESETS,
): Promise<void> => {
  const { width, height, videoBitrate, audioBitrate } =
    QUALITY_PRESETS[quality];
  const qualityDir = path.join(outputDir, quality);
  fs.mkdirSync(qualityDir, { recursive: true });

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      // Codec H.264 — máxima compatibilidade
      .videoCodec("libx264")
      .audioCodec("aac")

      // Redimensiona mantendo aspect ratio
      .videoFilters(
        `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
      )

      .videoBitrate(videoBitrate)
      .audioBitrate(audioBitrate)

      .outputOptions([
        "-preset fast", // velocidade de encoding (ultrafast/fast/slow)
        "-crf 23", // qualidade (18=ótimo, 23=padrão, 28=menor arquivo)
        "-sc_threshold 0",
        "-g 48", // keyframe a cada 2s (48 frames @ 24fps)
        "-hls_time 6", // duração de cada segmento em segundos
        "-hls_list_size 0", // mantém todos os segmentos na playlist
        "-hls_segment_type mpegts",
        `-hls_segment_filename ${qualityDir}/seg_%03d.ts`,
        "-f hls",
      ])
      .on("progress", (p) => {
        process.stdout.write(`\r🔄 ${quality}: ${Math.round(p.percent ?? 0)}%`);
      })
      .on("end", () => {
        console.log(`\n✅ ${quality} concluído`);
        resolve();
      })
      .on("error", reject)
      .save(path.join(qualityDir, "playlist.m3u8"));
  });
};

const convertToHLS = async (data: VideoStreamJobData): Promise<string> => {
  const { inputPath, outputDir, qualities = ["360p", "720p"] } = data;

  fs.mkdirSync(outputDir, { recursive: true });

  // Gera cada qualidade em paralelo
  await Promise.all(
    qualities.map((q) => generateHLSQuality(inputPath, outputDir, q)),
  );

  // Cria a master playlist (lista todas as qualidades)
  const masterPlaylist = generateMasterPlaylist(qualities);
  const masterPath = path.join(outputDir, "master.m3u8");
  fs.writeFileSync(masterPath, masterPlaylist);

  console.log(`✅ HLS gerado em: ${masterPath}`);
  return masterPath;
};

/**
 * Extrai uma thumbnail de um vídeo em um timestamp específico.
 */
const extractThumbnail = (
  inputPath: string,
  outputPath: string,
  timestamp = "00:00:01",
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: "640x360",
      })
      .on("end", () => resolve())
      .on("error", (err) => {
        console.error("Erro ao extrair thumbnail:", err);
        reject(err);
      });
  });
};

export { convertToHLS, generateHLSQuality, generateMasterPlaylist, extractThumbnail };
