import { useState } from 'react';
import Cookies from 'js-cookie';

interface ClosePopups {
  isPopupOpen: boolean;
  isAnnouncementOpen: boolean;
  handleTogglePopup: () => void;
  handleCloseAnnouncement: () => void;
}
export function useClosePopups(): ClosePopups {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(Cookies.get('isAnnouncementOpen') === 'false' ? false : true);

  function handleCloseAnnouncement() {
    setIsAnnouncementOpen(false);
    Cookies.set('isAnnouncementOpen', false.toString());
  }


  function handleTogglePopup() {
    setIsPopupOpen(prev => !prev);
  }

  return {
    isPopupOpen,
    isAnnouncementOpen,
    handleCloseAnnouncement,
    handleTogglePopup
  }
} 
