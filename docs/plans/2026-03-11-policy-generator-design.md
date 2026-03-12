# Privacy Policy & Terms and Conditions Generator — Design

**Date:** 2026-03-11
**Status:** Approved

## Summary

Standalone Next.js app that generates Privacy Policy and Terms & Conditions documents from a single form. Pure client-side generation — no API routes, no database, no auth. Output is raw text in textareas with copy-to-clipboard buttons, intended for pasting into AI prompts.

## Architecture

- **Approach:** Single-page client-side only (Approach A)
- **Stack:** Next.js + React + Tailwind CSS
- **Template system:** TypeScript template files with exported generator functions
- **No server logic.** All generation happens in the browser via string interpolation and conditional blocks.

## Form Fields (Single Form → Both Documents)

| Field | Type | Used By |
|---|---|---|
| Website URL | text | Both |
| Website Name | text | Both |
| Country | select | Both |
| State | select (conditional on country) | Both |
| Entity type | radio (business / individual) | Both |
| Personal info collected | checkboxes | PP |
| Uses analytics | radio (yes / no) | PP |
| Analytics tools | checkboxes (conditional on yes) | PP |
| Include CCPA/CPRA | radio | PP |
| Include GDPR | radio | PP |
| Include CalOPPA | radio | PP |
| Users can create accounts | radio | T&C |
| Users can upload content | radio | T&C |
| Users can buy goods | radio | T&C |
| Content is exclusive property | radio | T&C |
| Contact methods (PP) | checkboxes | PP |
| Contact methods (T&C) | checkboxes | T&C |

## Template System

Two files, each exporting a single function:

```ts
// templates/privacy-policy.ts
export function generatePrivacyPolicy(data: FormData): string { ... }

// templates/terms-conditions.ts
export function generateTermsConditions(data: FormData): string { ... }
```

**Conditional sections:**
- GDPR, CCPA/CPRA, CalOPPA blocks: included/excluded by boolean flags
- Analytics providers: only checked providers appear in "Detailed Information" section
- Personal info types: dynamically listed in "Types of Data Collected"
- T&C account/content/purchasing sections: toggled by radio inputs

**Placeholder replacements:**
- `[wpautoterms site_name]` → website name
- `[wpautoterms site_url]` → website URL
- `[wpautoterms last_updated_date]` → today's date (formatted)
- Country/state → selected values

**Shared types** in `lib/types.ts` define the `FormData` interface.

## Project Structure

```
T&C PP/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── generator-form.tsx
│   └── document-output.tsx
├── templates/
│   ├── privacy-policy.ts
│   └── terms-conditions.ts
├── lib/
│   └── types.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## UI Flow

1. User fills out the single form
2. Clicks "Generate"
3. `generatePrivacyPolicy(data)` and `generateTermsConditions(data)` run client-side
4. Results display in two labeled `<textarea>` elements
5. Each textarea has a "Copy to Clipboard" button

## Styling

Tailwind with minimal, functional styling. Basic labels, inputs, textareas. No design system needed.

## Future Portability

Built as a standalone app but architected for easy extraction into the Website Reveals project later. The `templates/`, `lib/types.ts`, and `components/` directories can be dropped into another Next.js project as-is.
