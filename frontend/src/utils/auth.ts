import { jwtDecode } from 'jwt-decode'

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const isLoggedIn = (): boolean => {
  return !!getToken()
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const getUserRole = (): string | null => {
  const token = getToken()
  if (!token) return null

  try {
    const decoded: any = jwtDecode(token)
    return decoded.role
  } catch {
    return null
  }
}
