"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { PolicyFormData } from "@/lib/types";
import { generatePrivacyPolicy } from "@/templates/privacy-policy";
import { generateTermsConditions } from "@/templates/terms-conditions";

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
    >
      {copied ? "Copied!" : label || "Copy to Clipboard"}
    </button>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data, showPP, showTC } = useMemo(() => {
    try {
      const raw = searchParams.get("data");
      if (!raw) return { data: null, showPP: false, showTC: false };
      const parsed = JSON.parse(atob(raw)) as PolicyFormData;
      return {
        data: parsed,
        showPP: searchParams.get("pp") === "1",
        showTC: searchParams.get("tc") === "1",
      };
    } catch {
      return { data: null, showPP: false, showTC: false };
    }
  }, [searchParams]);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          No form data found. Please fill out the form first.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Go back to form
        </button>
      </div>
    );
  }

  const ppText = showPP ? generatePrivacyPolicy(data) : "";
  const tcText = showTC ? generateTermsConditions(data) : "";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Generated Documents</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          &larr; Back to form
        </button>
      </div>

      {/* Quick copy bar at top */}
      <div className="flex flex-wrap gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        {showPP && (
          <CopyButton text={ppText} label="Copy Privacy Policy" />
        )}
        {showTC && (
          <CopyButton text={tcText} label="Copy Terms & Conditions" />
        )}
        {showPP && showTC && (
          <CopyButton
            text={`${ppText}\n\n${"=".repeat(60)}\n\n${tcText}`}
            label="Copy Both"
          />
        )}
      </div>

      {showPP && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Privacy Policy</h2>
            <CopyButton text={ppText} />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed font-[family-name:var(--font-geist-mono)]">
            {ppText}
          </div>
        </section>
      )}

      {showTC && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Terms &amp; Conditions</h2>
            <CopyButton text={tcText} />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed font-[family-name:var(--font-geist-mono)]">
            {tcText}
          </div>
        </section>
      )}

    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <Suspense
        fallback={
          <div className="text-center py-12 text-gray-500">Loading...</div>
        }
      >
        <ResultContent />
      </Suspense>
    </main>
  );
}
