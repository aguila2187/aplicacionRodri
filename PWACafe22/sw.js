const CACHE_NAME = 'v1_cache_cafe_tentacion';
const urlsToCache = [
  './',
  './manifest.json',
  './img/cafe.png',
  './img/cafe.png',
  './style.css',
  './script.js'
];


// Modificar el evento fetch para manejar recursos externos
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          return res;
        }
        
        // Para recursos de otros dominios, usa fetch directo
        return fetch(e.request)
          .then(response => {
            // Si la respuesta no es válida, devuelve la respuesta
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para caché
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(e.request, responseToCache);
              });

            return response;
          })
      })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() => new Response('Contenido no disponible'));
    })
  );
});
