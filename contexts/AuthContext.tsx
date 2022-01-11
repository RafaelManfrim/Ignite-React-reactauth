import { createContext, useContext } from "react";

type signInCredentials = {
    email: string
    password: string
}

type AuthContextData = {
    signIn(credentials: signInCredentials): Promise<void>
    isAuthenticated: boolean
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    const isAuthenticated = false

    async function signIn({ email, password }: signInCredentials) {
        console.log(email, password)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)