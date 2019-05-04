const configuration = require("./config/");
const axios = require("axios");
const importedFunctions = require("./functions/index");
const triggerButton = document.querySelector("#launch");

var fs = require("fs");

const createHubspotProspects = async url => {
    // get all prospects to add via sheety
    await axios
        .get(url)
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

triggerButton.addEventListener("click", e => {
    createHubspotProspects(configuration.details.firstHiveProspectsUrl);
});
