// console.log('Web Worker ONE Loaded.');

// prevent TypeScript compile error
const customPostMessage: any = postMessage;

// Jasmine API
// The postMessage method has a different signature
// in the browser than in a worker.
// Supply a custom postMessage callback method to
// prevent TypeScript data type errors.
let jasmineSpecPostMessageCallback: any = null;
let jasmineSpecIsInBrowser: boolean;

// Strange try / catch couple with boolean logic is to
// suppress errors in both the worker and browser contexts.
// Worker throws an error for window being undefined.
// TypeScript throws errors for compiling worker.
try {
  jasmineSpecIsInBrowser = ( window !== undefined );
} catch (e) {
  jasmineSpecIsInBrowser = false; // We are a web worker!
}

function safelyParseJSON(json) {
  let parsed = {};
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    parsed = json;
  }
  return parsed;
}

function reqListener() {
  let workerResult = {};
  if (this.status === 200) {
    workerResult = {url: this.responseURL, value: safelyParseJSON(this.responseText)};
  } else {
    workerResult = {url: this.responseURL, value: ''};
  }
  if (jasmineSpecIsInBrowser) { // For jasmine tests running in browser
    if (!jasmineSpecPostMessageCallback) {
      throw Error('Need postMessage callback to run jasmine specs');
    } else {
      jasmineSpecPostMessageCallback(workerResult);
    }
  } else { // running in worker
    customPostMessage(workerResult);
  }
}

function transferFailed(evt) {
  console.log('An error occurred');
}

// Worker API
onmessage = function(event) {
  // worker data process
  const oReq = new XMLHttpRequest();
  oReq.withCredentials = true;
  oReq.addEventListener('load', reqListener);
  oReq.addEventListener('error', transferFailed);
  oReq.open('GET', event.data);
  oReq.send();
};

// Jasmine API
export const jasmineSpecWorkerAPI: any = {
  onmessage: onmessage,
  postMessage: ( cb: any ) => {
    jasmineSpecPostMessageCallback = cb;
  }
};
