/**
 * Hint: Edit the HtmlService.gs
 */

//https://basecamp.com/<accountid>/api/v1/people/me.json
//https://basecamp.com/<accountid>/api/v1/people/<yourid>/assigned_todos.json

function BasecampClient(clientId, userId, pass) {
  this._clientId = clientId;
  this._userId = userId;
  this._pass = pass;

  this._urlMyTodos = undefined;

  this.getProjects = function() {

    var url = 'https://basecamp.com/' + this._clientId + '/api/v1/projects.json';

    var headers = {
      headers: {
        'Authorization': 'Basic ' + Utilities.base64Encode(this._userId + ':' + this._pass)
      }
    };

    try {
      var reponse = UrlFetchApp.fetch(url, headers);
      reponse = Utilities.jsonParse(reponse);
    } catch(e) {
      Logger.log('failed to fetch url:' + e);
      return null;
    }

    return reponse;
  }



  this.getProfile = function() {

    var url = 'https://basecamp.com/' + this._clientId + '/api/v1/people/me.json';

    var headers = {
      headers: {
        'Authorization': 'Basic ' + Utilities.base64Encode(this._userId + ':' + this._pass)
      }
    };

    try {
      var reponse = UrlFetchApp.fetch(url, headers);
      reponse = Utilities.jsonParse(reponse);
      this._urlMyTodos = reponse.assigned_todos.url;
    } catch(e) {
      Logger.log('failed to fetch url:' + e);
      return null;
    }

    return reponse;
  }

  this.getMyTodos = function() {

    if (!this._urlMyTodos) {
      this.getProfile();
    }

    var url = this._urlMyTodos;

    var headers = {
      headers: {
        'Authorization': 'Basic ' + Utilities.base64Encode(this._userId + ':' + this._pass)
      }
    };

    try {
      Logger.log('getMyTodos:' + url);

      var reponse = UrlFetchApp.fetch(url, headers);
      reponse = Utilities.jsonParse(reponse);
    } catch(e) {
      Logger.log('failed to fetch url:' + e);
      return null;
    }

    return reponse;
  }

  this.getTodos = function() {

    var url = 'https://basecamp.com/' + this._clientId + '/api/v1/todolists.json';

    var headers = {
      headers: {
        'Authorization': 'Basic ' + Utilities.base64Encode(this._userId + ':' + this._pass)
      }
    };

    try {
      var reponse = UrlFetchApp.fetch(url, headers);
      reponse = Utilities.jsonParse(reponse);
    } catch(e) {
      Logger.log('failed to fetch url:' + e);
      return null;
    }

    return reponse;
  }

}