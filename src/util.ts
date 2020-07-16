import { Readable, Writable } from 'svelte/store'

/** Makes sure path has leading "/" and no trailing "/" */
export function formatPath(path: string) {
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  if (!path.startsWith('/')) {
    path = '/' + path
  }

  return path
}

export function joinPaths(...paths: string[]) {
  return paths
    .map(formatPath)
    .filter((v) => v !== '/')
    .join()
}

export function removeLeading(str: string, leading: string) {
  return str.startsWith(leading) ? str.slice(leading.length) : str
}

/** Make writable store readonly */
export function readonly<T>(writable: Writable<T>): Readable<T> {
  return { subscribe: writable.subscribe }
}
