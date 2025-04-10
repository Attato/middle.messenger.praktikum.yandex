import { getChatToken, fetchCurrentUser } from "pages/chat/utils/api";
import { addMessageToChat } from "./functions";
import { chatsData, currentChatId } from "../chat";
import { saveMessagesLocally } from "./storage";

let socket: WebSocket | null = null;

export const connectToChat = async (chatId: number) => {
	try {
		const token = await getChatToken(chatId);
		const currentUser = await fetchCurrentUser();

		const wsUrl = `wss://ya-praktikum.tech/ws/chats/${currentUser.id}/${chatId}/${token}`;
		socket = new WebSocket(wsUrl);

		socket.addEventListener("open", () => {
			console.log("WebSocket соединение установлено");
		});

		socket.addEventListener("close", (event) => {
			if (event.wasClean) {
				console.log(`Соединение закрыто чисто, код: ${event.code}`);
			} else {
				console.warn("Соединение прервано");
			}
		});

		socket.addEventListener("error", (error) => {
			console.error("WebSocket ошибка:", error);
		});

		socket.addEventListener("message", (event) => {
			try {
				const messageData = JSON.parse(event.data);

				if (messageData.type === "message") {
					addMessageToChat(messageData, chatsData);

					saveMessagesLocally(
						currentChatId!,
						chatsData.find((chat) => chat.id === currentChatId)
							?.messages || [],
					);
				}
			} catch (error) {
				console.error("Ошибка при обработке сообщения:", error);
			}
		});
	} catch (err) {
		console.error("Не удалось подключиться к чату:", err);
	}
};

export const sendMessage = (messageContent: string) => {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(
			JSON.stringify({
				content: messageContent,
				type: "message",
			}),
		);
	} else {
		console.warn("WebSocket не подключен или закрыт");
	}
};

export const closeConnection = () => {
	if (socket) {
		socket.close();
	}
};
