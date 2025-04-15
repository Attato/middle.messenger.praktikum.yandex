import { Chat } from "./interfaces";

export const getChatTemplate = (selectedChat: Chat, messagesHtml: string): string => {
	const avatarUrl = selectedChat.avatar ? selectedChat.avatar : "/images/avatar.webp";

	return `
    <header class="chat-header">
        <div class="header-wrapper">
            <div class="chat-header-avatar">
                <img src="${avatarUrl}" alt="Аватар чата" id="chat-avatar" />
               
                <input type="file" id="avatar-file-input" class="avatar-file-input" />
                <button id="save-avatar-button" class="save-avatar-button">Сохранить</button>
            </div>
            <h2>${selectedChat.title} (ID: ${selectedChat.id})</h2>
        </div>

        <form id="chat-users-form" class="chat-users-form">
            <div class="chat-users" id="chat-users-list"></div>

            <div class="user-management">
                <input type="number" id="user-id-input" placeholder="ID пользователя" required />
                <div class="buttons">
                    <button type="submit" id="add-user-button">Добавить</button>
                    <button type="button" id="remove-user-button">Удалить</button>
                </div>
            </div>
        </form>
    </header>

    <div class="chat-messages">
        ${messagesHtml}
    </div>

    <footer class="chat-footer">
        <form id="message-form" class="message-form">
            <input 
                type="text" 
                name="message" 
                id="message" 
                class="message-form-input" 
                placeholder="Введите сообщение..." 
                required
            />
            <button type="submit" class="message-form-send-button">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-2xl">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path>
                </svg>
            </button>
        </form>
    </footer>
  `;
};
