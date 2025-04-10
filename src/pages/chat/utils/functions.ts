import { chatsData } from "pages/chat/chat";

import { connectToChat, sendMessage } from "pages/chat/utils/webSocket";

import {
	addUserToChat,
	removeUserFromChat,
	checkUserExists,
	getChatUsers,
	fetchCurrentUser,
} from "pages/chat/utils/api";

import {
	saveMessagesLocally,
	getMessagesFromLocalStorage,
} from "pages/chat/utils/storage";

import { Chat, Message } from "pages/chat/utils/interfaces";

import { getChatTemplate } from "pages/chat/utils/getChatTemplate";

export let currentChatId: number | null = null;

export const updateChatUsers = async (chatId: number): Promise<void> => {
	const usersListContainer = document.getElementById("chat-users-list");
	if (!usersListContainer) return;

	usersListContainer.innerHTML = `<div class="loader">Загрузка участников...</div>`;

	try {
		const users = await getChatUsers(chatId);

		const currentUser = await fetchCurrentUser();
		const currentUserId = currentUser.id;

		usersListContainer.innerHTML = `
      <h4>Участники чата:</h4>
      <ul>
        ${users
			.map(
				(user) =>
					`<li>${user.login} (ID: ${user.id})${user.id === currentUserId ? " (Вы)" : ""}</li>`,
			)
			.join("")}
      </ul>
    `;
	} catch (err) {
		console.error("Ошибка загрузки участников:", err);
		usersListContainer.innerHTML =
			"<p class='error'>Не удалось загрузить участников</p>";
	}
};

export const loadChatContent = async (
	chatId: number,
	chats: Chat[],
): Promise<void> => {
	currentChatId = chatId;

	const selectedChat = chatsData.find((chat) => chat.id === chatId);

	if (!selectedChat) {
		console.error("Чат не найден по ID:", chatId);
		return;
	}

	const chatContent = document.querySelector(".messenger__chat");

	if (chatContent) {
		const messagesHtml = await loadMessagesForChat();

		chatContent.innerHTML = getChatTemplate(selectedChat, messagesHtml);

		updateChatUsers(selectedChat.id);

		const messageForm = document.getElementById("message-form");
		const messageInput = document.getElementById(
			"message",
		) as HTMLInputElement;

		const userIdInput = document.getElementById(
			"user-id-input",
		) as HTMLInputElement;
		const addUserBtn = document.getElementById(
			"add-user-button",
		) as HTMLButtonElement;
		const removeUserBtn = document.getElementById(
			"remove-user-button",
		) as HTMLButtonElement;

		messageForm?.addEventListener("submit", (event) => {
			event.preventDefault();
			sendMessageToChatHandler(chats);
		});

		messageInput?.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				sendMessageToChatHandler(chats);
			}
		});

		addUserBtn?.addEventListener("click", async (e) => {
			e.preventDefault();
			if (!userIdInput.value || currentChatId === null) return;

			const userId = Number(userIdInput.value);
			const chatId = selectedChat.id;

			try {
				const exists = await checkUserExists(userId);
				if (!exists) {
					alert("Пользователь с таким ID не найден");
					return;
				}
				await addUserToChat(userId, chatId);
				alert("Пользователь добавлен в чат");
				userIdInput.value = "";

				await updateChatUsers(chatId);
			} catch (err) {
				console.error(err);
				alert("Ошибка при добавлении пользователя");
			}
		});

		removeUserBtn?.addEventListener("click", async () => {
			if (!userIdInput.value || currentChatId === null) return;

			const userId = Number(userIdInput.value);
			const chatId = selectedChat.id;

			try {
				const currentUser = await fetchCurrentUser();
				const currentUserId = currentUser.id;

				if (userId === currentUserId) {
					alert("Вы не можете удалить себя из чата");
					return;
				}

				await removeUserFromChat(userId, chatId);
				alert("Пользователь удалён из чата");
				userIdInput.value = "";

				await updateChatUsers(chatId);
			} catch (err) {
				console.error(err);
				alert("Не удалось удалить пользователя");
			}
		});
	}

	connectToChat(chatId);
};

export const loadMessagesForChat = async (): Promise<string> => {
	if (currentChatId === null) {
		return `<div class="no-messages-info"><p>Сообщений пока нет</p></div>`;
	}

	try {
		const savedMessages = getMessagesFromLocalStorage(currentChatId);

		if (savedMessages.length === 0) {
			return `<div class="no-messages-info"><p>Сообщений пока нет</p></div>`;
		}

		return savedMessages
			.map(
				(message) => `
          <div class="message message--${message.type}">
            <div class="message__sender">
              <span class="message__sender-login">${message.userLogin}</span> 
              <span class="message__sender-id">(ID: ${message.userId})</span>
            </div>

            <div class="message__content">
              <p>${message.content}</p>
              <span class="message__time">${message.time}</span>
            </div>
          </div>`,
			)
			.join("");
	} catch (err) {
		console.error("Ошибка при загрузке сообщений:", err);
		return `<div class="error">Не удалось загрузить сообщения</div>`;
	}
};

const addMessageToChat = (message: Message, chats: Chat[]): void => {
	console.log(message);

	if (currentChatId !== null) {
		const selectedChat = chats.find((chat) => chat.id === currentChatId);

		if (!selectedChat) {
			console.error("Чат с таким ID не найден:", currentChatId);
			return;
		}

		if (!selectedChat.messages) {
			selectedChat.messages = [];
		}

		selectedChat.messages.push(message);

		saveMessagesLocally(currentChatId, selectedChat.messages);

		const chatMessagesContainer = document.querySelector(".chat-messages");

		selectedChat.lastMessage = message.content;
		selectedChat.lastMessageTime = message.time;

		if (chatMessagesContainer) {
			const newMessageHtml = `
        <div class="message message--${message.type}">
          <div class="message__sender">
            <span class="message__sender-login">${message.userLogin}</span> 
            <span class="message__sender-id">(ID: ${message.userId})</span>
          </div>

          <div class="message__content">
            <p>${message.content}</p>
            <span class="message__time">${message.time}</span>
          </div>
        </div>`;
			chatMessagesContainer.innerHTML += newMessageHtml;

			chatMessagesContainer.scrollTop =
				chatMessagesContainer.scrollHeight;
		}

		const noMessagesInfo = document.querySelector(".no-messages-info");
		if (noMessagesInfo) {
			noMessagesInfo.remove();
		}
	}
};

export const sendMessageToChatHandler = async (
	chats: Chat[],
): Promise<void> => {
	const messageInput = document.getElementById("message") as HTMLInputElement;
	const messageContent = messageInput.value.trim();

	if (messageContent && currentChatId !== null) {
		const currentUser = await fetchCurrentUser();
		const newMessage: Message = {
			content: messageContent,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "sent",
			userId: currentUser.id,
			userLogin: currentUser.login,
		};

		addMessageToChat(newMessage, chats);
		messageInput.value = "";

		sendMessage(messageContent);

		const messengerChat = document.querySelector(".messenger__chat");
		if (messengerChat) {
			messengerChat.scrollTop = messengerChat.scrollHeight;
		}
		messageInput.focus();
	}
};
