import { afterEach, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

let store = {};
globalThis.localStorage = {
	getItem: (key) => (key in store ? store[key] : null),
	setItem: (key, value) => {
		store[key] = String(value);
	},
	removeItem: (key) => {
		delete store[key];
	},
	clear: () => {
		store = {};
	}
};
