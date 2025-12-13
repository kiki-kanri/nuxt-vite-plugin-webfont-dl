import { randomBytes } from 'node:crypto';

import type { Resolver } from '@nuxt/kit';
import {
    addPluginTemplate,
    addServerPlugin,
    addVitePlugin,
    createResolver,
    defineNuxtModule,
    useLogger,
} from '@nuxt/kit';
import type {
    Nuxt,
    NuxtOptions,
} from '@nuxt/schema';
import type { ConsolaInstance } from 'consola';
import type { OutputAsset } from 'rollup';
import { viteWebfontDownload } from 'vite-plugin-webfont-dl';

import type {
    UserModuleOptions,
    ViteWebfontDownloadOptions,
} from './types/options';

// Constants
const moduleName = 'nuxt-vite-plugin-webfont-dl';

// Functions
function setupBuild(
    options: UserModuleOptions,
    nuxt: Nuxt,
    linkTagId: string,
    logger: ConsolaInstance,
    resolver: Resolver,
) {
    // Register server plugin to inject link tags into rendered HTML
    addServerPlugin(resolver.resolve('./runtime/server/plugins/insert-link-tags-to-html'));

    // Register Vite plugin to post-process webfonts.css and generate final link tags
    // TODO: Respect Nuxt baseURL and buildAssetsDir instead of assuming root (_nuxt)
    let linkTagsString: string | undefined;
    addVitePlugin({
        enforce: 'post',
        generateBundle(_, bundle) {
            // Locate generated webfonts.css asset
            const webfontsCssAsset = Object.values(bundle).find((asset): asset is OutputAsset => {
                return asset.type === 'asset'
                  && asset.names.length === 1
                  && asset.names[0] === 'webfonts.css'
                  && asset.originalFileNames.length === 1
                  && asset.originalFileNames[0] === 'webfonts.css';
            });

            if (!webfontsCssAsset) return logger.error(`[${moduleName}] Failed to locate webfonts.css in build assets`);
            if (typeof webfontsCssAsset.source !== 'string') {
                return logger.error(`[${moduleName}] webfonts.css asset source is not a string`);
            }

            // Normalize asset URLs inside webfonts.css
            webfontsCssAsset.source = webfontsCssAsset
                .source
                .replaceAll('src:url(_nuxt/', 'src:url(/_nuxt/')
                .replaceAll('src: url(_nuxt/', 'src: url(/_nuxt/');

            // Construct link tag HTML
            const linkHref = `/${webfontsCssAsset.fileName}`;
            const stylesheetLinkParts = [
                `id="${linkTagId}"`,
                'rel="stylesheet"',
                `href="${linkHref}"`,
            ];

            if (options.async) {
                stylesheetLinkParts.push('media="print"');
                if (options.useOnloadMediaSwitch) {
                    stylesheetLinkParts.push(`onload="this.onload=null;this.removeAttribute('media');"`);
                }
            }

            linkTagsString = [
                `<link as="style" href="${linkHref}" rel="preload">`,
                `<link ${stylesheetLinkParts.join(' ')}>`,
            ].join('');
        },
        name: 'nuxt-vite-plugin-webfont-dl',
    });

    // Inject generated link tags into Nitro runtime config
    nuxt.hook(
        'nitro:build:before',
        (nitro) => {
            if (!linkTagsString) return;
            nitro.options.runtimeConfig._nuxtVitePluginWebfontDlLinkTagsString = linkTagsString;
            nitro.hooks.hook(
                'prerender:config',
                (nitroConfig) => {
                    nitroConfig.runtimeConfig ||= {};
                    nitroConfig.runtimeConfig._nuxtVitePluginWebfontDlLinkTagsString = linkTagsString;
                },
            );
        },
    );
}

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
        name: moduleName,
    },
    setup(options, nuxt) {
        const logger = useLogger();
        if (!options.enabled) return logger.info(`[${moduleName}] Disabled`);
        const startAt = performance.now();
        logger.info(`[${moduleName}] Initializing...`);
        const resolver = createResolver(import.meta.url);

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

        // Add link tag media attribute switcher plugin
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
        else setupBuild(options, nuxt, linkTagId, logger, resolver);

        logger.success(`[${moduleName}] Initialized successfully in ${(performance.now() - startAt).toFixed(2)}ms`);
    },
});
