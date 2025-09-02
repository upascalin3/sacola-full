import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Resolve ESM dirname/filename correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow temporary usage of any during migration
      "@typescript-eslint/no-explicit-any": "off",
      // Don't block builds on unused vars; warn instead
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      // Allow require() in specific places like dynamic imports in node utils
      "@typescript-eslint/no-require-imports": "off",
      // Relax unescaped entities in UI strings
      "react/no-unescaped-entities": "off",
      // Hook exhaustive deps warnings only
      "react-hooks/exhaustive-deps": "warn",
      // Allow empty interface extension patterns used by UI wrappers
      "@typescript-eslint/no-empty-object-type": "off",
      // Custom: do not fail build on unused imports from icons etc.
      "no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;