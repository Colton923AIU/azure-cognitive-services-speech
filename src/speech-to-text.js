const sdk = require('microsoft-cognitiveservices-speech-sdk');

/**
 * Node.js function to convert speech to text
 * @param {string} key - Your resource key
 * @param {string} region - Your resource region
 * @param {string} file - Path to the WAV file
 * @returns {Promise<string>} - Promise resolving to the recognized text
 */

const speechToText = async (key, region, file) => new Promise((resolve, reject) => {
    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = sdk.AudioConfig.fromWavFileInput(file);
      const speechRecognizer = new sdk.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

      speechRecognizer.recognizeOnceAsync(
        (result) => {
          switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
              resolve(result.text);
              break;
            case sdk.ResultReason.NoMatch:
              resolve('NOMATCH: Speech could not be recognized.');
              break;
            case sdk.ResultReason.Canceled:
              const cancellation = sdk.CancellationDetails.fromResult(result);
              if (cancellation.reason === sdk.CancellationReason.Error) {
                resolve(
                  `CANCELED: ErrorCode=${cancellation.ErrorCode} CANCELED: ErrorDetails=${cancellation.errorDetails} CANCELED: Did you set the speech resource key and region values?`
                );
              } else {
                resolve(`CANCELED: Reason=${cancellation.reason}`);
              }
              break;
          }
          speechRecognizer.close();
        },
        (error) => {
          reject(error);
          speechRecognizer.close();
        }
      );
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  speechToText,
};
