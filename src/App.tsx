import React, { useEffect, useState } from "react";
import "./App.css";

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

    document.getElementById("canvas")?.requestFullscreen();
  }, [file]);

  return (
    <div className="App">
      <input
        style={{ display: file ? "none" : "unset" }}
        accept=".mp3"
        onChange={(e) => {
          // @ts-ignore
          const file = e.target.files[0];
          setFile(file);
        }}
        id="file-input"
        type="file"
      />
      <canvas
        id="canvas"
        style={{ height: "100%", width: "100%" }}
        height={window.innerHeight * window.devicePixelRatio}
        width={window.innerWidth * window.devicePixelRatio}
      ></canvas>
    </div>
  );
};

export default App;
