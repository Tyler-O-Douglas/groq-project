"use server";
import dotenv from 'dotenv';
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

function buildChatContext(previousSearches, previousResults, data){

  const history = [];
  history.push({ role: "system", content: "You are a CRM search tool for our company called Groq. Your goal is to help us learn more about deals in our sales pipeline. Use the following array of data to answer their questions." });
  history.push({ role: "system", content: "Here is how a user can use the system: To add, mutate, or delete a deal, a user should click the *record new deal note* button. To search for any information, they should type their question in the search bar. To see more details about a deal, they should click on the deal name in the table." });
  history.push({ role: "system", content: data });
  if (previousSearches?.length > 0) {
      for (let i = 0; i < previousSearches.length; i++) {
          history.push({ role: "user", content: previousSearches[i] });
          history.push({ role: "assistant", content: previousResults[i] });
      }
  }
  return history;

}

export async function chatBot(content, previousSearches, previousResults, data) {
    const messages = [];
    data = JSON.stringify(data);
    const context = buildChatContext(previousSearches, previousResults, data);
    messages.push(...context);
    messages.push({ role: "user", content: content });
    try {
    const chatCompletion = await getGroqChatCompletion(messages);
    return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error(error);
        return "I'm sorry, I failed to generate an answer from Llama3, please try again later.";
    }
}

async function getGroqChatCompletion(messages) {
    return groq.chat.completions.create({
        messages: messages,
        model: "llama3-70b-8192"

    });
}

