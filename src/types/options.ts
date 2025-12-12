import type { Except } from 'type-fest';
import type { viteWebfontDownload } from 'vite-plugin-webfont-dl';

type ViteWebfontDownloadOptions = NonNullable<Parameters<typeof viteWebfontDownload>[1]>;

// Module options TypeScript interface definition
export interface UserModuleOptions extends Except<ViteWebfontDownloadOptions, 'assetsSubfolder' | 'injectAsStyleTag'> {
    /**
     * @default true
     */
    enabled?: boolean;
    useOnloadRemoveMediaAttribute?: boolean;
    webfontUrls?: string | string[];
}
