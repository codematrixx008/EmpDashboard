import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi"; // Three-dot icon
import '../assets/styles/bsSelectPopup.css';
import GenericSelectableModal from "../customComponents/CustomGenericModal/GenericSelectableModal.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store.ts";
import { getCommonMasterDropdownData } from "../redux/reducer/combinedSlice.ts";



interface SelectOption {
  Label: string;
  Id: string;
}

interface SelectPopupCustomProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  onDirty?: (name: string, dirty: boolean) => void;
  initialValue?: string;
  border?: string;
  dropDownPopup?: boolean;
  dropdownId?: number;
  resetDirtyState?: boolean;
}

const BsSelectPopup: React.FC<SelectPopupCustomProps> = ({
  options,
  value,
  onChange,
  name,
  onDirty,
  border = "",
  dropDownPopup,
  dropdownId,
  resetDirtyState,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<SelectOption[]>([]);
  const [isFieldDirty, setIsFieldDirty] = useState(false);
  const [initialValue, setInitialValue] = useState(value);

  // Reset dirty state when requested
  useEffect(() => {
    setIsFieldDirty(false);
  }, [resetDirtyState]);


  const handleClosePopup = () => {
    setShowPopup(false);
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);

    const newValue = event.target.value;
    const dirty = newValue !== initialValue;

    if (isFieldDirty !== dirty) {
      setIsFieldDirty(dirty);
      onDirty?.(name, dirty);
    }

    onChange(newValue);
  };


  useEffect(() => {
    if (options && options.length > 0) {
      setDropdownOptions(options)
    }
  }, [options])

  const handleMasterDropdownPopupOpen = () => {
    const payload = {
      "DropdownId": dropdownId
    };
    dispatch(getCommonMasterDropdownData(payload));
    setShowPopup(true);
  };


  return (
    <div className="custom-select-container" style={{ border: border }}>

      <select
        className="custom-select"
        value={value}
        name={name}
        onChange={handleSelectChange}
        style={{
          minHeight: "20px",
          height: "28px",
          fontSize: "12px",
        }}
      >
        <option value="">Select...</option>
        {dropdownOptions.map((opt) => (
          <option key={opt.Id} value={opt.Id}>
            {opt.Label}
          </option>
        ))}
      </select>

      {dropDownPopup && <button className="select-menu-button" onClick={() => {
        handleMasterDropdownPopupOpen();
      }}>
        <FiMoreVertical size={16} />
      </button>}


      {showPopup &&
        <GenericSelectableModal
          show={showPopup}
          onClose={handleClosePopup}
        />

      }
    </div>
  );
};

export default BsSelectPopup;