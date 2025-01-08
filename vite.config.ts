import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				homePage: "/index.html",
				signUp: "/src/pages/auth/signup.html",
				chat: "/src/pages/chat/chat.html",
				page404: "/src/pages/error/404.html",
				page500: "/src/pages/error/500.html",
			},
		},
	},
});
