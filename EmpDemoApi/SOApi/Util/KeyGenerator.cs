using System.Security.Cryptography;

namespace SOApi.Util
{
    public class KeyGenerator
    {
        public  string GenerateKey()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] key = new byte[32]; // 256 bits
                rng.GetBytes(key);
                return Convert.ToBase64String(key);
            }
        }
    }

}