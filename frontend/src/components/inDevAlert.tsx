export default function InDevAlert() {
  return (
    <div className="bg-warning/10 border border-warning/30 text-warning text-center py-2 px-4 text-xs mb-3 rounded-lg">
      This application is in development — previews may take time or fail to load.{' '}
      <a
        className="underline hover:text-text"
        href="https://github.com/theacebutler/linkIng"
        target="_blank"
        rel="noreferrer"
      >
        Follow the project on GitHub
      </a>
      .
    </div>
  );
}
