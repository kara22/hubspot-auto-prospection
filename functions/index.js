const configuration = require("../config/index");
const axios = require("axios");

// FUNCTION TO VERIFY PROSPECT EMAIL
const emailVerification = async prospect => {
    console.log(
        `⏳ Commencing checking of ${prospect.email} for bounce verification`
    );

    await axios
        .get(
            `https://api.neverbounce.com/v4/single/check?key=${
                configuration.details.neverBounceApiKey
            }&email=${prospect.email}`
        )
        .then(res => {
            // if the email is valid then we create his hubspot account
            if (res.data.result !== "invalid") {
                console.log(
                    `🙌🏾 ${
                        prospect.email
                    } seems to be valid, lets try to create his hubspot account`
                );
                createContact(prospect);

                // else we add him in JSON file in order to retreive his email later
            } else {
                console.log(`✋🏾 Invalid email for ${prospect.email}`);
                bounceArray.push(prospect);
                fs.writeFile(
                    "bounce.json",
                    JSON.stringify(bounceArray),
                    finished
                );
                function finished(err) {
                    console.log(
                        `❌ ${
                            prospect.email
                        } added to JSON file due to email invalid \n\n`
                    );
                }
            }
        })
        .catch(err =>
            console.log(
                `🛑 Cannot vérify the ${prospect.email} because off ${err}`
            )
        );
}; // FUNCTION TO CREATE THE CONTACT INTO HUBSPOT
const createContact = async prospect => {
    const hubspotWorkflowUrl = `https://api.hubapi.com/automation/v2/workflows/${
        configuration.details.workflowId
    }/enrollments/contacts/${prospect.email}?hapikey=${
        configuration.details.hubspotApiKey
    }`;
    const hubspotCreateContactUrl = `https://api.hubapi.com/contacts/v1/contact/?hapikey=${
        configuration.details.hubspotApiKey
    }`;
    console.log(`⏳ Commencing create hubspot contact for ${prospect.email}`);
    await axios
        .post(hubspotCreateContactUrl, {
            properties: [
                {
                    property: "firstname",
                    value: prospect.firstName
                },
                {
                    property: "lastname",
                    value: prospect.lastName
                },
                {
                    property: "email",
                    value: prospect.email
                },
                {
                    property: "company",
                    value: prospect.companyName
                },
                {
                    property: "city",
                    value: prospect.location
                },
                {
                    property: "linkedin_url",
                    value: prospect.defaultProfileUrl
                },
                {
                    property: "co_auto_prospection",
                    value: prospect.co_auto_prospection
                },
                {
                    property: "lead_source__c",
                    value: prospect.lead_source__c
                },
                {
                    property: "lifecyclestage",
                    value: prospect.lifecyclestage
                },
                {
                    property: "target_type",
                    value: prospect.target_type
                },
                {
                    property: "hubspot_owner_id",
                    value: prospect.hubspot_owner_id
                },
                {
                    property: "co_level",
                    value: prospect.co_level
                },
                {
                    property: "demand_hive",
                    value: prospect.hive
                }
            ]
        })
        // If success, log confirmation
        .then(res => {
            console.log(
                `✅ Account created for  ${
                    prospect.email
                }, lets try to put the prospect into workflow id n° ${
                    configuration.details.workflowId
                } `
            ),
                // add the prospect into a Hubspot workflow
                addToHubspotWorkflow(prospect, hubspotWorkflowUrl);
        })
        // If impossible to create the contact, log the response from the Hubspot API who tells us why
        .catch(err => {
            console.log(
                `🛑 Cannot create contact for ${prospect.email} because : ${
                    err.response.data.message
                } \n\n `
            );
            // axios
            //     .get(
            //         `https://api.hubapi.com/contacts/v1/contact/email/${
            //             prospect.email
            //         }/profile?hapikey=${configuration.details.hubspotApiKey}`
            //     )
            //     .then(res => console.log(res.data))
            //     .catch(err => console.log(err));
        });
}; // FUNCTION TO ADD HUBSPOT CONTACT INTO A WORKFLOW
const addToHubspotWorkflow = async (prospect, hubspotWorkflowUrl) => {
    // add the prospect into a Hubspot workflow
    console.log(
        `⏳ Commencing to add ${prospect.email} in workflow ${
            configuration.details.workflowId
        }`
    );
    await axios
        .post(hubspotWorkflowUrl)
        .then(res => {
            console.log(
                `📩 Successfully add ${prospect.email} into workflow n° ${
                    configuration.details.workflowId
                } \n\n`
            );
        })
        .catch(err =>
            console.log(
                `🛑 Cannot send ${
                    prospect.email
                } into workflow because ${err} \n\n`
            )
        );
};
module.exports.createContact = createContact;
module.exports.addToHubspotWorkflow = addToHubspotWorkflow;
module.exports.emailVerification = emailVerification;
