# Privacy Policy & Terms Generator — API Reference

Programmatic endpoint for generating Privacy Policy and Terms & Conditions documents. Pass the form data in, receive the full generated documents back as plain text.

---

## Base URL

| Environment | URL |
|---|---|
| Production | `https://tc-pp-generator-hk2889pca-bamabybee-4670s-projects.vercel.app` |
| Local dev | `http://localhost:3000` |

> The production URL above reflects the most recent deploy at the time of writing. After the next deploy you may want to attach a stable custom domain on Vercel and update consumers.

---

## Authentication

All requests must include an API key in the `x-api-key` header.

```
x-api-key: <secret>
```

The key is set on the server via the `GENERATOR_API_KEY` environment variable. Requests without a matching key return `401 Unauthorized`.

---

## Endpoint

### `POST /api/generate`

Generates one or both documents and returns the full text.

#### Request headers

| Header | Required | Value |
|---|---|---|
| `Content-Type` | yes | `application/json` |
| `x-api-key` | yes | The shared secret |

#### Request body

```json
{
  "data": { /* PolicyFormData — see schema below */ },
  "generate": {
    "privacyPolicy": true,
    "termsConditions": true
  }
}
```

- `data` (object, required) — All fields described in the **Input schema** below.
- `generate` (object, optional) — Which documents to produce. Both default to `true` if omitted. At least one must be `true`.

#### `data` schema (PolicyFormData)

| Field | Type | Required | Notes |
|---|---|---|---|
| `websiteUrl` | string | yes | e.g. `"https://example.com"` |
| `websiteName` | string | yes | The company / site display name |
| `country` | string | yes | e.g. `"United States"` |
| `state` | string | yes | US state name, or `""` if not applicable |
| `entityType` | `"business" \| "individual"` | yes |  |
| `personalInfoCollected` | string[] | yes | See enum below. Pass `[]` if none. |
| `usesAnalytics` | boolean | yes |  |
| `analyticsTools` | string[] | yes | See enum below. Pass `[]` if `usesAnalytics` is false. |
| `includeCCPA` | boolean | yes | Include CCPA/CPRA section |
| `includeGDPR` | boolean | yes | Include GDPR section |
| `includeCalOPPA` | boolean | yes | Include CalOPPA section |
| `contactMethodsPP` | string[] | yes | See enum below |
| `usersCanCreateAccounts` | boolean | yes | Affects T&C content |
| `usersCanUploadContent` | boolean | yes | Affects T&C content |
| `usersCanBuyGoods` | boolean | yes | Affects T&C content |
| `contentIsExclusiveProperty` | boolean | yes | Affects T&C content |
| `contactMethodsTC` | string[] | yes | See enum below |

#### Allowed enum values

`personalInfoCollected[]` — any subset of:
```
"Email address"
"First name and last name"
"Phone number"
"Address, State, Province, ZIP/Postal code, City"
"Social Media Profile information (ie. from Connect with Facebook, Sign In With Twitter)"
"Others"
```

`analyticsTools[]` — any subset of:
```
"Google Analytics"
"Facebook Analytics"
"Firebase"
"Matomo"
"Clicky"
"Statcounter"
"Flurry Analytics"
"Mixpanel"
"Unity Analytics"
```

`contactMethodsPP[]` and `contactMethodsTC[]` — any subset of:
```
"By email"
"By visiting a page on our website"
"By phone number"
"By sending post mail"
```

> Strings outside these enums will not be rejected by validation, but they may not produce templated content for that item.

#### Response — `200 OK`

```json
{
  "privacyPolicy": "Privacy Policy\n\nLast updated: ...\n\n...full text...",
  "termsConditions": "Terms and Conditions\n\nLast updated: ...\n\n...full text...",
  "generatedAt": "2026-05-06T18:42:11.123Z"
}
```

- `privacyPolicy` — full plain-text policy, or `null` if `generate.privacyPolicy === false`.
- `termsConditions` — full plain-text terms, or `null` if `generate.termsConditions === false`.
- `generatedAt` — ISO 8601 timestamp of generation.

The text uses `\n` line breaks and double-newlines between sections. It is suitable for rendering inside a `<pre>`/`whitespace-pre-wrap` block, or for converting to HTML by wrapping each paragraph.

#### Error responses

