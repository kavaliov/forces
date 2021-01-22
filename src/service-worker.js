import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import manifest from "./manifest";

precacheAndRoute([...self.__WB_MANIFEST, ...manifest]);

self.skipWaiting();

registerRoute(
  ({ url }) => {
    const { pathname } = url;
    console.log("match");
    return pathname.match(/INT3D.*(?:png|jpe?g|gif|mp4|svg)/)
  },
  new CacheFirst({ cacheName: "widget-cache" })
);
