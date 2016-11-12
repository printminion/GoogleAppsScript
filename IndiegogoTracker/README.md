Indiegogo Campaign Tracker
========================
Google Apps Script to fetch the data from any Indiegogo campaign and to update the graph for analysing/sharing it later.

Example
-----------
* Campaign: [ubuntu-edge](http://www.indiegogo.com/projects/ubuntu-edge) 30 days raised $12,812,776 of $32,000,000 goal
* Time trigger: 1 min
* Accumulated data: **10350 rows**
* Final [Chart](https://docs.google.com/spreadsheet/oimg?key=0Akgh73WhU1qHdGNuY3lHUmhwVE9GMzc3aEJ0bHFRSmc&oid=3&zx=l7kn948qwgoe)
* Final [Spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Akgh73WhU1qHdGNuY3lHUmhwVE9GMzc3aEJ0bHFRSmc&usp=sharing)


Configuration
-------------------
* Copy the [spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Akgh73WhU1qHdFgzazR6SERiWnpYTTlmVG9oaVRVcFE#gid=0).
* Rename first sheet's name to the id of the desired Indiegogo campaign,
   e.g. http://www.indiegogo.com/projects/ubuntu-edge will be "ubuntu-edge".
* Create blank project via https://script.google.com, create new script files and paste the code in to it.
* Set the **CONF_PUBLIC_SPREADSHEET_ID** with the key of your copied spreadsheet.
* Set the **CAMPAIGN_ID** with desired Indiegogo campaign id, e.g. "ubuntu-edge".
* Add time driven trigger call to the **trackIndiegogoCampaign** function.
  "Resources" -> "trackIndiegogoCampaign" -> "add new trigger"
  trackIndiegogoCampaign | time driven | Minutes driven | **desired time period**.


Links
-------
* Author: [Misha M.-Kupriyanov](https://plus.google.com/104512463398531242371/)
* Source: [Git](https://github.com/printminion/GoogleAppsScript/tree/master/IndiegogoTracker)
