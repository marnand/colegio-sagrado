/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher;
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  NOTIFICATION_EMAIL: string;
  SITE_ORIGIN: string;
}

interface ContactBody {
  nome?: string;
  telefone?: string;
  email?: string;
  segmento?: string;
  mensagem?: string;
  _hp?: string;
}

interface ResendPayload {
  from: string;
  to: string;
  subject: string;
  text: string;
}

interface ResendSuccess {
  ok: true;
  id: string;
}

interface ResendFailure {
  ok: false;
  status: number;
}

type ResendResult = ResendSuccess | ResendFailure;

const ALLOWED_SEGMENTS = [
  "Educação Infantil (2–5 anos)",
  "Ensino Fundamental I (6–10 anos)",
  "Ensino Fundamental II (11–14 anos)",
  "Ainda não sei",
] as const;

const RATE_LIMIT_MAX = 5;
const MAX_BODY_SIZE = 16 * 1024;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIP(request: Request): string {
  return request.headers.get("CF-Connecting-IP") || "shared";
}

function checkRateLimit(ip: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const windowStart = Math.floor(now / (60 * 60 * 1000)) * 60 * 60 * 1000;
  const key = `${ip}:${windowStart}`;

  for (const [k, v] of rateLimitMap) {
    if (v.resetAt <= now) rateLimitMap.delete(k);
  }

  if (rateLimitMap.size >= 10000) {
    return { allowed: false };
  }

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

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return headers;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string | null = null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

function corsPreflight(origin: string | null): Response {
  if (!origin) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    },
  });
}

async function sendViaResend(
  env: Env,
  payload: ResendPayload,
): Promise<ResendResult> {
  if (!env.RESEND_API_KEY) {
    return { ok: false, status: 0 };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("Resend API error:", response.status);
      return { ok: false, status: response.status };
    }

    const data = (await response.json()) as { id: string };
    return { ok: true, id: data.id };
  } catch {
    console.error("Resend request failed");
    return { ok: false, status: 0 };
  }
}

async function handleContact(
  request: Request,
  env: Env,
): Promise<Response> {
  const origin =
    request.headers.get("Origin") === env.SITE_ORIGIN
      ? env.SITE_ORIGIN
      : null;

  if (request.method === "OPTIONS") return corsPreflight(origin);
  if (request.method !== "POST") {
    const headers: Record<string, string> = { Allow: "POST, OPTIONS" };
    if (origin) headers["Access-Control-Allow-Origin"] = origin;
    return new Response("Method Not Allowed", { status: 405, headers });
  }

  const ct = request.headers.get("Content-Type") || "";
  const isJson =
    ct === "application/json" || /^application\/.+\+json$/.test(ct);
  if (!isJson) {
    return jsonResponse(
      { error: "Tipo de conteúdo não suportado." },
      415,
      origin,
    );
  }

  const cl = request.headers.get("Content-Length");
  if (cl && parseInt(cl, 10) > MAX_BODY_SIZE) {
    return jsonResponse(
      { error: "Requisição muito grande." },
      413,
      origin,
    );
  }

  const ip = getClientIP(request);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: "Muitas tentativas. Aguarde." },
      429,
      origin,
    );
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400, origin);
  }

  const { nome, telefone, email, segmento, mensagem, _hp } = body;

  if (_hp && _hp.trim() !== "") {
    return jsonResponse({ error: "Requisição rejeitada." }, 400, origin);
  }

  const nomeTrimmed = (nome || "").trim();
  if (!nomeTrimmed) {
    return jsonResponse(
      { error: "Por favor, informe seu nome completo.", field: "nome" },
      400,
      origin,
    );
  }
  if (nomeTrimmed.length < 2) {
    return jsonResponse(
      { error: "O nome deve ter pelo menos 2 caracteres.", field: "nome" },
      400,
      origin,
    );
  }
  if (nomeTrimmed.length > 200) {
    return jsonResponse(
      { error: "Nome muito longo.", field: "nome" },
      400,
      origin,
    );
  }

  const telefoneTrimmed = (telefone || "").trim();
  if (!telefoneTrimmed) {
    return jsonResponse(
      { error: "Por favor, informe seu telefone.", field: "telefone" },
      400,
      origin,
    );
  }
  if (telefoneTrimmed.length > 20) {
    return jsonResponse(
      { error: "Telefone muito longo.", field: "telefone" },
      400,
      origin,
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
      origin,
    );
  }

  const segmentoTrimmed = (segmento || "").trim();
  if (!segmentoTrimmed) {
    return jsonResponse(
      {
        error: "Por favor, selecione um segmento de interesse.",
        field: "segmento",
      },
      400,
      origin,
    );
  }
  if (segmentoTrimmed.length > 80) {
    return jsonResponse(
      { error: "Segmento muito longo.", field: "segmento" },
      400,
      origin,
    );
  }
  if (!(ALLOWED_SEGMENTS as readonly string[]).includes(segmentoTrimmed)) {
    return jsonResponse(
      { error: "Segmento de interesse inválido.", field: "segmento" },
      400,
      origin,
    );
  }

  const emailTrimmed = (email || "").trim();
  if (emailTrimmed && !emailTrimmed.includes("@")) {
    return jsonResponse(
      { error: "Por favor, informe um e-mail válido.", field: "email" },
      400,
      origin,
    );
  }
  if (emailTrimmed.length > 320) {
    return jsonResponse(
      { error: "Email muito longo.", field: "email" },
      400,
      origin,
    );
  }

  const mensagemTrimmed = (mensagem || "").trim();
  if (mensagemTrimmed.length > 2000) {
    return jsonResponse(
      { error: "Mensagem muito longa.", field: "mensagem" },
      400,
      origin,
    );
  }

  const timestamp = new Date().toISOString();

  const emailBody =
    `Novo agendamento de visita recebido pelo site CSCJ:\n\n` +
    `Nome:      ${nomeTrimmed}\n` +
    `Telefone:  ${telefoneTrimmed}\n` +
    `Email:     ${emailTrimmed || "não informado"}\n` +
    `Segmento:  ${segmentoTrimmed}\n` +
    `Mensagem:  ${mensagemTrimmed || "não informada"}\n\n` +
    `Data/Hora: ${timestamp}\n`;

  const sendResult = await sendViaResend(env, {
    from: env.FROM_EMAIL,
    to: env.NOTIFICATION_EMAIL,
    subject: `Novo contato via site — ${nomeTrimmed}`,
    text: emailBody,
  });

  if (!sendResult.ok) {
    return jsonResponse(
      { error: "Erro ao enviar. Tente novamente." },
      500,
      origin,
    );
  }

  return jsonResponse({ success: true }, 200, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/contact") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
