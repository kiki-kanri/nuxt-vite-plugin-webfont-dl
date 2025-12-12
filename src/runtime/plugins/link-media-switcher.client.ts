import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
    requestAnimationFrame(() => {
        const element = document.getElementById('nuxt-vite-plugin-webfont-dl-css-link');
        if (element?.tagName.toLowerCase() !== 'link') return;
        (element as HTMLLinkElement).removeAttribute('media');
    });
});
