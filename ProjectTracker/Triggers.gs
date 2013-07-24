function createTrigger() {

  Logger.log('createTrigger')

  var allTriggers = ScriptApp.getProjectTriggers();

  if (allTriggers.length > 0) {
    Logger.log('...one trigger already exist')
  }



  // Once a day at 06:00
  var onceAWeek = ScriptApp.newTrigger("getPreparedFileURLByTrigger")
  .timeBased()
  .everyDays(1)
  .atHour(6)
  .create();

}


// Delete a trigger with the given unique ID
function deleteAllTriggers() {
  // Locate a trigger by unique ID
  var allTriggers = ScriptApp.getProjectTriggers();
  // Loop over all triggers
  for (var i = 0; i < allTriggers.length; i++) {
    // Found the trigger and now delete it
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}

