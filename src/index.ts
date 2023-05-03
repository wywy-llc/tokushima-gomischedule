/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { createEvents_, makeGomiDateList_ } from './app/main';

/**
 * 徳島市_A地区_ごみ収集のGoogleカレンダーを作成します。
 */
function createAreaA() {
  const areaId = 'cmslabel09';
  const calendarId = 'c_ujckbk8236m8jh619spnofg260@group.calendar.google.com';
  //0：日、1：月、2：火、3：水、4：木、5：金、6：土
  const burnableDays = [1, 4];
  const rows = makeGomiDateList_(areaId, burnableDays);
  createEvents_(calendarId, rows);
}

/**
 * 徳島市_B地区_ごみ収集のGoogleカレンダーを作成します。
 */
function createAreaB() {
  const areaId = 'cmslabel10';
  const calendarId = 'c_ic0fevcqsjl0np28gb3kg58irk@group.calendar.google.com';
  const burnableDays = [1, 4];
  const rows = makeGomiDateList_(areaId, burnableDays);
  createEvents_(calendarId, rows);
}

/**
 * 徳島市_C地区_ごみ収集のGoogleカレンダーを作成します。
 */
function createAreaC() {
  const areaId = 'cmslabel11';
  const calendarId = 'c_f06oai5rmdf5d1m81kqqls36as@group.calendar.google.com';
  const burnableDays = [2, 5];
  const rows = makeGomiDateList_(areaId, burnableDays);
  createEvents_(calendarId, rows);
}

/**
 * 徳島市_D地区_ごみ収集のGoogleカレンダーを作成します。
 */
function createAreaD() {
  const areaId = 'cmslabel12';
  const calendarId = 'c_jpe09074trp7g26pd8gsa1m058@group.calendar.google.com';
  const burnableDays = [2, 5];
  const rows = makeGomiDateList_(areaId, burnableDays);
  createEvents_(calendarId, rows);
}
