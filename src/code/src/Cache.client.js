

import { unstable_getCacheForType, unstable_useCacheRefresh } from 'react';
import { createFromFetch } from 'react-server-dom-webpack';

function createResponseCache() {
  return new Map();
}
function loadScript(url, type = 'text/javascript', callback) {
  const script = document.createElement('script');
  script.type = type;
  script.src = url;
  script.crossOrigin = 'anonymous';
  if (callback) {
    script.onload = callback;
  }

  document.body.appendChild(script);
}
const scripts = [
  '/javascript/aspectRatioOverlay.js',
  '/javascript/contextMenus.js',
  '/javascript/dragdrop.js',
  '/javascript/edit-attention.js',
  '/javascript/extensions.js',
  '/javascript/extraNetworks.js',
  '/javascript/generationParams.js',
  '/javascript/hints.js',
  '/javascript/hires_fix.js',
  '/javascript/imageMaskFix.js',
  '/javascript/imageParams.js',
  '/javascript/imageviewer.js',
  '/javascript/localization.js',
  '/javascript/notification.js',
  '/javascript/progressbar.js',
  '/javascript/textualInversion.js',
  '/javascript/ui.js',
  '/extensions/deforum/javascript/deforum-hints.js',
  '/extensions/deforum/javascript/deforum.js',
  '/extensions-builtin/prompt-bracket-checker/javascript/prompt-bracket-checker.js',
];
export function useRefresh() {
  const refreshCache = unstable_useCacheRefresh();
  return function refresh(key, seededResponse) {
    refreshCache(createResponseCache, new Map([[key, seededResponse]]));
  };
}

export function useServerResponse(location) {
  const key = JSON.stringify(location);
  const cache = unstable_getCacheForType(createResponseCache);
  let response = cache.get(key);

  if (response) {
    return response;
  }

  response = createFromFetch(
    fetch('/react?location=' + encodeURIComponent(key))
  );
  cache.set(key, response);
  setTimeout(async () => {
    const urlRepsonse = await fetch('/proxyUrl');
    const data = await urlRepsonse.json();
    const proxyUrl = data.proxyUrl;
    loadScript(`${proxyUrl}/assets/index.4395ab38.js`, 'module');
    scripts.forEach(script => {
      loadScript(script);
    })
  }, 1000)

  return response;
}
