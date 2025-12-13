import type { viteWebfontDownload } from 'vite-plugin-webfont-dl';

export type ViteWebfontDownloadOptions = NonNullable<Parameters<typeof viteWebfontDownload>[1]>;

// Module options TypeScript interface definition
export interface UserModuleOptions extends Omit<ViteWebfontDownloadOptions, 'assetsSubfolder' | 'injectAsStyleTag'> {
    /**
     * @default true
     */
    enabled?: boolean;

    /**
     * Only takes effect when the async option is enabled.
     *
     * Remove the media="print" attribute when using the
     * onload attribute in link tags inserted into HTML.
     *
     * Due to the potential activation of the nuxt-security module
     * or other CSP settings, the onload attribute may fail to function.
     *
     * Although this module uses a plugin to ensure the removal of
     * media attributes, its execution sequence occurs later in the process.
     *
     * In other words, this toggle switch essentially only affects
     * the timing of the screen flickering when font loading is complete.
     *
     * If you don't mind CSP errors appearing in the console output,
     * there's no need to disable this option specifically.
     *
     * If you need to set the CSP hash, please set it to `sha256-nNExX8dGhf3ce7nlLMW210YbT1+ATSaoMpg5lf/l+Ng=`.
     */
    useOnloadMediaSwitch?: boolean;

    /**
     * Refer to [this link](https://github.com/feat-agency/vite-plugin-webfont-dl?tab=readme-ov-file#simple-config).
     */
    webfontUrls?: string | string[];
}
