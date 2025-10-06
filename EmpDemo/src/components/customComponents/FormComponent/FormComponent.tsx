import React from 'react';
import BsInput from '../../baseComponents/BsInput.tsx';
import BsSelectPopup from '../../baseComponents/BsSelectPopup.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store.ts';
import { useTranslation } from 'react-i18next';

interface FormComponentProps {
    sectionName: string;
    formColumns: any;
    formData: Record<string, string>;
    handleChange: (name: string, value: string) => void;
    handleDirtyState: (fieldName: string, isDirty: boolean) => void; // <-- Fix: Add parameters
    isDirtyFields: Record<string, boolean>;
    setIsDirtyFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

    resetDirtyState: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({
    sectionName,
    formColumns,
    formData,
    handleChange,
    handleDirtyState,
    isDirtyFields,
    setIsDirtyFields,
    resetDirtyState,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const {
        formCommonDropdownData,
    } = useSelector((state: RootState) => ({
        formCommonDropdownData: state.combined.formCommonDropdownData,
    }));
    


    return (

        <div className="card px-2 pb-2" style={{ width: '100%' }}>
            <h6> {sectionName} </h6>
            <div className="container-fluid form-component-container" style={{ border: '1px solid #ccc', borderRadius: 5 }}>
                <div className="row">

                    {formColumns?.length > 0 && formColumns?.filter(col => !col.IsHidden)?.map((col: any) => {

                        const dropdownOptions = formCommonDropdownData?.MasterDropdownData || {};
                        const dropdownData = dropdownOptions[col.ColumnName] || [];

                        return (
                            <div key={col.Id} className="col-12 col-md-6 col-lg-4 mb-3">
                                <div className={`${col.ComponentType == "Checkbox" ? "form-group-checkbox" : "form-group"}`}>
                                    <label className="form-label">
                                        {t(`GRID_HEADERS.${col.ColumnName_StrCode}`)}   {col.IsRequired && <span className="text-danger">*</span>}
                                    </label>

                                    {col.ComponentType !== 'Dropdown' ? (
                                        <BsInput
                                            key={col.Id}
                                            className={`${col.ComponentType === "Checkbox" ? '' : "form-control"}`}
                                            type={col.ComponentType === "Checkbox" ? "checkbox" :
                                                col.ComponentType === "DatePicker" ? "date" :
                                                    col.ComponentType === "Number" ? "number"
                                                        : "text"}
                                            placeholder={t(`GRID_PLACEHOLDER.${col.Placeholder}`)}
                                            value={formData[col.ColumnName] ? formData[col.ColumnName] : ''}
                                            onChange={(e) => handleChange(col.ColumnName, e.target.value)}
                                            onDirty={(name, dirty) => handleDirtyState(name, dirty)}
                                            border={isDirtyFields[col.ColumnName] ? '1px solid green' : ''}
                                            name={col.ColumnName}
                                            resetDirtyState={resetDirtyState}
                                            myCheckbox={col.ComponentType === "Checkbox"}
                                        />
                                    ) : col.ComponentType === 'Dropdown' ? (
                                        <BsSelectPopup
                                            options={dropdownData}
                                            value={formData[col.ColumnName] || ''}
                                            onChange={(newValue) => handleChange(col.ColumnName, newValue)}
                                            name={col.ColumnName}
                                            border={isDirtyFields[col.ColumnName] ? '1px solid green' : ''}
                                            dropDownPopup={col.IsEditablePopup}
                                            dropdownId={col.DropdownId}
                                            resetDirtyState={resetDirtyState}
                                            onDirty={
                                                (name, dirty) => {
                                                    handleDirtyState(name, dirty);
                                                }
                                            }
                                        />
                                    ) : null}

                                </div>
                            </div>
                        );
                    })}




                </div>
            </div>
        </div>
    );
};

export default FormComponent;
