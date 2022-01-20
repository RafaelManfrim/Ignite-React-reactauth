import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"

export default function Dashboard() {
    const { user } = useAuth()

    useEffect(() => {
        api.get('/me').then(response => console.log(response.data))
    }, [])

    return (
        <main>
            <h1>Dashboard</h1>
            <h3>{user?.email}</h3>
        </main>
    )
}