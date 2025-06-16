"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import { useEffect, useState } from "react";
import { roomData } from "@/const/room-data";
import { RoomDetail } from "./room-modal";
import { Modal, ModalBody, ModalContent } from "@/components/ui/animated-modal";

export const RoomGrid = () => {
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  
  // 초기 진입 시나 뒤로/앞으로 이동(popstate) 시 URL 검사
  useEffect(() => {
    const checkPath = () => {
      const match = window.location.pathname.match(/^\/rooms\/(.+)/);
      setModalSlug(match ? match[1] : null);
    };
    
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);
  
  // 모달 닫기 : URL 복원
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
              <RoomDetail selectedRoom={roomData.find(room => room.slug === modalSlug) || roomData[0]} />
            </ModalContent>
          </ModalBody>
        </Modal>
      )}
    </>
  )
}
