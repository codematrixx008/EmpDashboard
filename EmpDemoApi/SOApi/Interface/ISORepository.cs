using Azure.Core;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using SOApi.Models;
using static SOApi.Models.ColumnHeaderWithDropdown;

namespace SOApi.Interfaces
{
    public interface ISORepository
    {
        // ======================
        // AUTHENTICATION
        // ======================

        Task<UserModel> LoginUserAsync(LoginRequest request);

        // ======================
        // REFRESH TOKEN 
        // ======================
        Task SaveRefreshToken(int userId, string token, DateTime expiry);
        Task<string> GetSavedRefreshToken(string username);
        Task SaveRefreshTokenByUsername(string username, string token, DateTime expiry);


        // ======================
        // USER MANAGEMENT
        // ======================

        Task<BaseResponse<TabResponse>> GetTabsAsync([FromBody] TabRequest tabRequest);
        Task<BaseResponse<MenuTabResponse>> GetMenuForTabAsync(MenuTabRequest menutabrequest);

        // ======================
        // DATA MANAGEMENT
        // ======================

        Task<GridConfigurationWrapper> GetColumnHeaderSchemaAsync(ColumnHeaderSchemaRequest columnHeaderSchemaRequest);
        Task UpdateGridSettingsAsync(DynamicParameters parameters);

        // ======================
        // EMPLOYEE DATA
        // ======================

        Task<object> GetEmployeeDataAsync(EmployeeDataRequest employeeDataRequest);
        Task<EmployeeDataResponse> GetDetailPageDataAsync([FromBody] DetailPageDataRequest detailPageDataRequest);
        Task<object> AddEmployeeAsync(Employee data);
        Task<object> UpdateEmployeeAsync(Employee data);
        Task<object> DeleteEmployeeAsync([FromBody] DeleteEmployeeRequest request);

        // ======================
        // EMPLOYEE DATA
        // ======================
        Task<object> AddAddressAsync(Address data);
        Task<object> UpdateAddressAsync(Address data);
        Task<object> DeleteAddressAsync(AddressDeleteReq addressDeleteReq);

        // ======================
        // MASTER DATA
        // ======================

        Task<List<DropdownItems>> ManageDropdownItemsAsync(DropdownItemRequest request);
        Task<object> GetMasterDropdownDataAsync([FromBody] DRequest? request);
        Task<SectionListResponse> GetDetailStructureAsync(MasterDropdownRequest request);
    }
}