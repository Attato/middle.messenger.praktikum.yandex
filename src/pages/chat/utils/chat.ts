import { Chat, Message } from "./interfaces";
import { saveChatsToStorage } from "./storage";

export let currentChatId: number | null = null;

export const loadChatContent = (chatId: number, chats: Chat[]): void => {
	currentChatId = chatId;
	const selectedChat = chats[chatId];
	const chatContent = document.querySelector(".messenger__chat");

	if (chatContent) {
		const messagesHtml = selectedChat.messages
			.map(
				(message) => `
                    <div class="message message--${message.type}">
                        <p>${message.content}</p>
                        <span class="message__time">${message.time}</span>
                    </div>`,
			)
			.join("");

		chatContent.innerHTML = `
            <header class="chat-header">
                <h2>${selectedChat.name}</h2>
                <span>был(а) недавно</span>
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
						<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-2xl"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path></svg>
					</button>
                </form>
            </footer>
        `;

		const messageForm = document.getElementById("message-form");
		const messageInput = document.getElementById(
			"message",
		) as HTMLInputElement;

		messageForm?.addEventListener("submit", (event) => {
			event.preventDefault();
			sendMessage(chats);
		});

		messageInput?.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				sendMessage(chats);
			}
		});
	}
};

export const sendMessage = (chats: Chat[]): void => {
	const messageInput = document.getElementById("message") as HTMLInputElement;
	const messageContent = messageInput.value.trim();

	if (messageContent && currentChatId !== null) {
		const newMessage: Message = {
			content: messageContent,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "sent",
		};

		addMessageToChat(newMessage, chats);

		messageInput.value = "";

		const messengerChat = document.querySelector(".messenger__chat");

		if (messengerChat) {
			messengerChat.scrollTop = messengerChat.scrollHeight;
		}

		messageInput.focus();
	}
};

const addMessageToChat = (message: Message, chats: Chat[]): void => {
	if (currentChatId !== null) {
		const selectedChat = chats[currentChatId];
		const chatMessagesContainer = document.querySelector(".chat-messages");

		selectedChat.messages.push(message);
		selectedChat.lastMessage = message.content;
		selectedChat.lastMessageTime = message.time;

		saveChatsToStorage(chats);

		if (chatMessagesContainer) {
			const newMessageHtml = `
                <div class="message message--${message.type}">
                    <p>${message.content}</p>
                    <span class="message__time">${message.time}</span>
                </div>`;
			chatMessagesContainer.innerHTML += newMessageHtml;
		}
	}
};
