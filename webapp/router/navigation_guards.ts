import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useLaboratoryContextStore } from '@/stores/laboratory_context';
import { useAuthStore } from '@/stores/auth';
import { useNavigationStore } from '@/stores/navigation';
import * as guards from '@/guards';

/**
 * Navigation guard that checks laboratory context requirements
 */
export const laboratoryContextGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const contextStore = useLaboratoryContextStore();
  const authStore = useAuthStore();
  const navigationStore = useNavigationStore();

  // Check if user is authenticated
  if (!authStore.auth.isAuthenticated) {
    next('/auth/login');
    return;
  }

  // Find navigation item for this route
  const navItem = navigationStore.findNavigationItem(to.path);
  
  // Check if route requires laboratory context
  const requiresLaboratory = navItem?.laboratorySpecific || 
                           to.meta?.requiresLaboratory ||
                           to.path.includes('/dashboard') ||
                           to.path.includes('/samples') ||
                           to.path.includes('/worksheets') ||
                           to.path.includes('/quality-control') ||
                           to.path.includes('/bio-banking');

  if (requiresLaboratory) {
    // Check if user has laboratory context
    if (!contextStore.context.activeLaboratory) {
      // Redirect to laboratory selection with return URL
      next({
        path: '/select-laboratory',
        query: { redirect: to.fullPath },
      });
      return;
    }

    // Check if user has access to the required laboratory types (if specified)
    if (navItem?.requiredLaboratoryTypes && navItem.requiredLaboratoryTypes.length > 0) {
      const currentLabType = contextStore.context.activeLaboratory.type;
      if (currentLabType && !navItem.requiredLaboratoryTypes.includes(currentLabType)) {
        // Redirect to unauthorized page
        next({
          path: '/unauthorized',
          query: { reason: 'laboratory_type_mismatch' },
        });
        return;
      }
    }
  }

  // Check page permissions using existing guards
  if (navItem?.guard && !guards.canAccessPage(navItem.guard)) {
    next({
      path: '/unauthorized',
      query: { reason: 'insufficient_permissions' },
    });
    return;
  }

  // Update laboratory context in route query if needed
  if (requiresLaboratory && contextStore.context.activeLaboratory) {
    const updatedQuery = {
      ...to.query,
      laboratory: contextStore.context.activeLaboratory.uid,
    };

    // Only update if query actually changed
    if (JSON.stringify(updatedQuery) !== JSON.stringify(to.query)) {
      next({
        ...to,
        query: updatedQuery,
      });
      return;
    }
  }

  next();
};

/**
 * Navigation guard that handles route permissions
 */
export const permissionGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const navigationStore = useNavigationStore();

  // Check authentication
  if (!authStore.auth.isAuthenticated) {
    // Allow access to public routes
    const publicRoutes = ['/auth/login', '/auth/register', '/select-laboratory', '/'];
    if (publicRoutes.includes(to.path)) {
      next();
      return;
    }

    next('/auth/login');
    return;
  }

  // Find navigation item and check permissions
  const navItem = navigationStore.findNavigationItem(to.path);
  if (navItem?.guard && !guards.canAccessPage(navItem.guard)) {
    next('/unauthorized');
    return;
  }

  next();
};

/**
 * Navigation guard that tracks route history and updates navigation state
 */
export const navigationTrackingGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const navigationStore = useNavigationStore();

  // Add to recent routes (this will be done automatically by the store watcher)
  // But we can also trigger any custom tracking here

  // Update any route-specific navigation state
  if (to.path !== from.path) {
    // Clear search if navigating to a different route
    navigationStore.clearSearch();
  }

  next();
};

/**
 * Guard for admin routes that require special permissions
 */
export const adminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();

  if (!authStore.auth.isAuthenticated) {
    next('/auth/login');
    return;
  }

  // Check if user has admin access
  if (!guards.canAccessPage(guards.pages.ADMINISTRATION)) {
    next('/unauthorized');
    return;
  }

  next();
};

/**
 * Guard for routes that should redirect based on laboratory context
 */
export const contextRedirectGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const contextStore = useLaboratoryContextStore();
  const authStore = useAuthStore();

  // Handle root route redirection
  if (to.path === '/') {
    if (!authStore.auth.isAuthenticated) {
      next('/auth/login');
      return;
    }

    if (!contextStore.context.activeLaboratory) {
      next('/select-laboratory');
      return;
    }

    // Redirect to dashboard if user has laboratory context
    next('/dashboard');
    return;
  }

  next();
};

/**
 * Guard that validates laboratory context from URL parameters
 */
export const laboratoryParameterGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const contextStore = useLaboratoryContextStore();
  const laboratoryUid = to.query.laboratory as string;

  // If route has laboratory parameter, validate it
  if (laboratoryUid) {
    const availableLabs = contextStore.context.availableLaboratories;
    const requestedLab = availableLabs.find(lab => lab.uid === laboratoryUid);

    if (!requestedLab) {
      // Laboratory not found or not accessible
      next({
        path: '/select-laboratory',
        query: { error: 'laboratory_not_found' },
      });
      return;
    }

    // Switch to the requested laboratory if different from current
    if (!contextStore.context.activeLaboratory || 
        contextStore.context.activeLaboratory.uid !== laboratoryUid) {
      
      try {
        await contextStore.switchLaboratory(laboratoryUid);
      } catch (error) {
        console.error('Failed to switch laboratory:', error);
        next({
          path: '/select-laboratory',
          query: { error: 'switch_failed' },
        });
        return;
      }
    }
  }

  next();
};

/**
 * Combine all navigation guards into a single setup function
 */
export const setupNavigationGuards = (router: any) => {
  // Global before guards (order matters!)
  router.beforeEach(permissionGuard);
  router.beforeEach(laboratoryParameterGuard);
  router.beforeEach(laboratoryContextGuard);
  router.beforeEach(contextRedirectGuard);
  router.beforeEach(navigationTrackingGuard);

  // Global after hooks
  router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // Update document title based on route
    const navigationStore = useNavigationStore();
    const navItem = navigationStore.findNavigationItem(to.path);
    
    if (navItem) {
      document.title = `${navItem.label} - Felicity LIMS`;
    } else {
      document.title = 'Felicity LIMS';
    }

    // Emit navigation event for analytics or other tracking
    window.dispatchEvent(new CustomEvent('navigation:route-changed', {
      detail: { to: to.path, from: from.path },
    }));
  });
};

/**
 * Helper function to check if a route requires laboratory context
 */
export const routeRequiresLaboratory = (routePath: string): boolean => {
  const laboratorySpecificPaths = [
    '/dashboard',
    '/samples',
    '/worksheets',
    '/quality-control',
    '/bio-banking',
  ];

  return laboratorySpecificPaths.some(path => routePath.startsWith(path));
};

/**
 * Helper function to build route with laboratory context
 */
export const buildRouteWithContext = (route: string, laboratoryUid?: string): string => {
  if (!laboratoryUid || !routeRequiresLaboratory(route)) {
    return route;
  }

  const separator = route.includes('?') ? '&' : '?';
  return `${route}${separator}laboratory=${laboratoryUid}`;
};

export default {
  setupNavigationGuards,
  laboratoryContextGuard,
  permissionGuard,
  navigationTrackingGuard,
  adminGuard,
  contextRedirectGuard,
  laboratoryParameterGuard,
  routeRequiresLaboratory,
  buildRouteWithContext,
};