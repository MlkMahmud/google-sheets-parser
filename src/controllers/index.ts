// /* eslint-disable no-underscore-dangle */
// import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

// const clientEmail = process.env.CLIENT_EMAIL || '';
// const privateKey = process.env.PRIVATE_KEY || '';

// function getSheetId(url:string): string {
//   const idRegex = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
//   const match = url.match(idRegex);

//   if (match) {
//     return match[1];
//   }
//   throw new Error('Failed to extract Google Sheet Id from url');
// }

// async function getspreadSheets(url: string, exclude: string[]) {
//   const id = getSheetId(url);
//   const document = new GoogleSpreadsheet(id);
//   await document.useServiceAccountAuth({
//     client_email: clientEmail,
//     private_key: privateKey,
//   });

//   await document.loadInfo();
//   const spreadsheets = document.sheetsByIndex;
//   const excludedSheets = exclude.reduce((object, key) => ({ ...object, [key]: 1 }), {});
//   return spreadsheets.filter(({ title }) => {
//     if (title in excludedSheets) {
//       return false;
//     }
//     return true;
//   });
// }

// async function getRowData(sheets: GoogleSpreadsheetWorksheet[]) {
//   return Promise.all(sheets.map(async (sheet) => {
//     console.log(sheet.title);
//     return sheet.getRows({ limit: 2 });
//   }));
// }

// async function parseSpreadsheets(sheets: GoogleSpreadsheetWorksheet[]) {
//   // const data: {[key: string]: any} = {};
//   // for (let i = 0, len = sheets.length; i < len; i += 1) {
//   //   const sheet = sheets[i];
//   //   data[sheet.title] = [];
//   //   // eslint-disable-next-line no-await-in-loop
//   //   const rows = await sheet.getRows();
//   //   rows.forEach((row) => {
//   //     const rowData: {[key: string]: string} = {};
//   //     sheet.headerValues.forEach((value) => {
//   //       rowData[value] = row[value];
//   //     });
//   //     data[sheet.title].push(rowData);
//   //   });
//   // }
//   // return data;
//   const [rows] = await getRowData(sheets);
//   const data: {[key:string]: Array<any>} = {};
//   rows.forEach((row) => {
//     const rowData: {[key:string]: any} = {};
//     row._sheet.headerValues.forEach((value: string) => {
//       rowData[value] = row[value];
//     });
//     if (row._sheet.title in data) {
//       data[row._sheet.title].push(rowData);
//     } else {
//       data[row._sheet.title] = [];
//       data[row._sheet.title].push(rowData);
//     }
//   });
//   return data;
// }

// export default {
//   getspreadSheets,
//   parseSpreadsheets,
// };
import { googleSheets } from '../services';

async function getSpreadsheetData(url: string, exclude: []) {
  const auth = await googleSheets.getAuthCredentials();
  const sheetId = googleSheets.getSpreadsheetId(url);
  const spreadsheets = await googleSheets.getSpreadsheets(sheetId, auth);
  const excludedSheets = exclude.reduce((object, key) => ({ ...object, [key]: 1 }), {});
  const selectedSheets = spreadsheets?.filter(({ properties }) => {
    if (properties.title in excludedSheets) {
      return false;
    } return true;
  });
  const spreadsheetValues = await googleSheets.getSpreadsheetValues(
    sheetId,
    selectedSheets,
    auth,
  );
  return spreadsheetValues;
}

function parseSpreadsheetData(spreadsheets) {
  const data: {[key: string]: any} = {};

  spreadsheets.forEach((spreadsheet) => {
    const { range, values } = spreadsheet.data;
    const sheetName = googleSheets.getSpreadsheetName(range);
    data[sheetName] = [];

    if (values) {
      for (let i = 1; i < values.length; i += 1) {
        const rowData = {};
        for (let j = 0; j < values[i].length; j += 1) {
          const header = values[0][j];
          rowData[header] = values[i][j];
        }
        data[sheetName].push(rowData);
      }
    }
  });
  return data;
}

export default {
  getSpreadsheetData,
  parseSpreadsheetData,
};
