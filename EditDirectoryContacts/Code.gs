/**
 * 1. Enable "Admin Directory API" in Resources -> "Advanced Google Services"
 * 2. Enable Admin SDK in "Developer Console Project" -> "*-project-id-*"-Link
 * 3. Run intitialize Mehod
 */

function doGet(e) {
    Logger.log(e);

    var html = HtmlService.createTemplateFromFile("form.html");

    var email = Session.getActiveUser().getEmail();

    if (e.parameter.email) {
        email = e.parameter.email;
    }

    var contact = getBasicContactData_(email);
    var config = getScriptConfig();
    html.contact = contact;
    html.config = config;

    Logger.log(contact);
    Logger.log(config);



    return html
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.NATIVE)
        .setTitle('Edit G Suite directory contact');

}

function getScriptConfig() {

    var scriptProperties = PropertiesService.getScriptProperties();
    var data = scriptProperties.getProperties();

    var config = {
        'userMayEditTheirOwnData' : data.userMayEditTheirOwnData == 'true',
        'usersWhoCanEditForeignData' : data.usersWhoCanEditForeignData == undefined ? '' : data.usersWhoCanEditForeignData,
        'sendUpdateNotificationTo' : data.sendUpdateNotificationTo == undefined ? '' : data.sendUpdateNotificationTo

    };

    config.ifCanEditUserData = function(email) {

        var emails = this.usersWhoCanEditForeignData.split(' ').join('').split(',');

        return Array_contains(emails, email);
    };


    config.ifCanEditOwnData = function(email) {

        var isUserOwner = (email == Session.getActiveUser().getEmail());

        if (isUserOwner && this.userMayEditTheirOwnData == true) {
            return true;
        }

        return false;
    };


    return config;
}


function test_config() {
    var config = getScriptConfig();

    var email = 'm@kupriyanov.com';

    Logger.log('canEditForeignData(%s):%s', email, config.ifCanEditUserData(email));



}

function setScriptConfig(config) {
    Logger.log(config);

    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('userMayEditTheirOwnData', config.userMayEditTheirOwnData);
    scriptProperties.setProperty('usersWhoCanEditForeignData', config.usersWhoCanEditForeignData);
    scriptProperties.setProperty('sendUpdateNotificationTo', config.sendUpdateNotificationTo);

}



function isUserAdmin(userKey) {

    //var userKey = Session.getActiveUser().getEmail();
    var user = getBasicContactData_(userKey);


    if (user.isAdmin) {
        return true;
    }

    if (user.isDelegatedAdmin) {
        return true;
    }

    return false;
}

function getBasicContactData_(userKey) {

    var contact = {};

    contact.NAME = null;
    contact.EMAIL = null;
    contact.PHONE_WORK = null;
    contact.PHONE_WORK_MOBILE = null;
    contact.PHONE_EMERGENCY = null;
    contact.isAdmin = false;
    contact.isDelegatedAdmin = false;


    var user = AdminDirectory.Users.get(userKey);

    if (!user) {
        return contact;
    }


    contact.NAME = user.name.fullName;
    contact.isAdmin = user.isAdmin;
    contact.isDelegatedAdmin = user.isDelegatedAdmin;

    Logger.log(user.emails);

    var mail = null;

    for (var i in user.emails) {
        mail = user.emails[i];

        if (mail.primary) {
            contact.EMAIL = mail.address;
        }

    }


    var phone = null;
    for (var i in user.phones) {
        phone = user.phones[i];

        switch (phone['type']) {
            case 'work':

                if (phone['primary']) {
                    contact.PHONE_WORK = phone['value'];
                }

                break;
            case 'work_mobile':

                contact.PHONE_WORK_MOBILE = phone['value'];

                break;
            case 'custom':

                if (phone['customType'] == 'Emergency') {
                    contact.PHONE_EMERGENCY = phone['value'];
                }


                break;
        }

    }


    var organization = null;

    contact.organization = {
        "name": '',
        "department": '',

        "title": '',

        "primary": true,
        "customType": "work",
        "description": ''
    };


    for (var i in user.organizations) {
        organization = user.organizations[i];

        contact.organization = organization;

    }

    return contact;

}


function test_checkEditRights() {
    var email = 'admin@kupriyanov.com';

    checkEditRights(email);

}

function checkEditRights(contactEMAIL) {
    var activeUserEmail = Session.getActiveUser().getEmail();

    var config = getScriptConfig();


    if (isUserAdmin(activeUserEmail)) {
        //do everything
        //return true;
    }


    if (config.ifCanEditUserData(activeUserEmail)) {
        //var error = activeUserEmail + ' not allowed to edit data of ' + contactEMAIL;
        //throw new Error(error);
        return true;
    }


    //check if user is data owner
    if (activeUserEmail == contactEMAIL) {

        if (!config.ifCanEditOwnData(contactEMAIL)) {
            var error = 'You not allowed to edit own data';
            throw new Error(error);
        }

        return true;

    }


    var error = activeUserEmail + ' not allowed to edit data of ' + contactEMAIL;
    throw new Error(error);

}

function updateMe(contact) {

    Logger.log(contact);

    var activeUserEmail = Session.getActiveUser().getEmail();

    //throws an exception action not allowed
    checkEditRights(contact.EMAIL);

    if (contact.EMAIL) {
        activeUserEmail = contact.EMAIL;
    }

    var config = getScriptConfig();
    updateContact(activeUserEmail, contact, config);

}

function updateContact(userKey, contact, config) {

    Logger.log(contact);


    try {

        var user = AdminDirectory.Users.get(userKey);


        if (user) {

            var resource = {};

            resource.phones = [];
            resource.organizations = [];


            if (contact.PHONE_WORK !== undefined) {
                resource.phones.push( {
                    "value": contact.PHONE_WORK,
                    "primary": true,
                    "type": "work"
                })
            }


            if (contact.PHONE_WORK_MOBILE !== undefined) {
                resource.phones.push( {
                    "value": contact.PHONE_WORK_MOBILE,
                    "type": "work_mobile"
                })
            }


            if (contact.PHONE_EMERGENCY !== undefined) {
                resource.phones.push({
                    "value": contact.PHONE_EMERGENCY,
                    "type": "custom",
                    "customType": "Emergency"
                })
            }

            resource.organizations.push({
                "name": contact.organization.name,
                "department": contact.organization.department,

                "title": contact.organization.title,
                "primary": true,
                "customType": "work",
                "description": contact.organization.description
            });

            var result = AdminDirectory.Users.patch(resource, userKey);

            Logger.log(result);

            if (config.sendUpdateNotificationTo) {
                GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                    "Updated: " + user.name.fullName + " (" + user.primaryEmail + ")",
                    JSON.stringify(contact));
            }

        }

    } catch (e) {
        Logger.log(e);
    }

}

Array_contains = function(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}