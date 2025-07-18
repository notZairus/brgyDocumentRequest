import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";

type ModalProps = {
    isOpen: boolean,
    handleClose: () => void,
    children: React.ReactNode,
}


export default function Modal({isOpen, handleClose, children}: ModalProps) {
    return createPortal(<>
        <AnimatePresence>

            { isOpen &&
                <div className="fixed inset-0 bg-black/30 z-20" onClick={handleClose}>
                    <div className="absolute top-1/2 left-1/2 -translate-1/2" onClick={(e) => e.stopPropagation()}>
                        { children }
                    </div>
                </div>
            }

        </AnimatePresence>
    </>, document.getElementById("portal"));
}