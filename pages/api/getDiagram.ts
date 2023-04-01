import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import {
  ERD_CHAT_INPUT,
  SEQ_CHAT_INPUT,
  STATE_CHAT_INPUT,
  ERD_PREFIX,
  MIDFIX,
  ERD_POSTFIX,
  STATE_PREFIX,
  STATE_POSTFIX,
  STATE_MIDFIX,
  OUTPUT,
  COMMON_ELEMENT_VALUES_CLEANED,
  TEXT_ELEMENT_VALUES_CLEANED,
} from "@/constants";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getDiagramInput = (diagramType: string) => {
  switch (diagramType) {
    case "ERD":
      return `${ERD_PREFIX}\n${MIDFIX}${JSON.stringify(
        ERD_CHAT_INPUT
      )}\n${ERD_POSTFIX}`;
    // case "SEQ": return SEQ_CHAT_INPUT;
    case "STATE":
      return `${STATE_PREFIX}\n${MIDFIX}${JSON.stringify(
        STATE_CHAT_INPUT
      )}\n${STATE_POSTFIX}`;
    default:
      return `${ERD_PREFIX}\n${MIDFIX}${JSON.stringify(
        ERD_CHAT_INPUT
      )}\n${ERD_POSTFIX}`;
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = req.body;
    // diagramType = "ERD", "SEQ", "STATE"
    const diagramType = body.diagramType;
    const input = body.input;
    // console.log({ diagramType, input });
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: getDiagramInput(diagramType),
          },
          {
            role: "user",
            content: input,
          },
        ],
      });
      // @ts-ignore
      console.log("RESPONSE: \n", response.data.choices[0].message.content);

      //   const elems = OUTPUT.elements.map((elem) => {
      //     if (elem.type == "text") {
      //       return {
      //         ...elem,
      //         ...COMMON_ELEMENT_VALUES_CLEANED,
      //         ...TEXT_ELEMENT_VALUES_CLEANED,
      //       };
      //     }
      //     if (elem.type == "arrow") {
      //       const arrowElement = {
      //         ...elem,
      //         ...COMMON_ELEMENT_VALUES_CLEANED,
      //         ...{ startArrowhead: null, endArrowhead: "arrow" },
      //         // startBinding: {
      //         //     elementId: elem.startBinding?.elementId,
      //         //     focus: 1,
      //         //     gap: 1
      //         // },
      //         // endBinding: {
      //         //     elementId: elem.endBinding?.elementId,
      //         //     focus: 1,
      //         //     gap: 1
      //         // }
      //       };
      //       console.log("ARROW | ", {
      //         ...elem,
      //         ...COMMON_ELEMENT_VALUES_CLEANED,
      //         ...{ startArrowhead: null, endArrowhead: "arrow" },
      //         boundElements: null,
      //       });
      //       return {
      //         ...elem,
      //         ...COMMON_ELEMENT_VALUES_CLEANED,
      //         ...{ startArrowhead: null, endArrowhead: "arrow" },
      //         boundElements: null,
      //       };
      //     }
      //     return { ...elem, ...COMMON_ELEMENT_VALUES_CLEANED };
      //   });

      //   console.log({ elems });

      const excalidrawJSON = {
        type: "excalidraw",
        version: 2,
        source: "https://excalidraw.com",
        // @ts-ignore
        elements: /* elems  */ response.data.choices[0].message.content,
        appState: {
          gridSize: null,
          viewBackgroundColor: "#ffffff",
        },
        files: {},
      };
      res.status(200).json(excalidrawJSON);

      //   console.log(getDiagramInput(diagramType));
      //   res.status(200).json(getDiagramInput(diagramType));
    } catch (err) {
      res.status(400).json(`ERROR IN RESPONSE: ${err}`);
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
