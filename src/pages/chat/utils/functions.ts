import { chatsData } from "pages/chat/chat";

import { connectToChat, sendMessage } from "pages/chat/utils/webSocket";

import {
	addUserToChat,
	removeUserFromChat,
	checkUserExists,
	getChatUsers,
	fetchCurrentUser,
	updateChatAvatar,
	getChatAvatarUrl,
	getUserAvatarUrl,
} from "pages/chat/utils/api";

import { saveMessagesLocally, getMessagesFromLocalStorage } from "pages/chat/utils/storage";

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
				(user) => `
            <li>
              <div class="user-item">
                <img src="${getUserAvatarUrl(user) || "/images/avatar.webp"}" alt="${user.login}" class="user-avatar" />
                <span class="user-login">${user.login}</span> &nbsp; (ID: ${user.id})
                ${user.id === currentUserId ? " (Вы)" : ""}
              </div>
            </li>
          `,
			)
			.join("")}
      </ul>
    `;
	} catch (err) {
		console.error("Ошибка загрузки участников:", err);
		usersListContainer.innerHTML = "<p class='error'>Не удалось загрузить участников</p>";
	}
};

export const loadChatContent = async (chatId: number, chats: Chat[]): Promise<void> => {
	currentChatId = chatId;

	const selectedChat = chats.find((chat) => chat.id === chatId);

	if (!selectedChat) {
		console.error("Чат не найден по ID:", chatId);
		return;
	}

	const chatContent = document.querySelector(".messenger-chat");

	if (chatContent) {
		const messagesHtml = await loadMessagesForChat();

		chatContent.innerHTML = getChatTemplate(selectedChat, messagesHtml);

		updateChatUsers(selectedChat.id);

		const chatAvatar = document.getElementById("chat-avatar") as HTMLImageElement;
		const avatarUrl = getChatAvatarUrl(selectedChat) ?? "/images/avatar.webp";

		if (chatAvatar) {
			chatAvatar.src = `${avatarUrl}?t=${new Date().getTime()}`;
		}

		const avatarFileInput = document.getElementById("avatar-file-input") as HTMLInputElement;
		const saveAvatarButton = document.getElementById("save-avatar-button") as HTMLButtonElement;

		let selectedFile: File | null = null;

		avatarFileInput?.addEventListener("change", (event) => {
			selectedFile = (event.target as HTMLInputElement).files?.[0] ?? null;
		});

		saveAvatarButton?.addEventListener("click", async () => {
			if (selectedFile && currentChatId !== null) {
				try {
					if (!selectedFile.type.startsWith("image/")) {
						alert("Выберите изображение в качестве аватара.");
						return;
					}

					const formData = new FormData();
					formData.append("avatar", selectedFile);
					formData.append("chatId", selectedChat.id.toString());

					await updateChatAvatar(formData);

					const updatedAvatarUrl = await getChatAvatarUrl(selectedChat);

					if (updatedAvatarUrl) {
						const chatAvatar = document.getElementById("chat-avatar") as HTMLImageElement;
						if (chatAvatar) {
							chatAvatar.src = updatedAvatarUrl;
						}

						alert("Аватар успешно обновлен!");
					} else {
						console.error("Не удалось получить URL аватара.");
					}

					location.reload();
				} catch (error) {
					alert("Ошибка при обновлении аватара!");
					console.error(error);
				}
			} else {
				alert("Пожалуйста, выберите изображение перед сохранением.");
			}
		});

		const messageForm = document.getElementById("message-form");
		const messageInput = document.getElementById("message") as HTMLInputElement;

		const userIdInput = document.getElementById("user-id-input") as HTMLInputElement;
		const addUserBtn = document.getElementById("add-user-button") as HTMLButtonElement;
		const removeUserBtn = document.getElementById("remove-user-button") as HTMLButtonElement;

		messageForm?.addEventListener("submit", (event) => {
			event.preventDefault();
			handleSendMessage(chats, messageInput.value);
		});

		messageInput?.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				handleSendMessage(chats, messageInput.value);
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

const formatTime = (time: Date | string): string => {
	const date = new Date(time);
	if (isNaN(date.getTime())) {
		return "Время поломалось.";
	}
	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
};

const formatMessage = async (messageData: Partial<Message>, typeOverride?: "sent" | "received"): Promise<Message> => {
	const currentUser = await fetchCurrentUser();

	return {
		content: messageData.content ?? "",
		time: messageData.time ? formatTime(messageData.time) : formatTime(new Date()),
		type: typeOverride ?? (messageData.userId === currentUser.id ? "sent" : "received"),
		userId: messageData.userId ?? currentUser.id,
		userLogin: messageData.userLogin ?? currentUser.login,
	};
};

const renderMessageHtml = (message: Message): string => {
	return `
    <div class="message message-${message.type}">
      <div class="message-sender">
        <span class="message-sender-login">${message.userLogin}</span> 
        <span class="message-sender-id">(ID: ${message.userId})</span>
      </div>

      <div class="message-content">
        <p>${message.content}</p>
        <span class="message-time">${message.time}</span>
      </div>
    </div>`;
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

		return savedMessages.map(renderMessageHtml).join("");
	} catch (err) {
		console.error("Ошибка при загрузке сообщений:", err);
		return `<div class="error">Не удалось загрузить сообщения</div>`;
	}
};

const scrollChatToBottom = (): void => {
	const container = document.querySelector(".chat-messages");
	if (container) {
		container.scrollTop = container.scrollHeight;
	}
};

const removeNoMessagesInfo = (): void => {
	const noMessagesInfo = document.querySelector(".no-messages-info");
	if (noMessagesInfo) {
		noMessagesInfo.remove();
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
			chatMessagesContainer.innerHTML += renderMessageHtml(message);
		}

		removeNoMessagesInfo();
		scrollChatToBottom();
	}
};

const handleSendMessage = async (chats: Chat[], messageContent: string): Promise<void> => {
	const messageInput = document.getElementById("message") as HTMLInputElement;
	const messageContentFinal = messageContent.trim();

	if (messageContentFinal && currentChatId !== null) {
		const currentUser = await fetchCurrentUser();
		const newMessage = await formatMessage({ content: messageContentFinal, userLogin: currentUser.login }, "sent");

		addMessageToChat(newMessage, chats);
		sendMessage(messageContentFinal);

		messageInput.value = "";

		const messengerChat = document.querySelector(".messenger-chat");
		if (messengerChat) {
			messengerChat.scrollTop = messengerChat.scrollHeight;
		}
		messageInput.focus();
	}
};

export const handleIncomingMessage = async (messageData: Message): Promise<void> => {
	if (currentChatId === null) return;

	const currentUser = await fetchCurrentUser();
	const currentUserId = currentUser.id;

	if (messageData.userId === currentUserId) {
		return;
	}

	const message = await formatMessage(messageData);

	addMessageToChat(message, chatsData);
};
