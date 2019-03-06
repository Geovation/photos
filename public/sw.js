/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js");


workbox.routing.registerRoute(/.*pbf/, workbox.strategies.cacheFirst({ "cacheName":"pbf", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":15552000,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/.*/, workbox.strategies.staleWhileRevalidate({ "cacheName":"all", plugins: [] }), 'GET');
