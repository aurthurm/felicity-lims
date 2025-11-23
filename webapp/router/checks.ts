import { jwtDecode } from 'jwt-decode';

export function isTokenValid(token: string | null) {
    if ([null, undefined, ''].includes(token)) return false;
    let decoded = jwtDecode(token!) as { exp: number };
    let decodedTime = decoded?.exp;
    return Date.now() <= decodedTime;
}
