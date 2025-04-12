import Handlebars from "handlebars";
import { EventBus } from "../../components/EventBus";
import { ChatItem } from "../../components/ChatItem/ChatItem";

import { fetchChats, createChat, deleteChat } from "pages/chat/utils/api";
import { loadChatContent } from "pages/chat/utils/functions";
import { deleteMessagesFromLocalStorage } from "pages/chat/utils/storage";

import { Chat } from "pages/chat/utils/interfaces";
import "pages/chat/chat.scss";

export let chatsData: Chat[] = [];
export let currentChatId: number | null = null;

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

export const chatRender = (): string => {
	const template = Handlebars.compile(templateSource);
	return template(chatsData);
};

export const chatMount = async (): Promise<void> => {
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
