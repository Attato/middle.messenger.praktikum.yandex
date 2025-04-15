import { Input } from "./Input";
import { EventBus } from "../EventBus";

jest.mock("./Input.module.scss", () => ({
	field: "field",
	label: "label",
	input: "input",
}));

import styles from "./Input.module.scss";

describe("Input", () => {
	const props = {
		label: "Имя",
		type: "text",
		name: "first_name",
		placeholder: "Введите имя",
		autocomplete: "off",
		value: "krutoi",
	};

	let eventBus: EventBus;
	let input: Input;

	beforeEach(() => {
		eventBus = new EventBus();
		input = new Input(props, eventBus);
	});

	test("должен создавать элемент с правильными атрибутами", () => {
		const element = input.getElement();

		const label = element.querySelector("label");
		const inputElement = element.querySelector("input");

		expect(label?.textContent).toContain(props.label);
		expect(inputElement).toBeInstanceOf(HTMLInputElement);
		expect(inputElement).toHaveProperty("type", props.type);
		expect(inputElement).toHaveProperty("name", props.name);
		expect(inputElement).toHaveProperty("placeholder", props.placeholder);
		expect(inputElement).toHaveProperty("value", props.value);
		expect(inputElement?.getAttribute("autocomplete")).toBe(props.autocomplete);
	});

	test("должен правильно добавлять классы", () => {
		const element = input.getElement();

		expect(element.classList.contains(styles.field)).toBe(true);

		const label = element.querySelector("label");
		expect(label?.classList.contains(styles.label)).toBe(true);

		const inputElement = element.querySelector("input");
		expect(inputElement?.classList.contains(styles.input)).toBe(true);
	});

	test("должен обрабатывать события", () => {
		const handler = jest.fn();
		const propsWithEvent = {
			...props,
			events: {
				input: handler,
			},
		};

		const inputWithEvent = new Input(propsWithEvent, eventBus);
		const element = inputWithEvent.getElement();
		const inputElement = element.querySelector("input");

		inputElement?.dispatchEvent(new Event("input"));

		expect(handler).toHaveBeenCalled();
	});
});
