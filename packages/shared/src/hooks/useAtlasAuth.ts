import { useAuth } from '@heliannuuthus/aegis-sdk'
import { getAuth, getAuthorizeOptions } from '../config/auth'

/** useAuth with Atlas auth config. */
export function useAtlasAuth() {
  return useAuth({ getAuth, getAuthorizeOptions })
}
