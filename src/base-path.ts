export const basePath =
  document.getElementsByTagName('base').length > 0
    ? document.baseURI.replace(window.location.origin, '')
    : '/'
