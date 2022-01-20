import { useCan } from "../hooks/useCan"

interface CanProps {
    children: React.ReactNode
    permissions?: string[]
    roles?: string[]
}

export function Can({ children, permissions = [], roles = []}: CanProps) {
    const userCanSee = useCan({ permissions, roles })

    if(!userCanSee) {
        return null
    }

    return (
        <>
            {children}
        </>
    )
}