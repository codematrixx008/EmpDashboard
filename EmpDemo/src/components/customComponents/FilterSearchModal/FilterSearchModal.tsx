import React from "react";
import "../../assets/styles/filterSearchModal.css"
import { useTranslation } from 'react-i18next';
import Select from 'react-select';


const compactSelectStyles = {
    placeholder: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
    }),

    control: (base: any) => ({
        ...base,
        fontSize: '12px',
        lineHeight: '1.2',
        padding: '0 4px',
        minHeight: '20px',
        // height: '20px',
        borderRadius: '4px',
        border: '1px solid silver',

        boxShadow: 'none',
        '&:hover': {
            borderColor: '#ccc' // remove border on hover
        }

    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: '0 4px',
    }),
    indicatorsContainer: (base: any) => ({
        ...base,
        // height: '28px',
        height: '25px',
    }),
    input: (base: any) => ({
        ...base,
        margin: 0,
        padding: 0,

    }),
    menu: (base: any) => ({
        ...base,
        fontSize: '12px',
        marginTop: 0,
        zIndex: 9999,
        minWidth: '100%',
        width: '100%',
        maxHeight: '120px', // Make the dropdown option list small
    }),
    menuList: (base: any) => ({
        ...base,
        maxHeight: '110px', // Controls the visible height of the options list
        paddingTop: 0,
        paddingBottom: 0,
    }),
    option: (base: any, state: any) => ({
        ...base,
        padding: '4px 8px', // Smaller padding for compact options
        fontSize: '12px',
        backgroundColor: state.isFocused ? '#eee' : 'white',
        color: 'black',
        minHeight: '24px',
        height: '24px',
    }),
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: '#f0f0f0',
        borderRadius: '2px',
        padding: '1px 2px',
        margin: '2px',
        minHeight: '18px',
        height: '18px',
    }),
    multiValueLabel: (base: any) => ({
        ...base,
        fontSize: '11px',
        padding: '0 4px',
    }),
    multiValueRemove: (base: any) => ({
        ...base,
        padding: '0 4px',
        ':hover': {
            backgroundColor: '#ccc',
            color: 'black',
        },
    }),
};



