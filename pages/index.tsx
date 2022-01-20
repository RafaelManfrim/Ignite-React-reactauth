import type { GetServerSideProps, NextPage } from 'next'
import { FormEvent, useState } from 'react'
import styles from '../styles/Home.module.scss'
import { useAuth } from '../contexts/AuthContext'
import { withSSRGuest } from '../functions/withSSRGuest'

const Home: NextPage = () => {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = { email, password }
    await signIn(data)
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
      <input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
      <button type="submit">Entrar</button>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})

export default Home
