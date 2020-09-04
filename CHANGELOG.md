# Changelog

## 0.3.0 - 2020-09-04

### Added

- Improve `component` typing

### Changed

- `route` only update if url change
- Replace `initRouter` with `initHashRouter` and `initPathRouter` to improve tree-shaking

### Removed

- Remove `RedirectOption` type export

## 0.2.1 - 2020-09-01

### Fixed

- `<Link />` will work properly with special key clicks, e.g. ctrl-click

## 0.2.0 - 2020-08-30

### Added

- Add `createLink` function to enable custom link creation
- Format URL on page load

### Changed

- Rename `history` mode to `path`
- All router options need to be defined
- All public APIs, except for `route`, will now throw error if called before `initRouter`
- `initRouter` will throw error if called more than once
- `LocationInput`'s `path`, `search` and `hash` will treat empty string as undefined

### Removed

- Remove `link` action, use `createLink` instead

### Fixed

- Fix synchronous redirect rendering

## 0.1.2 - 2020-08-26

### Fixed

- Route store is always defined even before `initRouter`
- `navigate` will not throw error if called before `initRouter`
- Fix base path detection

## 0.1.1 - 2020-08-25

### Fixed

- Fix unexpected slot "default" warning

## 0.1.0 - 2020-08-25

Initial release
