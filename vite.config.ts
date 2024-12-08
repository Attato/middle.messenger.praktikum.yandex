import { defineConfig } from "vite";

export default defineConfig({
	root: "./src",
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				homepage: "/index.html",
				signUp: "/auth/signup.html",
				chat: "/chat/chat.html",
				page404: "/error/404.html",
				page500: "/error/500.html",
			},
		},
	},
});
