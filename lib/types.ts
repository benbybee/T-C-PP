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
