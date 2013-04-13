/**
 * ContentScript for SocialAPILibrary
 * @author Misha M.-Kupriyanov <m.kupriyanov@gmail.com>
 * @license Licensed under the Apache License, Version 2.0 http://www.apache.org/licenses/LICENSE-2.0
 */

 var API_KEYs = {'AIzaSyDyK7kSJV3': {description: 'Public test'},
                'Ar4VBrcw6qIyjc': {description: 'm.kupriyanov project'},
               };

function testDoGet() {

  var request = {queryString: 'network=twitter&user=russenreaktor&key=AIzaSyDyK7kSJV3',
                 parameter:{user:['russenreaktor'], network:['russenreaktor'], key:['AIzaSyDyK7kSJV3']}, contextPath:null,
                 parameters:{user:['russenreaktor'], network:['russenreaktor'], key:['AIzaSyDyK7kSJV3']}, contentLength:-1};

  return doGet(request);
}

function doGet(request) {

  Logger.log(request);

  var result = {status: 'error', msg: 'unknown error'};


    var network = undefined;
    var profileId = undefined;
    var key = undefined;

  try {

    //validate parameters
    if (request.parameters['network'] == undefined || request.parameters['network'].count == 0) {
      throw 'please set network';
    }

    if (request.parameters['user'] == undefined || request.parameters['user'].count == 0) {
      throw 'please set user';
    }

    if (request.parameters['key'] == undefined || request.parameters['key'].count == 0) {
      throw 'please set API key';
    }

    network = request.parameters['network'][0];
    profileId = request.parameters['user'][0];
    key = request.parameters['key'][0];


    //validate parameter
    if (key == undefined || key.length == 0 ) {
      throw 'please set API key';
    }

    if (network == undefined || network.length == 0 ) {
      throw 'please set network';
    }

    if (profileId == undefined || profileId.length == 0 ) {
      throw 'please set profileId';
    }


    //check api key
    Logger.log(API_KEYs[key]);
    if (API_KEYs[key] == undefined) {
      throw 'wrong API key';
    }


    Logger.log('key:' + key);
    Logger.log('network:' + network);
    Logger.log('profileId:' + profileId);

    //get network information
    switch(network) {
      case 'facebook':

        result['data'] = {};

        result['data']['network'] = network;
        result['data']['user'] = profileId;
        result['data']['reach'] = SocialAPILibrary.getFacebookFollowers(profileId);
        result['status'] = 'success';
        result['msg'] = 'ok';

        break;
      case 'googleplus':

        result['data'] = {};

        result['data']['network'] = network;
        result['data']['user'] = profileId;
        var data = SocialAPILibrary.getGooglePlusSubscribers(profileId);

        result['data']['reach'] = data['followers'];
        result['data']['data'] = data;

        result['status'] = 'success';
        result['msg'] = 'ok';

        break;
      case 'twitter':
        Logger.log('network:' + network);

        result['data'] = {};
        result['data']['network'] = network;
        result['data']['user'] = profileId;
        result['data']['reach'] = SocialAPILibrary.getTwitterFollowers(profileId);
        result['status'] = 'success';
        result['msg'] = 'ok';

        break;
      case 'youtube':
        result['data'] = {};

        result['data']['network'] = network;
        result['data']['user'] = profileId;
        result['data']['reach'] = SocialAPILibrary.getYoutubeSubscribers(profileId);
        result['status'] = 'success';
        result['msg'] = 'ok';

        break;
      default:
        Logger.log('network2[' + network + ']');
        result = {status: 'error', msg: 'unknown network:' + network};
        break;
    }

  } catch(e) {
    Logger.log('catch:' + e);

    result['status'] = 'error';
    result['msg'] = e;
    //result['stack'] = e;

  }

  Logger.log('result:');
  Logger.log(result);

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}


