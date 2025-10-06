using Dapper;
using SOApi.Interfaces;
using SOApi.Models;
using System.Data;
using Microsoft.Data.SqlClient;
using SOApi.Util;
using Microsoft.AspNetCore.Mvc;
using static SOApi.Models.ColumnHeaderWithDropdown;
using Newtonsoft.Json;

namespace SOApi.Repositories
{
    public class SORepository : ISORepository
    {
        private readonly string _connectionString;
        DbLogger dblogger;
        
    public SORepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        protected IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        //==================================================================================================================
        // 1. AUTHENTICATION & AUTHORIZATION
        //==================================================================================================================

        public async Task<UserModel> LoginUserAsync(LoginRequest request)
        {
            using var connection = CreateConnection();

            var loginQuery = "SELECT Id, Username, RoleId FROM tblLogin WHERE Username = @Username AND Password = @Password";
            var login = await connection.QueryFirstOrDefaultAsync(loginQuery, request);

            if (login == null) return null;

            string roleIdStr = Convert.ToString(login.RoleId);
            var roleIds = roleIdStr.Split(',').Select(int.Parse).ToArray();

            var roleQuery = "SELECT Id, UserRoleName FROM tblUserRole WHERE Id IN @Ids";
            var roles = await connection.QueryAsync<UserRole>(roleQuery, new { Ids = roleIds });

            return new UserModel
            {
                UserID = login.Id,
                Username = login.Username,
                RoleIds = roleIds,
                RoleNames = roles.Select(r => r.UserRoleName).ToArray()
            };
        }


        //==================================================================================================================
        // 2. REFRESH TOKEN 
        //==================================================================================================================

        public async Task SaveRefreshToken(int userId, string token, DateTime expiry)
        {
            using var connection = CreateConnection();
            var sql = @"
            DELETE FROM UserRefreshTokens WHERE UserId = @UserId;
            INSERT INTO UserRefreshTokens (UserId, Username, RefreshToken, ExpiryDate)
            VALUES (@UserId, (SELECT Username FROM tblLogin WHERE Id  = @UserId), @Token, @ExpiryDate);";

            await connection.ExecuteAsync(sql, new
            {
                UserId = userId,
                Token = token,
                ExpiryDate = expiry
            });
        }

        public async Task<string?> GetSavedRefreshToken(string username)
        {
            using var connection = CreateConnection();
            var sql = @"SELECT RefreshToken FROM UserRefreshTokens WHERE Username = @Username";
            return await connection.QueryFirstOrDefaultAsync<string?>(sql, new { Username = username });
        }

        public async Task SaveRefreshTokenByUsername(string username, string token, DateTime expiry)
        {
            using var connection = CreateConnection();
            var sql = @"
            DELETE FROM UserRefreshTokens WHERE Username = @Username;
            INSERT INTO UserRefreshTokens (UserId, Username, RefreshToken, ExpiryDate)
            VALUES (
                (SELECT TOP 1 Id FROM tblLogin WHERE Username = @Username),
                @Username,
                @Token,
                @ExpiryDate);";

            await connection.ExecuteAsync(sql, new
            {
                Username = username,
                Token = token,
                ExpiryDate = expiry
            });
        }

        //==================================================================================================================
        // 2. TAB MANAGEMENT
        //==================================================================================================================

