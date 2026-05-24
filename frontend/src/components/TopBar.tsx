import Cookies from "js-cookie";
import { config } from "../../config";
import { logout } from "../utils/userRequests";
import { useAuths } from "../hooks/useAuths";


export function TopBar() {
  const { setIsLogin, username, password } = useAuths();
  async function handleClick() {
    Cookies.remove(config.ACCESS_TOKEN_KEY_NAME)
    Cookies.remove(config.REFRESH_TOKEN_KEY_NAME)
    window.location.reload()
    logout(username, password)
    setIsLogin(false)
    return
  }
  return (
    <div className="flex justify-end px-4 py-3">
      <button
        className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >Log Out</button>
    </div>
  );
}
