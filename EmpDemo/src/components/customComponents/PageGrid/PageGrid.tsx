import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLastPage, BiSortAlt2 } from "react-icons/bi";
import { BiFirstPage } from "react-icons/bi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendar } from "react-icons/fa";
import { TbReload } from 'react-icons/tb';
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import CustomPopover from '../CustomPopover/CustomPopover.tsx';
import DeleteModal from '../DeleteModal/DeleteModal.tsx';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import BsButton from '../../baseComponents/BsButton.tsx';
import { FiSave } from "react-icons/fi";
import { ArrowDown, ArrowLeft, ArrowLeftToLine, ArrowRight, ArrowRightToLine, ArrowUp, RotateCw } from 'lucide-react';
import { clearUpdateGridSettings, setEmployeeRecordData, setGridPaginationData, updateGridSettings } from '../../redux/reducer/employeePageSlice.ts';
import { setIsEditDisabled, setButtonStates, setIsDeleteDisabled, getFormCommonDropdownData, setSelectedTab, getGridCommonHeaderData } from "../../redux/reducer/combinedSlice.ts";
import { pageGridTitle, pageGridSettings } from "../../data/Data.ts";
import FilterSearchModal from '../FilterSearchModal/FilterSearchModal.tsx';
import { useTranslation } from 'react-i18next';
import AddEditModalNew from '../AddEditModal/AddEditModalNew.tsx';
import { PageSizeList } from '../../data/AppData.ts';
import CustomTooltip from '../CustomTooltip/CustomTooltip.tsx';

interface NewPageGridProps {
  key?: string;
  bodyData: any;
  handleSendAdd?: (inputValues: any) => void;
  handleSendFilter?: (inputValues: any) => void;
  handleSendFilterReset?: (inputValues: any) => void;
  handleSendDelete?: (Id: any) => void;
  handleSendUpdate?: (Id: any, updatedInputValues: any) => void;
}

