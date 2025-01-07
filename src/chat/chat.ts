import Handlebars from "handlebars";

interface Profile {
	avatar: string;
	name: string;
	fields: { label: string; value: string }[];
}

interface Chat {
	avatar: string;
	name: string;
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number | null;
	messages: Message[];
}

interface Message {
	content: string;
	time: string;
	type: "sent" | "received";
}

const loadChatsFromStorage = (): Chat[] => {
	const chatsData = localStorage.getItem("chats");
	return chatsData ? JSON.parse(chatsData) : [];
};

const saveChatsToStorage = (chats: Chat[]): void => {
	localStorage.setItem("chats", JSON.stringify(chats));
};

let chats: Chat[] = loadChatsFromStorage();

if (chats.length === 0) {
	chats = [
		{
			avatar: "?",
			name: "Андрей",
			lastMessage: "Изображение",
			lastMessageTime: "10:49",
			unreadCount: 2,
			messages: [
				{ content: "Привет!", time: "10:30", type: "received" },
				{ content: "Привет", time: "10:31", type: "sent" },
			],
		},
		{
			avatar: "!",
			name: "Илья",
			lastMessage: "Друзья, у меня для вас особенный выпуск новостей!",
			lastMessageTime: "15:12",
			unreadCount: 4,
			messages: [
				{ content: "Привет!", time: "12:49", type: "received" },
				{ content: "Как дела?", time: "12:49", type: "received" },
			],
		},
	];

	saveChatsToStorage(chats);
}

const profileData: Profile = {
	avatar: ":P",
	name: "Иван",
	fields: [
		{ label: "Почта", value: "pochta@yandex.ru" },
		{ label: "Логин", value: "ivanivanov" },
		{ label: "Имя", value: "Иван" },
		{ label: "Фамилия", value: "Иванов" },
		{ label: "Имя в чате", value: "Иван" },
		{ label: "Телефон", value: "+7 (909) 967 30 30" },
	],
};

let currentChatId: number | null = null;

const renderTemplate = (
	templateId: string,
	data: any,
	container: HTMLElement,
): void => {
	const templateElement = document.getElementById(
		templateId,
	) as HTMLTemplateElement;
	if (templateElement) {
		const template = Handlebars.compile(templateElement.innerHTML);
		container.innerHTML = template(data);
	}
};

const checkURLForMessage = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const message = urlParams.get("message");
	if (message && currentChatId !== null) {
		const newMessage: Message = {
			content: message,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "sent",
		};

		chats[currentChatId].messages.push(newMessage);
		chats[currentChatId].lastMessage = newMessage.content;
		chats[currentChatId].lastMessageTime = newMessage.time;

		loadChatContent(currentChatId);

		history.replaceState({}, document.title, window.location.pathname);
	}
};

const saveChatState = () => {
	if (currentChatId !== null) {
		localStorage.setItem("currentChatId", String(currentChatId));
	}
};

const restoreChatState = () => {
	const savedChatId = localStorage.getItem("currentChatId");
	if (savedChatId !== null) {
		currentChatId = Number(savedChatId);
		loadChatContent(currentChatId);
	}
};

const sendMessage = (): void => {
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

		addMessageToChat(newMessage);

		messageInput.value = "";
		saveChatState();
		messageInput.focus();
	}
};

document.addEventListener("DOMContentLoaded", () => {
	chats = loadChatsFromStorage();
	const chatContainer = document.getElementById("chat");
	if (chatContainer) renderTemplate("chat-template", chats, chatContainer);

	const messageForm = document.getElementById(
		"message-form",
	) as HTMLFormElement;
	const messageInput = document.getElementById("message") as HTMLInputElement;
	const sendButton = document.querySelector(
		".message-form__send-button",
	) as HTMLElement;

	const profileModalContent = document.querySelector(".modal-content");

	if (profileModalContent)
		renderTemplate(
			"profile-template",
			profileData,
			profileModalContent as HTMLElement,
		);

	const editProfileModalContent = document.querySelector(
		"#edit-profile-data-modal .modal-content",
	);

	if (editProfileModalContent)
		renderTemplate(
			"edit-profile-template",
			profileData,
			editProfileModalContent as HTMLElement,
		);

	restoreChatState();

	checkURLForMessage();

	chatContainer?.addEventListener("click", (event) => {
		const chatLink = (event.target as HTMLElement).closest(".chat-link");
		if (chatLink) {
			const chatId = chatLink.getAttribute("data-chat-id");
			if (chatId) {
				loadChatContent(Number(chatId));
				saveChatState();
			}
		}
	});

	messageForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		sendMessage();
	});

	sendButton?.addEventListener("click", (event) => {
		event.preventDefault();
		sendMessage();
	});

	messageInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	});

	initModals();
});

const loadChatContent = (chatId: number) => {
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
			sendMessage();
		});

		messageInput?.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				sendMessage();
			}
		});
	}
};

const addMessageToChat = (message: Message) => {
	if (currentChatId !== null) {
		const selectedChat = chats[currentChatId];
		const messengerChat = document.querySelector(".messenger__chat");
		const chatMessagesContainer = document.querySelector(
			".messenger__chat .chat-messages",
		);

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

		if (messengerChat) {
			messengerChat.scrollTop = messengerChat.scrollHeight;
		}
	}
};

let activeModal: HTMLElement | null = null;

const toggleModal = (modal: HTMLElement, open: boolean): void => {
	modal.style.display = open ? "flex" : "none";
	activeModal = open ? modal : null;
};

const initModals = (): void => {
	const modals = {
		profile: document.getElementById("profile-modal") as HTMLElement,
		editProfile: document.getElementById(
			"edit-profile-data-modal",
		) as HTMLElement,
	};

	const buttons = {
		profileLink: document.getElementById("profile-link"),
		closeProfile: document.getElementById("close-profile-modal"),
		editProfileLink: document.getElementById("edit-profile-data-link"),
		closeEditProfile: document.getElementById("close-edit-profile-modal"),
		saveProfile: document.getElementById("save-profile-data-link"),
	};

	buttons.profileLink?.addEventListener("click", () =>
		toggleModal(modals.profile, true),
	);
	buttons.editProfileLink?.addEventListener("click", () => {
		toggleModal(modals.profile, false);
		toggleModal(modals.editProfile, true);
	});

	buttons.closeProfile?.addEventListener("click", () =>
		toggleModal(modals.profile, false),
	);
	buttons.closeEditProfile?.addEventListener("click", () =>
		toggleModal(modals.editProfile, false),
	);

	buttons.saveProfile?.addEventListener("click", () => {
		toggleModal(modals.editProfile, false);
		toggleModal(modals.profile, true);
	});

	window.addEventListener("click", (event) => {
		if (event.target === activeModal) {
			toggleModal(activeModal as HTMLElement, false);
		}
	});
};
