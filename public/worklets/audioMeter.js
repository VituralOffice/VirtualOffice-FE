const SMOOTHING_FACTOR = 0.75; // 0.99

class AudioMeter extends AudioWorkletProcessor {
  constructor() {
    super();
    this._volume = 0;
    this._currentFrame = 0;
    this._frameCount = 50;
    this.port.onmessage = (event) => {
      // Deal with message received from the main thread - event.data
    };
  }

  process(inputs, outputs, parameters) {
    this._currentFrame++;
    if (this._currentFrame >= this._frameCount - 1) {
      const input = inputs[0];
      const samples = input[0];

      const sumSquare = samples.reduce((p, c) => p + (c * c), 0);
      const rms = Math.sqrt(sumSquare / (samples.length || 1));
      this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);
      this.port.postMessage({ volume: this._volume });
      this._currentFrame = 0;
    }

    // Don't forget to return true - else worklet is ended
    return true;
  }
}

registerProcessor('audioMeter', AudioMeter);

// const input = inputs[0];
// const samples = input[0];

// const sumSquare = samples.reduce((p, c) => p + (c * c), 0);
// const rms = Math.sqrt(sumSquare / (samples.length || 1));
// this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);
// this.port.postMessage({ volume: this._volume });
// this._currentFrame = 0;