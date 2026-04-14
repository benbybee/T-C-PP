"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PolicyFormData,
  PERSONAL_INFO_OPTIONS,
  ANALYTICS_TOOLS_OPTIONS,
  CONTACT_METHODS_OPTIONS,
  US_STATES,
} from "@/lib/types";

const DEFAULT_FORM: PolicyFormData = {
  websiteUrl: "",
  websiteName: "",
  country: "United States",
  state: "",
  entityType: "business",
  personalInfoCollected: [],
  usesAnalytics: false,
  analyticsTools: [],
  includeCCPA: false,
  includeGDPR: false,
  includeCalOPPA: false,
  contactMethodsPP: [],
  usersCanCreateAccounts: false,
  usersCanUploadContent: false,
  usersCanBuyGoods: false,
  contentIsExclusiveProperty: true,
  contactMethodsTC: [],
};

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };
  return (
    <fieldset className="space-y-2">
      <legend className="font-medium text-sm text-gray-700">{label}</legend>
      <div className="grid gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="mt-0.5 rounded border-gray-300"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function PolicyForm() {
  const [form, setForm] = useState<PolicyFormData>(DEFAULT_FORM);
  const [generate, setGenerate] = useState({ pp: true, tc: true });
  const router = useRouter();

  const update = <K extends keyof PolicyFormData>(
    key: K,
    value: PolicyFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("data", btoa(JSON.stringify(form)));
    params.set("pp", generate.pp ? "1" : "0");
    params.set("tc", generate.tc ? "1" : "0");
    router.push(`/result?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* What to generate */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What do you need?</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={generate.pp}
              onChange={(e) =>
                setGenerate((g) => ({ ...g, pp: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            Privacy Policy
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={generate.tc}
              onChange={(e) =>
                setGenerate((g) => ({ ...g, tc: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            Terms &amp; Conditions
          </label>
        </div>
      </section>

      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website Name
            </label>
            <input
              type="text"
              required
              value={form.websiteName}
              onChange={(e) => update("websiteName", e.target.value)}
              placeholder="My Website"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              required
              value={form.websiteUrl}
              onChange={(e) => update("websiteUrl", e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <select
              value={form.entityType}
              onChange={(e) =>
                update("entityType", e.target.value as "business" | "individual")
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="business">Business</option>
              <option value="individual">Individual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a state...</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Privacy Policy Options */}
      {generate.pp && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Privacy Policy Options</h2>

          <CheckboxGroup
            label="Personal information collected"
            options={PERSONAL_INFO_OPTIONS}
            selected={form.personalInfoCollected}
            onChange={(val) => update("personalInfoCollected", val)}
          />

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.usesAnalytics}
                onChange={(e) => update("usesAnalytics", e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="font-medium text-gray-700">
                Uses analytics tools
              </span>
            </label>
            {form.usesAnalytics && (
              <div className="ml-6">
                <CheckboxGroup
                  label="Which analytics tools?"
                  options={ANALYTICS_TOOLS_OPTIONS}
                  selected={form.analyticsTools}
                  onChange={(val) => update("analyticsTools", val)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-700">
              Include compliance sections
            </p>
            <div className="flex flex-wrap gap-4">
              {(
                [
                  ["includeGDPR", "GDPR (EU)"],
                  ["includeCCPA", "CCPA/CPRA (California)"],
                  ["includeCalOPPA", "CalOPPA"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => update(key, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <CheckboxGroup
            label="Contact methods (Privacy Policy)"
            options={CONTACT_METHODS_OPTIONS}
            selected={form.contactMethodsPP}
            onChange={(val) => update("contactMethodsPP", val)}
          />
        </section>
      )}

      {/* Terms & Conditions Options */}
      {generate.tc && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            Terms &amp; Conditions Options
          </h2>

          <div className="space-y-2">
            {(
              [
                ["usersCanCreateAccounts", "Users can create accounts"],
                ["usersCanUploadContent", "Users can upload content"],
                ["usersCanBuyGoods", "Users can purchase goods/services"],
                [
                  "contentIsExclusiveProperty",
                  "All content is exclusive property of the company",
                ],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="rounded border-gray-300"
                />
                {label}
              </label>
            ))}
          </div>

          <CheckboxGroup
            label="Contact methods (Terms & Conditions)"
            options={CONTACT_METHODS_OPTIONS}
            selected={form.contactMethodsTC}
            onChange={(val) => update("contactMethodsTC", val)}
          />
        </section>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!generate.pp && !generate.tc}
        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Generate Documents
      </button>
    </form>
  );
}
