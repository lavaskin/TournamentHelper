// Node 25+ has its own localStorage global, which is empty unless Node is started with --localstorage-file.
// It hides jsdom's localStorage, so point the global back at jsdom's.
const jsdomStorage = (globalThis as { jsdom?: { window: Window } }).jsdom?.window.localStorage;
if (jsdomStorage) {
	Object.defineProperty(globalThis, 'localStorage', { value: jsdomStorage, configurable: true });
}
