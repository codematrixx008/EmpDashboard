import { JSX, useEffect, useRef, useState } from 'react';
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls, BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAdd, IoMdSettings } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLastPage, BiSortAlt2 } from "react-icons/bi";
import { BiFirstPage } from "react-icons/bi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendar, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import { TbReload } from 'react-icons/tb';
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti';
import { useDispatch, useSelector } from "react-redux";
import { setIsEditDisabled, setButtonStates, setIsDeleteDisabled } from "../../redux/reducer/combinedSlice.ts";
import { Modal } from "react-bootstrap";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import BsButton from '../../baseComponents/BsButton.tsx';
import { ArrowDown, ArrowLeft, ArrowLeftToLine, ArrowRight, ArrowRightToLine, ArrowUp, RotateCw } from 'lucide-react';
import DeleteModal from '../DeleteModal/DeleteModal.tsx';
import CustomTooltip from '../CustomTooltip/CustomTooltip.tsx';
import { useTranslation } from 'react-i18next';
import AddEditModalNew from '../AddEditModal/AddEditModalNew.tsx';
import { toast } from 'react-toastify';
import { clearHandleAddAddressGridData, clearHandleDeleteAddressGridData, clearHandleEditAddressGridData, getSingleEmployeeDetails, handleAddAddressGridData, handleDeleteAddressGridData, handleEditAddressGridData, setAddAddressGridData } from '../../redux/reducer/detailsPageSlice.ts';
import { PageSizeList } from '../../data/AppData.ts';


