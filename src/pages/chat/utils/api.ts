import { Chat } from "pages/chat/utils/interfaces";

export const API_BASE = "https://ya-praktikum.tech/api/v2";

export const fetchChats = async (): Promise<Chat[]> => {
	const response = await fetch(`${API_BASE}/chats`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		throw new Error(`Ошибка загрузки чатов: ${response.status}`);
	}
	return response.json();
};

export const createChat = async (title: string): Promise<void> => {
	const response = await fetch(`${API_BASE}/chats`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title }),
	});

	if (!response.ok) {
		throw new Error(`Ошибка создания чата: ${response.status}`);
	}
};

export const deleteChat = async (chatId: number): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE}/chats`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ chatId }),
		});

		if (!response.ok) {
			throw new Error(`Ошибка удаления чата: ${response.status}`);
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const addUserToChat = async (
	userId: number,
	chatId: number,
): Promise<void> => {
	const response = await fetch(`${API_BASE}/chats/users`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ users: [userId], chatId }),
	});
	if (!response.ok) {
		throw new Error(`Ошибка добавления пользователя: ${response.status}`);
	}
};

export const removeUserFromChat = async (
	userId: number,
	chatId: number,
): Promise<void> => {
	const response = await fetch(`${API_BASE}/chats/users`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ users: [userId], chatId }),
	});
	if (!response.ok) {
		throw new Error(`Ошибка удаления пользователя: ${response.status}`);
	}
};

export const checkUserExists = async (userId: number): Promise<boolean> => {
	const response = await fetch(`${API_BASE}/user/${userId}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.ok;
};

export const getChatUsers = async (chatId: number): Promise<any[]> => {
	const response = await fetch(`${API_BASE}/chats/${chatId}/users`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		throw new Error(`Ошибка получения участников: ${response.status}`);
	}
	return response.json();
};

export const fetchCurrentUser = async () => {
	const response = await fetch(`${API_BASE}/auth/user`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Ошибка получения пользователя: ${response.status}`);
	}

	const user = await response.json();
	return user;
};

export const getChatToken = async (chatId: number): Promise<string> => {
	const response = await fetch(`${API_BASE}/chats/token/${chatId}`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Ошибка получения токена чата: ${response.status}`);
	}

	const data = await response.json();
	return data.token;
};

export const getAvatarUrl = (avatarPath: string | null): string | null => {
	if (!avatarPath) return null;
	return `${API_BASE}/resources${avatarPath}`;
};

export const getUserAvatarUrl = (user: {
	avatar: string | null;
}): string | null => {
	return getAvatarUrl(user.avatar);
};

export const getChatAvatarUrl = (chat: {
	avatar: string | null;
}): string | null => {
	return getAvatarUrl(chat.avatar);
};

export const updateUserAvatar = (formData: FormData): Promise<void> => {
	return fetch("https://ya-praktikum.tech/api/v2/user/profile/avatar", {
		method: "PUT",
		body: formData,
		credentials: "include",
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((error) => {
					throw new Error(error.reason || "Неизвестная ошибка");
				});
			}
		})
		.catch((err) => {
			console.error("Ошибка при обновлении аватара:", err);
			alert("Ошибка при обновлении аватара: " + err.message);
		});
};

export const updateChatAvatar = async (formData: FormData): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE}/chats/avatar`, {
			method: "PUT",
			body: formData,
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`Ошибка при обновлении аватара: ${errorData.reason || response.status}`,
			);
		}

		const newAvatarUrl: string | null = await getChatAvatarUrl({
			avatar: formData.get("avatar")?.toString() ?? null,
		});

		const chatAvatar = document.getElementById(
			"chat-avatar",
		) as HTMLImageElement;
		if (chatAvatar && newAvatarUrl) {
			chatAvatar.src = newAvatarUrl;
		}
	} catch (error) {
		console.error(error);
		alert("Ошибка при обновлении аватара!");
	}
};
