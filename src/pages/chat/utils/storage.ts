import { Message } from "pages/chat/utils/interfaces";

export const saveMessagesLocally = (
	chatId: number,
	messages: Message[],
): void => {
	const messagesString = JSON.stringify(messages);
	localStorage.setItem(`chat_${chatId}_messages`, messagesString);
};

export const getMessagesFromLocalStorage = (chatId: number): Message[] => {
	const messagesString = localStorage.getItem(`chat_${chatId}_messages`);
	if (messagesString) {
		return JSON.parse(messagesString);
	}
	return [];
};

export const deleteMessagesFromLocalStorage = (chatId: number): void => {
	localStorage.removeItem(`chat_${chatId}_messages`);
};
