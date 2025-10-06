import React from "react";
import "../../assets/styles/deleteModal.css";

const DeleteModal = ({
    show,
    handleClose,
    handleDelete,
    selectedRows,
}: any) => {
    return (
        <>
            {show && (
                <div
                    className="ct-delete-overlay"
                    onClick={(e: any) => {
                        if (e.target === e.currentTarget) {
                            handleClose();
                        }
                    }}
                >
                    <div className="ct-delete-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="ct-delete-column-inputs-container">
                            Are you sure you want to delete this item?
                        </div>
                        <div className="ct-delete-popup-button-container">
                            <button
                                onClick={handleClose}
                                className="ct-delete-popup-ActionButton close"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    const formattedIds = selectedRows.join(", ");
                                    handleDelete(formattedIds);
                                }}
                                className="ct-delete-popup-ActionButton"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteModal;