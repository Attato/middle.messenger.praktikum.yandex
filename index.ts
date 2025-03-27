import Handlebars from "handlebars";
import { Input, InputProps } from "./src/components/Input";
import { EventBus } from "./src/components/EventBus";

interface Context {
	title: string;
	fields: InputProps[];
	whiteButton: string;
	whiteButtonLink: string;
	grayButton: string;
	grayButtonLink: string;
}

const authData: Context = {
	title: "Вход",
	fields: [
		{
			label: "Логин",
			type: "text",
			name: "login",
			placeholder: "Логин",
		},
		{
			label: "Пароль",
			type: "password",
			name: "password",
			placeholder: "Пароль",
			autocomplete: "on",
		},
	],
	whiteButton: "Авторизоваться",
	grayButton: "Нет аккаунта?",
	whiteButtonLink: "/chat",
	grayButtonLink: "/register",
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
const html = template(authData);

if (authElement) {
	authElement.innerHTML = html;

	const inputWrapper = document.getElementById("input-wrapper");

	if (inputWrapper) {
		authData.fields.forEach((field) => {
			const inputComponent = new Input(field, eventBus);
			inputWrapper.appendChild(inputComponent.getElement());
		});
	}

	eventBus.on("inputChange", (data: { name: string; value: string }) => {
		console.log(`Поле ${data.name} изменено: ${data.value}`);
	});
}
