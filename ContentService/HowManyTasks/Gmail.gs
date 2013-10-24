function testGmailTasks() {
  var gmailClient = new GmailTasksClient();

  var resonse = gmailClient.getGmailTasksByLabel('!task');

  Logger.log('resonse:' + resonse);
}

function GmailTasksClient() {
  this.getGmailTasksByLabel = function(label) {

    var result = {'assigned_todos_count': 0};

    var label = GmailApp.getUserLabelByName(label);

    var tasks = label.getThreads();
    Logger.log('Total Tasks:' + tasks.length);
    result['assigned_todos_count'] = tasks.length;

    /*
    for (var i in tasks) {

      Logger.log('task:' + tasks[i].getFirstMessageSubject());
    }
    */

    return result;

  }
}
