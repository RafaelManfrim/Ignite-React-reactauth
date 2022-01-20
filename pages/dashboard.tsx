import { useEffect } from "react"
import { Can } from "../components/Can"
import { useAuth } from "../contexts/AuthContext"
import { withSSRAuth } from "../functions/withSSRAuth"
import { useCan } from "../hooks/useCan"
import { setupApiClient } from "../services/api"
import { api } from "../services/apiClient"

export default function Dashboard() {
    const { user } = useAuth()
    const userCanSeeMetrics = useCan({
        permissions: ['metrics.list']
    })

    useEffect(() => {
        api.get('/me').then(response => console.log(response.data))
    }, [])

    return (
        <main>
            <h1>Dashboard</h1>
            <h2>{user?.email}</h2>

            {userCanSeeMetrics && <div>Métricas</div>}

            <Can permissions={['metrics.list']}>
                <h4>Dados</h4>
            </Can>
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