export const checkAuthStatus = async (): Promise<boolean> => {
	try {
		const response = await fetch(
			"https://ya-praktikum.tech/api/v2/auth/user",
			{
				method: "GET",
				credentials: "include",
				mode: "cors",
			},
		);

		if (!response.ok) return false;

		const data = await response.json();
		return !!data?.id;
	} catch (err) {
		console.error("Ошибка при проверке авторизации:", err);
		return false;
	}
};
