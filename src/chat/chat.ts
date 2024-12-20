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
		lastMessage: "Друзья, у меня для вас особенный выпуск новостей!",
		lastMessageTime: "15:12",
		unreadCount: 4,
	},
	{
		avatar: "%",
		name: "1, 2, 3",
		lastMessage:
			"Миллионы россиян ежедневно проводят десятки часов своё...",
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
};

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

document.addEventListener("DOMContentLoaded", () => {
	const chatContainer = document.getElementById("chat");
	const profileModalContent = document.querySelector(".modal-content");
	const editProfileModalContent = document.querySelector(
		"#edit-profile-data-modal .modal-content",
	);

	if (chatContainer) renderTemplate("chat-template", chats, chatContainer);
	if (profileModalContent)
		renderTemplate(
			"profile-template",
			profileData,
			profileModalContent as HTMLElement,
		);
	if (editProfileModalContent)
		renderTemplate(
			"edit-profile-template",
			profileData,
			editProfileModalContent as HTMLElement,
		);

	initModals();
});

// -------------

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
