using Microsoft.EntityFrameworkCore;

namespace SOApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        //public DbSet<SearchDropDownData> SearchDropDownData { get; set; }
        //public DbSet<PageGridSetting> PageGridSettings { get; set; }
        //public DbSet<ParentTab> ParentTabs { get; set; }
        //public DbSet<MenuItem> MenuItems { get; set; }
        //public DbSet<Button> ButtonsList { get; set; }
        //public DbSet<PageGridColumn> PageGridColumns { get; set; }
        //public DbSet<Employee> EmployeeData { get; set; }
        //public DbSet<Login> Login { get; set; }
        //public DbSet<UserRole> UserRole { get; set; }
    }
}
