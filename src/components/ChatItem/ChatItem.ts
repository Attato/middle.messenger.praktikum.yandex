import { EventBus } from "../EventBus";
import { Block } from "../Block";

import { Chat } from "pages/chat/utils/interfaces";

import { getChatAvatarUrl } from "pages/chat/utils/api";

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

		main.appendChild(header);
		main.appendChild(data);

		const avatarUrl = getChatAvatarUrl(this.props) ?? "/images/avatar.webp";

		if (avatarUrl) {
			const avatar = document.createElement("img");
			avatar.src = avatarUrl;
			avatar.alt = "Аватар чата";
			avatar.classList.add(styles.chatLink__avatar);
			container.appendChild(avatar);
		}

		container.appendChild(main);

		if (this.props.events) {
			Object.entries(this.props.events).forEach(([event, handler]) => {
				container.addEventListener(event, handler);
			});
		}

		return container;
	}
}
