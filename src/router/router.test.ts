import Router from "./router";

describe("Router", () => {
	let router: Router;

	beforeEach(() => {
		document.body.innerHTML = '<div id="main-page"></div>';

		router = Router.getInstance();
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	test("должен создать маршрут и сопоставить pathname", () => {
		router.use("/chat", async () => {
			document.getElementById("main-page")!.innerHTML = "Home Page";
		});

		router.go("/chat");

		const mainPage = document.getElementById("main-page");
		expect(mainPage!.innerHTML).toBe("Home Page");
	});

	test("должен правильно перейти на маршрут при вызове go()", (done) => {
		const homeBlock = async () => {
			document.getElementById("main-page")!.innerHTML = "Home Page";
		};

		router.use("/chat", homeBlock);

		router.go("/chat");

		setTimeout(() => {
			const mainPage = document.getElementById("main-page");
			expect(mainPage!.innerHTML).toBe("Home Page");
			done();
		}, 100);
	});

	test("должен отрендерить маршрут 404, если страница не найдена", async () => {
		router.use("404", async () => {
			document.getElementById("main-page")!.innerHTML = "Page Not Found";
		});

		router.go("/bla-bla-bla");

		const mainPage = document.getElementById("main-page");
		expect(mainPage!.innerHTML).toBe("Page Not Found");
	});

	test("должен использовать pushState при навигации", () => {
		const originalPushState = window.history.pushState;
		let pushStateCalled = false;

		window.history.pushState = () => {
			pushStateCalled = true;
		};

		router.go("/chat");

		expect(pushStateCalled).toBe(true);

		window.history.pushState = originalPushState;
	});
});
