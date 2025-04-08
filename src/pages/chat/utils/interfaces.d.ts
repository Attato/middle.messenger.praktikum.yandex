export interface Profile {
	avatar: string;
	name: string;
	fields: { label: string; value: string }[];
}

export interface Chat {
	avatar: string;
	name: string;
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number;
	messages: Message[];
}

export interface Message {
	content: string;
	time: string;
	type: "sent" | "received";
}
