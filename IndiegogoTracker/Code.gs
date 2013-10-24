/**
* Script for fetching data of desired indiegogo campaign and buldining/updating the graph for later analysing/sharing.
* Example output for ubuntu-edge campaign https://docs.google.com/spreadsheet/ccc?key=0Akgh73WhU1qHdGNuY3lHUmhwVE9GMzc3aEJ0bHFRSmc&usp=sharing
*
* @author Misha M.-Kupriyanov https://plus.google.com/104512463398531242371/
* @link https://github.com/russenreaktor/GoogleAppsScript/tree/master/IndiegogoTracker
*
* Configuration:
* 1) copy the spreadsheet https://docs.google.com/spreadsheet/ccc?key=0Akgh73WhU1qHdFgzazR6SERiWnpYTTlmVG9oaVRVcFE#gid=0
*    and replace the CONF_PUBLIC_SPREADSHEET_ID with the key of your copied spreadsheet
* 2) rename first sheet's name to the id of the desired indiegogo campaign
*    e.g. http://www.indiegogo.com/projects/ubuntu-edge will be "ubuntu-edge".
*    set the CAMPAIGN_ID configuration variable
* 3) Add time driven trigger call the trackIndiegogoCampaign every desired time period.
*    "Resources" -> "trackIndiegogoCampaign" -> "add new trigger.
*    trackIndiegogoCampaign | time driven | Minutes driven | <desired time period>
*/
var CONF_PUBLIC_SPREADSHEET_ID = '0Akgh73WhU1qHdFgzazR6SERiWnpYTTlmVG9oaVRVcFE';
var CAMPAIGN_ID = 'ubuntu-edge';

function trackIndiegogoCampaign() {
  fetchNewData_(CONF_PUBLIC_SPREADSHEET_ID, CAMPAIGN_ID);
}

function testUpdateGraphRange() {
  updateGraphRange_(CONF_PUBLIC_SPREADSHEET_ID, CAMPAIGN_ID, 0);
}


/**
* Update graph range
*/
function updateGraphRange_(spreadsheetId, sheetName, chartNr) {
  var sp = SpreadsheetApp.openById(spreadsheetId);
  var sheet = sp.getSheetByName(sheetName);
  updateGraphRangeOnSheet_(sheet, chartNr);
}

function updateGraphRangeOnSheet_(sheet, chartNr) {
  var charts = sheet.getCharts();
  var lastRowNr = sheet.getLastRow();

  Logger.log('updateGraphRangeOnSheet_:lastRowNr:' + lastRowNr);

  Logger.log(charts);
  var chart = charts[chartNr];


  var builder = chart.modify();
  var ranges = chart.getRanges();
  builder.removeRange(ranges[0]);
  builder.addRange(sheet.getRange("A1:B" + lastRowNr));

  sheet.updateChart(builder.setPosition(2, 3, 1, 1).build());
}

function fetchNewData_(spreadsheetId, sheetName) {
  var sp = SpreadsheetApp.openById(spreadsheetId);
  var sheet = sp.getSheetByName(sheetName);

  var dataOld = getLastRowData_(sheet);
  var dataNew = fetchNewLiveData_(sheetName);

  if (dataOld.raised < dataNew.raised) {
    addRow_(sheet, dataNew);
    updateGraphRangeOnSheet_(sheet, 0);
  }

  Logger.log(dataOld);
}

function addRow_(sheet, data) {

  var date = new Date();
  var dataRow = [date, data['raised'], data['days_left'], data['goal']];
  sheet.appendRow(dataRow);

}

function getLastRowData_(sheet) {

  var lastRowNr = sheet.getLastRow();

  //map to shiny object
  var data = {timestamp: undefined
    , raised: -1
    , days_left: -1
    , goal: -1
  };

  if (lastRowNr == 1) {
    return data;
  }


  var lastRowData = sheet.getRange(lastRowNr, 1, 1, 4);



  lastRowData = lastRowData.getValues();
  //map to shiny object
  data = {timestamp: new Date(lastRowData[0][0])
    , raised: parseFloat(lastRowData[0][1])
    , days_left: parseInt(lastRowData[0][2])
    , goal: parseFloat(lastRowData[0][3])
  };

  return data;
}

/**
* fetch campaign site and parse current campaign stats
*/
function fetchNewLiveData_(projectId) {

  var data = {raised: -1
    , goal: -1
    , days_left: -1};


    var response = UrlFetchApp.fetch('http://www.indiegogo.com/projects/' + projectId);

    response = response.getContentText();

  /*
  '<p class="money-raised goal">'
  '<span class="amount medium clearfix">'
  '<span class="amount bold">'
  */

  data['raised'] = parsePageValue_(response, '<span class="amount medium clearfix">', '</span>', null, null);
  data['goal'] = parsePageValue_(response, '<p class="money-raised goal">', '</p>', null, null);
  data['days_left'] = parsePageValue_(response, '<span class="amount bold">', '</span>', null, null);


  //clean values
  //{raised=$3,348,914, days_left=30, goal=Raised of $32,000,000 Goal}

  data['raised'] = data['raised'].split(',').join('').replace('$', '');

  data['goal'] = data['goal'].split(',').join('');
  data['goal'] = data['goal'].split(' ').join('');
  data['goal'] = data['goal'].replace('\n', '').replace('\n', '');

  data['goal'] = data['goal'].replace('Raisedof$', '');
  data['goal'] = data['goal'].replace('Goal', '');

  Logger.log(data);

  return data;
}
