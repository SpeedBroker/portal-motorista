// Service Worker do Portal do Motorista SS
// Versão 1.0

const CACHE_NAME = 'portal-motorista-ss-v1';
const URLS_PARA_CACHE = [
  './',
  './manifest.json'
];

// Instalação — cacheia os arquivos
self.addEventListener('install', function(event) {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Cacheando arquivos');
      return cache.addAll(URLS_PARA_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação — limpa caches antigos
self.addEventListener('activate', function(event) {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then(function(nomes) {
      return Promise.all(
        nomes.map(function(nome) {
          if (nome !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', nome);
            return caches.delete(nome);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições (por enquanto, só passa direto)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
