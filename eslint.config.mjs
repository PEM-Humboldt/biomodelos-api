import js from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import security from "eslint-plugin-security";
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 7,
      sourceType: "module",

      globals: {
        ...globals.node,
      },

      parserOptions: {
        requireConfigFile: false,
      },
    },

    plugins: {
      "jsx-a11y": jsxA11y,
      prettier,
      security,
    },

    rules: {
      "comma-dangle": ["error", "never"],
      "arrow-parens": ["error", "as-needed"],
      "space-before-function-paren": "off",

      "jsx-a11y/img-has-alt": "off",

      "prettier/prettier": [
        "error",
        {
          trailingComma: "none",
          singleQuote: true,
        },
      ],

      "no-multi-str": "off",
    },
  },

  security.configs.recommended,
];