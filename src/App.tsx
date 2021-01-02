import React, { useEffect, useState } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { FileInput, FormGroup, H2, Slider } from "@blueprintjs/core";

const runWasm = async () => {
  // Instantiate our wasm module

  let module = await import("./pkg");

  return module.run();
};

const App: React.FC = () => {
  const [file, setFile] = useState<File>();
  const [stepFactor, setStepFactor] = useState(160);
  const [colorStepFactor, setColorStepFactor] = useState(100);
  const [opacity, setOpacity] = useState(0.95);
  const [radius, setRadius] = useState(4);

  useEffect(() => {
    // @ts-ignore
    window.stepFactor = stepFactor;
  }, [stepFactor]);

  useEffect(() => {
    // @ts-ignore
    window.opacity = opacity;
  }, [opacity]);

  useEffect(() => {
    // @ts-ignore
    window.radius = radius;
  }, [radius]);

  useEffect(() => {
    // @ts-ignore
    window.colorStepFactor = 199 - colorStepFactor;
  }, [colorStepFactor]);

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
    <div
      className="bp3-dark"
      style={{
        background: "#0f0e17",
        display: "grid",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div style={{ marginTop: "35vh", display: file ? "none" : "unset" }}>
        <H2>Select an audio file</H2>
        <FileInput
          style={{ width: "250px" }}
          inputProps={{ accept: "audio/*", id: "file-input" }}
          onChange={(e) => {
            // @ts-ignore
            const file = e.target.files[0];
            setFile(file);
          }}
        />
      </div>

      <div
        id="full-screen"
        style={{
          display: !file ? "none" : "unset",
          position: "absolute",
          right: "50px",
          top: "50px",
        }}
      >
        <FormGroup
            helperText="Controls speed of radial fade"
            label="Radial Step Factor"
            labelFor="text-input"
        >
          <Slider
            min={50}
            max={400}
            stepSize={10}
            labelStepSize={100}
            value={stepFactor}
            onChange={setStepFactor}
          />
        </FormGroup>

        <FormGroup
            helperText="Controls speed of color change"
            label="Color Step Factor"
            labelFor="text-input"
        >
          <Slider
            min={1}
            max={200}
            stepSize={10}
            labelStepSize={100}
            value={colorStepFactor}
            onChange={setColorStepFactor}
          />
        </FormGroup>

        <FormGroup
            helperText="Controls opacity of old frames"
            label="Opacity Decay"
            labelFor="text-input"
        >
          <Slider
            min={.5}
            max={1}
            stepSize={0.01}
            labelStepSize={0.25}
            value={opacity}
            onChange={setOpacity}
          />
        </FormGroup>
        <FormGroup
            helperText="Controls size of waveform"
            label="Waveform Radius"
            labelFor="text-input"
        >
          <Slider
            min={0}
            max={20}
            stepSize={1}
            labelStepSize={10}
            value={radius}
            onChange={setRadius}
          />
        </FormGroup>
      </div>

      <canvas
        id="canvas"
        style={{
          display: !file ? "none" : "unset",
          height: "100%",
          width: "100%",
        }}
        height={window.innerHeight * window.devicePixelRatio}
        width={window.innerWidth * window.devicePixelRatio}
      ></canvas>
    </div>
  );
};

export default App;