        public async Task<BaseResponse<TabResponse>> GetTabsAsync([FromBody] TabRequest tabRequest)
        {
            try
            {
                using var connection = CreateConnection();
                using var multi = await connection.QueryMultipleAsync(
                    "Sp_GetUserModuleTabHierarchy",
                    new { UserId = tabRequest.UserId, ModuleId = tabRequest.ModuleId },
                    commandType: CommandType.StoredProcedure);

                var selectedTabId = await multi.ReadFirstOrDefaultAsync<int>();
                var parentTabs = (await multi.ReadAsync<ParentTab>()).ToList();
                var flatChildTabs = (await multi.ReadAsync<ChildTabFlat>()).ToList();

                var tabList = parentTabs
                    .Select(parent => new TabListItem
                    {
                        ParentTabID = parent.Id,
                        ChildTabIDList = string.Join(",",
                            flatChildTabs
                                .Where(child => child.ParentId == parent.Id)
                                .Select(child => child.Id.ToString()))
                    }).ToList();

                string disabledTabIds = string.Join(",",
                    flatChildTabs
                        .Where(c => c.Id == 0)
                        .Select(c => c.Id.ToString()));

                var response = new TabResponse
                {
                    TabList = tabList,
                    SelectedTabID = selectedTabId,
                    DisabledTabIDList = disabledTabIds,
                    RecordID = null
                };

                return new BaseResponse<TabResponse>
                {
                    IsSuccessful = true,
                    ErrorMessage = null,
                    ErrorCode = null,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<TabResponse>
                {
                    IsSuccessful = false,
                    ErrorMessage = $"Error loading user tabs:",
                    ErrorCode = 500,
                    Data = null
                };
            }
        }
        public async Task<BaseResponse<MenuTabResponse>> GetMenuForTabAsync(MenuTabRequest menutabrequest)
        {
            try
            {
                using var connection = CreateConnection();
                var parameters = new
                {
                    UserId = menutabrequest.UserId,
                    SelectedTabId = menutabrequest.SelectedTabId
                };

                using var multi = await connection.QueryMultipleAsync(
                    "Sp_GetMenuForTab",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                var parent = await multi.ReadFirstOrDefaultAsync<AppTabsMaster>();
                var childTabs = await multi.ReadAsync<AppTabsMaster>();
                var allButtonActions = (await multi.ReadAsync<ButtonAction>()).ToList();

                string menuList = string.Empty;

                if (!string.IsNullOrEmpty(parent?.ButtonActionID))
                {
                    var buttonIds = parent.ButtonActionID.Split(',', StringSplitOptions.RemoveEmptyEntries);

                    var result = buttonIds.Select(buttonId =>
                    {
                        var action = allButtonActions.FirstOrDefault(a => a.Id.ToString() == buttonId);

                        if (action != null)
                        {
                            var visibleTabs = action.VisibleTabs?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? [];
                            bool isVisible = visibleTabs.Contains(menutabrequest.SelectedTabId.ToString());

                            if (!isVisible) return null;

                            var enabledTabs = action.EnabledTabs?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? [];
                            bool isEnabled = enabledTabs.Contains(menutabrequest.SelectedTabId.ToString());

                            return $"{buttonId}-{(isEnabled ? 1 : 0)}";
                        }
                        return null;
                    })
                    .Where(x => x != null);

                    menuList = string.Join(",", result);
                }

                var response = new MenuTabResponse
                {
                    MenuList = menuList
                };

                return new BaseResponse<MenuTabResponse>
                {
                    IsSuccessful = true,
                    ErrorMessage = null,
                    ErrorCode = null,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse<MenuTabResponse>
                {
                    IsSuccessful = false,
                    ErrorMessage = $"Error loading user tabs:",
                    ErrorCode = 500,
                    Data = null
                };
            }
        }
                
        //==================================================================================================================
        // 3. GRID COLUMNS & SCHEMA
        //==================================================================================================================
        
        public async Task<GridConfigurationWrapper> GetColumnHeaderSchemaAsync(ColumnHeaderSchemaRequest columnHeaderSchemaRequest)
        {
            using var connection = CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@TabId", columnHeaderSchemaRequest.TabId);
            parameters.Add("@UserId", columnHeaderSchemaRequest.UserId);

            var columns = (await connection.QueryAsync<GridColumnModel>(
                "Sp_GetEmployeeHeader",
                parameters,
                commandType: CommandType.StoredProcedure
            )).ToList();

            var config = await connection.QueryFirstOrDefaultAsync<ConfigurationModel>(
                @"SELECT Id, DateFormat, Color, Background, Currency FROM tblGridConfiguration Where ConfigurationType='PageGrid'"
            );

            return new GridConfigurationWrapper
            {
                Configuration = config,
                Columns = columns
            };
        }

        //==================================================================================================================
        // 4. EMPLOYEE DATA MANAGEMENT
        //==================================================================================================================
        public async Task<object> GetEmployeeDataAsync(EmployeeDataRequest employeeDataRequest)
        {
            using var connnection = CreateConnection();
            var procedureName = "Sp_ManageEmployeeData";
            var empData = employeeDataRequest.EmployeeData;

            var parameters = new
            {
                Action = "GetEmployeeData",
                EmployeeName = string.IsNullOrWhiteSpace(empData?.EmployeeName) ? null : empData.EmployeeName,
                SalaryFrom = empData?.SalaryFrom,
                SalaryTo = empData?.SalaryTo,
                Salary = empData?.Salary,
                SalaryFilterCondition = string.IsNullOrWhiteSpace(empData?.SalaryFilterCondition) ? null : empData.SalaryFilterCondition,
                DOB = empData?.DOB,
                DOBFrom = empData?.DOBFrom,
                DOBTo = empData?.DOBTo,
                GenderIds = string.IsNullOrWhiteSpace(empData?.GenderIds) ? null : empData.GenderIds,
                DepartmentIds = string.IsNullOrWhiteSpace(empData?.DepartmentIds) ? null : empData.DepartmentIds,
                IsActive = empData?.IsActive,
                PageSize = employeeDataRequest.PageSize,
                PageNo = employeeDataRequest.PageNo,
                BtnFunction = string.IsNullOrWhiteSpace(employeeDataRequest.BtnFunction) ? null : employeeDataRequest.BtnFunction
            };

            using var multi = await connnection.QueryMultipleAsync(
                procedureName, parameters, commandType: CommandType.StoredProcedure);

            var employeeList = (await multi.ReadAsync<Employee>()).ToList();
            var pagination = await multi.ReadFirstOrDefaultAsync();

            return new
            {
                Data = employeeList,
                Pagination = pagination
            };
        }
        public async Task<EmployeeDataResponse> GetDetailPageDataAsync([FromBody] DetailPageDataRequest detailPageDataRequest)
        {
            using var connection = CreateConnection();
            var procedure = "Sp_GetDetailSectionFormDataById";
            var parameters = new { Id = detailPageDataRequest.RowId };

            using var multi = await connection.QueryMultipleAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

            var employee = await multi.ReadFirstOrDefaultAsync<Employee>();
            var addresses = (await multi.ReadAsync<Address>()).ToList();
            var businessInformation = (await multi.ReadAsync<BusinessInformation>()).ToList();

            return new EmployeeDataResponse
            {
                Employee = employee,
                AddressList = addresses,
                BusinessInfoList = businessInformation
            };
        }
        public async Task<object> AddEmployeeAsync(Employee data)
        {
            using var connection = CreateConnection();
            var procedureName = "Sp_ManageEmployeeData";
            var parameters = new
            {
                Action = "AddEmployeeData",
                EmployeeName = data.EmployeeName,
                Salary = data.Salary,
                DOB = data.DOB,
                GenderId = data.Gender,
                DepartmentId = data.Department,
                IsActive = data.IsActive
            };

            var roles = await connection.QueryAsync<Employee>(procedureName, parameters, commandType: CommandType.StoredProcedure);

            return new { message = "Data Added Successfully." };
        }
        public async Task<object> UpdateEmployeeAsync(Employee data)
        {
            using var connection = CreateConnection();
            const string procedureName = "Sp_ManageEmployeeData";

            var parameters = new
            {
                Action = "UpdateEmployeeData",
                Id=data.Id,
                EmployeeName = data.EmployeeName,
                Salary = data.Salary,
                DOB = data.DOB,
                GenderId = data.GenderId,
                DepartmentId = data.DepartmentId,
                IsActive = data.IsActive,
                Company=data.Company,
                Occupation=data.Occupation,
                JobTitle=data.JobTitle
            };

            // Optional logging
            

            var affectedRows = await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);

            return new
            {
                Message = "Employee updated successfully.",
                AffectedRows = affectedRows
            };
        }
        public async Task<object> DeleteEmployeeAsync([FromBody] DeleteEmployeeRequest request)
        {
            using var connection = CreateConnection();
            var procedureName = "Sp_ManageEmployeeData";
            var parameters = new
            {
                Action = "DeleteEmployeeData",
                UserId = 1,
                UserIds = request.Ids
            };

            var affectedRows = await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);

            return new { message = "Data Deleted Successfully." };
        }

        //==================================================================================================================
        // 5. ADDRESS MANAGEMENT
        //==================================================================================================================

        public async Task<object> AddAddressAsync(Address data)
        {
            using var connection = CreateConnection();
            var procedureName = "Sp_ManageAddress";
            var parameters = new
            {
                Action = "Add",
                EmployeeId = data.EmployeeId,
                City = data.City,
                Pincode = data.Pincode,
                Line1 = data.Line1,
                Line2 = data.Line2,
                State = data.State,
                Country = data.Country,
                IsActive = 1
            };

            var roles = await connection.QueryAsync<UserRole>(procedureName, parameters, commandType: CommandType.StoredProcedure);

            return new { message = "Data Added Successfully." };
        }
        public async Task<object> UpdateAddressAsync(Address data)
        {
            using var connection = CreateConnection();
            const string procedureName = "Sp_ManageAddress";

            var parameters = new
            {
                Action = "Update",
                Id=data.Id,
                EmployeeId = data.EmployeeId,
                City = data.City,
                Pincode = data.Pincode,
                Line1 = data.Line1,
                Line2 = data.Line2,
                State = data.State,
                Country = data.Country,
                IsActive = 1
            };

            var affectedRows = await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);

            return new
            {
                message = "Address updated successfully.",
                AffectedRows = affectedRows
            };
        }
        public async Task<object> DeleteAddressAsync(AddressDeleteReq addressDeleteReq)
        {
            using var connection = CreateConnection();
            var procedureName = "Sp_ManageAddress";
            var parameters = new
            {
                Action = "Delete",
                Ids = addressDeleteReq.Ids,
                EmployeeId= addressDeleteReq.EmployeeId
            };

            var affectedRows = await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);

