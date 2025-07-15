import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  sub: string;
  exp: number;
  roles: string[];
}

export function getUserRoles(): string[] {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log("null token");
    return [];
  }

  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    console.log('Decoded JWT:', decoded);
    return decoded.roles || [];
  } catch (error) {
    console.log("catch error", error);
    return [];
  }
}
