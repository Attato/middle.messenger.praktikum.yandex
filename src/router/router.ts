type Route = {
	path: string;
	component: () => string;
};

class Router {
	private routes: Route[];
	private rootElement: HTMLElement;

	constructor(routes: Route[], rootElementId: string) {
		this.routes = routes;
		const element = document.getElementById(rootElementId);
		if (!element) {
			throw new Error(`Element with ID "${rootElementId}" not found`);
		}
		this.rootElement = element;
		this._loadInitialRoute();
		this._addPopStateListener();
	}

	private _loadInitialRoute(): void {
		this.navigate(window.location.pathname, false);
	}

	navigate(path: string, addToHistory: boolean = true): void {
		const route = this.routes.find((r) => r.path === path);
		if (!route) {
			this.rootElement.innerHTML = "<h1>404 - Страница не найдена</h1>";
			return;
		}

		if (addToHistory) {
			window.history.pushState({}, "", path);
		}

		this.rootElement.innerHTML = route.component();
	}

	private _addPopStateListener(): void {
		window.addEventListener("popstate", () => {
			this.navigate(window.location.pathname, false);
		});
	}
}

const routes: Route[] = [
	{ path: "/", component: () => "<h1>Главная</h1>" },
	{ path: "/about", component: () => "<h1>О нас</h1>" },
	{ path: "/contact", component: () => "<h1>Контакты</h1>" },
];

const router = new Router(routes, "app");

document.addEventListener("click", (event: Event) => {
	const target = event.target as HTMLElement;
	if (target.matches("[data-link]")) {
		event.preventDefault();
		const href = target.getAttribute("href");
		if (href) {
			router.navigate(href);
		}
	}
});
