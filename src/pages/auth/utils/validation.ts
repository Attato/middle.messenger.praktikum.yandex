const validationRules: Record<string, (value: string) => string | null> = {
	first_name: (value) => {
		const regex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/;
		return regex.test(value)
			? ""
			: "* Имя должно быть на латинице или кириллице, начинаться с заглавной буквы и не содержать пробелов, цифр или спецсимволов.";
	},
	second_name: (value) => {
		const regex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/;
		return regex.test(value)
			? ""
			: "* Фамилия должна быть на латинице или кириллице, начинаться с заглавной буквы и не содержать пробелов, цифр или спецсимволов.";
	},
	login: (value) => {
		const regex = /^(?!^\d+$)[A-Za-z0-9-_]{3,20}$/;
		return regex.test(value)
			? ""
			: "* Логин должен содержать от 3 до 20 символов, быть на латинице, может включать цифры, дефис и подчёркивание, но не состоять только из цифр.";
	},
	email: (value) => {
		const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		return regex.test(value) ? "" : "* Введите корректный email.";
	},
	password: (value) => {
		const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/;
		return regex.test(value)
			? ""
			: "* Пароль должен быть от 8 до 40 символов, содержать хотя бы одну заглавную букву и цифру.";
	},
	phone: (value) => {
		const regex = /^\+?\d{10,15}$/;
		return regex.test(value) ? "" : "* Телефон должен содержать от 10 до 15 цифр и может начинаться со знака +.";
	},
	message: (value) => {
		return value.trim() !== "" ? "" : "* Сообщение не должно быть пустым.";
	},
};

export function validateField(name: string, value: string): string | null {
	const validate = validationRules[name];
	return validate ? validate(value) : "";
}
