import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,vue}"],
    ignores: ["webapp/components/document/editor/umo/options.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}/]",
          message: "Avoid hardcoded hex colors; use theme tokens or CSS variables instead.",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]",
          message: "Avoid hardcoded hex colors; use theme tokens or CSS variables instead.",
        },
      ],
    },
  },
]);
