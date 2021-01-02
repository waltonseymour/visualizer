import React, { useEffect, useState } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { FileInput, H2 } from "@blueprintjs/core";
import fscreen from 'fscreen';

const runWasm = async () => {
  // Instantiate our wasm module

  let module = await import("./pkg");

  return module.run();
};

const App: React.FC = () => {
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (file == null) {
      return;
    }
    const t0 = performance.now();

    runWasm().then(() => {
      const t1 = performance.now();
      console.log(`playing song took ${t1 - t0} milliseconds.`);
    });
    
  }, [file]);

  return (
    <div style={{ display: "grid", justifyContent: "center", height: "100vh", }}>
      <div style={{ marginTop:"35vh", display: file ? "none" : "unset", }}>
        <H2>Select an audio file</H2>
        <FileInput
          style={{  width: "200px"}}
          inputProps={{ accept: "audio/*", id: "file-input" }}  
          onChange={(e) => {
            // @ts-ignore
            const file = e.target.files[0];
            setFile(file);
            // @ts-ignore
            fscreen.requestFullscreen(document.getElementById("canvas"));
          }}
        />
      </div>
      <canvas
        id="canvas"
        style={{ display: !file ? "none" : "unset", height: "100%", width: "100%" }}
        height={window.screen.height * window.devicePixelRatio}
        width={window.screen.width * window.devicePixelRatio}
      ></canvas>
    </div>
  );
};

export default App;
