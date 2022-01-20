import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { withSSRAuth } from "../functions/withSSRAuth"
import { setupApiClient } from "../services/api"
import { api } from "../services/apiClient"

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupApiClient({ctx})
    const response = await apiClient.get('/me')

    return {
        props: {}
    }
})