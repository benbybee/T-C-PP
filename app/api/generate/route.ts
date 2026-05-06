import { NextRequest, NextResponse } from "next/server";
import { PolicyFormData } from "@/lib/types";
import { generatePrivacyPolicy } from "@/templates/privacy-policy";
import { generateTermsConditions } from "@/templates/terms-conditions";

export const runtime = "nodejs";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders() });
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function validateFormData(input: unknown): { ok: true; data: PolicyFormData } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "`data` must be an object" };
  }
  const d = input as Record<string, unknown>;

  const requiredStrings: (keyof PolicyFormData)[] = ["websiteUrl", "websiteName", "country", "state"];
  for (const key of requiredStrings) {
    if (typeof d[key] !== "string") {
      return { ok: false, error: `\`data.${key}\` must be a string` };
    }
  }

  if (d.entityType !== "business" && d.entityType !== "individual") {
    return { ok: false, error: "`data.entityType` must be 'business' or 'individual'" };
  }

  const requiredArrays: (keyof PolicyFormData)[] = [
    "personalInfoCollected",
    "analyticsTools",
    "contactMethodsPP",
    "contactMethodsTC",
  ];
  for (const key of requiredArrays) {
    if (!isStringArray(d[key])) {
      return { ok: false, error: `\`data.${key}\` must be an array of strings` };
    }
  }

  const requiredBooleans: (keyof PolicyFormData)[] = [
    "usesAnalytics",
    "includeCCPA",
    "includeGDPR",
    "includeCalOPPA",
    "usersCanCreateAccounts",
    "usersCanUploadContent",
    "usersCanBuyGoods",
    "contentIsExclusiveProperty",
  ];
  for (const key of requiredBooleans) {
    if (typeof d[key] !== "boolean") {
      return { ok: false, error: `\`data.${key}\` must be a boolean` };
    }
  }

  return { ok: true, data: d as unknown as PolicyFormData };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const expectedKey = process.env.GENERATOR_API_KEY;
  if (!expectedKey) {
    return jsonError("Server misconfigured: GENERATOR_API_KEY not set", 500);
  }

  const providedKey = request.headers.get("x-api-key");
  if (providedKey !== expectedKey) {
    return jsonError("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Request body must be a JSON object", 400);
  }

  const { data, generate } = body as { data?: unknown; generate?: unknown };

  const validation = validateFormData(data);
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  const gen = (generate ?? {}) as { privacyPolicy?: unknown; termsConditions?: unknown };
  const wantPP = gen.privacyPolicy !== false;
  const wantTC = gen.termsConditions !== false;

  if (!wantPP && !wantTC) {
    return jsonError("At least one of `generate.privacyPolicy` or `generate.termsConditions` must be true", 400);
  }

  const privacyPolicy = wantPP ? generatePrivacyPolicy(validation.data) : null;
  const termsConditions = wantTC ? generateTermsConditions(validation.data) : null;

  return NextResponse.json(
    {
      privacyPolicy,
      termsConditions,
      generatedAt: new Date().toISOString(),
    },
    { headers: corsHeaders() }
  );
}
