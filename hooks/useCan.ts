import { useAuth } from "../contexts/AuthContext";
import { validateUserPermissions } from "../functions/validateUserPermissions";

interface UseCanParams {
    permissions?: string[]
    roles?: string[]
}

export function useCan({ permissions, roles }: UseCanParams) {
    const { user, isAuthenticated } = useAuth()

    if(!isAuthenticated) {
        return false
    }

    if(user) {
        const userHasValidPermissions = validateUserPermissions({ user, permissions, roles })
        return userHasValidPermissions
    }
}