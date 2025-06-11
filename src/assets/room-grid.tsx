"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { roomData } from "@/const/room-data";
import { RoomModal } from "./room-modal";
import { Modal, useModal } from "@/components/ui/animated-modal";

export const RoomGrid = () => {
  const router = useRouter();
  
  return (
    <Modal onClose={() => {router.push("/rooms", { scroll: false });}}>
      <RoomGridManager />
    </Modal>
  )
}

const RoomGridManager = () => {
  const router = useRouter();
  const modal = useModal();
  const searchParams = useSearchParams();
  const modalSlug = searchParams.get("modal");
  const selectedRoom = roomData.find(room => room.slug === modalSlug);

  // 카드 클릭 핸들러
  const handleCardClick = (slug: string) => {
    modal.setOpen(true);
    router.push(`/rooms?modal=${slug}`, { scroll: false });
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    modal.setOpen(false);
    router.push("/rooms", { scroll: false });
  };

  // 모달 상태를 URL과 동기화하기 위해 Escape 키 핸들러 추가
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalSlug) {
        handleCloseModal();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modalSlug]);
  return (
    <>
      <FocusCards 
        cards={roomData.map(room => ({
          title: room.title,
          src: room.image,
          description: room.description,
          onClick: () => handleCardClick(room.slug)
        }))} 
      />
      <RoomModal selectedRoom={selectedRoom || roomData[0]} />
    </>
  )
}