"use server"
import OpenAI from 'openai';
import { toFile } from 'openai/uploads';
import dotenv from 'dotenv';
dotenv.config();
import Groq from "groq-sdk";
import { handleDeal } from './create-update-deal';
import { revalidatePath } from "next/cache";
import { createUpdateDeal } from '../mongo/getPostDeals';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// CONVERT BUFFER TO FILE

async function convertToFile(buffer){
    const file = await toFile(Buffer.from(buffer), 'audio.mp3');
    return file;
}


// GET TRANSCRIPTION FROM WHISPER
export async function transcribeWithWhisper(audioBlob) {

    try {
    console.log("Transcribing audio with Whisper...");
    const file  = await convertToFile(audioBlob);
    console.log('finished converting to file');
    const transcription = await groq.audio.transcriptions.create({
        file: file,
        model: "whisper-large-v3",
    });
    console.log('transcribed text:', transcription.text);
    const updatedDeal = await handleDeal(transcription.text);
    console.log('updated deal:', updatedDeal);
    if (updatedDeal.failed){
        return {
            failed: true,
            message: "You can only add, mutate, or delete deals with voice notes"
        }
    }
    await createUpdateDeal(updatedDeal);
    revalidatePath('/');
    } catch (error) {
        console.log('Failed to transcribe audio with Whisper');
        return {
            failed: true,
            message: "Whisper failed to transcribe audio. Please try again."
        }

    }
}
    
    