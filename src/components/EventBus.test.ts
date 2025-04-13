import { EventBus } from "./EventBus"; // Убедитесь, что путь правильный

describe("EventBus", () => {
	let eventBus: EventBus;

	beforeEach(() => {
		eventBus = new EventBus();
	});

	test("должен добавлять слушателя события", () => {
		const listener = jest.fn();
		eventBus.on("testEvent", listener);

		eventBus.emit("testEvent");

		expect(listener).toHaveBeenCalled();
	});

	test("должен передавать аргументы в слушатель", () => {
		const listener = jest.fn();
		eventBus.on("testEvent", listener);

		const arg1 = "Аргумент 1";
		const arg2 = 215;

		eventBus.emit("testEvent", arg1, arg2);

		expect(listener).toHaveBeenCalledWith(arg1, arg2);
	});

	test("должен удалять слушателя при вызове off", () => {
		const listener = jest.fn();
		eventBus.on("testEvent", listener);

		eventBus.off("testEvent", listener);

		eventBus.emit("testEvent");

		expect(listener).not.toHaveBeenCalled();
	});

	test("не должен вызывать удалённого слушателя", () => {
		const listener1 = jest.fn();
		const listener2 = jest.fn();

		eventBus.on("testEvent", listener1);
		eventBus.on("testEvent", listener2);

		eventBus.off("testEvent", listener1);

		eventBus.emit("testEvent");

		expect(listener1).not.toHaveBeenCalled();
		expect(listener2).toHaveBeenCalled();
	});

	test("не должен выбрасывать ошибку, если событие не зарегистрировано", () => {
		const listener = jest.fn();

		eventBus.emit("nonExistingEvent");

		expect(listener).not.toHaveBeenCalled();
	});
});
