import { randomBytes } from 'node:crypto';

import {
    addPluginTemplate,
    addVitePlugin,
    defineNuxtModule,
    useLogger,
} from '@nuxt/kit';
import type {
    Nuxt,
    NuxtOptions,
} from '@nuxt/schema';
import { viteWebfontDownload } from 'vite-plugin-webfont-dl';

import type {
    UserModuleOptions,
    ViteWebfontDownloadOptions,
} from './types/options';

function setupDev(options: UserModuleOptions, nuxt: Nuxt, linkTagId: string) {
    const link: NonNullable<NuxtOptions['app']['head']['link']>[number] = {
        href: '/_nuxt/@webfonts/webfonts.css',
        id: linkTagId,
        rel: 'stylesheet',
    };

    if (options.async) {
        link.media = 'print';
        if (options.useOnloadMediaSwitch) link.onload = `this.onload=null;this.removeAttribute('media');`;
    }

    (nuxt.options.app.head.link ||= []).push(
        {
            as: 'style',
            href: '/_nuxt/@webfonts/webfonts.css',
            rel: 'preload',
        },
        link,
    );
}

export default defineNuxtModule<UserModuleOptions>({
    // Default configuration options of the Nuxt module
    defaults: {
        async: true,
        enabled: true,
        useOnloadMediaSwitch: true,
    },
    meta: {
        configKey: 'vitePluginWebfontDl',
        name: 'nuxt-vite-plugin-webfont-dl',
    },
    setup(options, nuxt) {
        const logger = useLogger();
        if (!options.enabled) return logger.info('[nuxt-vite-plugin-webfont-dl] Disabled');
        const startAt = performance.now();
        logger.info('[nuxt-vite-plugin-webfont-dl] Initializing...');
        // const resolver = createResolver(import.meta.url);

        // Add vite plugin
        const viteWebfontDownloadOptions: ViteWebfontDownloadOptions = {
            async: false,
            injectAsStyleTag: false,
        };

        if (options.cache !== undefined) viteWebfontDownloadOptions.cache = options.cache;
        if (options.embedFonts !== undefined) viteWebfontDownloadOptions.embedFonts = options.embedFonts;
        if (options.minifyCss !== undefined) viteWebfontDownloadOptions.minifyCss = options.minifyCss;
        if (options.proxy !== undefined) viteWebfontDownloadOptions.proxy = options.proxy;
        if (options.subsetsAllowed !== undefined) viteWebfontDownloadOptions.subsetsAllowed = options.subsetsAllowed;
        if (options.throwError !== undefined) viteWebfontDownloadOptions.throwError = options.throwError;
        addVitePlugin(viteWebfontDownload(options.webfontUrls, viteWebfontDownloadOptions));

        // Add link media attribute switcher plugin
        const linkTagId = `c${randomBytes(16).toString('hex')}`;
        addPluginTemplate({
            filename: 'link-media-switcher.client.ts',
            getContents() {
                return `
import { defineNuxtPlugin } from '#app/nuxt';

const linkElement = document.querySelector('link#${linkTagId}');
if (linkElement?.sheet) linkElement.removeAttribute('media');
else linkElement?.addEventListener('load', () => linkElement.removeAttribute('media'));

export default defineNuxtPlugin(() => {});
                `;
            },
            mode: 'client',
            order: -60,
        });

        // Setup
        if (nuxt.options.dev) setupDev(options, nuxt, linkTagId);

        logger.success(
            `[nuxt-vite-plugin-webfont-dl] Initialized successfully in ${(performance.now() - startAt).toFixed(2)}ms`,
        );
    },
});
