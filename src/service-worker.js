import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

precacheAndRoute([...self.__WB_MANIFEST, { url: "index.html", revision: Date.now() }]);
clientsClaim();
self.skipWaiting();

registerRoute(
  ({ url }) => {
    const match = url.pathname.match(/INT3D.*(?:png|jpe?g|gif|mp4|svg)/);

    if (match) {
      return !!match.length;
    }

    return false;
  },
  new CacheFirst({ cacheName: "widget-cache" })
);
