export const basePath =
  document.baseURI !== window.location.href
    ? document.baseURI.replace(window.location.origin, '')
    : '/'
