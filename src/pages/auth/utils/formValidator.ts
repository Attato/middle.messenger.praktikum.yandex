import { validateField } from "./validation";

export function attachValidationToForm(form: HTMLFormElement) {
	const inputs = form.querySelectorAll("input, textarea");

	inputs.forEach((input) => {
		input.addEventListener("blur", (event) => {
			const target = event.target as
				| HTMLInputElement
				| HTMLTextAreaElement;
			const error = validateField(target.name, target.value);
			displayError(target, error);
		});
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		let isValid = true;

		inputs.forEach((input) => {
			const target = input as HTMLInputElement | HTMLTextAreaElement;
			const error = validateField(target.name, target.value);
			if (error) isValid = false;
		});

		if (isValid) {
			console.log("Форма успешно отправлена!");
		} else {
			console.log("Пожалуйста, исправьте ошибки в форме.");
		}
	});
}

function displayError(
	input: HTMLInputElement | HTMLTextAreaElement,
	error: string | null,
) {
	let errorElement = input.nextElementSibling as HTMLElement;
	if (!errorElement || !errorElement.classList.contains("error")) {
		errorElement = document.createElement("div");
		errorElement.className = "error";
		input.insertAdjacentElement("afterend", errorElement);
	}

	if (error) {
		errorElement.textContent = error;
		errorElement.style.display = "block";
		errorElement.style.color = "#e84033";
	} else {
		errorElement.style.display = "none";
	}
}
