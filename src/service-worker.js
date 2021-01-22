import { precacheAndRoute } from "workbox-precaching";
import manifest from "./manifest";

precacheAndRoute([...self.__WB_MANIFEST, ...manifest]);

self.skipWaiting();

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.match(/INT3D.*(?:png|jpe?g|gif|mp4|svg)/)
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        const response = caches
        .open("widget-cache")
        .then((cache) => cache.match(event.request.url));

        if (response) {
          return response;
        }

        return event;
      })
    );
  }
});