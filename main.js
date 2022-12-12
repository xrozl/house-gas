
/* グローバル変数 */
const workbook_main = SpreadsheetApp.getActive();
const sheet_main = workbook_main.getSheetByName("通知用マスタ");
const sheet_db = workbook_main.getSheetByName("DBマスタ")
const token_line = sheet_db.getRange(2, 2).getValue();
const url_line_api = 'https://notify-api.line.me/api/notify';
/* ---- */

// ゴミ出し通知
function garbage_alert() {
  // 行設定 曜日ー概要
  const offset_row = "2";
  const offset_column = "B";

  // 曜日取得
  const date = new Date();
  const week = date.getDay()+1;
  if (week >= 6) { week = 0; }

  // 概要取得
  let details = '';
  let range = sheet_main.getRange(offset_column + (Number(offset_row) + Number(week)));
  details = range.getValue();

  // メッセージ生成
  let nextday = new Date();
  nextday.setDate(nextday.getDate() + 1);
  const format = Utilities.formatDate(nextday, 'JST', 'yyyy年M月d日(明日)');
  let msg = '\n' + format + 'のゴミ出しは\n';
  if (details === '') { msg += '「特にありません」'; }
  else { msg += '「' + details + '」です。'; }

  // options生成
  const options = {
    "method"  : "post",
    "payload" : {"message": msg},
    "headers" : {"Authorization":"Bearer " + token_line}
  };

  // post
  UrlFetchApp.fetch(url_line_api, options);

}
