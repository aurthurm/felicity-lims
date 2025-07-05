import {reactive, toRefs} from 'vue';
import useNotifyToast from './alert_toast';
import {DepartmentType} from '@/types/gql';


interface Theme {
    variant: 'light' | 'dark';
    icon: 'sun' | 'moon';
}

interface UserPreference {
    departments: DepartmentType[];
    theme: 'light' | 'dark';
    expandedMenu: boolean;
}

interface PreferenceState {
    departments: DepartmentType[];
    theme: Theme;
    expandedMenu: boolean;
}

const {toastError} = useNotifyToast();

const state = reactive<PreferenceState>({
    departments: [],
    theme: {
        variant: 'light',
        icon: 'sun',
    },
    expandedMenu: true,
});

export default function userPreferenceComposable() {
    function changeTheme(theme: 'light' | 'dark'): void {
        try {
            if (theme === 'dark') {
                localStorage.theme = 'dark';
                document.documentElement.classList.add('dark');
            } else {
                localStorage.theme = 'light';
                document.documentElement.classList.remove('dark');
            }
        } catch (error) {
            toastError(`Failed to change theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    function initPreferences(preference: UserPreference): void {
        try {
            state.departments = preference.departments;
            state.theme.variant = preference.theme;
            state.theme.icon = preference.theme === 'light' ? 'sun' : 'moon';
            state.expandedMenu = preference.expandedMenu;
            changeTheme(preference.theme);
        } catch (error) {
            toastError(`Failed to initialize preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    function toggleTheme(): void {
        try {
            if (state.theme.variant === 'dark') {
                state.theme.variant = 'light';
                state.theme.icon = 'sun';
                changeTheme('light');
            } else {
                state.theme.variant = 'dark';
                state.theme.icon = 'moon';
                changeTheme('dark');
            }
        } catch (error) {
            toastError(`Failed to toggle theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    function loadPreferredTheme(): void {
        try {
            if ('theme' in localStorage) {
                const theme = localStorage.getItem('theme') as 'light' | 'dark' ?? 'light';
                state.theme.variant = theme;
                state.theme.icon = theme === 'light' ? 'sun' : 'moon';
            }
            changeTheme(state.theme.variant);
        } catch (error) {
            toastError(`Failed to load preferred theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return {
        ...toRefs(state),
        initPreferences,
        loadPreferredTheme: loadPreferredTheme,
        toggleTheme,
    };
}
