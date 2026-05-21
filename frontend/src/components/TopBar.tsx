import Cookies from "js-cookie";
import { config } from "../../config";
import { logout } from "../utils/userRequests";
import { useAuths } from "../hooks/useAuths";


export function TopBar() {
  const { isLogin, setIsLogin, username, password } = useAuths();
  async function handleClick() {
    if (isLogin) {
      Cookies.remove(config.ACCESS_TOKEN_KEY_NAME)
      Cookies.remove(config.REFRESH_TOKEN_KEY_NAME)
      window.location.reload()
      logout(username, password)
      setIsLogin(false)
    }
    return
  }
  return (
    <div className="flex justify-between items-center py-4 px-8 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold">Resource Collection</h1>
      <div className="flex items-center gap-4">
        <button
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          {isLogin ? "Log Out" : "Login / Register"}
        </button>
      </div>
    </div>
  );
}