            return new { message = "Data Deleted Successfully." };
        }

        //==================================================================================================================
        // 6. DEPARTMENT MANAGEMENT
        //==================================================================================================================
        public async Task<List<DropdownItems>> ManageDropdownItemsAsync(DropdownItemRequest request)
        {
            using var connection = CreateConnection();
            var parameters = new DynamicParameters();

            parameters.Add("@DropdownId", request.DropdownId, DbType.Int32);
            parameters.Add("@SelectedItemId", request.SelectedItemId, DbType.Int32);
            parameters.Add("@Action", request.Action, DbType.String);
            parameters.Add("@IsHidden", dbType: DbType.Boolean, direction: ParameterDirection.Input, value: DBNull.Value);
            parameters.Add("@ItemName", request.ItemName, DbType.String);

            var result = await connection.QueryAsync<DropdownItems>(
                "Sp_ManageEditableDropdownList",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }
        
        //==================================================================================================================
        // 7. DROPDOWN MASTER DATA
        //==================================================================================================================
        
        public async Task<object> GetMasterDropdownDataAsync([FromBody] DRequest? request)

        {
            using var connection = CreateConnection();
            var procedureName = "Sp_GetDropdownListByTabId"; // Use your actual SP name
            var parameters = new { TabId = request.TabId };

            var result = await connection.QueryAsync<DropdownItemResult>(
                procedureName,
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var groupedResult = result
                .GroupBy(r => r.ColumnName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(item => new { item.Id, item.Label }).ToList()
                );

            return new
            {
                MasterDropdownData = groupedResult
            };
        }

        //==================================================================================================================
        // 8. DETAIL STRUCTURE DATA
        //==================================================================================================================

        public async Task<SectionListResponse> GetDetailStructureAsync(MasterDropdownRequest request)
        {
            using var connection = CreateConnection();

            using var multi = await connection.QueryMultipleAsync(
                "Sp_GetDetailStructure",
                new { TabId = request.TabIds },
                commandType: CommandType.StoredProcedure
            );

            var detailFields = (await multi.ReadAsync<UIColumnRaw>()).ToList();
            var gridFields = (await multi.ReadAsync<UIColumnRaw>()).ToList();

            var allFields = detailFields.Concat(gridFields).ToList();

            // Fetch all button actions for SectionGrid where ViewId = 3
            var configRows = (await connection.QueryAsync(
                @"SELECT tgc.Id, tgc.DateFormat, tgc.Currency, tgba.Action, tgba.IsEnabled,tgba.Action_StrCode
                  FROM tblGridConfiguration tgc
                  LEFT JOIN tblGridButtonActions tgba ON tgba.ConfigurationId = tgc.Id
                  WHERE tgc.ConfigurationType = 'SectionGrid' AND tgc.ViewId = 3")).ToList();

            ConfigurationModel config = null;

            if (configRows.Any())
            {
                var firstRow = configRows.First();

                config = new ConfigurationModel
                {
                    Id = firstRow.Id,
                    DateFormat = firstRow.DateFormat,
                    Currency = firstRow.Currency,
                    ButtonActionList = configRows
                        .Where(r => r.Action != null)
                        .Select(r => new ButtonActions
                        {
                            Action = r.Action,
                            IsEnabled = r.IsEnabled,
                            Action_StrCode = r.Action_StrCode
                        })
                        .ToList()
                };
            }

            // Group fields into sections
            var sectionList = allFields
                .GroupBy(x => new { x.TableName, x.IsForSectionGrid, x.TableHeader })
                .Select(g =>
                {
                    var isGrid = g.Key.IsForSectionGrid;

                    return new UISection
                    {
                        SectionType = isGrid ? "Grid" : "Detail",
                        SectionName = g.Key.TableName,
                        SectionHeader = g.Key.TableHeader,
                        IsReadOnly = !g.Any(x => x.IsEnabled),
                        SectionGridConfiguration = isGrid ? config : null,
                        UIColumnList = g.Select(i => new UIColumn
                        {
                            Id = i.Id,
                            ColumnName = i.ColumnName,
                            ColumnName_StrCode = i.ColumnName_StrCode,
                            DbDataType = i.DbDataType,
                            ComponentType = i.ComponentType,
                            IsRequired = i.IsRequired,
                            Length = i.Length,
                            Placeholder = i.Placeholder,
                            DropdownId = i.DropdownId,
                            IsHidden = i.IsHidden,
                            IsEnabled = i.IsEnabled,
                            IsForSectionGrid = i.IsForSectionGrid,
                            IsForSearch = i.IsForSearch,
                            IsEditablePopup = i.IsEditablePopup,
                            TabIds = i.TabIds,
                            AllowMultiSelectSearch = i.AllowMultiSelectSearch
                        }).ToList()
                    };
                }).ToList();

            return new SectionListResponse
            {
                SectionList = sectionList,
            };
        }

        //==================================================================================================================
        // 9. MISC METHODS
        //==================================================================================================================

        public async Task UpdateGridSettingsAsync(DynamicParameters parameters)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync("Usp_UpdateGridSettingsJson", parameters, commandType: CommandType.StoredProcedure);
        }
        private class ChildTabFlat
        {
            public int ParentId { get; set; }
            public int Id { get; set; }
            public string Label { get; set; }
        }
    }
}