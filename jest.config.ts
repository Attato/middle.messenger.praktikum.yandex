import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "jest-environment-jsdom",
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts"],
	moduleFileExtensions: ["js", "ts"],
	moduleNameMapper: {
		"^pages/(.*)$": "<rootDir>/src/pages/$1",
		"\\.(scss|css)$": "<rootDir>/__mocks__/styleMock.js",
	},
};

export default config;
