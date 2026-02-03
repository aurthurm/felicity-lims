import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["webapp/components/ui/**"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,vue}"],
    ignores: ["webapp/components/document/editor/umo/options.ts", "webapp/components/ui/**"],
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
  {
    files: ["webapp/views/**/*.{js,ts,tsx,vue}"],
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "no-unsafe-optional-chaining": "off",
      "no-empty": "off",
      "no-unused-expressions": "off",
      "no-undef": "off",
      "vue/no-dupe-keys": "off",
      "vue/no-mutating-props": "off",
      "vue/require-v-for-key": "off",
      "no-sparse-arrays": "off",
    },
  },
  {
    files: ["webapp/components/**/*.{js,ts,tsx,vue}"],
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "no-unsafe-optional-chaining": "off",
      "no-empty": "off",
      "no-unused-expressions": "off",
      "no-undef": "off",
      "vue/no-dupe-keys": "off",
      "vue/no-mutating-props": "off",
      "vue/require-v-for-key": "off",
      "no-sparse-arrays": "off",
      "no-prototype-builtins": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
]);
