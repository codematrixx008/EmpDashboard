import CryptoJS from "crypto-js";

export function encryptAES(plainText: string, base64Key: string): string {
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // Base64 encoded
}


export const tableCellFormatDate = (dateValue: string, dateFormat: string) => {
    let [year, month, day] = dateValue.split("-").map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return dateValue;
  
    const paddedDay = String(day).padStart(2, "0");
    const paddedMonth = String(month).padStart(2, "0");
  
    switch (dateFormat) {
      case "DD-MM-YYYY":
        return `${paddedDay}-${paddedMonth}-${year}`;
      case "DD/MM/YYYY":
        return `${paddedDay}/${paddedMonth}/${year}`;
      case "MM-DD-YYYY":
        return `${paddedMonth}-${paddedDay}-${year}`;
      case "MM/DD/YYYY":
        return `${paddedMonth}/${paddedDay}/${year}`;
      case "YYYY/MM/DD":
        return `${year}/${paddedMonth}/${paddedDay}`;
      default:
        return dateValue;
    }
  };

  