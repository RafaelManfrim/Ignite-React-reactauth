import Router from 'next/router';
import { destroyCookie } from "nookies"
import { authChannel } from '../contexts/AuthContext';

export function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    Router.push('/')
    authChannel.postMessage('signOut')
}