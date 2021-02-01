import {ExpirationPlugin} from 'workbox-expiration';
import {registerRoute} from 'workbox-routing';
import {NetworkFirst, CacheFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {setCacheNameDetails} from "workbox-core";

declare var self: WorkerGlobalScope & typeof globalThis;


setCacheNameDetails({
    prefix: 'personaly',
    suffix: 'v1'
});

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cahe',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);


registerRoute(
    ({request}) => request.destination === 'script' ||
        request.destination === 'style',
    new NetworkFirst({
        cacheName: 'static-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 10,
            }),
        ],
    })
);


registerRoute(
    ({request}) => request.destination === 'document',
    new NetworkFirst({
        cacheName: 'html-cache',
    })
);


registerRoute(
    /\/api\//,
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20,
            }),
        ],
    }),
);




