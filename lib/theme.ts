export const THEME_STORAGE_KEY = 'adoptdontshop-theme';
export const THEME_EVENT = 'adoptdontshop:theme';

// Runs before paint; preferences are local to this browser and need no account.
export const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.toggle('dark',matchMedia('(prefers-color-scheme: dark)').matches);}})();`;

export function setTheme(theme: 'light' | 'dark') {
    const style = document.createElement('style');
    style.textContent = '*,*::before,*::after{transition:none!important}';
    document.head.appendChild(style);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* Keep the current tab usable without storage. */ }
    void document.documentElement.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
    window.dispatchEvent(new Event(THEME_EVENT));
}

export function subscribeTheme(callback: () => void) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const systemChange = () => {
        let saved: string | null = null;
        try { saved = localStorage.getItem(THEME_STORAGE_KEY); } catch { /* Use system preference. */ }
        if (saved !== 'light' && saved !== 'dark') document.documentElement.classList.toggle('dark', media.matches);
        callback();
    };
    const storageChange = (event: StorageEvent) => {
        if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
        const dark = event.newValue === 'dark' || (event.newValue !== 'light' && media.matches);
        document.documentElement.classList.toggle('dark', dark);
        callback();
    };
    window.addEventListener(THEME_EVENT, callback);
    window.addEventListener('storage', storageChange);
    media.addEventListener('change', systemChange);
    return () => {
        window.removeEventListener(THEME_EVENT, callback);
        window.removeEventListener('storage', storageChange);
        media.removeEventListener('change', systemChange);
    };
}
