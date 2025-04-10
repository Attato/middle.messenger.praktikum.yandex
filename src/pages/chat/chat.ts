import Handlebars from "handlebars";
import { EventBus } from "../../components/EventBus";
import { Chat, Message } from "pages/chat/utils/interfaces";
import { ChatItem } from "../../components/ChatItem/ChatItem";

import {
	fetchChats,
	createChat,
	deleteChat,
	addUserToChat,
	removeUserFromChat,
	checkUserExists,
	getChatUsers,
	fetchCurrentUser,
} from "pages/chat/utils/api";

import { connectToChat, sendMessage } from "./utils/webSocket";
import "pages/chat/chat.scss";

export let currentChatId: number | null = null;
export let chatsData: Chat[] = [];

const templateSource = `
<div class="messenger">
	<div class="messenger__sidebar" id="messenger__sidebar">
		<a href="/profile">Профиль</a>
		<form id="create-chat-form" class="create-chat-form">
			<input 
				type="text" 
				id="new-chat-title" 
				placeholder="Новый чат..." 
				required 
			/>
			<button type="submit">+</button>
		</form>
	</div>
	<div class="messenger__chat"></div>
</div>
`;

const getChatTemplate = (selectedChat: Chat, messagesHtml: string): string => `
    <header class="chat-header">
        <h2>${selectedChat.title} (ID: ${selectedChat.id})</h2>

		<form id="chat-users-form" class="chat-users-form">
			<div class="chat-users" id="chat-users-list"></div>

			<div class="user-management">
				<input type="number" id="user-id-input" placeholder="ID пользователя" required />

				<div class="buttons">
					<button type="submit" id="add-user-button">Добавить</button>
					<button type="button" id="remove-user-button">Удалить</button>
				</div>
			</div>
		</form>
    </header>


    <div class="chat-messages">
        ${messagesHtml}
    </div>
    <footer class="chat-footer">
        <form id="message-form" class="message-form">
            <input 
                type="text" 
                name="message" 
                id="message" 
                class="message-form__input" 
                placeholder="Введите сообщение..." 
                required
            />
            <button type="submit" class="message-form__send-button">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-2xl">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path>
                </svg>
            </button>
        </form>
    </footer>
`;

const updateChatUsers = async (chatId: number): Promise<void> => {
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

const loadChatContent = async (
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

const loadMessagesForChat = async (): Promise<string> => {
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

const saveMessagesLocally = (chatId: number, messages: Message[]): void => {
	const messagesString = JSON.stringify(messages);
	localStorage.setItem(`chat_${chatId}_messages`, messagesString);
};

const getMessagesFromLocalStorage = (chatId: number): Message[] => {
	const messagesString = localStorage.getItem(`chat_${chatId}_messages`);
	if (messagesString) {
		return JSON.parse(messagesString);
	}
	return [];
};

const deleteMessagesFromLocalStorage = (chatId: number): void => {
	localStorage.removeItem(`chat_${chatId}_messages`);
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

const sendMessageToChatHandler = async (chats: Chat[]): Promise<void> => {
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

export const render = (): string => {
	const template = Handlebars.compile(templateSource);
	return template({});
};

export const mount = async (): Promise<void> => {
	const eventBus = new EventBus();
	const chatList = document.getElementById("messenger__sidebar");
	const chatArea = document.querySelector(".messenger__chat");

	if (!chatList || !chatArea) return;

	const renderChats = () => {
		const chatItems = chatList.querySelectorAll(".chatLink");
		chatItems.forEach((el) => el.remove());

		chatsData.forEach((chat) => {
			const chatItem = new ChatItem(chat, eventBus);
			const element = chatItem.getElement();

			const deleteButton = document.createElement("button");
			deleteButton.textContent = "Удалить";
			deleteButton.classList.add("delete-chat-button");

			deleteButton.addEventListener("click", async () => {
				if (confirm("Вы уверены, что хотите удалить этот чат?")) {
					console.log("Удаление чата с ID:", chat.id);
					try {
						await deleteChat(chat.id);
						chatsData = await fetchChats();
						renderChats();

						deleteMessagesFromLocalStorage(chat.id);

						if (currentChatId === chat.id) {
							currentChatId = null;
							const chatArea =
								document.querySelector(".messenger__chat");
							if (chatArea) {
								chatArea.innerHTML = `<div class="messenger__placeholder">Выберите, кому хотели бы написать</div>`;
							}
						}
					} catch (err) {
						console.error("Ошибка при удалении чата:", err);
					}
				}
			});

			element.appendChild(deleteButton);

			element.addEventListener("click", () => {
				loadChatContent(chat.id, chatsData);
			});

			chatList.appendChild(element);
		});
	};

	try {
		chatsData = await fetchChats();
		renderChats();
	} catch (err) {
		console.error("Ошибка загрузки чатов:", err);
		chatList.innerHTML += `<p class="error">Не удалось загрузить чаты</p>`;
	}

	if (chatArea) {
		chatArea.innerHTML = `<div class="messenger__placeholder">Выберите, кому хотели бы написать</div>`;
	}

	const createChatForm = document.getElementById(
		"create-chat-form",
	) as HTMLFormElement;
	const newChatTitleInput = document.getElementById(
		"new-chat-title",
	) as HTMLInputElement;

	createChatForm?.addEventListener("submit", async (event) => {
		event.preventDefault();
		const title = newChatTitleInput.value.trim();
		if (!title) return;

		try {
			await createChat(title);

			chatsData = await fetchChats();

			renderChats();

			newChatTitleInput.value = "";
		} catch (err) {
			console.error("Ошибка при создании чата:", err);
			alert("Не удалось создать чат");
		}
	});
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		document.body.innerHTML = render();
		mount();
	});
} else {
	document.body.innerHTML = render();
	mount();
}
