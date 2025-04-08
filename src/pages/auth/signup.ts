import Handlebars from "handlebars";
import { Input, InputProps } from "../../components/Input/Input";
import { EventBus } from "../../components/EventBus";
import { attachValidationToForm } from "pages/auth/utils/formValidator";

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

export const render = (): string => {
	const template = Handlebars.compile(templateSource);
	return template(signUpData);
};

export const mount = (): void => {
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
			const payload: Record<string, string> = {};

			signUpData.fields.forEach((field) => {
				const value = formData.get(field.name);
				if (value) {
					payload[field.name] = value.toString();
				}
			});

			try {
				const response = await fetch(
					"https://ya-praktikum.tech/api/v2/auth/signup",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify(payload),
					},
				);

				if (response.ok) {
					window.location.href = "/chat";
				} else {
					const error = await response.json();
					alert(`Ошибка: ${error.reason}`);
				}
			} catch (err) {
				console.error("Ошибка при регистрации:", err);
				alert("Сервер недоступен. Попробуйте позже.");
			}
		});
	}
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		document.body.innerHTML = render();
		mount();
	});
} else {
	document.body.innerHTML = render();
	mount();
}