const FilterSearchModal = ({
    show,
    mode,
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
                    className="ct-overlay-filter-search"
                    onClick={(e: any) => {
                        if (e.target === e.currentTarget) {
                            handleClose();
                        }
                    }}
                >
                    <div className="ct-popup-filter-search" onClick={(e) => e.stopPropagation()}>
                        <div className="ct-column-inputs-container-filter-search">
                            <span className="ct-popup-ActionTitle-filter-search">
                                {mode}
                            </span>
                            <hr className="ct-modal-horizontal-row-filter-search" />
                            <div className="ct-popup-maincontainer-filter-search">

                                {headerColumns
                                    .map((col: any, index: number) => (
                                        <div key={index} className="ct-popup-inner-container-filter-search">

                                            <label htmlFor={`input-${col.ColumnName}`} className="ct-popup-ActionLabel-filter-search">
                                                {t(`GRID_HEADERS.${col.ColumnName_StrCode}`)}
                                            </label>

                                            <div className="ct-right-container-filter-search">

                                                {col.ComponentType == "Textbox" ? (
                                                    <input
                                                        id={`input-${col.ColumnName}`}
                                                        type={col.DataType}
                                                        value={inputValues[col.ColumnName] || ""}
                                                        onChange={(e) =>
                                                            handleInputChange(col.ColumnName, e.target.value)
                                                        }
                                                        className="ct-popup-ActionInput-filter-search ct-input-placeholder-filter-search"
                                                        placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}`)}
                                                        disabled={!col.IsEnabled}
                                                    />
                                                ) :

                                                    col.ComponentType == "CurrencyTextbox" ? col.DbDateType === "Int" && (
                                                        <div className="ct-input-row-container">
                                                            <div className="ct-inline-operator-input-group">
                                                                <Select
                                                                    value={
                                                                        [
                                                                            // { value: "", label: "Select option" },
                                                                            { value: "equal", label: "=" },
                                                                            { value: "notequal", label: "!=" },
                                                                            { value: "greaterthan", label: ">" },
                                                                            { value: "greaterthanequal", label: ">=" },
                                                                            { value: "lessthan", label: "<" },
                                                                            { value: "lessthanequal", label: "<=" },
                                                                            { value: "isempty", label: "Is empty" },
                                                                            { value: "isnotempty", label: "Is not empty" },
                                                                            { value: "between", label: "Between" }
                                                                        ].find(opt => opt.value === (inputValues[`${col.ColumnName}FilterCondition`] || ""))
                                                                    }
                                                                    onChange={(selectedOption: any) =>
                                                                        handleInputChange(`${col.ColumnName}FilterCondition`, selectedOption ? selectedOption.value : "")
                                                                    }
                                                                    options={[
                                                                        // { value: "", label: "Select option" },
                                                                        { value: "equal", label: "=" },
                                                                        { value: "notequal", label: "!=" },
                                                                        { value: "greaterthan", label: ">" },
                                                                        { value: "greaterthanequal", label: ">=" },
                                                                        { value: "lessthan", label: "<" },
                                                                        { value: "lessthanequal", label: "<=" },
                                                                        { value: "isempty", label: "Is empty" },
                                                                        { value: "isnotempty", label: "Is not empty" },
                                                                        { value: "between", label: "Between" }
                                                                    ]}
                                                                    isDisabled={!col.IsEnabled}
                                                                    classNamePrefix="react-select"
                                                                    styles={compactSelectStyles}
                                                                    placeholder="Select option"
                                                                />

                                                                {/* Show input beside dropdown only if a valid operator is selected and not between or empty types */}
                                                                {
                                                                    (
                                                                        [
                                                                            "equal",
                                                                            "notequal",
                                                                            "greaterthan",
                                                                            "greaterthanequal",
                                                                            "lessthan",
                                                                            "lessthanequal",
                                                                        ].includes(inputValues[`${col.ColumnName}FilterCondition`])
                                                                    ) && (
                                                                        <input
                                                                            type="number"
                                                                            value={inputValues[`${col.ColumnName}`] ?? ""}
                                                                            onChange={(e) =>
                                                                                handleInputChange(`${col.ColumnName}`, Number(e.target.value))
                                                                            }
                                                                            className="ct-popup-ActionInput-filter-search"
                                                                            placeholder="Enter value"
                                                                            disabled={!col.IsEnabled}
                                                                        />
                                                                    )
                                                                }

                                                            </div>

                                                            {/* Show "between" input range */}
                                                            {inputValues[`${col.ColumnName}FilterCondition`] === "between" && (
                                                                <div className="ct-double-input-container-filter-search ">

                                                                    {/* <div className="ct-between-input-group"> */}
                                                                    <div className="ct-range-label-input-group">
                                                                        {/* <label>From</label> */}
                                                                        <input
                                                                            type="number"
                                                                            value={inputValues[`${col.ColumnName}From`] ?? ""}
                                                                            onChange={(e) =>
                                                                                handleInputChange(`${col.ColumnName}From`, Number(e.target.value))
                                                                            }
                                                                            className="ct-popup-ActionInput-filter-search "
                                                                            placeholder="Min"
                                                                            disabled={!col.IsEnabled}
                                                                        />
                                                                    </div>
                                                                    <div className="ct-range-label-input-group">
                                                                        <span>&#45;</span>
                                                                        {/* <label>To</label> */}
                                                                        <input
                                                                            type="number"
                                                                            value={inputValues[`${col.ColumnName}To`] ?? ""}
                                                                            onChange={(e) =>
                                                                                handleInputChange(`${col.ColumnName}To`, Number(e.target.value))
                                                                            }
                                                                            className="ct-popup-ActionInput-filter-search"
                                                                            placeholder="Max"
                                                                            disabled={!col.IsEnabled}
                                                                        />
                                                                    </div>
                                                                    {/* </div> */}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )

                                                        : col.ComponentType == "Dropdown" && col.AllowMultiSelectSearch ? (
                                                            <Select
                                                                id={`input-${col.ColumnName}Ids`}
                                                                isMulti
                                                                value={
                                                                    (inputValues[`${col.ColumnName}Ids`] || "")
                                                                        .split(",")
                                                                        .filter(Boolean)
                                                                        .map((val: string) =>
                                                                            (commonDropdownArray[col.ColumnName] || col.options || []).find(
                                                                                (opt: any) => (opt?.Id || opt) == val
                                                                            )
                                                                        )
                                                                        .filter(Boolean)
                                                                }
                                                                onChange={(selectedOptions: any) => {
                                                                    const values = selectedOptions
                                                                        ? selectedOptions.map((opt: any) => opt?.Id || opt)
                                                                        : [];
                                                                    const formatted = `${values.join(",")}`;
                                                                    handleInputChange(`${col.ColumnName}Ids`, formatted);
                                                                }}
                                                                options={commonDropdownArray[col.ColumnName] || col.options || []}
                                                                getOptionLabel={(option: any) => option?.Label || option}
                                                                getOptionValue={(option: any) => option?.Id || option}
                                                                isDisabled={!col.IsEnabled}
                                                                placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}`)}
                                                                styles={compactSelectStyles}
                                                                classNamePrefix="react-select"
                                                            />
                                                        ) : col.ComponentType == "Dropdown" && !col.AllowMultiSelectSearch ? (
                                                            <Select
                                                                id={`input-${col.ColumnName}Ids`}
                                                                // value={
                                                                //     (commonDropdownArray[col.ColumnName] || col.options || []).find(
                                                                //         (option: any) => (option?.Id || option) === inputValues[col.ColumnName]
                                                                //     ) || null
                                                                // }
                                                                value={
                                                                    (commonDropdownArray[col.ColumnName] || col.options || []).find(
                                                                        (option: any) =>
                                                                            (option?.Id || option)?.toString() === (inputValues[`${col.ColumnName}Ids`] || "").toString()
                                                                    ) || null
                                                                }
                                                                onChange={(selectedOption: any) => {
                                                                    handleInputChange(col.ColumnName, selectedOption ? selectedOption?.Id : "");
                                                                }}
                                                                options={commonDropdownArray[col.ColumnName] || col.options || []}
                                                                getOptionLabel={(option: any) => option?.Label || option}
                                                                getOptionValue={(option: any) => option?.Id || option}
                                                                isDisabled={!col.IsEnabled}
                                                                placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}`)}
                                                                styles={compactSelectStyles}
                                                                classNamePrefix="react-select"
                                                            />

                                                        )
                                                            : col.ComponentType == "Checkbox" ? (
                                                                <div>
                                                                    <input
                                                                        id={`input-${col.ColumnName}`}
                                                                        type="checkbox"
                                                                        checked={!!inputValues[col.ColumnName]}
                                                                        onChange={(e) =>
                                                                            handleInputChange(col.ColumnName, e.target.checked)
                                                                        }
                                                                        className="ct-popup-ActionInput-filter-search"
                                                                        disabled={!col.IsEnabled}
                                                                    />
                                                                </div>
                                                            ) : col.ComponentType == "DatePicker" ? (
                                                                <div className="ct-double-input-container-filter-search ct-input-range-filter-search">
                                                                    <div className="ct-range-label-input-group">
                                                                        {/* <label htmlFor={`input-${col.ColumnName}-min`}>From</label> */}
                                                                        <input
                                                                            id={`input-${col.ColumnName}from`}
                                                                            type="date"
                                                                            value={
                                                                                inputValues[`${col.ColumnName}From`]
                                                                                    ? new Date(inputValues[`${col.ColumnName}From`]).toISOString().split("T")[0]
                                                                                    : ""
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleInputChange(`${col.ColumnName}From`, e.target.value)
                                                                            }
                                                                            className="ct-popup-ActionInput-filter-search ct-input-placeholder-filter-search "
                                                                            placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}_From`)}
                                                                            disabled={!col.IsEnabled}
                                                                        />
                                                                    </div>
                                                                    <div className="ct-range-label-input-group">
                                                                        <span>&#45;</span>
                                                                        {/* <label htmlFor={`input-${col.ColumnName}-max`} style={{ textAlign: "center" }}>To</label> */}

                                                                        <input
                                                                            id={`input-${col.ColumnName}to`}
                                                                            type="date"
                                                                            value={
                                                                                inputValues[`${col.ColumnName}To`]
                                                                                    ? new Date(inputValues[`${col.ColumnName}To`]).toISOString().split("T")[0]
                                                                                    : ""
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleInputChange(`${col.ColumnName}To`, e.target.value)
                                                                            }
                                                                            className="ct-popup-ActionInput-filter-search ct-input-placeholder-filter-search "
                                                                            placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}_To`)}
                                                                            disabled={!col.IsEnabled}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )
                                                }
                                            </div>
                                        </div>
                                    ))}

                            </div>
                            <div className="ct-popup-button-container-filter-search">

                                <button
                                    onClick={handleSubmit}
                                    style={{
                                        marginLeft: 10,
                                        background: settings.Background || "#099be0",
                                        color: settings.Color || "#fff",
                                    }}
                                    className="ct-popup-ActionButton-filter-search"
                                >
                                    Search
                                </button>

                                <button
                                    onClick={handleClose}
                                    className="ct-popup-ActionButton-filter-search"
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

export default FilterSearchModal;