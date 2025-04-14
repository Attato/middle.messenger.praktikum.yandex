import {
	fetchChats,
	createChat,
	deleteChat,
	addUserToChat,
	removeUserFromChat,
	checkUserExists,
	getChatUsers,
	fetchCurrentUser,
	getChatToken,
	updateUserAvatar,
	updateChatAvatar,
} from "./api";
import { Chat } from "pages/chat/utils/interfaces";

import { API_BASE } from "../../../api/api";

global.fetch = jest.fn();

describe("API Чатов", () => {
	beforeEach(() => {
		(fetch as jest.Mock).mockClear();
	});

	test("fetchChats должен вернуть список чатов", async () => {
		const mockChats: Chat[] = [
			{
				id: 1,
				title: "Клуб почитателей",
				avatar: null,
				lastMessage: "Флоппи",
				lastMessageTime: "2025-04-14T10:00:00Z",
				messages: [],
			},
			{
				id: 2,
				title: "Клуб пописателей",
				avatar: null,
				lastMessage: "Превысокомногорассмотрительствующий",
				lastMessageTime: "2025-04-14T11:00:00Z",
				messages: [],
			},
		];

		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockChats,
		});

		const result = await fetchChats();

		expect(result).toEqual(mockChats);
		expect(fetch).toHaveBeenCalledWith(`${API_BASE}/chats`, expect.any(Object));
	});

	test("fetchChats должен выбросить ошибку при неудачном ответе", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: async () => ({ message: "Server Error" }),
		});

		await expect(fetchChats()).rejects.toThrow("Ошибка 500");
	});

	test("createChat должен успешно создать чат", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ id: 3, title: "Клуб почитателей" }),
		});

		await createChat("Клуб почитателей");

		expect(fetch).toHaveBeenCalledWith(
			`${API_BASE}/chats`,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ title: "Клуб почитателей" }),
			}),
		);
	});

	test("deleteChat должен успешно удалить чат", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
		});

		await deleteChat(1);

		expect(fetch).toHaveBeenCalledWith(
			`${API_BASE}/chats`,
			expect.objectContaining({
				method: "DELETE",
				body: JSON.stringify({ chatId: 1 }),
			}),
		);
	});

	test("addUserToChat должен добавить пользователя в чат", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
		});

		await addUserToChat(1, 1);

		expect(fetch).toHaveBeenCalledWith(
			`${API_BASE}/chats/users`,
			expect.objectContaining({
				method: "PUT",
				body: JSON.stringify({ users: [1], chatId: 1 }),
			}),
		);
	});

	test("removeUserFromChat должен удалить пользователя из чата", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
		});

		await removeUserFromChat(1, 1);

		expect(fetch).toHaveBeenCalledWith(
			`${API_BASE}/chats/users`,
			expect.objectContaining({
				method: "DELETE",
				body: JSON.stringify({ users: [1], chatId: 1 }),
			}),
		);
	});

	test("checkUserExists должен вернуть true, если пользователь существует", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ id: 1, name: "Болванчик" }),
		});

		const result = await checkUserExists(1);
		expect(result).toBe(true);
	});

	test("getChatUsers должен вернуть список пользователей чата", async () => {
		const mockUsers = [{ id: 1, name: "Болванчик" }];

		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockUsers,
		});

		const result = await getChatUsers(1);
		expect(result).toEqual(mockUsers);
	});

	test("fetchCurrentUser должен вернуть текущего пользователя", async () => {
		const mockUser = { id: 1, name: "Болванчик" };

		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockUser,
		});

		const result = await fetchCurrentUser();
		expect(result).toEqual(mockUser);
	});

	test("getChatToken должен вернуть токен чата", async () => {
		const mockToken = "П-п-пу";

		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ token: mockToken }),
		});

		const result = await getChatToken(1);
		expect(result).toBe(mockToken);
	});

	test("updateUserAvatar должен обновить аватар пользователя", async () => {
		const formData = new FormData();

		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
		});

		await updateUserAvatar(formData);

		expect(fetch).toHaveBeenCalledWith(
			`${API_BASE}/user/profile/avatar`,
			expect.objectContaining({
				method: "PUT",
				body: formData,
			}),
		);
	});

	test("updateChatAvatar должен обновить аватар чата", async () => {
		const formData = new FormData();

		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
		});

		await updateChatAvatar(formData);

		expect(fetch).toHaveBeenCalledWith(
			`${API_BASE}/chats/avatar`,
			expect.objectContaining({
				method: "PUT",
				body: formData,
			}),
		);
	});
});
