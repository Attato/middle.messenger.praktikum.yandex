import { API_BASE } from "../../../api/apiBase";

export const checkAuthStatus = async (): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE}/auth/user`, {
			method: "GET",
			credentials: "include",
			mode: "cors",
		});

		if (!response.ok) return false;

		const data = await response.json();
		return !!data?.id;
	} catch (err) {
		console.error("Ошибка при проверке авторизации:", err);
		return false;
	}
};
