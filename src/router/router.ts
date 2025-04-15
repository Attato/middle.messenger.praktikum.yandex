interface Route {
	pathname: string;
	block: () => void | Promise<void>;
	match(pathname: string): boolean;
	render(route: Route): Promise<void>;
	leave(): void;
}

class Router {
	private static __instance: Router | null = null;
	private routes: Route[] = [];
	private history: History = window.history;
	private _currentRoute: Route | null = null;

	public use(pathname: string, block: () => void | Promise<void>): Router {
		const route: Route = {
			pathname,
			block,
			match(pathname: string): boolean {
				const routePattern = new RegExp(`^${this.pathname}$`);
				return routePattern.test(pathname);
			},
			async render(route: Route): Promise<void> {
				try {
					await route.block();
				} catch (error) {
					console.error("Ошибка при рендере маршрута:", error);
				}
			},
			leave(): void {
				const mainPage = document.getElementById("main-page");
				if (mainPage) {
					mainPage.innerHTML = "";
				}
			},
		};

		this.routes.push(route);
		return this;
	}

	public start(): void {
		document.body.addEventListener("click", (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (target.tagName === "A") {
				const href = target.getAttribute("href");
				if (href) {
					event.preventDefault();
					this.go(href);
				}
			}
		});

		window.onpopstate = () => {
			this._onRoute(window.location.pathname);
		};

		this._onRoute(window.location.pathname);
	}

	private async _onRoute(pathname: string): Promise<void> {
		const route = this.getRoute(pathname);
		if (!route) {
			const notFound = this.getRoute("404");
			if (notFound) await notFound.render(notFound);
			return;
		}

		if (this._currentRoute) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;

		try {
			await route.render(route);
		} catch (error) {
			console.error("Ошибка при рендере маршрута:", error);
			const serverErrorRoute = this.getRoute("500");
			if (serverErrorRoute) {
				await serverErrorRoute.render(serverErrorRoute);
			}
		}
	}

	public go(pathname: string): void {
		this.history.pushState({}, "", pathname);
		this._onRoute(pathname);
	}

	private getRoute(pathname: string): Route | undefined {
		return this.routes.find((route) => route.match(pathname));
	}

	public static getInstance(): Router {
		if (!Router.__instance) {
			Router.__instance = new Router();
		}
		return Router.__instance;
	}
}

export default Router;
