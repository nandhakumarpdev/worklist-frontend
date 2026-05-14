import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
    js.configs.recommended,
    react.configs.flat.recommended,

    {
        files: ["**/*.{js,jsx}"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },

            globals: globals.browser
        },

        plugins: {
            react,
            "react-hooks": reactHooks
        },

        settings: {
            react: {
                version: "detect"
            }
        },

        rules: {
            "react/react-in-jsx-scope": "off"
        }
    }
];