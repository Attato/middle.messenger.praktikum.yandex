type PageModule = () => Promise<{ render: () => string | Promise<string> }>;

const routes: Record<string, PageModule> = {
	"/": () => import("pages/auth/signin"),
	"/auth/signup": () => import("pages/auth/signup"),
	"/chat": () => import("pages/chat/chat"),
	"/profile": () => import("pages/profile/profile"),
	"404": () => import("pages/error/404"),
	"500": () => import("pages/error/500"),
};

const checkAuthStatus = async (): Promise<boolean> => {
	try {
		const response = await fetch(
			"https://ya-praktikum.tech/api/v2/auth/user",
			{
				method: "GET",
				credentials: "include",
				mode: "cors",
			},
		);

		if (!response.ok) return false;

		const data = await response.json();

		return !!data?.id;
	} catch (err) {
		console.error("Ошибка при проверке авторизации:", err);
		return false;
	}
};

export const route = (event: Event): void => {
	event.preventDefault();

	const target = event.target as HTMLAnchorElement;

	if (target && target.href) {
		window.history.pushState({}, "", target.href);

		handleLocation();
	}
};

export const handleLocation = async (): Promise<void> => {
	const path: string = window.location.pathname;
	const loader = routes[path] || routes["404"];
	const mainPage = document.getElementById("main-page");

	try {
		if (path === "/" || path === "/auth/signup") {
			const isAuthenticated = await checkAuthStatus();
			if (isAuthenticated) {
				window.location.href = "/chat";
				return;
			}
		}

		if (path === "/chat" || path === "/profile") {
			const isAuthenticated = await checkAuthStatus();
			if (!isAuthenticated) {
				window.location.href = "/";
				return;
			}
		}

		const page = await loader();
		const content = await page.render();
		if (mainPage) mainPage.innerHTML = content;
	} catch (error) {
		console.error("Error loading route module:", error);

		try {
			const page500 = await routes["500"]();
			const html500 = await page500.render();
			if (mainPage) mainPage.innerHTML = html500;
		} catch (nestedError) {
			console.error("Error loading 500 page:", nestedError);
		}
	}
};

window.addEventListener("popstate", handleLocation);
window.addEventListener("DOMContentLoaded", handleLocation);
