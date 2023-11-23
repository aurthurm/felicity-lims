import jwt_decode from 'jwt-decode';

export function isTokenValid(token: string | null) {
    console.log(token);
    if ([null, undefined, ''].includes(token)) return false;
    let decoded = jwt_decode(token!) as { exp: number };
    let decodedTime = decoded?.exp;
    console.log(decodedTime);
    return Date.now() <= decodedTime;
}
