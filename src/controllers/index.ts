import { googleSheets } from '../lib';

async function getSpreadsheetData(url: string, sheetName: string) {
  const auth = await googleSheets.getAuth();
  const sheetId = googleSheets.getSpreadsheetId(url);
  const spreadsheet = await googleSheets.getSpreadsheet(auth, sheetId, sheetName);
  const data = await googleSheets.getSpreadsheetValues(auth, sheetId, spreadsheet);
  return data;
}

export default {
  getSpreadsheetData,
};
