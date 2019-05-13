# hubspot-auto-prospection

This bot is designed create Hubspot contacts and enroll them into a marketing workflow every Tuesdays, Wednesdays and Thursdays at 8PM (Paris hour)

The only thing that you have to do is to  replace the environment variables in your .env file (or Heroku or something else) : 

* HUBSPOT_API_KEY = your Hubspot Api key
* NEVERBOUNCE_API_KEY = we are using Neverbounce to verify emails
* HIVE_AUTOPROSP_URL= your api url 
* WORKFLOW_ID = your Hubspot workflow ID
