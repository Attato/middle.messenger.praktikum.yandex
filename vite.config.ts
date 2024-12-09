import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				homePage: "/index.html",
				signUp: "/src/auth/signup.html",
				chat: "/src/chat/chat.html",
				page404: "/src/error/404.html",
				page500: "/src/error/500.html",
			},
		},
	},
});
