/**
 * Client Script for SocialAPILibrary
 * add this script to your spreadsheet and you will be able to get folloerss
 * via formula e.g. =getTwitterCount(A2)
 * Example: https://lh6.googleusercontent.com/-EPK-mUtK6-o/UWm_nEpo2UI/AAAAAAAAru0/20a0lk2nIiQ/s0/SocialAPIService.gif 
 * @author Misha M.-Kupriyanov <m.kupriyanov@gmail.com>
 * @license Licensed under the Apache License, Version 2.0 http://www.apache.org/licenses/LICENSE-2.0
 */

var API_KEY = 'AIzaSyDyK7kSJV3'; //public api key for demo purposes

function getTwitterCount(user) {
  return getSocialReach_('twitter', user);
}

function getSocialReach_(network, user) {
  
  var url = 'https://script.google.com/macros/s/AKfycby1cj9-jZgMDao4kS5N1_58vf6kGI2qPbc9eL9v8nK-GTjzLuk/exec?' 
  + 'key=' + API_KEY + '&network=' + network 
  + '&user=' + user;
  
  Logger.log(url);
  
  try {
    var response = UrlFetchApp.fetch(url);
    
    Logger.log(response.getContentText());
    var data = Utilities.jsonParse(response.getContentText())
    
    if (data.status != 'success') {
      throw 'failed to get result';
    }
    
    if (data.data.reach == -1) {
      return NaN;
    }
    
    return data.data.reach;

  } catch(e) {
    Logger.log(e);
    return NaN;
  }
  

}
