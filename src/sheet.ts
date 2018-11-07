import { google, sheets_v4 } from "googleapis";
import CONFIG from "../CONFIG";
import { AxiosResponse } from "axios";
import _ from "lodash";

type SheetType = sheets_v4.Schema$ValueRange;

const sheets = google.sheets("v4");

export function getSheet(sheetid?: string, page?: string): Promise<string[][]> {
  const destination = {
    auth: CONFIG.sheets.auth,
    range: (page || "") + "!A1:ZZ",
    spreadsheetId: sheetid || CONFIG.sheets.sheetId
  };
  return new Promise((res, rej) => {
    setTimeout(() => rej("timeout"), 10000);
    sheets.spreadsheets.values.get(destination, function(
      error: Error | null,
      response: AxiosResponse<SheetType> | null | undefined
    ) {
      if (error) return rej(error);
      if (response) return res(response.data.values);
      return rej("no result");
    });
  });
}

export async function getSheetJson(sheetid?: string, page?: string) {
  return getSheet(...arguments).then((values: string[][]) => {
    if (!values) throw "Sheet is empty.";
    return values.slice(1).map(row => {
      return _.zipObject(values[0], row);
    });
  });
}
