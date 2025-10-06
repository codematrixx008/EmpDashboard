import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import "../../assets/styles/departmentModal.css"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { getCommonMasterDropdownData, setMasterDropdownDirty } from "../../redux/reducer/combinedSlice.ts";
import CustomTooltip from "../CustomTooltip/CustomTooltip.tsx";

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

// Define the expected type for commonMasterDropdownData
interface CommonMasterDropdownData<T> {
    Data: T[];
    DropdownName?: string;
    [key: string]: any;
}

interface BaseItem {
    Id: number;
    [key: string]: any;
}

interface CustomSelectableModalProps<T extends BaseItem> {
    show: boolean;
    onClose: () => void;
}

function GenericSelectableModal<T extends BaseItem>({
    show,
    onClose
}: CustomSelectableModalProps<T>) {

    const dispatch = useDispatch<AppDispatch>();
    const [masterDropdownData, setMasterDropdownData] = useState<T[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<{} | null>(null);
    const [dropdownInput, setDropdownInput] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [masterDropdownId, setMasterDropdownId] = useState<number | null>(null);
    const [masterDropdownName, setMasterDropdownName] = useState<string | null>(null);

    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const {
        commonMasterDropdownData,
    } = useSelector((state: RootState) => ({
        commonMasterDropdownData: state.combined.commonMasterDropdownData as unknown as CommonMasterDropdownData<T>,
    }));

    useEffect(() => {
        if (commonMasterDropdownData && commonMasterDropdownData?.Data?.length > 0) {
            setMasterDropdownData(commonMasterDropdownData?.Data);
            setMasterDropdownId(commonMasterDropdownData?.Data[0]?.DropdownId);
            setMasterDropdownName(commonMasterDropdownData?.DropdownName ?? null);
            setIsSaveLoading(false)
        }
    }, [commonMasterDropdownData]);

    const toggleShowActiveOnly = () => setShowActiveOnly((prev) => !prev);

    const visibleItems = showActiveOnly ? masterDropdownData?.filter((item) => !item?.IsHidden) : masterDropdownData;

    const handleSelectItem = (item: T) => {
        const isSelected = selectedId === item.DropdownItemId;
        setSelectedId(isSelected ? null : item.DropdownItemId);
        setSelectedItem(isSelected ? null : item);
        setDropdownInput(isSelected || item?.IsHidden ? "" : (item?.ItemName));
    };

    const getSelectedItem = () => {
        const checker = masterDropdownData?.find((item) => item.DropdownItemId === selectedId)
        return checker
    };


    const isItemHidden = (item: T) => item?.IsHidden;


    // To Save And Update The Dropdown Item
    const handleSaveClick = () => {
        setIsSaveLoading(true)
        if (selectedItem == null && selectedId == null) {
            const payload = {
                "DropdownId": masterDropdownId,
                "ItemName": dropdownInput,
                "Action": "Add"
            }
            dispatch(getCommonMasterDropdownData(payload));
            dispatch(setMasterDropdownDirty(true));
        } else if (selectedItem && selectedId) {
            const payload = {
                "DropdownId": masterDropdownId,
                "SelectedItemId": selectedId,
                "ItemName": dropdownInput,
                "Action": "Update"
            }
            dispatch(getCommonMasterDropdownData(payload));
            dispatch(setMasterDropdownDirty(true));
        }
        setDropdownInput("");
        setSelectedId(null);
    };

    // to Hide the Selected Item
    const handleHideClick = () => {
        if (selectedId) {
            const payload = {
                "DropdownId": masterDropdownId,
                "SelectedItemId": selectedId,
                "Action": "Hide"
            }
            dispatch(getCommonMasterDropdownData(payload));
            dispatch(setMasterDropdownDirty(true));
            setSelectedId(null);
            setDropdownInput("");
        }
    };

    // to unhide the selected item
    const handleUnhideClick = () => {
        if (selectedId) {
            const payload = {
                "DropdownId": masterDropdownId,
                "SelectedItemId": selectedId,
                "Action": "UnHide"
            }
            dispatch(getCommonMasterDropdownData(payload));
            dispatch(setMasterDropdownDirty(true));
            setSelectedId(null);
            setDropdownInput("");
        }
    };

    const isSelectedHidden = getSelectedItem() ? isItemHidden(getSelectedItem()!) : false;
    const isSelectedUnhidden = getSelectedItem() ? !isItemHidden(getSelectedItem()!) : false;
    const IsEnabled = getSelectedItem() ? !isItemHidden(getSelectedItem()!) : true;

    const isNew = selectedId === null && dropdownInput.trim() !== "";
    const buttonLabel = isNew || !selectedId ? "Save" : "Update";


    return (
        <Modal show={show}
            onHide={() => {
                onClose();
                setMasterDropdownData([]);
            }}
            centered>
            <Modal.Header closeButton className="ct-section-modal-header">
                <Modal.Title className="ct-section-modal-title">{masterDropdownName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="ct-section-layout">
                    <div className="ct-section-left-section">
                        <input
                            type="text"
                            placeholder="Enter value"
                            value={dropdownInput}
                            onChange={(e) => setDropdownInput(e.target.value)}
                            className="ct-section-no-focus-border ct-section-input"
                        />

                        <div className="ct-section-list-container">
                            {visibleItems.map((item) => (
                                <div
                                    key={item.DropdownItemId}
                                    className={`ct-section-list-containner ${item?.IsHidden ? "ct-department-hidden" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="me-2"
                                        checked={selectedId === item.DropdownItemId}
                                        onChange={() => handleSelectItem(item)}
                                    />
                                    <label
                                        onClick={() => handleSelectItem(item)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {item?.ItemName}
                                    </label>
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="ct-section-button-group" style={{ width: "22%" }}>
                        <div className="ct-section-button-row">
                            <CustomTooltip tooltipText={buttonLabel || "Save Changes"}>
                                <CustomButton
                                    label={buttonLabel}
                                    onClick={handleSaveClick}
                                    disabled={!dropdownInput.trim() || isSaveLoading || !IsEnabled}
                                    loading={isSaveLoading}
                                />
                            </CustomTooltip>

                            <CustomTooltip tooltipText="Hide">
                                <CustomButton
                                    label="Hide"
                                    onClick={handleHideClick}
                                    disabled={!selectedId || isSelectedHidden}
                                    loading={false}
                                />
                            </CustomTooltip>

                            <CustomTooltip tooltipText="Unhide">
                                <CustomButton
                                    label="Unhide"
                                    onClick={handleUnhideClick}
                                    disabled={!selectedId || isSelectedUnhidden}
                                    loading={false}
                                />
                            </CustomTooltip>

                        </div>
                        <div className="ct-section-button-row" style={{ marginTop: "0.5rem" }}>
                            <CustomTooltip tooltipText={showActiveOnly ? "Show All Items" : "Show Active"} placement="top">
                                <CustomButton
                                    label={showActiveOnly ? "Show All" : "Show Active"}
                                    onClick={toggleShowActiveOnly}
                                    disabled={false}
                                    loading={false}
                                />
                            </CustomTooltip>

                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default GenericSelectableModal;
