export default defineNuxtConfig({
    compatibilityDate: '2100-01-01',
    css: ['@/assets/css/index.css'],
    modules: ['../src/module'],
    // eslint-disable-next-line style/max-len
    vitePluginWebfontDl: { webfontUrls: ['https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+TC:wght@100..900&display=swap'] },
});
