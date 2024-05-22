"use server";
import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();
import { getDeals } from '../mongo/getPostDeals';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, 
    dangerouslyAllowBrowser : true
});
const schema = {
    $defs: {
        Note: {
            properties: {
                person: {
                    title: "Person",
                    type: "string"
                },
                date: {
                    title: "Date",
                    type: "string",
                    format: "date-time"
                },
                note: {
                    title: "Note",
                    type: "string"
                }
            },
            required: [],
            title: "Note",
            type: "object"
        }
    },
    properties: {
        companyName: {
            title: "Company Name",
            type: "string"
        },
        dealStage: {
            title: "Deal Stage",
            type: "string",
            enum: [null, "won", "proposal", "negotiation", "lost"],
            default: null
        },
        opportunityName: {
            title: "Opportunity Name",
            type: "string"
        },
        accountOwner: {
            title: "Account Owner",
            type: "string"
        },
        amount: {
            title: "Amount",
            type: "number"
        },
        contactNames: {
            items: {
                type: "string"
            },
            title: "Contact Names",
            type: "array"
        },
        firstContact: {
            title: "First Contact",
            type: "string",
            format: "date-time"
        },
        closeDate: {
            title: "Close Date",
            type: "date",
            format: "date-time"
        },
        likelihood: {
            title: "Likelihood",
            type: "number"
        },
        notes: {
            note: {
                $ref: "#/$defs/Note"
            },
            title: "Notes",
            type: "array"
        },
        _id: {
            title: "ID",
            type: "string"
        },
        shouldDelete: {
            title: "Delete",
            type: "boolean"
        },
        failed: {
            title: "Failed",
            type: "boolean"
        },
    required: [],
    title: "Deal",
    type: "object"
}
};

const deleteSchema = {
    properties: {
        _id: {
            title: "ID",
            type: "string"
        },
        shouldDelete: {
            title: "Delete",
            type: "boolean"
        },
    required: [
        "_id",
        "delete"
    ],
    }
};

class Note {
    constructor(person, date, note){
        this.person = person;
        this.date = date;
        this.note = note;
    }
};

class Deal {
    constructor(companyName, dealStage, opportunityName, accountOwner, amount, contactNames, firstContact, closeDate, likelihood, notes, failed, _id){
        this.companyName = companyName;
        this.dealStage = dealStage;
        this.opportunityName = opportunityName;
        this.accountOwner = accountOwner;
        this.amount = amount;
        this.contactNames = contactNames;
        this.firstContact = firstContact;
        this.closeDate = closeDate;
        this.likelihood = likelihood;
        this.notes = notes;
        this.failed = failed;
        this._id = _id;
    }
}


async function createUpdateDeal(deal_information) {
    // Pretty printing improves completion results.
    const deals = await getDeals();
    const jsonSchema = JSON.stringify(schema, null, 4);
    try {
    const chat_completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a CRM tool that takes in information that I tell you about a deal in our pipeline and outputs information about the deal in JSON.\n'The JSON object must use the schema: ${jsonSchema}`
            },
            {
                role: "system",
                content: 'If a user asks you to do anything else except add a new deal, change infromation about an existing deal, or delete a deal, set the value of failed to true.  Otherwise set it to false. Do not skip this step.'
            },
            {
                role: "system",
                content: `The following data are deals we already have in our pipeline: ${JSON.stringify(deals, null, 4)}`
            },
            {
                role: "system",
                content: `If I tell you information about an existing deal, you should update the existing deal with the new information and return an object for that. If I tell you information about a deal that does not exist yet, you should create a new deal.`
            },
            {
                role: "system",
                content: `If you return an existing deal with updated information, make sure to return the _id of the deal. If you return a new deal, set the _id to null.`
            },
            {
                role: "system",
                content: `If something is mentioned that requires a date but not date is said, use todays date.`
            },
            {
                role: "system",
                content: `If a field in the schema provided to you is not mentioned in the prompt you recieve an does not exist already in the deal object, set the field to null.`
            },
            {
                role: "system",
                content: `If the user asks you to delete a deal, please set the shouldDelete field to true.  Otherwise, set it to false.`
            },
            {
                role: "user",
                content: deal_information
            }
        ],
        model: "llama3-70b-8192",
        stream: false,
        response_format: {
            type: "json_object"
        }
    });
    
    return Object.assign(new Deal(), JSON.parse(chat_completion.choices[0].message.content));
} catch (error) {
    console.error(error);
    return Object.assign(new Deal(), {failed: true});
}
}

export async function handleDeal(deal_information) {
    const deal = await createUpdateDeal(deal_information);
    return deal;
}

