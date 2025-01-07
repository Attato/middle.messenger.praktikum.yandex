import Handlebars from "handlebars";

export const renderTemplate = (
	templateId: string,
	data: any,
	container: HTMLElement,
): void => {
	const templateElement = document.getElementById(
		templateId,
	) as HTMLTemplateElement;

	if (templateElement) {
		const template = Handlebars.compile(templateElement.innerHTML);
		container.innerHTML = template(data);
	}
};
