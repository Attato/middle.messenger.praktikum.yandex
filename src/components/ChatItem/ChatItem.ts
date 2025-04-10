import { EventBus } from "../EventBus";
import { Block } from "../Block";

import { Chat } from "pages/chat/utils/interfaces";

import styles from "./ChatItem.module.scss";

interface ChatItemProps extends Chat {
	events?: Record<string, (event: Event) => void>;
}

export class ChatItem extends Block<ChatItemProps> {
	constructor(props: ChatItemProps, eventBus: EventBus) {
		super(props, eventBus);
	}

	protected createElement(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add("chatLink");
		container.classList.add(styles.chatLink);

		const main = document.createElement("div");
		main.classList.add(styles.chatLink__main);

		const header = document.createElement("div");
		header.classList.add(styles.chatLink__header);

		const title = document.createElement("h2");
		title.textContent = this.props.title;

		const message = document.createElement("p");
		message.textContent = this.props.lastMessage;

		header.appendChild(title);
		header.appendChild(message);

		const data = document.createElement("div");
		data.classList.add(styles.chatLink__data);

		const time = document.createElement("span");
		time.textContent = this.props.lastMessageTime;
		data.appendChild(time);

		if (this.props.unreadCount && this.props.unreadCount > 0) {
			const badge = document.createElement("div");
			badge.classList.add(styles.chatLink__count);
			badge.textContent = String(this.props.unreadCount);
			data.appendChild(badge);
		}

		main.appendChild(header);
		main.appendChild(data);

		container.appendChild(main);

		if (this.props.events) {
			Object.entries(this.props.events).forEach(([event, handler]) => {
				container.addEventListener(event, handler);
			});
		}

		return container;
	}
}
