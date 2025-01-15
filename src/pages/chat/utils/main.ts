import {
	loadChatsFromStorage,
	saveCurrentChatId,
	loadCurrentChatId,
} from "./storage";
import { renderTemplate } from "./templates";
import { loadChatContent } from "./chat";
import { initModals } from "./modals";
import { Chat } from "./interfaces";

let chats: Chat[] = loadChatsFromStorage();

document.addEventListener("DOMContentLoaded", () => {
	const chatContainer = document.getElementById("chat");
	if (chatContainer) renderTemplate("chat-template", chats, chatContainer);

	const restoreChatState = () => {
		const savedChatId = loadCurrentChatId();
		if (savedChatId !== null) {
			loadChatContent(savedChatId, chats);
		}
	};

	restoreChatState();

	chatContainer?.addEventListener("click", (event) => {
		const chatLink = (event.target as HTMLElement).closest(".chat-link");
		if (chatLink) {
			const chatId = chatLink.getAttribute("data-chat-id");
			if (chatId) {
				loadChatContent(Number(chatId), chats);
				saveCurrentChatId(Number(chatId));
			}
		}
	});

	initModals();
});
