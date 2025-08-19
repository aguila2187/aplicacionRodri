const CACHE_NAME = 'cafe-tentacion-v1';
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/styles.css',
	'/app.js',
	'/assets/icons/icon.svg',
];
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
	);
	self.skipWaiting();
});
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(keys.map(key => {
			if (key !== CACHE_NAME) return caches.delete(key);
		})))
	);
	self.clients.claim();
});
self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;
	// Network-first for html, cache-first for others
	if (request.headers.get('accept')?.includes('text/html')) {
		event.respondWith(
			fetch(request)
				.then((resp) => {
					const copy = resp.clone();
					caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
					return resp;
				})
				.catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
		);
	} else {
		event.respondWith(
			caches.match(request)
				.then(r => r || fetch(request).then(resp => {
					const copy = resp.clone();
					caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
					return resp;
				}))
		);
	}
});