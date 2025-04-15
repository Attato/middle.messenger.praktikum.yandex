import Handlebars from "handlebars";
import { Input, InputProps } from "../../components/Input/Input";
import { EventBus } from "../../components/EventBus";
import { attachValidationToForm } from "pages/auth/utils/formValidator";

import { signUp } from "./utils/api";

import "pages/auth/auth.scss";

const signUpData = {
	title: "Регистрация",
	fields: [
		{ label: "Имя", type: "text", name: "first_name", placeholder: "Вася" },
		{
			label: "Фамилия",
			type: "text",
			name: "second_name",
			placeholder: "Пупкин",
		},
		{ label: "Логин", type: "text", name: "login", placeholder: "krutoi" },
		{
			label: "Почта",
			type: "text",
			name: "email",
			placeholder: "krutoi@example.com",
		},
		{
			label: "Пароль",
			type: "password",
			name: "password",
			placeholder: "******",
			autocomplete: "on",
		},
		{
			label: "Телефон",
			type: "tel",
			name: "phone",
			placeholder: "+ 7 (987) 654-32-10",
		},
	],
	whiteButton: "Зарегистрироваться",
	whiteButtonLink: "/chat",
	grayButton: "Вернуться",
	grayButtonLink: "/",
};

const templateSource = ` 
<div class="container">
    <div class="auth">
        <div class="auth-wrap">
            <h1 class="auth-title">{{title}}</h1>

            <form id="auth-form">
                <div class="input-wrap" id="input-wrapper"></div>
                <button type="submit" class="button-white">{{whiteButton}}</button>
            </form>

            <div class="auth-actions">
                <hr />
                <a href="{{grayButtonLink}}" class="button-gray">{{grayButton}}</a>
            </div>
        </div>
    </div>
</div>
`;

export const signUpRender = (): string => {
	const template = Handlebars.compile(templateSource);
	return template(signUpData);
};

export const signUpMount = (): void => {
	const eventBus = new EventBus();
	const inputWrapper = document.getElementById("input-wrapper");
	const form = document.getElementById("auth-form") as HTMLFormElement;

	if (inputWrapper) {
		signUpData.fields.forEach((field: InputProps) => {
			const inputComponent = new Input(field, eventBus);
			inputWrapper.appendChild(inputComponent.getElement());
		});
	}

	if (form) {
		attachValidationToForm(form);

		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			const formData = new FormData(form);

			try {
				await signUp({
					first_name: formData.get("first_name")?.toString() || "",
					second_name: formData.get("second_name")?.toString() || "",
					login: formData.get("login")?.toString() || "",
					email: formData.get("email")?.toString() || "",
					password: formData.get("password")?.toString() || "",
					phone: formData.get("phone")?.toString() || "",
				});

				window.location.href = "/chat";
			} catch (err) {
				console.error("Ошибка при регистрации:", err);
				alert("Сервер недоступен. Попробуйте позже.");
			}
		});
	}
};
