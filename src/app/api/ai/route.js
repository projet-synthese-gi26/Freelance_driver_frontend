import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    " Give answer about my web application which is a trip application the app is called letsGo \n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat(generationConfig);

export async function POST(request) {

  const { question } = await request.json();
  const prompt = question;
  console.log(question)
 
  try {
    const result = await model.generateContent(prompt);
    const data = result.response.text();
    // return new NextResponse(data)
    return new NextResponse(data);

    // res.status(200).json(result.response.text())
  } catch (error) {
    console.log("error");
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  // res.status(400).json({message: error.message})
}
