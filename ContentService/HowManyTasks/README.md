HowManyTasks
================

Here is my fun little side Google Apps Script project ;)

This dashboard shows your colleagues how many tasks you have in your Gmail and Basecamp. Color and size of the labels depend on the amount of tasks.

* Gmail messages should be labeled with one particular label, e.g. "!task"
* Basecamp API has been used to get the count of tasks

Set proper values in the [HtmlService.gs](https://github.com/russenreaktor/GoogleAppsScript/tree/master/ContentService/HowManyTasks/HtmlService.gs)

    var CONF_NAME = 'Misha';
    var BASECAMP_CLIENT_ID = '<PUT BASECAMP YOUR CLIENT ID HERE>';
    var BASECAMP_USER = '<PUT BASECAMP YOUR USER ID HERE>';
    var BASECAMP_PASSWORD = '<PUT BASECAMP YOUR PASS HERE>';
    var GMAIL_TASK_LABEL = '!task';
