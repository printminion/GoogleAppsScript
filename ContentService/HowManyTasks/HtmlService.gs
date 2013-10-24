var CONF_NAME = 'Misha';
var BASECAMP_CLIENT_ID = '<PUT BASECAMP YOUR CLIENT ID HERE>';
var BASECAMP_USER = '<PUT BASECAMP YOUR USER ID HERE>';
var BASECAMP_PASSWORD = '<PUT BASECAMP YOUR PASS HERE>';
var GMAIL_TASK_LABEL = '!task';

function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
}

function getTasks() {
  var response = {'status': 'failure'};

  var gmailClient = new GmailTasksClient();
  response['gmail'] = gmailClient.getGmailTasksByLabel(GMAIL_TASK_LABEL);

  response['basecamp'] = getBasecampTasks();

  response['status'] = 'success';

  return response;
}

function getBasecampTasks() {
  var basecamp = new BasecampClient(BASECAMP_CLIENT_ID, BASECAMP_USER, BASECAMP_PASSWORD);
  var todos = basecamp.getMyTodos();
  Logger.log('projects:' + todos.length);

  var assigned_todos = [];
  var assigned_todos_count = 0;
  for(var i in todos) {

    assigned_todos = todos[i].assigned_todos;
    assigned_todos_count += assigned_todos.length;

  }

  Logger.log('assigned_todos_count:' + assigned_todos_count);
  return {'assigned_todos_count': assigned_todos_count};
}