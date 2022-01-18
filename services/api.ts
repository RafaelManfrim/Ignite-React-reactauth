import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../functions/signOut";

let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue: any[] = []

export const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }  
})

api.interceptors.response.use(response => {
    return response
}, (error: AxiosError) => {
    if(error.response?.status === 401) {
        if(error.response.data?.code === 'token.expired') {
            cookies = parseCookies()
            const { 'nextauth.refreshToken': refreshToken } = cookies
            const originalConfig = error.config

            if(!isRefreshing) {
                isRefreshing = true

                api.post('/refresh/', { refreshToken }).then(response => {
                    const newToken = response.data.token

                    setCookie(undefined, 'nextauth.token', newToken, {
                        maxAge: 24 * 60 * 60 * 7,
                        path: '/'
                    })
                    setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
                        maxAge: 24 * 60 * 60 * 7,
                        path: '/'
                    })
    
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

                    failedRequestsQueue.forEach(req => req.resolve(newToken))
                    failedRequestsQueue = []

                }).catch(err => {
                    failedRequestsQueue.forEach(req => req.reject(err))
                    failedRequestsQueue = []

                }).finally(() => {
                    isRefreshing = false
                })
            }

            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({
                    resolve: (token: string) => {
                        if(originalConfig.headers) {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`
                            resolve(api(originalConfig))
                        }
                    },
                    reject: (err: AxiosError) => {
                        reject(err)
                    }
                })
            })

        } else {
            signOut()
        }
    }

    return Promise.reject(error)
})