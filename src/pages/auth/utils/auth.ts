import Handlebars from "handlebars";
import { EventBus } from "../../../components/EventBus";
import { Input } from "../../../components/Input";
import { attachValidationToForm } from "./formValidator";

interface Field {
	label: string;
	type: string;
	name: string;
	placeholder: string;
}

interface Context {
	title: string;
	fields: Field[];
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
	whiteButtonLink: "/index.html",
	grayButtonLink: "/index.html",
};

const templateSource = `
    <main class="auth">
        <form class="auth__wrap">
            <h2 class="auth__title">{{title}}</h2>
            
            <div class="input__wrap" id="input-wrapper"></div>

            <div class="auth__actions">
                <a href="{{whiteButtonLink}}" class="button__white">{{whiteButton}}</a>
                <hr>
                <a href="{{grayButtonLink}}" class="button__gray">{{grayButton}}</a>
            </div>
        </form>
    </main>
`;

const authElement = document.getElementById("auth");
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
