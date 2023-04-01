"use client";

import { useState, useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

const Diagram = ({ diagramJSON }: any) => {
  //   console.log({ diagramJSON });
  const excalidrawRef = useRef<any>(null);

  //   const [excalidrawAPI, setExcalidrawAPI] =
  //     useState<ExcalidrawAPIRefValue | null>(null);

  //   useEffect(() => {
  //     // console.log({ diagramJSON });
  //     // const updateScene = () => {
  //     // if (diagramJSON) {
  //     //   const sceneData = {
  //     //     elements: diagramJSON,
  //     //     appState: {
  //     //       viewBackgroundColor: "#edf2ff",
  //     //     },
  //     //   };
  //     //   console.log("sceneData :", sceneData);
  //     //   if (excalidrawRef.current) {
  //     //     console.log("UPDATING SCENE...");
  //     //     //   @ts-ignore
  //     //     excalidrawRef.current.updateScene(sceneData);
  //     //   }
  //     // }

  //     //   if (excalidrawAPI) {
  //     //     console.log("INSIDE EXCALIDRAW API");
  //     //     excalidrawAPI.updateScene(sceneData);
  //     //   }
  //     // };
  //     // if (diagramJSON) updateScene();

  //     const sceneData = {
  //       elements: diagramJSON,
  //       appState: {
  //         viewBackgroundColor: "#edf2ff",
  //       },
  //     };
  //     excalidrawRef?.current?.updateScene(sceneData);
  //   }, [diagramJSON]);

  //   const [viewModeEnabled, setViewModeEnabled] = useState(true);
  //   const [zenModeEnabled, setZenModeEnabled] = useState(false);
  //   const [gridModeEnabled, setGridModeEnabled] = useState(false);

  return (
    <div className="flex flex-col w-[900px] h-[600px] rounded-md">
      {/* <button className="update-scene" onClick={updateScene}>
          Update Scene
        </button> */}
      <Excalidraw
        // ref={(api) => setExcalidrawAPI(api)}
        ref={excalidrawRef}
        initialData={JSON.parse(
          JSON.stringify({
            elements: diagramJSON,
            appState: {
              viewBackgroundColor: "#edf2ff",
            },
          })
        )}
        onChange={(elements, state) =>
          console.log("Elements :", elements, "State : ", state)
        }
        // onPointerUpdate={(payload) => console.log({ payload })}
        //   onCollabButtonClick={() => window.alert("You clicked on collab button")}
        // viewModeEnabled={viewModeEnabled}
        // zenModeEnabled={zenModeEnabled}
        // gridModeEnabled={gridModeEnabled}
      />
    </div>
  );
};

export default Diagram;
