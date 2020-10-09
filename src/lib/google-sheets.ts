import { google } from 'googleapis';

const sheets = google.sheets('v4');

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return authClient;
}

function getSpreadsheetId(url:string) {
  const idRegex = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(idRegex);

  if (match) {
    return match[1];
  }
  throw new ApiError(
    'Failed to extract Google Sheet Id from url',
    400,
  );
}

async function getSpreadsheet(auth: any, spreadsheetId: string, sheetName: string) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  const spreadsheet = response.data.sheets?.find(({ properties }) => (
    properties?.title === sheetName
  ));
  if (!spreadsheet) {
    throw new ApiError(
      `${sheetName} spreadsheet does not exist in this document`,
      400,
    );
  }
  return spreadsheet;
}

async function getSpreadsheetValues(auth: any, spreadsheetId:string, spreadsheet: any) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: spreadsheet.properties.title,
  });
  const data = [];
  if (response.data.values) {
    const { values } = response.data;
    const headers = values[0];

    for (let i = 1, len = values.length; i < len; i += 1) {
      const row = values[i].reduce((acc, curr, index) => ({ ...acc, [headers[index]]: curr }), {});
      data.push(row);
    }
  }
  return data;
}

export default {
  getAuth,
  getSpreadsheetId,
  getSpreadsheet,
  getSpreadsheetValues,
};
