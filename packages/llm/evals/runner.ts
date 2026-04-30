import fs from "fs/promises";
import path from "path";
import { getProvider } from "../src/registry.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runEvals() {
  const provider = getProvider("anthropic");
  
  const questionsPath = path.join(__dirname, "hebrew-finance-v1.json");
  const rawData = await fs.readFile(questionsPath, "utf-8");
  const questions = JSON.parse(rawData);

  console.log(`Starting eval run for ${questions.length} questions...`);

  const results = [];

  for (const q of questions) {
    console.log(`Evaluating Q${q.id}: ${q.question}`);
    const start = Date.now();
    
    try {
      const response = await provider.chat({
        messages: [{ role: "user", content: q.question }],
        system: "You are Fini, a helpful financial assistant speaking Hebrew. Provide a short, realistic answer.",
      });
      
      const latencyMs = Date.now() - start;
      results.push({
        questionId: q.id,
        category: q.category,
        question: q.question,
        response: response.message.content,
        latencyMs,
        // Mock cost
        cost: 0.0001,
      });
      console.log(` -> Done in ${latencyMs}ms`);
    } catch (e) {
      console.error(` -> Error: ${e}`);
    }
  }

  const outputPath = path.join(__dirname, "results-v1.json");
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`Saved eval results to ${outputPath}`);
}

runEvals().catch(console.error);
