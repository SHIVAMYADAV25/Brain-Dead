import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import OpenAI from "openai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const geminiLLM = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const OpenAILLM = new OpenAI({
  apiKey : process.env.GEMINI_API_KEY,
  baseURL : "https://generativelanguage.googleapis.com/v1beta/openai/"
})

export  {
  geminiLLM,
  OpenAILLM
}