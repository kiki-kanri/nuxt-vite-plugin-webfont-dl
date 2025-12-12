import type { NuxtOptions } from '@nuxt/schema';
import {
    addPlugin,
    addVitePlugin,
    createResolver,
    defineNuxtModule,
    useLogger,
} from 'nuxt/kit';
import { viteWebfontDownload } from 'vite-plugin-webfont-dl';

import type { UserModuleOptions } from './types/options';

export default defineNuxtModule<UserModuleOptions>({
    // Default configuration options of the Nuxt module
    defaults: {
        async: true,
        enabled: true,
        subsetsAllowed: [],
        useOnloadRemoveMediaAttribute: true,
    },
    meta: {
        configKey: 'vitePluginWebfontDl',
        name: 'nuxt-vite-plugin-webfont-dl',
    },
    setup(options, nuxt) {
        const logger = useLogger();
        if (!options.enabled) return logger.info('nuxt-vite-plugin-webfont-dl is disabled');
        const startAt = performance.now();
        logger.info('Initializing nuxt-vite-plugin-webfont-dl...');
        const resolver = createResolver(import.meta.url);

        // Install vite plugin
        addVitePlugin(
            viteWebfontDownload(
                options.webfontUrls,
                {
                    cache: options.cache,
                    embedFonts: options.embedFonts,
                    injectAsStyleTag: false,
                    minifyCss: options.minifyCss,
                    proxy: options.proxy,
                    subsetsAllowed: options.subsetsAllowed,
                    throwError: options.throwError,
                },
            ),
        );

        // Add link media attribute switcher plugin
        addPlugin(resolver.resolve('./runtime/plugins/link-media-switcher.client.ts'));

        // Dev mode
        if (nuxt.options.dev) {
            const link: NonNullable<NuxtOptions['app']['head']['link']>[number] = {
                href: '/_nuxt/@webfonts/webfonts.css',
                id: 'nuxt-vite-plugin-webfont-dl-css-link',
                rel: 'stylesheet',
            };

            if (options.async) {
                link.media = 'print';
                if (options.useOnloadRemoveMediaAttribute) {
                    link.onload = `this.onload=null;this.removeAttribute('media');`;
                }
            }

            nuxt.options.app.head.link ||= [];
            nuxt.options.app.head.link.unshift(
                {
                    as: 'style',
                    href: '/_nuxt/@webfonts/webfonts.css',
                    rel: 'preload',
                },
                link,
            );
        }

        logger.success(
            `nuxt-vite-plugin-webfont-dl initialized successfully in ${(performance.now() - startAt).toFixed(2)}ms`,
        );
    },
});
