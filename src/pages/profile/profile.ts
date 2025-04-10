import Handlebars from "handlebars";
import { Input, InputProps } from "../../components/Input/Input";
import { EventBus } from "../../components/EventBus";
import { fetchCurrentUser } from "pages/chat/utils/api";

import "pages/profile/profile.scss";

const profileData = {
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
			label: "Телефон",
			type: "tel",
			name: "phone",
			placeholder: "+7 (999) 123-45-67",
		},
	],
	whiteButton: "Сохранить изменения",
	grayButton: "Выйти из аккаунта",
};

const templateSource = `
<div class="container">
	<div class="profile">
		<header class="title-wrap">
			<a href="/chat">Вернуться к чатам</a>
			<h1>
				{{title}} 
				<span class="profile__login">{{login}}</span>
			</h1>	
		</header>

		<form id="profile-form">
			<div class="input__wrap" id="input-wrapper"></div>
			
			<div class="button__wrap">
				<button type="submit" class="button__white">{{whiteButton}}</button>
			</div>
		</form>

		<hr />

		<div class="profile__action">
			<button id="logout-btn">{{grayButton}}</button>
		</div>
	</div>
</div>
`;

export const render = (profileData: Record<string, any>): string => {
	const template = Handlebars.compile(templateSource);
	return template(profileData);
};

export const mount = async (): Promise<void> => {
	let userData: Record<string, string> = {};
	try {
		userData = await fetchCurrentUser();
	} catch (err) {
		console.error("Не удалось получить данные пользователя", err);
		alert("Ошибка загрузки профиля");
		return;
	}

	// Теперь мы устанавливаем title в объект profileData
	const profileDataWithUser = {
		...profileData,
		title: `Профиль:`,
		login: userData.login,
	};

	// Рендерим шаблон с обновленными данными
	document.body.innerHTML = render(profileDataWithUser);

	const eventBus = new EventBus();
	const inputWrapper = document.getElementById("input-wrapper");
	const form = document.getElementById("profile-form") as HTMLFormElement;
	const logoutBtn = document.getElementById("logout-btn");

	if (inputWrapper) {
		profileData.fields.forEach((field: InputProps) => {
			const value = userData[field.name] || "";
			const inputComponent = new Input({ ...field, value }, eventBus);
			inputWrapper.appendChild(inputComponent.getElement());
		});
	}

	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			const formData = new FormData(form);
			const payload: Record<string, string> = {};

			profileData.fields.forEach((field) => {
				const value = formData.get(field.name);
				if (value) {
					payload[field.name] = value.toString();
				}
			});

			try {
				const response = await fetch(
					"https://ya-praktikum.tech/api/v2/user/profile",
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify(payload),
					},
				);

				if (response.ok) {
					alert("Данные профиля обновлены");
				} else {
					const error = await response.json();
					alert(`Ошибка: ${error.reason}`);
				}
			} catch (err) {
				console.error("Ошибка при обновлении профиля:", err);
				alert("Не удалось сохранить изменения");
			}
		});
	}

	if (logoutBtn) {
		logoutBtn.addEventListener("click", async () => {
			const confirmed = confirm("Вы точно хотите выйти?");
			if (!confirmed) return;

			try {
				const res = await fetch(
					"https://ya-praktikum.tech/api/v2/auth/logout",
					{
						method: "POST",
						credentials: "include",
					},
				);

				if (res.ok) {
					window.location.href = "/";
				} else {
					const error = await res.json();
					alert("Ошибка: " + error.reason);
				}
			} catch (err) {
				console.error("Ошибка при выходе:", err);
			}
		});
	}
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		mount();
	});
} else {
	mount();
}
