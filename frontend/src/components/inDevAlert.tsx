export default function InDevAlert() {
  return (
    <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-lg px-3 py-3 text-sm mx-3  text-indigo-600 text-center">
      New: You can add resources via apple shortcuts. Check out the  <a
        className="underline hover:text-text"
        href="https://github.com/theacebutler/linking#apple-screenshots-integration"
        target="_blank"
        rel="noreferrer"
      >
        project on GitHub
      </a> to learn more.
    </div>
  );
}
