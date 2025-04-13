import { ChatItem } from "./ChatItem";
import { EventBus } from "../EventBus";
import { getChatAvatarUrl } from "pages/chat/utils/api";

import styles from "./ChatItem.module.scss";

jest.mock("pages/chat/utils/api", () => ({
	getChatAvatarUrl: jest.fn(),
}));

describe("ChatItem", () => {
	let eventBus: EventBus;
	let chatItem: ChatItem;

	const mockProps = {
		id: 1,
		title: "Клуб почитателей",
		lastMessage: "Флоппи",
		lastMessageTime: "2025-04-14 12:00",
		avatar: null,
		messages: [],
	};

	beforeEach(() => {
		eventBus = new EventBus();
		chatItem = new ChatItem(mockProps, eventBus);
	});

	test("должен создавать элемент с правильными данными", () => {
		const element = chatItem.getElement();

		expect(element).toBeInstanceOf(HTMLElement);
		expect(element.querySelector("h2")?.textContent).toBe(mockProps.title);
		expect(element.querySelector("p")?.textContent).toBe(mockProps.lastMessage);
		expect(element.querySelector("span")?.textContent).toBe(mockProps.lastMessageTime);
	});

	test("должен отображать аватар, если он есть", () => {
		const avatarUrl = "/images/avatar.png";
		(getChatAvatarUrl as jest.Mock).mockReturnValue(avatarUrl);

		chatItem = new ChatItem({ ...mockProps, avatar: avatarUrl }, eventBus);
		const element = chatItem.getElement();
		const avatar = element.querySelector("img");

		expect(avatar).toBeTruthy();
		expect(avatar?.src).toContain(avatarUrl);
		expect(avatar?.alt).toBe("Аватар чата");
	});

	test("должен добавлять обработчик события", () => {
		const mockHandler = jest.fn();
		const mockEvents = { click: mockHandler };

		chatItem = new ChatItem({ ...mockProps, events: mockEvents }, eventBus);
		const element = chatItem.getElement();

		element.dispatchEvent(new Event("click"));
		expect(mockHandler).toHaveBeenCalled();
	});

	test("должен удалять обработчики при вызове destroy", () => {
		const mockHandler = jest.fn();
		const mockEvents = { click: mockHandler };

		chatItem = new ChatItem({ ...mockProps, events: mockEvents }, eventBus);
		const element = chatItem.getElement();

		chatItem.destroy();
		element.dispatchEvent(new Event("click"));
		expect(mockHandler).not.toHaveBeenCalled();
	});

	test("должен корректно добавлять и удалять классы", () => {
		chatItem = new ChatItem(mockProps, eventBus);
		const element = chatItem.getElement();

		expect(element.classList.contains("chatLink")).toBe(true);
		expect(element.classList.contains(styles.chatLink)).toBe(true);
		expect(element.querySelector("div")?.classList.contains(styles.chatLink__main)).toBe(true);
	});
});
