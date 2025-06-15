// hooks/useModalHandlers.ts
import { useCallback, useEffect } from 'react';

type ModalEvent = KeyboardEvent | MouseEvent;

export function useModalHandlers(isOpen: boolean, onClose: () => void) {
    const handleOutsideClick = useCallback((event: MouseEvent) => {
        if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
            onClose();
        }
    }, [onClose]);

    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey as EventListener);
            document.addEventListener('mousedown', handleOutsideClick as EventListener);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey as EventListener);
            document.removeEventListener('mousedown', handleOutsideClick as EventListener);
        };
    }, [isOpen, handleEscapeKey, handleOutsideClick]);
}