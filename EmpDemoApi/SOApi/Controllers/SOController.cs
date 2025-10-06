using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SOApi.Interfaces;
using SOApi.Models;
using SOApi.Util;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;



namespace SoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SOController : ControllerBase
    {
        private readonly ISORepository _repository;
        private readonly KeyGenerator keyGenerator;
        private readonly Decryptor decryptor = new Decryptor();
        private readonly IConfiguration _configuration;
        private readonly string _secretKey;
        private readonly EmployeeDataRequest employeeDataRequest;

        public SOController(ISORepository repository, IConfiguration configuration)
        {
            _repository = repository;
            keyGenerator = new KeyGenerator();
            _configuration = configuration;
            _secretKey = _configuration["LoginSecret:SecretKey"];

        }

        // ======================
        // AUTHENTICATION
        // ======================
        [HttpPost("LoginUser")]
        public async Task<IActionResult> LoginEncrypted([FromBody] EncryptedLoginModel data)
        {
            if (string.IsNullOrEmpty(data.LoginToken))
            {
                return BadRequest(new BaseResponse<string>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Login token is missing.",
                    ErrorCode = 500,
                    Data = null
                });
            }

            try
            {
                var decryptToken = decryptor.DecryptAES(data.LoginToken, _secretKey);
                if (decryptToken == null || !decryptToken.Contains(","))
                {
                    return BadRequest(new BaseResponse<string>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Invalid login token format.",
                        ErrorCode = 400,
                        Data = null
                    });
                }

                var loginData = decryptToken.Split(",");
                if (loginData.Length != 2)
                {
                    return BadRequest(new BaseResponse<string>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Invalid login token content.",
                        ErrorCode = 400,
                        Data = null
                    });
                }

                var loginRequest = new LoginRequest
                {
                    Username = loginData[0],
                    Password = loginData[1]
                };

                var user = await _repository.LoginUserAsync(loginRequest);
                if (user == null)
                {
                    return Unauthorized(new BaseResponse<string>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Invalid username or password.",
                        ErrorCode = 401,
                        Data = null
                    });
                }

                //Generate JWT Token
                var token = GenerateShortJwtToken(user.Username);

                //Generate Refresh Token
                var refreshToken = GenerateRefreshToken();

                // Store refreshToken with UserID and expiry
                //await _repository.SaveRefreshToken(user.UserID, refreshToken, DateTime.UtcNow.AddDays(7)); // Example

                int refreshMinutes = Convert.ToInt32(_configuration["JwtSettings:DurationInMinutes"]);
                await _repository.SaveRefreshToken(user.UserID, refreshToken, DateTime.UtcNow.AddMinutes(refreshMinutes).ToLocalTime());


                var _loginResponse = new LoginResponse
                {
                    UserID = user.UserID,
                    SelectedModuleID = 1,
                    ModuleIdList = "1,2,3,4",
                    SelectedLanguageId = 1,
                    Token = token,
                    RefreshToken = refreshToken
                };

                return Ok(new BaseResponse<LoginResponse>
                {
                    IsSuccessful = true,
                    ErrorMessage = null,
                    ErrorCode = null,
                    Data = _loginResponse
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new BaseResponse<string>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Server error during login: " + ex.Message,
                    ErrorCode = 500,
                    Data = null
                });
            }
        }


        // ======================
        // GENERATE TOKEN METHOD
        // ======================

        private string GenerateShortJwtToken(string username)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, username)
    };

            //  Read expiry time from config
            var durationMinutes = Convert.ToInt32(jwtSettings["DurationInMinutes"]);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(durationMinutes),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        // ======================
        // GENERATE REFRESH TOKEN 
        // ======================
        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var principal = GetPrincipalFromExpiredToken(request.AccessToken);
            if (principal == null)
                return BadRequest("Invalid access token.");

            var username = principal.Identity?.Name;

            // Validate stored refresh token for this user
            var savedToken = await _repository.GetSavedRefreshToken(username);
            if (savedToken != request.RefreshToken)
                return Unauthorized("Invalid refresh token.");

            // (Optional) Check refresh token expiry

            var newAccessToken = GenerateShortJwtToken(username);
            var newRefreshToken = GenerateRefreshToken();

            await _repository.SaveRefreshTokenByUsername(username, newRefreshToken, DateTime.UtcNow.AddDays(7));

            return Ok(new
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
                return Convert.ToBase64String(randomBytes);
            }
        }



        // ======================
        // Claims Principal
        // ======================

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false, // Ignore expiration
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = key
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
                if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }


        // ======================
        // NAVIGATION & UI COMPONENTS
        // ======================

        //[Authorize]
        [Authorize]
        [HttpPost("GetTabs")]
        public async Task<IActionResult> GetTabs([FromBody] TabRequest tabRequest)
        {
            var result = await _repository.GetTabsAsync(tabRequest);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("GetMenuForTab")]
        public async Task<IActionResult> GetMenuForTab([FromBody] MenuTabRequest menutabrequest)
        {
            var result = await _repository.GetMenuForTabAsync(menutabrequest);
            return Ok(result);
        }

        // ======================
        // EMPLOYEE DATA
        // ======================
        //[Authorize]
        [Authorize]
        [HttpPost("GetEmployeeData")]
        public async Task<IActionResult> GetEmployeeData([FromBody] EmployeeDataRequest employeeDataRequest)
        {
            if (employeeDataRequest == null)
                return BadRequest("Request cannot be null.");

            // Fallback defaults
            employeeDataRequest.PageSize = employeeDataRequest.PageSize > 0 ? employeeDataRequest.PageSize : 20;
            employeeDataRequest.PageNo = employeeDataRequest.PageNo > 0 ? employeeDataRequest.PageNo : 1;

            var result = await _repository.GetEmployeeDataAsync(employeeDataRequest);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("GetDetailPageData")]
        public async Task<IActionResult> GetDetailPageData([FromBody] DetailPageDataRequest detailPageDataRequest)
        {
            var result = await _repository.GetDetailPageDataAsync(detailPageDataRequest);
            if (result == null || result.Employee == null)
                return NotFound();
            return Ok(result);
        }
        [Authorize]
        [HttpPost("AddEmployee")]
        public async Task<IActionResult> AddEmployee([FromBody] Employee employeeData)
        {
            var result = await _repository.AddEmployeeAsync(employeeData);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("UpdateEmployee")]
        public async Task<IActionResult> UpdateEmployee([FromBody] Employee employeeData)
        {
            if (employeeData == null || employeeData.Id <= 0)
                return BadRequest("Invalid employee data.");

            var result = await _repository.UpdateEmployeeAsync(employeeData);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("DeleteEmployee")]
        public async Task<IActionResult> DeleteEmployee([FromBody] DeleteEmployeeRequest request)
        {
            var result = await _repository.DeleteEmployeeAsync(request);
            return Ok(result);
        }

        // ======================
        // ADDRESS DATA
        // ======================
        [Authorize]
        [HttpPost("AddAddress")]
        public async Task<IActionResult> AddAddress([FromBody] Address address)
        {
            var result = await _repository.AddAddressAsync(address);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("UpdateAddress")]
        public async Task<IActionResult> UpdateAddress([FromBody] Address address)
        {
            if (address == null || address.Id <= 0)
                return BadRequest("Invalid employee data.");

            var result = await _repository.UpdateAddressAsync(address);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("DeleteAddress")]
        public async Task<IActionResult> DeleteAddress([FromBody] AddressDeleteReq addressDeleteReq)
        {
            var result = await _repository.DeleteAddressAsync(addressDeleteReq);
            return Ok(result);
        }

        // ======================
        // MASTER DATA
        // ======================
        [Authorize]
        [HttpPost("ManageDropdownItems")]
        public async Task<IActionResult> ManageDropdownItems([FromBody] DropdownItemRequest request)
        {
            if (request == null || request.DropdownId <= 0)
                return BadRequest("Invalid input.");

            var result = await _repository.ManageDropdownItemsAsync(request);

            //string dropdownName = "Department";
            string dropdownName = result.FirstOrDefault()?.DropdownName ?? "Unknown";

            var response = new DropdownItemsResponse
            {
                DropdownName = dropdownName,
                Data = result
            };

            return Ok(response);
        }

        // ======================
        // GRID SCHEMA & COLUMNS
        // ======================
        [Authorize]
        [HttpPost("GetMasterDropdownData")]
        public async Task<IActionResult> GetMasterDropdownData([FromBody] DRequest? request)
        {
            var result = await _repository.GetMasterDropdownDataAsync(request);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("GetDetailStructure")]
        public async Task<IActionResult> GetDetailStructure([FromBody] MasterDropdownRequest masterDropdownRequest)
        {
            var result = await _repository.GetDetailStructureAsync(masterDropdownRequest);

            return Ok(new
            {
                SectionList = result.SectionList
                
            });
        }
        [Authorize]
        [HttpPost("UpdateGridSettings")]
        public async Task<IActionResult> UpdateGridSettings([FromBody] SettingGridRequest request)
        {
            var columnsJson = JsonConvert.SerializeObject(request.Columns);
            var parameters = new DynamicParameters();
            parameters.Add("@TabId", request.TabId);
            parameters.Add("@ColumnsJson", columnsJson);
            await _repository.UpdateGridSettingsAsync(parameters);
            return Ok(new { message = "Settings updated successfully." });
        }
        [Authorize]
        [HttpPost("GetColumnHeaderSchema")]
        public async Task<IActionResult> GetColumnHeaderSchema([FromBody] ColumnHeaderSchemaRequest columnHeaderSchemaRequest)
        {
            var result = await _repository.GetColumnHeaderSchemaAsync(columnHeaderSchemaRequest);
            return Ok(result);
        }
        [HttpGet("NetworkCheck")]
        public IActionResult NetworkCheck()
        {
            return Ok(new { message = "Network working successfully", status = true });
        }

    }
}