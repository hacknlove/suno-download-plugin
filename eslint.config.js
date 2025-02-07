import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config} */
export default {
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  languageOptions: {
    globals: {
      ...globals.browser,
      chrome: true,
    },
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
      project: "./tsconfig.json",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
    react: pluginReact,
  },
  rules: {
    ...pluginJs.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...pluginReact.configs.flat.recommended.rules,
    "@typescript-eslint/no-explicit-any": "off",
    "react/react-in-jsx-scope": "off",
  },
  settings: {
    react: {
      version: "18.2.0",
    },
  },
};
