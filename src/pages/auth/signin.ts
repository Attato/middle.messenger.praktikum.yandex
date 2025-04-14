import Handlebars from "handlebars";
import { Input, InputProps } from "../../components/Input/Input";
import { EventBus } from "../../components/EventBus";
import { signIn } from "./utils/api";

import "pages/auth/auth.scss";

const authData = {
	title: "Вход",
	fields: [
		{
			label: "Логин",
			type: "text",
			name: "login",
			placeholder: "krutoi",
			autocomplete: "on",
		},
		{
			label: "Пароль",
			type: "password",
			name: "password",
			placeholder: "******",
			autocomplete: "on",
		},
	],
	whiteButton: "Авторизоваться",
	whiteButtonLink: "/chat",
	grayButton: "Нет аккаунта?",
	grayButtonLink: "/auth/signup",
};

const templateSource = `
<div class="container">
    <div class="auth">
        <div class="auth__wrap">
            <h1 class="auth__title">{{title}}</h1>

            <form id="auth-form">
                <div class="input__wrap" id="input-wrapper"></div>
				<button type="submit" class="button__white">{{whiteButton}}</button>
            </form>

            <div class="auth__actions">
                <hr />
                <a href="{{grayButtonLink}}" class="button__gray">{{grayButton}}</a>
            </div>
        </div>
    </div>
</div>
`;

export const signInRender = (): string => {
	const template = Handlebars.compile(templateSource);
	return template(authData);
};

export const signInMount = (): void => {
	const eventBus = new EventBus();
	const inputWrapper = document.getElementById("input-wrapper");
	const form = document.getElementById("auth-form") as HTMLFormElement;

	if (inputWrapper) {
		authData.fields.forEach((field: InputProps) => {
			const inputComponent = new Input(field, eventBus);
			inputWrapper.appendChild(inputComponent.getElement());
		});
	}

	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			const formData = new FormData(form);
			const login = formData.get("login") as string;
			const password = formData.get("password") as string;

			try {
				await signIn({ login, password });
				window.location.href = "/chat";
			} catch (err) {
				console.error("Ошибка при отправке запроса:", err);
				alert("Сервер недоступен. Попробуйте позже.");
			}
		});
	}
};
