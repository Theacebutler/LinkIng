export default function InDevAlert() {
  return (
    <div className="bg-amber-500/10 border border-red-400 text-red-400 text-center py-2 px-4 text-sm mb-3">
      This application is in development — you may encounter issues such as previews taking some time to load or not loading.
      <br />
      Follow the project on GitHub at <a className="underline" href="https://github.com/theacebutler/linkIng">github.com/theacebutler/linkIng</a>.
    </div>
  );
}
