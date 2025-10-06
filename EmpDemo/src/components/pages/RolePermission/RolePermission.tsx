import React, { useRef, useState, useEffect } from 'react';
import BsSelectPopup from '../../baseComponents/BsSelectPopup.tsx';
import type { AppDispatch, RootState } from '../../redux/store/store';
import { useDispatch, useSelector } from "react-redux";
import { clearPostRolePermissionsData, getRolePermissionById, getRolePermissionList, postRolePermissionsData } from '../../redux/reducer/roleSlice.ts';
import { deleteUserRoleById } from '../../redux/reducer/userRoleSlice.ts';
// import "./RolePermission.css";
import "../../assets/styles/RolePermission.css";
import { toast } from 'react-toastify';
import { getGridCommonHeaderData, setButtonStates } from '../../redux/reducer/combinedSlice.ts';

// ✅ Interfaces
interface RoleOption {
    Label: string;
    Id: string;
}

interface RolePermissionRow {
    Id: number;
    ModuleId: number;
    ModuleName: string;
    PermissionsData: number[];
    [key: string]: any;
}

interface RolePermissionHeader {
    Id: number;
    ColumnHeader: string;
    Type: "text" | "checkbox";
    IsFreeze: boolean;
    [key: string]: any;
}

interface TransformedPermission {
    ModuleId: number;
    Actions: string;
}



