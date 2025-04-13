import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.json",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
		},
		rules: {
			semi: "error",
			"prefer-const": "error",
			...tseslint.configs.recommended.rules,
		},
	},
];
