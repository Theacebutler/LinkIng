import { useState } from "react"


export function useAuths(): {
  isLogin: boolean
  username: string
  password: string
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  setIsLogin: (isLogin: boolean) => void
} {
  const [isLogin, setisLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')



  return {
    isLogin,
    username,
    password,
    setUsername,
    setPassword,
    setIsLogin: setisLogin
  }
}