const RolePermission = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [roleOptionsList, setRoleOptionsList] = useState<RoleOption[]>([]);
    const [selectedRole, setSelectedRole] = useState("1");
    const [rolePermissionTableData, setRolePermissionTableData] = useState<RolePermissionRow[]>([]);
    const [rolePermissionHeaderData, setRolePermissionHeaderData] = useState<RolePermissionHeader[]>([]);
    const [permissions, setPermissions] = useState<{ [module: string]: number[] }>({});
    const [checkAll, setCheckAll] = useState(false);
    const [selectedModuleCheck, setSelectedModuleCheck] = useState<any[]>([]);
    const [headerColumns, setHeaderColumns] = useState<any[]>([]);

    const {
        currentUserId,
        selectedTabId,
        gridSchemaCommonHeaderData,
        buttonStatesObj,
        rolePermissionList,
        rolePermissionGridData,
        postRolePermissionsSuccData,
    } = useSelector((state: RootState) => ({
        currentUserId: state.combined.currentUserId,
        selectedTabId: state.combined.selectedTab,
        gridSchemaCommonHeaderData: state.combined.gridSchemaCommonHeaderData,
        buttonStatesObj: state.combined.buttonStates,
        rolePermissionList: state.role.rolePermissionList,
        rolePermissionGridData: state.role.rolePermissionGridData,
        postRolePermissionsSuccData: state.role.postRolePermissionsSuccData,
    }));


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
        if (
            gridSchemaCommonHeaderData &&
            Array.isArray(gridSchemaCommonHeaderData) &&
            gridSchemaCommonHeaderData.length > 0
        ) {
            setHeaderColumns(gridSchemaCommonHeaderData);
        }
    }, [gridSchemaCommonHeaderData])

    useEffect(() => {
        if (headerColumns && headerColumns) {
            const mappedData = headerColumns.filter(col => !col.Column.IsHidden).map(col => ({
                ...col.Column,
                UserGridSchemaId: col.UserGridSchemaId,
                ColumnId: col.ColumnId, // preserve the actual ColumnId from outer object
            }));
            setRolePermissionHeaderData(mappedData);
        }
    }, [headerColumns]);


    useEffect(() => {
        dispatch(getRolePermissionList());
        dispatch(getRolePermissionById("1"));
    }, []);

    useEffect(() => {
        if (rolePermissionList?.length > 0) {
            const options = rolePermissionList.map((item: any) => ({
                Label: item.UserRoleName,
                Id: String(item.Id),
            }));
            setRoleOptionsList(options);
        }
    }, [rolePermissionList]);



    useEffect(() => {
        if (rolePermissionGridData?.length > 0) {
            setRolePermissionTableData(rolePermissionGridData);
        }
    }, [rolePermissionGridData]);

    useEffect(() => {
        const initialPermissions: { [module: string]: number[] } = {};
        rolePermissionTableData.forEach((row) => {
            initialPermissions[row.ModuleName] = row.PermissionsData;
        });
        setPermissions(initialPermissions);
    }, [rolePermissionTableData]);

    useEffect(() => {
        if (postRolePermissionsSuccData && 'message' in postRolePermissionsSuccData) {
            toast.success(String(postRolePermissionsSuccData?.message));
            dispatch(clearPostRolePermissionsData());
            dispatch(getRolePermissionById(selectedRole));
        }
    }, [postRolePermissionsSuccData]);

    const handleSelectedRole = (newValue: string) => {
        setSelectedRole(newValue);
        dispatch(getRolePermissionById(newValue));
    };

    const handlePermissionChange = (module: string, ColumnHeader: string, value: boolean) => {
        const fieldIndex = rolePermissionHeaderData.findIndex((header) => header.ColumnHeader === ColumnHeader) - 1;
        if (fieldIndex < 0) return;

        setPermissions((prev) => {
            const totalFields = rolePermissionHeaderData.length - 1;
            const currentPermissions = prev[module] ?? Array(totalFields).fill(0);

            const updated = [...currentPermissions];
            updated[fieldIndex] = value ? 1 : 0;

            return { ...prev, [module]: updated };
        });
    };

    const handleRolePermissionSubmit = () => {
        const transformedPermissions: TransformedPermission[] = rolePermissionTableData
            .filter((row) => permissions[row.ModuleName])
            .map((row) => ({
                ModuleId: row.ModuleId,
                Actions: permissions[row.ModuleName].join('_')
            }));

        const payload = {
            RoleId: Number(selectedRole),
            Permissions: transformedPermissions
        };
        dispatch(postRolePermissionsData(payload));
    };

    const handleSinglePermissionToggle = (Id: any, isChecked: boolean) => {
        const totalFields = rolePermissionHeaderData.length - 1;

        setSelectedModuleCheck(prev =>
            isChecked ? [...prev, Id] : prev.filter(i => i !== Id)
        );

        const module = rolePermissionTableData.find(row => row.Id === Id);
        if (!module) return;

        setPermissions(prev => ({
            ...prev,
            [module.ModuleName]: Array(totalFields).fill(isChecked ? 1 : 0)
        }));
    };

    const handleAllPermissionToggle = (isChecked: boolean) => {
        setCheckAll(isChecked);

        const totalFields = rolePermissionHeaderData.length - 1;

        if (isChecked) {
            const allIds = rolePermissionTableData.map(row => row.Id);
            setSelectedModuleCheck(allIds);

            // Set all permissions for each module to [1, 1, ..., 1]
            const updatedPermissions: Record<string, number[]> = {};
            rolePermissionTableData.forEach(row => {
                updatedPermissions[row.ModuleName] = Array(totalFields).fill(1);
            });

            setPermissions(prev => ({
                ...prev,
                ...updatedPermissions
            }));
        } else {
            setSelectedModuleCheck([]);

            // Reset all permissions to [0, 0, ..., 0]
            const clearedPermissions: Record<string, number[]> = {};
            rolePermissionTableData.forEach(row => {
                clearedPermissions[row.ModuleName] = Array(totalFields).fill(0);
            });

            setPermissions(prev => ({
                ...prev,
                ...clearedPermissions
            }));
        }
    };


    useEffect(() => {
        const totalFields = rolePermissionHeaderData.length - 1;

        const fullyCheckedIds: number[] = [];
        let allChecked = true;

        for (const row of rolePermissionTableData) {
            const perms = permissions[row.ModuleName] || [];
            const isFull = perms.length === totalFields && perms.every(p => p === 1);

            if (isFull) {
                fullyCheckedIds.push(row.Id);
            } else {
                allChecked = false;
            }
        }

        setSelectedModuleCheck(fullyCheckedIds);
        setCheckAll(allChecked && fullyCheckedIds.length === rolePermissionTableData.length);
    }, [permissions, rolePermissionTableData, rolePermissionHeaderData]);


    const buttonActions: Record<string, () => void> = {
        Save: () => handleRolePermissionSubmit(),
        Cancel: () => console.log("Cancel"),
        BurgerMenu: () => console.log("BurgerMenu"),
    };

    useEffect(() => {
        Object.entries(buttonStatesObj).forEach(([key, value]) => {
            if (value && buttonActions[key]) {
                buttonActions[key]();
                dispatch(setButtonStates({ ...buttonStatesObj, [key]: false })); // Reset only the executed button
            }
        });
    }, [buttonStatesObj, dispatch]);

    return (
        <>
            <div className='ct-role-permission-select-container'>
                <div className='ct-role-permission-body-container'>
                    <h6 style={{ marginBottom: "0px" }}>Role : </h6>
                    <div style={{ width: "150px" }}>
                        <BsSelectPopup
                            options={roleOptionsList}
                            value={selectedRole}
                            onChange={handleSelectedRole}
                            name="role"
                            initialValue="Admin"
                            border=""
                            onDirty={(e) =>{}}
                        />
                    </div>
                </div>

                {/* <div>
                    <button className='ct-role-permission-button' onClick={handleRolePermissionSubmit}> Submit </button>
                </div> */}
            </div>

            {rolePermissionTableData?.length > 0 && (
                <div className='ct-role-permission-table-container'>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="ct-role-permission-grid" cellPadding={5}>
                            <thead className="ct-role-permission-grid-header">
                                <tr>
                                    <th className="ct-role-permission-header-cell">
                                        <input
                                            type="checkbox"
                                            checked={checkAll}
                                            onChange={(e) => handleAllPermissionToggle(e.target.checked)}
                                        />
                                    </th>
                                    {
                                        rolePermissionHeaderData && rolePermissionHeaderData.map((col, index) => (
                                            <th
                                                key={index}
                                                className={` ct-role-permission-header-cell ${col.Type == "text" ? 'ct-role-permission-header-name' : ''} 
                                                    ${col.IsFreeze ? 'ct-role-permission-sticky-column' : ''}`}
                                                style={{
                                                    left: col.IsFreeze ? `${col.id * 115}px` : undefined,
                                                    zIndex: col.IsFreeze ? 2 : 1
                                                }}
                                            >
                                                {col.ColumnHeader}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody className="ct-role-permission-grid-body">
                                {rolePermissionTableData.map((row: RolePermissionRow, index) => (
                                    <tr key={index} className={row.Id % 2 === 0 ? "ct-role-permission-striped-row" : "ct-role-permission-row"}>

                                        <th>
                                            <input
                                                className={` ct-role-permission-checkbox ct-role-permission-header-cell ct-role-permission-sticky-column`}
                                                type="checkbox"
                                                checked={selectedModuleCheck.includes(row.Id)}
                                                onChange={(e) => handleSinglePermissionToggle(row.Id, e.target.checked)}
                                            />
                                        </th>

                                        {rolePermissionHeaderData.map((col, index) => (
                                            <td key={index} className="ct-role-permission-data-cell">
                                                {col.Type === "text" ? (
                                                    <div className="ct-role-permission-text-cell">
                                                        {/* {row[col.ColumnHeader]} */}
                                                        {row[col.ColumnName]}
                                                    </div>
                                                ) : col.Type === "checkbox" ? (
                                                    <input
                                                        className="ct-role-permission-checkbox"
                                                        type="checkbox"
                                                        checked={
                                                            permissions?.[row.ModuleName]?.[
                                                            rolePermissionHeaderData.findIndex((h) => h.ColumnHeader === col.ColumnHeader) - 1
                                                            ] === 1
                                                        }
                                                        onChange={(e) =>
                                                            handlePermissionChange(row.ModuleName, col.ColumnHeader, e.target.checked)
                                                        }
                                                    />
                                                ) : null}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </>
    );
};

export default RolePermission;