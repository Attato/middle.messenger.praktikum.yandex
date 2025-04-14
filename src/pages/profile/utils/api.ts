import { API_BASE, checkResponse } from "../../../api/api";

export const updateProfile = async (payload: Record<string, string>): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE}/user/profile`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(payload),
		});

		checkResponse(response);
	} catch (err) {
		console.error("Ошибка при обновлении профиля:", err);
		throw new Error("Не удалось обновить профиль");
	}
};

export const logout = async (): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});

		checkResponse(response);
	} catch (err) {
		console.error("Ошибка при выходе из профиля:", err);
		throw new Error("Не удалось выйти из профиля");
	}
};
