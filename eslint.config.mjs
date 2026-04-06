import js from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import security from "eslint-plugin-security";
import babelParser from "@babel/eslint-parser";

export default [
  // Config base de ESLint
  js.configs.recommended,

  {
    files: ["**/*.js"],
    
    languageOptions: {
      parser: babelParser,
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },

      parserOptions: {
        requireConfigFile: false, // 🔥 importante para que no exija babel.config.js
      },
    },

    plugins: {
      "jsx-a11y": jsxA11y,
      prettier,
      security,
    },

    rules: {
      // estilo
      "comma-dangle": ["error", "never"],
      "arrow-parens": ["error", "as-needed"],
      "space-before-function-paren": "off",

      // accesibilidad
      "jsx-a11y/img-has-alt": "off",

      // prettier
      "prettier/prettier": [
        "error",
        {
          trailingComma: "none",
          singleQuote: true,
        },
      ],

      // legacy relax
      "no-multi-str": "off",
    },
  },

  // reglas recomendadas de security
  security.configs.recommended,
];