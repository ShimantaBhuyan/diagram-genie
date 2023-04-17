// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { SBClient } from "@/utils/SBClient";
import GPT3Tokenizer from "gpt3-tokenizer";

const supabase = SBClient.getInstance();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const query = req.body.query;
    // OpenAI recommends replacing newlines with spaces for best results
    const input = query.replace(/\n/g, " ");

    console.log({ input });

    // Generate a one-time embedding for the query itself
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input,
    });

    const [{ embedding }] = embeddingResponse.data.data;
    const similarityResponse = await supabase.getSimilarEmbedding(embedding);

    if (similarityResponse.success) {
      const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
      let tokenCount = 0;
      let contextText = "";

      // Concat matched documents
      for (let i = 0; i < similarityResponse.data.length; i++) {
        const match = similarityResponse.data[i];
        const content = match.content;
        const encoded = tokenizer.encode(content);
        tokenCount += encoded.text.length;

        // Limit context to max 1500 tokens (configurable)
        if (tokenCount >= 1500) {
          break;
        }

        contextText += `${content.trim()}\n---\n`;
      }

      const SYSTEM_PROMPT = `You are a diagramming tool built using MermaidJS. You will be asked to draw different kinds of diagrams. Think step by step about what the user wants to create and then use the context below to generate the answer. Do not add any explanations or unecessary text whatsoever. Answer only the question in the appropriate markdown format without the 'mermaid' prefix, based on the context below, and if the question can't be answered based on the context, respond with the text '404-NOT_FOUND-404'. Context: ${contextText}. Remember that for entity relationship diagrams, all text for entities, attributes, relationship labels should have no space, rather they can be in camelCase, have dash or be enclosed in double quotes, but no spaces at all if the text is of multiple words. Also remember that for requirement diagrams, only element fields can have type attribute and requirement fields cannot have type attribute.`;

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Question: ${query} Answer: `,
          },
        ],
      });

      return res.status(200).json({
        success: true,
        // @ts-ignore
        data: response.data.choices[0].message.content,
      });
    } else {
      return res.status(400).json(similarityResponse);
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
