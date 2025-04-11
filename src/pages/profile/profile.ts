import Handlebars from "handlebars";
import { Input, InputProps } from "../../components/Input/Input";
import { EventBus } from "../../components/EventBus";
import {
	API_BASE,
	fetchCurrentUser,
	updateUserAvatar,
} from "pages/chat/utils/api";

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
};

const templateSource = `
<div class="container">
  <div class="profile">
    <header class="title-wrap">
      <a href="/chat">Вернуться к чатам</a>
      <h1>Профиль: <span class="profile__login">{{login}}</span></h1>  
    </header>

    <form id="profile-form">
      <div class="profile__avatar">
        <img id="user-avatar" src="{{avatarUrl}}" alt="Аватар" class="profile__avatar-img" />

		<div class="action__wrap">
			<input type="file" id="avatar-input" accept="image/*" />
			<button type="button" id="avatar-save-btn">Сохранить аватар</button>
		</div>
      </div>

	  <hr />

      <div class="input__wrap" id="input-wrapper"></div>

      <div class="button__wrap">
        <button type="submit" class="button__white">Сохранить изменения</button>
      </div>
    </form>

    <hr />

    <div class="profile__action">
      <button id="logout-btn">Выйти из профиля</button>
    </div>
  </div>
</div>
`;

export const render = (): string => {
	const template = Handlebars.compile(templateSource);
	return template({});
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

	const avatarUrl = userData.avatar
		? `${API_BASE}/resources${userData.avatar}`
		: "/images/avatar.webp";

	document.body.innerHTML = render();

	const loginElement = document.createElement("span");
	loginElement.classList.add("profile__login");
	loginElement.textContent = userData.login || "";

	const h1Element = document.querySelector(".profile h1");
	if (h1Element) {
		h1Element.appendChild(loginElement);
	}

	const eventBus = new EventBus();
	const inputWrapper = document.getElementById("input-wrapper");
	const form = document.getElementById("profile-form") as HTMLFormElement;
	const logoutBtn = document.getElementById("logout-btn");

	const userAvatarElement = document.getElementById(
		"user-avatar",
	) as HTMLImageElement;
	if (userAvatarElement) {
		userAvatarElement.src = avatarUrl;
	}

	const avatarInput = document.getElementById(
		"avatar-input",
	) as HTMLInputElement;
	const avatarSaveBtn = document.getElementById("avatar-save-btn");

	if (avatarInput && avatarSaveBtn) {
		avatarSaveBtn.addEventListener("click", async () => {
			if (avatarInput.files && avatarInput.files[0]) {
				const formData = new FormData();
				formData.append("avatar", avatarInput.files[0]);

				try {
					await updateUserAvatar(formData);
					alert("Аватар успешно обновлен");

					const updatedUserData = await fetchCurrentUser();
					const updatedAvatarUrl = updatedUserData.avatar
						? `${API_BASE}/resources${updatedUserData.avatar}`
						: "/static/images/avatar.webp";
					if (userAvatarElement) {
						userAvatarElement.src = updatedAvatarUrl;
					}
				} catch (err) {
					console.error("Ошибка при обновлении аватара:", err);
					alert("Не удалось обновить аватар");
				}
			}
		});
	}

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

					for (const field of profileData.fields) {
						const inputElement = document.querySelector(
							`input[name=${field.name}]`,
						) as HTMLInputElement | null;
						if (inputElement) {
							userData[field.name] = inputElement.value;
						}
					}

					loginElement.textContent = userData.login || "";
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
