import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { s3Client, bucketName } from "$lib/server/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "$lib/prisma";
import { S3_ENDPOINT } from "$env/static/private";

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) redirect(302, "/login");

  return {
    user: {
      id: locals.user.id,
      name: locals.user.name,
    },
  };
};

export const actions: Actions = {
  upload: async ({ locals, request }) => {
    if (!locals.user) redirect(302, "/login");

    const formData = await request.formData();
    const comment = formData.get("comment")?.toString();
    const media = formData.get("media");

    if (!(media instanceof File)) {
      return fail(400, { message: "Arquivo inválido" });
    }

    // Validações Básicas
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (media.size > MAX_SIZE)
      return fail(400, { message: "Arquivo muito grande (Máx 10MB)" });

    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
    ];
    if (!ALLOWED_TYPES.includes(media.type))
      return fail(400, { message: "Formato não suportado" });

    try {
      // 1. Preparar o arquivo
      const buffer = Buffer.from(await media.arrayBuffer());
      const fileExtension = media.name.split(".").pop();
      const fileKey = `uploads/${locals.user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

      // 2. Upload para S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: buffer,
          ContentType: media.type,
        }),
      );

      // 3. Gerar URL (Construída manualmente para compatibilidade MinIO/Magalu)
      const mediaUrl = `${S3_ENDPOINT}/${bucketName}/${fileKey}`;

      // 4. Salvar no Prisma
      await prisma.post.create({
        data: {
          userId: locals.user.id,
          comment: comment || "",
          mediaUrl: mediaUrl,
          mediaType: media.type.startsWith("video") ? "video" : "image",
          status: "pending", // Vital: vai para auditoria
        },
      });

      return { success: true };
    } catch (e) {
      console.error("Erro no upload:", e);
      return fail(500, { message: "Erro interno ao processar upload" });
    }
  },
};
