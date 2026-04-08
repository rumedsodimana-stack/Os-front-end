import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

async function test() {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-3-flash-preview",
      apiKey: "AIzaSyDJ4sf8T2STcANgSOyhQLkibjv_8LF6mi0",
    });

    const workflowSchema = z.object({
      steps: z.array(z.object({
        id: z.string(),
        title: z.string().describe("The description of the subtask"),
      })).describe("The sequence of subtasks to complete the user's request"),
      finalSuccessMsg: z.string().describe("Message to show when all tasks succeed"),
      finalFailMsg: z.string().describe("Message to show if a task fails"),
    });

    const structuredLlm = llm.withStructuredOutput(workflowSchema);

    const response = await structuredLlm.invoke([
      ["system", "You are a hotel management AI assistant. Break down the user's request into a sequence of logical subtasks for hotel operations. Keep it between 3 to 6 steps."],
      ["user", "Prepare the banquet hall"]
    ]);
    console.log("Success:", response);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
