/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jasmineSpecWorkerAPI", function() { return jasmineSpecWorkerAPI; });
// console.log('Web Worker ONE Loaded.');
// prevent TypeScript compile error
var customPostMessage = postMessage;
// Jasmine API
// The postMessage method has a different signature
// in the browser than in a worker.
// Supply a custom postMessage callback method to
// prevent TypeScript data type errors.
var jasmineSpecPostMessageCallback = null;
var jasmineSpecIsInBrowser;
// Strange try / catch couple with boolean logic is to
// suppress errors in both the worker and browser contexts.
// Worker throws an error for window being undefined.
// TypeScript throws errors for compiling worker.
try {
    jasmineSpecIsInBrowser = (window !== undefined);
}
catch (e) {
    jasmineSpecIsInBrowser = false; // We are a web worker!
}
function safelyParseJSON(json) {
    var parsed = {};
    try {
        parsed = JSON.parse(json);
    }
    catch (e) {
        parsed = json;
    }
    return parsed;
}
function reqListener() {
    var workerResult = {};
    if (this.status === 200) {
        workerResult = { url: this.responseURL, value: safelyParseJSON(this.responseText) };
    }
    else {
        workerResult = { url: this.responseURL, value: '' };
    }
    if (jasmineSpecIsInBrowser) {
        if (!jasmineSpecPostMessageCallback) {
            throw Error('Need postMessage callback to run jasmine specs');
        }
        else {
            jasmineSpecPostMessageCallback(workerResult);
        }
    }
    else {
        customPostMessage(workerResult);
    }
}
function transferFailed(evt) {
    console.log('An error occurred');
}
// Worker API
onmessage = function (event) {
    // worker data process
    var oReq = new XMLHttpRequest();
    // oReq.withCredentials = true;
    oReq.addEventListener('load', reqListener);
    oReq.addEventListener('error', transferFailed);
    oReq.open('GET', event.data);
    oReq.send();
};
// Jasmine API
var jasmineSpecWorkerAPI = {
    onmessage: onmessage,
    postMessage: function (cb) {
        jasmineSpecPostMessageCallback = cb;
    }
};
//# sourceMappingURL=api.worker.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=api.worker.bundle.js.map