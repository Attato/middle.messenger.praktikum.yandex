export interface Profile {
	avatar: string;
	name: string;
	fields: { label: string; value: string }[];
}

export interface Chat {
	id: number;
	avatar: string | null;
	title: string;
	lastMessage: string;
	lastMessageTime: string;
	messages: Message[];
}

export interface Message {
	userId: number;
	userLogin: string;
	content: string;
	time: string;
	type: "sent" | "received";
}

export interface User {
	id: number;
	login: string;
	avatar: string | null;
}
