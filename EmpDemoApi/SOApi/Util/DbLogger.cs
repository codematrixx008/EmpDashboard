using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;
using Dapper;

namespace SOApi.Util
{
    public class DbLogger
    {
        private readonly IDbConnection _connection;

        public DbLogger(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task LogExecutionAsync(string procedureName, string message, string querys)
        {
            var query = @"INSERT INTO tblExecutionLogs (ProcedureName, Message, Query,ExecutedAt) VALUES (@ProcedureName, @Message, @Query,@ExecutedAt)";

            await _connection.ExecuteAsync(query, new { ProcedureName = procedureName, Query = querys, Message = message, ExecutedAt = DateTime.Now.ToLocalTime() });
            
            Debug.WriteLine($"[LOG] Procedure: {procedureName}| Method : {querys} | Message: {message}");
        }
    }
}