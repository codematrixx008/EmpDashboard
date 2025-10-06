import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../../assets/styles/confirmationModal.css";

interface GenericConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: string;
    cancelVariant?: string;
    centered?: boolean;
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<GenericConfirmationModalProps> = ({
    show,
    onClose,
    onConfirm,
    title = "Confirm",
    message = "Are you sure?",
    confirmLabel = "Yes",
    cancelLabel = "No",
    confirmVariant = "primary",
    cancelVariant = "secondary",
    centered = true,
    isLoading = false,
}) => {
    return (
        <Modal show={show} onHide={onClose} centered={centered} style={{ fontSize: "18px", fontWeight: "600" }} >
            <Modal.Body >{message}</Modal.Body>
            <Modal.Footer>
                <Button variant={cancelVariant} onClick={onClose} disabled={isLoading} className="styled-button cancel-button">
                    {cancelLabel}
                </Button>
                <Button variant={confirmVariant} onClick={onConfirm} disabled={isLoading} className="styled-button confirm-button">
                    {confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
