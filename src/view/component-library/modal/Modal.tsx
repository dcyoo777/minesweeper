import React from 'react';
import ReactModal from 'react-modal';
import './Modal.scss';
import cn from 'classnames';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
}

function Modal({isOpen, onClose, className, children}: ModalProps) {
    return (
        <ReactModal isOpen={isOpen}
                    overlayClassName={"modal-overlay"}
                    className={cn("modal-content", className)}
                    onRequestClose={() => {onClose()}}
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true}
                    ariaHideApp={false}
        >
            {children}
        </ReactModal>
    );
}

export default Modal;
