import { EventBus } from "./EventBus";
import styles from "./Input.module.scss";
import { Block } from "./Block";

export interface InputProps {
	label: string;
	type: string;
	name: string;
	placeholder: string;
	events?: Record<string, (event: Event) => void>;
	autocomplete?: string;
}

export class Input extends Block<InputProps> {
	constructor(props: InputProps, eventBus: EventBus) {
		super(props, eventBus);
	}

	protected createElement(): HTMLElement {
		const div = document.createElement("div");
		div.classList.add(styles.field);

		const label = document.createElement("label");
		label.classList.add(styles.label);

		const input = document.createElement("input");
		input.classList.add(styles.input);

		input.type = this.props.type;
		input.name = this.props.name;
		input.placeholder = this.props.placeholder;

		if (this.props.autocomplete) {
			input.setAttribute("autocomplete", this.props.autocomplete);
		}

		label.textContent = this.props.label;
		label.appendChild(input);

		if (this.props.events?.input) {
			input.addEventListener("input", this.props.events.input);
		}

		div.appendChild(label);

		return div;
	}
}
