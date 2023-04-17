import mermaid from "mermaid";
import { useEffect, useState } from "react";

// Mermaid renderer component
export interface MermaidViewerProps {
  data: string;
}
export default function MermaidViewer(props: MermaidViewerProps) {
  console.log({ props });

  useEffect(() => {
    mermaid.contentLoaded();
  }, [props.data]);

  mermaid.initialize({
    startOnLoad: true,
  });

  return (
    <div className="mermaid min-w-[75vw] flex justify-center items-center">
      {props.data}
    </div>
  );
}
