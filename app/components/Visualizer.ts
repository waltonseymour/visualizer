export default class Visualizer {
  HEIGHT: number;
  WIDTH: number;
  audioCtx: AudioContext;
  source: MediaElementAudioSourceNode;
  analyser: AnalyserNode;
  bufferLength: number;
  dataArray: Uint8Array;
  canvasCtx: CanvasRenderingContext2D;

  constructor(options) {
    this.HEIGHT = options.height || options.canvasElement.height;
    this.WIDTH = options.width || options.canvasElement.width;
    this.audioCtx = new AudioContext();
    this.source = this.audioCtx.createMediaElementSource(options.musicElement);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.canvasCtx = options.canvasElement.getContext("2d");
  }

  _draw(){
    requestAnimationFrame(this._draw.bind(this));
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.canvasCtx.lineWidth = 10;
    this.canvasCtx.strokeStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
    this.canvasCtx.beginPath();

    var sliceWidth = 2 * Math.PI / this.bufferLength;
    var theta = 0;
    var initialRadius;

    for (var i = 0; i < this.bufferLength; i++) {
      theta += sliceWidth;
      // amplitude measured from 0 - 1
      var amp = this.dataArray[i] / 256.0;
      var r = amp * Math.floor(this.HEIGHT / 2);
      var y = this.HEIGHT / 2 + Math.sin(theta) * r;
      var x = this.WIDTH / 2 + Math.cos(theta) * r;

      if (i === 0) {
        this.canvasCtx.moveTo(x, y);
        initialRadius = r;
      } else {
        this.canvasCtx.lineTo(x, y);
      }

    }
    this.canvasCtx.lineTo(this.WIDTH /2 + initialRadius, this.HEIGHT/2)
    this.canvasCtx.stroke();
  }

  draw(){
    this._draw();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }
}
