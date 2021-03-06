const axios = require("axios");
const importedFunctions = require("./functions/index");
const cron = require("node-cron");
if (process.env.NODE_ENV !== "production") require("dotenv").config();

const createHubspotProspects = async () => {
    // get all prospects to add via sheety
    await axios
        .get(process.env.HIVE_AUTOPROSP_URL)
        .then(res => {
            const data = res.data;

            // For each prospect create the hubspot contact associated every 5 seconds (to not reach the  hubspot secondly limit)
            const bounceArray = [];
            data.forEach((prospect, index) => {
                setTimeout(() => {
                    // check if the prospect email is valid before creating his hubspot contact
                    importedFunctions.emailVerification(prospect);
                }, index * 5000);
            });
        })
        .catch(err => console.log(err));
};

// setup the cron job every 2,3,4 days of the week on 18h (utc)
cron.schedule("00 18 * * Tuesday-Thursday", () => {
    createHubspotProspects();
});
