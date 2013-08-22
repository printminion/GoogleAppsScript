Indiegogo Campaign Tracker
================
Script for fetching data of desired indiegogo campaign and buldining/updating the graph for later analysing/sharing.

Example
-------
* Campaign: [ubuntu-edge](http://www.indiegogo.com/projects/ubuntu-edge) 30 days raised $12,812,776 of $32,000,000 goal
* Time trigger: 1 min
* Accumulated data: **10350 rows**
* Final [Chart](https://docs.google.com/spreadsheet/oimg?key=0Akgh73WhU1qHdGNuY3lHUmhwVE9GMzc3aEJ0bHFRSmc&oid=3&zx=l7kn948qwgoe)
* Final [Spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Akgh73WhU1qHdGNuY3lHUmhwVE9GMzc3aEJ0bHFRSmc&usp=sharing)


Configuration
------------- 
* copy the [spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Akgh73WhU1qHdFgzazR6SERiWnpYTTlmVG9oaVRVcFE#gid=0)
* rename first sheet's name to the id of the desired indiegogo campaign
   e.g. http://www.indiegogo.com/projects/ubuntu-edge will be "ubuntu-edge".
* Create blank project via https://script.google.com, create new script files and paste the code in to it
* Set the **CONF_PUBLIC_SPREADSHEET_ID** with the key of your copied spreadsheet
* Set the **CAMPAIGN_ID** with desired indiegogo campaign e.g. "ubuntu-edge"
* Add time driven trigger call the trackIndiegogoCampaign function every desired time period.
  "Resources" -> "trackIndiegogoCampaign" -> "add new trigger.
  trackIndiegogoCampaign | time driven | Minutes driven | **desired time period**