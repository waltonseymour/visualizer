export default class Visualizer {
  HEIGHT: number;
  WIDTH: number;
  audioCtx: AudioContext;
  source: MediaElementAudioSourceNode;
  analyser: AnalyserNode;
  bufferLength: number;
  dataArray: Uint8Array;
  canvasCtx: CanvasRenderingContext2D;

  constructor(options: any) {
    this.HEIGHT = options.height || options.canvasElement.height;
    this.WIDTH = options.width || options.canvasElement.width;
    this.audioCtx = options.audioCtx;
    this.source = options.source;
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.canvasCtx = options.canvasElement.getContext("2d");
  }

  _draw() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.canvasCtx.fillStyle = "rgb(0, 0, 0)";
    this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.canvasCtx.lineCap = "round";
    this.canvasCtx.lineWidth = 10;
    this.canvasCtx.strokeStyle = `rgb(${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
    this.canvasCtx.beginPath();

    let sliceWidth = (2 * Math.PI) / this.bufferLength;
    let theta = 0;
    let initialRadius = 0;

    for (var i = 0; i < this.bufferLength; i++) {
      theta += sliceWidth;
      // amplitude measured from 0 - 1
      const amp = this.dataArray[i] / 256.0;
      const r =
        amp * Math.floor((this.HEIGHT * 2) / 6) +
        Math.floor((this.HEIGHT * 1) / 6);
      const y = this.HEIGHT / 2 + Math.sin(theta) * r;
      const x = this.WIDTH / 2 + Math.cos(theta) * r;

      if (i === 0) {
        this.canvasCtx.moveTo(x, y);
        initialRadius = r;
      } else {
        this.canvasCtx.lineTo(x, y);
      }
    }
    this.canvasCtx.lineTo(this.WIDTH / 2 + initialRadius, this.HEIGHT / 2);
    this.canvasCtx.stroke();

    requestAnimationFrame(() => this._draw());
  }

  draw() {
    this.canvasCtx.lineCap = "round";
    //this.canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this._draw();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }
}
