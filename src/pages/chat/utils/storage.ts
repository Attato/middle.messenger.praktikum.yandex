import { Chat } from "./interfaces";
import { initialChats } from "./data";

export const loadChatsFromStorage = (): Chat[] => {
	const chatsData = localStorage.getItem("chats");
	return chatsData ? JSON.parse(chatsData) : initialChats;
};
export const saveChatsToStorage = (chats: Chat[]): void => {
	localStorage.setItem("chats", JSON.stringify(chats));
};

export const loadCurrentChatId = (): number | null => {
	const savedChatId = localStorage.getItem("currentChatId");
	return savedChatId !== null ? Number(savedChatId) : null;
};

export const saveCurrentChatId = (chatId: number): void => {
	localStorage.setItem("currentChatId", String(chatId));
};
