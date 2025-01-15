import { profileData } from "./data";
import { renderTemplate } from "./templates";

let activeModal: HTMLElement | null = null;
export const toggleModal = (modal: HTMLElement, open: boolean): void => {
	modal.style.display = open ? "flex" : "none";
	activeModal = open ? modal : null;
};

export const initModals = (): void => {
	const modals = {
		profile: document.getElementById("profile-modal") as HTMLElement,
		editProfile: document.getElementById(
			"edit-profile-data-modal",
		) as HTMLElement,
	};

	const profileModalContent = document.querySelector(".modal-content");

	if (profileModalContent)
		renderTemplate(
			"profile-template",
			profileData,
			profileModalContent as HTMLElement,
		);

	const editProfileModalContent = document.querySelector(
		"#edit-profile-data-modal .modal-content",
	);

	if (editProfileModalContent)
		renderTemplate(
			"edit-profile-template",
			profileData,
			editProfileModalContent as HTMLElement,
		);

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
