/**
*
* @example parsePageValue_(response, '<span class="amount medium clearfix">', '</span>', null, null);
*
* @author Misha M.-Kupriyanov https://plus.google.com/104512463398531242371/
* @link https://github.com/russenreaktor/GoogleAppsScript/tree/master/IndiegogoTracker
*/

function parsePageValue_(html, filterBegin, filterEnd, filterBegin2, filterEnd2) {

  Logger.log(filterBegin + ', ' + filterEnd + ', ' + filterBegin2 + ', ' + filterEnd2);
  var count = -1;

  var response = html;
  var begin = response.indexOf(filterBegin) + filterBegin.length;
  response = response.substring(begin);

  if (filterBegin2) {
    begin = response.indexOf(filterBegin2) + filterBegin2.length;
    response = response.substring(begin);
  }


  if (filterEnd2) {
    var end2 = response.indexOf(filterEnd2);
    response = response.substring(0, end2);
  }

  var end = response.indexOf(filterEnd);
  response = response.substring(0, end);


  /*
   * replace number separators
   */
  //response = response.split('.').join('');
  //response = response.split(',').join('');


  return response;
}