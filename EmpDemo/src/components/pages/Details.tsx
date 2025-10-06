import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store.ts";
import { setIsDirty, setShowConfirmation, setSaveDisabled, setCancelDisabled, setButtonStates } from "../redux/reducer/combinedSlice.ts";
import { Button, Modal } from "react-bootstrap";
import '../assets/styles/example.css';
import SectionGrid from "../customComponents/SectionGrid/SectionGrid.tsx";
import FormComponent from "../customComponents/FormComponent/FormComponent.tsx";
import ConfirmationModal from "../customComponents/ConfirmationModal/ConfirmationModal.tsx";


type DetailsProps = {
  formColumnsData: any;
  formEmployeeData: any
  handleSendSaveData: (values: any) => void // Function to handle form data save
};

const Details: React.FC<DetailsProps> = ({ formColumnsData, formEmployeeData, handleSendSaveData }) => {
  const dispatch: AppDispatch = useDispatch();

  const [resetDirtyState, setResetDirtyState] = useState(false);
  const [isDirtyFields, setIsDirtyFields] = useState<Record<string, boolean>>({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  const {
    buttonStatesObj,
    buttonName,
    showConfirmation,
    selectedTabId,
  } = useSelector((state: RootState) => ({
    buttonStatesObj: state.combined.buttonStates,
    buttonName: state.combined.buttonName,
    showConfirmation: state.combined.showConfirmation,
    selectedTabId: state.combined.selectedTab,

  }));



  const [formData, setFormData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const [employeeDetailsData, setEmployeeDetailsData] = useState<any>({});

  useEffect(() => {
    if (formEmployeeData && Object.keys(formEmployeeData).length > 0) {
      setEmployeeDetailsData(formEmployeeData);
    }
  }, [formEmployeeData]);

  useEffect(() => {
    if (
      formEmployeeData &&
      Object.keys(formEmployeeData).length > 0 &&
      formColumnsData?.SectionList?.length > 0
    ) {
      const detailSections = formColumnsData?.SectionList
        .filter((sec) => sec.SectionType === "Detail")
        .map((sec) => sec.SectionName)
        .filter(Boolean); // Removes undefined/null names

      const mergedData = detailSections.reduce((acc, key) => {
        const sectionData = formEmployeeData?.[key];
        if (Array.isArray(sectionData)) {
          return { ...acc, ...(sectionData[0] || {}) };
        } else if (sectionData && typeof sectionData === "object") {
          return { ...acc, ...sectionData };
        }
        return acc;
      }, {});

      setFormData(mergedData || {});
      setOriginalData(mergedData || {});
    } else {
      // Fallback if formEmployeeData or SectionList is invalid
      setFormData({});
      setOriginalData({});
    }
  }, [formEmployeeData, formColumnsData]);




  const handleChange = (fieldName, newValue) => {
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: newValue
    }));

  };


  useEffect(() => {
    const anyFieldDirty = Object.values(isDirtyFields).some(Boolean);
    dispatch(setSaveDisabled(!anyFieldDirty)); // Disable if no field is dirty
    dispatch(setCancelDisabled(!anyFieldDirty));
  }, [isDirtyFields, dispatch]);

  const handleDirtyState = (fieldName, isDirty) => {
    setIsDirtyFields(prevState => ({
      ...prevState,
      [fieldName]: isDirty
    }));
    const anyFieldDirty = Object.values({ ...isDirtyFields, [fieldName]: isDirty }).some(Boolean);

    dispatch(setIsDirty(anyFieldDirty));
    dispatch(setSaveDisabled(!anyFieldDirty));
    dispatch(setCancelDisabled(!anyFieldDirty))
  };



  const validateForm = () => {
    // const allHeaderColumnsData = sectionFormColumnsData && sectionFormColumnsData?.flatMap(item => item.headerColumnsData);
    // const emptyFields = allHeaderColumnsData.filter(
    //   (col) => col.required && !formData[col.ColumnHeader]
    // );

    // if (emptyFields.length > 0) {
    //   const missingFields = emptyFields.map((field) => field.ColumnHeader).join(", ");
    //   alert(`Please enter: ${missingFields}`);
    //   return false;
    // }
    // return true;
  };

  const handleConfirmationYes = () => {
    handleSendSaveData(formData);
    setShowConfirmationModal(false);

    dispatch(setIsDirty(false));
    dispatch(setShowConfirmation(false));
    setIsDirtyFields({})
    setResetDirtyState(prev => !prev) // to reset the input fields isDirty
  };

  // it will close the confirmation modal when click on No button
  const handleConfirmationNo = () => {
    setFormData(originalData) // Reset form to original data
    setShowConfirmationModal(false);

    dispatch(setIsDirty(false));
    dispatch(setShowConfirmation(false));
    setIsDirtyFields({})
    setResetDirtyState(prev => !prev) // to reset the input fields isDirty
  };




  const handleActionSaveButton = () => {
    setShowConfirmationModal(true);
  };

  const handleActionCancelButton = () => {
    setShowConfirmationModal(true);
  };

  const buttonActions: Record<string, () => void> = {
    Save: handleActionSaveButton,
    Cancel: handleActionCancelButton
  };

  useEffect(() => {
    Object.entries(buttonStatesObj).forEach(([key, value]) => {
      if (value && buttonActions[key]) {
        buttonActions[key]();
        dispatch(setButtonStates({ [key]: false }));
      }
    });
  }, [buttonStatesObj, dispatch]);

  useEffect(() => {
    if (buttonActions[buttonName]) {
      buttonActions[buttonName]();
    }
  }, [buttonName]);

  useEffect(() => {
    if (showConfirmation) {
      setShowConfirmationModal(true)
    } else {
      setShowConfirmationModal(false)
    }
  }, [showConfirmation])

  return (
    <>

      <div className="container-fluid">
        <div className="row">
          {/* PageGrid Section Panel - Left Side */}
          <div className="col-12 col-md-6" style={{ padding: 0, paddingRight: 5 }} >

            {formColumnsData?.SectionList && formColumnsData?.SectionList?.length > 0 &&
              formColumnsData.SectionList.filter((sec) => sec.SectionType === "Detail")
                .map((section: any, index: number) => {

                  return (<>
                    <FormComponent
                      key={index}
                      sectionName={section.SectionHeader}
                      formColumns={section?.UIColumnList || []}
                      formData={formData}
                      handleChange={handleChange}
                      handleDirtyState={handleDirtyState}
                      isDirtyFields={isDirtyFields}
                      setIsDirtyFields={setIsDirtyFields}
                      resetDirtyState={resetDirtyState}
                    />
                  </>
                  );
                })}


          </div>


          {/* SectionGrid Section Panel - Right Side */}
          <div className="col-12 col-md-6 ms-auto" style={{ padding: 0, paddingLeft: 5 }} >
            {formColumnsData?.SectionList && formColumnsData?.SectionList?.length > 0 &&
              formColumnsData.SectionList.filter((sec) => sec.SectionType === "Grid")
                .map((section: any, index: number) => {
                  const rawData = employeeDetailsData?.[section.SectionName];
                  const bodyData = Array.isArray(rawData) ? rawData : [];
                  return (
                    <div className="container-fluid" style={{ marginBottom: 5 }}>
                      <div className="row">
                        <div className="col-12" style={{ padding: 0, margin: 0 }}>
                          <SectionGrid
                            key={index}
                            sectionGridTitle={section?.SectionHeader}
                            settings={section?.SectionGridConfiguration || {}}
                            gridHeader={section?.UIColumnList || []}
                            bodyData={bodyData}
                            EmployeeId={formEmployeeData.Employee?.Id || null}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmationModal}
        onClose={handleConfirmationNo}
        onConfirm={handleConfirmationYes}
        title="Confirm Save"
        message={"Do you want to save these changes?"}
        confirmLabel="Yes"
        cancelLabel="No"
        isLoading={false}
      />
    </>

  );
};

export default Details