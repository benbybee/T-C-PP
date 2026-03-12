# Privacy Policy & T&C Generator — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page Next.js app that generates Privacy Policy and Terms & Conditions documents from form inputs, with copy-to-clipboard output.

**Architecture:** Single client-side page. Form collects all inputs, generator functions interpolate values into template strings, results render in textareas. No API routes, no database.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`

**Step 1: Initialize Next.js with Tailwind**

Run:
```bash
cd "c:/Users/Ben Bybee/Desktop/Cursor/T&C PP"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Accept defaults. This scaffolds the full project.

**Step 2: Verify the dev server starts**

Run: `npm run dev`
Expected: App runs at http://localhost:3000 with the default Next.js page.

**Step 3: Clean up boilerplate**

Remove default content from `app/page.tsx` — replace with a simple heading:

```tsx
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold">Privacy Policy & Terms Generator</h1>
    </main>
  );
}
```

Strip `app/globals.css` down to just the Tailwind directives:

```css
@import "tailwindcss";
```

**Step 4: Verify clean scaffold**

Run: `npm run dev`
Expected: Page shows "Privacy Policy & Terms Generator" heading, no errors.

**Step 5: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js project with Tailwind"
```

---

### Task 2: Define Shared Types

**Files:**
- Create: `lib/types.ts`

**Step 1: Create the FormData interface**

```ts
export interface PolicyFormData {
  // Shared fields
  websiteUrl: string;
  websiteName: string;
  country: string;
  state: string;
  entityType: "business" | "individual";

  // Privacy Policy fields
  personalInfoCollected: string[];
  usesAnalytics: boolean;
  analyticsTools: string[];
  includeCCPA: boolean;
  includeGDPR: boolean;
  includeCalOPPA: boolean;
  contactMethodsPP: string[];

  // Terms & Conditions fields
  usersCanCreateAccounts: boolean;
  usersCanUploadContent: boolean;
  usersCanBuyGoods: boolean;
  contentIsExclusiveProperty: boolean;
  contactMethodsTC: string[];
}

export const PERSONAL_INFO_OPTIONS = [
  "Email address",
  "First name and last name",
  "Phone number",
  "Address, State, Province, ZIP/Postal code, City",
  "Social Media Profile information (ie. from Connect with Facebook, Sign In With Twitter)",
  "Others",
] as const;

export const ANALYTICS_TOOLS_OPTIONS = [
  "Google Analytics",
  "Facebook Analytics",
  "Firebase",
  "Matomo",
  "Clicky",
  "Statcounter",
  "Flurry Analytics",
  "Mixpanel",
  "Unity Analytics",
] as const;

export const CONTACT_METHODS_OPTIONS = [
  "By email",
  "By visiting a page on our website",
  "By phone number",
  "By sending post mail",
] as const;

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
] as const;
```

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add shared types and form option constants"
```

---

### Task 3: Build the Privacy Policy Template

**Files:**
- Create: `templates/privacy-policy.ts`

**Step 1: Create the generator function**

This is a large file. The function takes `PolicyFormData` and returns a plain text string. Use the full Privacy Policy example text from the user's message as the template. Key patterns:

- Replace `[wpautoterms site_name]` with `data.websiteName`
- Replace `[wpautoterms site_url]` with `data.websiteUrl`
- Replace `[wpautoterms last_updated_date]` with `new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })`
- Replace country/state references with `data.country` / `data.state`
- Wrap GDPR section in `if (data.includeGDPR) { ... }`
- Wrap CCPA/CPRA section in `if (data.includeCCPA) { ... }`
- Wrap CalOPPA section in `if (data.includeCalOPPA) { ... }`
- Build personal info bullet list from `data.personalInfoCollected` array
- Build analytics section from `data.analyticsTools` array — include a paragraph block per selected tool (Google Analytics, Facebook Analytics, etc.)
- Build contact methods list from `data.contactMethodsPP` array
- Use entity type to adjust wording (business vs individual)

```ts
import { PolicyFormData } from "@/lib/types";

export function generatePrivacyPolicy(data: PolicyFormData): string {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const personalInfoList = data.personalInfoCollected
    .map((item) => `- ${item}`)
    .join("\n");

  // ... build each conditional section as a string variable
  // ... concatenate all sections into the final document

  return [
    header,
    interpretationSection,
    definitionsSection,
    collectingDataSection,
    // ... etc
    data.includeGDPR ? gdprSection : "",
    data.includeCCPA ? ccpaSection : "",
    data.includeCalOPPA ? calOppaSection : "",
    childrenSection,
    linksSection,
    changesSection,
    contactSection,
  ]
    .filter(Boolean)
    .join("\n\n");
}
```

