import { ModalBody, ModalContent } from "@/components/ui/animated-modal";
import { Room } from "@/types";
import Image from "next/image";

export const RoomModal = ({selectedRoom}: {selectedRoom: Room}) => {
  return (
    <ModalBody>
      <ModalContent>
        <div className="relative w-full h-64 mb-6">
          <Image 
            src={selectedRoom.image} 
            alt={selectedRoom.title} 
            fill 
            className="object-cover rounded-lg" 
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">{selectedRoom.title}</h2>
        <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
        
        <div className="mb-6">
          <p className="mb-4">{selectedRoom.details}</p>
          
          <h3 className="font-semibold mb-2 mt-4">시설 및 편의사항</h3>
          <div className="flex flex-wrap gap-2">
            {selectedRoom.amenities.map((amenity, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => {/* 예약 페이지로 이동 */}} 
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            예약하기
          </button>
        </div>
      </ModalContent>
    </ModalBody>
  )
}