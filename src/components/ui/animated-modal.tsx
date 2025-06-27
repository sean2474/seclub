"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children, open, onOpen, onClose }: { children: ReactNode, open?: boolean, onOpen?: () => void, onClose?: () => void }) => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setModalOpen(open);
    }
  }, [open]);
  
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const setOpen = (open: boolean) => {
    setModalOpen(open);
    if (open) {
      onOpen?.();
    } else {
      onClose?.();
      document.body.style.overflow = "auto";
    }
  };

  return (
    <ModalContext.Provider value={{ open: modalOpen, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function Modal({ children, open, onOpen, onClose }: { children: ReactNode, open?: boolean, onOpen?: () => void, onClose?: () => void }) {
  return <ModalProvider open={open} onOpen={onOpen} onClose={onClose}>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden",
        className
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full flex items-center justify-center z-50"
        >
          <Overlay />

          <motion.div
            className={cn(
              "min-h-[50%] h-[95%] max-h-[90%] w-[95%] max-w-5xl bg-white dark:bg-neutral-950 dark:border-neutral-800 rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden",
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  const { setOpen } = useModal();
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 0.5,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
      onClick={() => setOpen(false)}
    ></motion.div>
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="absolute z-50 top-7 right-7 lg:top-4 lg:right-4 group rounded-full bg-background text-foreground lg:bg-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};