import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLaboratoryContextStore } from './laboratory_context';
import { useAuthStore } from './auth';
import * as guards from '@/guards';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  guard?: string;
  children?: NavigationItem[];
  category?: string;
  description?: string;
  shortcut?: string;
  badge?: string | number;
  isNew?: boolean;
  laboratorySpecific?: boolean;
  requiredLaboratoryTypes?: string[];
  priority?: number;
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
  isActive?: boolean;
  contextData?: any;
}

export interface NavigationCategory {
  id: string;
  label: string;
  icon: string;
  items: NavigationItem[];
  collapsed?: boolean;
  order?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void | Promise<void>;
  shortcut?: string;
  description?: string;
  contextDependent?: boolean;
}

const NAVIGATION_STORAGE_KEY = 'felicity_navigation_preferences';

export const useNavigationStore = defineStore('navigation', () => {
  const route = useRoute();
  const router = useRouter();
  const contextStore = useLaboratoryContextStore();
  const authStore = useAuthStore();

  // State
  const isCollapsed = ref(false);
  const searchQuery = ref('');
  const recentRoutes = ref<string[]>([]);
  const favoriteRoutes = ref<string[]>([]);
  const navigationPreferences = ref({
    showIcons: true,
    showDescriptions: false,
    compactMode: false,
    groupByCategory: true,
  });

  // Core navigation items structure
  const baseNavigationItems: NavigationItem[] = [
    // Dashboard & Overview
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'tachometer-alt',
      route: '/dashboard',
      category: 'overview',
      description: 'Laboratory overview and analytics',
      priority: 1,
      laboratorySpecific: true,
    },
    
    // Patient Management
    {
      id: 'patients-compact',
      label: 'Compact View',
      icon: 'bullseye',
      route: '/patients-compact',
      guard: guards.pages.PATIENTS_COMPACT,
      category: 'patients',
      description: 'Streamlined patient view',
      priority: 2,
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: 'user-injured',
      route: '/patients',
      guard: guards.pages.PATIENTS,
      category: 'patients',
      description: 'Patient registration and management',
      shortcut: 'Ctrl+P',
      priority: 1,
    },
    
    // Client Management
    {
      id: 'clients',
      label: 'Clients',
      icon: 'clinic-medical',
      route: '/clients',
      guard: guards.pages.CLIENTS,
      category: 'management',
      description: 'Client and facility management',
      priority: 3,
    },
    
    // Sample Management
    {
      id: 'samples',
      label: 'Samples',
      icon: 'vial',
      route: '/samples',
      guard: guards.pages.SAMPLES,
      category: 'samples',
      description: 'Sample registration and tracking',
      shortcut: 'Ctrl+S',
      priority: 1,
      laboratorySpecific: true,
    },
    
    // Worksheet Management
    {
      id: 'worksheets',
      label: 'Worksheets',
      icon: 'grip-vertical',
      route: '/worksheets',
      guard: guards.pages.WORKSHEETS,
      category: 'analysis',
      description: 'Analysis worksheets and batching',
      priority: 2,
      laboratorySpecific: true,
    },
    
    // Quality Control
    {
      id: 'quality-control',
      label: 'Quality Control',
      icon: 'anchor',
      route: '/quality-control',
      guard: guards.pages.QC_SAMPLES,
      category: 'analysis',
      description: 'QC samples and validation',
      priority: 3,
      laboratorySpecific: true,
    },
    
    // Notice Management
    {
      id: 'notice-manager',
      label: 'Notice Manager',
      icon: 'bell',
      route: '/notice-manager',
      guard: guards.pages.NOTICE_MANAGER,
      category: 'communication',
      description: 'Notices and announcements',
      priority: 1,
    },
    
    // Bio Banking
    {
      id: 'bio-banking',
      label: 'Bio Banking',
      icon: 'database',
      route: '/bio-banking',
      guard: guards.pages.BIO_BANKING,
      category: 'storage',
      description: 'Sample storage and bio banking',
      priority: 1,
      laboratorySpecific: true,
    },
    
    // Shipments/Referrals
    {
      id: 'shipments',
      label: 'Referrals',
      icon: 'truck',
      route: '/shipments',
      guard: guards.pages.REFERRAL,
      category: 'logistics',
      description: 'Sample referrals and shipments',
      priority: 1,
    },
    
    // Inventory
    {
      id: 'inventory',
      label: 'Inventory',
      icon: 'boxes-stacked',
      route: '/inventory',
      guard: guards.pages.INVENTORY,
      category: 'management',
      description: 'Inventory and stock management',
      priority: 2,
    },
    
    // Projects/Schemes
    {
      id: 'schemes',
      label: 'Projects',
      icon: 'project-diagram',
      route: '/schemes',
      guard: guards.pages.SCHEMES,
      category: 'management',
      description: 'Research projects and schemes',
      priority: 4,
    },
    
    // Documents
    {
      id: 'documents',
      label: 'Documents',
      icon: 'file',
      route: '/documents',
      guard: guards.pages.DOCUMENT,
      category: 'management',
      description: 'Document management system',
      priority: 5,
    },

    // User Management (Enhanced)
    {
      id: 'user-management',
      label: 'User Management',
      icon: 'users',
      route: '/admin/users-conf',
      guard: guards.pages.ADMINISTRATION,
      category: 'administration',
      description: 'User accounts and permissions',
      children: [
        {
          id: 'users-listing',
          label: 'Users',
          icon: 'user',
          route: '/admin/users-conf',
          guard: guards.pages.ADMINISTRATION,
          category: 'administration',
          description: 'View and manage users',
        },
        {
          id: 'enhanced-registration',
          label: 'Register User',
          icon: 'user-plus',
          route: '/admin/users-conf?tab=enhanced-registration',
          guard: guards.pages.ADMINISTRATION,
          category: 'administration',
          description: 'Register new users',
          isNew: true,
        },
        {
          id: 'lab-permissions',
          label: 'Lab Permissions',
          icon: 'key',
          route: '/admin/users-conf?tab=lab-permissions',
          guard: guards.pages.ADMINISTRATION,
          category: 'administration',
          description: 'Laboratory-specific permissions',
          isNew: true,
        },
      ],
    },
  ];

  // Navigation categories
  const navigationCategories: NavigationCategory[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'chart-line',
      items: [],
      order: 1,
    },
    {
      id: 'patients',
      label: 'Patient Care',
      icon: 'user-injured',
      items: [],
      order: 2,
    },
    {
      id: 'samples',
      label: 'Sample Management',
      icon: 'vial',
      items: [],
      order: 3,
    },
    {
      id: 'analysis',
      label: 'Analysis & QC',
      icon: 'microscope',
      items: [],
      order: 4,
    },
    {
      id: 'logistics',
      label: 'Logistics',
      icon: 'truck',
      items: [],
      order: 5,
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: 'database',
      items: [],
      order: 6,
    },
    {
      id: 'management',
      label: 'Management',
      icon: 'cog',
      items: [],
      order: 7,
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: 'comments',
      items: [],
      order: 8,
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: 'user-shield',
      items: [],
      order: 9,
    },
  ];

  // Computed properties
  const currentLaboratory = computed(() => contextStore.context.activeLaboratory);
  const hasMultipleLaboratories = computed(() => contextStore.hasMultipleLaboratories);

  // Filter navigation items based on context and permissions
  const availableNavigationItems = computed(() => {
    return baseNavigationItems.filter(item => {
      // Check permissions
      if (item.guard && !guards.canAccessPage(item.guard)) {
        return false;
      }

      // Check laboratory-specific items
      if (item.laboratorySpecific && !currentLaboratory.value) {
        return false;
      }

      // Check required laboratory types (if implemented)
      if (item.requiredLaboratoryTypes && currentLaboratory.value) {
        // This would check laboratory type when implemented
        // return item.requiredLaboratoryTypes.includes(currentLaboratory.value.type);
      }

      return true;
    });
  });

  // Categorized navigation items
  const categorizedNavigation = computed(() => {
    const categories = navigationCategories.map(cat => ({ ...cat, items: [] }));
    
    availableNavigationItems.value.forEach(item => {
      const category = categories.find(cat => cat.id === item.category);
      if (category) {
        category.items.push(item);
      }
    });

    // Sort items within categories by priority
    categories.forEach(category => {
      category.items.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    });

    // Filter out empty categories and sort by order
    return categories
      .filter(cat => cat.items.length > 0)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  });

  // Search filtered navigation
  const filteredNavigation = computed(() => {
    if (!searchQuery.value) return availableNavigationItems.value;

    const query = searchQuery.value.toLowerCase();
    return availableNavigationItems.value.filter(item =>
      item.label.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.route.toLowerCase().includes(query)
    );
  });

  // Quick actions based on context
  const contextQuickActions = computed((): QuickAction[] => {
    const actions: QuickAction[] = [
      {
        id: 'new-patient',
        label: 'New Patient',
        icon: 'user-plus',
        action: () => router.push('/patients?action=create'),
        shortcut: 'Ctrl+Shift+P',
        description: 'Register a new patient',
        contextDependent: false,
      },
      {
        id: 'new-sample',
        label: 'New Sample',
        icon: 'vial',
        action: () => router.push('/samples?action=create'),
        shortcut: 'Ctrl+Shift+S',
        description: 'Register a new sample',
        contextDependent: true,
      },
    ];

    if (currentLaboratory.value) {
      actions.push({
        id: 'lab-dashboard',
        label: 'Lab Dashboard',
        icon: 'tachometer-alt',
        action: () => router.push(`/laboratory/${currentLaboratory.value!.uid}/dashboard`),
        shortcut: 'Ctrl+D',
        description: 'Go to laboratory dashboard',
        contextDependent: true,
      });
    }

    if (hasMultipleLaboratories.value) {
      actions.push({
        id: 'switch-lab',
        label: 'Switch Laboratory',
        icon: 'exchange-alt',
        action: () => router.push('/select-laboratory'),
        shortcut: 'Ctrl+L',
        description: 'Switch laboratory context',
        contextDependent: true,
      });
    }

    return actions;
  });

  // Breadcrumb generation
  const breadcrumbs = computed((): BreadcrumbItem[] => {
    const routePath = route.path;
    const pathSegments = routePath.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add laboratory context if available
    if (currentLaboratory.value) {
      breadcrumbs.push({
        label: currentLaboratory.value.name,
        icon: 'building',
        contextData: currentLaboratory.value,
      });
    }

    // Build breadcrumbs from route
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Find navigation item for this path
      const navItem = availableNavigationItems.value.find(item => 
        item.route === currentPath || item.route.startsWith(currentPath)
      );

      if (navItem) {
        breadcrumbs.push({
          label: navItem.label,
          route: currentPath,
          icon: navItem.icon,
          isActive: index === pathSegments.length - 1,
        });
      } else {
        // Generate breadcrumb from segment
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        breadcrumbs.push({
          label,
          route: currentPath,
          isActive: index === pathSegments.length - 1,
        });
      }
    });

    return breadcrumbs;
  });

  // Recent routes management
  const addToRecentRoutes = (routePath: string) => {
    const index = recentRoutes.value.indexOf(routePath);
    if (index > -1) {
      recentRoutes.value.splice(index, 1);
    }
    recentRoutes.value.unshift(routePath);
    
    // Keep only last 10 routes
    if (recentRoutes.value.length > 10) {
      recentRoutes.value = recentRoutes.value.slice(0, 10);
    }
    
    saveNavigationPreferences();
  };

  // Favorite routes management
  const toggleFavoriteRoute = (routePath: string) => {
    const index = favoriteRoutes.value.indexOf(routePath);
    if (index > -1) {
      favoriteRoutes.value.splice(index, 1);
    } else {
      favoriteRoutes.value.push(routePath);
    }
    saveNavigationPreferences();
  };

  const isFavoriteRoute = (routePath: string) => {
    return favoriteRoutes.value.includes(routePath);
  };

  // Navigation preferences
  const saveNavigationPreferences = () => {
    try {
      const preferences = {
        isCollapsed: isCollapsed.value,
        recentRoutes: recentRoutes.value,
        favoriteRoutes: favoriteRoutes.value,
        preferences: navigationPreferences.value,
      };
      localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save navigation preferences:', error);
    }
  };

  const loadNavigationPreferences = () => {
    try {
      const stored = localStorage.getItem(NAVIGATION_STORAGE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        isCollapsed.value = preferences.isCollapsed || false;
        recentRoutes.value = preferences.recentRoutes || [];
        favoriteRoutes.value = preferences.favoriteRoutes || [];
        Object.assign(navigationPreferences.value, preferences.preferences || {});
      }
    } catch (error) {
      console.error('Failed to load navigation preferences:', error);
    }
  };

  // Navigation state management
  const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value;
    saveNavigationPreferences();
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  // Context-aware navigation
  const navigateToContextRoute = (baseRoute: string) => {
    if (currentLaboratory.value) {
      return `${baseRoute}?laboratory=${currentLaboratory.value.uid}`;
    }
    return baseRoute;
  };

  const getRouteWithContext = (item: NavigationItem) => {
    if (item.laboratorySpecific && currentLaboratory.value) {
      const route = item.route;
      const separator = route.includes('?') ? '&' : '?';
      return `${route}${separator}laboratory=${currentLaboratory.value.uid}`;
    }
    return item.route;
  };

  // Find navigation item by route
  const findNavigationItem = (routePath: string): NavigationItem | undefined => {
    return availableNavigationItems.value.find(item => 
      item.route === routePath || 
      routePath.startsWith(item.route + '/') ||
      routePath.startsWith(item.route + '?')
    );
  };

  // Get navigation badge count (for notifications, etc.)
  const getNavigationBadge = (itemId: string): string | number | undefined => {
    // This can be extended to show notification counts, etc.
    switch (itemId) {
      case 'notice-manager':
        // Return unread notice count
        return undefined; // Placeholder
      default:
        return undefined;
    }
  };

  // Watch for route changes to update recent routes
  watch(() => route.path, (newPath) => {
    addToRecentRoutes(newPath);
  });

  // Initialize preferences on store creation
  loadNavigationPreferences();

  return {
    // State
    isCollapsed,
    searchQuery,
    recentRoutes,
    favoriteRoutes,
    navigationPreferences,

    // Computed
    currentLaboratory,
    hasMultipleLaboratories,
    availableNavigationItems,
    categorizedNavigation,
    filteredNavigation,
    contextQuickActions,
    breadcrumbs,

    // Actions
    toggleCollapsed,
    setSearchQuery,
    clearSearch,
    addToRecentRoutes,
    toggleFavoriteRoute,
    isFavoriteRoute,
    saveNavigationPreferences,
    loadNavigationPreferences,
    navigateToContextRoute,
    getRouteWithContext,
    findNavigationItem,
    getNavigationBadge,

    // Constants
    navigationCategories,
    baseNavigationItems,
  };
});