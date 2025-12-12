import type { viteWebfontDownload } from 'vite-plugin-webfont-dl';

export type ViteWebfontDownloadOptions = NonNullable<Parameters<typeof viteWebfontDownload>[1]>;

// Module options TypeScript interface definition
export interface UserModuleOptions extends Omit<ViteWebfontDownloadOptions, 'assetsSubfolder' | 'injectAsStyleTag'> {
    /**
     * @default true
     */
    enabled?: boolean;
    useOnloadMediaSwitch?: boolean;
    webfontUrls?: string | string[];
}
