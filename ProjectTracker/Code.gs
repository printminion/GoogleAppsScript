/**
 * Script for creating for better overview over Project Gantt Schedule By Ronald Dahrs
 * https://drive.google.com/previewtemplate?id=0AhiVMVNQW_vOdHNPbm10cW9ZTjBocFB4SDRPNXBVWlE&mode=public
 * Featured on http://googleappsdeveloper.blogspot.de/2012/12/managing-projects-with-gantt-charts.html
 *
 * - it creates dedicated spreadsheet with hidden tasks not relevant for the user
 * - subscribe/unsubscribe via ContentService UI
 * - Just set the CONF_SOURCE_SPREADSHEET of the main Project sheet
 */

var CONF_SOURCE_SPREADSHEET = '0AvkoPbRYIAvxdHNQUmJtdlY5TnVQZkNFVmxPRmotT0E';
var CONF_TARGET_SPREADSHEET = '';
var CONF_RESOURCE_ID = 'Misha';


function testGetResources() {
  var resources = getProjectResources_();
  Logger.log(resources);

}

function getProjectResources_() {
  var sp = SpreadsheetApp.openById(CONF_SOURCE_SPREADSHEET);
  var sheet = sp.getSheetByName('Resources');

  var lastRowNr = sheet.getLastRow();
  var range = sheet.getRange(3, 1, lastRowNr, 5);

  var values = range.getValues();

  var resources = []
  var row = undefined;
    for (var i in values) {
      row = values[i];
      //Logger.log(row);
      if (row[2] == '') {
        continue;
      }
      resources.push(row[2])
    }

  return resources.sort();

}


function testGetTasks() {

  var sp = SpreadsheetApp.openById(CONF_SOURCE_SPREADSHEET);
  var sheet = sp.getSheetByName('Task schedule');

  var spTarget = SpreadsheetApp.openById(CONF_TARGET_SPREADSHEET);

  var sheetTarget = sheet.copyTo(spTarget);

  try {
    var sheetOld = spTarget.getSheetByName('tracker');
    sheetOld.activate();
    spTarget.deleteActiveSheet();
  } catch (e) {

  }


  sheetTarget.setName('tracker');
  sheetTarget.activate();

  //var sheetTarget = spTarget.getSheetByName('tracker');
  //sheetTarget.clear();
  hideData_(sheetTarget);
}

function testHideData() {
  var sp = SpreadsheetApp.openById(CONF_TARGET_SPREADSHEET);
  var sheet = sp.getSheetByName('tracker');
  hideData_(sheet);

}

function hideData_(sheetTarget) {
  var lastRowNr = sheetTarget.getLastRow();
  var range = sheetTarget.getRange(1, 1, lastRowNr, 100);

  var values = range.getValues();

  //Logger.log(values);
  var row = undefined;
  var lastProjectNumber = undefined;
  var lastProjectTitle = undefined;
  var lastResourceId = undefined;

  var engagementsInLastProject = 0;
  var lastProjectRootRowNr = 0;

  for (var i in values) {
    row = values[i];


    //show header
    if (i == 0) {
      Logger.log(row);
      //sheetTarget.appendRow(row)
    }

    lastProjectNumber = row[1];
    lastProjectTitle = row[2]
    //check root project name
    if (lastProjectNumber.indexOf('.') > -1 ) {
      //get current resouce id
      lastResourceId = row[7];

      if (lastResourceId == CONF_RESOURCE_ID) {
        engagementsInLastProject++;
        //row[1] = lastProjectNumber + ' ' + lastProjectTitle;
        Logger.log(lastProjectNumber + ':' + lastProjectTitle + ':' + lastResourceId);
        //sheetTarget.appendRow(row)
      } else {
        var rowNr = parseInt(i) + 1;
        sheetTarget.hideRows(rowNr);
        Logger.log('hideRows:' + i + '->' + rowNr)
      }

    } else if (lastProjectNumber != '') {

      //we are in current project root
      if (engagementsInLastProject == 0 && i > 4) {
        sheetTarget.hideRows(lastProjectRootRowNr);
        sheetTarget.hideRows(i);

        Logger.log(i + ' lastProjectRootRowNr:' + lastProjectRootRowNr)
      }

      engagementsInLastProject = 0;
      lastProjectRootRowNr = parseInt(i) + 1;

    }
  }


  //hide last project
  if (engagementsInLastProject == 0 && i > 4) {
    sheetTarget.hideRows(lastProjectRootRowNr);
  }

}
