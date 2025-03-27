import Handlebars from "handlebars";
import { EventBus } from "../../../components/EventBus";
import { Input, InputProps } from "../../../components/Input";
import { attachValidationToForm } from "./formValidator";

interface Context {
	title: string;
	fields: InputProps[];
	whiteButton: string;
	whiteButtonLink: string;
	grayButton: string;
	grayButtonLink: string;
}

const context: Context = {
	title: "Регистрация",
	fields: [
		{ label: "Имя", type: "text", name: "first_name", placeholder: "Имя" },
		{
			label: "Фамилия",
			type: "text",
			name: "second_name",
			placeholder: "Фамилия",
		},
		{ label: "Логин", type: "text", name: "login", placeholder: "Логин" },
		{ label: "Почта", type: "text", name: "email", placeholder: "Почта" },
		{
			label: "Пароль",
			type: "password",
			name: "password",
			placeholder: "Пароль",
			autocomplete: "on",
		},
		{
			label: "Телефон",
			type: "tel",
			name: "phone",
			placeholder: "Телефон",
		},
	],
	whiteButton: "Зарегистрироваться",
	grayButton: "Вернуться",
	whiteButtonLink: "/",
	grayButtonLink: "/",
};

const templateSource = `
    <main class="auth">
        <form class="auth__wrap">
            <h2 class="auth__title">{{title}}</h2>
            
            <div class="input__wrap" id="input-wrapper"></div>

            <div class="auth__actions">
                <a href="{{whiteButtonLink}}" class="button__white" data-link>{{whiteButton}}</a>
                <hr>
                <a href="{{grayButtonLink}}" class="button__gray" data-link>{{grayButton}}</a>
            </div>
        </form>
    </main>
`;

export function RegisterView(): void {
	const authElement = document.getElementById("app");
	const eventBus = new EventBus();

	const template = Handlebars.compile(templateSource);
	const html = template(context);

	if (authElement) {
		authElement.innerHTML = html;

		const inputWrapper = document.getElementById("input-wrapper");

		if (inputWrapper) {
			context.fields.forEach((field) => {
				const inputComponent = new Input(field, eventBus);
				inputWrapper.appendChild(inputComponent.getElement());
			});
		}

		const form = authElement.querySelector("form") as HTMLFormElement;
		if (form) {
			attachValidationToForm(form);
		}

		eventBus.on("inputChange", (data: { name: string; value: string }) => {
			console.log(`Поле ${data.name} изменено: ${data.value}`);
		});
	}
}
