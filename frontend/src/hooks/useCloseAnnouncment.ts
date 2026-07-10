import { useState } from 'react';
import Cookies from 'js-cookie';

interface ClosePopups {
  isAnnouncementOpen: boolean;
  handleCloseAnnouncement: () => void;
}
export function useClosePopups(): ClosePopups {
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(Cookies.get('isAnnouncementOpen') === 'false' ? false : true);

  function handleCloseAnnouncement() {
    setIsAnnouncementOpen(false);
    Cookies.set('isAnnouncementOpen', false.toString());
  }


  return {
    isAnnouncementOpen,
    handleCloseAnnouncement,
  }
} 
