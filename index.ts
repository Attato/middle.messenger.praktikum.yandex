import Handlebars from "handlebars";

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
		},
	],
	whiteButton: "Авторизоваться",
	grayButton: "Нет аккаунта?",
	whiteButtonLink: "/src/pages/chat/chat.html",
	grayButtonLink: "/src/pages/auth/signup.html",
};

const templateElement = document.getElementById("auth-template");
const container = document.getElementById("auth-container");

if (templateElement && container) {
	const template = Handlebars.compile(templateElement.innerHTML);
	container.innerHTML = template(authData);
}
