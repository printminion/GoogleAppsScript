function doGet() {

  var app = UiApp.createApplication();
  var panel = app.createVerticalPanel().setSpacing(10);

  var listBox = app.createListBox().setName('myList').setWidth('200px').setStyleAttribute('margin-left', '4px');

  var resources = getProjectResources_();
  listBox.addItem('Select your resource', -1);

  for (var i in resources) {
    listBox.addItem(resources[i], i)
  }


  //Add a handler to the ListBox when its value is changed
  var handler = app.createServerChangeHandler('showSelectedinfo_');
  handler.addCallbackElement(listBox);
  listBox.addChangeHandler(handler);
  var infoLabel = app.createLabel('Select resource').setId('info').setVisible(false);
  var anchor = app.createAnchor('open document', '#').setVisible(false).setId('url');
  var button = app.createButton().setText('Subscribe for pesonalized project plan').setId('submit').setEnabled(false);

  var spinner = app.createImage('https://ssl.gstatic.com/docs/documents/share/images/spinner-1.gif')
  .setVisible(false)
  .setId('spinner').setStyleAttribute('margin-top', '9px').setStyleAttribute('margin-left', '4px');

  var loadSpinner = app.createClientHandler()
  .forTargets(spinner).setVisible(true)
  .forTargets(button).setEnabled(false)
  ;


  var load = app.createServerMouseHandler('onSubscribeForPersonalizedProjectPlan_').addCallbackElement(listBox);
  button.addMouseUpHandler(load);
  button.addClickHandler(loadSpinner);


  var sp = SpreadsheetApp.openById(CONF_SOURCE_SPREADSHEET);

  panel.add(app.createHTML('<h1>' + sp.getName() + '</h1>'));


  panel.add(listBox);
  panel.add(infoLabel);
  panel.add(app.createHorizontalPanel().add(button).add(spinner));
  //panel.add(spinner);
  panel.add(anchor);

  var allTriggers = ScriptApp.getProjectTriggers();

  if (allTriggers.length > 0) {
    panel.add(app.createLabel('Current ' + allTriggers.length + ' trigger for: ' + UserProperties.getProperty('CONF_RESOURCE_ID')).setId('trigger'));
  } else {
    panel.add(app.createLabel('No daily triggers').setId('trigger'));
  }


  var buttonUnsubscribe = app.createButton().setText('Unsunscribe from pesonalized project plan').setId('btnUnsubscribe').setEnabled(allTriggers.length > 0);
  var onUnsunbscribe = app.createServerMouseHandler('onUnsubscribeForPersonalizedProjectPlan_').addCallbackElement(listBox);
  buttonUnsubscribe.addMouseUpHandler(onUnsunbscribe);

  panel.add(buttonUnsubscribe);

  app.add(panel);

  return app;

}


function showSelectedinfo_(e){
  var app = UiApp.getActiveApplication();
  Logger.log('showSelectedinfo_');

  //app.getElementById('info').setText('You selected:'+e.parameter.myList).setVisible(false).setStyleAttribute('color','#008000');

  var selectedItem = parseInt(e.parameter.myList);

  Logger.log(selectedItem);

  app.getElementById('submit').setEnabled(selectedItem >= 0);
  app.getElementById('url').setVisible(false);
  app.getElementById('btnUnsubscribe').setEnabled(false);


  return app;
}

function onSubscribeForPersonalizedProjectPlan_(e) {
  var app = UiApp.getActiveApplication();
  Logger.log('onSubscribeForPersonalizedProjectPlan_:' + e.parameter.myList);

  var resources = getProjectResources_();

  var resourceId = resources[e.parameter.myList];

  Logger.log('onSubscribeForPersonalizedProjectPlan_:' + resourceId);

  var url = '#'
  url = getPreparedFileURL_(resourceId);

  app.getElementById('submit').setEnabled(true);
  app.getElementById('url').setVisible(true).setHref(url).setText(url);
  app.getElementById('spinner').setVisible(false);

  // save profile
  UserProperties.setProperty('CONF_RESOURCE_ID', resourceId);
  createTrigger();
  //  app.getElementById('info').setText('You selected:'+e.parameter.myList).setVisible(false)
  //  .setStyleAttribute('color','#008000');

  try {

    var allTriggers = ScriptApp.getProjectTriggers();

    var triggerInfo = (allTriggers.length == 0) ? 'No daily triggers' : 'Current ' + allTriggers.length + ' trigger for: ' + UserProperties.getProperty('CONF_RESOURCE_ID');

    app.getElementById('trigger').setVisible(true).setText(triggerInfo);
    app.getElementById('btnUnsubscribe').setEnabled(true);

  } catch(e) {
    Logger.log(e);
  }

  return app;

}


function onUnsubscribeForPersonalizedProjectPlan_(e) {
  var app = UiApp.getActiveApplication();
  Logger.log('onUnsubscribeForPersonalizedProjectPlan_:' + e.parameter.myList);

  try {

    app.getElementById('btnUnsubscribe').setEnabled(false);
    app.getElementById('spinner').setVisible(false);

    // save profile
    deleteAllTriggers();

    app.getElementById('trigger').setVisible(true).setText('No daily triggers');
  } catch(e) {
    Logger.log(e);
  }

  return app;
}


function testGetFile() {
  getPreparedFileURL_('Misha')
}


function getPreparedFileURLByTrigger() {
  var name = UserProperties.getProperty('CONF_RESOURCE_ID');

  if(name == '' || name == null) {
    Logger.log('12');
    return;
  }

  return getPreparedFileURL_(name);

}

function getPreparedFileURL_(name) {
  var targetFile = undefined;

  var fileName = 'projectTracker: ' + name;
  targetFile = DriveApp.getFilesByName(fileName)

  if (targetFile.hasNext()) {
    targetFile = targetFile.next();
  } else {
    targetFile = DriveApp.createFile(fileName, '', MimeType.GOOGLE_SHEETS);
  }


  CONF_TARGET_SPREADSHEET = targetFile.getId();
  CONF_RESOURCE_ID = name;


  //var sp = SpreadsheetApp.openById(CONF_TARGET_SPREADSHEET);
  Logger.log(targetFile.getUrl());



  testGetTasks();

  return targetFile.getUrl();

}


