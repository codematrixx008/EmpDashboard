using System.Text;

namespace SOApi.Util
{
    public class Decryptor
    {
        public string DecryptAES(string encryptedText, string secretKey)
        {
            try
            {
                var encryptedBytes = Convert.FromBase64String(encryptedText);

                using (var aesAlg = System.Security.Cryptography.Aes.Create())
                {
                    aesAlg.Key = Convert.FromBase64String(secretKey);
                    aesAlg.IV = new byte[16]; // Must match IV on frontend


                    using (var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                    {
                        // Decrypt the data
                        var decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
                        return Encoding.UTF8.GetString(decryptedBytes);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("AES decryption failed: " + ex.Message);
            }
        }
    }
}
