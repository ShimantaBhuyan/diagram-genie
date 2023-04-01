"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import { Diagram } from "@/components/Diagram";

import dynamic from "next/dynamic";

const DynamicDiagram = dynamic(() => import("../components/Diagram"), {
  loading: () => <p>Loading Diagram...</p>,
  ssr: false,
});

export default function Home() {
  const [diagram, setDiagram] = useState(null);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagramType, setDiagramType] = useState("EMPTY");

  const diagramTypeUpdate = (type: string) => {
    setDiagramType(type);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const generateDiagram = async () => {
    setIsLoading(true);
    const diagramResponse = await fetch("/api/getDiagram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diagramType,
        input: userInput,
      }),
    });
    if (diagramResponse.ok) {
      const diagramOutput = await diagramResponse.json();
      console.log({ diagramOutput });
      // console.log(JSON.parse(diagramOutput.elements));
      // console.log(JSON.parse(JSON.parse(diagramOutput).elements));

      // const diagramData = JSON.parse(diagramOutput.elements);
      const diagramData = JSON.parse(diagramOutput.elements);
      setDiagram(diagramData);
    } else {
      alert(
        "We went into a very deep rabbit hole but couldn't generate the diagram."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center w-[100%] h-[100%] gap-5">
      <h1 className="text-4xl">DiagramGenie🔮</h1>
      <h2 className="text-2xl">
        Talk to create Software Engineering diagrams{" "}
      </h2>
      <div>
        <Image
          src="/snap_2.png"
          width={1330}
          height={700}
          alt="screenshot of working application"
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col gap-5 justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center w-full gap-5">
          {/* <label htmlFor="diagramType" className="text-xl">
            What type of diagram do you want to make?
          </label> */}
          <select
            name="diagramType"
            id="diagramType"
            value={diagramType}
            onChange={(e) => {
              diagramTypeUpdate(e.target.value);
              setUserInput("");
            }}
            className="border-2 border-slate-600 rounded-md px-4 py-2 text-md w-[50%] cursor-pointer"
          >
            <option value="EMPTY">Select type of diagram</option>
            <option value="ERD">Entity Relationship Diagram</option>
            <option value="STATE">State Machine Diagram</option>
            {/* <option value="SEQ">Sequence Diagram</option> */}
          </select>
        </div>
        {diagramType.length > 0 && diagramType !== "EMPTY" ? (
          <div className="flex flex-col gap-5 justify-center items-center w-full">
            <label htmlFor="diagramJSON" className="text-xl">
              Describe your diagram
            </label>
            <textarea
              name="diagramJSON"
              id="diagramJSON"
              value={userInput}
              onChange={handleInputChange}
              rows={6}
              cols={30}
              className="border-2 border-slate-600 rounded-md px-4 py-2 text-md"
            ></textarea>
          </div>
        ) : null}
        <button
          type="button"
          onClick={generateDiagram}
          className="flex justify-center items-center gap-4 rounded-md px-4 py-2 text-md w-fit disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed bg-white text-blue-600 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
          disabled={
            diagramType.length === 0 ||
            diagramType === "EMPTY" ||
            userInput.length === 0
              ? true
              : false
          }
        >
          {isLoading ? (
            <>
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
              <p>Generating ...</p>
            </>
          ) : (
            <p>Generate Diagram</p>
          )}
        </button>
      </div>
      {diagram ? (
        <div className="w-full h-full flex justify-center items-center rounded-md mt-10">
          <DynamicDiagram diagramJSON={diagram} />
        </div>
      ) : null}
    </div>
  );
}
