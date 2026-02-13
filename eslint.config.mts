import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "felicity/templates/static/**"],
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,vue}"],
    ignores: ["webapp/components/document/editor/umo/options.ts"],
    rules: {
      "no-empty": "off",
      "no-undef": "off",
      "no-useless-escape": "off",
      "no-useless-catch": "off",
      "no-case-declarations": "off",
      "no-sparse-arrays": "off",
      "no-unsafe-optional-chaining": "off",
      "no-prototype-builtins": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-mutating-props": "off",
      "vue/valid-v-on": "off",
      "vue/no-dupe-keys": "off",
      "vue/require-v-for-key": "off",
      "vue/require-valid-default-prop": "off",
      "vue/require-toggle-inside-transition": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
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
