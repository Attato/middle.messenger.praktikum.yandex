import { Chat } from "pages/chat/utils/interfaces";

export const API_BASE = "https://ya-praktikum.tech/api/v2";

const checkResponse = (response: Response) => {
	if (!response.ok) {
		throw new Error(`Ошибка ${response.status}`);
	}

	return response;
};

export const fetchChats = async (): Promise<Chat[]> => {
	const response = await fetch(`${API_BASE}/chats`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const checkedResponse = checkResponse(response);
	return checkedResponse.json();
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

	await checkResponse(response);
};

export const deleteChat = async (chatId: number): Promise<void> => {
	const response = await fetch(`${API_BASE}/chats`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ chatId }),
	});

	await checkResponse(response);
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

	await checkResponse(response);
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

	await checkResponse(response);
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

	await checkResponse(response);
	return response.json();
};

export const fetchCurrentUser = async () => {
	const response = await fetch(`${API_BASE}/auth/user`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	await checkResponse(response);
	return response.json();
};

export const getChatToken = async (chatId: number): Promise<string> => {
	const response = await fetch(`${API_BASE}/chats/token/${chatId}`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	await checkResponse(response);

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

export const updateUserAvatar = async (formData: FormData): Promise<void> => {
	const response = await fetch(
		"https://ya-praktikum.tech/api/v2/user/profile/avatar",
		{
			method: "PUT",
			body: formData,
			credentials: "include",
		},
	);

	await checkResponse(response);
};

export const updateChatAvatar = async (formData: FormData): Promise<void> => {
	const response = await fetch(`${API_BASE}/chats/avatar`, {
		method: "PUT",
		body: formData,
		credentials: "include",
	});

	await checkResponse(response);
};
