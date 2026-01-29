import { jwtDecode } from 'jwt-decode';

export function isTokenValid(token: string | null) {
    if ([null, undefined, ''].includes(token)) return false;
    const decoded = jwtDecode(token!) as { exp: number };
    const decodedTime = decoded?.exp;
    return Date.now() <= decodedTime;
}
