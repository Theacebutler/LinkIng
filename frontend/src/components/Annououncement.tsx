import { useClosePopups } from "../hooks/useCloseAnnouncment";

export default function Announecment() {
  const { isAnnouncementOpen, handleCloseAnnouncement } = useClosePopups();
  if (!isAnnouncementOpen) {
    return null
  }

  return (
    <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-lg px-3 py-3 text-sm mx-3 text-center relative">
      New: You can add resources via apple shortcuts. Check out the  <a
        className="underline hover:text-text"
        href="https://github.com/theacebutler/linking#apple-screenshots-integration"
        target="_blank"
        rel="noreferrer"
      >
        project on GitHub
      </a> to learn more.
      <i className="fa-solid fa-xmark text-text-soft ml-1 mt-1 cursor-pointer absolute right-10"
        onClick={handleCloseAnnouncement}
      />
    </div>
  );
}
