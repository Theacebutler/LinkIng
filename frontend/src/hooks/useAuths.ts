import { config } from "../../config"
import Cookies from "js-cookie"
import { useState } from "react"


export function useAuths(): {
  isLogin: boolean
  username: string
  password: string
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  setIsLogin: (isLogin: boolean) => void
} {
  const [isLogin, setIsLogin] = useState(
    Cookies.get(config.ACCESS_TOKEN_KEY_NAME) !== undefined &&
    Cookies.get(config.REFRESH_TOKEN_KEY_NAME) !== undefined
  )
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')



  return {
    isLogin,
    username,
    password,
    setUsername,
    setPassword,
    setIsLogin
  }
}
