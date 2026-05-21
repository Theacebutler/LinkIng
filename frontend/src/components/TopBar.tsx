import Cookies from "js-cookie";


export function TopBar() {
  function deleteCookies() {
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
    window.location.reload()
    return
  }
  return (
    <div className="flex justify-between items-center py-4 px-8 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold">Resource Collection</h1>
      <div className="flex items-center gap-4">
        <button
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
          onClick={deleteCookies}
        >
          deleteCookies
        </button>
      </div>
    </div>
  );
}
