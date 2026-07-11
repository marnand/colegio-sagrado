import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  EMAIL: {
    send(message: {
      to: string;
      from: string;
      subject: string;
      text: string;
    }): Promise<{ messageId: string }>;
  };
}

interface ContactBody {
  nome?: string;
  telefone?: string;
  email?: string;
  segmento?: string;
  mensagem?: string;
  _hp?: string;
}

const ALLOWED_SEGMENTS = [
  "Educação Infantil (2–5 anos)",
  "Ensino Fundamental I (6–10 anos)",
  "Ensino Fundamental II (11–14 anos)",
  "Ainda não sei",
] as const;

const DESTINATION_EMAIL = "colegio.cscj@gmail.com";
const RATE_LIMIT_MAX = 5;

// Simple in-memory rate limiter. For a more robust solution across multiple
// Worker instances, replace this with Cloudflare KV in production.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIP(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const windowStart = Math.floor(now / (60 * 60 * 1000)) * 60 * 60 * 1000;
  const key = `${ip}:${windowStart}`;
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, resetAt: windowStart + 60 * 60 * 1000 });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS preflight support for local dev / future use
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const ip = getClientIP(request);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: "Muitas tentativas. Aguarde." },
      429,
    );
  }

  let body: ContactBody;
  try {
    body = await request.json<ContactBody>();
  } catch {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400);
  }

  const { nome, telefone, email, segmento, mensagem, _hp } = body;

  // Honeypot
  if (_hp && _hp.trim() !== "") {
    return jsonResponse({ error: "Requisição rejeitada." }, 400);
  }

  // Validate nome
  const nomeTrimmed = (nome || "").trim();
  if (!nomeTrimmed) {
    return jsonResponse(
      { error: "Por favor, informe seu nome completo.", field: "nome" },
      400,
    );
  }
  if (nomeTrimmed.length < 2) {
    return jsonResponse(
      { error: "O nome deve ter pelo menos 2 caracteres.", field: "nome" },
      400,
    );
  }

  // Validate telefone
  const telefoneTrimmed = (telefone || "").trim();
  if (!telefoneTrimmed) {
    return jsonResponse(
      { error: "Por favor, informe seu telefone.", field: "telefone" },
      400,
    );
  }
  const telefoneDigits = telefoneTrimmed.replace(/\D/g, "");
  if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
    return jsonResponse(
      {
        error: "Por favor, informe um telefone válido com DDD.",
        field: "telefone",
      },
      400,
    );
  }

  // Validate segmento
  const segmentoTrimmed = (segmento || "").trim();
  if (!segmentoTrimmed) {
    return jsonResponse(
      {
        error: "Por favor, selecione um segmento de interesse.",
        field: "segmento",
      },
      400,
    );
  }
  if (
    !(ALLOWED_SEGMENTS as readonly string[]).includes(segmentoTrimmed)
  ) {
    return jsonResponse(
      { error: "Segmento de interesse inválido.", field: "segmento" },
      400,
    );
  }

  // Validate email (optional)
  const emailTrimmed = (email || "").trim();
  if (emailTrimmed && !emailTrimmed.includes("@")) {
    return jsonResponse(
      { error: "Por favor, informe um e-mail válido.", field: "email" },
      400,
    );
  }

  const mensagemTrimmed = (mensagem || "").trim();
  const timestamp = new Date().toISOString();

  const hostname = new URL(request.url).hostname;
  const fromEmail = `formulario@${hostname}`;

  const emailBody =
    `Novo agendamento de visita recebido pelo site CSCJ:\n\n` +
    `Nome:      ${nomeTrimmed}\n` +
    `Telefone:  ${telefoneTrimmed}\n` +
    `Email:     ${emailTrimmed || "não informado"}\n` +
    `Segmento:  ${segmentoTrimmed}\n` +
    `Mensagem:  ${mensagemTrimmed || "não informada"}\n\n` +
    `Data/Hora: ${timestamp}\n` +
    `IP:        ${ip}`;

  try {
    await env.EMAIL.send({
      to: DESTINATION_EMAIL,
      from: fromEmail,
      subject: `Novo contato via site — ${nomeTrimmed}`,
      text: emailBody,
    });
  } catch (err) {
    const errorCode = (err as { code?: string }).code;
    console.error("Email send failed:", errorCode, (err as Error).message);
    return jsonResponse(
      { error: "Erro ao enviar. Tente novamente." },
      500,
    );
  }

  return jsonResponse({ success: true }, 200);
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
