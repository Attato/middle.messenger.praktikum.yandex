import { getChatToken, fetchCurrentUser } from "pages/chat/utils/api";
import { handleIncomingMessage } from "pages/chat/utils/functions";

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

				console.log("Получено сообщение по WebSocket:", messageData);

				if (messageData.type === "message") {
					handleIncomingMessage(messageData);
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
	if (socket?.readyState === WebSocket.OPEN) {
		fetchCurrentUser().then((currentUser) => {
			socket?.send(
				JSON.stringify({
					content: messageContent,
					type: "message",
					userId: currentUser.id,
					userLogin: currentUser.login,
				}),
			);
		});
	} else {
		console.warn("WebSocket не подключен или закрыт");
	}
};

export const closeConnection = () => {
	if (socket) {
		socket.close();
	}
};
