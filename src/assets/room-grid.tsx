"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import { useEffect, useState } from "react";
import { roomData } from "@/const/room-data";
import { RoomDetail } from "./room-detail";
import { Modal, ModalBody, ModalContent } from "@/components/ui/animated-modal";
import { RoomType } from "@/types";

export const RoomGrid = () => {
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPath = () => {
      const match = window.location.pathname.match(/^\/rooms\/(.+)/);
      setModalSlug(match ? match[1] : null);
    };
    
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);
  
  const closeModal = () => {
    window.history.pushState({}, '', '/rooms');
    setModalSlug(null);
  };
  
  return (
    <>
      <FocusCards 
        cards={roomData.map(room => ({
          title: room.title,
          src: room.image,
          description: room.description,
          onClick: () => {
            window.history.pushState({}, '', `/rooms/${room.slug}`);
            setModalSlug(room.slug);
          }
        }))} 
      />
      
      {modalSlug && (
        <Modal open={!!modalSlug} onClose={closeModal}>
          <ModalBody>
            <ModalContent>
              <RoomDetail roomType={modalSlug as RoomType} />
            </ModalContent>
          </ModalBody>
        </Modal>
      )}
    </>
  )
}
