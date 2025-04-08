import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			pages: path.resolve(__dirname, "src/pages"),
		},
	},
	build: {
		rollupOptions: {
			input: {
				homePage: "/index.html",
				signUp: "/src/pages/auth/signup.ts",
				chat: "/src/pages/chat/chat.ts",
				page404: "/src/pages/error/404.html",
				page500: "/src/pages/error/500.html",
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler",
			},
		},
	},
});
