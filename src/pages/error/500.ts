import "pages/error/error.scss";

export const error500Render = (): string => {
	return `
		<main class="error">
            <h1>Ошибка 500!</h1>
            <p>Мы уже фиксим.</p>
            <a href="/">Вернуться на главную</a>
        </main>
	`;
};
