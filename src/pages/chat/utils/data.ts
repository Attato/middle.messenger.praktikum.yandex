import { Chat, Profile } from "./interfaces";

export const initialChats: Chat[] = [
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

export const profileData: Profile = {
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
