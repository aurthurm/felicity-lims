import { toRefs, reactive } from 'vue';

const state = reactive({
    departments: [],
    theme: {
        variant: 'light',
        icon: 'sun',
    },

    expandedMenu: true,
});

export default function userPreferenceComposable() {
    function changeTheme(theme: string): void {
        if (theme === 'dark') {
            localStorage.theme = 'dark';
            document.documentElement.classList.add('dark');
        } else {
            localStorage.theme = 'light';
            document.documentElement.classList.remove('dark');
        }
    }

    function initPreferences(preference: any): void {
        state.departments = preference.departments;
        state.theme.variant = preference.theme;
        state.theme.icon = preference.theme === 'light' ? 'sun' : 'moon';
        state.expandedMenu = preference.expandedMenu;
        changeTheme(preference.theme);
    }

    function toggleTheme(): void {
        if (state.theme.variant === 'dark') {
            state.theme.variant = 'light';
            state.theme.icon = 'sun';
            changeTheme('light');
        } else {
            state.theme.variant = 'dark';
            state.theme.icon = 'moon';
            changeTheme('dark');
        }
    }

    function loadPreferedTheme() {
        if ('theme' in localStorage) {
            const theme = localStorage.getItem('theme') ?? 'light';
            state.theme.variant = theme;
            state.theme.icon = theme === 'light' ? 'sun' : 'moon';
        }
        changeTheme(state.theme.variant);
    }

    return {
        ...toRefs(state),
        initPreferences,
        loadPreferedTheme,
        toggleTheme,
    };
}
