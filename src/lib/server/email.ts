import { Resend } from "resend";
import nodemailer from "nodemailer";
import { baseLogger } from "./logger";

// Suporte para CLI e Runtime SvelteKit
const getEnv = (key: string) => {
  if (typeof process !== "undefined" && process.env[key])
    return process.env[key];
  return ""; // Em runtime SvelteKit, usaremos as envs dinâmicas se necessário, mas para CLI process.env basta.
};

const isProd = getEnv("NODE_ENV") === "production";
const resendKey = getEnv("RESEND_API_KEY");

// Configuração do Transportador SMTP (Mailpit)
const transporter = nodemailer.createTransport({
  host: getEnv("MAIL_HOST") || "mailpit",
  port: Number(getEnv("MAIL_PORT")) || 1025,
  secure: false,
});

// Resend só é inicializado se houver chave (evita erro em dev)
const resend = resendKey ? new Resend(resendKey) : null;

export const sendVerificationEmail = async (to: string, url: string) => {
  const emailOptions = {
    from: "Buero <no-reply@buero.fun>",
    to: to,
    subject: "Verifique seu e-mail",
    html: `
            <div style="font-family: sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; border-radius: 10px;">
                <h1 style="color: #a3ff00;">Buero</h1>
                <p>Confirme seu e-mail para ativar sua conta:</p>
                <a href="${url}" style="display: inline-block; background: #a3ff00; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Verificar E-mail</a>
                <p style="margin-top: 30px; font-size: 0.8rem; color: #888;">Se você não solicitou isso, ignore este e-mail.</p>
            </div>
        `,
  };

  try {
    if (isProd && resend) {
      const { data, error } = await resend.emails.send({
        ...emailOptions,
        to: [to],
      });
      if (error) {
        baseLogger.error({ error }, "Falha ao enviar e-mail via Resend");
        return { success: false, error };
      }
      return { success: true, data };
    }

    // Fallback para SMTP (Mailpit em Dev ou se Resend falhar/não configurado)
    const info = await transporter.sendMail(emailOptions);
    baseLogger.info({ messageId: info.messageId }, "E-mail enviado via SMTP");
    return { success: true, data: info };
  } catch (e) {
    baseLogger.error({ err: e }, "Erro inesperado no envio de e-mail");
    return { success: false, error: e };
  }
};
