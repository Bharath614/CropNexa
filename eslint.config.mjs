import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "web/**",
      "functions/**",
      "scripts/**",
      "load-tests/**",
      "selenium-tests/**",
      "appium-tests/**",
      "Vulnerability Test Results/**",
      "android/**",
      "assets/**",
      "refactor*.js",
      "translate.py",
      "fix-dates.js",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;

