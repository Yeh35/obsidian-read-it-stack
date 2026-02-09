import globals from "globals";
import json from "@eslint/json";
import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";

export default tseslint.config(
	...obsidianmd.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ["manifest.json"],
		plugins: { json, obsidianmd },
		language: "json/json",
		rules: {
			"no-irregular-whitespace": "off",
			"obsidianmd/validate-manifest": "error",
		},
	},
	{
		ignores: ["main.js", "esbuild.config.mjs", "node_modules/**"]
	}
);
