import { EventBus } from "../EventBus";
import { Block } from "../Block";
import styles from "./ChatItem.module.scss";

interface ChatItemProps {
	avatar: string;
	name: string;
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number | null;
	events?: Record<string, (event: Event) => void>;
}

export class ChatItem extends Block<ChatItemProps> {
	constructor(props: ChatItemProps, eventBus: EventBus) {
		super(props, eventBus);
	}

	protected createElement(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add(styles.chatLink);

		const avatar = document.createElement("div");
		avatar.classList.add(styles.chatLink__avatar);
		avatar.textContent = this.props.avatar;

		const main = document.createElement("div");
		main.classList.add(styles.chatLink__main);

		const header = document.createElement("div");
		header.classList.add(styles.chatLink__header);

		const name = document.createElement("h2");
		name.textContent = this.props.name;

		const message = document.createElement("p");
		message.textContent = this.props.lastMessage;

		header.appendChild(name);
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

		container.appendChild(avatar);
		container.appendChild(main);

		if (this.props.events) {
			Object.entries(this.props.events).forEach(([event, handler]) => {
				container.addEventListener(event, handler);
			});
		}

		return container;
	}
}
