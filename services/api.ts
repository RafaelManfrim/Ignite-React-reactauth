import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../functions/signOut";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefreshing = false
let failedRequestsQueue: any[] = []

type setupApiClientContext = {
    ctx?: GetServerSidePropsContext
}

export function setupApiClient({ctx = undefined}: setupApiClientContext) {
    let cookies = parseCookies(ctx)

    const api = axios.create({
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
                cookies = parseCookies(ctx)
    
                const { 'nextauth.refreshToken': refreshToken } = cookies
                const originalConfig = error.config
    
                if(!isRefreshing) {
                    isRefreshing = true
    
                    api.post('/refresh/', { refreshToken }).then(response => {
                        const { token } = response.data
    
                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 24 * 60 * 60 * 7,
                            path: '/'
                        })
                        setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
                            maxAge: 24 * 60 * 60 * 7,
                            path: '/'
                        })
        
                        api.defaults.headers['Authorization'] = `Bearer ${token}`
    
                        failedRequestsQueue.forEach(req => req.onSuccess(token))
                        failedRequestsQueue = []
    
                    }).catch(err => {
                        failedRequestsQueue.forEach(req => req.onFailure(err))
                        failedRequestsQueue = []
    
                        if(process.browser) {
                            signOut()
                        } else {
                            return Promise.reject(new AuthTokenError())
                        }
                        
                    }).finally(() => {
                        isRefreshing = false
                    })
                }
    
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {
                            if(originalConfig.headers) {
                                originalConfig.headers['Authorization'] = `Bearer ${token}`
                                
                                resolve(api(originalConfig))
                            }
                        },
                        onFailure: (err: AxiosError) => {
                            reject(err)
                        }
                    })
                })
    
            } else {
                if(process.browser) {
                    signOut()
                } else {
                    return Promise.reject(new AuthTokenError())
                }
            }
        }
    
        return Promise.reject(error)
    })

    return api
}
