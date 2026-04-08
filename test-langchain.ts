import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function test() {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-3-flash-preview",
      apiKey: "AIzaSyDJ4sf8T2STcANgSOyhQLkibjv_8LF6mi0",
    });
    const res = await llm.invoke("hello");
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
