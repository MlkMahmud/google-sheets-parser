import { google } from 'googleapis';

const sheets = google.sheets('v4');

async function getAuthCredentials() {
  const googleAuth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authCredentials = await googleAuth.getClient();
  return authCredentials;
}

function getSpreadsheetId(url:string) {
  const idRegex = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(idRegex);

  if (match) {
    return match[1];
  }
  throw new Error('Failed to extract Google Sheet Id from url');
}

async function getSpreadsheets(spreadsheetId:string, auth) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res.data.sheets;
}

function getSpreadsheetValues(spreadsheetId: string, spreadsheets: [], auth) {
  return Promise.all(spreadsheets.map((sheet) => (
    sheets.spreadsheets.values.get({
      spreadsheetId,
      auth,
      range: sheet.properties.title,
    })
  )));
}

function getSpreadsheetName(range: string) {
  const sheetTitleRegex = /['a-zA-Z0-9\s]+(?=!A1)/;
  const match = range.match(sheetTitleRegex);

  if (match) {
    return match[0];
  }
  console.log(range);
  throw new Error('Failed to get spreadsheet title');
}

export default {
  getAuthCredentials,
  getSpreadsheetId,
  getSpreadsheets,
  getSpreadsheetName,
  getSpreadsheetValues,
};
