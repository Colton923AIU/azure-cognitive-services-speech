// azure-cognitiveservices-speech.js

const sdk = require('microsoft-cognitiveservices-speech-sdk');

/**
 * Node.js server code to convert text to speech
 * @returns stream
 * @param {*} key your resource key
 * @param {*} region your resource region
 * @param {*} text text to convert to audio/speech
 */

const textToSpeech = async (key, region, text) =>
  // convert callback function to promise
  new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechSynthesisOutputFormat = 5;

    const audioConfig = null;
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        const { audioData } = result;
        synthesizer.close();
        return audioData;
        // if (filename) {
        //   // return stream from file
        //   const audioFile = fs.createReadStream(filename);
        //   resolve(audioFile);
        // } else {
        //   // return stream from memory
        //   const bufferStream = new PassThrough();
        //   bufferStream.end(Buffer.from(audioData));
        //   resolve(bufferStream);
        // }
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
module.exports = {
  textToSpeech,
};
