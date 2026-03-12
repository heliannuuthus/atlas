import { useAtlasAuthContext } from '../contexts/AuthContext'

/** useAuth with Atlas auth config. Must be used within AuthProvider. */
export function useAtlasAuth() {
  return useAtlasAuthContext()
}
