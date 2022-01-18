import { createContext, useContext, useEffect, useState } from "react";
import Router from "next/router"
import { api } from "../services/api";
import { setCookie, parseCookies } from 'nookies'
import { signOut } from "../functions/signOut";

type User = {
    email: string
    permissions: string[]
    roles: string[]
}

type signInCredentials = {
    email: string
    password: string
}

type AuthContextData = {
    signIn(credentials: signInCredentials): Promise<void>
    isAuthenticated: boolean
    user?: User
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()
        
        if(token) {
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data
                setUser({ email, permissions, roles })
            }).catch(() => {
                signOut()
            })
        }
    }, [])

    async function signIn({ email, password }: signInCredentials) {
        try {
            const response = await api.post("/sessions/", { email, password})
            const { token, refreshToken, permissions, roles } = response.data

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 24 * 60 * 60 * 7,
                path: '/'
            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 24 * 60 * 60 * 7,
                path: '/'
            })

            setUser({ email, permissions, roles })

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard')
        } catch {
            alert("Houve um erro ao logar")
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)