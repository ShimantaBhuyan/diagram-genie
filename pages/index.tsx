import React, { useState } from "react";
import Image from "next/image";
import mermaid from "mermaid";
import MermaidViewer from "@/components/Mermaid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ClipboardIcon } from "@/components/ClipboardIcon";
import Link from "next/link";
import ImageModal from "@/components/ImageModal";
import { DownloadIcon } from "@/components/DownloadIcon";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [mermaidInput, setMermaidInput] = useState<string | null>(null);
  const [mermaidCopied, setMermaidCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function getMermaid(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/generateDiagram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userInput,
      }),
    });
    if (response.ok) {
      const data = await response.json();

      const merData = data.data.split("\n");
      const merData2 = merData.slice(1, merData.length - 1);
      const joined = merData2.join(" ");
      mermaid.initialize({
        startOnLoad: true,
      });
      const type = mermaid.detectType(joined);
      let merDataParsed = "";
      if (type === "er") {
        merDataParsed = merData2.join(" ").replaceAll("```", "");
      } else {
        merDataParsed = merData2.join("\n").replaceAll("```", "");
      }

      setMermaidInput(merDataParsed);
    }
    setIsLoading(false);
  }

  const handleShowModal = (url: string) => {
    setModalImage(url);
    setShowModal(true);
  };

  const downloadSvg = (): void => {
    const svg: Element | null = document.querySelector(".mermaid svg");
    // @ts-ignore
    const svgData: string = new XMLSerializer().serializeToString(svg);

    // Download SVG file
    const svgBlob: Blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl: string = URL.createObjectURL(svgBlob);
    const downloadLink: HTMLAnchorElement = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "diagram.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // // Convert SVG to PNG
    // const canvas: HTMLCanvasElement = document.createElement("canvas");
    // const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    // // const img: HTMLImageElement = new Image() as HTMLImageElement;
    // const img: HTMLImageElement = new Image(svg?.clientWidth, svg?.clientHeight);
    // img.onload = () => {
    //   canvas.width = img.width;
    //   canvas.height = img.height;
    //   ctx.drawImage(img, 0, 0);
    //   const pngUrl: string = canvas.toDataURL("image/png");
    //   const downloadLink: HTMLAnchorElement = document.createElement("a");
    //   downloadLink.href = pngUrl;
    //   downloadLink.download = "diagram.png";
    //   document.body.appendChild(downloadLink);
    //   downloadLink.click();
    //   document.body.removeChild(downloadLink);
    // };
    // img.src = svgUrl;
  };

  return (
    <div className="flex flex-col justify-center items-center w-[100%] h-[100%] gap-10">
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-3xl sm:text-4xl text-center">DiagramGenie🔮</h1>
        <h2 className="text-xl sm:text-2xl text-center">
          Talk to create Software Engineering diagrams{" "}
        </h2>
        <h2 className="text-sm">
          Powered by{" "}
          <Link href="https://chat.openai.com" className="underline">
            ChatGPT
          </Link>{" "}
          and{" "}
          <Link href="https://mermaid.js.org/" className="underline">
            MermaidJS
          </Link>
        </h2>
        <h2 className="text-sm text-[#858585]">
          Some kinds of diagrams like Mindmap and others might not be generated
          properly. Contributions to the repo are welcome.
        </h2>
      </div>
      <div className="flex flex-col justify-center items-center w-full h-full gap-5">
        <textarea
          value={userInput}
          placeholder="Example: Generate a class diagram for a hospital management system"
          onChange={(e) => {
            if (e.target.value != undefined && e.target.value == "") {
              setMermaidInput(null);
            }
            setUserInput(e.target.value);
          }}
          rows={6}
          cols={30}
          className="border-2 border-slate-600 rounded-md px-4 py-2 text-md"
        ></textarea>

        <button
          type="button"
          className="flex justify-center items-center gap-4 rounded-md px-4 py-2 text-md w-fit disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed bg-white text-blue-600 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
          onClick={getMermaid}
          disabled={userInput == undefined || userInput == "" || isLoading}
        >
          {isLoading ? (
            <>
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
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
      <div className="grid grid-cols-3 gap-5 sm:p-10">
        <div className="col-span-3 sm:col-span-1 flex flex-col justify-start items-start gap-4 w-full">
          {mermaidInput ? (
            <>
              <div className="flex justify-between w-full items-center">
                <h1 className="text-lg font-medium underline">
                  Mermaid Output
                </h1>
                <CopyToClipboard
                  text={mermaidInput}
                  onCopy={() => setMermaidCopied(true)}
                >
                  <button type="button" className="relative group">
                    <ClipboardIcon copied={mermaidCopied} />
                    <div
                      id="tooltip-default"
                      role="tooltip"
                      className="absolute z-10 hidden group-hover:flex px-3 py-2 min-w-[200px] text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700"
                    >
                      Click to copy. Then paste in mermaid.live to edit the
                      diagram
                    </div>
                  </button>
                </CopyToClipboard>
              </div>
              {mermaidInput}
            </>
          ) : null}
        </div>
        <div className="col-span-3 sm:col-span-2 flex flex-col justify-start items-start gap-4 w-full">
          {mermaidInput ? (
            <>
              <div className="w-full flex justify-end">
                <button type="button" onClick={downloadSvg}>
                  <DownloadIcon />
                </button>
              </div>
              <MermaidViewer data={mermaidInput} />
            </>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Image
          src="/newSnap1.png"
          width={570}
          height={300}
          alt="screenshot of working application"
          className="rounded-md col-span-3 sm:col-span-1 cursor-pointer"
          onClick={() => handleShowModal("/newSnap1.png")}
        />
        <Image
          src="/newSnap2.png"
          width={570}
          height={300}
          alt="screenshot of working application"
          className="rounded-md col-span-3 sm:col-span-1 cursor-pointer"
          onClick={() => handleShowModal("/newSnap2.png")}
        />
        <Image
          src="/newSnap3.png"
          width={570}
          height={300}
          alt="screenshot of working application"
          className="rounded-md col-span-3 sm:col-span-1 cursor-pointer"
          onClick={() => handleShowModal("/newSnap3.png")}
        />
      </div>
      {modalImage.length && showModal ? (
        <ImageModal imgSrc={modalImage} setShowModal={setShowModal} />
      ) : null}
    </div>
  );
}
