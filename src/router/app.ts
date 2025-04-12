import Router from "./router";

import { signInRender, signInMount } from "pages/auth/signin";
import { signUpRender, signUpMount } from "pages/auth/signup";
import { chatRender, chatMount } from "pages/chat/chat";
import { profileRender, profileMount } from "pages/profile/profile";
import { error404Render } from "pages/error/404";
import { error500Render } from "pages/error/500";

import { checkAuthStatus } from "pages/auth/utils/api";

const router = Router.getInstance();

router
	.use("/", async () => {
		const mainPage = document.getElementById("main-page");
		if (!mainPage) return;

		const isAuthorized = await checkAuthStatus();

		if (isAuthorized) {
			router.go("/chat");
		} else {
			mainPage.innerHTML = "";
			mainPage.innerHTML = signInRender();
			signInMount();
		}
	})
	.use("/auth/signup", async () => {
		const mainPage = document.getElementById("main-page");
		if (!mainPage) return;

		const isAuthorized = await checkAuthStatus();

		if (isAuthorized) {
			router.go("/chat");
		} else {
			mainPage.innerHTML = "";
			mainPage.innerHTML = signUpRender();
			signUpMount();
		}
	})
	.use("/chat", async () => {
		const mainPage = document.getElementById("main-page");
		if (mainPage) {
			const isAuthorized = await checkAuthStatus();
			if (!isAuthorized) {
				router.go("/");
				return;
			}

			mainPage.innerHTML = "";
			mainPage.innerHTML = chatRender();
			chatMount();
		}
	})
	.use("/profile", async () => {
		const mainPage = document.getElementById("main-page");
		if (mainPage) {
			const isAuthorized = await checkAuthStatus();

			if (!isAuthorized) {
				router.go("/");
				return;
			}

			mainPage.innerHTML = "";
			mainPage.innerHTML = profileRender();
			profileMount();
		}
	})
	.use("404", async () => {
		const mainPage = document.getElementById("main-page");
		if (mainPage) {
			mainPage.innerHTML = "";
			mainPage.innerHTML = error404Render();
		}
	})
	.use("/500", async () => {
		const mainPage = document.getElementById("main-page");
		if (mainPage) {
			mainPage.innerHTML = "";
			mainPage.innerHTML = error500Render();
		}
	});

router.start();
