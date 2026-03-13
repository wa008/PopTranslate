import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                chrome: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                Date: "readonly",
                fetch: "readonly",
                Map: "readonly",
                Math: "readonly",
                JSON: "readonly",
                Promise: "readonly"
            }
        },
        rules: {
            "no-undef": "error",
            "no-unused-vars": "error",
            "no-useless-assignment": "off"
        }
    }
];
