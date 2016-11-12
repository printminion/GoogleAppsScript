function test_getBasicContact() {
    var contact = getBasicContact_('admin@example.com');

    Logger.log(contact);

}


function test_patchBasicContact() {

    var userKey = 'admin@example.com';
    var resource = AdminDirectory.newUser();

    resource.organizations = [
        {
            "name": "ACME Inc.",
            "title": "SWE",
            "primary": true,
            "customType": "work",
            "description": "Software engineer"
        }
    ];

    //resource.orgUnitPath = "/corp/engineering";
    resource.includeInGlobalAddressList = true;

    var contact = AdminDirectory.Users.patch(resource, userKey);


    Logger.log(contact);

}


function test_updateContact() {

    var userKey = Session.getActiveUser().getEmail();
    userKey = 'm@example.com';

    //updateContact(userKey, {PHONE_EMERGENCY:333, PHONE_WORK:1111, PHONE_WORK_MOBILE:222});
    updateContact(userKey, {PHONE_EMERGENCY: 333});

}

function test_checkEditRights() {
    var email = 'admin@example.com';

    checkEditRights(email);

}

function test_config() {
    var config = getScriptConfig();

    var email = 'm@example.com';

    Logger.log('canEditForeignData(%s):%s', email, config.ifCanEditUserData(email));

}
