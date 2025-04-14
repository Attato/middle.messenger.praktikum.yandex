import { API_BASE, checkResponse } from "../../../api/api";

export interface SignInPayload {
	login: string;
	password: string;
}

export interface SignUpPayload {
	first_name: string;
	second_name: string;
	login: string;
	email: string;
	password: string;
	phone: string;
}

export interface APIError {
	reason: string;
}

const authRequest = async (url: string, payload: object): Promise<void> => {
	const response = await fetch(`${API_BASE}${url}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(payload),
	});

	try {
		checkResponse(response);
	} catch {
		const error: APIError = await response.json();
		throw new Error(error.reason);
	}
};

export const signIn = (payload: SignInPayload): Promise<void> => {
	return authRequest("/auth/signin", payload);
};

export const signUp = (payload: SignUpPayload): Promise<void> => {
	return authRequest("/auth/signup", payload);
};
