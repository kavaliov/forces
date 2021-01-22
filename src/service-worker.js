import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import manifest from "./manifest";

precacheAndRoute([...self.__WB_MANIFEST, ...manifest]);

self.skipWaiting();

registerRoute(
  ({ url }) => {
    const  match = url.pathname.match(/INT3D.*(?:png|jpe?g|gif|mp4|svg)/);

    if (match) {
      return !!match.length;
    }

    return false;
  },
  new CacheFirst({ cacheName: "widget-cache" })
);
