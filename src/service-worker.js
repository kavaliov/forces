import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute([...self.__WB_MANIFEST, { url: "index.html", revision: "" }]);

self.skipWaiting();

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.match(/INT3D.*(?:png|jpe?g|gif|mp4|svg)/)
  ) {
    event.respondWith(
      caches.match(event.request)
    );
  }
});