/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DataRow } from './data-row';

// declare class Parser {
//   public static data(text: string): Parser;
//   public from(text: string): Parser;
//   public to(text: string): Parser;
//   public build(): string;
//   public iterate(): Array<string>;
// }

// 徳島市の令和4年度家庭ごみ収集日程表HP
const TOKUSHIMA_URL =
  'http://www.city.tokushima.tokushima.jp/smph/kurashi/recycle/gomi/R5gomischedule.html';

// 対象年度
const YEAR = 2023;

/**
 * ごみ収集日程の配列を生成します。
 */
export function makeGomiDateList_(
  areaId: string,
  burnableDays: Array<Number>
): Array<DataRow> {
  const html = UrlFetchApp.fetch(TOKUSHIMA_URL).getContentText('UTF-8');

  //Parserライブラリを使ってスクレイピング
  const tablesHtml: string = Parser.data(html)
    .from(`<div id="${areaId}" class="h3bg">`)
    .to('</table>')
    .build();
  const bodys: Array<string> = Parser.data(tablesHtml)
    .from('<tr>')
    .to('</tr>')
    .iterate();

  // 燃えるゴミ日は、毎週決まった曜日なので
  // まずは、燃えるゴミ日の配列を作っておく。
  // 燃えるゴミ日の配列に他のゴミの日も追加する。
  const rows: Array<DataRow> = createBurnableRows_(burnableDays);
  for (const bodyhtml of bodys) {
    const values: Array<string> = Parser.data(bodyhtml)
      .from('<td class="left">')
      .to('</td>')
      .iterate();
    let index = 0;
    let title = '';
    for (const value of values) {
      const value2 = value.replace('<p>', '').replace('</p>', '');
      // 1列目は分別区分
      if (index === 0) {
        title = value2;
        index += 1;
        continue;
      }
      // 2列目以降は、月別+分別区分ごとの収集日
      if (value2.includes(',')) {
        // 「6,20」のように1セルに2日分のデータが入力されているケース
        const dates = value2.split(',');
        for (const date of dates) {
          rows.push(createRow_(index, title, Number(date)));
        }
      } else {
        // 「6」のように1セルに1日分のデータが入力されているケース
        rows.push(createRow_(index, title, Number(value2)));
      }
      index += 1;
    }
  }
  return rows;
}

/**
 * ゴミの日1行のデータを作成する
 */
function createRow_(index: number, title: string, date: number) {
  let year = YEAR;
  let month = 0;
  if (index >= 10) {
    // 来年の場合
    month = index - 9;
    year += 1;
  } else {
    // 今年の場合
    month = index + 3;
  }
  // monthは1ヶ月前を指定するのに注意。例えば、3月ならmonth = 2とする。
  const startTime = new Date(year, month - 1, date, 8, 0);
  const endTime = new Date(startTime.getTime());
  endTime.setMinutes(endTime.getMinutes() + 30);
  const row: DataRow = {
    title: title,
    startTime: startTime,
    endTime: endTime,
  };
  return row;
}

/**
 * Googleカレンダーにイベント(ゴミの日)を作成します。
 * @param {String} calendarId GoogleカレンダーID
 * @param {Object[][]} rows [][title,startTime,endTime]
 */
export function createEvents_(calendarId: string, rows: Array<DataRow>) {
  const calendar = CalendarApp.getCalendarById(calendarId);
  const start = new Date(YEAR, 3, 4, 8, 0);
  const end = new Date(YEAR + 1, 2, 31, 8, 0);
  const allEvents = calendar.getEvents(start, end);

  // 不要なイベントが登録されている可能性があるため
  // 全てのイベントを消しておく。
  for (const event of allEvents) {
    event.deleteEvent();
    Utilities.sleep(500);
  }

  // Googleカレンダーにイベントを登録する。
  for (const row of rows) {
    calendar.createEvent(row.title, row.startTime, row.endTime);
    Utilities.sleep(500);
  }
}

/**
 * 燃やせるゴミイベントの配列を生成します。
 */
function createBurnableRows_(burnableDays: Array<Number>): Array<DataRow> {
  const title = '燃やせるごみ';
  const rows: Array<DataRow> = [];

  // 来年の4月1日までイベントを作成する
  const end = new Date(YEAR + 1, 3, 0, 0, 0);
  for (
    let start = new Date(YEAR, 3, 1, 8, 0);
    start < end;
    start.setDate(start.getDate() + 1)
  ) {
    if (burnableDays.includes(start.getDay())) {
      // 燃えるゴミ曜日だった場合
      const endTime = new Date(start.getTime());
      endTime.setMinutes(endTime.getMinutes() + 30);
      // Calendar.createEvent(title, startTime, endTime)
      // を意識して配列に格納する。
      const row: DataRow = {
        title: title,
        startTime: new Date(start.getTime()),
        endTime: endTime,
      };
      rows.push(row);
    }
  }
  return rows;
}
