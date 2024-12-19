import Handlebars from "handlebars";

interface Chat {
	avatar: string;
	name: string;
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number | null;
}

interface Profile {
	avatar: string;
	name: string;
	fields: { label: string; value: string }[];
	actions: string[];
}

const chats: Chat[] = [
	{
		avatar: "?",
		name: "Андрей",
		lastMessage: "Изображение",
		lastMessageTime: "10:49",
		unreadCount: 2,
	},
	{
		avatar: "!",
		name: "Илья",
		lastMessage: "Друзья, у меня для вас особенный выпуск новостей!...",
		lastMessageTime: "15:12",
		unreadCount: 4,
	},
	{
		avatar: "%",
		name: "1, 2, 3",
		lastMessage:
			"Миллионы россиян ежедневно проводят десятки часов свое...",
		lastMessageTime: "Пн",
		unreadCount: null,
	},
	{
		avatar: "#",
		name: "Design Destroyer",
		lastMessage: "В 2008 году художник Jon Rafman начал собирать...",
		lastMessageTime: "Пн",
		unreadCount: null,
	},
];

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
	actions: ["Изменить данные", "Изменить пароль"],
};

// Чаты
const chatTemplateElement = document.getElementById(
	"chat-template",
) as HTMLTemplateElement;
const chatContainer = document.getElementById("chat");

if (chatTemplateElement && chatContainer) {
	const chatTemplate = Handlebars.compile(chatTemplateElement.innerHTML);
	chatContainer.innerHTML = chatTemplate(chats);
}

// Профиль
const profileTemplateElement = document.getElementById(
	"profile-template",
) as HTMLTemplateElement;
const profileModalContent = document.querySelector(".modal-content");
if (profileTemplateElement && profileModalContent) {
	const profileTemplate = Handlebars.compile(
		profileTemplateElement.innerHTML,
	);
	profileModalContent.innerHTML += profileTemplate(profileData);
}

// Модалка
const profileLink = document.getElementById("profile-link") as HTMLElement;
const modal = document.getElementById("profile-modal") as HTMLElement;
const closeModalButton = document.getElementById("close-modal") as HTMLElement;

function openModal() {
	modal.style.display = "flex";
}

function closeModal() {
	modal.style.display = "none";
}

profileLink.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
	if (event.target === modal) {
		closeModal();
	}
});
