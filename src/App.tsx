import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Visualizer from "./visualizer";

const App: React.FC = () => {
  const [file, setFile] = useState<File>();
  const ref = useRef(null);

  useEffect(() => {
    if (file == null) {
      return;
    }

    const audioCtx = new AudioContext();
    const audio = new Audio();

    let buffer: AudioBuffer;
    file
      ?.arrayBuffer()
      .then((buf) => {
        return audioCtx.decodeAudioData(buf, (data) => (buffer = data));
      })
      .then(() => {
        const source = audioCtx.createBufferSource();
        const vis = new Visualizer({
          canvasElement: ref.current,
          source,
          audioCtx,
        });

        source.buffer = buffer;

        // source.connect(audioCtx.destination);
        source.start();
        vis.draw();
        //audio.play();
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
        style={{ height: "100%", width: "100%" }}
        ref={ref}
        id="canvas"
        height={2400}
        width={3200}
      ></canvas>
    </div>
  );
};

export default App;
