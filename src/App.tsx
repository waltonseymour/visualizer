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
  }, [file]);

  return (
    <div className="App">
      <input
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
        style={{ height: "600px", width: "800px" }}
        height={1200}
        width={1600}
      ></canvas>
    </div>
  );
};

export default App;