const PageGrid: React.FC<NewPageGridProps> = ({ key, bodyData, handleSendAdd, handleSendUpdate, handleSendDelete, handleSendFilter, handleSendFilterReset }: any) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();


  const [bodyDataColumns, setBodyDataColumns] = useState<any[]>([]);
  const [bodyDataPagination, setBodyDataPagination] = useState<any>({});


  const [inputValues, setInputValues] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  const [sortedData, setSortedData] = useState(bodyDataColumns);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [customizeColumns, setCustomizeColumns] = useState<any[]>([]);

  // common headers columns for the page grid
  const [headerSetting, setHeaderSetting] = useState<any>({});
  const [headerColumns, setHeaderColumns] = useState<any[]>([]);
  const [editedHeaderData, setEditedHeaderData] = useState<any[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<any[]>([]);

  const isAnyRowSelected = selectedRows.length > 0;
  const [filters, setFilters] = useState<{ [key: string]: { condition: string; value: any } }>({});
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: string } | null>(null);
  const [columnFilterVisible, setColumnFilterVisible] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: 'abcds', x: 0, y: 0 });
  const [showColumnVisiblePopUp, setShowColumnVisiblePopUp] = useState<boolean>(false);
  const [showActionPopup, setShowActionPopup] = useState<{ [key: string]: boolean }>({
    Add: false,
    Edit: false,
    Delete: false,
    Filter: false,
  });
  const [editCell, setEditCell] = useState<{ rowId: number; ColumnHeader: string } | null>(null);

  // ======== pagination variables =========
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedData = sortedData;
  const isSelectAllChecked = selectedRows.length === paginatedData.length && paginatedData.length > 0;
  const totalPages = Math.ceil(bodyDataPagination?.TotalRecords / pageSize);
  // ======== pagination variables =========



  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const popupColumnRef = useRef<HTMLDivElement>(null);

  const [commonDropdownArray, setCommonDropdownArray] = useState<any[]>([]);

  const {
    currentUserId,
    buttonStatesObj,
    editDisabled,
    deleteDisabled,
    selectedTabId,
    gridSchemaCommonHeaderData,
    formCommonDropdownData,
    updateGridSettingsStatus,
    employeeRecordData,
    gridPaginationData,
  } = useSelector((state: RootState) => ({
    currentUserId: state.combined.currentUserId,
    buttonStatesObj: state.combined.buttonStates,
    editDisabled: state.combined.editDisabled,
    deleteDisabled: state.combined.deleteDisabled,

    gridSchemaCommonHeaderData: state.combined.gridSchemaCommonHeaderData,
    employeeRecordData: state.employeePage.employeeRecordData,
    gridPaginationData: state.employeePage.gridPaginationData,
    formCommonDropdownData: state.combined.formCommonDropdownData,
    selectedTabId: state.combined.selectedTab,

    updateGridSettingsStatus: state.employeePage.updateGridSettingsStatus,

  }));



  useEffect(() => {
    if (bodyData && bodyData?.Data && bodyData?.Data?.length > 0) {
      setBodyDataColumns(bodyData?.Data);
      setBodyDataPagination(bodyData?.Pagination);
    }
  }, [bodyData])

  useEffect(() => {
    // update the page size on initially based on the redux values
    if (gridPaginationData) {
      setPageSize(gridPaginationData?.PageSize)
    }
  }, [gridPaginationData])

  useEffect(() => {
    if (currentUserId && selectedTabId) {
      const payload = {
        UserId: currentUserId,
        TabId: selectedTabId
      }
      dispatch(getGridCommonHeaderData(payload));
    }
  }, [currentUserId, selectedTabId])


  useEffect(() => {
    if (gridSchemaCommonHeaderData && gridSchemaCommonHeaderData?.Columns?.length > 0) {
      setHeaderColumns(gridSchemaCommonHeaderData?.Columns);
      setHeaderSetting(gridSchemaCommonHeaderData?.Configuration);
    }
  }, [gridSchemaCommonHeaderData])


  useEffect(() => {
    if (headerColumns && headerColumns.length > 0) {
      setEditedHeaderData(headerColumns);
      setVisibleColumns(headerColumns);
      setCustomizeColumns(headerColumns)
    } else {
      setEditedHeaderData([]);
    }
  }, [headerColumns]);



  useEffect(() => {
    if (!bodyDataColumns || !headerSetting) return;

    setSortedData(
      bodyDataColumns.map((item) => {
        let formattedItem = { ...item };
        editedHeaderData.forEach(({ ColumnHeader, DataType }) => {
          if (DataType === "date" && item[ColumnHeader]) {
            formattedItem[ColumnHeader] = formatDate(item[ColumnHeader], headerSetting?.DateFormat);
          }
        });
        return formattedItem;
      })
    );
  }, [bodyDataColumns, headerSetting]);


  useEffect(() => {
    if (columnFilterVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [columnFilterVisible]);

  useEffect(() => {
    handleFilterSearch();
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
    if (showActionPopup.Edit && selectedRows !== null && bodyDataColumns && editedHeaderData) {

      const selectedRowData = bodyDataColumns.find((row: any) => row.Id === selectedRows[0]);
      setInputValues(selectedRowData);

      // if (selectedRowData) {
      //   const updatedInputValues: { [key: string]: any } = {};
      //   editedHeaderData.forEach((col: any) => {
      //     updatedInputValues[col.ColumnHeader] = selectedRowData[col.ColumnHeader] || '';
      //   });
      //   setInputValues(updatedInputValues);
      // } // currently commented because it is used to set the data in the form in case of edit
    }
  }, [showActionPopup.Edit, selectedRows, bodyDataColumns, editedHeaderData]);


  useEffect(() => {
    if (showColumnVisiblePopUp) {
      document.addEventListener('mousedown', handleClickOutsideColumns);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideColumns);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideColumns);
  }, [showColumnVisiblePopUp]);

  const isEditDisabled = !isAnyRowSelected || selectedRows.length > 1;
  const isDeleteDisabled = !isAnyRowSelected;


  const buttonActions: Record<string, () => void> = {
    Add: () => handleActionAddButton(),
    Edit: () => {
      if (!editDisabled) {
        if (selectedTabId == 2) {
          dispatch(setSelectedTab(3))
        } else {
          handleActionEditButton()
        }

      };
    },
    Delete: () => {
      if (!deleteDisabled) handleActionDeleteButton();
    },
    CSV: () => exportToCSV(),
    XLSX: () => exportToExcel(),
    PDF: () => exportToPDF(),
    CustomizeColumns: () => handleColumnVisiblePopup(),
    PageFilter: () => handleActionFilterButton(),
  };

  useEffect(() => {
    Object.entries(buttonStatesObj).forEach(([key, value]) => {
      if (value && buttonActions[key]) {
        buttonActions[key]();
        dispatch(setButtonStates({ ...buttonStatesObj, [key]: false })); // Reset only the executed button
      }
    });
  }, [buttonStatesObj, dispatch]);


  useEffect(() => {
    dispatch(setIsEditDisabled(isEditDisabled));
    dispatch(setIsDeleteDisabled(isDeleteDisabled));
  }, [dispatch, isEditDisabled, isDeleteDisabled]);

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
    XLSX.utils.book_append_sheet(wb, ws, pageGridTitle);
    XLSX.writeFile(wb, `export_${timestamp}.xlsx`);
  };

  const exportToPDF = () => {
    const timestamp = getFormattedDateTime();
    const dataToExport = getSelectedExportData();
    const doc = new jsPDF({ orientation: "landscape", putOnlyUsedFonts: true, format: "a3" });

    const headers = visibleColumns
      .filter(col => col.IsHidden)
      .map(col => col.ColumnName);

    const data = dataToExport.map(row =>
      visibleColumns
        .filter(col => col.IsHidden)
        .map(col => formatData(row[col.ColumnName], col.DataType))
    );

    doc.text(pageGridTitle, 14, 10);
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

  const handleInputChange = (ColumnHeader: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [ColumnHeader]: value
    }));
  };



  const handleAddSubmit = () => {
    const newUserRole = { ...inputValues };
    handleSendAdd(newUserRole)
    setInputValues({});
    handleActionAddButtonClose();
  };

  const handleFilterSubmit = () => {
    const newUserRole = { ...inputValues };
    handleSendFilter(newUserRole)
    setShowActionPopup((prev) => ({ ...prev, Filter: false }));
  };

  const handleActionFilterButtonClose = () => {
    setShowActionPopup((prev) => ({ ...prev, Filter: false }));
    setInputValues({});
    handleSendFilterReset()
  };



  //! update
  const handleEditSubmit = () => {
    if (showActionPopup.Edit) {
      const updatedData = sortedData.map((row) => {
        if (row.Id === selectedRows[0]) {
          return { ...row, ...inputValues };
        }
        return row;
      });
      setSortedData(updatedData);
    }
    handleSendUpdate(selectedRows[0], inputValues);
    // setInputValues({});
    handleActionEditButtonClose();
  };


  // =========== pagination function start ============
  const handlePageChange = (pageNumber: number, actionName: string) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    dispatch(setGridPaginationData({
      PageSize: pageSize,
      PageNo: pageNumber,
      BtnFunction: actionName
    }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1)
    dispatch(setGridPaginationData({
      PageSize: newSize,
      PageNo: 1,
      BtnFunction: null
    }));
  };
  // =========== pagination function end ============

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


  const handleHyperLinkName = (Id: number) => {
    dispatch(setEmployeeRecordData({ EmployeeIdList: [Id] }));
    dispatch(setSelectedTab(3));
  }


  const handleSingleCheckboxChange = (id: number) => {
    setSelectedRows(prev => {
      // figure out the next list of selected rows
      const newData = prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id];

      dispatch(setEmployeeRecordData({ EmployeeIdList: newData }));
      return newData;
    });
  };
  // this useEffect keeps the id save if we go to the other tab
  useEffect(() => {
    if (employeeRecordData?.EmployeeIdList.length == 1 && selectedRows?.length == 0) {
      setSelectedRows(employeeRecordData?.EmployeeIdList);
    }
  }, [employeeRecordData])




  const handleSelectAllChange = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      const pageRowIds = paginatedData.map((row: any) => row.Id);
      setSelectedRows(pageRowIds);
    }
  };

  const formatData = (data: any, DataType: string) => {
    if (DataType === 'date') {
      const date = new Date(data);
      return date.toLocaleDateString('en-GB'); // Formats date as 'DD/MM/YYYY'
    } else if (DataType === 'boolean') {
      return data ? "Yes" : "No"; // Converts true/false to Yes/No
    }
    return data;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredData = bodyDataColumns.filter((row: any) =>
      visibleColumns.some((col: any) =>
        String(row[col.ColumnHeader]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setSortedData(filteredData);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    const filteredData = bodyDataColumns.filter((row: any) =>
      visibleColumns.some((col: any) =>
        String(row[col.ColumnHeader]).toLowerCase())
    )
    setSortedData(filteredData);
    setCurrentPage(1);
    setSearchTerm('');

  };

  const getSelectedExportData = (): typeof sortedData => {
    if (selectedRows.length > 0) {
      return sortedData.filter(row => selectedRows.includes(row.Id));
    }
    return sortedData;
  };

  const handleColumnVisibilityChange = (ColumnHeader: string) => {
    setVisibleColumns((prevColumns: any) =>
      prevColumns.map((col: any) =>
        col.ColumnHeader === ColumnHeader
          ? { ...col, IsHidden: !col.IsHidden }
          : col
      )
    );
  };

  const handleColumnVisiblePopup = () => {
    setShowColumnVisiblePopUp((prevState) => !prevState);
  };

  const handleFilterClick = (ColumnHeader: string) => {
    setColumnFilterVisible((prev) => (prev === ColumnHeader ? null : ColumnHeader));
  };


  const handleClickOutside = (event: MouseEvent) => {
    if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
      setColumnFilterVisible(null);
    }
  };

  const handleClickOutsideColumns = (event: MouseEvent) => {
    if (popupColumnRef.current && !popupColumnRef.current.contains(event.target as Node)) {
      setShowColumnVisiblePopUp(false);
    }
  };

  const renderFilterOptions = (DbDateType: string) => {
    switch (DbDateType) {
      case 'Varchar':
        return (
          <>
            <option value="contain">Contain</option>
            <option value="doesnotcontain">Does not contain</option>
            <option value="startwith">Start with</option>
            <option value="endwith">End with</option>
            {/* <option value="is">Is</option> */}
          </>
        );

      case 'Int':
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

      case 'Date':
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

      case 'Bit':
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
    const distinctValues = [...new Set(bodyDataColumns.map((row: any) => row[column]))];
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


  const renderFilterInput = (DbDateType: string, column: string) => {
    const filterValue = filters[column]?.value ?? "";
    switch (DbDateType) {
      case 'Varchar':
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
                <button className="clear-button" onClick={() => handleClearFilter(column)}><TbReload /></button>
              )}
            </div>
          </>

        );

      case 'Int':
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
              <button className="clear-button" onClick={() => handleClearFilter(column)}><TbReload /></button>
            )}
          </div>
        );

      case 'Date':
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
                <button className="clear-button" onClick={() => handleClearFilter(column)}><TbReload /></button>
              )}
            </div>
          </>

        );

      case 'Bit':
        const distinctValues = getDistinctBooleanValues(column);
        return (
          <div className='filter-values-container' >
            <select
              className="search-input2"
              onChange={(e: any) => handleFilterInputChange(column, e.target.value)}
              value={filterValue}
            >
              <option value="" disabled>Select</option>
              {distinctValues.map((val: any, Id: number) => (
                <option key={Id} value={val}>
                  {val ? 'True' : 'False'}
                </option>
              ))}
            </select>
            {filterValue !== "" && (
              <button className="clear-button" onClick={() => handleClearFilter(column)}>
                <TbReload />
              </button>
            )}
          </div>
        );

      default:
        return null;

    }
  };

  const handleFilterSearch = () => {
    let filteredData = bodyDataColumns;

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

  const handleClearFilter = (column: string) => {
    setFilters({
      filter: { condition: '', value: '' }
    });
    handleFilterSearch();
  };



  //! delete
  const handleDelete = (Ids: number) => {
    handleSendDelete(Ids);
    setSelectedRows([])
    handleActionDeleteButtonClose();
  };

  useEffect(() => {
    if (formCommonDropdownData && formCommonDropdownData?.MasterDropdownData) {
      setCommonDropdownArray(formCommonDropdownData?.MasterDropdownData)
    } else {
      setCommonDropdownArray([])
    }
  }, [formCommonDropdownData])


  const handleActionAddButton = () => {
    setShowActionPopup((prev) => ({ ...prev, Add: true }));
    const payload = {
      "TabId": selectedTabId
    }
    dispatch(getFormCommonDropdownData(payload));
  };

  const handleActionAddButtonClose = () => {
    setShowActionPopup((prev) => ({ ...prev, Add: false }));
    setInputValues({});
  };
  const handleActionEditButton = () => {
    setShowActionPopup((prev) => ({ ...prev, Edit: true }));
  };

  const handleActionEditButtonClose = () => {
    setShowActionPopup({ ...showActionPopup, Edit: false });
    setInputValues({});
  };

  const handleActionDeleteButton = () => {
    setShowActionPopup((prev) => ({ ...prev, Delete: true }));
  };

  const handleActionDeleteButtonClose = () => {
    setShowActionPopup((prev) => ({ ...prev, Delete: false }));
  };

  const handleActionFilterButton = () => {
    setShowActionPopup((prev) => ({ ...prev, Filter: true }));
    const payload = {
      "TabId": selectedTabId
    }
    dispatch(getFormCommonDropdownData(payload));
  };



  const handleDoubleClick = (rowId: number, ColumnHeader: string) => {
    setEditCell({ rowId, ColumnHeader });
  };

  const handleEditableInput = (ColumnHeader: string, value: any) => {
    const updatedData = sortedData.map((row) => {
      if (row.Id === editCell?.rowId) {
        return { ...row, [ColumnHeader]: value };
      }
      return row;
    });
    setSortedData(updatedData);
    setEditCell(null)
  };


  const CustomInput = ({ value, onClick }: any) => (
    <div className="custom-date-picker" onClick={onClick}>
      <input value={value} readOnly placeholder="Select" />
      <FaCalendar />
    </div>
  );

  // const calculateLeftOffset = (col) => {
  //   const index = frozenColumns.findIndex(fCol => fCol.ColumnHeader === col.ColumnHeader);
  //   return 30 + frozenColumns.slice(0, index).reduce((acc, curr) => acc + curr.Width - 2, 0);
  // };

  const [pinnedColumns, setPinnedColumns] = useState<{ [key: string]: boolean }>({});

  const togglePin = (ColumnHeader: string) => {
    setPinnedColumns((prev) => ({
      ...prev,
      [ColumnHeader]: !prev[ColumnHeader],
    }));

    setVisibleColumns((prevColumns: any) =>
      prevColumns.map((col: any) =>
        col.ColumnHeader === ColumnHeader
          ? { ...col, IsFreeze: !col.IsFreeze }
          : col
      )
    );
  };







  // ===============  Customize Columns Start's ============================
  const [modalAllColumns, setModalAllColumns] = useState<number[]>([]);
  const [modalSelectedColumns, setModalSelectedColumns] = useState<number[]>([]);


  const handleVisibleColumnsCheckboxChange = (Id: number, isChecked: boolean) => {
    setModalAllColumns(prev =>
      isChecked ? [...prev, Id] : prev.filter(name => name !== Id)
    );
  };
  const handleHiddenColumnsCheckboxChange = (Id: number, isChecked: boolean) => {
    setModalSelectedColumns(prev =>
      isChecked ? [...prev, Id] : prev.filter(name => name !== Id)
    );
  };
  const handleVisibleSelectedColumns = () => {
    const newColumns = customizeColumns.map(col =>
      modalAllColumns.includes(col.Id) ? { ...col, IsHidden: false } : col
    );
    setCustomizeColumns(newColumns)
    setModalAllColumns([])
  };

  const handleHiddenSelectedColumns = () => {
    const newColumns = customizeColumns.map(col =>
      modalSelectedColumns.includes(col.Id) ? { ...col, IsHidden: true } : col
    );
    setCustomizeColumns(newColumns)
    setModalSelectedColumns([])
  };

  const handleAllColumnsVisible = () => {
    setCustomizeColumns((prevColumns) =>
      prevColumns.map((column) => ({ ...column, IsHidden: false }))
    );
    setModalAllColumns([])
  };


  const handleAllColumnsHidden = () => {
    setCustomizeColumns((prevColumns) =>
      prevColumns.map((column) => ({ ...column, IsHidden: true }))
    );
    setModalSelectedColumns([])
  };

  const handleMoveColumnUp = () => {
    const selectedId = modalSelectedColumns[0];

    // Always work on a sorted copy
    const sortedColumns = [...customizeColumns]
      .map(col => ({ ...col })) // clone to make ColumnOrder writable
      .sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0));

    const currentIndex = sortedColumns.findIndex(col => col.Id === selectedId);
    if (currentIndex === -1) return;

    let previousIndex = currentIndex - 1;
    while (previousIndex >= 0 && sortedColumns[previousIndex].IsHidden) {
      previousIndex--;
    }

    if (previousIndex < 0) return;

    const currentItem = sortedColumns[currentIndex];
    const previousItem = sortedColumns[previousIndex];

    // Swap ColumnOrder safely
    const tempOrder = currentItem.ColumnOrder;
    currentItem.ColumnOrder = previousItem.ColumnOrder;
    previousItem.ColumnOrder = tempOrder;

    // Reflect changes in original array by matching on Id
    const updatedColumns = customizeColumns.map(col => {
      const updated = sortedColumns.find(sc => sc.Id === col.Id);
      return updated ? { ...col, ColumnOrder: updated.ColumnOrder } : col;
    });

    updatedColumns.sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0));
    setCustomizeColumns(updatedColumns);
  };



  const handleMoveColumnDown = () => {
    const selectedId = modalSelectedColumns[0];

    // Clone all objects to avoid mutating read-only ones
    const sortedColumns = [...customizeColumns]
      .map(col => ({ ...col }))
      .sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0));

    const currentIndex = sortedColumns.findIndex(col => col.Id === selectedId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + 1;
    while (nextIndex < sortedColumns.length && sortedColumns[nextIndex].IsHidden) {
      nextIndex++;
    }
    if (nextIndex >= sortedColumns.length) return;

    const currentItem = sortedColumns[currentIndex];
    const nextItem = sortedColumns[nextIndex];

    // Safe ColumnOrder swap
    const tempOrder = currentItem.ColumnOrder;
    currentItem.ColumnOrder = nextItem.ColumnOrder;
    nextItem.ColumnOrder = tempOrder;

    // Reflect changes in original array
    const updatedColumns = customizeColumns.map(col => {
      const updated = sortedColumns.find(sc => sc.Id === col.Id);
      return updated ? { ...col, ColumnOrder: updated.ColumnOrder } : col;
    });

    // Optional: sort before setting state
    updatedColumns.sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0));
    setCustomizeColumns(updatedColumns);
  };




  const handleRefreshColumns = () => {
    setCustomizeColumns(editedHeaderData);
  }

  const canMoveColumnUp = () => {
    const selectedId = modalSelectedColumns[0];

    const sortedColumns = [...customizeColumns].sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0));
    const currentIndex = sortedColumns.findIndex((col) => col.Id === selectedId);
    if (currentIndex <= 0) return false;

    // Look for previous visible column
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!sortedColumns[i].IsHidden) return true;
    }

    return false;
  };

  const canMoveColumnDown = () => {
    const selectedId = modalSelectedColumns[0];

    const sortedColumns = [...customizeColumns].sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0));
    const currentIndex = sortedColumns.findIndex((col) => col.Id === selectedId);
    if (currentIndex === -1 || currentIndex >= sortedColumns.length - 1) return false;

    // Look for next visible column
    for (let i = currentIndex + 1; i < sortedColumns.length; i++) {
      if (!sortedColumns[i].IsHidden) return true;
    }

    return false;
  };

  useEffect(() => {
    if (updateGridSettingsStatus && 'message' in updateGridSettingsStatus) {
      toast.success(String(updateGridSettingsStatus?.message));
      dispatch(clearUpdateGridSettings());
      const payloadGrid = {
        UserId: currentUserId,
        TabId: selectedTabId
      }
      dispatch(getGridCommonHeaderData(payloadGrid));
    }
  }, [updateGridSettingsStatus])


  const handleUpdateColumnSetting = () => {
    // to save the updated customizeColumns 
    const payload = {
      TabId: selectedTabId,
      Columns: customizeColumns.map(col => ({
        Id: col.Id,
        ColumnOrder: col.ColumnOrder,
        ColumnName: col.ColumnName,
        IsHidden: col.IsHidden
      }))
    };
    dispatch(updateGridSettings(payload));
    setShowColumnVisiblePopUp(false);
  };
  // ================ Customize Column End's ===========================

  return (

    <div className="main-card-container"
      style={{ width: "100%", height: "100%", float: "none" }}>

      <AddEditModalNew
        show={showActionPopup.Add || showActionPopup.Edit}
        mode={showActionPopup.Add ? "Add" : "Edit"}
        headerColumns={editedHeaderData}
        inputValues={inputValues}
        handleInputChange={handleInputChange}
        handleClose={showActionPopup.Add ? handleActionAddButtonClose : handleActionEditButtonClose}
        handleSubmit={showActionPopup.Add ? handleAddSubmit : handleEditSubmit}
        settings={headerSetting}
        commonDropdownArray={commonDropdownArray}
      />

      <FilterSearchModal
        show={showActionPopup.Filter}
        mode={"Filter Records"}
        headerColumns={editedHeaderData}
        inputValues={inputValues}
        handleInputChange={handleInputChange}
        handleClose={handleActionFilterButtonClose}
        handleSubmit={handleFilterSubmit}
        settings={headerSetting}
        commonDropdownArray={commonDropdownArray}
      />



      <DeleteModal
        show={showActionPopup.Delete}
        handleClose={handleActionDeleteButtonClose}
        handleDelete={handleDelete}
        selectedRows={selectedRows}
        settings={headerSetting}
      />


      <Modal
        show={showColumnVisiblePopUp}
        onHide={() => {
          setShowColumnVisiblePopUp(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <div style={{ fontWeight: "500", fontSize: "18px" }}>
            Customize Columns
          </div>
        </Modal.Header>
        <Modal.Body >
          <div className='hide-columns-modal-container'>
            <div className='hide-columns-container'>
              <h6>Available Column</h6>
              <div className="hide-column-list-container">
                {customizeColumns?.filter((data: any) => data.IsHidden).length === 0 ? (
                  <div className='hidden-column-single-container'
                    style={{ background: "#dddddd" }}
                  >
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
                  customizeColumns?.filter((data: any) => data.IsHidden).sort((a, b) => a.ColumnOrder - b.ColumnOrder).map((data: any, index: number) => {
                    const isChecked = modalAllColumns.includes(data.Id);
                    return (
                      <div key={index} className='hidden-column-single-container'
                        style={{ background: `${data.IsHidden ? "" : ""}` }}>
                        <div className='checkbox-name-box'>
                          <input
                            type="checkbox"
                            id={`checkbox-${index}`}
                            checked={isChecked}
                            onChange={(e) => handleVisibleColumnsCheckboxChange(data.Id, e.target.checked)}
                            disabled={!data.IsHidden}
                          />
                          <label htmlFor={`checkbox-${index}`}
                            style={{
                              marginLeft: 5,
                              cursor: "pointer",
                            }} >
                            {data.ColumnName}
                          </label>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className='hide-columns-btn-container' >
              <CustomTooltip tooltipText="Hide All" placement="top">
                <BsButton className="common-btn" text={<ArrowLeftToLine size={16} strokeWidth={3} />}
                  action={() => handleAllColumnsHidden()} disabled={false} />
              </CustomTooltip>

              <CustomTooltip tooltipText="Selected Hide" placement="top">
                <BsButton className="common-btn " text={<ArrowLeft size={16} strokeWidth={3} />}
                  action={() => handleHiddenSelectedColumns()} disabled={false} />
              </CustomTooltip>

              <CustomTooltip tooltipText="Selected UnHide" placement="top">
                <BsButton className="common-btn" text={<ArrowRight size={16} strokeWidth={3} />}
                  action={() => handleVisibleSelectedColumns()} disabled={false} />
              </CustomTooltip>

              <CustomTooltip tooltipText="Unhide All" placement="top">
                <BsButton className="common-btn" text={<ArrowRightToLine size={16} strokeWidth={3} />}
                  action={() => handleAllColumnsVisible()} disabled={false} />
              </CustomTooltip>
            </div>

            <div className='hide-columns-container' >
              <h6>Selected Column</h6>

              <div className="hide-column-list-container">
                {customizeColumns?.filter((data: any) => !data.IsHidden).length === 0 ? (
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
                  customizeColumns?.filter((data: any) => !data.IsHidden)?.sort((a, b) => a.ColumnOrder - b.ColumnOrder).map((data: any, index: number, array: any[]) => {
                    const isChecked = modalSelectedColumns.includes(data.Id);
                    return (
                      <div key={data.Id} className='hidden-column-single-container'>
                        <div className='checkbox-name-box'>
                          <input
                            type="checkbox"
                            id={`checkbox-visible-${data.Id}`}
                            checked={isChecked}
                            onChange={(e) => handleHiddenColumnsCheckboxChange(data.Id, e.target.checked)}
                          />
                          <label htmlFor={`checkbox-visible-${data.Id}`} style={{ marginLeft: 5, cursor: "pointer" }}>
                            {data.ColumnName}
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
                <CustomTooltip tooltipText="Move Up" placement="top">
                  <BsButton
                    className={`common-btn ${modalSelectedColumns.length > 1 || !canMoveColumnUp() ? "disabled" : ""}`}
                    text={<ArrowUp size={16} strokeWidth={3} />}
                    action={() => handleMoveColumnUp()}
                    disabled={modalSelectedColumns.length > 1 || !canMoveColumnUp()}
                  />
                </CustomTooltip>

                <CustomTooltip tooltipText="Move Down" placement="top">
                  <BsButton
                    className={`common-btn ${modalSelectedColumns.length > 1 || !canMoveColumnDown() ? "disabled" : ""}`}
                    text={<ArrowDown size={16} strokeWidth={3} />}
                    action={() => handleMoveColumnDown()}
                    disabled={modalSelectedColumns.length > 1 || !canMoveColumnDown()}
                  />
                </CustomTooltip>
              </div>

              <div className='hide-columns-btn-sort-container' >
                <CustomTooltip tooltipText="Reset" placement="top">
                  <BsButton
                    className="common-btn"
                    text={<RotateCw size={16} strokeWidth={3} />}
                    action={() => handleRefreshColumns()}
                    disabled={false}
                  />
                </CustomTooltip>

                <CustomTooltip tooltipText="Save" placement="top">
                  <BsButton
                    className="common-btn"
                    text={<FiSave size={16} strokeWidth={3} />}
                    action={() => handleUpdateColumnSetting()}
                    disabled={false}
                  />
                </CustomTooltip>
              </div>
            </div>

          </div>
        </Modal.Body>
      </Modal>



      <div className="grid-main-container" >
        <div className="grid-header-container">

          <div className="actions-container">
            {headerSetting?.isGlobalSearchVisible && (
              <div className="search-box" style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="searchBoxInput"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="clear-button"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    <b>×</b>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>

        <div className='table-pagination-container' ref={filterDropdownRef}>

          <div className="grid-table-container">
            <table cellPadding="5" className="custom-grid" style={{ borderCollapse: 'collapse' }}>
              <thead className="custom-grid-header" key={key}>
                <tr>
                  <th className="sticky-column"
                    style={{
                      background: headerSetting?.Background || "#099be0",
                      position: 'sticky', left: 0, zIndex: 103, borderRight: "1px solid #ccc",
                      height: "25px", minWidth: "28px", display: "flex", justifyContent: "center"
                    }}>
                    <input type="checkbox" checked={isSelectAllChecked} onChange={handleSelectAllChange} />
                  </th>


                  {visibleColumns.filter((col: any) => !col.IsHidden).sort((a, b) => a.ColumnOrder - b.ColumnOrder).map((col: any, idx: number, arr: any[]) => (
                    <th
                      key={col.ColumnName || col.Id}
                      className={`th-tab sticky-columns ${col.IsFreeze ? 'sticky-column' : ''}`}
                      title={col.ColumnName}
                      style={{
                        textAlign: "center",
                        minWidth: `${col.Length}px`,
                        padding: "0px 5px 0px 10px",

                        fontSize: '13px',
                        fontFamily: 'Arial, sans-serif',
                        color: headerSetting?.Color || '#fff',
                        background: headerSetting?.Background || '#099be0',
                        zIndex: col.IsFreeze ? 110 : 1,
                        whiteSpace: 'nowrap',
                        top: '-2px',
                        height: "25px",
                       
                        // Make last header take all remaining space
                        // ...(idx === arr.length - 1 ? { width: "100%" } : '')
                      }}
                    >

                      <span style={{ paddingRight: '5px' }}
                      // style={{ position: 'absolute' }}
                      >
                        {t(`GRID_HEADERS.${col.ColumnName_StrCode}`)}
                      </span>

                      <div style={{ display: "block", float: "right" }}>
                        <button className="btnsort1"
                          style={{
                            border: `1px solid #099be0`,
                            background: headerSetting?.Background || '#099be0',
                            color: headerSetting?.Color || '#fff'
                          }}
                          onClick={() => handleSortClick(col.ColumnName)}>
                          <BiSortAlt2 style={{ margin: "0", marginTop: "-5px" }} />
                        </button>

                        <button className="btnfilter1"
                          style={{
                            border: `1px solid #099be0`,
                            background: headerSetting?.Background || '#099be0',
                            color: headerSetting?.Color || '#fff'
                          }}
                          onClick={() => handleFilterClick(col.ColumnName)}>
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
                                      {renderFilterOptions(col.DbDateType)}
                                    </select>
                                  </div>
                                  {renderFilterInput(col.DbDateType, col.ColumnName)}
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



              <tbody className="custom-grid-body" key={key}>
                {paginatedData.map((row, rowIndex) => (
                  <tr key={row.Id || rowIndex} className={rowIndex % 2 === 0 ? "stripedRow" : "table-row"}>
                    <td className="sticky-column"
                      style={{
                        position: 'sticky', left: 0, zIndex: 103, borderRight: "1px solid #ccc",
                        height: "25px", minWidth: "28px", display: "flex", justifyContent: "center"
                      }}>
                      <input
                        type="checkbox"
                        id={`input-${row.ColumnName}`}
                        checked={selectedRows.includes(row.Id)}
                        onChange={() => handleSingleCheckboxChange(row.Id)}
                      />
                    </td>
                    {visibleColumns.filter((col: any) => !col.IsHidden).sort((a, b) => a.ColumnOrder - b.ColumnOrder).map((col: any, idx: number, arr: any[]) => (
                      <td
                        key={col.Id}
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
                          background: col.IsFreeze ? headerSetting?.FreezeBackground || "whitesmoke" : "transparent",
                          zIndex: col.IsFreeze ? 100 : 1,

                          // Make last header take all remaining space
                          // ...(idx === arr.length - 1 ? { width: "100%" } : '')

                        }}
                        onDoubleClick={() => col.IsEnabled && handleDoubleClick(row.Id, col.ColumnHeader)}
                      >
                        <span>
                          {col.ColumnName === "EmployeeName" ? (
                            <a onClick={() => handleHyperLinkName(row.Id)} className="grid-hyperlink-name">
                              {row[col.ColumnName]}
                            </a>
                          ) : col.ComponentType === "Checkbox" ? (
                            <input type="checkbox" checked={row[col.ColumnName]} disabled={!row.IsEnabled} />
                          ) : col.CustomPopover ? (
                            <CustomPopover name={row[col.ColumnHeader]} email={row[col.Email]} rowId={row.Id} />
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
            <div className="grid-footer-records-container">
              <span>Records : {selectedRows.length}&#47;{sortedData.length}</span>
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
                <button className='pagination-btn' disabled={currentPage === 1} onClick={() => handlePageChange(1, "First")}>
                  <BiFirstPage />
                </button>
                <button className='pagination-btn' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1, "Previous")}>
                  <TiArrowLeftThick />
                </button>

                <span className='pagination-btn-text' > {currentPage} - {totalPages}</span>

                <button className='pagination-btn' disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1, "Next")}>
                  <TiArrowRightThick />
                </button>
                <button className='pagination-btn' disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages, "Last")}>
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

export default PageGrid;