declare global {
  interface Window {
    bootstrap: any;
    position?: "left" | "right"; // Make position optional
    width?: number;
    height?: number;
  }
}
const SectionGrid = ({ sectionGridTitle, settings, gridHeader, bodyData, EmployeeId }: any) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();



  //  state to hold the table body
  const [bodyDataColumns, setBodyDataColumns] = useState<any[]>([]);

  // common headers columns for the page grid
  const [headerSetting, setHeaderSetting] = useState<any>({});
  const [headerColumns, setHeaderColumns] = useState<any[]>([]);
  const [editedHeaderData, setEditedHeaderData] = useState<any[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<any[]>([]);



  const [sortedData, setSortedData] = useState(bodyDataColumns);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [sectionGridColumns, setSectionGridColumns] = useState(headerColumns);



  const isAnyRowSelected = selectedRows.length > 0;
  const [filters, setFilters] = useState<{ [key: string]: { condition: string; value: any } }>({});
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: string } | null>(null);
  const [columnFilterVisible, setColumnFilterVisible] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: 'abcds', x: 0, y: 0 });

  const [showColumnVisiblePopUp, setShowColumnVisiblePopUp] = useState<boolean>(false);
  const [showBtnVisiblePopUp, setShowBtnVisiblePopUp] = useState<boolean>(false);
  const [showActionPopup, setShowActionPopup] = useState<{ [key: string]: boolean }>({
    Add: false,
    Edit: false,
    Delete: false
  });
  const [inputValues, setInputValues] = useState<any>({});


  // ======== pagination variables =========
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginatedData = sortedData.slice((safePage - 1) * pageSize, safePage * pageSize);
  const isSelectAllChecked = selectedRows.length === paginatedData.length && paginatedData.length > 0;

  useEffect(() => {
  const newTotalPages = Math.ceil(sortedData.length / pageSize);
  if (currentPage > newTotalPages) {
    setCurrentPage(Math.max(newTotalPages, 1));
  }
}, [sortedData, pageSize]);
  // ======== pagination variables =========



  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const popupColumnRef = useRef<HTMLDivElement>(null);

  const {
    buttonStatesObj,
    editDisabled,
    deleteDisabled,
    addAddressGridData,
    editAddressGridData,
    deleteAddressGridData
  } = useSelector((state: RootState) => ({
    buttonStatesObj: state.combined.buttonStates,
    editDisabled: state.combined.editDisabled,
    deleteDisabled: state.combined.deleteDisabled,
    addAddressGridData: state.employeeDetails.addAddressGridData,
    editAddressGridData: state.employeeDetails.editAddressGridData,
    deleteAddressGridData: state.employeeDetails.deleteAddressGridData,
  }));

  useEffect(() => {
    if (bodyData && bodyData && bodyData?.length > 0) {
      setBodyDataColumns(bodyData);
    }
  }, [bodyData])

  useEffect(() => {
    if (gridHeader && gridHeader?.length > 0) {
      setHeaderColumns(gridHeader);
    }
  }, [gridHeader])

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setHeaderSetting(settings);
    }
  }, [settings])


  const frozenColumns = visibleColumns
    .filter(col => col.IsHidden);

  const nonFrozenColumns = visibleColumns
    .filter(col => !col.IsHidden);


  useEffect(() => {
    if (columnFilterVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [columnFilterVisible]);

  useEffect(() => {
    handlefiltersearch();
  }, [filters]);

  const formatDate = (date, targetFormat) => {
    if (!date || !targetFormat) return date;

    // Handle both "-" and "/" as separators
    const parts = date.split(/[-/]/);
    if (parts.length !== 3 || parts.some(isNaN)) return date;

    let [year, month, day] =
      date.includes("/") ? [parts[2], parts[0], parts[1]] : [parts[2], parts[0], parts[1]]; // Default MM-DD-YYYY

    // Convert based on target format
    switch (targetFormat) {
      case "MM-DD-YYYY":
        return `${month}-${day}-${year}`;
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "YYYY/MM/DD":
        return `${year}/${month}/${day}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      default:
        return date; // Return original if format is unknown
    }
  };


  useEffect(() => {
    if (headerColumns && headerColumns.length > 0) {
      const mappedData = headerColumns
      setEditedHeaderData(mappedData);
      setVisibleColumns(mappedData)
    } else {
      setEditedHeaderData([]);
    }
  }, [headerColumns]);


  useEffect(() => {
    if (!bodyData || !headerSetting?.DateFormat) return;

    setSortedData(
      bodyData.map((item) => {
        let formattedItem = { ...item };
        headerColumns.forEach(({ ColumnName, DataType }) => {
          if (DataType === "date" && item[ColumnName]) {
            formattedItem[ColumnName] = formatDate(item[ColumnName], headerSetting.DateFormat);
          }
        });
        return formattedItem;
      })
    );
  }, [bodyData, headerSetting]);




  useEffect(() => {
    // on edit in the section grid it sets the data in the form 
    if (showActionPopup.Edit && selectedRows !== null && bodyData && headerColumns) {
      const selectedRowData = bodyData.find((row: any) => row.Id === selectedRows[0]);
      setInputValues(selectedRowData);
    }
  }, [showActionPopup.Edit, selectedRows, bodyData, headerColumns]);


  // useEffect(() => {
  //   if (showBtnVisiblePopUp) {
  //     document.addEventListener('mousedown', handleClickOutsideColumns);
  //   } else {
  //     document.removeEventListener('mousedown', handleClickOutsideColumns);
  //   }
  //   return () => document.removeEventListener('mousedown', handleClickOutsideColumns);
  // }, [showBtnVisiblePopUp]);




  useEffect(() => {
    if (showColumnVisiblePopUp || showBtnVisiblePopUp) {
      document.addEventListener('mousedown', handleClickOutsideColumns);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideColumns);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideColumns);
  }, [showColumnVisiblePopUp, showBtnVisiblePopUp]);
  // true

  const isEditDisabled = !isAnyRowSelected || selectedRows.length > 1;
  const isDeleteDisabled = !isAnyRowSelected;


  // ======== Button Action Code Start's ===========

  const handleGetIcons: Record<string, JSX.Element> = {
    Add: <FaPlus style={{ color: "#6a1b9a" }} />,
    Edit: <FaEdit style={{ color: "#04B2D9" }} />,
    Delete: <FaTrash style={{ color: "#f38375" }} />,
    CSV: <FaFileCsv style={{ color: "#e65100" }} />,
    XLSX: <FaFileExcel style={{ color: "#1e3a8a" }} />,
    PDF: <FaFilePdf style={{ color: "#F25E86" }} />,
    CustomizeColumns: <IoMdSettings style={{ color: "#212121B3" }} />,
    AllMenu: <GiHamburgerMenu style={{ color: "#000000" }} />,
  };

  const multiBtnActionHandler: Record<string, () => void> = {
    Add: () => handleActionAddButton(),
    Edit: () => handleActionEditButton(),
    Delete: () => handleActionDeleteButton(),
    CSV: () => exportToCSV(),
    XLSX: () => exportToExcel(),
    PDF: () => exportToPDF(),
    CustomizeColumns: () => handleCustomizeColumnPopup(),
    AllMenu: () => handleMenuBtnVisiblePopup(),
  };

  // useEffect(() => {
  //   Object.entries(buttonStatesObj).forEach(([key, value]) => {
  //     if (value && buttonActions[key]) {
  //       buttonActions[key]();
  //       dispatch(setButtonStates({ ...buttonStatesObj, [key]: false })); // Reset only the executed button
  //     }
  //   });
  // }, [buttonStatesObj, dispatch]);

  // ======== Button Action Code End's ===========

  const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${month}${day}${year}_${hours}${minutes}${seconds}`;
  };

  const exportToCSV = () => {
    const timestamp = getFormattedDateTime();
    const csvRows: string[] = [];
    const dataToExport = getSelectedExportData();
    const headers = visibleColumns
      .filter(col => !col.IsHidden)
      .map(col => `"${col.ColumnName}"`);
    csvRows.push(headers.join(','));
    dataToExport.forEach(row => {
      const values = visibleColumns
        .filter(col => !col.IsHidden)
        .map(col => {
          let value = formatData(row[col.ColumnName], col.DataType);
          return `"${value !== null && value !== undefined ? value : ''}"`;
        });
      csvRows.push(values.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `export_${timestamp}.csv`);
  };

  const exportToExcel = () => {
    const timestamp = getFormattedDateTime();
    const dataToExport = getSelectedExportData();
    const headers = visibleColumns
      .filter(col => !col.IsHidden)
      .map(col => col.ColumnName);
    const data = dataToExport.map(row =>
      visibleColumns
        .filter(col => !col.IsHidden)
        .reduce((acc, col) => {
          acc[col.ColumnName] = formatData(row[col.ColumnName], col.DataType);
          return acc;
        }, {} as Record<string, any>)
    );

    const ws = XLSX.utils.json_to_sheet([headers, ...data.map(Object.values)]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sectionGridTitle);
    XLSX.writeFile(wb, `export_${timestamp}.xlsx`);
  };

  const exportToPDF = () => {
    const timestamp = getFormattedDateTime();
    const dataToExport = getSelectedExportData();
    const doc = new jsPDF({ orientation: "landscape", putOnlyUsedFonts: true, format: "a3" });

    const headers = visibleColumns
      .filter(col => !col.IsHidden)
      .map(col => col.ColumnName);

    const data = dataToExport.map(row =>
      visibleColumns
        .filter(col => !col.IsHidden)
        .map(col => formatData(row[col.ColumnName], col.DataType))
    );

    doc.text(sectionGridTitle, 14, 10);
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 2 },
    });

    doc.save(`export_${timestamp}.pdf`);
  };

  const handleMouseEnter = (e: any, name: any) => {
    setTooltip({ visible: true, text: name, x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handleInputChange = (columnHeader: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [columnHeader]: value
    }));
  };

  const handleActionEditButtonClose = () => {
    setShowActionPopup({ ...showActionPopup, Edit: false });
    setInputValues({});
  };

  // add new address 
  const handleAddSubmit = () => {
    const newUserData = { EmployeeId, ...inputValues };
    dispatch(handleAddAddressGridData(newUserData)); // Dispatch action to add new data
    setInputValues({});
    handleActionAddButtonClose();
  };

  //  Edit existing address
  const handleEditSubmit = () => {
    if (showActionPopup.Edit) {
      const editId = selectedRows[0];
      const updatedData = {
        ...inputValues,
        Id: editId, // row ids of address
        EmployeeId: EmployeeId, // EmployeeId to identify the employee
      };
      dispatch(handleEditAddressGridData(updatedData));
    }
    setInputValues({});
    handleActionEditButtonClose();
  };

  const handleDelete = (Id: number) => {
    // call delete api to delete the record from the section grid
    const payload = {
      "Ids": Id,
      "EmployeeId": EmployeeId
    };
    dispatch(handleDeleteAddressGridData(payload));
    setSelectedRows([])
    handleActionDeleteButtonClose();
  };

  //************************* Address  ************************** */
  useEffect(() => {
    if (addAddressGridData && 'message' in addAddressGridData) {
      toast.success(String(addAddressGridData?.message));
      dispatch(clearHandleAddAddressGridData()); // Fetch updated employee details after adding address
      const payload = {
        "RowId": EmployeeId
      }
      dispatch(getSingleEmployeeDetails(payload)); // Fetch updated employee details after adding address
    }
  }, [addAddressGridData])

  useEffect(() => {
    if (editAddressGridData && 'message' in editAddressGridData) {
      toast.success(String(editAddressGridData?.message));
      dispatch(clearHandleEditAddressGridData());
      const payload = {
        "RowId": EmployeeId
      }
      dispatch(getSingleEmployeeDetails(payload));
    }
  }, [editAddressGridData])

  useEffect(() => {
    if (deleteAddressGridData && 'message' in deleteAddressGridData) {
      toast.success(String(deleteAddressGridData?.message));
      dispatch(clearHandleDeleteAddressGridData());
      const payload = {
        "RowId": EmployeeId
      }
      dispatch(getSingleEmployeeDetails(payload));
    }
  }, [deleteAddressGridData])

  // *************************************************** */



  const handleSortClick = (column: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.column === column && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ column, direction });
    const sorted = [...sortedData].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'ascending' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
  };

  const handleCheckboxChange = (Id: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(Id)
        ? prevSelectedRows.filter((rowId) => rowId !== Id)
        : [...prevSelectedRows, Id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      const pageRowIds = paginatedData.map((row: any) => row.Id);
      setSelectedRows(pageRowIds);
    }
  };

  const formatData = (data: any, dataType: string) => {
    if (dataType === 'date') {
      const date = new Date(data);
      return date.toLocaleDateString('en-GB'); // Formats date as 'DD/MM/YYYY'
    } else if (dataType === 'boolean') {
      return data ? "Yes" : "No"; // Converts true/false to Yes/No
    }
    return data;
  };

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);
  //   const filteredData = bodyData.filter((row: any) =>
  //     visibleColumns.some((col: any) =>
  //       String(row[col.ColumnName]).toLowerCase().includes(value.toLowerCase())
  //     )
  //   );
  //   setSortedData(filteredData);
  //   setCurrentPage(1);
  // };

  // const handleClearSearch = () => {
  //   const filteredData = bodyData.filter((row: any) =>
  //     visibleColumns.some((col: any) =>
  //       String(row[col.ColumnName]).toLowerCase())
  //   )
  //   setSortedData(filteredData);
  //   setCurrentPage(1);
  //   setSearchTerm('');
  // };

  const getSelectedExportData = (): typeof sortedData => {
    if (selectedRows.length > 0) {
      return sortedData.filter(row => selectedRows.includes(row.id));
    }
    return sortedData;
  };

  const handleColumnVisibilityChange = (columnHeader: string) => {
    setVisibleColumns((prevColumns: any) =>
      prevColumns.map((col: any) =>
        col.ColumnName === columnHeader
          ? { ...col, IsHidden: !col.IsHidden }
          : col
      )
    );
  };

  const handleCustomizeColumnPopup = () => {
    setShowColumnVisiblePopUp((prevState) => !prevState);
  };


  const handleMenuBtnVisiblePopup = () => {
    setShowBtnVisiblePopUp((prevState) => !prevState);
  };

  const handleFilterClick = (columnHeader: string) => {
    setColumnFilterVisible((prev) => (prev === columnHeader ? null : columnHeader));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
      setColumnFilterVisible(null);
    }
  };

  const handleClickOutsideColumns = (event: MouseEvent) => {
    if (popupColumnRef.current && !popupColumnRef.current.contains(event.target as Node)) {
      setShowColumnVisiblePopUp(false);
      setShowBtnVisiblePopUp(false);
    }
  };

  const renderFilterOptions = (dataType: string) => {
    switch (dataType) {
      case 'string':
        return (
          <>
            <option value="contain">Contain</option>
            <option value="doesnotcontain">Does not contain</option>
            <option value="startwith">Start with</option>
            <option value="endwith">End with</option>
            {/* <option value="is">Is</option> */}
          </>
        );

      case 'number':
        return (
          <>
            <option value="equal">=</option>
            <option value="notequal">!=</option>
            <option value="greaterthan">{">"}</option>
            <option value="greaterthanequal">{">="}</option>
            <option value="lessthan">{"<"}</option>
            <option value="lessthanequal">{"<="}</option>
            <option value="isempty">Is empty</option>
            <option value="isnotempty">Is not empty</option>
            <option value="between">Between</option>
          </>
        );

      case 'date':
      case 'datetime':
        return (
          <>
            {/* <option value="is">Is</option> */}
            <option value="isnot">Is not</option>
            <option value="isafter">Is after</option>
            <option value="isonorafter">Is on or after</option>
            <option value="isbefore">Is before</option>
            <option value="isonorbefore">Is on or before</option>
            <option value="isempty">Is empty</option>
            <option value="isnotempty">Is not empty</option>
            <option value="between">Between</option>
          </>
        );

      case 'boolean':
        return (
          <>
            <option value="is">Is</option>
          </>
        );

      default:
        return null;
    }
  };

  const getDistinctBooleanValues = (column: string) => {
    const distinctValues = [...new Set(bodyData.map((row: any) => row[column]))];
    return distinctValues;
  };

  const handleFilterConditionChange = (column: string, condition: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: { ...prevFilters[column], condition },
    }));
  };

  const handleFilterInputChange = (column: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: { ...prevFilters[column], value },
    }));
  };

  const renderFilterInput = (dataType: string, column: string) => {
    const filterValue = filters[column]?.value ?? "";
    switch (dataType) {
      case 'string':
        return (
          <>
            <div className='filter-values-container' >
              {filters[column]?.condition === 'isempty' ? (
                <input
                  type="text"
                  className="search-input2"
                  value={filterValue}
                  disabled
                  placeholder="No value"
                />
              ) : filters[column]?.condition === 'doesnotcontain' ? (
                <input
                  type="text"
                  className="search-input2"
                  value={filterValue}
                  onChange={(e) => handleFilterInputChange(column, e.target.value)}
                  placeholder="Does not contain"
                />
              ) : (
                <input
                  type="text"
                  className="search-input2"
                  value={filterValue}
                  onChange={(e) => handleFilterInputChange(column, e.target.value)}
                  placeholder="Search"
                />
              )}
              {!(filters[column]?.condition === 'isempty' || filters[column]?.condition === 'isnotempty') && (
                <button className="clear-button" onClick={() => handleclearfilter(column)}><TbReload /></button>
              )}
            </div>
          </>

        );

      case 'number':
        if (filters[column]?.condition === 'isempty' || filters[column]?.condition === 'isnotempty') {
          return null;
        }
        return (
          <div className='filter-values-container' >
            {filters[column]?.condition === 'between' ? (
              <><div className='filter-date-range-container'>
                <input
                  type="number"
                  className="search-input2"
                  style={{ width: '100%' }}
                  value={filters[column]?.value?.min ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      [column]: {
                        ...prev[column],
                        value: { ...prev[column]?.value, min: e.target.value },
                      },
                    }))
                  }
                  placeholder="Min value"
                />
                <input
                  type="number"
                  className="search-input2"
                  style={{ width: '100%' }}
                  value={filters[column]?.value?.max ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      [column]: {
                        ...prev[column],
                        value: { ...prev[column]?.value, max: e.target.value },
                      },
                    }))
                  }
                  placeholder="Max value"
                />
              </div>
              </>
            ) : (
              <input
                type="number"
                className="search-input2"
                style={{ width: '100%' }}
                value={filterValue}
                onChange={(e) => handleFilterInputChange(column, e.target.value)}
                placeholder="Search"
              />
            )}
            {!(filters[column]?.condition === 'isempty' || filters[column]?.condition === 'isnotempty') && (
              <button className="clear-button" onClick={() => handleclearfilter(column)}><TbReload /></button>
            )}
          </div>
        );

      case 'date':
      case 'datetime':
        if (filters[column]?.condition === 'isempty' || filters[column]?.condition === 'isnotempty') {
          return null;
        }
        return (
          <>
            <div className='filter-values-container' >
              {filters[column]?.condition === 'between' ? (
                <>
                  <div className='filter-date-range-container'>
                    <input
                      type="date"
                      className="DatePicker-custom"
                      value={filters[column]?.value?.startDate?.toISOString().split("T")[0] ?? ""}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : null;
                        setFilters((prev) => ({
                          ...prev,
                          [column]: {
                            ...prev[column],
                            value: { ...prev[column]?.value, startDate: newDate }
                          }
                        }));
                      }}
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      className="DatePicker-custom"
                      value={filters[column]?.value?.endDate?.toISOString().split("T")[0] ?? ""}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : null;
                        setFilters((prev) => ({
                          ...prev,
                          [column]: {
                            ...prev[column],
                            value: { ...prev[column]?.value, endDate: newDate }
                          }
                        }));
                      }}
                      placeholder="End Date"
                    />
                  </div>
                </>
              ) : (
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="DatePicker-custom"
                  value={filterValue ? new Date(filterValue).toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : null;
                    setFilters((prev) => ({
                      ...prev,
                      [column]: { ...prev[column], value: newDate }
                    }));
                  }}
                  placeholder="Select Date"
                />
              )}
              {!(filters[column]?.condition === 'isempty' || filters[column]?.condition === 'isnotempty') && (
                <button className="clear-button" onClick={() => handleclearfilter(column)}><TbReload /></button>
              )}
            </div>
          </>

        );

      case 'boolean':
        const distinctValues = getDistinctBooleanValues(column);
        return (
          <div className='filter-values-container' >
            <select
              className="search-input2"
              onChange={(e: any) => handleFilterInputChange(column, e.target.value)}
              value={filterValue}
            >
              <option value="" disabled>Select</option>
              {distinctValues.map((val: any, idx: number) => (
                <option key={idx} value={val}>
                  {val ? 'True' : 'False'}
                </option>
              ))}
            </select>
            {filterValue !== "" && (
              <button className="clear-button" onClick={() => handleclearfilter(column)}>
                <TbReload />
              </button>
            )}
          </div>
        );

      default:
        return null;

    }
  };

  const handlefiltersearch = () => {
    let filteredData = bodyData;

    Object.keys(filters).forEach((column) => {
      const { condition, value } = filters[column];

      if (condition === 'isempty') {
        filteredData = filteredData.filter((row: any) => {
          const cellValue = row[column];
          return cellValue === null || cellValue === undefined || cellValue === '';
        });
        return;
      }

      if (condition === 'isnotempty') {
        filteredData = filteredData.filter((row: any) => {
          const cellValue = row[column];
          return !(cellValue === null || cellValue === undefined || cellValue === '');
        });
        return;
      }

      if (value !== undefined && value !== null) {
        filteredData = filteredData.filter((row: any) => {
          const cellValue = row[column];

          if (typeof cellValue === 'number') {
            const numValue = Number(cellValue);
            const numFilterValue = value !== "" ? Number(value) : null;

            switch (condition) {
              case 'equal':
                return numFilterValue !== null ? numValue === numFilterValue : true;
              case 'notequal':
                return numFilterValue !== null ? numValue !== numFilterValue : true;
              case 'greaterthan':
                return numFilterValue !== null ? numValue > numFilterValue : true;
              case 'greaterthanequal':
                return numFilterValue !== null ? numValue >= numFilterValue : true;
              case 'lessthan':
                return numFilterValue !== null ? numValue < numFilterValue : true;
              case 'lessthanequal':
                return numFilterValue !== null ? numValue <= numFilterValue : true;
              case 'between':
                return value.min !== "" && value.max !== ""
                  ? Number(value.min) <= numValue && numValue <= Number(value.max)
                  : true;
              default:
                return true;
            }
          }
          else if (typeof cellValue === 'string') {
            if (['isafter', 'isonorafter', 'isbefore', 'isonorbefore', 'between'].includes(condition)) {
              const dateValue = new Date(cellValue);
              switch (condition) {
                case 'isafter':
                  return dateValue > new Date(value);
                case 'isonorafter':
                  return dateValue >= new Date(value);
                case 'isbefore':
                  return dateValue < new Date(value);
                case 'isonorbefore':
                  return dateValue <= new Date(value);
                case 'between':
                  return dateValue >= new Date(value.startDate) && dateValue <= new Date(value.endDate);
                default:
                  return true;
              }
            } else {
              const strValue = String(cellValue);
              switch (condition) {
                case 'contain':
                  return strValue.toLowerCase().includes(value.toLowerCase());
                case 'doesnotcontain':
                  return !strValue.toLowerCase().includes(value.toLowerCase());
                case 'startwith':
                  return strValue.toLowerCase().startsWith(value.toLowerCase());
                case 'endwith':
                  return strValue.toLowerCase().endsWith(value.toLowerCase());
                case 'is':
                  return strValue === value;
                default:
                  return true;
              }
            }
          }
          else if (typeof cellValue === 'boolean') {
            const boolValue = value === 'true' || value === true;
            switch (condition) {
              case 'is':
                return cellValue === boolValue;
              case 'isnot':
                return cellValue !== boolValue;
              default:
                return true;
            }
          }
          else if (cellValue instanceof Date || !isNaN(Date.parse(cellValue))) {
            const dateValue = new Date(cellValue);
            switch (condition) {
              case 'isafter':
                return dateValue > new Date(value);
              case 'isonorafter':
                return dateValue >= new Date(value);
              case 'isbefore':
                return dateValue < new Date(value);
              case 'isonorbefore':
                return dateValue <= new Date(value);
              case 'between':
                return (
                  new Date(value.startDate) <= dateValue &&
                  dateValue <= new Date(value.endDate)
                );
              default:
                return true;
            }
          }

          return true;
        });
      }
    });

    setSortedData(filteredData);
    setCurrentPage(1);
  };

  const handleclearfilter = (column: string) => {
    setFilters({
      filter: { condition: '', value: '' }
    });
    handlefiltersearch();
  };



  const handleActionAddButton = () => {
    setShowActionPopup((prev) => ({ ...prev, Add: true }));
  };

  const handleActionAddButtonClose = () => {
    setShowActionPopup((prev) => ({ ...prev, Add: false }));
  };

  const handleActionEditButton = () => {
    setShowActionPopup((prev) => ({ ...prev, Edit: true }));
  };

  const handleActionDeleteButton = () => {
    setShowActionPopup((prev) => ({ ...prev, Delete: true }));
  };

  const handleActionDeleteButtonClose = () => {
    setShowActionPopup((prev) => ({ ...prev, Delete: false }));
  };



  // =========== pagination function start ============
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };
  // =========== pagination function end ============

  const CustomInput = ({ value, onClick }: any) => (
    <div className="custom-date-picker" onClick={onClick}>
      <input value={value} readOnly placeholder="Select" />
      <FaCalendar />
    </div>
  );

  const calculateLeftOffset = (col) => {
    const index = frozenColumns.findIndex(fCol => fCol.ColumnName === col.ColumnName);
    return 30 + frozenColumns.slice(0, index).reduce((acc, curr) => acc + curr.Width - 2, 0);
  };

  const [pinnedColumns, setPinnedColumns] = useState<{ [key: string]: boolean }>({});

  const togglePin = (columnHeader: string) => {
    setPinnedColumns((prev) => ({
      ...prev,
      [columnHeader]: !prev[columnHeader],
    }));

    setVisibleColumns((prevColumns: any) =>
      prevColumns.map((col: any) =>
        col.ColumnName === columnHeader
          ? { ...col, IsFreeze: !col.IsFreeze }
          : col
      )
    );
  };





  const [modalAllColumns, setModalAllColumns] = useState<number[]>([]);
  const [modalSelectedColumns, setModalSelectedColumns] = useState<number[]>([]);


  const handleVisibleColumnsCheckboxChange = (id: number, isChecked: boolean) => {
    setModalAllColumns(prev =>
      isChecked ? [...prev, id] : prev.filter(name => name !== id)
    );
  };
  const handleHiddenColumnsCheckboxChange = (id: number, isChecked: boolean) => {
    setModalSelectedColumns(prev =>
      isChecked ? [...prev, id] : prev.filter(name => name !== id)
    );
  };



  const handleVisibleSelectedColumns = () => {
    const newColumns = sectionGridColumns.map(col =>
      modalAllColumns.includes(col.Id) ? { ...col, IsHidden: true } : col
    );
    setSectionGridColumns(newColumns);
    setModalAllColumns([])
  };

  const handleHiddenSelectedColumns = () => {
    const newColumns = sectionGridColumns.map(col =>
      modalSelectedColumns.includes(col.Id) ? { ...col, IsHidden: false } : col
    );
    setSectionGridColumns(newColumns);
    setModalSelectedColumns([])
  };

  // useEffect(() => {
  //   setVisibleColumns(sectionGridColumns)
  // }, [sectionGridColumns])

  const handleAllColumnsVisible = () => {
    setSectionGridColumns((prevColumns) =>
      prevColumns.map((column) => ({ ...column, IsHidden: true }))
    );
    setModalAllColumns([])
  };


  const handleAllColumnsHidden = () => {
    setSectionGridColumns((prevColumns) =>
      prevColumns.map((column) => ({ ...column, IsHidden: false }))
    );
    setModalSelectedColumns([])
  };


  const handleMoveColumnUp = () => {
    // Find the index of the item with the given id in sectionGridColumns
    const selectedId = modalSelectedColumns[0];
    const currentIndex = sectionGridColumns.findIndex((data: any) => data.id === selectedId);

    if (currentIndex === -1) return; // If the item is not found, exit the function

    // Find the current item
    const currentItem = sectionGridColumns[currentIndex];

    // Find the previous visible item
    let previousIndex = currentIndex - 1;
    while (previousIndex >= 0 && !sectionGridColumns[previousIndex].IsHidden) {
      previousIndex--;
    }

    if (previousIndex < 0) return; // No visible item above, exit function
    const previousItem = sectionGridColumns[previousIndex];
    // Swap the ColumnOrder of the current item and the previous visible item
    const tempOrder = currentItem.ColumnOrder;
    currentItem.ColumnOrder = previousItem.ColumnOrder;
    previousItem.ColumnOrder = tempOrder;

    // Sort the sectionGridColumns array based on the updated ColumnOrder
    sectionGridColumns.sort((a: any, b: any) => a.ColumnOrder - b.ColumnOrder);

    // Update the state to trigger a re-render
    setSectionGridColumns([...sectionGridColumns]);
  };

  const handleMoveColumnDown = () => {
    // Find the index of the item with the given id in sectionGridColumns
    const selectedId = modalSelectedColumns[0];
    const currentIndex = sectionGridColumns.findIndex((data: any) => data.id === selectedId);

    if (currentIndex === -1) return; // If the item is not found, exit the function

    // Find the current item
    const currentItem = sectionGridColumns[currentIndex];

    // Find the next visible item
    let nextIndex = currentIndex + 1;
    while (nextIndex < sectionGridColumns.length && !sectionGridColumns[nextIndex].IsHidden) {
      nextIndex++;
    }

    if (nextIndex >= sectionGridColumns.length) return; // No visible item below, exit function

    const nextItem = sectionGridColumns[nextIndex];

    // Swap the ColumnOrder of the current item and the next visible item
    const tempOrder = currentItem.ColumnOrder;
    currentItem.ColumnOrder = nextItem.ColumnOrder;
    nextItem.ColumnOrder = tempOrder;

    // Sort the sectionGridColumns array based on the updated ColumnOrder
    sectionGridColumns.sort((a: any, b: any) => a.ColumnOrder - b.ColumnOrder);

    // Update the state to trigger a re-render
    setSectionGridColumns([...sectionGridColumns]);
  };

  const handleRefreshColumns = () => {
    setSectionGridColumns(headerColumns);
  }

  const canMoveColumnUp = () => {
    const selectedId = modalSelectedColumns[0];
    const currentIndex = sectionGridColumns.findIndex((data: any) => data.id === selectedId);

    if (currentIndex === -1) return false;

    let previousIndex = currentIndex - 1;
    while (previousIndex >= 0 && !sectionGridColumns[previousIndex].IsHidden) {
      previousIndex--;
    }

    return previousIndex >= 0; // Return true if there's a visible item above, false otherwise
  };

  const canMoveColumnDown = () => {
    const selectedId = modalSelectedColumns[0];
    const currentIndex = sectionGridColumns.findIndex((data: any) => data.id === selectedId);

    if (currentIndex === -1) return false;

    let nextIndex = currentIndex + 1;
    while (nextIndex < sectionGridColumns.length && !sectionGridColumns[nextIndex].IsHidden) {
      nextIndex++;
    }

    return nextIndex < sectionGridColumns.length; // Return true if there's a visible item below, false otherwise
  };



  return (

    <div className="main-card-container" style={{ width: `100%`, height: `100%`, float: "none" }}>


      <AddEditModalNew
        show={showActionPopup.Add || showActionPopup.Edit}
        mode={showActionPopup.Add ? "Add" : "Edit"}
        headerColumns={editedHeaderData}
        inputValues={inputValues}
        handleInputChange={handleInputChange}
        handleClose={showActionPopup.Add ? handleActionAddButtonClose : handleActionEditButtonClose}
        handleSubmit={showActionPopup.Add ? handleAddSubmit : handleEditSubmit}
        settings={headerSetting}
        commonDropdownArray={[]}
      // commonDropdownArray={commonDropdownArray}
      />


      <DeleteModal
        show={showActionPopup.Delete}
        handleClose={handleActionDeleteButtonClose}
        handleDelete={handleDelete}
        selectedRows={selectedRows}
      />


      <div className="section-grid-main-container" >
        <div className="grid-header-container">

          <div className='section-title-container'><h6>{sectionGridTitle}</h6></div>

          <div className="actions-container">

            <div className="grid-header-buttons-container">

              {headerSetting?.ButtonActionList?.map((item, index) => {
                const btnName = item.Action;

                const isDisabled =
                  !item.IsEnabled ||
                  (btnName === "Edit" && (!isAnyRowSelected || selectedRows.length !== 1)) ||
                  (btnName === "Delete" && !isAnyRowSelected);

                return (
                  <CustomTooltip key={index} tooltipText={t(`MENU_NAME.${item.Action_StrCode}`)}>
                    <button
                      className="table-action-btn"
                      disabled={isDisabled}
                      onClick={multiBtnActionHandler[btnName]}
                    >
                      {handleGetIcons[btnName]}
                    </button>
                  </CustomTooltip>
                );
              })}


              <div className='show-hide-column-container'>

                {showBtnVisiblePopUp && (
                  <div ref={popupColumnRef} className="all-menu-container all-menu-container-section-grid">
                    <div className="all-menu-inner-container">
                      {headerSetting?.ButtonActionList?.length > 0 &&
                        headerSetting.ButtonActionList.map((item, index) => {
                          const btnName = item.Action;
                          // Handle special logic for Edit and Delete
                          const isDisabled =
                            !item.IsEnabled ||
                            (btnName === "Edit" && (!isAnyRowSelected || selectedRows.length !== 1)) ||
                            (btnName === "Delete" && !isAnyRowSelected);
                          return (
                            <button
                              key={index}
                              className="all-menu-container-btns"
                              onClick={multiBtnActionHandler[btnName]}
                              disabled={isDisabled}
                            >
                              <span style={{ marginRight: "5px" }}>{handleGetIcons[btnName]}</span>
                              <span style={{ marginLeft: 4, whiteSpace: "nowrap" }}>{t(`MENU_NAME.${item.Action_StrCode}`)}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                <Modal
                  show={showColumnVisiblePopUp}
                  onHide={() => {
                    setShowColumnVisiblePopUp(false);
                  }}
                  centered
                >
                  <Modal.Header closeButton> <div style={{ fontWeight: "500", fontSize: "18px" }}> Customize Columns </div>  </Modal.Header>
                  <Modal.Body >
                    <div className='hide-columns-modal-container'>
                      <div className='hide-columns-container'>
                        <h6>Available Column</h6>
                        {/* <h6>All Column</h6> */}
                        <div className="hide-column-list-container">
                          {sectionGridColumns?.filter((data: any) => !data.IsHidden).length === 0 ? (
                            <div className='hidden-column-single-container'
                              style={{ background: "#dddddd" }}>
                              <div className='checkbox-name-box'>
                                <label htmlFor={`checkbox-no`}
                                  style={{
                                    marginLeft: 5,
                                    cursor: "pointer",
                                  }} >
                                  No Columns Found
                                </label>
                              </div>
                            </div>
                          ) : (
                            sectionGridColumns?.filter((data: any) => !data.IsHidden).map((data: any, index: number) => {
                              const isChecked = modalAllColumns.includes(data.id);
                              return (
                                <div key={index} className='hidden-column-single-container'
                                  style={{ background: `${data.IsHidden ? "" : "#dddddd"}` }}>
                                  <div className='checkbox-name-box'>
                                    <input
                                      type="checkbox"
                                      id={`checkbox-${index}`}
                                      checked={isChecked}
                                      onChange={(e) => handleVisibleColumnsCheckboxChange(data.id, e.target.checked)}
                                      disabled={data.IsHidden}
                                    />
                                    <label htmlFor={`checkbox-${index}`}
                                      style={{
                                        marginLeft: 5,
                                        cursor: "pointer",
                                      }} >
                                      {data.ColumnHeader}
                                    </label>
                                  </div>
                                </div>
                              )
                            })
                          )}

                        </div>
                      </div>

                      <div className='hide-columns-btn-container' >
                        <BsButton className="common-btn" text={<ArrowRightToLine size={16} strokeWidth={3} />}
                          action={() => handleAllColumnsVisible()} disabled={false} />
                        <BsButton className="common-btn" text={<ArrowRight size={16} strokeWidth={3} />}
                          action={() => handleVisibleSelectedColumns()} disabled={false} />

                        <BsButton className="common-btn" text={<ArrowLeftToLine size={16} strokeWidth={3} />}
                          action={() => handleAllColumnsHidden()} disabled={false} />
                        <BsButton className="common-btn " text={<ArrowLeft size={16} strokeWidth={3} />}
                          action={() => handleHiddenSelectedColumns()} disabled={false} />
                      </div>

                      <div className='hide-columns-container' >
                        <h6>Selected Column</h6>

                        <div className="hide-column-list-container">
                          {sectionGridColumns?.filter((data: any) => data.IsHidden).length === 0 ? (
                            <div className='hidden-column-single-container'
                              style={{ background: "#dddddd" }}>
                              <div className='checkbox-name-box'>
                                <label htmlFor={`checkbox-no`}
                                  style={{
                                    marginLeft: 5,
                                    cursor: "pointer",
                                  }} >
                                  No Columns Found
                                </label>
                              </div>
                            </div>
                          ) : (
                            sectionGridColumns?.filter((data: any) => data.IsHidden)?.map((data: any, index: number, array: any[]) => {
                              const isChecked = modalSelectedColumns.includes(data.id);
                              return (
                                <div key={data.id} className='hidden-column-single-container'>
                                  <div className='checkbox-name-box'>
                                    <input
                                      type="checkbox"
                                      id={`checkbox-visible-${data.id}`}
                                      checked={isChecked}
                                      onChange={(e) => handleHiddenColumnsCheckboxChange(data.id, e.target.checked)}
                                    />
                                    <label htmlFor={`checkbox-visible-${data.id}`} style={{ marginLeft: 5, cursor: "pointer" }}>
                                      {data.ColumnHeader}
                                    </label>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className='hide-columns-btn-right-container'>
                        <div className='hide-columns-btn-sort-container' >
                          <BsButton
                            className={`common-btn ${modalSelectedColumns.length > 1 || !canMoveColumnUp() ? "disabled" : ""}`}
                            text={<ArrowUp size={16} strokeWidth={3} />}
                            action={() => handleMoveColumnUp()}
                            disabled={modalSelectedColumns.length > 1 || !canMoveColumnUp()}
                          />

                          <BsButton
                            className={`common-btn ${modalSelectedColumns.length > 1 || !canMoveColumnDown() ? "disabled" : ""}`}
                            text={<ArrowDown size={16} strokeWidth={3} />}
                            action={() => handleMoveColumnDown()}
                            disabled={modalSelectedColumns.length > 1 || !canMoveColumnDown()}
                          />
                        </div>

                        <BsButton
                          className="common-btn"
                          text={<RotateCw size={16} strokeWidth={3} />}
                          action={() => handleRefreshColumns()}
                          disabled={false}
                        />
                      </div>



                    </div>
                  </Modal.Body>
                </Modal>



                {/* {showColumnVisiblePopUp && (
                  <div ref={popupColumnRef} className="section-column-visibility">
                    <div className="section-inner-column-visibility">
                      {headerColumns.map((col: any, index: number) => (
                        <div
                          key={index}
                          className="checkbox-container"
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, columnGap: 45 }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                              type="checkbox"
                              id={`checkbox-${index}`}
                              checked={visibleColumns.find((visibleCol: any) => visibleCol.ColumnHeader === col.ColumnHeader)?.IsHidden}
                              onChange={() => handleColumnVisibilityChange(col.ColumnHeader)}
                            />
                            <label htmlFor={`checkbox-${index}`} style={{ marginLeft: 4 }}>{col.ColumnHeader}</label>
                          </div>
                          <button
                            onClick={() => togglePin(col.ColumnHeader)}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                          >
                            {col.IsFreeze ? (
                              pinnedColumns[col.ColumnHeader] ? <LuPin /> : <RiPushpinFill />
                            ) : (
                              pinnedColumns[col.ColumnHeader] ? <RiPushpinFill /> : <LuPin />
                            )}
                          </button>

                        </div>
                      ))}
                    </div>
                  </div>
                )}  */}

              </div>

            </div>

          </div>
        </div>


        <div className='table-pagination-container' ref={filterDropdownRef}>
          <div className="grid-table-container" >

            <table cellPadding="5" className="custom-grid" style={{ borderCollapse: 'collapse' }}>
              <thead className="custom-grid-header" >
                <tr>
                  <th className="sticky-column"
                    style={{
                      background: headerSetting?.Background || "#099be0",
                      position: 'sticky', left: 0, zIndex: 103, borderRight: "1px solid #ccc",
                      height: "25px", minWidth: "28px", display: "flex", justifyContent: "center"
                    }}>
                    <input type="checkbox" checked={isSelectAllChecked} onChange={handleSelectAllChange} />
                  </th>
                  {[...frozenColumns, ...nonFrozenColumns].map((col: any, index) => (
                    <th
                      key={index}
                      className={`th-tab sticky-columns ${col.IsFreeze ? 'sticky-column' : ''}`}
                      title={col.ColumnHeader}
                      style={{
                        textAlign: "center",
                        minWidth: `${col.Length}px`,
                        padding: "0px 5px 0px 10px",

                        fontSize: '13px',
                        fontFamily: 'Arial, sans-serif',
                        color: headerSetting?.Color || '#fff',
                        background: headerSetting?.Background || '#099be0',
                        left: col.IsFreeze ? `${calculateLeftOffset(col) - 10}px` : undefined,
                        zIndex: col.IsFreeze ? 110 : 1,
                        whiteSpace: 'nowrap',
                        top: '-2px',
                        height: "25px",
                        paddingLeft: "10px"
                      }}
                    >


                      <span style={{ paddingRight: '5px' }}  // style={{ position: 'absolute' }}
                      >
                        {t(`GRID_HEADERS.${col.ColumnName_StrCode}`)}
                      </span>


                      <div style={{ display: 'block', float: 'right' }}>

                        <button className="btnsort1"
                          style={{
                            border: `1px solid ${headerSetting?.Background || "#099be0"}`,
                            background: headerSetting?.Background || "#099be0",
                            color: headerSetting?.Color || 'whitesmoke'
                          }} onClick={() => handleSortClick(col.ColumnName)}>
                          <BiSortAlt2 style={{ margin: "0", marginTop: "-5px" }} />
                        </button>


                        <button className="btnfilter1" style={{
                          border: `1px solid ${headerSetting?.Background || "#099be0"}`, background: headerSetting?.Background || "#099be0",
                          color: headerSetting?.Color || 'whitesmoke'
                        }} onClick={() => handleFilterClick(col.ColumnName)}>
                          <BsThreeDotsVertical style={{ margin: 0, marginTop: "-5px" }} />
                        </button>

                        {
                          columnFilterVisible === col.ColumnName && (
                            <div className="column-visibilityy">
                              <div className="search-bar2" style={{ margin: '5px' }}>
                                <div ref={filterDropdownRef} className="filter-dropdown">
                                  <div className="select-container">
                                    <select
                                      value={filters[col.ColumnName]?.condition || ""}
                                      onChange={(e) => handleFilterConditionChange(col.ColumnName, e.target.value)}
                                      className="autocomplete-input2"
                                    >
                                      <option value="" disabled>Select Filter</option>
                                      {renderFilterOptions(col.DataType)}
                                    </select>
                                  </div>
                                  {renderFilterInput(col.DataType, col.ColumnName)}
                                </div>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="custom-grid-body">
                {paginatedData.map((row, rowIndex) => (
                  <tr key={row.Id} className={rowIndex % 2 === 0 ? "stripedRow" : "table-row"}>
                    <td className="sticky-column"
                      style={{
                        position: 'sticky', left: 0, zIndex: 103, borderRight: "1px solid #ccc",
                        height: "25px", minWidth: "28px", display: "flex", justifyContent: "center"
                      }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.Id)}
                        onChange={() => handleCheckboxChange(row.Id)}
                      />
                    </td>
                    {[...frozenColumns, ...nonFrozenColumns].map((col) => (
                      <td
                        key={col.ColumnName}
                        className={rowIndex % 2 === 0 ? "stripedRow" : "table-row"}
                        style={{
                          textAlign:
                            col.ComponentType === "CurrencyTextbox" ? "right" :
                              col.ComponentType === "Textbox" || col.ComponentType === "Dropdown" ? "left" :
                                col.ComponentType === "Checkbox" || col.ComponentType === "Number" || col.ComponentType === "DatePicker" ? "center" :
                                  "left",
                          minWidth: col.Length ? `${col.Length}px` : "200px",
                          padding: "0px 5px 0px 10px",


                          fontSize: "12px",
                          fontFamily: "system-ui",
                          borderRight: "1px solid #ccc",
                          position: col.IsFreeze ? "sticky" : "static",
                          left: col.IsFreeze ? `${calculateLeftOffset(col) - 10}px` : undefined,
                          background: col.IsFreeze ? "whitesmoke" : "transparent",
                          zIndex: col.IsFreeze ? 100 : 1,
                          paddingLeft: "10px",
                        }}
                      >
                        <span>
                          {col.ComponentType === "Checkbox" ? (
                            <input type="checkbox" checked={row[col.ColumnName]} disabled={!row.IsEnabled} />
                          ) : col.ComponentType == "CurrencyTextbox" ? (
                            <> {`${headerSetting?.Currency}  ${row[col.ColumnName]} `}</>
                          ) : (
                            row[col.ColumnName]
                          )
                          }
                        </span>
                      </td>
                    ))}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="pagination-container">
            <div className="section-grid-footer-records-container" >
              <span>Records : {selectedRows.length}&#47;{paginatedData.length}</span>
            </div>

            <div className="pagination">

              <div className='page-size-container'>
                <div className="page-size-text">Page Size:</div>
                {" "}
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className='select-page-size'
                >
                  {PageSizeList.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className='pagination-buttons-container'>
                <button className='pagination-btn' disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                  <BiFirstPage />
                </button>
                <button className='pagination-btn' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  <TiArrowLeftThick />
                </button>

                <span className='pagination-btn-text' > {currentPage} - {totalPages}</span>

                <button className='pagination-btn' disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                  <TiArrowRightThick />
                </button>
                <button className='pagination-btn' disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                  <BiLastPage />
                </button>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div >
  );
};

export default SectionGrid;