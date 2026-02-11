import { reactive, toRefs, computed } from 'vue';
import useNotifyToast from './alert_toast';
import useApiUtil from './api_util';
import { DepartmentType, UserPreferenceType } from '@/types/gql';
import { GetUserPreferencesDocument, GetUserPreferencesQuery, GetUserPreferencesQueryVariables } from '@/graphql/operations/_queries';

export type ThemeVariant =
  | 'light'
  | 'dark'
  | 'black-and-white'
  | 'sterile'
  | 'clinical-blue'
  | 'emergency-red'
  | 'sterile-green'
  | 'warm-neutral'
  | 'cool-slate'
  | 'corporate-navy';

interface UserPreference {
    departments?: DepartmentType[];
    theme?: ThemeVariant;
    expandedMenu?: boolean;
    megaMenu?: boolean;
    defaultRoute?: string;
}

const { toastError } = useNotifyToast();

const state = reactive({
    departments: [] as DepartmentType[],
    theme: 'light' as ThemeVariant,
    expandedMenu: false,
    megaMenu: false,
    defaultRoute: '',
});

export default function userPreferenceComposable() {
    /**
     * Apply theme to DOM and localStorage
     */
    function applyTheme(themeValue: ThemeVariant): void {
        try {
            // Determine if dark mode should be active for dark class
            const isDark = themeValue === 'dark' || themeValue === 'emergency-red' || themeValue === 'cool-slate';

            // Apply dark class to document
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // Set data-theme attribute for CSS theme selection
            document.documentElement.setAttribute('data-theme', themeValue);

            // Save to localStorage
            localStorage.setItem('theme', themeValue);

            state.theme = themeValue;
        } catch (error) {
            toastError(`Failed to apply theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme(): void {
        try {
            const nextTheme = state.theme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
        } catch (error) {
            toastError(`Failed to toggle theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Load theme from localStorage, defaulting to light
     */
    function loadPreferredTheme(): void {
        try {
            const savedTheme = localStorage.getItem('theme');
            const theme = (savedTheme as ThemeVariant) || 'light';
            applyTheme(theme);
        } catch (error) {
            toastError(`Failed to load preferred theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Initialize preferences from UserPreferenceType
     */
    function initPreferences(preference: UserPreferenceType | UserPreference): void {
        try {
            if (preference.departments) {
                state.departments = preference.departments;
            }
            if (preference.theme) {
                applyTheme(preference.theme as ThemeVariant);
            }
            if (preference.expandedMenu !== undefined && preference.expandedMenu !== null) {
                state.expandedMenu = preference.expandedMenu;
            }
            if (preference.megaMenu !== undefined && preference.megaMenu !== null) {
                state.megaMenu = preference.megaMenu;
            }
            if (preference.defaultRoute) {
                state.defaultRoute = preference.defaultRoute;
            }
        } catch (error) {
            toastError(`Failed to initialize preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update a single preference
     */
    function updatePreference<K extends keyof typeof state>(key: K, value: typeof state[K]): void {
        try {
            state[key] = value;

            // Apply theme changes immediately
            if (key === 'theme') {
                applyTheme(value as ThemeVariant);
            }
        } catch (error) {
            toastError(`Failed to update preference: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if a department is selected
     */
    function isDepartmentSelected(departmentUid: string): boolean {
        return state.departments.some(dept => dept.uid === departmentUid);
    }

    /**
     * Toggle department selection
     */
    function toggleDepartment(department: DepartmentType): void {
        try {
            const index = state.departments.findIndex(dept => dept.uid === department.uid);
            if (index > -1) {
                state.departments.splice(index, 1);
            } else {
                state.departments.push(department);
            }
        } catch (error) {
            toastError(`Failed to update department: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get current preferences as object
     */
    const getCurrentPreferences = computed(() => ({
        theme: state.theme,
        expandedMenu: state.expandedMenu,
        megaMenu: state.megaMenu,
        defaultRoute: state.defaultRoute,
        departments: state.departments.map(d => d.uid),
    }));

    /**
     * Fetch user preferences from server
     */
    async function fetchUserPreferencesFromServer(): Promise<UserPreferenceType | null> {
        try {
            const { withClientQuery } = useApiUtil();
            const data = await withClientQuery<GetUserPreferencesQuery, GetUserPreferencesQueryVariables>(
                GetUserPreferencesDocument,
                {},
                'userPreferences'
            );

            if (data) {
                initPreferences(data as UserPreferenceType);
                return data as UserPreferenceType;
            }
            return null;
        } catch (error) {
            toastError(`Failed to fetch preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
        }
    }

    return {
        // State
        ...toRefs(state),

        // Methods
        applyTheme,
        toggleTheme,
        loadPreferredTheme,
        initPreferences,
        updatePreference,
        isDepartmentSelected,
        toggleDepartment,
        fetchUserPreferencesFromServer,

        // Computed
        getCurrentPreferences,
    };
}
