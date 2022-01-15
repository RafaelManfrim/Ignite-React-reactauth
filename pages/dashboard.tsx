import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {
    const { user } = useAuth()


    return (
        <main>
            <h1>Dashboard</h1>
            <h3>{user?.email}</h3>
        </main>
    )
}