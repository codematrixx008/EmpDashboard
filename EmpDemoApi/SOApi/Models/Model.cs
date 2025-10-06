using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Text.Json.Serialization;

namespace SOApi.Models
{
    // ======================
    // 1. Base Response Models
    // ======================
    public class BaseResponse<T>
    {
        public bool IsSuccessful { get; set; }
        public string ErrorMessage { get; set; }
        public int? ErrorCode { get; set; }
        public T Data { get; set; }
    }

    // ======================
    // 2. Authentication Models
    // ======================

    public class UserModel
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public int[] RoleIds { get; set; }
        public string[] RoleNames { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class LoginResponse
    {
        public int UserID { get; set; }
        public int SelectedModuleID { get; set; }
        public string ModuleIdList { get; set; }
        public int SelectedLanguageId { get; set; }
        public string Token { get; set; }               
        public string RefreshToken { get; set; }        
    }
    public class EncryptedLoginModel
    {
        public string LoginToken { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }


    // ======================
    // 3. Tab/Menu Models
    // ======================
    public class TabRequest
    {
        public int UserId { get; set; }
        public int ModuleId { get; set; }
    }
    public class TabListItem
    {
        public int ParentTabID { get; set; }
        public string ChildTabIDList { get; set; }
    }
    public class ParentTab
    {
        public int Id { get; set; }
        public string Label { get; set; }
    }
    public class AppTabsMaster
    {
        public int TabID { get; set; }
        public string CreatedBY { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
        public int ParentTabID { get; set; }
        public string TabName { get; set; }
        public int IsRootTab { get; set; }
        public string? ButtonActionID { get; set; }
        public bool IsEnabled { get; set; }
    }
    public class TabResponse
    {
        public List<TabListItem> TabList { get; set; }
        public int SelectedTabID { get; set; }
        public string DisabledTabIDList { get; set; }
        public int? RecordID { get; set; }
    }
    public class MenuTabRequest
    {
        public int UserId { get; set; }
        public int SelectedTabId { get; set; }
    }
    public class MenuTabResponse
    {
        public string MenuList { get; set; }  // Format: "1-0,2-1,..."
    }

    // ======================
    // 4. User/Role & Button Models
    // ======================
    public class UserRole
    {
        public int Id { get; set; }
        public string UserRoleName { get; set; }
    }
    public class ButtonAction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string TabId { get; set; }
        public int OrderNo { get; set; }
        public string VisibleTabs { get; set; }
        public string EnabledTabs { get; set; }
    }
    public class ButtonActions
    {
        public string Action { get; set; }
        public bool IsEnabled { get; set; }
        public string Action_StrCode { get; set; }
    }

    // ======================
    // 5. Employee Models
    // ======================
    public class Employee
    {
        public int? Id { get; set; }
        public string? EmployeeName { get; set; }
        public decimal? Salary { get; set; }
        public DateTime? DOB { get; set; }
        public int? GenderId { get; set; }
        public string? Gender { get; set; }
        public int? DepartmentId { get; set; }
        public string? Department { get; set; }
        public bool? IsActive { get; set; }
        //public int? AddressId { get; set; }
        //public int? BusinessInformationId { get; set; }
        public string? Company { get; set; }
        public string? Occupation { get; set; }
        public string? JobTitle { get; set; }
    }
    public class EmployeeDataRequest
    {
        public EmployeeReqData? EmployeeData { get; set; }
        public int PageSize { get; set; }
        public int PageNo { get; set; }
        public string? BtnFunction { get; set; }
    }
    public class EmployeeReqData
    {
        //public int? Id { get; set; }
        public string? EmployeeName { get; set; }
        public int? SalaryFrom { get; set; }
        public int? SalaryTo { get; set; }
        public int? Salary { get; set; }
        public string? SalaryFilterCondition { get; set; }
        public DateTime? DOB { get; set; }
        public DateTime? DOBFrom { get; set; }
        public DateTime? DOBTo { get; set; }
        public string? GenderIds { get; set; }
        public string? DepartmentIds { get; set; }
        public bool? IsActive { get; set; }
        //public int? AddressId { get; set; }
    }
    public class DeleteEmployeeRequest
    {
        public string Ids { get; set; }
    }
    public class EmployeeDataResponse
    {
        public Employee Employee { get; set; }
        public List<Address> AddressList { get; set; }
        public List<BusinessInformation> BusinessInfoList { get; set; }
    }
    public class Address
    {
        public int Id { get; set; }
        public int? EmployeeId { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int Pincode { get; set; }
        public string Country { get; set; }
    }
    public class AddressDeleteReq
    {
        public string Ids { get; set; }
        public int EmployeeId { get; set; }


    }
    public class BusinessInformation
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Occupation { get; set; }
        public string JobTitle { get; set; }
    }

    // ======================
    // 6. Department/Gender Dropdowns
    // ======================

    public class DropdownDepartment
    {
        [Key]
        public int Id { get; set; }
        public string Label { get; set; }
    }
    public class DropdownGenders
    {
        [Key]
        public int Id { get; set; }
        public string Label { get; set; }
    }

    // ======================
    // 7. Grid Configuration Models
    // ======================
    public class AppGridColumnMaster
    {
        [JsonIgnore]
        public int ColumnId { get; set; }

        [JsonPropertyName("Id")]
        public int Id
        {
            get => ColumnId;
            set => ColumnId = value;
        }

        public int SelectedChildTab { get; set; }
        [JsonIgnore] public string MainHeader { get; set; }
        [JsonIgnore] public string SectionHeader { get; set; }

        public int GridId { get; set; }
        public string ColumnName { get; set; }
        public string ColumnHeader { get; set; }
        public int Width { get; set; }
        public string DataType { get; set; }
        public bool IsVisible { get; set; }
        public bool IsFormVisible { get; set; }
        public bool IsFormEditable { get; set; }
        public bool IsEditable { get; set; }
        public bool IsFreeze { get; set; }
        public bool Sorting { get; set; }
        public bool Filtering { get; set; }
        public int ColumnOrder { get; set; }
        public string Alignment { get; set; }
        public bool ContactPopUp { get; set; }
        public string FieldType { get; set; }
        public string Type { get; set; }
        public string Placeholder { get; set; }
        public bool Required { get; set; }
        public bool IsEnabled { get; set; }
        public int SectioGridHeadingId { get; set; }
        public int SectionId { get; set; }
        public bool IsPageGrid { get; set; }
        public bool ShowDropdownPopup { get; set; }
        public bool IsDetailForm { get; set; }
    }
    public class GridColumnModel
    {
        public int Id { get; set; }
        public string ColumnName { get; set; }
        public string ColumnName_StrCode { get; set; }
        public string DbDateType { get; set; }
        public string ComponentType { get; set; }
        public bool IsRequired { get; set; }
        public int Length { get; set; }
        public string Placeholder { get; set; }
        public int? DropdownId { get; set; }
        public bool IsHidden { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsForSectionGrid { get; set; }
        public bool IsForSearch { get; set; }
        public string TabIds { get; set; }
        public bool AllowMultiSelectSearch { get; set; }
        public int ColumnOrder { get; set; }

    }
    public class SettingColumnModel
    {
        public int Id { get; set; }
        public int ColumnOrder { get; set; }
        public string ColumnName { get; set; }
        public bool IsHidden{ get; set; }
    }
    public class SettingGridRequest
    {
        public int TabId { get; set; }
        public List<SettingColumnModel> Columns { get; set; }
    }
    public class ConfigurationModel
    {
        public int Id { get; set; }
        public string DateFormat { get; set; }
        public string Currency { get; set; }
        public List<ButtonActions> ButtonActionList { get; set; }
    }
    public class GridConfigurationWrapper
    {
        public ConfigurationModel Configuration { get; set; }
        public List<GridColumnModel> Columns { get; set; }
    }
    public class AppGridColumnGroup
    {
        public string MainHeader { get; set; }
        public string SectionHeader { get; set; }
        public int SectionId { get; set; }
        public List<AppGridColumnMaster> Columns { get; set; }
    }

    // ======================
    // 8. Form/Table/View Models
    // ======================
    public class UIColumn
    {
        public int Id { get; set; }
        public string ColumnName { get; set; }
        public string ColumnName_StrCode { get; set; }
        public string DbDataType { get; set; }
        public string ComponentType { get; set; }
        //public string Type { get; set; }
        public bool IsRequired { get; set; }
        public int Length { get; set; }
        public string Placeholder { get; set; }
        public int DropdownId { get; set; }
        public bool IsHidden { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsForSectionGrid { get; set; }
        public bool IsForSearch { get; set; }
        public bool IsEditablePopup { get; set; }
        public string TabIds { get; set; }
        public bool AllowMultiSelectSearch { get; set; }
    }
    public class UIColumnRaw : UIColumn
    {
        public string TableName { get; set; }
        public string TableHeader { get; set; }
    }

    // ======================
    // 9. Dropdown Related Models
    // ======================
    public class DropdownItem
    {
        public int Id { get; set; }
        public string Label { get; set; }
    }
    public class DropdownRaw
    {
        public string ColumnName { get; set; }
        public int Id { get; set; }
        public string Label { get; set; }
    }
    public class DropdownItems
    {
        public int DropdownId { get; set; }
        public int DropdownItemId { get; set; }
        public string DropdownName { get; set; }
        public string ItemName { get; set; }
        public bool IsHidden { get; set; }
    }
    public class DropdownItemsResponse
    {
        public string DropdownName { get; set; } = string.Empty;
        public List<DropdownItems> Data { get; set; } = new();
    }
    public class DropdownItemResult
    {
        public string ColumnName { get; set; } = string.Empty;
        public int Id { get; set; }
        public string Label { get; set; } = string.Empty;
    }
    public class DropdownItemRequest
    {
        public int DropdownId { get; set; }
        public int? SelectedItemId { get; set; }
        public string? Action { get; set; }
        public string? ItemName { get; set; }
    }
    public class DRequest
    {
        public int TabId { get; set; }
    }

    // ======================
    // 10. Section UI Models
    // ======================
    public class ColumnHeaderWithDropdown
    {
        public ConfigurationModel Configuration { get; set; }
        public List<AppGridColumnGroup> SectionDetailForm { get; set; }
        public List<AppGridColumnGroup> SectionGrid { get; set; }
        public List<DropdownGenders> Gender { get; set; }
        public List<DropdownDepartment> Department { get; set; }

        public class UISection
        {
            public string SectionType { get; set; }
            public string SectionName { get; set; }
            public string SectionHeader { get; set; }
            public bool IsReadOnly { get; set; }

            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public ConfigurationModel SectionGridConfiguration { get; set; }
            public List<UIColumn> UIColumnList { get; set; }
        }

        public class SectionListResponse
        {
            public List<UISection> SectionList { get; set; }
        }
    }
    public class MasterDropdownRequest
    {
        public string? TabIds { get; set; }
        public int? UserId { get; set; }
    }

    // ======================
    // 11. Schema/Header Models
    // ======================
    public class ColumnHeaderSchemaRequest
    {
        public int TabId { get; set; }
        public int UserId { get; set; }
    }

    public class DetailPageDataRequest
    {
        public int RowId { get; set; }
    }
}
