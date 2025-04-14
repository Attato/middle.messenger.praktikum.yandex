export const API_BASE = "https://ya-praktikum.tech/api/v2";

export const checkResponse = (response: Response) => {
	if (!response.ok) {
		throw new Error(`Ошибка ${response.status}`);
	}

	return response;
};

export const checkAuthStatus = async (): Promise<boolean> => {
	const response = await fetch(`${API_BASE}/auth/user`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	try {
		checkResponse(response);
		const data = await response.json();
		return !!data?.id;
	} catch (err) {
		console.error("Ошибка при проверке авторизации:", err);
		return false;
	}
};
