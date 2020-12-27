import React, { useEffect, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [file, setFile] = useState<File>();

  useEffect(() => {
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
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      });

    audio.play();
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
        type="file"
      />
    </div>
  );
};

export default App;