| Status | When | Body |
|---|---|---|
| `400` | Body is not JSON, missing fields, wrong types, or both `generate` flags are false | `{ "error": "<message>" }` |
| `401` | Missing or wrong `x-api-key` | `{ "error": "Unauthorized" }` |
| `405` | Wrong HTTP method | (default Next.js response) |
| `500` | Server has no `GENERATOR_API_KEY` env var configured | `{ "error": "Server misconfigured: GENERATOR_API_KEY not set" }` |

---

## CORS

The endpoint sends:

```
Access-Control-Allow-Origin: <ALLOWED_ORIGIN env var, defaults to *>
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, x-api-key
```

`OPTIONS` preflight is handled and returns `204 No Content`.

To lock down to a single origin, set `ALLOWED_ORIGIN=https://your-other-app.com` on the server.

> **Calling from a browser exposes the API key.** Only do this if the consumer is trusted, or proxy the call through your own backend so the key stays server-side.

---

## Examples

### cURL

```bash
curl -X POST https://tc-pp-generator-hk2889pca-bamabybee-4670s-projects.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: $GENERATOR_API_KEY" \
  -d '{
    "data": {
      "websiteUrl": "https://acme.example",
      "websiteName": "Acme Co",
      "country": "United States",
      "state": "California",
      "entityType": "business",
      "personalInfoCollected": ["Email address", "First name and last name"],
      "usesAnalytics": true,
      "analyticsTools": ["Google Analytics"],
      "includeCCPA": true,
      "includeGDPR": false,
      "includeCalOPPA": true,
      "contactMethodsPP": ["By email"],
      "usersCanCreateAccounts": true,
      "usersCanUploadContent": false,
      "usersCanBuyGoods": true,
      "contentIsExclusiveProperty": true,
      "contactMethodsTC": ["By email"]
    },
    "generate": { "privacyPolicy": true, "termsConditions": true }
  }'
```

### TypeScript / fetch

```ts
type PolicyFormData = {
  websiteUrl: string;
  websiteName: string;
  country: string;
  state: string;
  entityType: "business" | "individual";
  personalInfoCollected: string[];
  usesAnalytics: boolean;
  analyticsTools: string[];
  includeCCPA: boolean;
  includeGDPR: boolean;
  includeCalOPPA: boolean;
  contactMethodsPP: string[];
  usersCanCreateAccounts: boolean;
  usersCanUploadContent: boolean;
  usersCanBuyGoods: boolean;
  contentIsExclusiveProperty: boolean;
  contactMethodsTC: string[];
};

type GenerateResponse = {
  privacyPolicy: string | null;
  termsConditions: string | null;
  generatedAt: string;
};

async function generatePolicies(
  data: PolicyFormData,
  options?: { privacyPolicy?: boolean; termsConditions?: boolean }
): Promise<GenerateResponse> {
  const res = await fetch(`${process.env.GENERATOR_API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.GENERATOR_API_KEY!,
    },
    body: JSON.stringify({
      data,
      generate: {
        privacyPolicy: options?.privacyPolicy ?? true,
        termsConditions: options?.termsConditions ?? true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Generator API error (${res.status}): ${err.error ?? "unknown"}`);
  }

  return res.json();
}
```

### Python / requests

```python
import os
import requests

resp = requests.post(
    f"{os.environ['GENERATOR_API_URL']}/api/generate",
    headers={
        "Content-Type": "application/json",
        "x-api-key": os.environ["GENERATOR_API_KEY"],
    },
    json={
        "data": { ... },
        "generate": {"privacyPolicy": True, "termsConditions": True},
    },
    timeout=15,
)
resp.raise_for_status()
result = resp.json()
print(result["privacyPolicy"])
```

---

## Operational notes

- The endpoint is **stateless**. Each call regenerates from scratch — nothing is stored.
- Generation is **synchronous** and fast (single-digit ms). No webhooks, no polling.
- `generatedAt` is the only server-side timestamp; `Last updated:` inside each document is set to the same calendar day in `en-US` format.
- The endpoint runs on the Node.js runtime (`runtime = "nodejs"`). Cold starts on Vercel are typically <1s.
- Validation is shape-only. Domain-level guarantees (e.g. "this state is valid", "this URL is reachable") are the caller's responsibility.

---

## Required server env vars

| Var | Purpose |
|---|---|
| `GENERATOR_API_KEY` | Shared secret. Required for the API to function. |
| `ALLOWED_ORIGIN` | Optional. Locks CORS to a single origin. Defaults to `*`. |

Set both in Vercel project settings (Production + Preview) before deploying.
