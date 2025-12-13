import {
    defineNitroPlugin,
    useRuntimeConfig,
} from 'nitropack/runtime';

export default defineNitroPlugin((nitro) => {
    const { _nuxtVitePluginWebfontDlLinkTagsString } = useRuntimeConfig();
    if (!_nuxtVitePluginWebfontDlLinkTagsString) return;
    nitro.hooks.hook('render:html', (ctx) => void ctx.head.push(_nuxtVitePluginWebfontDlLinkTagsString));
});
