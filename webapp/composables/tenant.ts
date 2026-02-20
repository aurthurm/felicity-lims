const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);
const RESERVED_SUBDOMAINS = new Set(['www', 'api']);

const isIpAddress = (hostname: string): boolean => {
    if (hostname.includes(':')) {
        return true;
    }

    const parts = hostname.split('.');
    if (parts.length !== 4) {
        return false;
    }

    return parts.every(part => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
};

const decodeJwtPayload = (token?: string): Record<string, unknown> | undefined => {
    if (!token) {
        return undefined;
    }

    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) {
        return undefined;
    }

    try {
        const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        return JSON.parse(atob(padded)) as Record<string, unknown>;
    } catch {
        return undefined;
    }
};

const sanitizeTenantSlug = (value?: string): string | undefined => {
    if (!value) {
        return undefined;
    }

    const slug = value.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(slug)) {
        return undefined;
    }

    return slug;
};

export const getTenantSlugFromHostname = (hostname?: string): string | undefined => {
    if (!hostname) {
        return undefined;
    }

    const normalizedHost = hostname.toLowerCase();
    if (LOCAL_HOSTS.has(normalizedHost) || isIpAddress(normalizedHost)) {
        return undefined;
    }

    const labels = normalizedHost.split('.').filter(Boolean);
    if (labels.length < 3) {
        return undefined;
    }

    const subdomain = labels[0];
    if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) {
        return undefined;
    }

    return sanitizeTenantSlug(subdomain);
};

export const resolveTenantSlug = (token?: string): string | undefined => {
    const payload = decodeJwtPayload(token);
    const tokenSlug = sanitizeTenantSlug((payload?.tenant_slug as string | undefined) ?? undefined);
    if (tokenSlug) {
        return tokenSlug;
    }

    if (typeof window === 'undefined') {
        return undefined;
    }

    return getTenantSlugFromHostname(window.location.hostname);
};
