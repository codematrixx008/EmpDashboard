import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
// import "./departmentModal.css";
import "../assets/styles/departmentModal.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store/store.ts";
import {
    createNewDepartment,
    fetchDepartmentPageGridTable,
    updateExistingDepartment,
    deleteDepartmentById,
} from "../redux/reducer/departmentSlice.ts";
import { AppDispatch } from "../redux/store/store.ts";


const CustomButton = ({ label, onClick, disabled, loading }) => (
    <button
        onClick={onClick}
        className="ct-section-button"
        disabled={disabled}
    >
        {loading ? (
            <Spinner
                animation="border"
                size="sm"
                style={{ width: "1rem", height: "1rem", borderWidth: "2px" }}
            />
        ) : label}
    </button>
);

interface Department {
    Id?: number;
    DepartmentName: string;
}

const DepartmentModal = ({ show, onClose, title }) => {
    const { departmentPageGridTable } = useSelector((state: RootState) => ({
        departmentPageGridTable: state.department.departmentPageGridTable,
    }));
    const dispatch: AppDispatch = useDispatch();

    const [departmentData, setDepartmentData] = useState<Department[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [departmentInput, setDepartmentInput] = useState("");
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchDepartmentPageGridTable());
    }, [dispatch]);

    useEffect(() => {
        setDepartmentData(departmentPageGridTable);
    }, [departmentPageGridTable]);

    const handleDepartmentClick = (dept) => {
        if (selectedId === dept.Id) {
            setSelectedId(null);
            setDepartmentInput("");
        } else {
            setSelectedId(dept.Id);
            setDepartmentInput(dept.DepartmentName);
        }
    };

    const handleCheckboxChange = (dept) => {
        if (selectedId === dept.Id) {
            setSelectedId(null);
            setDepartmentInput("");
        } else {
            setSelectedId(dept.Id);
            setDepartmentInput(dept.DepartmentName);
        }
    };

    const handleSaveDepartment = async () => {
        if (!departmentInput.trim()) return;
        setIsSaveLoading(true);

        const departmentPayload = {
            Id: selectedId ?? undefined,
            DepartmentName: departmentInput.trim(),
        };

        if (selectedId) {
            await dispatch(updateExistingDepartment(departmentPayload, selectedId));
        } else {
            await dispatch(createNewDepartment(departmentPayload));
        }

        // await dispatch(fetchDepartmentPageGridTable());
        setDepartmentInput("");
        setSelectedId(null);
        setIsSaveLoading(false);
    };

    const handleDeleteDepartment = async () => {
        if (!selectedId) return;
        setIsDeleteLoading(true);
        await dispatch(deleteDepartmentById(selectedId));
        // await dispatch(fetchDepartmentPageGridTable());
        setDepartmentInput("");
        setSelectedId(null);
        setIsDeleteLoading(false);
    };

    const isNewDepartment = selectedId === null && departmentInput.trim() !== "";
    const buttonLabel = isNewDepartment || !selectedId ? "Save" : "Update";

    return (
        <Modal show={show} onHide={onClose} centered dialogClassName="modal-90w">
            <Modal.Header closeButton className="ct-section-modal-header">
                <Modal.Title className="ct-section-modal-title">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="ct-section-layout">
                    <div className="ct-section-left-section">
                        <input
                            type="text"
                            placeholder="Enter department"
                            value={departmentInput}
                            onChange={(e) => setDepartmentInput(e.target.value)}
                            className="ct-section-no-focus-border ct-section-input"
                        />

                        <div className="ct-section-list-container">
                            {departmentData.map((dept) => (
                                <div key={dept.Id} className="ct-section-list-containner">
                                    <input
                                        type="checkbox"
                                        className="me-2"
                                        checked={selectedId === dept.Id}
                                        onChange={() => handleCheckboxChange(dept)}
                                    />
                                    <label
                                        onClick={() => handleDepartmentClick(dept)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {dept.DepartmentName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ct-section-button-group">
                        <CustomButton
                            label={buttonLabel}
                            onClick={handleSaveDepartment}
                            disabled={!departmentInput.trim() || isSaveLoading}
                            loading={isSaveLoading}
                        />
                        <CustomButton
                            label="Delete"
                            onClick={handleDeleteDepartment}
                            disabled={!selectedId || isDeleteLoading}
                            loading={isDeleteLoading}
                        />
                        <CustomButton
                            label="Hide"
                            onClick={() => { }}
                            disabled={true}
                            loading={false}
                        />
                        <CustomButton
                            label="Unhide"
                            onClick={() => { }}
                            disabled={true}
                            loading={false}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DepartmentModal;