The full template text is extremely long (the user's Privacy Policy example is ~800 lines). Transcribe the entire example into template literals, replacing placeholders with interpolated values.

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Smoke test with a quick script (optional)**

Create a temporary test:
```bash
npx tsx -e "
import { generatePrivacyPolicy } from './templates/privacy-policy';
const result = generatePrivacyPolicy({
  websiteUrl: 'https://example.com',
  websiteName: 'Test Site',
  country: 'United States',
  state: 'California',
  entityType: 'individual',
  personalInfoCollected: ['Email address', 'First name and last name'],
  usesAnalytics: true,
  analyticsTools: ['Google Analytics'],
  includeCCPA: true,
  includeGDPR: true,
  includeCalOPPA: true,
  contactMethodsPP: ['By email'],
  usersCanCreateAccounts: false,
  usersCanUploadContent: false,
  usersCanBuyGoods: false,
  contentIsExclusiveProperty: false,
  contactMethodsTC: [],
});
console.log(result.substring(0, 200));
"
```

Expected: First 200 chars of the generated privacy policy printed.

**Step 4: Commit**

```bash
git add templates/privacy-policy.ts
git commit -m "feat: add privacy policy template generator"
```

---

### Task 4: Build the Terms & Conditions Template

**Files:**
- Create: `templates/terms-conditions.ts`

**Step 1: Create the generator function**

Same pattern as Task 3 but with the T&C example text. Key conditionals:

- `if (data.usersCanCreateAccounts)` → include "User Accounts" section
- `if (data.usersCanUploadContent)` → include "Content" / "User-Generated Content" section
- `if (data.usersCanBuyGoods)` → include "Purchases" / "Payment Terms" section
- `if (data.contentIsExclusiveProperty)` → include "Intellectual Property" section
- Contact methods from `data.contactMethodsTC`
- Same placeholder replacements as PP

```ts
import { PolicyFormData } from "@/lib/types";

export function generateTermsConditions(data: PolicyFormData): string {
  // Same pattern: build sections, conditionally include, concatenate
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add templates/terms-conditions.ts
git commit -m "feat: add terms and conditions template generator"
```

---

### Task 5: Build the Document Output Component

**Files:**
- Create: `components/document-output.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useRef, useState } from "react";

interface DocumentOutputProps {
  title: string;
  content: string;
}

export function DocumentOutput({ title, content }: DocumentOutputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        readOnly
        value={content}
        rows={20}
        className="w-full p-3 border rounded font-mono text-sm resize-y"
      />
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add components/document-output.tsx
git commit -m "feat: add document output component with copy button"
```

---

### Task 6: Build the Generator Form Component

**Files:**
- Create: `components/generator-form.tsx`

**Step 1: Create the form component**

This is the largest UI component. It renders all form fields from the design doc and calls `onGenerate(data)` on submit.

```tsx
"use client";

import { useState } from "react";
import {
  PolicyFormData,
  PERSONAL_INFO_OPTIONS,
  ANALYTICS_TOOLS_OPTIONS,
  CONTACT_METHODS_OPTIONS,
  US_STATES,
} from "@/lib/types";

interface GeneratorFormProps {
  onGenerate: (data: PolicyFormData) => void;
}

export function GeneratorForm({ onGenerate }: GeneratorFormProps) {
  // State for all form fields with sensible defaults
  const [formData, setFormData] = useState<PolicyFormData>({
    websiteUrl: "",
    websiteName: "",
    country: "United States",
    state: "California",
    entityType: "individual",
    personalInfoCollected: [],
    usesAnalytics: false,
    analyticsTools: [],
    includeCCPA: true,
    includeGDPR: true,
    includeCalOPPA: true,
    contactMethodsPP: [],
    usersCanCreateAccounts: false,
    usersCanUploadContent: false,
    usersCanBuyGoods: false,
    contentIsExclusiveProperty: false,
    contactMethodsTC: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  // Helper for checkbox arrays
  const toggleArrayItem = (
    field: keyof PolicyFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shared Fields Section */}
      {/* Website URL — text input */}
      {/* Website Name — text input */}
      {/* Country — select dropdown */}
      {/* State — select dropdown (conditional: show only if country is US) */}
      {/* Entity Type — radio buttons */}

      {/* Privacy Policy Section */}
      {/* Personal Info Collected — checkboxes from PERSONAL_INFO_OPTIONS */}
      {/* Uses Analytics — radio yes/no */}
      {/* Analytics Tools — checkboxes from ANALYTICS_TOOLS_OPTIONS (conditional: show only if usesAnalytics) */}
      {/* Include CCPA — radio yes/no */}
      {/* Include GDPR — radio yes/no */}
      {/* Include CalOPPA — radio yes/no */}
      {/* Contact Methods PP — checkboxes from CONTACT_METHODS_OPTIONS */}

      {/* Terms & Conditions Section */}
      {/* Users Can Create Accounts — radio yes/no */}
      {/* Users Can Upload Content — radio yes/no */}
      {/* Users Can Buy Goods — radio yes/no */}
      {/* Content Is Exclusive Property — radio yes/no */}
      {/* Contact Methods TC — checkboxes from CONTACT_METHODS_OPTIONS */}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Generate Documents
      </button>
    </form>
  );
}
```

Implement each commented section as actual JSX with labels, inputs, and state bindings. Use consistent patterns:

- Text inputs: `<input type="text" value={formData.field} onChange={...} className="w-full p-2 border rounded" />`
- Radio buttons: `<label><input type="radio" checked={formData.field === value} onChange={...} /> Label</label>`
- Checkboxes: `<label><input type="checkbox" checked={arr.includes(value)} onChange={() => toggleArrayItem(field, value)} /> Label</label>`
- Conditional sections: `{formData.usesAnalytics && (<div>...</div>)}`

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add components/generator-form.tsx
git commit -m "feat: add generator form component with all fields"
```

---

### Task 7: Wire Up the Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Connect form, generators, and output**

```tsx
"use client";

import { useState } from "react";
import { GeneratorForm } from "@/components/generator-form";
import { DocumentOutput } from "@/components/document-output";
import { generatePrivacyPolicy } from "@/templates/privacy-policy";
import { generateTermsConditions } from "@/templates/terms-conditions";
import { PolicyFormData } from "@/lib/types";

export default function Home() {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = (data: PolicyFormData) => {
    setPrivacyPolicy(generatePrivacyPolicy(data));
    setTermsConditions(generateTermsConditions(data));
    setGenerated(true);
  };

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Privacy Policy & Terms Generator</h1>

      <GeneratorForm onGenerate={handleGenerate} />

      {generated && (
        <div className="space-y-8">
          <DocumentOutput title="Privacy Policy" content={privacyPolicy} />
          <DocumentOutput
            title="Terms and Conditions"
            content={termsConditions}
          />
        </div>
      )}
    </main>
  );
}
```

**Step 2: Run dev server and test end-to-end**

Run: `npm run dev`

Test manually:
1. Fill in website URL and name
2. Check some personal info boxes
3. Toggle analytics on, select Google Analytics
4. Leave CCPA/GDPR/CalOPPA on
5. Click Generate
6. Verify both textareas appear with correct content
7. Click "Copy to Clipboard" and paste somewhere to verify

**Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire up page with form, generators, and output"
```

---

### Task 8: Final Polish and Verification

**Files:**
- Possibly touch: `app/layout.tsx` (update metadata title/description)

**Step 1: Update metadata in layout**

In `app/layout.tsx`, update the metadata:

```ts
export const metadata: Metadata = {
  title: "Privacy Policy & Terms Generator",
  description: "Generate Privacy Policy and Terms & Conditions for your website",
};
```

**Step 2: Full verification**

Run: `npx tsc --noEmit && npm run build`
Expected: Both pass clean.

**Step 3: Manual smoke test**

Run: `npm run dev`

Test with the example values from the screenshots:
- URL: `https://tourzionandbryce.com`
- Name: `Tour Zion and Bryce`
- Country: United States, State: California
- Entity: Individual
- Personal info: all checked except "Others"
- Analytics: Yes → Google Analytics + Facebook Analytics
- CCPA: Yes, GDPR: Yes, CalOPPA: Yes
- T&C: all "No"

Verify output matches the structure of the user's example documents.

**Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "chore: update metadata and final polish"
```
