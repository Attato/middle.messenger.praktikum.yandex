import "pages/error/error.scss";

export const error404Render = (): string => {
	return `
		<main class="error">
            <h1>Ошибка 404!</h1>
            <p>Вы не туда попали.</p>
            <a href="/">Вернуться на главную</a>
        </main>
	`;
};
