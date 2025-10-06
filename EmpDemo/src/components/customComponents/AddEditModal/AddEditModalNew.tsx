import "../../assets/styles/addEditModal.css";
import { useTranslation } from 'react-i18next';

const AddEditModalNew = ({
    show,
    mode, // Add or Edit
    headerColumns,
    inputValues,
    handleInputChange,
    handleClose,
    handleSubmit,
    settings,
    commonDropdownArray,
}: any) => {
    const { t } = useTranslation();

    return (
        <>
            {show && (
                <div
                    className="ct-overlay"
                    onClick={(e: any) => {
                        if (e.target === e.currentTarget) {
                            handleClose();
                        }
                    }}
                >
                    <div className="ct-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="ct-column-inputs-container">
                            <span className="ct-popup-ActionTitle">
                                {mode === "Add" ? "Add New Record:" : "Edit Record:"}
                            </span>
                            <hr className="ct-modal-horizontal-row" />
                            <div className="ct-popup-maincontainer">


                                {headerColumns
                                    .map((col: any, index: number) => (
                                        <div key={index} className="ct-popup-inner-container">
                                            <label htmlFor={`input-${col.ColumnName}`} className="ct-popup-ActionLabel">
                                                {t(`GRID_HEADERS.${col.ColumnName_StrCode}`)}
                                            </label>


                                            {col.ComponentType == "Textbox" ?
                                                <input
                                                    id={`input-${col.ColumnName}`}
                                                    type={col.DataType}
                                                    value={inputValues[col.ColumnName] || ""} // Fallback to an empty string
                                                    onChange={(e) =>
                                                        handleInputChange(col.ColumnName, e.target.value)
                                                    }
                                                    className="ct-popup-ActionInput"
                                                    placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}`)}
                                                    disabled={!col.IsEnabled}
                                                />

                                                : col.ComponentType == "CurrencyTextbox" ?

                                                    <input
                                                        id={`input-${col.ColumnName}`}
                                                        type={col.DataType}
                                                        value={inputValues[col.ColumnName] || ""} // Fallback to an empty string
                                                        onChange={(e) =>
                                                            handleInputChange(col.ColumnName, e.target.value)
                                                        }
                                                        className="ct-popup-ActionInput"
                                                        placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}`)}
                                                        disabled={!col.IsEnabled}
                                                    />

                                                    : col.ComponentType == "Dropdown" ?
                                                        <select
                                                            id={`input-${col.ColumnName}`}
                                                            value={inputValues[col.ColumnName] || ""}
                                                            onChange={(e) => handleInputChange(col.ColumnName, e.target.value)}
                                                            className="ct-popup-ActionInput"
                                                            disabled={!col.IsEnabled}
                                                        >
                                                            <option value="">{t(`GRID_PLACEHOLDER.${col.Placeholder}`)}</option>
                                                            {(commonDropdownArray[col.ColumnName] || col.options || []).map((option: any, idx: number) => (
                                                                <option key={idx} value={option?.Id || option}>
                                                                    {option?.Label || option}
                                                                </option>
                                                            ))}
                                                        </select>



                                                        : col.ComponentType == "Checkbox" ?
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <input
                                                                    id={`input-${col.ColumnName}`}
                                                                    type="checkbox"
                                                                    // checked={
                                                                    //     inputValues[col.ColumnName] === undefined
                                                                    //         ? true // default to checked if value is not present
                                                                    //         : !!inputValues[col.ColumnName] // else use the actual boolean value
                                                                    // }
                                                                    checked={!!inputValues[col.ColumnName]} // Ensure boolean value
                                                                    onChange={(e) =>
                                                                        handleInputChange(col.ColumnName, e.target.checked)
                                                                    }
                                                                    className="ct-popup-ActionInput"
                                                                    disabled={!col.IsEnabled}
                                                                />
                                                            </div>

                                                            : col.ComponentType == "DatePicker" ?
                                                                <input
                                                                    id={`input-${col.ColumnName}`}
                                                                    type="date"
                                                                    value={
                                                                        inputValues[col.ColumnName] ? new Date(inputValues[col.ColumnName])
                                                                            .toISOString().split("T")[0] // Convert to yyyy-MM-dd format
                                                                            : "" // Fallback to an empty string
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleInputChange(col.ColumnName, e.target.value)
                                                                    }
                                                                    className="ct-popup-ActionInput"
                                                                    disabled={!col.IsEnabled}
                                                                />
                                                                : ""}


                                        </div>
                                    ))}

                            </div>
                            <div className="ct-popup-button-container">

                                <button
                                    onClick={handleSubmit}
                                    style={{
                                        marginLeft: 10,
                                        background: settings.Background || "#099be0",
                                        color: settings.Color || "#fff",
                                    }}
                                    className="ct-popup-ActionButton"
                                >
                                    {mode === "Add" ? "Save" : "Save"}
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="ct-popup-ActionButton"
                                    style={{
                                        background: settings.Background || "#099be0",
                                        color: settings.Color || "#fff",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddEditModalNew;