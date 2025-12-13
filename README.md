# nuxt-vite-plugin-webfont-dl

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Automatically install and configure the [vite-plugin-webfont-dl](https://github.com/feat-agency/vite-plugin-webfont-dl) plugin.

- [✨ Release Notes](./CHANGELOG.md)

## Requirements

- **Node.js** `>=22.12.0`
- **Nuxt** `>=3.19.0`

## Installation

Using [pnpm](https://pnpm.io):

```bash
pnpm add -D nuxt-vite-plugin-webfont-dl
```

You can also use `yarn`, `npm`, or `bun`.

## Usage

Add `nuxt-vite-plugin-webfont-dl` to the modules section of your nuxt config.

```typescript
export default defineNuxtConfig({
    modules: ['nuxt-vite-plugin-webfont-dl'],
    vitePluginWebfontDl: { // Configure
        webfontUrls: [] // Set urls
    }
});
```

For instructions on configuring URLs, refer to [this link](https://github.com/feat-agency/vite-plugin-webfont-dl?tab=readme-ov-file#simple-config).

For other options, refer to [this link](./src/types/options.ts).

## How it works

Since the original vite-plugin-webfont-dl plugin exclusively handled Vite scenarios, it did not affect dev or build outputs in Nuxt.
This module implemented the following actions:

1. A new client plugin has been added to remove the media attribute from links. For details, refer to the comments in the options section.
2. If in dev mode, add a link tag to the head that loads `/_nuxt/@webfonts/webfonts.css`.
3. For build outputs, the vite plugin retrieves the final output filename of webfont.css.
Through a Nuxt hook, the link tags to be inserted into the HTML are passed to Nitro, enabling Nitro to insert these tags into the HTML head during output.

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-href]: https://npmjs.com/package/nuxt-vite-plugin-webfont-dl
[npm-version-src]: https://img.shields.io/npm/v/nuxt-vite-plugin-webfont-dl/latest.svg?colorA=18181b&colorB=28cf8d&style=flat

[npm-downloads-href]: https://npmjs.com/package/nuxt-vite-plugin-webfont-dl
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-vite-plugin-webfont-dl.svg?colorA=18181b&colorB=28cf8d&style=flat

[codecov-href]: https://codecov.io/gh/kiki-kanri/nuxt-vite-plugin-webfont-dl
[codecov-src]: https://codecov.io/gh/kiki-kanri/nuxt-vite-plugin-webfont-dl/graph/badge.svg?token=4FFWT4TFFH

[license-href]: https://github.com/kiki-kanri/nuxt-vite-plugin-webfont-dl/blob/main/LICENSE
[license-src]: https://img.shields.io/github/license/kiki-kanri/nuxt-vite-plugin-webfont-dl?colorA=18181b&colorB=28cf8d&style=flat

[nuxt-href]: https://nuxt.com
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181b?logo=nuxt.js
