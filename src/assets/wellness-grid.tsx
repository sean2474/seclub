"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import { useEffect, useState } from "react";
import { wellnessData } from "@/const/wellness-data";
import { Modal, ModalBody, ModalContent } from "@/components/ui/animated-modal";
import { WellnessType } from "@/types";
import { WellnessDetail } from "./wellness-detail";

export const WellnessGrid = () => {
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPath = () => {
      const match = window.location.pathname.match(/^\/wellness\/(.+)/);
      setModalSlug(match ? match[1] : null);
    };
    
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);
  
  const closeModal = () => {
    window.history.pushState({}, '', '/wellness');
    setModalSlug(null);
  };
  
  return (
    <>
      <FocusCards 
        cards={wellnessData.map(wellness => ({
          title: wellness.title,
          src: wellness.image,
          description: wellness.description,
          onClick: () => {
            window.history.pushState({}, '', `/wellness/${wellness.slug}`);
            setModalSlug(wellness.slug);
          },
        }))} 
        gridNum={3}
      />
      
      {modalSlug && (
        <Modal open={!!modalSlug} onClose={closeModal}>
          <ModalBody>
            <ModalContent>
              <WellnessDetail wellnessType={modalSlug as WellnessType} />
            </ModalContent>
          </ModalBody>
        </Modal>
      )}
    </>
  )
}
