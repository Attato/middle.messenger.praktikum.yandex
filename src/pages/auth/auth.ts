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

const sourceElement = document.getElementById("auth-template");
const authElement = document.getElementById("auth");

if (sourceElement && authElement) {
	const template = Handlebars.compile(sourceElement.innerHTML);
	authElement.innerHTML = template(context);
}
