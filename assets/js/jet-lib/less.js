// /*!
//  * Less - Leaner CSS v3.8.1
//  * http://lesscss.org
//  *
//  * Copyright (c) 2009-2018, Alexis Sellier <self@cloudhead.net>
//  * Licensed under the Apache-2.0 License.
//  *
//  */

//  /** * @license Apache-2.0
//  */

// (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.less = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// var addDataAttr = require('./utils').addDataAttr,
//     browser = require('./browser');

// module.exports = function(window, options) {

//     // use options from the current script tag data attribues
//     addDataAttr(options, browser.currentScript(window));

//     if (options.isFileProtocol === undefined) {
//         options.isFileProtocol = /^(file|(chrome|safari)(-extension)?|resource|qrc|app):/.test(window.location.protocol);
//     }

//     // Load styles asynchronously (default: false)
//     //
//     // This is set to `false` by default, so that the body
//     // doesn't start loading before the stylesheets are parsed.
//     // Setting this to `true` can result in flickering.
//     //
//     options.async = options.async || false;
//     options.fileAsync = options.fileAsync || false;

//     // Interval between watch polls
//     options.poll = options.poll || (options.isFileProtocol ? 1000 : 1500);

//     options.env = options.env || (window.location.hostname == '127.0.0.1' ||
//         window.location.hostname == '0.0.0.0'   ||
//         window.location.hostname == 'localhost' ||
//         (window.location.port &&
//             window.location.port.length > 0)      ||
//         options.isFileProtocol                   ? 'development'
//         : 'production');

//     var dumpLineNumbers = /!dumpLineNumbers:(comments|mediaquery|all)/.exec(window.location.hash);
//     if (dumpLineNumbers) {
//         options.dumpLineNumbers = dumpLineNumbers[1];
//     }

//     if (options.useFileCache === undefined) {
//         options.useFileCache = true;
//     }

//     if (options.onReady === undefined) {
//         options.onReady = true;
//     }

//     if (options.relativeUrls) {
//         options.rewriteUrls = 'all';
//     }
// };

// },{"./browser":3,"./utils":11}],2:[function(require,module,exports){
// /**
//  * Kicks off less and compiles any stylesheets
//  * used in the browser distributed version of less
//  * to kick-start less using the browser api
//  */
// /* global window, document */

// // TODO - consider switching this out for a recommendation for this polyfill?
// // <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
// // Browsers have good Promise support
// require('promise/polyfill');

// var options = require('../less/default-options')();

// if (window.less) {
//     for (key in window.less) {
//         if (window.less.hasOwnProperty(key)) {
//             options[key] = window.less[key];
//         }
//     }
// }
// require('./add-default-options')(window, options);

// options.plugins = options.plugins || [];

// if (window.LESS_PLUGINS) {
//     options.plugins = options.plugins.concat(window.LESS_PLUGINS);
// }

// var less = module.exports = require('./index')(window, options);

// window.less = less;

// var css, head, style;

// // Always restore page visibility
// function resolveOrReject(data) {
//     if (data.filename) {
//         console.warn(data);
//     }
//     if (!options.async) {
//         head.removeChild(style);
//     }
// }

// if (options.onReady && typeof Jet=='undefined') {
//     if (/!watch/.test(window.location.hash)) {
//         less.watch();
//     }
//     // Simulate synchronous stylesheet loading by hiding page rendering
//     if (!options.async) {
//         css = 'body { display: none !important }';
//         head = document.head || document.getElementsByTagName('head')[0];
//         style = document.createElement('style');

//         style.type = 'text/css';
//         if (style.styleSheet) {
//             style.styleSheet.cssText = css;
//         } else {
//             style.appendChild(document.createTextNode(css));
//         }

//         head.appendChild(style);
//     }
//     less.registerStylesheetsImmediately();
//     less.pageLoadFinished = less.refresh(less.env === 'development').then(resolveOrReject, resolveOrReject);
// }

// },{"../less/default-options":17,"./add-default-options":1,"./index":8,"promise/polyfill":107}],3:[function(require,module,exports){
// var utils = require('./utils');
// module.exports = {
//     createCSS: function (document, styles, sheet) {
//         // Strip the query-string
//         var href = sheet.href || '';

//         // If there is no title set, use the filename, minus the extension
//         var id = 'less:' + (sheet.title || utils.extractId(href));

//         // If this has already been inserted into the DOM, we may need to replace it
//         var oldStyleNode = document.getElementById(id);
//         var keepOldStyleNode = false;

//         // Create a new stylesheet node for insertion or (if necessary) replacement
//         var styleNode = document.createElement('style');
//         styleNode.setAttribute('type', 'text/css');
//         if (sheet.media) {
//             styleNode.setAttribute('media', sheet.media);
//         }
//         styleNode.id = id;

//         if (!styleNode.styleSheet) {
//             styleNode.appendChild(document.createTextNode(styles));

//             // If new contents match contents of oldStyleNode, don't replace oldStyleNode
//             keepOldStyleNode = (oldStyleNode !== null && oldStyleNode.childNodes.length > 0 && styleNode.childNodes.length > 0 &&
//                 oldStyleNode.firstChild.nodeValue === styleNode.firstChild.nodeValue);
//         }

//         var head = document.getElementsByTagName('head')[0];

//         // If there is no oldStyleNode, just append; otherwise, only append if we need
//         // to replace oldStyleNode with an updated stylesheet
//         if (oldStyleNode === null || keepOldStyleNode === false) {
//             var nextEl = sheet && sheet.nextSibling || null;
//             if (nextEl) {
//                 nextEl.parentNode.insertBefore(styleNode, nextEl);
//             } else {
//                 head.appendChild(styleNode);
//             }
//         }
//         if (oldStyleNode && keepOldStyleNode === false) {
//             oldStyleNode.parentNode.removeChild(oldStyleNode);
//         }

//         // For IE.
//         // This needs to happen *after* the style element is added to the DOM, otherwise IE 7 and 8 may crash.
//         // See http://social.msdn.microsoft.com/Forums/en-US/7e081b65-878a-4c22-8e68-c10d39c2ed32/internet-explorer-crashes-appending-style-element-to-head
//         if (styleNode.styleSheet) {
//             try {
//                 styleNode.styleSheet.cssText = styles;
//             } catch (e) {
//                 throw new Error('Couldn\'t reassign styleSheet.cssText.');
//             }
//         }
//     },
//     currentScript: function(window) {
//         var document = window.document;
//         return document.currentScript || (function() {
//             var scripts = document.getElementsByTagName('script');
//             return scripts[scripts.length - 1];
//         })();
//     }
// };

// },{"./utils":11}],4:[function(require,module,exports){
// // Cache system is a bit outdated and could do with work

// module.exports = function(window, options, logger) {
//     var cache = null;
//     if (options.env !== 'development') {
//         try {
//             cache = (typeof window.localStorage === 'undefined') ? null : window.localStorage;
//         } catch (_) {}
//     }
//     return {
//         setCSS: function(path, lastModified, modifyVars, styles) {
//             if (cache) {
//                 logger.info('saving ' + path + ' to cache.');
//                 try {
//                     cache.setItem(path, styles);
//                     cache.setItem(path + ':timestamp', lastModified);
//                     if (modifyVars) {
//                         cache.setItem(path + ':vars', JSON.stringify(modifyVars));
//                     }
//                 } catch (e) {
//                     // TODO - could do with adding more robust error handling
//                     logger.error('failed to save "' + path + '" to local storage for caching.');
//                 }
//             }
//         },
//         getCSS: function(path, webInfo, modifyVars) {
//             var css       = cache && cache.getItem(path),
//                 timestamp = cache && cache.getItem(path + ':timestamp'),
//                 vars      = cache && cache.getItem(path + ':vars');

//             modifyVars = modifyVars || {};
//             vars = vars || "{}"; // if not set, treat as the JSON representation of an empty object

//             if (timestamp && webInfo.lastModified &&
//                 (new Date(webInfo.lastModified).valueOf() ===
//                     new Date(timestamp).valueOf()) &&
//                 JSON.stringify(modifyVars) === vars) {
//                 // Use local copy
//                 return css;
//             }
//         }
//     };
// };

// },{}],5:[function(require,module,exports){
// var utils = require('./utils'),
//     browser = require('./browser');

// module.exports = function(window, less, options) {

//     function errorHTML(e, rootHref) {
//         var id = 'less-error-message:' + utils.extractId(rootHref || '');
//         var template = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>';
//         var elem = window.document.createElement('div'), timer, content, errors = [];
//         var filename = e.filename || rootHref;
//         var filenameNoPath = filename.match(/([^\/]+(\?.*)?)$/)[1];

//         elem.id        = id;
//         elem.className = 'less-error-message';

//         content = '<h3>'  + (e.type || 'Syntax') + 'Error: ' + (e.message || 'There is an error in your .less file') +
//             '</h3>' + '<p>in <a href="' + filename   + '">' + filenameNoPath + '</a> ';

//         var errorline = function (e, i, classname) {
//             if (e.extract[i] !== undefined) {
//                 errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
//                     .replace(/\{class\}/, classname)
//                     .replace(/\{content\}/, e.extract[i]));
//             }
//         };

//         if (e.line) {
//             errorline(e, 0, '');
//             errorline(e, 1, 'line');
//             errorline(e, 2, '');
//             content += 'on line ' + e.line + ', column ' + (e.column + 1) + ':</p>' +
//                 '<ul>' + errors.join('') + '</ul>';
//         }
//         if (e.stack && (e.extract || options.logLevel >= 4)) {
//             content += '<br/>Stack Trace</br />' + e.stack.split('\n').slice(1).join('<br/>');
//         }
//         elem.innerHTML = content;

//         // CSS for error messages
//         browser.createCSS(window.document, [
//             '.less-error-message ul, .less-error-message li {',
//             'list-style-type: none;',
//             'margin-right: 15px;',
//             'padding: 4px 0;',
//             'margin: 0;',
//             '}',
//             '.less-error-message label {',
//             'font-size: 12px;',
//             'margin-right: 15px;',
//             'padding: 4px 0;',
//             'color: #cc7777;',
//             '}',
//             '.less-error-message pre {',
//             'color: #dd6666;',
//             'padding: 4px 0;',
//             'margin: 0;',
//             'display: inline-block;',
//             '}',
//             '.less-error-message pre.line {',
//             'color: #ff0000;',
//             '}',
//             '.less-error-message h3 {',
//             'font-size: 20px;',
//             'font-weight: bold;',
//             'padding: 15px 0 5px 0;',
//             'margin: 0;',
//             '}',
//             '.less-error-message a {',
//             'color: #10a',
//             '}',
//             '.less-error-message .error {',
//             'color: red;',
//             'font-weight: bold;',
//             'padding-bottom: 2px;',
//             'border-bottom: 1px dashed red;',
//             '}'
//         ].join('\n'), { title: 'error-message' });

//         elem.style.cssText = [
//             'font-family: Arial, sans-serif',
//             'border: 1px solid #e00',
//             'background-color: #eee',
//             'border-radius: 5px',
//             '-webkit-border-radius: 5px',
//             '-moz-border-radius: 5px',
//             'color: #e00',
//             'padding: 15px',
//             'margin-bottom: 15px'
//         ].join(';');

//         if (options.env === 'development') {
//             timer = setInterval(function () {
//                 var document = window.document,
//                     body = document.body;
//                 if (body) {
//                     if (document.getElementById(id)) {
//                         body.replaceChild(elem, document.getElementById(id));
//                     } else {
//                         body.insertBefore(elem, body.firstChild);
//                     }
//                     clearInterval(timer);
//                 }
//             }, 10);
//         }
//     }

//     function removeErrorHTML(path) {
//         var node = window.document.getElementById('less-error-message:' + utils.extractId(path));
//         if (node) {
//             node.parentNode.removeChild(node);
//         }
//     }

//     function removeErrorConsole(path) {
//         // no action
//     }

//     function removeError(path) {
//         if (!options.errorReporting || options.errorReporting === 'html') {
//             removeErrorHTML(path);
//         } else if (options.errorReporting === 'console') {
//             removeErrorConsole(path);
//         } else if (typeof options.errorReporting === 'function') {
//             options.errorReporting('remove', path);
//         }
//     }

//     function errorConsole(e, rootHref) {
//         var template = '{line} {content}';
//         var filename = e.filename || rootHref;
//         var errors = [];
//         var content = (e.type || 'Syntax') + 'Error: ' + (e.message || 'There is an error in your .less file') +
//             ' in ' + filename;

//         var errorline = function (e, i, classname) {
//             if (e.extract[i] !== undefined) {
//                 errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
//                     .replace(/\{class\}/, classname)
//                     .replace(/\{content\}/, e.extract[i]));
//             }
//         };

//         if (e.line) {
//             errorline(e, 0, '');
//             errorline(e, 1, 'line');
//             errorline(e, 2, '');
//             content += ' on line ' + e.line + ', column ' + (e.column + 1) + ':\n' +
//                 errors.join('\n');
//         }
//         if (e.stack && (e.extract || options.logLevel >= 4)) {
//             content += '\nStack Trace\n' + e.stack;
//         }
//         less.logger.error(content);
//     }

//     function error(e, rootHref) {
//         if (!options.errorReporting || options.errorReporting === 'html') {
//             errorHTML(e, rootHref);
//         } else if (options.errorReporting === 'console') {
//             errorConsole(e, rootHref);
//         } else if (typeof options.errorReporting === 'function') {
//             options.errorReporting('add', e, rootHref);
//         }
//     }

//     return {
//         add: error,
//         remove: removeError
//     };
// };

// },{"./browser":3,"./utils":11}],6:[function(require,module,exports){
// /* global window, XMLHttpRequest */

// module.exports = function(options, logger) {

//     var AbstractFileManager = require('../less/environment/abstract-file-manager.js');

//     var fileCache = {};

//     // TODOS - move log somewhere. pathDiff and doing something similar in node. use pathDiff in the other browser file for the initial load
//     var FileManager = function() {
//     };

//     FileManager.prototype = new AbstractFileManager();

//     FileManager.prototype.alwaysMakePathsAbsolute = function alwaysMakePathsAbsolute() {
//         return true;
//     };
//     FileManager.prototype.join = function join(basePath, laterPath) {
//         if (!basePath) {
//             return laterPath;
//         }
//         return this.extractUrlParts(laterPath, basePath).path;
//     };
//     FileManager.prototype.doXHR = function doXHR(url, type, callback, errback) {

//         var xhr = new XMLHttpRequest();
//         var async = options.isFileProtocol ? options.fileAsync : true;

//         if (typeof xhr.overrideMimeType === 'function') {
//             xhr.overrideMimeType('text/css');
//         }
//         logger.debug('XHR: Getting \'' + url + '\'');
//         xhr.open('GET', url, async);
//         xhr.setRequestHeader('Accept', type || 'text/x-less, text/css; q=0.9, */*; q=0.5');
//         xhr.send(null);

//         function handleResponse(xhr, callback, errback) {      
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 callback(xhr.responseText,
//                     xhr.getResponseHeader('Last-Modified'));
//             } else if (typeof errback === 'function') {
//                 errback(xhr.status, url);
//             }
//         }

//         if (options.isFileProtocol && !options.fileAsync) {
//             if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
//                 callback(xhr.responseText);
//             } else {
//                 errback(xhr.status, url);
//             }
//         } else if (async) {
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState == 4) {
//                     handleResponse(xhr, callback, errback);
//                 }
//             };
//         } else {
//             handleResponse(xhr, callback, errback);
//         }
//     };
//     FileManager.prototype.supports = function(filename, currentDirectory, options, environment) {
//         return true;
//     };

//     FileManager.prototype.clearFileCache = function() {
//         fileCache = {};
//     };

//     FileManager.prototype.loadFile = function loadFile(filename, currentDirectory, options, environment) {
//         // TODO: Add prefix support like less-node?
//         // What about multiple paths?

//         if (currentDirectory && !this.isPathAbsolute(filename)) {
//             filename = currentDirectory + filename;
//         }

//         filename = options.ext ? this.tryAppendExtension(filename, options.ext) : filename;

//         options = options || {};

//         // sheet may be set to the stylesheet for the initial load or a collection of properties including
//         // some context variables for imports
//         var hrefParts = this.extractUrlParts(filename, window.location.href);
//         var href      = hrefParts.url;
//         var self      = this;
        
//         return new Promise(function(resolve, reject) {
//             if (options.useFileCache && fileCache[href]) {
//                 try {
//                     var lessText = fileCache[href];
//                     return resolve({ contents: lessText, filename: href, webInfo: { lastModified: new Date() }});
//                 } catch (e) {
//                     return reject({ filename: href, message: 'Error loading file ' + href + ' error was ' + e.message });
//                 }
//             }

//             self.doXHR(href, options.mime, function doXHRCallback(data, lastModified) {
//                 // per file cache
//                 fileCache[href] = data;
                
//                 // Use remote copy (re-parse)
//                 resolve({ contents: data, filename: href, webInfo: { lastModified: lastModified }});
//             }, function doXHRError(status, url) {
//                 reject({ type: 'File', message: '\'' + url + '\' wasn\'t found (' + status + ')', href: href });
//             });
//         });
//     };

//     return FileManager;
// };

// },{"../less/environment/abstract-file-manager.js":18}],7:[function(require,module,exports){
// module.exports = function() {

//     var functionRegistry = require('./../less/functions/function-registry');

//     function imageSize() {
//         throw {
//             type: 'Runtime',
//             message: 'Image size functions are not supported in browser version of less'
//         };
//     }

//     var imageFunctions = {
//         'image-size': function(filePathNode) {
//             imageSize(this, filePathNode);
//             return -1;
//         },
//         'image-width': function(filePathNode) {
//             imageSize(this, filePathNode);
//             return -1;
//         },
//         'image-height': function(filePathNode) {
//             imageSize(this, filePathNode);
//             return -1;
//         }
//     };

//     functionRegistry.addMultiple(imageFunctions);
// };

// },{"./../less/functions/function-registry":27}],8:[function(require,module,exports){
// //
// // index.js
// // Should expose the additional browser functions on to the less object
// //
// var addDataAttr = require('./utils').addDataAttr,
//     browser = require('./browser');

// module.exports = function(window, options) {
//     var document = window.document;
//     var less = require('../less')();
    
//     less.options = options;
//     var environment = less.environment,
//         FileManager = require('./file-manager')(options, less.logger),
//         fileManager = new FileManager();
//     environment.addFileManager(fileManager);
//     less.FileManager = FileManager;
//     less.PluginLoader = require('./plugin-loader');

//     require('./log-listener')(less, options);
//     var errors = require('./error-reporting')(window, less, options);
//     var cache = less.cache = options.cache || require('./cache')(window, options, less.logger);
//     require('./image-size')(less.environment);

//     // Setup user functions - Deprecate?
//     if (options.functions) {
//         less.functions.functionRegistry.addMultiple(options.functions);
//     }

//     var typePattern = /^text\/(x-)?less$/;

//     function clone(obj) {
//         var cloned = {};
//         for (var prop in obj) {
//             if (obj.hasOwnProperty(prop)) {
//                 cloned[prop] = obj[prop];
//             }
//         }
//         return cloned;
//     }

//     // only really needed for phantom
//     function bind(func, thisArg) {
//         var curryArgs = Array.prototype.slice.call(arguments, 2);
//         return function() {
//             var args = curryArgs.concat(Array.prototype.slice.call(arguments, 0));
//             return func.apply(thisArg, args);
//         };
//     }

//     function loadStyles(modifyVars) {
//         var styles = document.getElementsByTagName('style'),
//             style;

//         for (var i = 0; i < styles.length; i++) {
//             style = styles[i];
//             if (style.type.match(typePattern)) {
//                 var instanceOptions = clone(options);
//                 instanceOptions.modifyVars = modifyVars;
//                 var lessText = style.innerHTML || '';
//                 instanceOptions.filename = document.location.href.replace(/#.*$/, '');

//                 /* jshint loopfunc:true */
//                 // use closure to store current style
//                 less.render(lessText, instanceOptions,
//                         bind(function(style, e, result) {
//                             if (e) {
//                                 errors.add(e, 'inline');
//                             } else {
//                                 style.type = 'text/css';
//                                 if (style.styleSheet) {
//                                     style.styleSheet.cssText = result.css;
//                                 } else {
//                                     style.innerHTML = result.css;
//                                 }
//                             }
//                         }, null, style));
//             }
//         }
//     }

//     function loadStyleSheet(sheet, callback, reload, remaining, modifyVars) {

//         var instanceOptions = clone(options);
//         addDataAttr(instanceOptions, sheet);
//         instanceOptions.mime = sheet.type;

//         if (modifyVars) {
//             instanceOptions.modifyVars = modifyVars;
//         }

//         function loadInitialFileCallback(loadedFile) {
            
//             var data = loadedFile.contents,
//                 path = loadedFile.filename,
//                 webInfo = loadedFile.webInfo;

//             var newFileInfo = {
//                 currentDirectory: fileManager.getPath(path),
//                 filename: path,
//                 rootFilename: path,
//                 rewriteUrls: instanceOptions.rewriteUrls
//             };

//             newFileInfo.entryPath = newFileInfo.currentDirectory;
//             newFileInfo.rootpath = instanceOptions.rootpath || newFileInfo.currentDirectory;

//             if (webInfo) {
//                 webInfo.remaining = remaining;

//                 var css = cache.getCSS(path, webInfo, instanceOptions.modifyVars);
//                 if (!reload && css) {
//                     webInfo.local = true;
//                     callback(null, css, data, sheet, webInfo, path);
//                     return;
//                 }

//             }

//             // TODO add tests around how this behaves when reloading
//             errors.remove(path);

//             instanceOptions.rootFileInfo = newFileInfo;            
//             less.render(data, instanceOptions, function(e, result) {
//                 if (e) {
//                     e.href = path;
//                     callback(e);
//                 } else {
//                     cache.setCSS(sheet.href, webInfo.lastModified, instanceOptions.modifyVars, result.css);
//                     callback(null, result.css, data, sheet, webInfo, path);
//                 }
//             });
//         }
        
//         fileManager.loadFile(sheet.href, null, instanceOptions, environment)
//             .then(function(loadedFile) {
//                 loadInitialFileCallback(loadedFile);
//             }).catch(function(err) {
//                 console.log(err);
//                 callback(err);
//             });

//     }

//     function loadStyleSheets(callback, reload, modifyVars) {
//         for (var i = 0; i < less.sheets.length; i++) {
//             loadStyleSheet(less.sheets[i], callback, reload, less.sheets.length - (i + 1), modifyVars);
//         }
//     }

//     function initRunningMode() {
//         if (less.env === 'development') {
//             less.watchTimer = setInterval(function () {
//                 if (less.watchMode) {
//                     fileManager.clearFileCache();
//                     loadStyleSheets(function (e, css, _, sheet, webInfo) {
//                         if (e) {
//                             errors.add(e, e.href || sheet.href);
//                         } else if (css) {
//                             browser.createCSS(window.document, css, sheet);
//                         }
//                     });
//                 }
//             }, options.poll);
//         }
//     }

//     //
//     // Watch mode
//     //
//     less.watch   = function () {
//         if (!less.watchMode ) {
//             less.env = 'development';
//             initRunningMode();
//         }
//         this.watchMode = true;
//         return true;
//     };

//     less.unwatch = function () {clearInterval(less.watchTimer); this.watchMode = false; return false; };

//     //
//     // Synchronously get all <link> tags with the 'rel' attribute set to
//     // "stylesheet/less".
//     //
//     less.registerStylesheetsImmediately = function() {
//         var links = document.getElementsByTagName('link');
//         less.sheets = [];

//         for (var i = 0; i < links.length; i++) {
//             if (links[i].rel === 'stylesheet/less' || (links[i].rel.match(/stylesheet/) &&
//                 (links[i].type.match(typePattern)))) {
//                 less.sheets.push(links[i]);
//             }
//         }
//     };

//     //
//     // Asynchronously get all <link> tags with the 'rel' attribute set to
//     // "stylesheet/less", returning a Promise.
//     //
//     less.registerStylesheets = function() {
//         return new Promise(function(resolve, reject) {
//             less.registerStylesheetsImmediately();
//             resolve();
//         });
//     };

//     //
//     // With this function, it's possible to alter variables and re-render
//     // CSS without reloading less-files
//     //
//     less.modifyVars = function(record) {
//         return less.refresh(true, record, false);
//     };

//     less.refresh = function (reload, modifyVars, clearFileCache) {
//         if ((reload || clearFileCache) && clearFileCache !== false) {
//             fileManager.clearFileCache();
//         }
//         return new Promise(function (resolve, reject) {
//             var startTime, endTime, totalMilliseconds, remainingSheets;
//             startTime = endTime = new Date();

//             // Set counter for remaining unprocessed sheets
//             remainingSheets = less.sheets.length;

//             if (remainingSheets === 0) {

//                 endTime = new Date();
//                 totalMilliseconds = endTime - startTime;
//                 less.logger.info('Less has finished and no sheets were loaded.');
//                 resolve({
//                     startTime: startTime,
//                     endTime: endTime,
//                     totalMilliseconds: totalMilliseconds,
//                     sheets: less.sheets.length
//                 });

//             } else {
//                 // Relies on less.sheets array, callback seems to be guaranteed to be called for every element of the array
//                 loadStyleSheets(function (e, css, _, sheet, webInfo) {
//                     if (e) {
//                         errors.add(e, e.href || sheet.href);
//                         reject(e);
//                         return;
//                     }
//                     if (webInfo.local) {
//                         less.logger.info('Loading ' + sheet.href + ' from cache.');
//                     } else {
//                         less.logger.info('Rendered ' + sheet.href + ' successfully.');
//                     }
//                     browser.createCSS(window.document, css, sheet);
//                     less.logger.info('CSS for ' + sheet.href + ' generated in ' + (new Date() - endTime) + 'ms');

//                     // Count completed sheet
//                     remainingSheets--;

//                     // Check if the last remaining sheet was processed and then call the promise
//                     if (remainingSheets === 0) {
//                         totalMilliseconds = new Date() - startTime;
//                         less.logger.info('Less has finished. CSS generated in ' + totalMilliseconds + 'ms');
//                         resolve({
//                             startTime: startTime,
//                             endTime: endTime,
//                             totalMilliseconds: totalMilliseconds,
//                             sheets: less.sheets.length
//                         });
//                     }
//                     endTime = new Date();
//                 }, reload, modifyVars);
//             }

//             loadStyles(modifyVars);
//         });
//     };

//     less.refreshStyles = loadStyles;
//     //add toCss;
// // window.toCss=function(str){
// //   if(str.trim()===''){
// //       return '';
// //   }
// //   var root=less.parse(str,()=>{})
// //   console.log(root)
// //   var parseTree = new less.ParseTree(root,{});
// //   var css=parseTree.toCSS({}).css;
// //   if(css===''){
// //       console.log('转换less代码出错，可能是less语法错误，请检查以下代码：')
// //       console.log(str)
// //       return str;
// //   }else{
// //       return css;
// //   }
// // }
//     less.toCss=function(str){
//         if(str.trim()===''){
//             return '';
//         }
//         var imports=new less.ImportManager('','','')
//         var root=less.parse(str,()=>{})
//         var parseTree = new less.ParseTree(root,imports);
//         var css=parseTree.toCSS(imports).css;
//         if(css===''){
//             console.warn('Jet.less 转换less代码出错，可能是less语法错误，请检查以下代码：')
//             console.warn(str)
//             return str;
//         }else{
//             return css;
//         }
//     }
//     if(typeof Jet!=='undefined'){
//         Jet.less=less
//     }else{
//         window.$toCss=less.toCss;
//     }
//     return less;
// };

// },{"../less":37,"./browser":3,"./cache":4,"./error-reporting":5,"./file-manager":6,"./image-size":7,"./log-listener":9,"./plugin-loader":10,"./utils":11}],9:[function(require,module,exports){
// module.exports = function(less, options) {

//     var logLevel_debug = 4,
//         logLevel_info = 3,
//         logLevel_warn = 2,
//         logLevel_error = 1;

//     // The amount of logging in the javascript console.
//     // 3 - Debug, information and errors
//     // 2 - Information and errors
//     // 1 - Errors
//     // 0 - None
//     // Defaults to 2
//     options.logLevel = typeof options.logLevel !== 'undefined' ? options.logLevel : (options.env === 'development' ?  logLevel_info : logLevel_error);

//     if (!options.loggers) {
//         options.loggers = [{
//             debug: function(msg) {
//                 if (options.logLevel >= logLevel_debug) {
//                     console.log(msg);
//                 }
//             },
//             info: function(msg) {
//                 if (options.logLevel >= logLevel_info) {
//                     console.log(msg);
//                 }
//             },
//             warn: function(msg) {
//                 if (options.logLevel >= logLevel_warn) {
//                     console.warn(msg);
//                 }
//             },
//             error: function(msg) {
//                 if (options.logLevel >= logLevel_error) {
//                     console.error(msg);
//                 }
//             }
//         }];
//     }
//     for (var i = 0; i < options.loggers.length; i++) {
//         less.logger.addListener(options.loggers[i]);
//     }
// };

// },{}],10:[function(require,module,exports){
// // TODO: Add tests for browser @plugin
// /* global window */

// var AbstractPluginLoader = require('../less/environment/abstract-plugin-loader.js');

// /**
//  * Browser Plugin Loader
//  */
// var PluginLoader = function(less) {
//     this.less = less;
//     // Should we shim this.require for browser? Probably not?
// };

// PluginLoader.prototype = new AbstractPluginLoader();

// PluginLoader.prototype.loadPlugin = function(filename, basePath, context, environment, fileManager) {
//     return new Promise(function(fulfill, reject) {
//         fileManager.loadFile(filename, basePath, context, environment)
//             .then(fulfill).catch(reject);
//     });
// };

// module.exports = PluginLoader;


// },{"../less/environment/abstract-plugin-loader.js":19}],11:[function(require,module,exports){
// module.exports = {
//     extractId: function(href) {
//         return href.replace(/^[a-z-]+:\/+?[^\/]+/, '')  // Remove protocol & domain
//             .replace(/[\?\&]livereload=\w+/, '')        // Remove LiveReload cachebuster
//             .replace(/^\//, '')                         // Remove root /
//             .replace(/\.[a-zA-Z]+$/, '')                // Remove simple extension
//             .replace(/[^\.\w-]+/g, '-')                 // Replace illegal characters
//             .replace(/\./g, ':');                       // Replace dots with colons(for valid id)
//     },
//     addDataAttr: function(options, tag) {
//         for (var opt in tag.dataset) {
//             if (tag.dataset.hasOwnProperty(opt)) {
//                 if (opt === 'env' || opt === 'dumpLineNumbers' || opt === 'rootpath' || opt === 'errorReporting') {
//                     options[opt] = tag.dataset[opt];
//                 } else {
//                     try {
//                         options[opt] = JSON.parse(tag.dataset[opt]);
//                     }
//                     catch (_) {}
//                 }
//             }
//         }
//     }
// };

// },{}],12:[function(require,module,exports){
// module.exports = {
//     Math: {
//         ALWAYS: 0,
//         PARENS_DIVISION: 1,
//         PARENS: 2,
//         STRICT_LEGACY: 3
//     },
//     RewriteUrls: {
//         OFF: 0,
//         LOCAL: 1,
//         ALL: 2
//     }
// };
// },{}],13:[function(require,module,exports){
// var contexts = {};
// module.exports = contexts;
// var Constants = require('./constants');

// var copyFromOriginal = function copyFromOriginal(original, destination, propertiesToCopy) {
//     if (!original) { return; }

//     for (var i = 0; i < propertiesToCopy.length; i++) {
//         if (original.hasOwnProperty(propertiesToCopy[i])) {
//             destination[propertiesToCopy[i]] = original[propertiesToCopy[i]];
//         }
//     }
// };

// /*
//  parse is used whilst parsing
//  */
// var parseCopyProperties = [
//     // options
//     'paths',            // option - unmodified - paths to search for imports on
//     'rewriteUrls',      // option - whether to adjust URL's to be relative
//     'rootpath',         // option - rootpath to append to URL's
//     'strictImports',    // option -
//     'insecure',         // option - whether to allow imports from insecure ssl hosts
//     'dumpLineNumbers',  // option - whether to dump line numbers
//     'compress',         // option - whether to compress
//     'syncImport',       // option - whether to import synchronously
//     'chunkInput',       // option - whether to chunk input. more performant but causes parse issues.
//     'mime',             // browser only - mime type for sheet import
//     'useFileCache',     // browser only - whether to use the per file session cache
//     // context
//     'processImports',   // option & context - whether to process imports. if false then imports will not be imported.
//                         // Used by the import manager to stop multiple import visitors being created.
//     'pluginManager'     // Used as the plugin manager for the session
// ];

// contexts.Parse = function(options) {
//     copyFromOriginal(options, this, parseCopyProperties);

//     if (typeof this.paths === 'string') { this.paths = [this.paths]; }
// };

// var evalCopyProperties = [
//     'paths',             // additional include paths
//     'compress',          // whether to compress
//     'ieCompat',          // whether to enforce IE compatibility (IE8 data-uri)
//     'math',              // whether math has to be within parenthesis
//     'strictUnits',       // whether units need to evaluate correctly
//     'sourceMap',         // whether to output a source map
//     'importMultiple',    // whether we are currently importing multiple copies
//     'urlArgs',           // whether to add args into url tokens
//     'javascriptEnabled', // option - whether Inline JavaScript is enabled. if undefined, defaults to false
//     'pluginManager',     // Used as the plugin manager for the session
//     'importantScope',    // used to bubble up !important statements
//     'rewriteUrls'        // option - whether to adjust URL's to be relative
// ];

// contexts.Eval = function(options, frames) {
//     copyFromOriginal(options, this, evalCopyProperties);

//     if (typeof this.paths === 'string') { this.paths = [this.paths]; }

//     this.frames = frames || [];
//     this.importantScope = this.importantScope || [];
// };

// contexts.Eval.prototype.enterCalc = function () {
//     if (!this.calcStack) {
//         this.calcStack = [];
//     }
//     this.calcStack.push(true);
//     this.inCalc = true;
// };

// contexts.Eval.prototype.exitCalc = function () {
//     this.calcStack.pop();
//     if (!this.calcStack) {
//         this.inCalc = false;
//     }
// };

// contexts.Eval.prototype.inParenthesis = function () {
//     if (!this.parensStack) {
//         this.parensStack = [];
//     }
//     this.parensStack.push(true);
// };

// contexts.Eval.prototype.outOfParenthesis = function () {
//     this.parensStack.pop();
// };

// contexts.Eval.prototype.inCalc = false;
// contexts.Eval.prototype.mathOn = true;
// contexts.Eval.prototype.isMathOn = function (op) {
//     if (!this.mathOn) {
//         return false;
//     }
//     if (op === '/' && this.math !== Constants.Math.ALWAYS && (!this.parensStack || !this.parensStack.length)) {
//         return false;
//     }
//     if (this.math > Constants.Math.PARENS_DIVISION) {
//         return this.parensStack && this.parensStack.length;
//     }
//     return true;
// };

// contexts.Eval.prototype.pathRequiresRewrite = function (path) {
//     var isRelative = this.rewriteUrls === Constants.RewriteUrls.LOCAL ? isPathLocalRelative : isPathRelative;

//     return isRelative(path);
// };

// contexts.Eval.prototype.rewritePath = function (path, rootpath) {
//     var newPath;

//     rootpath = rootpath || '';
//     newPath = this.normalizePath(rootpath + path);

//     // If a path was explicit relative and the rootpath was not an absolute path
//     // we must ensure that the new path is also explicit relative.
//     if (isPathLocalRelative(path) &&
//         isPathRelative(rootpath) &&
//         isPathLocalRelative(newPath) === false) {
//         newPath = './' + newPath;
//     }

//     return newPath;
// };

// contexts.Eval.prototype.normalizePath = function (path) {
//     var
//         segments = path.split('/').reverse(),
//         segment;

//     path = [];
//     while (segments.length !== 0) {
//         segment = segments.pop();
//         switch ( segment ) {
//             case '.':
//                 break;
//             case '..':
//                 if ((path.length === 0) || (path[path.length - 1] === '..')) {
//                     path.push( segment );
//                 } else {
//                     path.pop();
//                 }
//                 break;
//             default:
//                 path.push(segment);
//                 break;
//         }
//     }

//     return path.join('/');
// };

// function isPathRelative(path) {
//     return !/^(?:[a-z-]+:|\/|#)/i.test(path);
// }

// function isPathLocalRelative(path) {
//     return path.charAt(0) === '.';
// }

// // todo - do the same for the toCSS ?

// },{"./constants":12}],14:[function(require,module,exports){
// module.exports = {
//     'aliceblue':'#f0f8ff',
//     'antiquewhite':'#faebd7',
//     'aqua':'#00ffff',
//     'aquamarine':'#7fffd4',
//     'azure':'#f0ffff',
//     'beige':'#f5f5dc',
//     'bisque':'#ffe4c4',
//     'black':'#000000',
//     'blanchedalmond':'#ffebcd',
//     'blue':'#0000ff',
//     'blueviolet':'#8a2be2',
//     'brown':'#a52a2a',
//     'burlywood':'#deb887',
//     'cadetblue':'#5f9ea0',
//     'chartreuse':'#7fff00',
//     'chocolate':'#d2691e',
//     'coral':'#ff7f50',
//     'cornflowerblue':'#6495ed',
//     'cornsilk':'#fff8dc',
//     'crimson':'#dc143c',
//     'cyan':'#00ffff',
//     'darkblue':'#00008b',
//     'darkcyan':'#008b8b',
//     'darkgoldenrod':'#b8860b',
//     'darkgray':'#a9a9a9',
//     'darkgrey':'#a9a9a9',
//     'darkgreen':'#006400',
//     'darkkhaki':'#bdb76b',
//     'darkmagenta':'#8b008b',
//     'darkolivegreen':'#556b2f',
//     'darkorange':'#ff8c00',
//     'darkorchid':'#9932cc',
//     'darkred':'#8b0000',
//     'darksalmon':'#e9967a',
//     'darkseagreen':'#8fbc8f',
//     'darkslateblue':'#483d8b',
//     'darkslategray':'#2f4f4f',
//     'darkslategrey':'#2f4f4f',
//     'darkturquoise':'#00ced1',
//     'darkviolet':'#9400d3',
//     'deeppink':'#ff1493',
//     'deepskyblue':'#00bfff',
//     'dimgray':'#696969',
//     'dimgrey':'#696969',
//     'dodgerblue':'#1e90ff',
//     'firebrick':'#b22222',
//     'floralwhite':'#fffaf0',
//     'forestgreen':'#228b22',
//     'fuchsia':'#ff00ff',
//     'gainsboro':'#dcdcdc',
//     'ghostwhite':'#f8f8ff',
//     'gold':'#ffd700',
//     'goldenrod':'#daa520',
//     'gray':'#808080',
//     'grey':'#808080',
//     'green':'#008000',
//     'greenyellow':'#adff2f',
//     'honeydew':'#f0fff0',
//     'hotpink':'#ff69b4',
//     'indianred':'#cd5c5c',
//     'indigo':'#4b0082',
//     'ivory':'#fffff0',
//     'khaki':'#f0e68c',
//     'lavender':'#e6e6fa',
//     'lavenderblush':'#fff0f5',
//     'lawngreen':'#7cfc00',
//     'lemonchiffon':'#fffacd',
//     'lightblue':'#add8e6',
//     'lightcoral':'#f08080',
//     'lightcyan':'#e0ffff',
//     'lightgoldenrodyellow':'#fafad2',
//     'lightgray':'#d3d3d3',
//     'lightgrey':'#d3d3d3',
//     'lightgreen':'#90ee90',
//     'lightpink':'#ffb6c1',
//     'lightsalmon':'#ffa07a',
//     'lightseagreen':'#20b2aa',
//     'lightskyblue':'#87cefa',
//     'lightslategray':'#778899',
//     'lightslategrey':'#778899',
//     'lightsteelblue':'#b0c4de',
//     'lightyellow':'#ffffe0',
//     'lime':'#00ff00',
//     'limegreen':'#32cd32',
//     'linen':'#faf0e6',
//     'magenta':'#ff00ff',
//     'maroon':'#800000',
//     'mediumaquamarine':'#66cdaa',
//     'mediumblue':'#0000cd',
//     'mediumorchid':'#ba55d3',
//     'mediumpurple':'#9370d8',
//     'mediumseagreen':'#3cb371',
//     'mediumslateblue':'#7b68ee',
//     'mediumspringgreen':'#00fa9a',
//     'mediumturquoise':'#48d1cc',
//     'mediumvioletred':'#c71585',
//     'midnightblue':'#191970',
//     'mintcream':'#f5fffa',
//     'mistyrose':'#ffe4e1',
//     'moccasin':'#ffe4b5',
//     'navajowhite':'#ffdead',
//     'navy':'#000080',
//     'oldlace':'#fdf5e6',
//     'olive':'#808000',
//     'olivedrab':'#6b8e23',
//     'orange':'#ffa500',
//     'orangered':'#ff4500',
//     'orchid':'#da70d6',
//     'palegoldenrod':'#eee8aa',
//     'palegreen':'#98fb98',
//     'paleturquoise':'#afeeee',
//     'palevioletred':'#d87093',
//     'papayawhip':'#ffefd5',
//     'peachpuff':'#ffdab9',
//     'peru':'#cd853f',
//     'pink':'#ffc0cb',
//     'plum':'#dda0dd',
//     'powderblue':'#b0e0e6',
//     'purple':'#800080',
//     'rebeccapurple':'#663399',
//     'red':'#ff0000',
//     'rosybrown':'#bc8f8f',
//     'royalblue':'#4169e1',
//     'saddlebrown':'#8b4513',
//     'salmon':'#fa8072',
//     'sandybrown':'#f4a460',
//     'seagreen':'#2e8b57',
//     'seashell':'#fff5ee',
//     'sienna':'#a0522d',
//     'silver':'#c0c0c0',
//     'skyblue':'#87ceeb',
//     'slateblue':'#6a5acd',
//     'slategray':'#708090',
//     'slategrey':'#708090',
//     'snow':'#fffafa',
//     'springgreen':'#00ff7f',
//     'steelblue':'#4682b4',
//     'tan':'#d2b48c',
//     'teal':'#008080',
//     'thistle':'#d8bfd8',
//     'tomato':'#ff6347',
//     'turquoise':'#40e0d0',
//     'violet':'#ee82ee',
//     'wheat':'#f5deb3',
//     'white':'#ffffff',
//     'whitesmoke':'#f5f5f5',
//     'yellow':'#ffff00',
//     'yellowgreen':'#9acd32'
// };
// },{}],15:[function(require,module,exports){
// module.exports = {
//     colors: require('./colors'),
//     unitConversions: require('./unit-conversions')
// };

// },{"./colors":14,"./unit-conversions":16}],16:[function(require,module,exports){
// module.exports = {
//     length: {
//         'm': 1,
//         'cm': 0.01,
//         'mm': 0.001,
//         'in': 0.0254,
//         'px': 0.0254 / 96,
//         'pt': 0.0254 / 72,
//         'pc': 0.0254 / 72 * 12
//     },
//     duration: {
//         's': 1,
//         'ms': 0.001
//     },
//     angle: {
//         'rad': 1 / (2 * Math.PI),
//         'deg': 1 / 360,
//         'grad': 1 / 400,
//         'turn': 1
//     }
// };
// },{}],17:[function(require,module,exports){
// // Export a new default each time
// module.exports = function() {
//     return {
//         /* Inline Javascript - @plugin still allowed */
//         javascriptEnabled: false,

//         /* Outputs a makefile import dependency list to stdout. */
//         depends: false,

//         /* (DEPRECATED) Compress using less built-in compression. 
//          * This does an okay job but does not utilise all the tricks of 
//          * dedicated css compression. */
//         compress: false,

//         /* Runs the less parser and just reports errors without any output. */
//         lint: false,

//         /* Sets available include paths.
//          * If the file in an @import rule does not exist at that exact location, 
//          * less will look for it at the location(s) passed to this option. 
//          * You might use this for instance to specify a path to a library which 
//          * you want to be referenced simply and relatively in the less files. */
//         paths: [],

//         /* color output in the terminal */
//         color: true,

//         /* The strictImports controls whether the compiler will allow an @import inside of either 
//          * @media blocks or (a later addition) other selector blocks.
//          * See: https://github.com/less/less.js/issues/656 */
//         strictImports: false,

//         /* Allow Imports from Insecure HTTPS Hosts */
//         insecure: false,

//         /* Allows you to add a path to every generated import and url in your css. 
//          * This does not affect less import statements that are processed, just ones 
//          * that are left in the output css. */
//         rootpath: '',

//         /* By default URLs are kept as-is, so if you import a file in a sub-directory 
//          * that references an image, exactly the same URL will be output in the css. 
//          * This option allows you to re-write URL's in imported files so that the 
//          * URL is always relative to the base imported file */
//         rewriteUrls: false,

//         /* Compatibility with IE8. Used for limiting data-uri length */
//         ieCompat: false,  // true until 3.0

//         /* How to process math 
//          *   0 always           - eagerly try to solve all operations
//          *   1 parens-division  - require parens for division "/"
//          *   2 parens | strict  - require parens for all operations
//          *   3 strict-legacy    - legacy strict behavior (super-strict)
//          */
//         math: 0,

//         /* Without this option, less attempts to guess at the output unit when it does maths. */
//         strictUnits: false,

//         /* Effectively the declaration is put at the top of your base Less file, 
//          * meaning it can be used but it also can be overridden if this variable 
//          * is defined in the file. */
//         globalVars: null,

//         /* As opposed to the global variable option, this puts the declaration at the
//          * end of your base file, meaning it will override anything defined in your Less file. */
//         modifyVars: null,

//         /* This option allows you to specify a argument to go on to every URL.  */
//         urlArgs: ''
//     }
// }
// },{}],18:[function(require,module,exports){
// var abstractFileManager = function() {
// };

// abstractFileManager.prototype.getPath = function (filename) {
//     var j = filename.lastIndexOf('?');
//     if (j > 0) {
//         filename = filename.slice(0, j);
//     }
//     j = filename.lastIndexOf('/');
//     if (j < 0) {
//         j = filename.lastIndexOf('\\');
//     }
//     if (j < 0) {
//         return '';
//     }
//     return filename.slice(0, j + 1);
// };

// abstractFileManager.prototype.tryAppendExtension = function(path, ext) {
//     return /(\.[a-z]*$)|([\?;].*)$/.test(path) ? path : path + ext;
// };

// abstractFileManager.prototype.tryAppendLessExtension = function(path) {
//     return this.tryAppendExtension(path, '.less');
// };

// abstractFileManager.prototype.supportsSync = function() {
//     return false;
// };

// abstractFileManager.prototype.alwaysMakePathsAbsolute = function() {
//     return false;
// };

// abstractFileManager.prototype.isPathAbsolute = function(filename) {
//     return (/^(?:[a-z-]+:|\/|\\|#)/i).test(filename);
// };
// // TODO: pull out / replace?
// abstractFileManager.prototype.join = function(basePath, laterPath) {
//     if (!basePath) {
//         return laterPath;
//     }
//     return basePath + laterPath;
// };

// abstractFileManager.prototype.pathDiff = function pathDiff(url, baseUrl) {
//     // diff between two paths to create a relative path

//     var urlParts = this.extractUrlParts(url),
//         baseUrlParts = this.extractUrlParts(baseUrl),
//         i, max, urlDirectories, baseUrlDirectories, diff = '';
//     if (urlParts.hostPart !== baseUrlParts.hostPart) {
//         return '';
//     }
//     max = Math.max(baseUrlParts.directories.length, urlParts.directories.length);
//     for (i = 0; i < max; i++) {
//         if (baseUrlParts.directories[i] !== urlParts.directories[i]) { break; }
//     }
//     baseUrlDirectories = baseUrlParts.directories.slice(i);
//     urlDirectories = urlParts.directories.slice(i);
//     for (i = 0; i < baseUrlDirectories.length - 1; i++) {
//         diff += '../';
//     }
//     for (i = 0; i < urlDirectories.length - 1; i++) {
//         diff += urlDirectories[i] + '/';
//     }
//     return diff;
// };
// // helper function, not part of API
// abstractFileManager.prototype.extractUrlParts = function extractUrlParts(url, baseUrl) {
//     // urlParts[1] = protocol://hostname/ OR /
//     // urlParts[2] = / if path relative to host base
//     // urlParts[3] = directories
//     // urlParts[4] = filename
//     // urlParts[5] = parameters

//     var urlPartsRegex = /^((?:[a-z-]+:)?\/{2}(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i,
//         urlParts = url.match(urlPartsRegex),
//         returner = {}, rawDirectories = [], directories = [], i, baseUrlParts;

//     if (!urlParts) {
//         throw new Error('Could not parse sheet href - \'' + url + '\'');
//     }

//     // Stylesheets in IE don't always return the full path
//     if (baseUrl && (!urlParts[1] || urlParts[2])) {
//         baseUrlParts = baseUrl.match(urlPartsRegex);
//         if (!baseUrlParts) {
//             throw new Error('Could not parse page url - \'' + baseUrl + '\'');
//         }
//         urlParts[1] = urlParts[1] || baseUrlParts[1] || '';
//         if (!urlParts[2]) {
//             urlParts[3] = baseUrlParts[3] + urlParts[3];
//         }
//     }

//     if (urlParts[3]) {
//         rawDirectories = urlParts[3].replace(/\\/g, '/').split('/');

//         // collapse '..' and skip '.'
//         for (i = 0; i < rawDirectories.length; i++) {

//             if (rawDirectories[i] === '..') {
//                 directories.pop();
//             }
//             else if (rawDirectories[i] !== '.') {
//                 directories.push(rawDirectories[i]);
//             }
        
//         }
//     }

//     returner.hostPart = urlParts[1];
//     returner.directories = directories;
//     returner.rawPath = (urlParts[1] || '') + rawDirectories.join('/');
//     returner.path = (urlParts[1] || '') + directories.join('/');
//     returner.filename = urlParts[4];
//     returner.fileUrl = returner.path + (urlParts[4] || '');
//     returner.url = returner.fileUrl + (urlParts[5] || '');
//     return returner;
// };

// module.exports = abstractFileManager;

// },{}],19:[function(require,module,exports){
// var functionRegistry = require('../functions/function-registry'),
//     LessError = require('../less-error');

// var AbstractPluginLoader = function() {
//     // Implemented by Node.js plugin loader
//     this.require = function() {
//         return null;
//     }
// };

// AbstractPluginLoader.prototype.evalPlugin = function(contents, context, imports, pluginOptions, fileInfo) {

//     var loader,
//         registry,
//         pluginObj,
//         localModule,
//         pluginManager,
//         filename,
//         result;

//     pluginManager = context.pluginManager;

//     if (fileInfo) {
//         if (typeof fileInfo === 'string') {
//             filename = fileInfo;
//         }
//         else {
//             filename = fileInfo.filename;
//         }
//     }
//     var shortname = (new this.less.FileManager()).extractUrlParts(filename).filename;

//     if (filename) {
//         pluginObj = pluginManager.get(filename);

//         if (pluginObj) {
//             result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);
//             if (result) {
//                 return result;
//             }
//             try {
//                 if (pluginObj.use) {
//                     pluginObj.use.call(this.context, pluginObj);
//                 }
//             }
//             catch (e) {
//                 e.message = e.message || 'Error during @plugin call';
//                 return new LessError(e, imports, filename);
//             }
//             return pluginObj;
//         }
//     }
//     localModule = {
//         exports: {},
//         pluginManager: pluginManager,
//         fileInfo: fileInfo
//     };
//     registry = functionRegistry.create();

//     var registerPlugin = function(obj) {
//         pluginObj = obj;
//     };

//     try {
//         loader = new Function('module', 'require', 'registerPlugin', 'functions', 'tree', 'less', 'fileInfo', contents);
//         loader(localModule, this.require(filename), registerPlugin, registry, this.less.tree, this.less, fileInfo);
//     }
//     catch (e) {
//         return new LessError(e, imports, filename);
//     }

//     if (!pluginObj) {
//         pluginObj = localModule.exports;
//     }
//     pluginObj = this.validatePlugin(pluginObj, filename, shortname);

//     if (pluginObj instanceof LessError) {
//         return pluginObj;
//     }

//     if (pluginObj) {
//         pluginObj.imports = imports;
//         pluginObj.filename = filename;

//         // For < 3.x (or unspecified minVersion) - setOptions() before install()
//         if (!pluginObj.minVersion || this.compareVersion('3.0.0', pluginObj.minVersion) < 0) {
//             result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);

//             if (result) {
//                 return result;
//             }
//         }

//         // Run on first load
//         pluginManager.addPlugin(pluginObj, fileInfo.filename, registry);
//         pluginObj.functions = registry.getLocalFunctions();

//         // Need to call setOptions again because the pluginObj might have functions
//         result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);
//         if (result) {
//             return result;
//         }

//         // Run every @plugin call
//         try {
//             if (pluginObj.use) {
//                 pluginObj.use.call(this.context, pluginObj);
//             }
//         }
//         catch (e) {
//             e.message = e.message || 'Error during @plugin call';
//             return new LessError(e, imports, filename);
//         }

//     }
//     else {
//         return new LessError({ message: 'Not a valid plugin' }, imports, filename);
//     }

//     return pluginObj;

// };

// AbstractPluginLoader.prototype.trySetOptions = function(plugin, filename, name, options) {
//     if (options && !plugin.setOptions) {
//         return new LessError({
//             message: 'Options have been provided but the plugin ' +
//                 name + ' does not support any options.'
//         });
//     }
//     try {
//         plugin.setOptions && plugin.setOptions(options);
//     }
//     catch (e) {
//         return new LessError(e);
//     }
// };

// AbstractPluginLoader.prototype.validatePlugin = function(plugin, filename, name) {
//     if (plugin) {
//         // support plugins being a function
//         // so that the plugin can be more usable programmatically
//         if (typeof plugin === 'function') {
//             plugin = new plugin();
//         }

//         if (plugin.minVersion) {
//             if (this.compareVersion(plugin.minVersion, this.less.version) < 0) {
//                 return new LessError({
//                     message: 'Plugin ' + name + ' requires version ' +
//                         this.versionToString(plugin.minVersion)
//                 });
//             }
//         }
//         return plugin;
//     }
//     return null;
// };

// AbstractPluginLoader.prototype.compareVersion = function(aVersion, bVersion) {
//     if (typeof aVersion === 'string') {
//         aVersion = aVersion.match(/^(\d+)\.?(\d+)?\.?(\d+)?/);
//         aVersion.shift();
//     }
//     for (var i = 0; i < aVersion.length; i++) {
//         if (aVersion[i] !== bVersion[i]) {
//             return parseInt(aVersion[i]) > parseInt(bVersion[i]) ? -1 : 1;
//         }
//     }
//     return 0;
// };
// AbstractPluginLoader.prototype.versionToString = function(version) {
//     var versionString = '';
//     for (var i = 0; i < version.length; i++) {
//         versionString += (versionString ? '.' : '') + version[i];
//     }
//     return versionString;
// };
// AbstractPluginLoader.prototype.printUsage = function(plugins) {
//     for (var i = 0; i < plugins.length; i++) {
//         var plugin = plugins[i];
//         if (plugin.printUsage) {
//             plugin.printUsage();
//         }
//     }
// };

// module.exports = AbstractPluginLoader;


// },{"../functions/function-registry":27,"../less-error":38}],20:[function(require,module,exports){
// /**
//  * @todo Document why this abstraction exists, and the relationship between
//  *       environment, file managers, and plugin manager
//  */

// var logger = require('../logger');
// var environment = function(externalEnvironment, fileManagers) {
//     this.fileManagers = fileManagers || [];
//     externalEnvironment = externalEnvironment || {};

//     var optionalFunctions = ['encodeBase64', 'mimeLookup', 'charsetLookup', 'getSourceMapGenerator'],
//         requiredFunctions = [],
//         functions = requiredFunctions.concat(optionalFunctions);

//     for (var i = 0; i < functions.length; i++) {
//         var propName = functions[i],
//             environmentFunc = externalEnvironment[propName];
//         if (environmentFunc) {
//             this[propName] = environmentFunc.bind(externalEnvironment);
//         } else if (i < requiredFunctions.length) {
//             this.warn('missing required function in environment - ' + propName);
//         }
//     }
// };

// environment.prototype.getFileManager = function (filename, currentDirectory, options, environment, isSync) {

//     if (!filename) {
//         logger.warn('getFileManager called with no filename.. Please report this issue. continuing.');
//     }
//     if (currentDirectory == null) {
//         logger.warn('getFileManager called with null directory.. Please report this issue. continuing.');
//     }

//     var fileManagers = this.fileManagers;
//     if (options.pluginManager) {
//         fileManagers = [].concat(fileManagers).concat(options.pluginManager.getFileManagers());
//     }
//     for (var i = fileManagers.length - 1; i >= 0 ; i--) {
//         var fileManager = fileManagers[i];
//         if (fileManager[isSync ? 'supportsSync' : 'supports'](filename, currentDirectory, options, environment)) {
//             return fileManager;
//         }
//     }
//     return null;
// };

// environment.prototype.addFileManager = function (fileManager) {
//     this.fileManagers.push(fileManager);
// };

// environment.prototype.clearFileManagers = function () {
//     this.fileManagers = [];
// };

// module.exports = environment;

// },{"../logger":39}],21:[function(require,module,exports){

// var functionRegistry = require('./function-registry'),
//     Anonymous = require('../tree/anonymous'),
//     Keyword = require('../tree/keyword');

// functionRegistry.addMultiple({
//     boolean: function(condition) {
//         return condition ? Keyword.True : Keyword.False;
//     },

//     'if': function(condition, trueValue, falseValue) {
//         return condition ? trueValue
//             : (falseValue || new Anonymous);
//     }
// });

// },{"../tree/anonymous":50,"../tree/keyword":70,"./function-registry":27}],22:[function(require,module,exports){
// var Color = require('../tree/color'),
//     functionRegistry = require('./function-registry');

// // Color Blending
// // ref: http://www.w3.org/TR/compositing-1

// function colorBlend(mode, color1, color2) {
//     var ab = color1.alpha, cb, // backdrop
//         as = color2.alpha, cs, // source
//         ar, cr, r = [];        // result

//     ar = as + ab * (1 - as);
//     for (var i = 0; i < 3; i++) {
//         cb = color1.rgb[i] / 255;
//         cs = color2.rgb[i] / 255;
//         cr = mode(cb, cs);
//         if (ar) {
//             cr = (as * cs + ab * (cb -
//                   as * (cb + cs - cr))) / ar;
//         }
//         r[i] = cr * 255;
//     }

//     return new Color(r, ar);
// }

// var colorBlendModeFunctions = {
//     multiply: function(cb, cs) {
//         return cb * cs;
//     },
//     screen: function(cb, cs) {
//         return cb + cs - cb * cs;
//     },
//     overlay: function(cb, cs) {
//         cb *= 2;
//         return (cb <= 1) ?
//             colorBlendModeFunctions.multiply(cb, cs) :
//             colorBlendModeFunctions.screen(cb - 1, cs);
//     },
//     softlight: function(cb, cs) {
//         var d = 1, e = cb;
//         if (cs > 0.5) {
//             e = 1;
//             d = (cb > 0.25) ? Math.sqrt(cb)
//                 : ((16 * cb - 12) * cb + 4) * cb;
//         }
//         return cb - (1 - 2 * cs) * e * (d - cb);
//     },
//     hardlight: function(cb, cs) {
//         return colorBlendModeFunctions.overlay(cs, cb);
//     },
//     difference: function(cb, cs) {
//         return Math.abs(cb - cs);
//     },
//     exclusion: function(cb, cs) {
//         return cb + cs - 2 * cb * cs;
//     },

//     // non-w3c functions:
//     average: function(cb, cs) {
//         return (cb + cs) / 2;
//     },
//     negation: function(cb, cs) {
//         return 1 - Math.abs(cb + cs - 1);
//     }
// };

// for (var f in colorBlendModeFunctions) {
//     if (colorBlendModeFunctions.hasOwnProperty(f)) {
//         colorBlend[f] = colorBlend.bind(null, colorBlendModeFunctions[f]);
//     }
// }

// functionRegistry.addMultiple(colorBlend);

// },{"../tree/color":55,"./function-registry":27}],23:[function(require,module,exports){
// var Dimension = require('../tree/dimension'),
//     Color = require('../tree/color'),
//     Quoted = require('../tree/quoted'),
//     Anonymous = require('../tree/anonymous'),
//     functionRegistry = require('./function-registry'),
//     colorFunctions;

// function clamp(val) {
//     return Math.min(1, Math.max(0, val));
// }
// function hsla(origColor, hsl) {
//     var color = colorFunctions.hsla(hsl.h, hsl.s, hsl.l, hsl.a);
//     if (color) {
//         if (origColor.value && 
//             /^(rgb|hsl)/.test(origColor.value)) {
//             color.value = origColor.value;
//         } else {
//             color.value = 'rgb';
//         }
//         return color;
//     }
// }
// function number(n) {
//     if (n instanceof Dimension) {
//         return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
//     } else if (typeof n === 'number') {
//         return n;
//     } else {
//         throw {
//             type: 'Argument',
//             message: 'color functions take numbers as parameters'
//         };
//     }
// }
// function scaled(n, size) {
//     if (n instanceof Dimension && n.unit.is('%')) {
//         return parseFloat(n.value * size / 100);
//     } else {
//         return number(n);
//     }
// }
// colorFunctions = {
//     rgb: function (r, g, b) {
//         var color = colorFunctions.rgba(r, g, b, 1.0);
//         if (color) {
//             color.value = 'rgb';
//             return color;
//         }
//     },
//     rgba: function (r, g, b, a) {
//         try {
//             if (r instanceof Color) {
//                 if (g) {
//                     a = number(g);
//                 } else {
//                     a = r.alpha;
//                 }
//                 return new Color(r.rgb, a, 'rgba');
//             }
//             var rgb = [r, g, b].map(function (c) { return scaled(c, 255); });
//             a = number(a);
//             return new Color(rgb, a, 'rgba');
//         }
//         catch (e) {}
//     },
//     hsl: function (h, s, l) {
//         var color = colorFunctions.hsla(h, s, l, 1.0);
//         if (color) {
//             color.value = 'hsl';
//             return color;
//         }
//     },
//     hsla: function (h, s, l, a) {
//         try {
//             if (h instanceof Color) {
//                 if (s) {
//                     a = number(s);
//                 } else {
//                     a = h.alpha;
//                 }
//                 return new Color(h.rgb, a, 'hsla');
//             }

//             var m1, m2;

//             function hue(h) {
//                 h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
//                 if (h * 6 < 1) {
//                     return m1 + (m2 - m1) * h * 6;
//                 }
//                 else if (h * 2 < 1) {
//                     return m2;
//                 }
//                 else if (h * 3 < 2) {
//                     return m1 + (m2 - m1) * (2 / 3 - h) * 6;
//                 }
//                 else {
//                     return m1;
//                 }
//             }

//             h = (number(h) % 360) / 360;
//             s = clamp(number(s)); l = clamp(number(l)); a = clamp(number(a));

//             m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
//             m1 = l * 2 - m2;

//             var rgb = [
//                 hue(h + 1 / 3) * 255,
//                 hue(h)       * 255,
//                 hue(h - 1 / 3) * 255
//             ];
//             a = number(a);
//             return new Color(rgb, a, 'hsla');
//         }
//         catch (e) {}
//     },

//     hsv: function(h, s, v) {
//         return colorFunctions.hsva(h, s, v, 1.0);
//     },

//     hsva: function(h, s, v, a) {
//         h = ((number(h) % 360) / 360) * 360;
//         s = number(s); v = number(v); a = number(a);

//         var i, f;
//         i = Math.floor((h / 60) % 6);
//         f = (h / 60) - i;

//         var vs = [v,
//             v * (1 - s),
//             v * (1 - f * s),
//             v * (1 - (1 - f) * s)];
//         var perm = [[0, 3, 1],
//             [2, 0, 1],
//             [1, 0, 3],
//             [1, 2, 0],
//             [3, 1, 0],
//             [0, 1, 2]];

//         return colorFunctions.rgba(vs[perm[i][0]] * 255,
//             vs[perm[i][1]] * 255,
//             vs[perm[i][2]] * 255,
//             a);
//     },

//     hue: function (color) {
//         return new Dimension(color.toHSL().h);
//     },
//     saturation: function (color) {
//         return new Dimension(color.toHSL().s * 100, '%');
//     },
//     lightness: function (color) {
//         return new Dimension(color.toHSL().l * 100, '%');
//     },
//     hsvhue: function(color) {
//         return new Dimension(color.toHSV().h);
//     },
//     hsvsaturation: function (color) {
//         return new Dimension(color.toHSV().s * 100, '%');
//     },
//     hsvvalue: function (color) {
//         return new Dimension(color.toHSV().v * 100, '%');
//     },
//     red: function (color) {
//         return new Dimension(color.rgb[0]);
//     },
//     green: function (color) {
//         return new Dimension(color.rgb[1]);
//     },
//     blue: function (color) {
//         return new Dimension(color.rgb[2]);
//     },
//     alpha: function (color) {
//         return new Dimension(color.toHSL().a);
//     },
//     luma: function (color) {
//         return new Dimension(color.luma() * color.alpha * 100, '%');
//     },
//     luminance: function (color) {
//         var luminance =
//             (0.2126 * color.rgb[0] / 255) +
//                 (0.7152 * color.rgb[1] / 255) +
//                 (0.0722 * color.rgb[2] / 255);

//         return new Dimension(luminance * color.alpha * 100, '%');
//     },
//     saturate: function (color, amount, method) {
//         // filter: saturate(3.2);
//         // should be kept as is, so check for color
//         if (!color.rgb) {
//             return null;
//         }
//         var hsl = color.toHSL();

//         if (typeof method !== 'undefined' && method.value === 'relative') {
//             hsl.s +=  hsl.s * amount.value / 100;
//         }
//         else {
//             hsl.s += amount.value / 100;
//         }
//         hsl.s = clamp(hsl.s);
//         return hsla(color, hsl);
//     },
//     desaturate: function (color, amount, method) {
//         var hsl = color.toHSL();

//         if (typeof method !== 'undefined' && method.value === 'relative') {
//             hsl.s -=  hsl.s * amount.value / 100;
//         }
//         else {
//             hsl.s -= amount.value / 100;
//         }
//         hsl.s = clamp(hsl.s);
//         return hsla(color, hsl);
//     },
//     lighten: function (color, amount, method) {
//         var hsl = color.toHSL();

//         if (typeof method !== 'undefined' && method.value === 'relative') {
//             hsl.l +=  hsl.l * amount.value / 100;
//         }
//         else {
//             hsl.l += amount.value / 100;
//         }
//         hsl.l = clamp(hsl.l);
//         return hsla(color, hsl);
//     },
//     darken: function (color, amount, method) {
//         var hsl = color.toHSL();

//         if (typeof method !== 'undefined' && method.value === 'relative') {
//             hsl.l -=  hsl.l * amount.value / 100;
//         }
//         else {
//             hsl.l -= amount.value / 100;
//         }
//         hsl.l = clamp(hsl.l);
//         return hsla(color, hsl);
//     },
//     fadein: function (color, amount, method) {
//         var hsl = color.toHSL();

//         if (typeof method !== 'undefined' && method.value === 'relative') {
//             hsl.a +=  hsl.a * amount.value / 100;
//         }
//         else {
//             hsl.a += amount.value / 100;
//         }
//         hsl.a = clamp(hsl.a);
//         return hsla(color, hsl);
//     },
//     fadeout: function (color, amount, method) {
//         var hsl = color.toHSL();

//         if (typeof method !== 'undefined' && method.value === 'relative') {
//             hsl.a -=  hsl.a * amount.value / 100;
//         }
//         else {
//             hsl.a -= amount.value / 100;
//         }
//         hsl.a = clamp(hsl.a);
//         return hsla(color, hsl);
//     },
//     fade: function (color, amount) {
//         var hsl = color.toHSL();

//         hsl.a = amount.value / 100;
//         hsl.a = clamp(hsl.a);
//         return hsla(color, hsl);
//     },
//     spin: function (color, amount) {
//         var hsl = color.toHSL();
//         var hue = (hsl.h + amount.value) % 360;

//         hsl.h = hue < 0 ? 360 + hue : hue;

//         return hsla(color, hsl);
//     },
//     //
//     // Copyright (c) 2006-2009 Hampton Catlin, Natalie Weizenbaum, and Chris Eppstein
//     // http://sass-lang.com
//     //
//     mix: function (color1, color2, weight) {
//         if (!color1.toHSL || !color2.toHSL) {
//             console.log(color2.type);
//             console.dir(color2);
//         }
//         if (!weight) {
//             weight = new Dimension(50);
//         }
//         var p = weight.value / 100.0;
//         var w = p * 2 - 1;
//         var a = color1.toHSL().a - color2.toHSL().a;

//         var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
//         var w2 = 1 - w1;

//         var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
//             color1.rgb[1] * w1 + color2.rgb[1] * w2,
//             color1.rgb[2] * w1 + color2.rgb[2] * w2];

//         var alpha = color1.alpha * p + color2.alpha * (1 - p);

//         return new Color(rgb, alpha);
//     },
//     greyscale: function (color) {
//         return colorFunctions.desaturate(color, new Dimension(100));
//     },
//     contrast: function (color, dark, light, threshold) {
//         // filter: contrast(3.2);
//         // should be kept as is, so check for color
//         if (!color.rgb) {
//             return null;
//         }
//         if (typeof light === 'undefined') {
//             light = colorFunctions.rgba(255, 255, 255, 1.0);
//         }
//         if (typeof dark === 'undefined') {
//             dark = colorFunctions.rgba(0, 0, 0, 1.0);
//         }
//         // Figure out which is actually light and dark:
//         if (dark.luma() > light.luma()) {
//             var t = light;
//             light = dark;
//             dark = t;
//         }
//         if (typeof threshold === 'undefined') {
//             threshold = 0.43;
//         } else {
//             threshold = number(threshold);
//         }
//         if (color.luma() < threshold) {
//             return light;
//         } else {
//             return dark;
//         }
//     },
//     // Changes made in 2.7.0 - Reverted in 3.0.0
//     // contrast: function (color, color1, color2, threshold) {
//     //     // Return which of `color1` and `color2` has the greatest contrast with `color`
//     //     // according to the standard WCAG contrast ratio calculation.
//     //     // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
//     //     // The threshold param is no longer used, in line with SASS.
//     //     // filter: contrast(3.2);
//     //     // should be kept as is, so check for color
//     //     if (!color.rgb) {
//     //         return null;
//     //     }
//     //     if (typeof color1 === 'undefined') {
//     //         color1 = colorFunctions.rgba(0, 0, 0, 1.0);
//     //     }
//     //     if (typeof color2 === 'undefined') {
//     //         color2 = colorFunctions.rgba(255, 255, 255, 1.0);
//     //     }
//     //     var contrast1, contrast2;
//     //     var luma = color.luma();
//     //     var luma1 = color1.luma();
//     //     var luma2 = color2.luma();
//     //     // Calculate contrast ratios for each color
//     //     if (luma > luma1) {
//     //         contrast1 = (luma + 0.05) / (luma1 + 0.05);
//     //     } else {
//     //         contrast1 = (luma1 + 0.05) / (luma + 0.05);
//     //     }
//     //     if (luma > luma2) {
//     //         contrast2 = (luma + 0.05) / (luma2 + 0.05);
//     //     } else {
//     //         contrast2 = (luma2 + 0.05) / (luma + 0.05);
//     //     }
//     //     if (contrast1 > contrast2) {
//     //         return color1;
//     //     } else {
//     //         return color2;
//     //     }
//     // },
//     argb: function (color) {
//         return new Anonymous(color.toARGB());
//     },
//     color: function(c) {
//         if ((c instanceof Quoted) &&
//             (/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})$/i.test(c.value))) {
//             var val = c.value.slice(1);
//             return new Color(val, undefined, '#' + val);
//         }
//         if ((c instanceof Color) || (c = Color.fromKeyword(c.value))) {
//             c.value = undefined;
//             return c;
//         }
//         throw {
//             type:    'Argument',
//             message: 'argument must be a color keyword or 3|4|6|8 digit hex e.g. #FFF'
//         };
//     },
//     tint: function(color, amount) {
//         return colorFunctions.mix(colorFunctions.rgb(255, 255, 255), color, amount);
//     },
//     shade: function(color, amount) {
//         return colorFunctions.mix(colorFunctions.rgb(0, 0, 0), color, amount);
//     }
// };
// functionRegistry.addMultiple(colorFunctions);

// },{"../tree/anonymous":50,"../tree/color":55,"../tree/dimension":62,"../tree/quoted":80,"./function-registry":27}],24:[function(require,module,exports){
// module.exports = function(environment) {
//     var Quoted = require('../tree/quoted'),
//         URL = require('../tree/url'),
//         utils = require('../utils'),
//         functionRegistry = require('./function-registry'),
//         fallback = function(functionThis, node) {
//             return new URL(node, functionThis.index, functionThis.currentFileInfo).eval(functionThis.context);
//         },
//         logger = require('../logger');

//     functionRegistry.add('data-uri', function(mimetypeNode, filePathNode) {

//         if (!filePathNode) {
//             filePathNode = mimetypeNode;
//             mimetypeNode = null;
//         }

//         var mimetype = mimetypeNode && mimetypeNode.value;
//         var filePath = filePathNode.value;
//         var currentFileInfo = this.currentFileInfo;
//         var currentDirectory = currentFileInfo.rewriteUrls ?
//             currentFileInfo.currentDirectory : currentFileInfo.entryPath;

//         var fragmentStart = filePath.indexOf('#');
//         var fragment = '';
//         if (fragmentStart !== -1) {
//             fragment = filePath.slice(fragmentStart);
//             filePath = filePath.slice(0, fragmentStart);
//         }
//         var context = utils.clone(this.context);
//         context.rawBuffer = true;

//         var fileManager = environment.getFileManager(filePath, currentDirectory, context, environment, true);

//         if (!fileManager) {
//             return fallback(this, filePathNode);
//         }

//         var useBase64 = false;

//         // detect the mimetype if not given
//         if (!mimetypeNode) {

//             mimetype = environment.mimeLookup(filePath);

//             if (mimetype === 'image/svg+xml') {
//                 useBase64 = false;
//             } else {
//                 // use base 64 unless it's an ASCII or UTF-8 format
//                 var charset = environment.charsetLookup(mimetype);
//                 useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
//             }
//             if (useBase64) { mimetype += ';base64'; }
//         }
//         else {
//             useBase64 = /;base64$/.test(mimetype);
//         }

//         var fileSync = fileManager.loadFileSync(filePath, currentDirectory, context, environment);
//         if (!fileSync.contents) {
//             logger.warn('Skipped data-uri embedding of ' + filePath + ' because file not found');
//             return fallback(this, filePathNode || mimetypeNode);
//         }
//         var buf = fileSync.contents;
//         if (useBase64 && !environment.encodeBase64) {
//             return fallback(this, filePathNode);
//         }

//         buf = useBase64 ? environment.encodeBase64(buf) : encodeURIComponent(buf);

//         var uri = 'data:' + mimetype + ',' + buf + fragment;

//         // IE8 cannot handle a data-uri larger than 32,768 characters. If this is exceeded
//         // and the --ieCompat flag is enabled, return a normal url() instead.
//         var DATA_URI_MAX = 32768;
//         if (uri.length >= DATA_URI_MAX) {

//             if (this.context.ieCompat !== false) {
//                 logger.warn('Skipped data-uri embedding of ' + filePath + ' because its size (' + uri.length +
//                     ' characters) exceeds IE8-safe ' + DATA_URI_MAX + ' characters!');

//                 return fallback(this, filePathNode || mimetypeNode);
//             }
//         }

//         return new URL(new Quoted('"' + uri + '"', uri, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
//     });
// };

// },{"../logger":39,"../tree/quoted":80,"../tree/url":85,"../utils":89,"./function-registry":27}],25:[function(require,module,exports){
// var Keyword = require('../tree/keyword'),
//     functionRegistry = require('./function-registry');

// var defaultFunc = {
//     eval: function () {
//         var v = this.value_, e = this.error_;
//         if (e) {
//             throw e;
//         }
//         if (v != null) {
//             return v ? Keyword.True : Keyword.False;
//         }
//     },
//     value: function (v) {
//         this.value_ = v;
//     },
//     error: function (e) {
//         this.error_ = e;
//     },
//     reset: function () {
//         this.value_ = this.error_ = null;
//     }
// };

// functionRegistry.add('default', defaultFunc.eval.bind(defaultFunc));

// module.exports = defaultFunc;

// },{"../tree/keyword":70,"./function-registry":27}],26:[function(require,module,exports){
// var Expression = require('../tree/expression');

// var functionCaller = function(name, context, index, currentFileInfo) {
//     this.name = name.toLowerCase();
//     this.index = index;
//     this.context = context;
//     this.currentFileInfo = currentFileInfo;

//     this.func = context.frames[0].functionRegistry.get(this.name);
// };
// functionCaller.prototype.isValid = function() {
//     return Boolean(this.func);
// };

// functionCaller.prototype.call = function(args) {
//     // This code is terrible and should be replaced as per this issue...
//     // https://github.com/less/less.js/issues/2477
//     if (Array.isArray(args)) {
//         args = args.filter(function (item) {
//             if (item.type === 'Comment') {
//                 return false;
//             }
//             return true;
//         })
//         .map(function(item) {
//             if (item.type === 'Expression') {
//                 var subNodes = item.value.filter(function (item) {
//                     if (item.type === 'Comment') {
//                         return false;
//                     }
//                     return true;
//                 });
//                 if (subNodes.length === 1) {
//                     return subNodes[0];
//                 } else {
//                     return new Expression(subNodes);
//                 }
//             }
//             return item;
//         });
//     }

//     return this.func.apply(this, args);
// };

// module.exports = functionCaller;

// },{"../tree/expression":64}],27:[function(require,module,exports){
// function makeRegistry( base ) {
//     return {
//         _data: {},
//         add: function(name, func) {
//             // precautionary case conversion, as later querying of
//             // the registry by function-caller uses lower case as well.
//             name = name.toLowerCase();

//             if (this._data.hasOwnProperty(name)) {
//                 // TODO warn
//             }
//             this._data[name] = func;
//         },
//         addMultiple: function(functions) {
//             Object.keys(functions).forEach(
//                 function(name) {
//                     this.add(name, functions[name]);
//                 }.bind(this));
//         },
//         get: function(name) {
//             return this._data[name] || ( base && base.get( name ));
//         },
//         getLocalFunctions: function() {
//             return this._data;
//         },
//         inherit: function() {
//             return makeRegistry( this );
//         },
//         create: function(base) {
//             return makeRegistry(base);
//         }
//     };
// }

// module.exports = makeRegistry( null );
// },{}],28:[function(require,module,exports){
// module.exports = function(environment) {
//     var functions = {
//         functionRegistry: require('./function-registry'),
//         functionCaller: require('./function-caller')
//     };

//     // register functions
//     require('./boolean');
//     require('./default');
//     require('./color');
//     require('./color-blending');
//     require('./data-uri')(environment);
//     require('./list');
//     require('./math');
//     require('./number');
//     require('./string');
//     require('./svg')(environment);
//     require('./types');

//     return functions;
// };

// },{"./boolean":21,"./color":23,"./color-blending":22,"./data-uri":24,"./default":25,"./function-caller":26,"./function-registry":27,"./list":29,"./math":31,"./number":32,"./string":33,"./svg":34,"./types":35}],29:[function(require,module,exports){
// var Dimension = require('../tree/dimension'),
//     Declaration = require('../tree/declaration'),
//     Ruleset = require('../tree/ruleset'),
//     Selector = require('../tree/selector'),
//     Element = require('../tree/element'),
//     functionRegistry = require('./function-registry');

// var getItemsFromNode = function(node) {
//     // handle non-array values as an array of length 1
//     // return 'undefined' if index is invalid
//     var items = Array.isArray(node.value) ?
//         node.value : Array(node);

//     return items;
// };

// functionRegistry.addMultiple({
//     _SELF: function(n) {
//         return n;
//     },
//     extract: function(values, index) {
//         index = index.value - 1; // (1-based index)

//         return getItemsFromNode(values)[index];
//     },
//     length: function(values) {
//         return new Dimension(getItemsFromNode(values).length);
//     },
//     each: function(list, rs) {
//         var i = 0, rules = [], newRules, iterator;

//         if (list.value) {
//             if (Array.isArray(list.value)) {
//                 iterator = list.value;
//             } else {
//                 iterator = [list.value];
//             }
//         } else if (list.ruleset) {
//             iterator = list.ruleset.rules;
//         } else if (Array.isArray(list)) {
//             iterator = list;
//         } else {
//             iterator = [list];
//         }

//         var valueName = '@value',
//             keyName = '@key',
//             indexName = '@index';

//         if (rs.params) {
//             valueName = rs.params[0] && rs.params[0].name;
//             keyName = rs.params[1] && rs.params[1].name;
//             indexName = rs.params[2] && rs.params[2].name;
//             rs = rs.rules;
//         } else {
//             rs = rs.ruleset;
//         }
        
//         iterator.forEach(function(item) {
//             i = i + 1;
//             var key, value;
//             if (item instanceof Declaration) {
//                 key = typeof item.name === 'string' ? item.name : item.name[0].value;
//                 value = item.value;
//             } else {
//                 key = new Dimension(i);
//                 value = item;
//             }

//             newRules = rs.rules.slice(0);
//             if (valueName) {
//                 newRules.push(new Declaration(valueName,
//                     value,
//                     false, false, this.index, this.currentFileInfo));
//             }
//             if (indexName) {
//                 newRules.push(new Declaration(indexName,
//                     new Dimension(i),
//                     false, false, this.index, this.currentFileInfo));
//             }
//             if (keyName) {
//                 newRules.push(new Declaration(keyName,
//                     key,
//                     false, false, this.index, this.currentFileInfo));
//             }
        
//             rules.push(new Ruleset([ new(Selector)([ new Element("", '&') ]) ],
//                 newRules,
//                 rs.strictImports,
//                 rs.visibilityInfo()
//             ));
//         });

//         return new Ruleset([ new(Selector)([ new Element("", '&') ]) ],
//                 rules,
//                 rs.strictImports,
//                 rs.visibilityInfo()
//             ).eval(this.context);

//     }
// });

// },{"../tree/declaration":60,"../tree/dimension":62,"../tree/element":63,"../tree/ruleset":81,"../tree/selector":82,"./function-registry":27}],30:[function(require,module,exports){
// var Dimension = require('../tree/dimension');

// var MathHelper = function() {
// };
// MathHelper._math = function (fn, unit, n) {
//     if (!(n instanceof Dimension)) {
//         throw { type: 'Argument', message: 'argument must be a number' };
//     }
//     if (unit == null) {
//         unit = n.unit;
//     } else {
//         n = n.unify();
//     }
//     return new Dimension(fn(parseFloat(n.value)), unit);
// };
// module.exports = MathHelper;
// },{"../tree/dimension":62}],31:[function(require,module,exports){
// var functionRegistry = require('./function-registry'),
//     mathHelper = require('./math-helper.js');

// var mathFunctions = {
//     // name,  unit
//     ceil:  null,
//     floor: null,
//     sqrt:  null,
//     abs:   null,
//     tan:   '',
//     sin:   '',
//     cos:   '',
//     atan:  'rad',
//     asin:  'rad',
//     acos:  'rad'
// };

// for (var f in mathFunctions) {
//     if (mathFunctions.hasOwnProperty(f)) {
//         mathFunctions[f] = mathHelper._math.bind(null, Math[f], mathFunctions[f]);
//     }
// }

// mathFunctions.round = function (n, f) {
//     var fraction = typeof f === 'undefined' ? 0 : f.value;
//     return mathHelper._math(function(num) { return num.toFixed(fraction); }, null, n);
// };

// functionRegistry.addMultiple(mathFunctions);

// },{"./function-registry":27,"./math-helper.js":30}],32:[function(require,module,exports){
// var Dimension = require('../tree/dimension'),
//     Anonymous = require('../tree/anonymous'),
//     functionRegistry = require('./function-registry'),
//     mathHelper = require('./math-helper.js');

// var minMax = function (isMin, args) {
//     args = Array.prototype.slice.call(args);
//     switch (args.length) {
//         case 0: throw { type: 'Argument', message: 'one or more arguments required' };
//     }
//     var i, j, current, currentUnified, referenceUnified, unit, unitStatic, unitClone,
//         order  = [], // elems only contains original argument values.
//         values = {}; // key is the unit.toString() for unified Dimension values,
//     // value is the index into the order array.
//     for (i = 0; i < args.length; i++) {
//         current = args[i];
//         if (!(current instanceof Dimension)) {
//             if (Array.isArray(args[i].value)) {
//                 Array.prototype.push.apply(args, Array.prototype.slice.call(args[i].value));
//             }
//             continue;
//         }
//         currentUnified = current.unit.toString() === '' && unitClone !== undefined ? new Dimension(current.value, unitClone).unify() : current.unify();
//         unit = currentUnified.unit.toString() === '' && unitStatic !== undefined ? unitStatic : currentUnified.unit.toString();
//         unitStatic = unit !== '' && unitStatic === undefined || unit !== '' && order[0].unify().unit.toString() === '' ? unit : unitStatic;
//         unitClone = unit !== '' && unitClone === undefined ? current.unit.toString() : unitClone;
//         j = values[''] !== undefined && unit !== '' && unit === unitStatic ? values[''] : values[unit];
//         if (j === undefined) {
//             if (unitStatic !== undefined && unit !== unitStatic) {
//                 throw { type: 'Argument', message: 'incompatible types' };
//             }
//             values[unit] = order.length;
//             order.push(current);
//             continue;
//         }
//         referenceUnified = order[j].unit.toString() === '' && unitClone !== undefined ? new Dimension(order[j].value, unitClone).unify() : order[j].unify();
//         if ( isMin && currentUnified.value < referenceUnified.value ||
//             !isMin && currentUnified.value > referenceUnified.value) {
//             order[j] = current;
//         }
//     }
//     if (order.length == 1) {
//         return order[0];
//     }
//     args = order.map(function (a) { return a.toCSS(this.context); }).join(this.context.compress ? ',' : ', ');
//     return new Anonymous((isMin ? 'min' : 'max') + '(' + args + ')');
// };
// functionRegistry.addMultiple({
//     min: function () {
//         return minMax(true, arguments);
//     },
//     max: function () {
//         return minMax(false, arguments);
//     },
//     convert: function (val, unit) {
//         return val.convertTo(unit.value);
//     },
//     pi: function () {
//         return new Dimension(Math.PI);
//     },
//     mod: function(a, b) {
//         return new Dimension(a.value % b.value, a.unit);
//     },
//     pow: function(x, y) {
//         if (typeof x === 'number' && typeof y === 'number') {
//             x = new Dimension(x);
//             y = new Dimension(y);
//         } else if (!(x instanceof Dimension) || !(y instanceof Dimension)) {
//             throw { type: 'Argument', message: 'arguments must be numbers' };
//         }

//         return new Dimension(Math.pow(x.value, y.value), x.unit);
//     },
//     percentage: function (n) {
//         var result = mathHelper._math(function(num) {
//             return num * 100;
//         }, '%', n);

//         return result;
//     }
// });

// },{"../tree/anonymous":50,"../tree/dimension":62,"./function-registry":27,"./math-helper.js":30}],33:[function(require,module,exports){
// var Quoted = require('../tree/quoted'),
//     Anonymous = require('../tree/anonymous'),
//     JavaScript = require('../tree/javascript'),
//     functionRegistry = require('./function-registry');

// functionRegistry.addMultiple({
//     e: function (str) {
//         return new Anonymous(str instanceof JavaScript ? str.evaluated : str.value);
//     },
//     escape: function (str) {
//         return new Anonymous(
//             encodeURI(str.value).replace(/=/g, '%3D').replace(/:/g, '%3A').replace(/#/g, '%23').replace(/;/g, '%3B')
//                 .replace(/\(/g, '%28').replace(/\)/g, '%29'));
//     },
//     replace: function (string, pattern, replacement, flags) {
//         var result = string.value;
//         replacement = (replacement.type === 'Quoted') ?
//             replacement.value : replacement.toCSS();
//         result = result.replace(new RegExp(pattern.value, flags ? flags.value : ''), replacement);
//         return new Quoted(string.quote || '', result, string.escaped);
//     },
//     '%': function (string /* arg, arg, ... */) {
//         var args = Array.prototype.slice.call(arguments, 1),
//             result = string.value;

//         for (var i = 0; i < args.length; i++) {
//             /* jshint loopfunc:true */
//             result = result.replace(/%[sda]/i, function(token) {
//                 var value = ((args[i].type === 'Quoted') &&
//                     token.match(/s/i)) ? args[i].value : args[i].toCSS();
//                 return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
//             });
//         }
//         result = result.replace(/%%/g, '%');
//         return new Quoted(string.quote || '', result, string.escaped);
//     }
// });

// },{"../tree/anonymous":50,"../tree/javascript":68,"../tree/quoted":80,"./function-registry":27}],34:[function(require,module,exports){
// module.exports = function(environment) {
//     var Dimension = require('../tree/dimension'),
//         Color = require('../tree/color'),
//         Expression = require('../tree/expression'),
//         Quoted = require('../tree/quoted'),
//         URL = require('../tree/url'),
//         functionRegistry = require('./function-registry');

//     functionRegistry.add('svg-gradient', function(direction) {

//         var stops,
//             gradientDirectionSvg,
//             gradientType = 'linear',
//             rectangleDimension = 'x="0" y="0" width="1" height="1"',
//             renderEnv = {compress: false},
//             returner,
//             directionValue = direction.toCSS(renderEnv),
//             i, color, position, positionValue, alpha;

//         function throwArgumentDescriptor() {
//             throw { type: 'Argument',
//                 message: 'svg-gradient expects direction, start_color [start_position], [color position,]...,' +
//                             ' end_color [end_position] or direction, color list' };
//         }

//         if (arguments.length == 2) {
//             if (arguments[1].value.length < 2) {
//                 throwArgumentDescriptor();
//             }
//             stops = arguments[1].value;
//         } else if (arguments.length < 3) {
//             throwArgumentDescriptor();
//         } else {
//             stops = Array.prototype.slice.call(arguments, 1);
//         }

//         switch (directionValue) {
//             case 'to bottom':
//                 gradientDirectionSvg = 'x1="0%" y1="0%" x2="0%" y2="100%"';
//                 break;
//             case 'to right':
//                 gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="0%"';
//                 break;
//             case 'to bottom right':
//                 gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="100%"';
//                 break;
//             case 'to top right':
//                 gradientDirectionSvg = 'x1="0%" y1="100%" x2="100%" y2="0%"';
//                 break;
//             case 'ellipse':
//             case 'ellipse at center':
//                 gradientType = 'radial';
//                 gradientDirectionSvg = 'cx="50%" cy="50%" r="75%"';
//                 rectangleDimension = 'x="-50" y="-50" width="101" height="101"';
//                 break;
//             default:
//                 throw { type: 'Argument', message: 'svg-gradient direction must be \'to bottom\', \'to right\',' +
//                     ' \'to bottom right\', \'to top right\' or \'ellipse at center\'' };
//         }
//         returner = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">' +
//             '<' + gradientType + 'Gradient id="g" ' + gradientDirectionSvg + '>';

//         for (i = 0; i < stops.length; i += 1) {
//             if (stops[i] instanceof Expression) {
//                 color = stops[i].value[0];
//                 position = stops[i].value[1];
//             } else {
//                 color = stops[i];
//                 position = undefined;
//             }

//             if (!(color instanceof Color) || (!((i === 0 || i + 1 === stops.length) && position === undefined) && !(position instanceof Dimension))) {
//                 throwArgumentDescriptor();
//             }
//             positionValue = position ? position.toCSS(renderEnv) : i === 0 ? '0%' : '100%';
//             alpha = color.alpha;
//             returner += '<stop offset="' + positionValue + '" stop-color="' + color.toRGB() + '"' + (alpha < 1 ? ' stop-opacity="' + alpha + '"' : '') + '/>';
//         }
//         returner += '</' + gradientType + 'Gradient>' +
//             '<rect ' + rectangleDimension + ' fill="url(#g)" /></svg>';

//         returner = encodeURIComponent(returner);

//         returner = 'data:image/svg+xml,' + returner;
//         return new URL(new Quoted('\'' + returner + '\'', returner, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
//     });
// };

// },{"../tree/color":55,"../tree/dimension":62,"../tree/expression":64,"../tree/quoted":80,"../tree/url":85,"./function-registry":27}],35:[function(require,module,exports){
// var Keyword = require('../tree/keyword'),
//     DetachedRuleset = require('../tree/detached-ruleset'),
//     Dimension = require('../tree/dimension'),
//     Color = require('../tree/color'),
//     Quoted = require('../tree/quoted'),
//     Anonymous = require('../tree/anonymous'),
//     URL = require('../tree/url'),
//     Operation = require('../tree/operation'),
//     functionRegistry = require('./function-registry');

// var isa = function (n, Type) {
//         return (n instanceof Type) ? Keyword.True : Keyword.False;
//     },
//     isunit = function (n, unit) {
//         if (unit === undefined) {
//             throw { type: 'Argument', message: 'missing the required second argument to isunit.' };
//         }
//         unit = typeof unit.value === 'string' ? unit.value : unit;
//         if (typeof unit !== 'string') {
//             throw { type: 'Argument', message: 'Second argument to isunit should be a unit or a string.' };
//         }
//         return (n instanceof Dimension) && n.unit.is(unit) ? Keyword.True : Keyword.False;
//     };

// functionRegistry.addMultiple({
//     isruleset: function (n) {
//         return isa(n, DetachedRuleset);
//     },
//     iscolor: function (n) {
//         return isa(n, Color);
//     },
//     isnumber: function (n) {
//         return isa(n, Dimension);
//     },
//     isstring: function (n) {
//         return isa(n, Quoted);
//     },
//     iskeyword: function (n) {
//         return isa(n, Keyword);
//     },
//     isurl: function (n) {
//         return isa(n, URL);
//     },
//     ispixel: function (n) {
//         return isunit(n, 'px');
//     },
//     ispercentage: function (n) {
//         return isunit(n, '%');
//     },
//     isem: function (n) {
//         return isunit(n, 'em');
//     },
//     isunit: isunit,
//     unit: function (val, unit) {
//         if (!(val instanceof Dimension)) {
//             throw { type: 'Argument',
//                 message: 'the first argument to unit must be a number' +
//                     (val instanceof Operation ? '. Have you forgotten parenthesis?' : '') };
//         }
//         if (unit) {
//             if (unit instanceof Keyword) {
//                 unit = unit.value;
//             } else {
//                 unit = unit.toCSS();
//             }
//         } else {
//             unit = '';
//         }
//         return new Dimension(val.value, unit);
//     },
//     'get-unit': function (n) {
//         return new Anonymous(n.unit);
//     }
// });

// },{"../tree/anonymous":50,"../tree/color":55,"../tree/detached-ruleset":61,"../tree/dimension":62,"../tree/keyword":70,"../tree/operation":77,"../tree/quoted":80,"../tree/url":85,"./function-registry":27}],36:[function(require,module,exports){
// var contexts = require('./contexts'),
//     Parser = require('./parser/parser'),
//     LessError = require('./less-error'),
//     utils = require('./utils'),
//     PromiseConstructor = typeof Promise === 'undefined' ? require('promise') : Promise,
//     logger = require('./logger');

// module.exports = function(environment) {

//     // FileInfo = {
//     //  'rewriteUrls' - option - whether to adjust URL's to be relative
//     //  'filename' - full resolved filename of current file
//     //  'rootpath' - path to append to normal URLs for this node
//     //  'currentDirectory' - path to the current file, absolute
//     //  'rootFilename' - filename of the base file
//     //  'entryPath' - absolute path to the entry file
//     //  'reference' - whether the file should not be output and only output parts that are referenced

//     var ImportManager = function(less, context, rootFileInfo) {
//         this.less = less;
//         this.rootFilename = rootFileInfo.filename;
//         this.paths = context.paths || [];  // Search paths, when importing
//         this.contents = {};             // map - filename to contents of all the files
//         this.contentsIgnoredChars = {}; // map - filename to lines at the beginning of each file to ignore
//         this.mime = context.mime;
//         this.error = null;
//         this.context = context;
//         // Deprecated? Unused outside of here, could be useful.
//         this.queue = [];        // Files which haven't been imported yet
//         this.files = {};        // Holds the imported parse trees.
//     };

//     /**
//      * Add an import to be imported
//      * @param path - the raw path
//      * @param tryAppendExtension - whether to try appending a file extension (.less or .js if the path has no extension)
//      * @param currentFileInfo - the current file info (used for instance to work out relative paths)
//      * @param importOptions - import options
//      * @param callback - callback for when it is imported
//      */
//     ImportManager.prototype.push = function (path, tryAppendExtension, currentFileInfo, importOptions, callback) {
//         var importManager = this,
//             pluginLoader = this.context.pluginManager.Loader;

//         this.queue.push(path);

//         var fileParsedFunc = function (e, root, fullPath) {
//             importManager.queue.splice(importManager.queue.indexOf(path), 1); // Remove the path from the queue

//             var importedEqualsRoot = fullPath === importManager.rootFilename;
//             if (importOptions.optional && e) {
//                 callback(null, {rules:[]}, false, null);
//                 logger.info('The file ' + fullPath + ' was skipped because it was not found and the import was marked optional.');
//             }
//             else {
//                 // Inline imports aren't cached here.
//                 // If we start to cache them, please make sure they won't conflict with non-inline imports of the
//                 // same name as they used to do before this comment and the condition below have been added.
//                 if (!importManager.files[fullPath] && !importOptions.inline) {
//                     importManager.files[fullPath] = { root: root, options: importOptions };
//                 }
//                 if (e && !importManager.error) { importManager.error = e; }
//                 callback(e, root, importedEqualsRoot, fullPath);
//             }
//         };

//         var newFileInfo = {
//             rewriteUrls: this.context.rewriteUrls,
//             entryPath: currentFileInfo.entryPath,
//             rootpath: currentFileInfo.rootpath,
//             rootFilename: currentFileInfo.rootFilename
//         };

//         var fileManager = environment.getFileManager(path, currentFileInfo.currentDirectory, this.context, environment);

//         if (!fileManager) {
//             fileParsedFunc({ message: 'Could not find a file-manager for ' + path });
//             return;
//         }

//         var loadFileCallback = function(loadedFile) {
//             var plugin,
//                 resolvedFilename = loadedFile.filename,
//                 contents = loadedFile.contents.replace(/^\uFEFF/, '');

//             // Pass on an updated rootpath if path of imported file is relative and file
//             // is in a (sub|sup) directory
//             //
//             // Examples:
//             // - If path of imported file is 'module/nav/nav.less' and rootpath is 'less/',
//             //   then rootpath should become 'less/module/nav/'
//             // - If path of imported file is '../mixins.less' and rootpath is 'less/',
//             //   then rootpath should become 'less/../'
//             newFileInfo.currentDirectory = fileManager.getPath(resolvedFilename);
//             if (newFileInfo.rewriteUrls) {
//                 newFileInfo.rootpath = fileManager.join(
//                     (importManager.context.rootpath || ''),
//                     fileManager.pathDiff(newFileInfo.currentDirectory, newFileInfo.entryPath));

//                 if (!fileManager.isPathAbsolute(newFileInfo.rootpath) && fileManager.alwaysMakePathsAbsolute()) {
//                     newFileInfo.rootpath = fileManager.join(newFileInfo.entryPath, newFileInfo.rootpath);
//                 }
//             }
//             newFileInfo.filename = resolvedFilename;

//             var newEnv = new contexts.Parse(importManager.context);

//             newEnv.processImports = false;
//             importManager.contents[resolvedFilename] = contents;

//             if (currentFileInfo.reference || importOptions.reference) {
//                 newFileInfo.reference = true;
//             }

//             if (importOptions.isPlugin) {
//                 plugin = pluginLoader.evalPlugin(contents, newEnv, importManager, importOptions.pluginArgs, newFileInfo);
//                 if (plugin instanceof LessError) {
//                     fileParsedFunc(plugin, null, resolvedFilename);
//                 }
//                 else {
//                     fileParsedFunc(null, plugin, resolvedFilename);
//                 }
//             } else if (importOptions.inline) {
//                 fileParsedFunc(null, contents, resolvedFilename);
//             } else {

//                 // import (multiple) parse trees apparently get altered and can't be cached.
//                 // TODO: investigate why this is
//                 if (importManager.files[resolvedFilename]
//                     && !importManager.files[resolvedFilename].options.multiple
//                     && !importOptions.multiple) {

//                     fileParsedFunc(null, importManager.files[resolvedFilename].root, resolvedFilename);
//                 }
//                 else {
//                     new Parser(newEnv, importManager, newFileInfo).parse(contents, function (e, root) {
//                         fileParsedFunc(e, root, resolvedFilename);
//                     });
//                 }
//             }
//         };
//         var promise, context = utils.clone(this.context);

//         if (tryAppendExtension) {
//             context.ext = importOptions.isPlugin ? '.js' : '.less';
//         }

//         if (importOptions.isPlugin) {
//             promise = pluginLoader.loadPlugin(path, currentFileInfo.currentDirectory, context, environment, fileManager);
//         }
//         else {
//             promise = fileManager.loadFile(path, currentFileInfo.currentDirectory, context, environment,
//                 function(err, loadedFile) {
//                     if (err) {
//                         fileParsedFunc(err);
//                     } else {
//                         loadFileCallback(loadedFile);
//                     }
//                 });
//         }
//         if (promise) {
//             promise.then(loadFileCallback, fileParsedFunc);
//         }

//     };
//     return ImportManager;
// };

// },{"./contexts":13,"./less-error":38,"./logger":39,"./parser/parser":44,"./utils":89,"promise":undefined}],37:[function(require,module,exports){
// module.exports = function(environment, fileManagers) {
//     var SourceMapOutput, SourceMapBuilder, ParseTree, ImportManager, Environment;

//     var initial = {
//         version: [3, 8, 1],
//         data: require('./data'),
//         tree: require('./tree'),
//         Environment: (Environment = require('./environment/environment')),
//         AbstractFileManager: require('./environment/abstract-file-manager'),
//         AbstractPluginLoader: require('./environment/abstract-plugin-loader'),
//         environment: (environment = new Environment(environment, fileManagers)),
//         visitors: require('./visitors'),
//         Parser: require('./parser/parser'),
//         functions: require('./functions')(environment),
//         contexts: require('./contexts'),
//         SourceMapOutput: (SourceMapOutput = require('./source-map-output')(environment)),
//         SourceMapBuilder: (SourceMapBuilder = require('./source-map-builder')(SourceMapOutput, environment)),
//         ParseTree: (ParseTree = require('./parse-tree')(SourceMapBuilder)),
//         ImportManager: (ImportManager = require('./import-manager')(environment)),
//         render: require('./render')(environment, ParseTree, ImportManager),
//         parse: require('./parse')(environment, ParseTree, ImportManager),
//         LessError: require('./less-error'),
//         transformTree: require('./transform-tree'),
//         utils: require('./utils'),
//         PluginManager: require('./plugin-manager'),
//         logger: require('./logger')
//     };

//     // Create a public API

//     var ctor = function(t) {
//         return function() {
//             var obj = Object.create(t.prototype);
//             t.apply(obj, Array.prototype.slice.call(arguments, 0));
//             return obj;
//         };
//     };
//     var t, api = Object.create(initial);
//     for (var n in initial.tree) {
//         /* eslint guard-for-in: 0 */
//         t = initial.tree[n];
//         if (typeof t === 'function') {
//             api[n.toLowerCase()] = ctor(t);
//         }
//         else {
//             api[n] = Object.create(null);
//             for (var o in t) {
//                 /* eslint guard-for-in: 0 */
//                 api[n][o.toLowerCase()] = ctor(t[o]);
//             }
//         }
//     }

//     return api;
// };

// },{"./contexts":13,"./data":15,"./environment/abstract-file-manager":18,"./environment/abstract-plugin-loader":19,"./environment/environment":20,"./functions":28,"./import-manager":36,"./less-error":38,"./logger":39,"./parse":41,"./parse-tree":40,"./parser/parser":44,"./plugin-manager":45,"./render":46,"./source-map-builder":47,"./source-map-output":48,"./transform-tree":49,"./tree":67,"./utils":89,"./visitors":93}],38:[function(require,module,exports){
// var utils = require('./utils');
// /**
//  * This is a centralized class of any error that could be thrown internally (mostly by the parser).
//  * Besides standard .message it keeps some additional data like a path to the file where the error
//  * occurred along with line and column numbers.
//  *
//  * @class
//  * @extends Error
//  * @type {module.LessError}
//  *
//  * @prop {string} type
//  * @prop {string} filename
//  * @prop {number} index
//  * @prop {number} line
//  * @prop {number} column
//  * @prop {number} callLine
//  * @prop {number} callExtract
//  * @prop {string[]} extract
//  *
//  * @param {Object} e              - An error object to wrap around or just a descriptive object
//  * @param {Object} fileContentMap - An object with file contents in 'contents' property (like importManager) @todo - move to fileManager?
//  * @param {string} [currentFilename]
//  */
// var LessError = module.exports = function LessError(e, fileContentMap, currentFilename) {
//     Error.call(this);

//     var filename = e.filename || currentFilename;

//     this.message = e.message;
//     this.stack = e.stack;

//     if (fileContentMap && filename) {
//         var input = fileContentMap.contents[filename],
//             loc = utils.getLocation(e.index, input),
//             line = loc.line,
//             col  = loc.column,
//             callLine = e.call && utils.getLocation(e.call, input).line,
//             lines = input ? input.split('\n') : '';

//         this.type = e.type || 'Syntax';
//         this.filename = filename;
//         this.index = e.index;
//         this.line = typeof line === 'number' ? line + 1 : null;
//         this.column = col;

//         if (!this.line && this.stack) {
//             var found = this.stack.match(/(<anonymous>|Function):(\d+):(\d+)/);

//             if (found) {
//                 if (found[2]) {
//                     this.line = parseInt(found[2]) - 2;
//                 }
//                 if (found[3]) {
//                     this.column = parseInt(found[3]);
//                 }
//             }
//         }

//         this.callLine = callLine + 1;
//         this.callExtract = lines[callLine];

//         this.extract = [
//             lines[this.line - 2],
//             lines[this.line - 1],
//             lines[this.line]
//         ];

//     }

// };

// if (typeof Object.create === 'undefined') {
//     var F = function () {};
//     F.prototype = Error.prototype;
//     LessError.prototype = new F();
// } else {
//     LessError.prototype = Object.create(Error.prototype);
// }

// LessError.prototype.constructor = LessError;

// /**
//  * An overridden version of the default Object.prototype.toString
//  * which uses additional information to create a helpful message.
//  *
//  * @param {Object} options
//  * @returns {string}
//  */
// LessError.prototype.toString = function(options) {
//     options = options || {};

//     var message = '';
//     var extract = this.extract || [];
//     var error = [];
//     var stylize = function (str) { return str; };
//     if (options.stylize) {
//         var type = typeof options.stylize;
//         if (type !== 'function') {
//             throw Error('options.stylize should be a function, got a ' + type + '!');
//         }
//         stylize = options.stylize;
//     }

//     if (this.line !== null) {
//         if (typeof extract[0] === 'string') {
//             error.push(stylize((this.line - 1) + ' ' + extract[0], 'grey'));
//         }

//         if (typeof extract[1] === 'string') {
//             var errorTxt = this.line + ' ';
//             if (extract[1]) {
//                 errorTxt += extract[1].slice(0, this.column) +
//                     stylize(stylize(stylize(extract[1].substr(this.column, 1), 'bold') +
//                         extract[1].slice(this.column + 1), 'red'), 'inverse');
//             }
//             error.push(errorTxt);
//         }

//         if (typeof extract[2] === 'string') {
//             error.push(stylize((this.line + 1) + ' ' + extract[2], 'grey'));
//         }
//         error = error.join('\n') + stylize('', 'reset') + '\n';
//     }

//     message += stylize(this.type + 'Error: ' + this.message, 'red');
//     if (this.filename) {
//         message += stylize(' in ', 'red') + this.filename;
//     }
//     if (this.line) {
//         message += stylize(' on line ' + this.line + ', column ' + (this.column + 1) + ':', 'grey');
//     }

//     message += '\n' + error;

//     if (this.callLine) {
//         message += stylize('from ', 'red') + (this.filename || '') + '/n';
//         message += stylize(this.callLine, 'grey') + ' ' + this.callExtract + '/n';
//     }

//     return message;
// };

// },{"./utils":89}],39:[function(require,module,exports){
// module.exports = {
//     error: function(msg) {
//         this._fireEvent('error', msg);
//     },
//     warn: function(msg) {
//         this._fireEvent('warn', msg);
//     },
//     info: function(msg) {
//         this._fireEvent('info', msg);
//     },
//     debug: function(msg) {
//         this._fireEvent('debug', msg);
//     },
//     addListener: function(listener) {
//         this._listeners.push(listener);
//     },
//     removeListener: function(listener) {
//         for (var i = 0; i < this._listeners.length; i++) {
//             if (this._listeners[i] === listener) {
//                 this._listeners.splice(i, 1);
//                 return;
//             }
//         }
//     },
//     _fireEvent: function(type, msg) {
//         for (var i = 0; i < this._listeners.length; i++) {
//             var logFunction = this._listeners[i][type];
//             if (logFunction) {
//                 logFunction(msg);
//             }
//         }
//     },
//     _listeners: []
// };

// },{}],40:[function(require,module,exports){
// var LessError = require('./less-error'),
//     transformTree = require('./transform-tree'),
//     logger = require('./logger');

// module.exports = function(SourceMapBuilder) {
//     var ParseTree = function(root, imports) {
//         this.root = root;
//         this.imports = imports;
//     };
    
//     ParseTree.prototype.toCSS = function(options) {
//         var evaldRoot, result = {}, sourceMapBuilder;
//         try {
//             evaldRoot = transformTree(this.root, options);
//         } catch (e) {
//             throw new LessError(e, this.imports);
//         }

//         try {
//             var compress = Boolean(options.compress);
//             if (compress) {
//                 logger.warn('The compress option has been deprecated. We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.');
//             }

//             var toCSSOptions = {
//                 compress: compress,
//                 dumpLineNumbers: options.dumpLineNumbers,
//                 strictUnits: Boolean(options.strictUnits),
//                 numPrecision: 8};

//             if (options.sourceMap) {
//                 sourceMapBuilder = new SourceMapBuilder(options.sourceMap);
//                 result.css = sourceMapBuilder.toCSS(evaldRoot, toCSSOptions, this.imports);
//             } else {
//                 result.css = evaldRoot.toCSS(toCSSOptions);
//             }
//         } catch (e) {
//             throw new LessError(e, this.imports);
//         }

//         if (options.pluginManager) {
//             var postProcessors = options.pluginManager.getPostProcessors();
//             for (var i = 0; i < postProcessors.length; i++) {
//                 result.css = postProcessors[i].process(result.css, { sourceMap: sourceMapBuilder, options: options, imports: this.imports });
//             }
//         }
//         if (options.sourceMap) {
//             result.map = sourceMapBuilder.getExternalSourceMap();
//         }

//         result.imports = [];
//         for (var file in this.imports.files) {
//             if (this.imports.files.hasOwnProperty(file) && file !== this.imports.rootFilename) {
//                 result.imports.push(file);
//             }
//         }
//         return result;
//     };
//     return ParseTree;
// };

// },{"./less-error":38,"./logger":39,"./transform-tree":49}],41:[function(require,module,exports){
// var PromiseConstructor,
//     contexts = require('./contexts'),
//     Parser = require('./parser/parser'),
//     PluginManager = require('./plugin-manager'),
//     LessError = require('./less-error'),
//     utils = require('./utils');

// module.exports = function(environment, ParseTree, ImportManager) {
//     var parse = function (input, options, callback) {
        
//         if (typeof options === 'function') {
//             callback = options;
//             options = utils.copyOptions(this.options, {});
//         }
//         else {
//             options = utils.copyOptions(this.options, options || {});
//         }

//         if (!callback) {
//             if (!PromiseConstructor) {
//                 PromiseConstructor = typeof Promise === 'undefined' ? require('promise') : Promise;
//             }
//             var self = this;
//             return new PromiseConstructor(function (resolve, reject) {
//                 parse.call(self, input, options, function(err, output) {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(output);
//                     }
//                 });
//             });
//         } else {
//             var context,
//                 rootFileInfo,
//                 pluginManager = new PluginManager(this, !options.reUsePluginManager);

//             options.pluginManager = pluginManager;

//             context = new contexts.Parse(options);

//             if (options.rootFileInfo) {
//                 rootFileInfo = options.rootFileInfo;
//             } else {
//                 var filename = options.filename || 'input';
//                 var entryPath = filename.replace(/[^\/\\]*$/, '');
//                 rootFileInfo = {
//                     filename: filename,
//                     rewriteUrls: context.rewriteUrls,
//                     rootpath: context.rootpath || '',
//                     currentDirectory: entryPath,
//                     entryPath: entryPath,
//                     rootFilename: filename
//                 };
//                 // add in a missing trailing slash
//                 if (rootFileInfo.rootpath && rootFileInfo.rootpath.slice(-1) !== '/') {
//                     rootFileInfo.rootpath += '/';
//                 }
//             }

//             var imports = new ImportManager(this, context, rootFileInfo);
//             this.importManager = imports;

//             // TODO: allow the plugins to be just a list of paths or names
//             // Do an async plugin queue like lessc

//             if (options.plugins) {
//                 options.plugins.forEach(function(plugin) {
//                     var evalResult, contents;
//                     if (plugin.fileContent) {
//                         contents = plugin.fileContent.replace(/^\uFEFF/, '');
//                         evalResult = pluginManager.Loader.evalPlugin(contents, context, imports, plugin.options, plugin.filename);
//                         if (evalResult instanceof LessError) {
//                             return callback(evalResult);
//                         }
//                     }
//                     else {
//                         pluginManager.addPlugin(plugin);
//                     }
//                 });
//             }
            
//             return new Parser(context, imports, rootFileInfo)
//                 .parse(input, function (e, root) {
//                     if (e) { return callback(e); }
//                     callback(null, root, imports, options);
//                 }, options);
//         }
//     };
//     return parse;
// };

// },{"./contexts":13,"./less-error":38,"./parser/parser":44,"./plugin-manager":45,"./utils":89,"promise":undefined}],42:[function(require,module,exports){
// // Split the input into chunks.
// module.exports = function (input, fail) {
//     var len = input.length, level = 0, parenLevel = 0,
//         lastOpening, lastOpeningParen, lastMultiComment, lastMultiCommentEndBrace,
//         chunks = [], emitFrom = 0,
//         chunkerCurrentIndex, currentChunkStartIndex, cc, cc2, matched;

//     function emitChunk(force) {
//         var len = chunkerCurrentIndex - emitFrom;
//         if (((len < 512) && !force) || !len) {
//             return;
//         }
//         chunks.push(input.slice(emitFrom, chunkerCurrentIndex + 1));
//         emitFrom = chunkerCurrentIndex + 1;
//     }

//     for (chunkerCurrentIndex = 0; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
//         cc = input.charCodeAt(chunkerCurrentIndex);
//         if (((cc >= 97) && (cc <= 122)) || (cc < 34)) {
//             // a-z or whitespace
//             continue;
//         }

//         switch (cc) {
//             case 40:                        // (
//                 parenLevel++;
//                 lastOpeningParen = chunkerCurrentIndex;
//                 continue;
//             case 41:                        // )
//                 if (--parenLevel < 0) {
//                     return fail('missing opening `(`', chunkerCurrentIndex);
//                 }
//                 continue;
//             case 59:                        // ;
//                 if (!parenLevel) { emitChunk(); }
//                 continue;
//             case 123:                       // {
//                 level++;
//                 lastOpening = chunkerCurrentIndex;
//                 continue;
//             case 125:                       // }
//                 if (--level < 0) {
//                     return fail('missing opening `{`', chunkerCurrentIndex);
//                 }
//                 if (!level && !parenLevel) { emitChunk(); }
//                 continue;
//             case 92:                        // \
//                 if (chunkerCurrentIndex < len - 1) { chunkerCurrentIndex++; continue; }
//                 return fail('unescaped `\\`', chunkerCurrentIndex);
//             case 34:
//             case 39:
//             case 96:                        // ", ' and `
//                 matched = 0;
//                 currentChunkStartIndex = chunkerCurrentIndex;
//                 for (chunkerCurrentIndex = chunkerCurrentIndex + 1; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
//                     cc2 = input.charCodeAt(chunkerCurrentIndex);
//                     if (cc2 > 96) { continue; }
//                     if (cc2 == cc) { matched = 1; break; }
//                     if (cc2 == 92) {        // \
//                         if (chunkerCurrentIndex == len - 1) {
//                             return fail('unescaped `\\`', chunkerCurrentIndex);
//                         }
//                         chunkerCurrentIndex++;
//                     }
//                 }
//                 if (matched) { continue; }
//                 return fail('unmatched `' + String.fromCharCode(cc) + '`', currentChunkStartIndex);
//             case 47:                        // /, check for comment
//                 if (parenLevel || (chunkerCurrentIndex == len - 1)) { continue; }
//                 cc2 = input.charCodeAt(chunkerCurrentIndex + 1);
//                 if (cc2 == 47) {
//                     // //, find lnfeed
//                     for (chunkerCurrentIndex = chunkerCurrentIndex + 2; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
//                         cc2 = input.charCodeAt(chunkerCurrentIndex);
//                         if ((cc2 <= 13) && ((cc2 == 10) || (cc2 == 13))) { break; }
//                     }
//                 } else if (cc2 == 42) {
//                     // /*, find */
//                     lastMultiComment = currentChunkStartIndex = chunkerCurrentIndex;
//                     for (chunkerCurrentIndex = chunkerCurrentIndex + 2; chunkerCurrentIndex < len - 1; chunkerCurrentIndex++) {
//                         cc2 = input.charCodeAt(chunkerCurrentIndex);
//                         if (cc2 == 125) { lastMultiCommentEndBrace = chunkerCurrentIndex; }
//                         if (cc2 != 42) { continue; }
//                         if (input.charCodeAt(chunkerCurrentIndex + 1) == 47) { break; }
//                     }
//                     if (chunkerCurrentIndex == len - 1) {
//                         return fail('missing closing `*/`', currentChunkStartIndex);
//                     }
//                     chunkerCurrentIndex++;
//                 }
//                 continue;
//             case 42:                       // *, check for unmatched */
//                 if ((chunkerCurrentIndex < len - 1) && (input.charCodeAt(chunkerCurrentIndex + 1) == 47)) {
//                     return fail('unmatched `/*`', chunkerCurrentIndex);
//                 }
//                 continue;
//         }
//     }

//     if (level !== 0) {
//         if ((lastMultiComment > lastOpening) && (lastMultiCommentEndBrace > lastMultiComment)) {
//             return fail('missing closing `}` or `*/`', lastOpening);
//         } else {
//             return fail('missing closing `}`', lastOpening);
//         }
//     } else if (parenLevel !== 0) {
//         return fail('missing closing `)`', lastOpeningParen);
//     }

//     emitChunk(true);
//     return chunks;
// };

// },{}],43:[function(require,module,exports){
// var chunker = require('./chunker');

// module.exports = function() {
//     var input,       // Less input string
//         j,           // current chunk
//         saveStack = [],   // holds state for backtracking
//         furthest,    // furthest index the parser has gone to
//         furthestPossibleErrorMessage, // if this is furthest we got to, this is the probably cause
//         chunks,      // chunkified input
//         current,     // current chunk
//         currentPos,  // index of current chunk, in `input`
//         parserInput = {};

//     var CHARCODE_SPACE = 32,
//         CHARCODE_TAB = 9,
//         CHARCODE_LF = 10,
//         CHARCODE_CR = 13,
//         CHARCODE_PLUS = 43,
//         CHARCODE_COMMA = 44,
//         CHARCODE_FORWARD_SLASH = 47,
//         CHARCODE_9 = 57;

//     function skipWhitespace(length) {
//         var oldi = parserInput.i, oldj = j,
//             curr = parserInput.i - currentPos,
//             endIndex = parserInput.i + current.length - curr,
//             mem = (parserInput.i += length),
//             inp = input,
//             c, nextChar, comment;

//         for (; parserInput.i < endIndex; parserInput.i++) {
//             c = inp.charCodeAt(parserInput.i);

//             if (parserInput.autoCommentAbsorb && c === CHARCODE_FORWARD_SLASH) {
//                 nextChar = inp.charAt(parserInput.i + 1);
//                 if (nextChar === '/') {
//                     comment = {index: parserInput.i, isLineComment: true};
//                     var nextNewLine = inp.indexOf('\n', parserInput.i + 2);
//                     if (nextNewLine < 0) {
//                         nextNewLine = endIndex;
//                     }
//                     parserInput.i = nextNewLine;
//                     comment.text = inp.substr(comment.index, parserInput.i - comment.index);
//                     parserInput.commentStore.push(comment);
//                     continue;
//                 } else if (nextChar === '*') {
//                     var nextStarSlash = inp.indexOf('*/', parserInput.i + 2);
//                     if (nextStarSlash >= 0) {
//                         comment = {
//                             index: parserInput.i,
//                             text: inp.substr(parserInput.i, nextStarSlash + 2 - parserInput.i),
//                             isLineComment: false
//                         };
//                         parserInput.i += comment.text.length - 1;
//                         parserInput.commentStore.push(comment);
//                         continue;
//                     }
//                 }
//                 break;
//             }

//             if ((c !== CHARCODE_SPACE) && (c !== CHARCODE_LF) && (c !== CHARCODE_TAB) && (c !== CHARCODE_CR)) {
//                 break;
//             }
//         }

//         current = current.slice(length + parserInput.i - mem + curr);
//         currentPos = parserInput.i;

//         if (!current.length) {
//             if (j < chunks.length - 1) {
//                 current = chunks[++j];
//                 skipWhitespace(0); // skip space at the beginning of a chunk
//                 return true; // things changed
//             }
//             parserInput.finished = true;
//         }

//         return oldi !== parserInput.i || oldj !== j;
//     }

//     parserInput.save = function() {
//         currentPos = parserInput.i;
//         saveStack.push( { current: current, i: parserInput.i, j: j });
//     };
//     parserInput.restore = function(possibleErrorMessage) {

//         if (parserInput.i > furthest || (parserInput.i === furthest && possibleErrorMessage && !furthestPossibleErrorMessage)) {
//             furthest = parserInput.i;
//             furthestPossibleErrorMessage = possibleErrorMessage;
//         }
//         var state = saveStack.pop();
//         current = state.current;
//         currentPos = parserInput.i = state.i;
//         j = state.j;
//     };
//     parserInput.forget = function() {
//         saveStack.pop();
//     };
//     parserInput.isWhitespace = function (offset) {
//         var pos = parserInput.i + (offset || 0),
//             code = input.charCodeAt(pos);
//         return (code === CHARCODE_SPACE || code === CHARCODE_CR || code === CHARCODE_TAB || code === CHARCODE_LF);
//     };

//     // Specialization of $(tok)
//     parserInput.$re = function(tok) {
//         if (parserInput.i > currentPos) {
//             current = current.slice(parserInput.i - currentPos);
//             currentPos = parserInput.i;
//         }

//         var m = tok.exec(current);
//         if (!m) {
//             return null;
//         }

//         skipWhitespace(m[0].length);
//         if (typeof m === 'string') {
//             return m;
//         }

//         return m.length === 1 ? m[0] : m;
//     };

//     parserInput.$char = function(tok) {
//         if (input.charAt(parserInput.i) !== tok) {
//             return null;
//         }
//         skipWhitespace(1);
//         return tok;
//     };

//     parserInput.$str = function(tok) {
//         var tokLength = tok.length;

//         // https://jsperf.com/string-startswith/21
//         for (var i = 0; i < tokLength; i++) {
//             if (input.charAt(parserInput.i + i) !== tok.charAt(i)) {
//                 return null;
//             }
//         }

//         skipWhitespace(tokLength);
//         return tok;
//     };

//     parserInput.$quoted = function(loc) {
//         var pos = loc || parserInput.i,
//             startChar = input.charAt(pos);

//         if (startChar !== '\'' && startChar !== '"') {
//             return;
//         }
//         var length = input.length,
//             currentPosition = pos;

//         for (var i = 1; i + currentPosition < length; i++) {
//             var nextChar = input.charAt(i + currentPosition);
//             switch (nextChar) {
//                 case '\\':
//                     i++;
//                     continue;
//                 case '\r':
//                 case '\n':
//                     break;
//                 case startChar:
//                     var str = input.substr(currentPosition, i + 1);
//                     if (!loc && loc !== 0) {
//                         skipWhitespace(i + 1);
//                         return str
//                     }
//                     return [startChar, str];
//                 default:
//             }
//         }
//         return null;
//     };

//     /**
//      * Permissive parsing. Ignores everything except matching {} [] () and quotes
//      * until matching token (outside of blocks)
//      */
//     parserInput.$parseUntil = function(tok) {
//         var quote = '',
//             returnVal = null,
//             inComment = false,
//             blockDepth = 0,
//             blockStack = [],
//             parseGroups = [],
//             length = input.length,
//             startPos = parserInput.i,
//             lastPos = parserInput.i,
//             i = parserInput.i,
//             loop = true,
//             testChar;

//         if (typeof tok === 'string') {
//             testChar = function(char) {
//                 return char === tok;
//             }
//         } else {
//             testChar = function(char) {
//                 return tok.test(char);
//             }
//         }

//         do {
//             var prevChar, nextChar = input.charAt(i);
//             if (blockDepth === 0 && testChar(nextChar)) {
//                 returnVal = input.substr(lastPos, i - lastPos);
//                 if (returnVal) {
//                     parseGroups.push(returnVal);
//                 }
//                 else {
//                     parseGroups.push(' ');
//                 }
//                 returnVal = parseGroups;
//                 skipWhitespace(i - startPos);
//                 loop = false
//             } else {
//                 if (inComment) {
//                     if (nextChar === '*' && 
//                         input.charAt(i + 1) === '/') {
//                         i++;
//                         blockDepth--;
//                         inComment = false;
//                     }
//                     i++;
//                     continue;
//                 }
//                 switch (nextChar) {
//                     case '\\':
//                         i++;
//                         nextChar = input.charAt(i);
//                         parseGroups.push(input.substr(lastPos, i - lastPos + 1));
//                         lastPos = i + 1;
//                         break;
//                     case '/':
//                         if (input.charAt(i + 1) === '*') {
//                             i++;
//                             inComment = true;
//                             blockDepth++;
//                         }
//                         break;
//                     case '\'':
//                     case '"':
//                         quote = parserInput.$quoted(i);
//                         if (quote) {
//                             parseGroups.push(input.substr(lastPos, i - lastPos), quote);
//                             i += quote[1].length - 1;
//                             lastPos = i + 1;
//                         }
//                         else {
//                             skipWhitespace(i - startPos);
//                             returnVal = nextChar;
//                             loop = false;
//                         }
//                         break;
//                     case '{':
//                         blockStack.push('}');
//                         blockDepth++;
//                         break;
//                     case '(':
//                         blockStack.push(')');
//                         blockDepth++;
//                         break;
//                     case '[':
//                         blockStack.push(']');
//                         blockDepth++;
//                         break;
//                     case '}':
//                     case ')':
//                     case ']':
//                         var expected = blockStack.pop();
//                         if (nextChar === expected) {
//                             blockDepth--;
//                         } else {
//                             // move the parser to the error and return expected
//                             skipWhitespace(i - startPos);
//                             returnVal = expected;
//                             loop = false;
//                         }
//                 }
//                 i++;
//                 if (i > length) {
//                     loop = false;
//                 }
//             }
//             prevChar = nextChar;
//         } while (loop);

//         return returnVal ? returnVal : null;
//     }

//     parserInput.autoCommentAbsorb = true;
//     parserInput.commentStore = [];
//     parserInput.finished = false;

//     // Same as $(), but don't change the state of the parser,
//     // just return the match.
//     parserInput.peek = function(tok) {
//         if (typeof tok === 'string') {
//             // https://jsperf.com/string-startswith/21
//             for (var i = 0; i < tok.length; i++) {
//                 if (input.charAt(parserInput.i + i) !== tok.charAt(i)) {
//                     return false;
//                 }
//             }
//             return true;
//         } else {
//             return tok.test(current);
//         }
//     };

//     // Specialization of peek()
//     // TODO remove or change some currentChar calls to peekChar
//     parserInput.peekChar = function(tok) {
//         return input.charAt(parserInput.i) === tok;
//     };

//     parserInput.currentChar = function() {
//         return input.charAt(parserInput.i);
//     };

//     parserInput.prevChar = function() {
//         return input.charAt(parserInput.i - 1);
//     };

//     parserInput.getInput = function() {
//         return input;
//     };

//     parserInput.peekNotNumeric = function() {
//         var c = input.charCodeAt(parserInput.i);
//         // Is the first char of the dimension 0-9, '.', '+' or '-'
//         return (c > CHARCODE_9 || c < CHARCODE_PLUS) || c === CHARCODE_FORWARD_SLASH || c === CHARCODE_COMMA;
//     };

//     parserInput.start = function(str, chunkInput, failFunction) {
//         input = str;
//         parserInput.i = j = currentPos = furthest = 0;

//         // chunking apparently makes things quicker (but my tests indicate
//         // it might actually make things slower in node at least)
//         // and it is a non-perfect parse - it can't recognise
//         // unquoted urls, meaning it can't distinguish comments
//         // meaning comments with quotes or {}() in them get 'counted'
//         // and then lead to parse errors.
//         // In addition if the chunking chunks in the wrong place we might
//         // not be able to parse a parser statement in one go
//         // this is officially deprecated but can be switched on via an option
//         // in the case it causes too much performance issues.
//         if (chunkInput) {
//             chunks = chunker(str, failFunction);
//         } else {
//             chunks = [str];
//         }

//         current = chunks[0];

//         skipWhitespace(0);
//     };

//     parserInput.end = function() {
//         var message,
//             isFinished = parserInput.i >= input.length;

//         if (parserInput.i < furthest) {
//             message = furthestPossibleErrorMessage;
//             parserInput.i = furthest;
//         }
//         return {
//             isFinished: isFinished,
//             furthest: parserInput.i,
//             furthestPossibleErrorMessage: message,
//             furthestReachedEnd: parserInput.i >= input.length - 1,
//             furthestChar: input[parserInput.i]
//         };
//     };

//     return parserInput;
// };

// },{"./chunker":42}],44:[function(require,module,exports){
// var LessError = require('../less-error'),
//     tree = require('../tree'),
//     visitors = require('../visitors'),
//     getParserInput = require('./parser-input'),
//     utils = require('../utils'),
//     functionRegistry = require('../functions/function-registry');

// //
// // less.js - parser
// //
// //    A relatively straight-forward predictive parser.
// //    There is no tokenization/lexing stage, the input is parsed
// //    in one sweep.
// //
// //    To make the parser fast enough to run in the browser, several
// //    optimization had to be made:
// //
// //    - Matching and slicing on a huge input is often cause of slowdowns.
// //      The solution is to chunkify the input into smaller strings.
// //      The chunks are stored in the `chunks` var,
// //      `j` holds the current chunk index, and `currentPos` holds
// //      the index of the current chunk in relation to `input`.
// //      This gives us an almost 4x speed-up.
// //
// //    - In many cases, we don't need to match individual tokens;
// //      for example, if a value doesn't hold any variables, operations
// //      or dynamic references, the parser can effectively 'skip' it,
// //      treating it as a literal.
// //      An example would be '1px solid #000' - which evaluates to itself,
// //      we don't need to know what the individual components are.
// //      The drawback, of course is that you don't get the benefits of
// //      syntax-checking on the CSS. This gives us a 50% speed-up in the parser,
// //      and a smaller speed-up in the code-gen.
// //
// //
// //    Token matching is done with the `$` function, which either takes
// //    a terminal string or regexp, or a non-terminal function to call.
// //    It also takes care of moving all the indices forwards.
// //

// var Parser = function Parser(context, imports, fileInfo) {
//     var parsers,
//         parserInput = getParserInput();

//     function error(msg, type) {
//         throw new LessError(
//             {
//                 index: parserInput.i,
//                 filename: fileInfo.filename,
//                 type: type || 'Syntax',
//                 message: msg
//             },
//             imports
//         );
//     }

//     function expect(arg, msg) {
//         // some older browsers return typeof 'function' for RegExp
//         var result = (arg instanceof Function) ? arg.call(parsers) : parserInput.$re(arg);
//         if (result) {
//             return result;
//         }
        
//         error(msg || (typeof arg === 'string'
//             ? 'expected \'' + arg + '\' got \'' + parserInput.currentChar() + '\''
//             : 'unexpected token'));
//     }

//     // Specialization of expect()
//     function expectChar(arg, msg) {
//         if (parserInput.$char(arg)) {
//             return arg;
//         }
//         error(msg || 'expected \'' + arg + '\' got \'' + parserInput.currentChar() + '\'');
//     }

//     function getDebugInfo(index) {
//         var filename = fileInfo.filename;

//         return {
//             lineNumber: utils.getLocation(index, parserInput.getInput()).line + 1,
//             fileName: filename
//         };
//     }

//     /**
//      *  Used after initial parsing to create nodes on the fly
//      * 
//      *  @param {String} str          - string to parse 
//      *  @param {Array}  parseList    - array of parsers to run input through e.g. ["value", "important"]
//      *  @param {Number} currentIndex - start number to begin indexing
//      *  @param {Object} fileInfo     - fileInfo to attach to created nodes
//      */
//     function parseNode(str, parseList, currentIndex, fileInfo, callback) {
//         var result, returnNodes = [];
//         var parser = parserInput;

//         try {
//             parser.start(str, false, function fail(msg, index) {
//                 callback({
//                     message: msg,
//                     index: index + currentIndex
//                 });
//             });
//             for (var x = 0, p, i; (p = parseList[x]); x++) {
//                 i = parser.i;
//                 result = parsers[p]();
//                 if (result) {
//                     result._index = i + currentIndex;
//                     result._fileInfo = fileInfo;
//                     returnNodes.push(result);
//                 }
//                 else {
//                     returnNodes.push(null);
//                 }
//             }

//             var endInfo = parser.end();
//             if (endInfo.isFinished) {
//                 callback(null, returnNodes);
//             }
//             else {
//                 callback(true, null);
//             }
//         } catch (e) {
//             throw new LessError({
//                 index: e.index + currentIndex,
//                 message: e.message
//             }, imports, fileInfo.filename);
//         }
//     }
    
//     //
//     // The Parser
//     //
//     return {
//         parserInput: parserInput,
//         imports: imports,
//         fileInfo: fileInfo,
//         parseNode: parseNode,
//         //
//         // Parse an input string into an abstract syntax tree,
//         // @param str A string containing 'less' markup
//         // @param callback call `callback` when done.
//         // @param [additionalData] An optional map which can contains vars - a map (key, value) of variables to apply
//         //
//         parse: function (str, callback, additionalData) {
//             var root, error = null, globalVars, modifyVars, ignored, preText = '';

//             globalVars = (additionalData && additionalData.globalVars) ? Parser.serializeVars(additionalData.globalVars) + '\n' : '';
//             modifyVars = (additionalData && additionalData.modifyVars) ? '\n' + Parser.serializeVars(additionalData.modifyVars) : '';

//             if (context.pluginManager) {
//                 var preProcessors = context.pluginManager.getPreProcessors();
//                 for (var i = 0; i < preProcessors.length; i++) {
//                     str = preProcessors[i].process(str, { context: context, imports: imports, fileInfo: fileInfo });
//                 }
//             }

//             if (globalVars || (additionalData && additionalData.banner)) {
//                 preText = ((additionalData && additionalData.banner) ? additionalData.banner : '') + globalVars;
//                 ignored = imports.contentsIgnoredChars;
//                 ignored[fileInfo.filename] = ignored[fileInfo.filename] || 0;
//                 ignored[fileInfo.filename] += preText.length;
//             }

//             str = str.replace(/\r\n?/g, '\n');
//             // Remove potential UTF Byte Order Mark
//             str = preText + str.replace(/^\uFEFF/, '') + modifyVars;
//             imports.contents[fileInfo.filename] = str;

//             // Start with the primary rule.
//             // The whole syntax tree is held under a Ruleset node,
//             // with the `root` property set to true, so no `{}` are
//             // output. The callback is called when the input is parsed.
//             try {
//                 parserInput.start(str, context.chunkInput, function fail(msg, index) {
//                     throw new LessError({
//                         index: index,
//                         type: 'Parse',
//                         message: msg,
//                         filename: fileInfo.filename
//                     }, imports);
//                 });
                
//                 tree.Node.prototype.parse = this;
//                 root = new tree.Ruleset(null, this.parsers.primary());
//                 tree.Node.prototype.rootNode = root;
//                 root.root = true;
//                 root.firstRoot = true;
//                 root.functionRegistry = functionRegistry.inherit();
                
//             } catch (e) {
//                 return callback(new LessError(e, imports, fileInfo.filename));
//             }

//             // If `i` is smaller than the `input.length - 1`,
//             // it means the parser wasn't able to parse the whole
//             // string, so we've got a parsing error.
//             //
//             // We try to extract a \n delimited string,
//             // showing the line where the parse error occurred.
//             // We split it up into two parts (the part which parsed,
//             // and the part which didn't), so we can color them differently.
//             var endInfo = parserInput.end();
//             if (!endInfo.isFinished) {

//                 var message = endInfo.furthestPossibleErrorMessage;

//                 if (!message) {
//                     message = 'Unrecognised input';
//                     if (endInfo.furthestChar === '}') {
//                         message += '. Possibly missing opening \'{\'';
//                     } else if (endInfo.furthestChar === ')') {
//                         message += '. Possibly missing opening \'(\'';
//                     } else if (endInfo.furthestReachedEnd) {
//                         message += '. Possibly missing something';
//                     }
//                 }

//                 error = new LessError({
//                     type: 'Parse',
//                     message: message,
//                     index: endInfo.furthest,
//                     filename: fileInfo.filename
//                 }, imports);
//             }

//             var finish = function (e) {
//                 e = error || e || imports.error;

//                 if (e) {
//                     if (!(e instanceof LessError)) {
//                         e = new LessError(e, imports, fileInfo.filename);
//                     }
                    
//                     return callback(e);
//                 }
//                 else {
//                     return callback(null, root);
//                 }
//             };

//             if (context.processImports !== false) {
//                 new visitors.ImportVisitor(imports, finish)
//                     .run(root);
//                 return root;
//             } else {
//                 return finish();
//             }
//         },

//         //
//         // Here in, the parsing rules/functions
//         //
//         // The basic structure of the syntax tree generated is as follows:
//         //
//         //   Ruleset ->  Declaration -> Value -> Expression -> Entity
//         //
//         // Here's some Less code:
//         //
//         //    .class {
//         //      color: #fff;
//         //      border: 1px solid #000;
//         //      width: @w + 4px;
//         //      > .child {...}
//         //    }
//         //
//         // And here's what the parse tree might look like:
//         //
//         //     Ruleset (Selector '.class', [
//         //         Declaration ("color",  Value ([Expression [Color #fff]]))
//         //         Declaration ("border", Value ([Expression [Dimension 1px][Keyword "solid"][Color #000]]))
//         //         Declaration ("width",  Value ([Expression [Operation " + " [Variable "@w"][Dimension 4px]]]))
//         //         Ruleset (Selector [Element '>', '.child'], [...])
//         //     ])
//         //
//         //  In general, most rules will try to parse a token with the `$re()` function, and if the return
//         //  value is truly, will return a new node, of the relevant type. Sometimes, we need to check
//         //  first, before parsing, that's when we use `peek()`.
//         //
//         parsers: parsers = {
//             //
//             // The `primary` rule is the *entry* and *exit* point of the parser.
//             // The rules here can appear at any level of the parse tree.
//             //
//             // The recursive nature of the grammar is an interplay between the `block`
//             // rule, which represents `{ ... }`, the `ruleset` rule, and this `primary` rule,
//             // as represented by this simplified grammar:
//             //
//             //     primary  →  (ruleset | declaration)+
//             //     ruleset  →  selector+ block
//             //     block    →  '{' primary '}'
//             //
//             // Only at one point is the primary rule not called from the
//             // block rule: at the root level.
//             //
//             primary: function () {
//                 var mixin = this.mixin, root = [], node;

//                 while (true) {
//                     while (true) {
//                         node = this.comment();
//                         if (!node) { break; }
//                         root.push(node);
//                     }
//                     // always process comments before deciding if finished
//                     if (parserInput.finished) {
//                         break;
//                     }
//                     if (parserInput.peek('}')) {
//                         break;
//                     }

//                     node = this.extendRule();
//                     if (node) {
//                         root = root.concat(node);
//                         continue;
//                     }

//                     node = mixin.definition() || this.declaration() || this.ruleset() ||
//                         mixin.call(false, false) || this.variableCall() || this.entities.call() || this.atrule();
//                     if (node) {
//                         root.push(node);
//                     } else {
//                         var foundSemiColon = false;
//                         while (parserInput.$char(';')) {
//                             foundSemiColon = true;
//                         }
//                         if (!foundSemiColon) {
//                             break;
//                         }
//                     }
//                 }

//                 return root;
//             },

//             // comments are collected by the main parsing mechanism and then assigned to nodes
//             // where the current structure allows it
//             comment: function () {
//                 if (parserInput.commentStore.length) {
//                     var comment = parserInput.commentStore.shift();
//                     return new(tree.Comment)(comment.text, comment.isLineComment, comment.index, fileInfo);
//                 }
//             },

//             //
//             // Entities are tokens which can be found inside an Expression
//             //
//             entities: {
//                 mixinLookup: function() {
//                     return parsers.mixin.call(true, true);
//                 },
//                 //
//                 // A string, which supports escaping " and '
//                 //
//                 //     "milky way" 'he\'s the one!'
//                 //
//                 quoted: function (forceEscaped) {
//                     var str, index = parserInput.i, isEscaped = false;

//                     parserInput.save();
//                     if (parserInput.$char('~')) {
//                         isEscaped = true;
//                     } else if (forceEscaped) {
//                         parserInput.restore();
//                         return;
//                     }

//                     str = parserInput.$quoted();
//                     if (!str) {
//                         parserInput.restore();
//                         return;
//                     }
//                     parserInput.forget();

//                     return new(tree.Quoted)(str.charAt(0), str.substr(1, str.length - 2), isEscaped, index, fileInfo);
//                 },

//                 //
//                 // A catch-all word, such as:
//                 //
//                 //     black border-collapse
//                 //
//                 keyword: function () {
//                     var k = parserInput.$char('%') || parserInput.$re(/^\[?(?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+\]?/);
//                     if (k) {
//                         return tree.Color.fromKeyword(k) || new(tree.Keyword)(k);
//                     }
//                 },

//                 //
//                 // A function call
//                 //
//                 //     rgb(255, 0, 255)
//                 //
//                 // The arguments are parsed with the `entities.arguments` parser.
//                 //
//                 call: function () {
//                     var name, args, func, index = parserInput.i;

//                     // http://jsperf.com/case-insensitive-regex-vs-strtolower-then-regex/18
//                     if (parserInput.peek(/^url\(/i)) {
//                         return;
//                     }

//                     parserInput.save();

//                     name = parserInput.$re(/^([\w-]+|%|progid:[\w\.]+)\(/);
//                     if (!name) {
//                         parserInput.forget(); 
//                         return;
//                     }

//                     name = name[1];
//                     func = this.customFuncCall(name);
//                     if (func) {
//                         args = func.parse();
//                         if (args && func.stop) {
//                             parserInput.forget();
//                             return args;
//                         }
//                     }

//                     args = this.arguments(args);

//                     if (!parserInput.$char(')')) {
//                         parserInput.restore('Could not parse call arguments or missing \')\'');
//                         return;
//                     }

//                     parserInput.forget();
                    
//                     return new(tree.Call)(name, args, index, fileInfo);
//                 },
                
//                 //
//                 // Parsing rules for functions with non-standard args, e.g.:
//                 //
//                 //     boolean(not(2 > 1))
//                 //
//                 //     This is a quick prototype, to be modified/improved when
//                 //     more custom-parsed funcs come (e.g. `selector(...)`)
//                 //

//                 customFuncCall: function (name) {
//                     /* Ideally the table is to be moved out of here for faster perf.,
//                        but it's quite tricky since it relies on all these `parsers`
//                        and `expect` available only here */
//                     return {
//                         alpha:   f(parsers.ieAlpha, true),
//                         boolean: f(condition),
//                         'if':    f(condition)
//                     }[name.toLowerCase()];

//                     function f(parse, stop) {
//                         return {
//                             parse: parse, // parsing function
//                             stop:  stop   // when true - stop after parse() and return its result, 
//                                           // otherwise continue for plain args
//                         };
//                     }
                
//                     function condition() {
//                         return [expect(parsers.condition, 'expected condition')];
//                     }
//                 },

//                 arguments: function (prevArgs) {
//                     var argsComma = prevArgs || [],
//                         argsSemiColon = [],
//                         isSemiColonSeparated, value;

//                     parserInput.save();

//                     while (true) {
//                         if (prevArgs) {
//                             prevArgs = false;
//                         } else {
//                             value = parsers.detachedRuleset() || this.assignment() || parsers.expression();
//                             if (!value) {
//                                 break;
//                             }

//                             if (value.value && value.value.length == 1) {
//                                 value = value.value[0];
//                             }

//                             argsComma.push(value);
//                         }

//                         if (parserInput.$char(',')) {
//                             continue;
//                         }

//                         if (parserInput.$char(';') || isSemiColonSeparated) {
//                             isSemiColonSeparated = true;
//                             value = (argsComma.length < 1) ? argsComma[0]
//                                 : new tree.Value(argsComma);
//                             argsSemiColon.push(value);
//                             argsComma = [];
//                         }
//                     }

//                     parserInput.forget();
//                     return isSemiColonSeparated ? argsSemiColon : argsComma;
//                 },
//                 literal: function () {
//                     return this.dimension() ||
//                            this.color() ||
//                            this.quoted() ||
//                            this.unicodeDescriptor();
//                 },

//                 // Assignments are argument entities for calls.
//                 // They are present in ie filter properties as shown below.
//                 //
//                 //     filter: progid:DXImageTransform.Microsoft.Alpha( *opacity=50* )
//                 //

//                 assignment: function () {
//                     var key, value;
//                     parserInput.save();
//                     key = parserInput.$re(/^\w+(?=\s?=)/i);
//                     if (!key) {
//                         parserInput.restore();
//                         return;
//                     }
//                     if (!parserInput.$char('=')) {
//                         parserInput.restore();
//                         return;
//                     }
//                     value = parsers.entity();
//                     if (value) {
//                         parserInput.forget();
//                         return new(tree.Assignment)(key, value);
//                     } else {
//                         parserInput.restore();
//                     }
//                 },

//                 //
//                 // Parse url() tokens
//                 //
//                 // We use a specific rule for urls, because they don't really behave like
//                 // standard function calls. The difference is that the argument doesn't have
//                 // to be enclosed within a string, so it can't be parsed as an Expression.
//                 //
//                 url: function () {
//                     var value, index = parserInput.i;

//                     parserInput.autoCommentAbsorb = false;

//                     if (!parserInput.$str('url(')) {
//                         parserInput.autoCommentAbsorb = true;
//                         return;
//                     }

//                     value = this.quoted() || this.variable() || this.property() ||
//                             parserInput.$re(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || '';

//                     parserInput.autoCommentAbsorb = true;

//                     expectChar(')');

//                     return new(tree.URL)((value.value != null || 
//                         value instanceof tree.Variable || 
//                         value instanceof tree.Property) ?
//                         value : new(tree.Anonymous)(value, index), index, fileInfo);
//                 },

//                 //
//                 // A Variable entity, such as `@fink`, in
//                 //
//                 //     width: @fink + 2px
//                 //
//                 // We use a different parser for variable definitions,
//                 // see `parsers.variable`.
//                 //
//                 variable: function () {
//                     var ch, name, index = parserInput.i;

//                     parserInput.save();
//                     if (parserInput.currentChar() === '@' && (name = parserInput.$re(/^@@?[\w-]+/))) {
//                         ch = parserInput.currentChar();
//                         if (ch === '(' || ch === '[' && !parserInput.prevChar().match(/^\s/)) {
//                             // this may be a VariableCall lookup
//                             var result = parsers.variableCall(name);
//                             if (result) {
//                                 parserInput.forget();
//                                 return result;
//                             }
//                         }
//                         parserInput.forget();
//                         return new(tree.Variable)(name, index, fileInfo);
//                     }
//                     parserInput.restore();
//                 },

//                 // A variable entity using the protective {} e.g. @{var}
//                 variableCurly: function () {
//                     var curly, index = parserInput.i;

//                     if (parserInput.currentChar() === '@' && (curly = parserInput.$re(/^@\{([\w-]+)\}/))) {
//                         return new(tree.Variable)('@' + curly[1], index, fileInfo);
//                     }
//                 },
//                 //
//                 // A Property accessor, such as `$color`, in
//                 //
//                 //     background-color: $color
//                 //
//                 property: function () {
//                     var name, index = parserInput.i;

//                     if (parserInput.currentChar() === '$' && (name = parserInput.$re(/^\$[\w-]+/))) {
//                         return new(tree.Property)(name, index, fileInfo);
//                     }
//                 },

//                 // A property entity useing the protective {} e.g. ${prop}
//                 propertyCurly: function () {
//                     var curly, index = parserInput.i;

//                     if (parserInput.currentChar() === '$' && (curly = parserInput.$re(/^\$\{([\w-]+)\}/))) {
//                         return new(tree.Property)('$' + curly[1], index, fileInfo);
//                     }
//                 },
//                 //
//                 // A Hexadecimal color
//                 //
//                 //     #4F3C2F
//                 //
//                 // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
//                 //
//                 color: function () {
//                     var rgb;

//                     if (parserInput.currentChar() === '#' && (rgb = parserInput.$re(/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})/))) {
//                         return new(tree.Color)(rgb[1], undefined, rgb[0]);
//                     }
//                 },

//                 colorKeyword: function () {
//                     parserInput.save();
//                     var autoCommentAbsorb = parserInput.autoCommentAbsorb;
//                     parserInput.autoCommentAbsorb = false;
//                     var k = parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]+/);
//                     parserInput.autoCommentAbsorb = autoCommentAbsorb;
//                     if (!k) {
//                         parserInput.forget();
//                         return;
//                     }
//                     parserInput.restore();
//                     var color = tree.Color.fromKeyword(k);
//                     if (color) {
//                         parserInput.$str(k);
//                         return color;
//                     }
//                 },

//                 //
//                 // A Dimension, that is, a number and a unit
//                 //
//                 //     0.5em 95%
//                 //
//                 dimension: function () {
//                     if (parserInput.peekNotNumeric()) {
//                         return;
//                     }

//                     var value = parserInput.$re(/^([+-]?\d*\.?\d+)(%|[a-z_]+)?/i);
//                     if (value) {
//                         return new(tree.Dimension)(value[1], value[2]);
//                     }
//                 },

//                 //
//                 // A unicode descriptor, as is used in unicode-range
//                 //
//                 // U+0??  or U+00A1-00A9
//                 //
//                 unicodeDescriptor: function () {
//                     var ud;

//                     ud = parserInput.$re(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/);
//                     if (ud) {
//                         return new(tree.UnicodeDescriptor)(ud[0]);
//                     }
//                 },

//                 //
//                 // JavaScript code to be evaluated
//                 //
//                 //     `window.location.href`
//                 //
//                 javascript: function () {
//                     var js, index = parserInput.i;

//                     parserInput.save();

//                     var escape = parserInput.$char('~');
//                     var jsQuote = parserInput.$char('`');

//                     if (!jsQuote) {
//                         parserInput.restore();
//                         return;
//                     }

//                     js = parserInput.$re(/^[^`]*`/);
//                     if (js) {
//                         parserInput.forget();
//                         return new(tree.JavaScript)(js.substr(0, js.length - 1), Boolean(escape), index, fileInfo);
//                     }
//                     parserInput.restore('invalid javascript definition');
//                 }
//             },

//             //
//             // The variable part of a variable definition. Used in the `rule` parser
//             //
//             //     @fink:
//             //
//             variable: function () {
//                 var name;

//                 if (parserInput.currentChar() === '@' && (name = parserInput.$re(/^(@[\w-]+)\s*:/))) { return name[1]; }
//             },

//             //
//             // Call a variable value to retrieve a detached ruleset
//             // or a value from a detached ruleset's rules.
//             //
//             //     @fink();
//             //     @fink;
//             //     color: @fink[@color];
//             //
//             variableCall: function (parsedName) {
//                 var lookups, important, i = parserInput.i,
//                     inValue = !!parsedName, name = parsedName;

//                 parserInput.save();

//                 if (name || (parserInput.currentChar() === '@'
//                     && (name = parserInput.$re(/^(@[\w-]+)(\(\s*\))?/)))) {

//                     lookups = this.mixin.ruleLookups();

//                     if (!lookups && ((inValue && parserInput.$str('()') !== '()') || (name[2] !== '()'))) {
//                         parserInput.restore('Missing \'[...]\' lookup in variable call');
//                         return;
//                     }

//                     if (!inValue) {
//                         name = name[1];
//                     }

//                     if (lookups && parsers.important()) {
//                         important = true;
//                     }

//                     var call = new tree.VariableCall(name, i, fileInfo);
//                     if (!inValue && parsers.end()) {
//                         parserInput.forget();
//                         return call;
//                     }
//                     else {
//                         parserInput.forget();
//                         return new tree.NamespaceValue(call, lookups, important, i, fileInfo);
//                     }
//                 }

//                 parserInput.restore();
//             },

//             //
//             // extend syntax - used to extend selectors
//             //
//             extend: function(isRule) {
//                 var elements, e, index = parserInput.i, option, extendList, extend;

//                 if (!parserInput.$str(isRule ? '&:extend(' : ':extend(')) {
//                     return;
//                 }

//                 do {
//                     option = null;
//                     elements = null;
//                     while (!(option = parserInput.$re(/^(all)(?=\s*(\)|,))/))) {
//                         e = this.element();
//                         if (!e) {
//                             break;
//                         }
//                         if (elements) {
//                             elements.push(e);
//                         } else {
//                             elements = [ e ];
//                         }
//                     }

//                     option = option && option[1];
//                     if (!elements) {
//                         error('Missing target selector for :extend().');
//                     }
//                     extend = new(tree.Extend)(new(tree.Selector)(elements), option, index, fileInfo);
//                     if (extendList) {
//                         extendList.push(extend);
//                     } else {
//                         extendList = [ extend ];
//                     }
//                 } while (parserInput.$char(','));

//                 expect(/^\)/);

//                 if (isRule) {
//                     expect(/^;/);
//                 }

//                 return extendList;
//             },

//             //
//             // extendRule - used in a rule to extend all the parent selectors
//             //
//             extendRule: function() {
//                 return this.extend(true);
//             },

//             //
//             // Mixins
//             //
//             mixin: {
//                 //
//                 // A Mixin call, with an optional argument list
//                 //
//                 //     #mixins > .square(#fff);
//                 //     #mixins.square(#fff);
//                 //     .rounded(4px, black);
//                 //     .button;
//                 //
//                 // We can lookup / return a value using the lookup syntax:
//                 //
//                 //     color: #mixin.square(#fff)[@color];
//                 //
//                 // The `while` loop is there because mixins can be
//                 // namespaced, but we only support the child and descendant
//                 // selector for now.
//                 //
//                 call: function (inValue, getLookup) {
//                     var s = parserInput.currentChar(), important = false, lookups,
//                         index = parserInput.i, elements, args, hasParens;

//                     if (s !== '.' && s !== '#') { return; }

//                     parserInput.save(); // stop us absorbing part of an invalid selector

//                     elements = this.elements();

//                     if (elements) {
//                         if (parserInput.$char('(')) {
//                             args = this.args(true).args;
//                             expectChar(')');
//                             hasParens = true;
//                         }

//                         if (getLookup !== false) {
//                             lookups = this.ruleLookups();
//                         }
//                         if (getLookup === true && !lookups) {
//                             parserInput.restore();
//                             return;
//                         }

//                         if (inValue && !lookups && !hasParens) {
//                             // This isn't a valid in-value mixin call
//                             parserInput.restore();
//                             return;
//                         }

//                         if (!inValue && parsers.important()) {
//                             important = true;
//                         }

//                         if (inValue || parsers.end()) {
//                             parserInput.forget();
//                             var mixin = new(tree.mixin.Call)(elements, args, index, fileInfo, !lookups && important);
//                             if (lookups) {
//                                 return new tree.NamespaceValue(mixin, lookups, important);
//                             }
//                             else {
//                                 return mixin;
//                             }
//                         }
//                     }

//                     parserInput.restore();
//                 },
//                 /**
//                  * Matching elements for mixins
//                  * (Start with . or # and can have > )
//                  */
//                 elements: function() {
//                     var elements, e, c, elem, elemIndex,
//                         re = /^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/;
//                     while (true) {
//                         elemIndex = parserInput.i;
//                         e = parserInput.$re(re);
                        
//                         if (!e) {
//                             break;
//                         }
//                         elem = new(tree.Element)(c, e, false, elemIndex, fileInfo);
//                         if (elements) {
//                             elements.push(elem);
//                         } else {
//                             elements = [ elem ];
//                         }
//                         c = parserInput.$char('>');
//                     }
//                     return elements;
//                 },
//                 args: function (isCall) {
//                     var entities = parsers.entities,
//                         returner = { args:null, variadic: false },
//                         expressions = [], argsSemiColon = [], argsComma = [],
//                         isSemiColonSeparated, expressionContainsNamed, name, nameLoop,
//                         value, arg, expand, hasSep = true; 

//                     parserInput.save();

//                     while (true) {
//                         if (isCall) {
//                             arg = parsers.detachedRuleset() || parsers.expression();
//                         } else {
//                             parserInput.commentStore.length = 0;
//                             if (parserInput.$str('...')) {
//                                 returner.variadic = true;
//                                 if (parserInput.$char(';') && !isSemiColonSeparated) {
//                                     isSemiColonSeparated = true;
//                                 }
//                                 (isSemiColonSeparated ? argsSemiColon : argsComma)
//                                     .push({ variadic: true });
//                                 break;
//                             }
//                             arg = entities.variable() || entities.property() || entities.literal() || entities.keyword() || this.call(true);
//                         }

//                         if (!arg || !hasSep) {
//                             break;
//                         }

//                         nameLoop = null;
//                         if (arg.throwAwayComments) {
//                             arg.throwAwayComments();
//                         }
//                         value = arg;
//                         var val = null;

//                         if (isCall) {
//                             // Variable
//                             if (arg.value && arg.value.length == 1) {
//                                 val = arg.value[0];
//                             }
//                         } else {
//                             val = arg;
//                         }

//                         if (val && (val instanceof tree.Variable || val instanceof tree.Property)) {
//                             if (parserInput.$char(':')) {
//                                 if (expressions.length > 0) {
//                                     if (isSemiColonSeparated) {
//                                         error('Cannot mix ; and , as delimiter types');
//                                     }
//                                     expressionContainsNamed = true;
//                                 }

//                                 value = parsers.detachedRuleset() || parsers.expression();

//                                 if (!value) {
//                                     if (isCall) {
//                                         error('could not understand value for named argument');
//                                     } else {
//                                         parserInput.restore();
//                                         returner.args = [];
//                                         return returner;
//                                     }
//                                 }
//                                 nameLoop = (name = val.name);
//                             } else if (parserInput.$str('...')) {
//                                 if (!isCall) {
//                                     returner.variadic = true;
//                                     if (parserInput.$char(';') && !isSemiColonSeparated) {
//                                         isSemiColonSeparated = true;
//                                     }
//                                     (isSemiColonSeparated ? argsSemiColon : argsComma)
//                                         .push({ name: arg.name, variadic: true });
//                                     break;
//                                 } else {
//                                     expand = true;
//                                 }
//                             } else if (!isCall) {
//                                 name = nameLoop = val.name;
//                                 value = null;
//                             }
//                         }

//                         if (value) {
//                             expressions.push(value);
//                         }

//                         argsComma.push({ name:nameLoop, value:value, expand:expand });

//                         if (parserInput.$char(',')) {
//                             hasSep = true;
//                             continue;
//                         }
//                         hasSep = parserInput.$char(';') === ';';

//                         if (hasSep || isSemiColonSeparated) {

//                             if (expressionContainsNamed) {
//                                 error('Cannot mix ; and , as delimiter types');
//                             }

//                             isSemiColonSeparated = true;

//                             if (expressions.length > 1) {
//                                 value = new(tree.Value)(expressions);
//                             }
//                             argsSemiColon.push({ name:name, value:value, expand:expand });

//                             name = null;
//                             expressions = [];
//                             expressionContainsNamed = false;
//                         }
//                     }

//                     parserInput.forget();
//                     returner.args = isSemiColonSeparated ? argsSemiColon : argsComma;
//                     return returner;
//                 },
//                 //
//                 // A Mixin definition, with a list of parameters
//                 //
//                 //     .rounded (@radius: 2px, @color) {
//                 //        ...
//                 //     }
//                 //
//                 // Until we have a finer grained state-machine, we have to
//                 // do a look-ahead, to make sure we don't have a mixin call.
//                 // See the `rule` function for more information.
//                 //
//                 // We start by matching `.rounded (`, and then proceed on to
//                 // the argument list, which has optional default values.
//                 // We store the parameters in `params`, with a `value` key,
//                 // if there is a value, such as in the case of `@radius`.
//                 //
//                 // Once we've got our params list, and a closing `)`, we parse
//                 // the `{...}` block.
//                 //
//                 definition: function () {
//                     var name, params = [], match, ruleset, cond, variadic = false;
//                     if ((parserInput.currentChar() !== '.' && parserInput.currentChar() !== '#') ||
//                         parserInput.peek(/^[^{]*\}/)) {
//                         return;
//                     }

//                     parserInput.save();

//                     match = parserInput.$re(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/);
//                     if (match) {
//                         name = match[1];

//                         var argInfo = this.args(false);
//                         params = argInfo.args;
//                         variadic = argInfo.variadic;

//                         // .mixincall("@{a}");
//                         // looks a bit like a mixin definition..
//                         // also
//                         // .mixincall(@a: {rule: set;});
//                         // so we have to be nice and restore
//                         if (!parserInput.$char(')')) {
//                             parserInput.restore('Missing closing \')\'');
//                             return;
//                         }

//                         parserInput.commentStore.length = 0;

//                         if (parserInput.$str('when')) { // Guard
//                             cond = expect(parsers.conditions, 'expected condition');
//                         }

//                         ruleset = parsers.block();

//                         if (ruleset) {
//                             parserInput.forget();
//                             return new(tree.mixin.Definition)(name, params, ruleset, cond, variadic);
//                         } else {
//                             parserInput.restore();
//                         }
//                     } else {
//                         parserInput.forget();
//                     }
//                 },
            
//                 ruleLookups: function() {
//                     var rule, args, lookups = [];

//                     if (parserInput.currentChar() !== '[') { 
//                         return;
//                     }
                    
//                     while (true) {
//                         parserInput.save();
//                         args = null;
//                         rule = this.lookupValue();
//                         if (!rule && rule !== '') {
//                             parserInput.restore();
//                             break;
//                         }
//                         lookups.push(rule);
//                         parserInput.forget();
//                     }
//                     if (lookups.length > 0) {
//                         return lookups;
//                     }
//                 },
    
//                 lookupValue: function() {
//                     parserInput.save();
    
//                     if (!parserInput.$char('[')) { 
//                         parserInput.restore();
//                         return;
//                     }
    
//                     var name = parserInput.$re(/^(?:[@$]{0,2})[_a-zA-Z0-9-]*/);
    
//                     if (!parserInput.$char(']')) {
//                         parserInput.restore();
//                         return;
//                     } 

//                     if (name || name === '') {
//                         parserInput.forget();
//                         return name;
//                     }
    
//                     parserInput.restore();
//                 }
//             },
//             //
//             // Entities are the smallest recognized token,
//             // and can be found inside a rule's value.
//             //
//             entity: function () {
//                 var entities = this.entities;

//                 return this.comment() || entities.literal() || entities.variable() || entities.url() ||
//                     entities.property() || entities.call() || entities.keyword() || this.mixin.call(true) ||
//                     entities.javascript();
//             },

//             //
//             // A Declaration terminator. Note that we use `peek()` to check for '}',
//             // because the `block` rule will be expecting it, but we still need to make sure
//             // it's there, if ';' was omitted.
//             //
//             end: function () {
//                 return parserInput.$char(';') || parserInput.peek('}');
//             },

//             //
//             // IE's alpha function
//             //
//             //     alpha(opacity=88)
//             //
//             ieAlpha: function () {
//                 var value;

//                 // http://jsperf.com/case-insensitive-regex-vs-strtolower-then-regex/18
//                 if (!parserInput.$re(/^opacity=/i)) { return; }
//                 value = parserInput.$re(/^\d+/);
//                 if (!value) {
//                     value = expect(parsers.entities.variable, 'Could not parse alpha');
//                     value = '@{' + value.name.slice(1) + '}';
//                 }
//                 expectChar(')');
//                 return new tree.Quoted('', 'alpha(opacity=' + value + ')');
//             },

//             //
//             // A Selector Element
//             //
//             //     div
//             //     + h1
//             //     #socks
//             //     input[type="text"]
//             //
//             // Elements are the building blocks for Selectors,
//             // they are made out of a `Combinator` (see combinator rule),
//             // and an element name, such as a tag a class, or `*`.
//             //
//             element: function () {
//                 var e, c, v, index = parserInput.i;

//                 c = this.combinator();

//                 e = parserInput.$re(/^(?:\d+\.\d+|\d+)%/) ||
//                     parserInput.$re(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) ||
//                     parserInput.$char('*') || parserInput.$char('&') || this.attribute() ||
//                     parserInput.$re(/^\([^&()@]+\)/) ||  parserInput.$re(/^[\.#:](?=@)/) ||
//                     this.entities.variableCurly();

//                 if (!e) {
//                     parserInput.save();
//                     if (parserInput.$char('(')) {
//                         if ((v = this.selector(false)) && parserInput.$char(')')) {
//                             e = new(tree.Paren)(v);
//                             parserInput.forget();
//                         } else {
//                             parserInput.restore('Missing closing \')\'');
//                         }
//                     } else {
//                         parserInput.forget();
//                     }
//                 }

//                 if (e) { return new(tree.Element)(c, e, e instanceof tree.Variable, index, fileInfo); }
//             },

//             //
//             // Combinators combine elements together, in a Selector.
//             //
//             // Because our parser isn't white-space sensitive, special care
//             // has to be taken, when parsing the descendant combinator, ` `,
//             // as it's an empty space. We have to check the previous character
//             // in the input, to see if it's a ` ` character. More info on how
//             // we deal with this in *combinator.js*.
//             //
//             combinator: function () {
//                 var c = parserInput.currentChar();

//                 if (c === '/') {
//                     parserInput.save();
//                     var slashedCombinator = parserInput.$re(/^\/[a-z]+\//i);
//                     if (slashedCombinator) {
//                         parserInput.forget();
//                         return new(tree.Combinator)(slashedCombinator);
//                     }
//                     parserInput.restore();
//                 }

//                 if (c === '>' || c === '+' || c === '~' || c === '|' || c === '^') {
//                     parserInput.i++;
//                     if (c === '^' && parserInput.currentChar() === '^') {
//                         c = '^^';
//                         parserInput.i++;
//                     }
//                     while (parserInput.isWhitespace()) { parserInput.i++; }
//                     return new(tree.Combinator)(c);
//                 } else if (parserInput.isWhitespace(-1)) {
//                     return new(tree.Combinator)(' ');
//                 } else {
//                     return new(tree.Combinator)(null);
//                 }
//             },
//             //
//             // A CSS Selector
//             // with less extensions e.g. the ability to extend and guard
//             //
//             //     .class > div + h1
//             //     li a:hover
//             //
//             // Selectors are made out of one or more Elements, see above.
//             //
//             selector: function (isLess) {
//                 var index = parserInput.i, elements, extendList, c, e, allExtends, when, condition;
//                 isLess = isLess !== false;
//                 while ((isLess && (extendList = this.extend())) || (isLess && (when = parserInput.$str('when'))) || (e = this.element())) {
//                     if (when) {
//                         condition = expect(this.conditions, 'expected condition');
//                     } else if (condition) {
//                         error('CSS guard can only be used at the end of selector');
//                     } else if (extendList) {
//                         if (allExtends) {
//                             allExtends = allExtends.concat(extendList);
//                         } else {
//                             allExtends = extendList;
//                         }
//                     } else {
//                         if (allExtends) { error('Extend can only be used at the end of selector'); }
//                         c = parserInput.currentChar();
//                         if (elements) {
//                             elements.push(e);
//                         } else {
//                             elements = [ e ];
//                         }
//                         e = null;
//                     }
//                     if (c === '{' || c === '}' || c === ';' || c === ',' || c === ')') {
//                         break;
//                     }
//                 }

//                 if (elements) { return new(tree.Selector)(elements, allExtends, condition, index, fileInfo); }
//                 if (allExtends) { error('Extend must be used to extend a selector, it cannot be used on its own'); }
//             },
//             selectors: function () {
//                 var s, selectors;
//                 while (true) {
//                     s = this.selector();
//                     if (!s) {
//                         break;
//                     }
//                     if (selectors) {
//                         selectors.push(s);
//                     } else {
//                         selectors = [ s ];
//                     }
//                     parserInput.commentStore.length = 0;
//                     if (s.condition && selectors.length > 1) {
//                         error("Guards are only currently allowed on a single selector.");
//                     }
//                     if (!parserInput.$char(',')) { break; }
//                     if (s.condition) {
//                         error("Guards are only currently allowed on a single selector.");
//                     }
//                     parserInput.commentStore.length = 0;
//                 }
//                 return selectors;
//             },
//             attribute: function () {
//                 if (!parserInput.$char('[')) { return; }

//                 var entities = this.entities,
//                     key, val, op;

//                 if (!(key = entities.variableCurly())) {
//                     key = expect(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/);
//                 }

//                 op = parserInput.$re(/^[|~*$^]?=/);
//                 if (op) {
//                     val = entities.quoted() || parserInput.$re(/^[0-9]+%/) || parserInput.$re(/^[\w-]+/) || entities.variableCurly();
//                 }

//                 expectChar(']');

//                 return new(tree.Attribute)(key, op, val);
//             },

//             //
//             // The `block` rule is used by `ruleset` and `mixin.definition`.
//             // It's a wrapper around the `primary` rule, with added `{}`.
//             //
//             block: function () {
//                 var content;
//                 if (parserInput.$char('{') && (content = this.primary()) && parserInput.$char('}')) {
//                     return content;
//                 }
//             },

//             blockRuleset: function() {
//                 var block = this.block();

//                 if (block) {
//                     block = new tree.Ruleset(null, block);
//                 }
//                 return block;
//             },

//             detachedRuleset: function() {
//                 var argInfo, params, variadic;

//                 parserInput.save();
//                 if (parserInput.$re(/^[.#]\(/)) {
//                     /**
//                      * DR args currently only implemented for each() function, and not 
//                      * yet settable as `@dr: #(@arg) {}`
//                      * This should be done when DRs are merged with mixins.
//                      * See: https://github.com/less/less-meta/issues/16
//                      */
//                     argInfo = this.mixin.args(false);
//                     params = argInfo.args;
//                     variadic = argInfo.variadic;
//                     if (!parserInput.$char(')')) {
//                         parserInput.restore();
//                         return;
//                     }
//                 }
//                 var blockRuleset = this.blockRuleset();
//                 if (blockRuleset) {
//                     parserInput.forget();
//                     if (params) {
//                         return new tree.mixin.Definition(null, params, blockRuleset, null, variadic);
//                     }
//                     return new tree.DetachedRuleset(blockRuleset);
//                 }
//                 parserInput.restore();
//             },

//             //
//             // div, .class, body > p {...}
//             //
//             ruleset: function () {
//                 var selectors, rules, debugInfo;

//                 parserInput.save();

//                 if (context.dumpLineNumbers) {
//                     debugInfo = getDebugInfo(parserInput.i);
//                 }

//                 selectors = this.selectors();

//                 if (selectors && (rules = this.block())) {
//                     parserInput.forget();
//                     var ruleset = new(tree.Ruleset)(selectors, rules, context.strictImports);
//                     if (context.dumpLineNumbers) {
//                         ruleset.debugInfo = debugInfo;
//                     }
//                     return ruleset;
//                 } else {
//                     parserInput.restore();
//                 }
//             },
//             declaration: function () {
//                 var name, value, index = parserInput.i, hasDR,
//                     c = parserInput.currentChar(), important, merge, isVariable;

//                 if (c === '.' || c === '#' || c === '&' || c === ':') { return; }

//                 parserInput.save();

//                 name = this.variable() || this.ruleProperty();
//                 if (name) {
//                     isVariable = typeof name === 'string';

//                     if (isVariable) {
//                         value = this.detachedRuleset();
//                         if (value) {
//                             hasDR = true;
//                         }
//                     }

//                     parserInput.commentStore.length = 0;
//                     if (!value) {
//                         // a name returned by this.ruleProperty() is always an array of the form:
//                         // [string-1, ..., string-n, ""] or [string-1, ..., string-n, "+"]
//                         // where each item is a tree.Keyword or tree.Variable
//                         merge = !isVariable && name.length > 1 && name.pop().value;

//                         // Custom property values get permissive parsing
//                         if (name[0].value && name[0].value.slice(0, 2) === '--') {
//                             value = this.permissiveValue();
//                         }
//                         // Try to store values as anonymous
//                         // If we need the value later we'll re-parse it in ruleset.parseValue
//                         else {
//                             value = this.anonymousValue();
//                         }
//                         if (value) {
//                             parserInput.forget();
//                             // anonymous values absorb the end ';' which is required for them to work
//                             return new (tree.Declaration)(name, value, false, merge, index, fileInfo);
//                         }

//                         if (!value) {
//                             value = this.value();
//                         }

//                         if (value) {
//                             important = this.important();
//                         } else if (isVariable) {
//                             // As a last resort, try permissiveValue
//                             value = this.permissiveValue();
//                         }
//                     }

//                     if (value && (this.end() || hasDR)) {
//                         parserInput.forget();
//                         return new (tree.Declaration)(name, value, important, merge, index, fileInfo);
//                     }
//                     else {
//                         parserInput.restore();
//                     }
//                 } else {
//                     parserInput.restore();
//                 }
//             },
//             anonymousValue: function () {
//                 var index = parserInput.i;
//                 var match = parserInput.$re(/^([^.#@\$+\/'"*`(;{}-]*);/);
//                 if (match) {
//                     return new(tree.Anonymous)(match[1], index);
//                 }
//             },
//             /**
//              * Used for custom properties, at-rules, and variables (as fallback)
//              * Parses almost anything inside of {} [] () "" blocks
//              * until it reaches outer-most tokens.
//              * 
//              * First, it will try to parse comments and entities to reach
//              * the end. This is mostly like the Expression parser except no
//              * math is allowed.
//              */
//             permissiveValue: function (untilTokens) {
//                 var i, e, done, value, 
//                     tok = untilTokens || ';',
//                     index = parserInput.i, result = [];

//                 function testCurrentChar() {
//                     var char = parserInput.currentChar();
//                     if (typeof tok === 'string') {
//                         return char === tok;
//                     } else {
//                         return tok.test(char);
//                     }
//                 }
//                 if (testCurrentChar()) {
//                     return;
//                 }
//                 value = [];
//                 do {
//                     e = this.comment();
//                     if (e) {
//                         value.push(e);
//                         continue;
//                     }
//                     e = this.entity();
//                     if (e) {
//                         value.push(e);
//                     }
//                 } while (e);

//                 done = testCurrentChar();
                
//                 if (value.length > 0) {
//                     value = new(tree.Expression)(value);
//                     if (done) {
//                         return value;
//                     }
//                     else {
//                         result.push(value);
//                     }
//                     // Preserve space before $parseUntil as it will not
//                     if (parserInput.prevChar() === ' ') {
//                         result.push(new tree.Anonymous(' ', index));
//                     }
//                 }
//                 parserInput.save();
                
//                 value = parserInput.$parseUntil(tok);

//                 if (value) {
//                     if (typeof value === 'string') {
//                         error('Expected \'' + value + '\'', 'Parse');
//                     }
//                     if (value.length === 1 && value[0] === ' ') {
//                         parserInput.forget();
//                         return new tree.Anonymous('', index);
//                     }
//                     var item;
//                     for (i = 0; i < value.length; i++) {
//                         item = value[i];
//                         if (Array.isArray(item)) {
//                             // Treat actual quotes as normal quoted values
//                             result.push(new tree.Quoted(item[0], item[1], true, index, fileInfo));
//                         }
//                         else {
//                             if (i === value.length - 1) {
//                                 item = item.trim();
//                             }
//                             // Treat like quoted values, but replace vars like unquoted expressions
//                             var quote = new tree.Quoted('\'', item, true, index, fileInfo);
//                             quote.variableRegex = /@([\w-]+)/g;
//                             quote.propRegex = /\$([\w-]+)/g;
//                             result.push(quote);
//                         }
//                     }
//                     parserInput.forget();
//                     return new tree.Expression(result, true);
//                 }
//                 parserInput.restore();
//             },

//             //
//             // An @import atrule
//             //
//             //     @import "lib";
//             //
//             // Depending on our environment, importing is done differently:
//             // In the browser, it's an XHR request, in Node, it would be a
//             // file-system operation. The function used for importing is
//             // stored in `import`, which we pass to the Import constructor.
//             //
//             'import': function () {
//                 var path, features, index = parserInput.i;

//                 var dir = parserInput.$re(/^@import?\s+/);

//                 if (dir) {
//                     var options = (dir ? this.importOptions() : null) || {};

//                     if ((path = this.entities.quoted() || this.entities.url())) {
//                         features = this.mediaFeatures();

//                         if (!parserInput.$char(';')) {
//                             parserInput.i = index;
//                             error('missing semi-colon or unrecognised media features on import');
//                         }
//                         features = features && new(tree.Value)(features);
//                         return new(tree.Import)(path, features, options, index, fileInfo);
//                     }
//                     else {
//                         parserInput.i = index;
//                         error('malformed import statement');
//                     }
//                 }
//             },

//             importOptions: function() {
//                 var o, options = {}, optionName, value;

//                 // list of options, surrounded by parens
//                 if (!parserInput.$char('(')) { return null; }
//                 do {
//                     o = this.importOption();
//                     if (o) {
//                         optionName = o;
//                         value = true;
//                         switch (optionName) {
//                             case 'css':
//                                 optionName = 'less';
//                                 value = false;
//                                 break;
//                             case 'once':
//                                 optionName = 'multiple';
//                                 value = false;
//                                 break;
//                         }
//                         options[optionName] = value;
//                         if (!parserInput.$char(',')) { break; }
//                     }
//                 } while (o);
//                 expectChar(')');
//                 return options;
//             },

//             importOption: function() {
//                 var opt = parserInput.$re(/^(less|css|multiple|once|inline|reference|optional)/);
//                 if (opt) {
//                     return opt[1];
//                 }
//             },

//             mediaFeature: function () {
//                 var entities = this.entities, nodes = [], e, p;
//                 parserInput.save();
//                 do {
//                     e = entities.keyword() || entities.variable() || entities.mixinLookup();
//                     if (e) {
//                         nodes.push(e);
//                     } else if (parserInput.$char('(')) {
//                         p = this.property();
//                         e = this.value();
//                         if (parserInput.$char(')')) {
//                             if (p && e) {
//                                 nodes.push(new(tree.Paren)(new(tree.Declaration)(p, e, null, null, parserInput.i, fileInfo, true)));
//                             } else if (e) {
//                                 nodes.push(new(tree.Paren)(e));
//                             } else {
//                                 error('badly formed media feature definition');
//                             }
//                         } else {
//                             error('Missing closing \')\'', 'Parse');
//                         }
//                     }
//                 } while (e);

//                 parserInput.forget();
//                 if (nodes.length > 0) {
//                     return new(tree.Expression)(nodes);
//                 }
//             },

//             mediaFeatures: function () {
//                 var entities = this.entities, features = [], e;
//                 do {
//                     e = this.mediaFeature();
//                     if (e) {
//                         features.push(e);
//                         if (!parserInput.$char(',')) { break; }
//                     } else {
//                         e = entities.variable() || entities.mixinLookup();
//                         if (e) {
//                             features.push(e);
//                             if (!parserInput.$char(',')) { break; }
//                         }
//                     }
//                 } while (e);

//                 return features.length > 0 ? features : null;
//             },

//             media: function () {
//                 var features, rules, media, debugInfo, index = parserInput.i;

//                 if (context.dumpLineNumbers) {
//                     debugInfo = getDebugInfo(index);
//                 }

//                 parserInput.save();

//                 if (parserInput.$str('@media')) {
//                     features = this.mediaFeatures();

//                     rules = this.block();

//                     if (!rules) {
//                         error('media definitions require block statements after any features');
//                     }

//                     parserInput.forget();

//                     media = new(tree.Media)(rules, features, index, fileInfo);
//                     if (context.dumpLineNumbers) {
//                         media.debugInfo = debugInfo;
//                     }

//                     return media;
//                 }

//                 parserInput.restore();
//             },

//             //

//             // A @plugin directive, used to import plugins dynamically.
//             //
//             //     @plugin (args) "lib";
//             //
//             plugin: function () {
//                 var path, args, options,
//                     index = parserInput.i,
//                     dir   = parserInput.$re(/^@plugin?\s+/);

//                 if (dir) {
//                     args = this.pluginArgs();

//                     if (args) {
//                         options = {
//                             pluginArgs: args,
//                             isPlugin: true
//                         };
//                     }
//                     else {
//                         options = { isPlugin: true };
//                     }

//                     if ((path = this.entities.quoted() || this.entities.url())) {

//                         if (!parserInput.$char(';')) {
//                             parserInput.i = index;
//                             error('missing semi-colon on @plugin');
//                         }
//                         return new(tree.Import)(path, null, options, index, fileInfo);
//                     }
//                     else {
//                         parserInput.i = index;
//                         error('malformed @plugin statement');
//                     }
//                 }
//             },

//             pluginArgs: function() {
//                 // list of options, surrounded by parens
//                 parserInput.save();
//                 if (!parserInput.$char('(')) {
//                     parserInput.restore();
//                     return null;
//                 }
//                 var args = parserInput.$re(/^\s*([^\);]+)\)\s*/);
//                 if (args[1]) {
//                     parserInput.forget();
//                     return args[1].trim();
//                 }
//                 else { 
//                     parserInput.restore();
//                     return null;
//                 }
//             },

//             //
//             // A CSS AtRule
//             //
//             //     @charset "utf-8";
//             //
//             atrule: function () {
//                 var index = parserInput.i, name, value, rules, nonVendorSpecificName,
//                     hasIdentifier, hasExpression, hasUnknown, hasBlock = true, isRooted = true;

//                 if (parserInput.currentChar() !== '@') { return; }

//                 value = this['import']() || this.plugin() || this.media();
//                 if (value) {
//                     return value;
//                 }

//                 parserInput.save();

//                 name = parserInput.$re(/^@[a-z-]+/);

//                 if (!name) { return; }

//                 nonVendorSpecificName = name;
//                 if (name.charAt(1) == '-' && name.indexOf('-', 2) > 0) {
//                     nonVendorSpecificName = '@' + name.slice(name.indexOf('-', 2) + 1);
//                 }

//                 switch (nonVendorSpecificName) {
//                     case '@charset':
//                         hasIdentifier = true;
//                         hasBlock = false;
//                         break;
//                     case '@namespace':
//                         hasExpression = true;
//                         hasBlock = false;
//                         break;
//                     case '@keyframes':
//                     case '@counter-style':
//                         hasIdentifier = true;
//                         break;
//                     case '@document':
//                     case '@supports':
//                         hasUnknown = true;
//                         isRooted = false;
//                         break;
//                     default:
//                         hasUnknown = true;
//                         break;
//                 }

//                 parserInput.commentStore.length = 0;

//                 if (hasIdentifier) {
//                     value = this.entity();
//                     if (!value) {
//                         error('expected ' + name + ' identifier');
//                     }
//                 } else if (hasExpression) {
//                     value = this.expression();
//                     if (!value) {
//                         error('expected ' + name + ' expression');
//                     }
//                 } else if (hasUnknown) {
//                     value = this.permissiveValue(/^[{;]/);
//                     hasBlock = (parserInput.currentChar() === '{');
//                     if (!value) {
//                         if (!hasBlock && parserInput.currentChar() !== ';') {
//                             error(name + ' rule is missing block or ending semi-colon');
//                         }
//                     }
//                     else if (!value.value) {
//                         value = null;
//                     }
//                 }

//                 if (hasBlock) {
//                     rules = this.blockRuleset();
//                 }

//                 if (rules || (!hasBlock && value && parserInput.$char(';'))) {
//                     parserInput.forget();
//                     return new (tree.AtRule)(name, value, rules, index, fileInfo,
//                         context.dumpLineNumbers ? getDebugInfo(index) : null,
//                         isRooted
//                     );
//                 }

//                 parserInput.restore('at-rule options not recognised');
//             },

//             //
//             // A Value is a comma-delimited list of Expressions
//             //
//             //     font-family: Baskerville, Georgia, serif;
//             //
//             // In a Rule, a Value represents everything after the `:`,
//             // and before the `;`.
//             //
//             value: function () {
//                 var e, expressions = [], index = parserInput.i;

//                 do {
//                     e = this.expression();
//                     if (e) {
//                         expressions.push(e);
//                         if (!parserInput.$char(',')) { break; }
//                     }
//                 } while (e);

//                 if (expressions.length > 0) {
//                     return new(tree.Value)(expressions, index);
//                 }
//             },
//             important: function () {
//                 if (parserInput.currentChar() === '!') {
//                     return parserInput.$re(/^! *important/);
//                 }
//             },
//             sub: function () {
//                 var a, e;

//                 parserInput.save();
//                 if (parserInput.$char('(')) {
//                     a = this.addition();
//                     if (a && parserInput.$char(')')) {
//                         parserInput.forget();
//                         e = new(tree.Expression)([a]);
//                         e.parens = true;
//                         return e;
//                     }
//                     parserInput.restore('Expected \')\'');
//                     return;
//                 }
//                 parserInput.restore();
//             },
//             multiplication: function () {
//                 var m, a, op, operation, isSpaced;
//                 m = this.operand();
//                 if (m) {
//                     isSpaced = parserInput.isWhitespace(-1);
//                     while (true) {
//                         if (parserInput.peek(/^\/[*\/]/)) {
//                             break;
//                         }

//                         parserInput.save();

//                         op = parserInput.$char('/') || parserInput.$char('*') || parserInput.$str('./');

//                         if (!op) { parserInput.forget(); break; }

//                         a = this.operand();

//                         if (!a) { parserInput.restore(); break; }
//                         parserInput.forget();

//                         m.parensInOp = true;
//                         a.parensInOp = true;
//                         operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
//                         isSpaced = parserInput.isWhitespace(-1);
//                     }
//                     return operation || m;
//                 }
//             },
//             addition: function () {
//                 var m, a, op, operation, isSpaced;
//                 m = this.multiplication();
//                 if (m) {
//                     isSpaced = parserInput.isWhitespace(-1);
//                     while (true) {
//                         op = parserInput.$re(/^[-+]\s+/) || (!isSpaced && (parserInput.$char('+') || parserInput.$char('-')));
//                         if (!op) {
//                             break;
//                         }
//                         a = this.multiplication();
//                         if (!a) {
//                             break;
//                         }

//                         m.parensInOp = true;
//                         a.parensInOp = true;
//                         operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
//                         isSpaced = parserInput.isWhitespace(-1);
//                     }
//                     return operation || m;
//                 }
//             },
//             conditions: function () {
//                 var a, b, index = parserInput.i, condition;

//                 a = this.condition(true);
//                 if (a) {
//                     while (true) {
//                         if (!parserInput.peek(/^,\s*(not\s*)?\(/) || !parserInput.$char(',')) {
//                             break;
//                         }
//                         b = this.condition(true);
//                         if (!b) {
//                             break;
//                         }
//                         condition = new(tree.Condition)('or', condition || a, b, index);
//                     }
//                     return condition || a;
//                 }
//             },
//             condition: function (needsParens) {
//                 var result, logical, next;
//                 function or() {
//                     return parserInput.$str('or');
//                 }

//                 result = this.conditionAnd(needsParens);
//                 if (!result) {
//                     return ;
//                 }
//                 logical = or();
//                 if (logical) {
//                     next = this.condition(needsParens);
//                     if (next) {
//                         result = new(tree.Condition)(logical, result, next);
//                     } else {
//                         return ;
//                     }
//                 }
//                 return result;
//             },
//             conditionAnd: function (needsParens) {
//                 var result, logical, next, self = this;
//                 function insideCondition() {
//                     var cond = self.negatedCondition(needsParens) || self.parenthesisCondition(needsParens);
//                     if (!cond && !needsParens) {
//                         return self.atomicCondition(needsParens);
//                     }
//                     return cond;
//                 }
//                 function and() {
//                     return parserInput.$str('and');
//                 }

//                 result = insideCondition();
//                 if (!result) {
//                     return ;
//                 }
//                 logical = and();
//                 if (logical) {
//                     next = this.conditionAnd(needsParens);
//                     if (next) {
//                         result = new(tree.Condition)(logical, result, next);
//                     } else {
//                         return ;
//                     }
//                 }
//                 return result;
//             },
//             negatedCondition: function (needsParens) {
//                 if (parserInput.$str('not')) {
//                     var result = this.parenthesisCondition(needsParens);
//                     if (result) {
//                         result.negate = !result.negate;
//                     }
//                     return result;
//                 }
//             },
//             parenthesisCondition: function (needsParens) {
//                 function tryConditionFollowedByParenthesis(me) {
//                     var body;
//                     parserInput.save();
//                     body = me.condition(needsParens);
//                     if (!body) {
//                         parserInput.restore();
//                         return ;
//                     }
//                     if (!parserInput.$char(')')) {
//                         parserInput.restore();
//                         return ;
//                     }
//                     parserInput.forget();
//                     return body;
//                 }

//                 var body;
//                 parserInput.save();
//                 if (!parserInput.$str('(')) {
//                     parserInput.restore();
//                     return ;
//                 }
//                 body = tryConditionFollowedByParenthesis(this);
//                 if (body) {
//                     parserInput.forget();
//                     return body;
//                 }

//                 body = this.atomicCondition(needsParens);
//                 if (!body) {
//                     parserInput.restore();
//                     return ;
//                 }
//                 if (!parserInput.$char(')')) {
//                     parserInput.restore('expected \')\' got \'' + parserInput.currentChar() + '\'');
//                     return ;
//                 }
//                 parserInput.forget();
//                 return body;
//             },
//             atomicCondition: function (needsParens) {
//                 var entities = this.entities, index = parserInput.i, a, b, c, op;

//                 function cond() {
//                     return this.addition() || entities.keyword() || entities.quoted() || entities.mixinLookup();
//                 }
//                 cond = cond.bind(this);

//                 a = cond();
//                 if (a) {
//                     if (parserInput.$char('>')) {
//                         if (parserInput.$char('=')) {
//                             op = '>=';
//                         } else {
//                             op = '>';
//                         }
//                     } else
//                     if (parserInput.$char('<')) {
//                         if (parserInput.$char('=')) {
//                             op = '<=';
//                         } else {
//                             op = '<';
//                         }
//                     } else
//                     if (parserInput.$char('=')) {
//                         if (parserInput.$char('>')) {
//                             op = '=>';
//                         } else if (parserInput.$char('<')) {
//                             op = '=<';
//                         } else {
//                             op = '=';
//                         }
//                     }
//                     if (op) {
//                         b = cond();
//                         if (b) {
//                             c = new(tree.Condition)(op, a, b, index, false);
//                         } else {
//                             error('expected expression');
//                         }
//                     } else {
//                         c = new(tree.Condition)('=', a, new(tree.Keyword)('true'), index, false);
//                     }
//                     return c;
//                 }
//             },

//             //
//             // An operand is anything that can be part of an operation,
//             // such as a Color, or a Variable
//             //
//             operand: function () {
//                 var entities = this.entities, negate;

//                 if (parserInput.peek(/^-[@\$\(]/)) {
//                     negate = parserInput.$char('-');
//                 }

//                 var o = this.sub() || entities.dimension() ||
//                         entities.color() || entities.variable() ||
//                         entities.property() || entities.call() ||
//                         entities.quoted(true) || entities.colorKeyword() ||
//                         entities.mixinLookup();

//                 if (negate) {
//                     o.parensInOp = true;
//                     o = new(tree.Negative)(o);
//                 }

//                 return o;
//             },

//             //
//             // Expressions either represent mathematical operations,
//             // or white-space delimited Entities.
//             //
//             //     1px solid black
//             //     @var * 2
//             //
//             expression: function () {
//                 var entities = [], e, delim, index = parserInput.i;

//                 do {
//                     e = this.comment();
//                     if (e) {
//                         entities.push(e);
//                         continue;
//                     }
//                     e = this.addition() || this.entity();
//                     if (e) {
//                         entities.push(e);
//                         // operations do not allow keyword "/" dimension (e.g. small/20px) so we support that here
//                         if (!parserInput.peek(/^\/[\/*]/)) {
//                             delim = parserInput.$char('/');
//                             if (delim) {
//                                 entities.push(new(tree.Anonymous)(delim, index));
//                             }
//                         }
//                     }
//                 } while (e);
//                 if (entities.length > 0) {
//                     return new(tree.Expression)(entities);
//                 }
//             },
//             property: function () {
//                 var name = parserInput.$re(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/);
//                 if (name) {
//                     return name[1];
//                 }
//             },
//             ruleProperty: function () {
//                 var name = [], index = [], s, k;

//                 parserInput.save();

//                 var simpleProperty = parserInput.$re(/^([_a-zA-Z0-9-]+)\s*:/);
//                 if (simpleProperty) {
//                     name = [new(tree.Keyword)(simpleProperty[1])];
//                     parserInput.forget();
//                     return name;
//                 }

//                 function match(re) {
//                     var i = parserInput.i,
//                         chunk = parserInput.$re(re);
//                     if (chunk) {
//                         index.push(i);
//                         return name.push(chunk[1]);
//                     }
//                 }

//                 match(/^(\*?)/);
//                 while (true) {
//                     if (!match(/^((?:[\w-]+)|(?:[@\$]\{[\w-]+\}))/)) {
//                         break;
//                     }
//                 }

//                 if ((name.length > 1) && match(/^((?:\+_|\+)?)\s*:/)) {
//                     parserInput.forget();

//                     // at last, we have the complete match now. move forward,
//                     // convert name particles to tree objects and return:
//                     if (name[0] === '') {
//                         name.shift();
//                         index.shift();
//                     }
//                     for (k = 0; k < name.length; k++) {
//                         s = name[k];
//                         name[k] = (s.charAt(0) !== '@' && s.charAt(0) !== '$') ?
//                             new(tree.Keyword)(s) :
//                             (s.charAt(0) === '@' ?
//                                 new(tree.Variable)('@' + s.slice(2, -1), index[k], fileInfo) :
//                                 new(tree.Property)('$' + s.slice(2, -1), index[k], fileInfo));
//                     }
//                     return name;
//                 }
//                 parserInput.restore();
//             }
//         }
//     };
// };
// Parser.serializeVars = function(vars) {
//     var s = '';

//     for (var name in vars) {
//         if (Object.hasOwnProperty.call(vars, name)) {
//             var value = vars[name];
//             s += ((name[0] === '@') ? '' : '@') + name + ': ' + value +
//                 ((String(value).slice(-1) === ';') ? '' : ';');
//         }
//     }

//     return s;
// };

// module.exports = Parser;

// },{"../functions/function-registry":27,"../less-error":38,"../tree":67,"../utils":89,"../visitors":93,"./parser-input":43}],45:[function(require,module,exports){
// /**
//  * Plugin Manager
//  */
// var PluginManager = function(less) {
//     this.less = less;
//     this.visitors = [];
//     this.preProcessors = [];
//     this.postProcessors = [];
//     this.installedPlugins = [];
//     this.fileManagers = [];
//     this.iterator = -1;
//     this.pluginCache = {};
//     this.Loader = new less.PluginLoader(less);
// };

// var pm, PluginManagerFactory = function(less, newFactory) {
//         if (newFactory || !pm) {
//             pm = new PluginManager(less);
//         }
//         return pm;
//     };

// /**
//  * Adds all the plugins in the array
//  * @param {Array} plugins
//  */
// PluginManager.prototype.addPlugins = function(plugins) {
//     if (plugins) {
//         for (var i = 0; i < plugins.length; i++) {
//             this.addPlugin(plugins[i]);
//         }
//     }
// };
// /**
//  *
//  * @param plugin
//  * @param {String} filename
//  */
// PluginManager.prototype.addPlugin = function(plugin, filename, functionRegistry) {
//     this.installedPlugins.push(plugin);
//     if (filename) {
//         this.pluginCache[filename] = plugin;
//     }
//     if (plugin.install) {
//         plugin.install(this.less, this, functionRegistry || this.less.functions.functionRegistry);
//     }
// };
// /**
//  *
//  * @param filename
//  */
// PluginManager.prototype.get = function(filename) {
//     return this.pluginCache[filename];
// };

// /**
//  * Adds a visitor. The visitor object has options on itself to determine
//  * when it should run.
//  * @param visitor
//  */
// PluginManager.prototype.addVisitor = function(visitor) {
//     this.visitors.push(visitor);
// };
// /**
//  * Adds a pre processor object
//  * @param {object} preProcessor
//  * @param {number} priority - guidelines 1 = before import, 1000 = import, 2000 = after import
//  */
// PluginManager.prototype.addPreProcessor = function(preProcessor, priority) {
//     var indexToInsertAt;
//     for (indexToInsertAt = 0; indexToInsertAt < this.preProcessors.length; indexToInsertAt++) {
//         if (this.preProcessors[indexToInsertAt].priority >= priority) {
//             break;
//         }
//     }
//     this.preProcessors.splice(indexToInsertAt, 0, {preProcessor: preProcessor, priority: priority});
// };
// /**
//  * Adds a post processor object
//  * @param {object} postProcessor
//  * @param {number} priority - guidelines 1 = before compression, 1000 = compression, 2000 = after compression
//  */
// PluginManager.prototype.addPostProcessor = function(postProcessor, priority) {
//     var indexToInsertAt;
//     for (indexToInsertAt = 0; indexToInsertAt < this.postProcessors.length; indexToInsertAt++) {
//         if (this.postProcessors[indexToInsertAt].priority >= priority) {
//             break;
//         }
//     }
//     this.postProcessors.splice(indexToInsertAt, 0, {postProcessor: postProcessor, priority: priority});
// };
// /**
//  *
//  * @param manager
//  */
// PluginManager.prototype.addFileManager = function(manager) {
//     this.fileManagers.push(manager);
// };
// /**
//  *
//  * @returns {Array}
//  * @private
//  */
// PluginManager.prototype.getPreProcessors = function() {
//     var preProcessors = [];
//     for (var i = 0; i < this.preProcessors.length; i++) {
//         preProcessors.push(this.preProcessors[i].preProcessor);
//     }
//     return preProcessors;
// };
// /**
//  *
//  * @returns {Array}
//  * @private
//  */
// PluginManager.prototype.getPostProcessors = function() {
//     var postProcessors = [];
//     for (var i = 0; i < this.postProcessors.length; i++) {
//         postProcessors.push(this.postProcessors[i].postProcessor);
//     }
//     return postProcessors;
// };
// /**
//  *
//  * @returns {Array}
//  * @private
//  */
// PluginManager.prototype.getVisitors = function() {
//     return this.visitors;
// };

// PluginManager.prototype.visitor = function() {
//     var self = this;
//     return {
//         first: function() {
//             self.iterator = -1;
//             return self.visitors[self.iterator];
//         },
//         get: function() {
//             self.iterator += 1;
//             return self.visitors[self.iterator];
//         }
//     };
// };
// /**
//  *
//  * @returns {Array}
//  * @private
//  */
// PluginManager.prototype.getFileManagers = function() {
//     return this.fileManagers;
// };

// //
// module.exports = PluginManagerFactory;

// },{}],46:[function(require,module,exports){
// var PromiseConstructor,
//     utils = require('./utils');

// module.exports = function(environment, ParseTree, ImportManager) {
//     var render = function (input, options, callback) {
//         if (typeof options === 'function') {
//             callback = options;
//             options = utils.copyOptions(this.options, {});
//         }
//         else {
//             options = utils.copyOptions(this.options, options || {});
//         }

//         if (!callback) {
//             if (!PromiseConstructor) {
//                 PromiseConstructor = typeof Promise === 'undefined' ? require('promise') : Promise;
//             }
//             var self = this;
//             return new PromiseConstructor(function (resolve, reject) {
//                 render.call(self, input, options, function(err, output) {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(output);
//                     }
//                 });
//             });
//         } else {
//             this.parse(input, options, function(err, root, imports, options) {
//                 if (err) { return callback(err); }

//                 var result;
//                 try {
//                     var parseTree = new ParseTree(root, imports);
//                     result = parseTree.toCSS(options);
//                 }
//                 catch (err) { return callback(err); }

//                 callback(null, result);
//             });
//         }
//     };

//     return render;
// };

// },{"./utils":89,"promise":undefined}],47:[function(require,module,exports){
// module.exports = function (SourceMapOutput, environment) {

//     var SourceMapBuilder = function (options) {
//         this.options = options;
//     };

//     SourceMapBuilder.prototype.toCSS = function(rootNode, options, imports) {
//         var sourceMapOutput = new SourceMapOutput(
//             {
//                 contentsIgnoredCharsMap: imports.contentsIgnoredChars,
//                 rootNode: rootNode,
//                 contentsMap: imports.contents,
//                 sourceMapFilename: this.options.sourceMapFilename,
//                 sourceMapURL: this.options.sourceMapURL,
//                 outputFilename: this.options.sourceMapOutputFilename,
//                 sourceMapBasepath: this.options.sourceMapBasepath,
//                 sourceMapRootpath: this.options.sourceMapRootpath,
//                 outputSourceFiles: this.options.outputSourceFiles,
//                 sourceMapGenerator: this.options.sourceMapGenerator,
//                 sourceMapFileInline: this.options.sourceMapFileInline
//             });

//         var css = sourceMapOutput.toCSS(options);
//         this.sourceMap = sourceMapOutput.sourceMap;
//         this.sourceMapURL = sourceMapOutput.sourceMapURL;
//         if (this.options.sourceMapInputFilename) {
//             this.sourceMapInputFilename = sourceMapOutput.normalizeFilename(this.options.sourceMapInputFilename);
//         }
//         if (this.options.sourceMapBasepath !== undefined && this.sourceMapURL !== undefined) {
//             this.sourceMapURL = sourceMapOutput.removeBasepath(this.sourceMapURL);
//         }
//         return css + this.getCSSAppendage();
//     };

//     SourceMapBuilder.prototype.getCSSAppendage = function() {

//         var sourceMapURL = this.sourceMapURL;
//         if (this.options.sourceMapFileInline) {
//             if (this.sourceMap === undefined) {
//                 return '';
//             }
//             sourceMapURL = 'data:application/json;base64,' + environment.encodeBase64(this.sourceMap);
//         }

//         if (sourceMapURL) {
//             return '/*# sourceMappingURL=' + sourceMapURL + ' */';
//         }
//         return '';
//     };

//     SourceMapBuilder.prototype.getExternalSourceMap = function() {
//         return this.sourceMap;
//     };
//     SourceMapBuilder.prototype.setExternalSourceMap = function(sourceMap) {
//         this.sourceMap = sourceMap;
//     };

//     SourceMapBuilder.prototype.isInline = function() {
//         return this.options.sourceMapFileInline;
//     };
//     SourceMapBuilder.prototype.getSourceMapURL = function() {
//         return this.sourceMapURL;
//     };
//     SourceMapBuilder.prototype.getOutputFilename = function() {
//         return this.options.sourceMapOutputFilename;
//     };
//     SourceMapBuilder.prototype.getInputFilename = function() {
//         return this.sourceMapInputFilename;
//     };

//     return SourceMapBuilder;
// };

// },{}],48:[function(require,module,exports){
// module.exports = function (environment) {

//     var SourceMapOutput = function (options) {
//         this._css = [];
//         this._rootNode = options.rootNode;
//         this._contentsMap = options.contentsMap;
//         this._contentsIgnoredCharsMap = options.contentsIgnoredCharsMap;
//         if (options.sourceMapFilename) {
//             this._sourceMapFilename = options.sourceMapFilename.replace(/\\/g, '/');
//         }
//         this._outputFilename = options.outputFilename;
//         this.sourceMapURL = options.sourceMapURL;
//         if (options.sourceMapBasepath) {
//             this._sourceMapBasepath = options.sourceMapBasepath.replace(/\\/g, '/');
//         }
//         if (options.sourceMapRootpath) {
//             this._sourceMapRootpath = options.sourceMapRootpath.replace(/\\/g, '/');
//             if (this._sourceMapRootpath.charAt(this._sourceMapRootpath.length - 1) !== '/') {
//                 this._sourceMapRootpath += '/';
//             }
//         } else {
//             this._sourceMapRootpath = '';
//         }
//         this._outputSourceFiles = options.outputSourceFiles;
//         this._sourceMapGeneratorConstructor = environment.getSourceMapGenerator();

//         this._lineNumber = 0;
//         this._column = 0;
//     };

//     SourceMapOutput.prototype.removeBasepath = function(path) {
//         if (this._sourceMapBasepath && path.indexOf(this._sourceMapBasepath) === 0) {
//             path = path.substring(this._sourceMapBasepath.length);
//             if (path.charAt(0) === '\\' || path.charAt(0) === '/') {
//                 path = path.substring(1);
//             }
//         }

//         return path;
//     };

//     SourceMapOutput.prototype.normalizeFilename = function(filename) {
//         filename = filename.replace(/\\/g, '/');
//         filename = this.removeBasepath(filename);
//         return (this._sourceMapRootpath || '') + filename;
//     };

//     SourceMapOutput.prototype.add = function(chunk, fileInfo, index, mapLines) {

//         // ignore adding empty strings
//         if (!chunk) {
//             return;
//         }

//         var lines,
//             sourceLines,
//             columns,
//             sourceColumns,
//             i;

//         if (fileInfo && fileInfo.filename) {
//             var inputSource = this._contentsMap[fileInfo.filename];

//             // remove vars/banner added to the top of the file
//             if (this._contentsIgnoredCharsMap[fileInfo.filename]) {
//                 // adjust the index
//                 index -= this._contentsIgnoredCharsMap[fileInfo.filename];
//                 if (index < 0) { index = 0; }
//                 // adjust the source
//                 inputSource = inputSource.slice(this._contentsIgnoredCharsMap[fileInfo.filename]);
//             }
//             inputSource = inputSource.substring(0, index);
//             sourceLines = inputSource.split('\n');
//             sourceColumns = sourceLines[sourceLines.length - 1];
//         }

//         lines = chunk.split('\n');
//         columns = lines[lines.length - 1];

//         if (fileInfo && fileInfo.filename) {
//             if (!mapLines) {
//                 this._sourceMapGenerator.addMapping({ generated: { line: this._lineNumber + 1, column: this._column},
//                     original: { line: sourceLines.length, column: sourceColumns.length},
//                     source: this.normalizeFilename(fileInfo.filename)});
//             } else {
//                 for (i = 0; i < lines.length; i++) {
//                     this._sourceMapGenerator.addMapping({ generated: { line: this._lineNumber + i + 1, column: i === 0 ? this._column : 0},
//                         original: { line: sourceLines.length + i, column: i === 0 ? sourceColumns.length : 0},
//                         source: this.normalizeFilename(fileInfo.filename)});
//                 }
//             }
//         }

//         if (lines.length === 1) {
//             this._column += columns.length;
//         } else {
//             this._lineNumber += lines.length - 1;
//             this._column = columns.length;
//         }

//         this._css.push(chunk);
//     };

//     SourceMapOutput.prototype.isEmpty = function() {
//         return this._css.length === 0;
//     };

//     SourceMapOutput.prototype.toCSS = function(context) {
//         this._sourceMapGenerator = new this._sourceMapGeneratorConstructor({ file: this._outputFilename, sourceRoot: null });

//         if (this._outputSourceFiles) {
//             for (var filename in this._contentsMap) {
//                 if (this._contentsMap.hasOwnProperty(filename)) {
//                     var source = this._contentsMap[filename];
//                     if (this._contentsIgnoredCharsMap[filename]) {
//                         source = source.slice(this._contentsIgnoredCharsMap[filename]);
//                     }
//                     this._sourceMapGenerator.setSourceContent(this.normalizeFilename(filename), source);
//                 }
//             }
//         }

//         this._rootNode.genCSS(context, this);

//         if (this._css.length > 0) {
//             var sourceMapURL,
//                 sourceMapContent = JSON.stringify(this._sourceMapGenerator.toJSON());

//             if (this.sourceMapURL) {
//                 sourceMapURL = this.sourceMapURL;
//             } else if (this._sourceMapFilename) {
//                 sourceMapURL = this._sourceMapFilename;
//             }
//             this.sourceMapURL = sourceMapURL;

//             this.sourceMap = sourceMapContent;
//         }

//         return this._css.join('');
//     };

//     return SourceMapOutput;
// };

// },{}],49:[function(require,module,exports){
// var contexts = require('./contexts'),
//     visitor = require('./visitors'),
//     tree = require('./tree');

// module.exports = function(root, options) {
//     options = options || {};
//     var evaldRoot,
//         variables = options.variables,
//         evalEnv = new contexts.Eval(options);

//     //
//     // Allows setting variables with a hash, so:
//     //
//     //   `{ color: new tree.Color('#f01') }` will become:
//     //
//     //   new tree.Declaration('@color',
//     //     new tree.Value([
//     //       new tree.Expression([
//     //         new tree.Color('#f01')
//     //       ])
//     //     ])
//     //   )
//     //
//     if (typeof variables === 'object' && !Array.isArray(variables)) {
//         variables = Object.keys(variables).map(function (k) {
//             var value = variables[k];

//             if (!(value instanceof tree.Value)) {
//                 if (!(value instanceof tree.Expression)) {
//                     value = new tree.Expression([value]);
//                 }
//                 value = new tree.Value([value]);
//             }
//             return new tree.Declaration('@' + k, value, false, null, 0);
//         });
//         evalEnv.frames = [new tree.Ruleset(null, variables)];
//     }

//     var visitors = [
//             new visitor.JoinSelectorVisitor(),
//             new visitor.MarkVisibleSelectorsVisitor(true),
//             new visitor.ExtendVisitor(),
//             new visitor.ToCSSVisitor({compress: Boolean(options.compress)})
//         ], preEvalVisitors = [], v, visitorIterator;

//     /**
//      * first() / get() allows visitors to be added while visiting
//      * 
//      * @todo Add scoping for visitors just like functions for @plugin; right now they're global
//      */
//     if (options.pluginManager) {
//         visitorIterator = options.pluginManager.visitor();
//         for (var i = 0; i < 2; i++) {
//             visitorIterator.first();
//             while ((v = visitorIterator.get())) {
//                 if (v.isPreEvalVisitor) {
//                     if (i === 0 || preEvalVisitors.indexOf(v) === -1) {
//                         preEvalVisitors.push(v);
//                         v.run(root);
//                     }
//                 }
//                 else {
//                     if (i === 0 || visitors.indexOf(v) === -1) {
//                         if (v.isPreVisitor) {
//                             visitors.unshift(v);
//                         }
//                         else {
//                             visitors.push(v);
//                         }
//                     }
//                 }
//             }
//         }
//     }
    
//     evaldRoot = root.eval(evalEnv);

//     for (var i = 0; i < visitors.length; i++) {
//         visitors[i].run(evaldRoot);
//     }

//     // Run any remaining visitors added after eval pass
//     if (options.pluginManager) {
//         visitorIterator.first();
//         while ((v = visitorIterator.get())) {
//             if (visitors.indexOf(v) === -1 && preEvalVisitors.indexOf(v) === -1) {
//                 v.run(evaldRoot);
//             }
//         }
//     }

//     return evaldRoot;
// };

// },{"./contexts":13,"./tree":67,"./visitors":93}],50:[function(require,module,exports){
// var Node = require('./node');

// var Anonymous = function (value, index, currentFileInfo, mapLines, rulesetLike, visibilityInfo) {
//     this.value = value;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.mapLines = mapLines;
//     this.rulesetLike = (typeof rulesetLike === 'undefined') ? false : rulesetLike;
//     this.allowRoot = true;
//     this.copyVisibilityInfo(visibilityInfo);
// };
// Anonymous.prototype = new Node();
// Anonymous.prototype.type = 'Anonymous';
// Anonymous.prototype.eval = function () {
//     return new Anonymous(this.value, this._index, this._fileInfo, this.mapLines, this.rulesetLike, this.visibilityInfo());
// };
// Anonymous.prototype.compare = function (other) {
//     return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
// };
// Anonymous.prototype.isRulesetLike = function() {
//     return this.rulesetLike;
// };
// Anonymous.prototype.genCSS = function (context, output) {
//     this.nodeVisible = Boolean(this.value);
//     if (this.nodeVisible) {
//         output.add(this.value, this._fileInfo, this._index, this.mapLines);
//     }
// };
// module.exports = Anonymous;

// },{"./node":76}],51:[function(require,module,exports){
// var Node = require('./node');

// var Assignment = function (key, val) {
//     this.key = key;
//     this.value = val;
// };

// Assignment.prototype = new Node();
// Assignment.prototype.type = 'Assignment';
// Assignment.prototype.accept = function (visitor) {
//     this.value = visitor.visit(this.value);
// };
// Assignment.prototype.eval = function (context) {
//     if (this.value.eval) {
//         return new Assignment(this.key, this.value.eval(context));
//     }
//     return this;
// };
// Assignment.prototype.genCSS = function (context, output) {
//     output.add(this.key + '=');
//     if (this.value.genCSS) {
//         this.value.genCSS(context, output);
//     } else {
//         output.add(this.value);
//     }
// };
// module.exports = Assignment;

// },{"./node":76}],52:[function(require,module,exports){
// var Node = require('./node'),
//     Selector = require('./selector'),
//     Ruleset = require('./ruleset'),
//     Anonymous = require('./anonymous');

// var AtRule = function (name, value, rules, index, currentFileInfo, debugInfo, isRooted, visibilityInfo) {
//     var i;

//     this.name  = name;
//     this.value = (value instanceof Node) ? value : (value ? new Anonymous(value) : value);
//     if (rules) {
//         if (Array.isArray(rules)) {
//             this.rules = rules;
//         } else {
//             this.rules = [rules];
//             this.rules[0].selectors = (new Selector([], null, null, index, currentFileInfo)).createEmptySelectors();
//         }
//         for (i = 0; i < this.rules.length; i++) {
//             this.rules[i].allowImports = true;
//         }
//         this.setParent(this.rules, this);
//     }
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.debugInfo = debugInfo;
//     this.isRooted = isRooted || false;
//     this.copyVisibilityInfo(visibilityInfo);
//     this.allowRoot = true;
// };

// AtRule.prototype = new Node();
// AtRule.prototype.type = 'AtRule';
// AtRule.prototype.accept = function (visitor) {
//     var value = this.value, rules = this.rules;
//     if (rules) {
//         this.rules = visitor.visitArray(rules);
//     }
//     if (value) {
//         this.value = visitor.visit(value);
//     }
// };
// AtRule.prototype.isRulesetLike = function() {
//     return this.rules || !this.isCharset();
// };
// AtRule.prototype.isCharset = function() {
//     return '@charset' === this.name;
// };
// AtRule.prototype.genCSS = function (context, output) {
//     var value = this.value, rules = this.rules;
//     output.add(this.name, this.fileInfo(), this.getIndex());
//     if (value) {
//         output.add(' ');
//         value.genCSS(context, output);
//     }
//     if (rules) {
//         this.outputRuleset(context, output, rules);
//     } else {
//         output.add(';');
//     }
// };
// AtRule.prototype.eval = function (context) {
//     var mediaPathBackup, mediaBlocksBackup, value = this.value, rules = this.rules;

//     // media stored inside other atrule should not bubble over it
//     // backpup media bubbling information
//     mediaPathBackup = context.mediaPath;
//     mediaBlocksBackup = context.mediaBlocks;
//     // deleted media bubbling information
//     context.mediaPath = [];
//     context.mediaBlocks = [];

//     if (value) {
//         value = value.eval(context);
//     }
//     if (rules) {
//         // assuming that there is only one rule at this point - that is how parser constructs the rule
//         rules = [rules[0].eval(context)];
//         rules[0].root = true;
//     }
//     // restore media bubbling information
//     context.mediaPath = mediaPathBackup;
//     context.mediaBlocks = mediaBlocksBackup;

//     return new AtRule(this.name, value, rules,
//         this.getIndex(), this.fileInfo(), this.debugInfo, this.isRooted, this.visibilityInfo());
// };
// AtRule.prototype.variable = function (name) {
//     if (this.rules) {
//         // assuming that there is only one rule at this point - that is how parser constructs the rule
//         return Ruleset.prototype.variable.call(this.rules[0], name);
//     }
// };
// AtRule.prototype.find = function () {
//     if (this.rules) {
//         // assuming that there is only one rule at this point - that is how parser constructs the rule
//         return Ruleset.prototype.find.apply(this.rules[0], arguments);
//     }
// };
// AtRule.prototype.rulesets = function () {
//     if (this.rules) {
//         // assuming that there is only one rule at this point - that is how parser constructs the rule
//         return Ruleset.prototype.rulesets.apply(this.rules[0]);
//     }
// };
// AtRule.prototype.outputRuleset = function (context, output, rules) {
//     var ruleCnt = rules.length, i;
//     context.tabLevel = (context.tabLevel | 0) + 1;

//     // Compressed
//     if (context.compress) {
//         output.add('{');
//         for (i = 0; i < ruleCnt; i++) {
//             rules[i].genCSS(context, output);
//         }
//         output.add('}');
//         context.tabLevel--;
//         return;
//     }

//     // Non-compressed
//     var tabSetStr = '\n' + Array(context.tabLevel).join('  '), tabRuleStr = tabSetStr + '  ';
//     if (!ruleCnt) {
//         output.add(' {' + tabSetStr + '}');
//     } else {
//         output.add(' {' + tabRuleStr);
//         rules[0].genCSS(context, output);
//         for (i = 1; i < ruleCnt; i++) {
//             output.add(tabRuleStr);
//             rules[i].genCSS(context, output);
//         }
//         output.add(tabSetStr + '}');
//     }

//     context.tabLevel--;
// };
// module.exports = AtRule;

// },{"./anonymous":50,"./node":76,"./ruleset":81,"./selector":82}],53:[function(require,module,exports){
// var Node = require('./node');

// var Attribute = function (key, op, value) {
//     this.key = key;
//     this.op = op;
//     this.value = value;
// };
// Attribute.prototype = new Node();
// Attribute.prototype.type = 'Attribute';
// Attribute.prototype.eval = function (context) {
//     return new Attribute(this.key.eval ? this.key.eval(context) : this.key,
//         this.op, (this.value && this.value.eval) ? this.value.eval(context) : this.value);
// };
// Attribute.prototype.genCSS = function (context, output) {
//     output.add(this.toCSS(context));
// };
// Attribute.prototype.toCSS = function (context) {
//     var value = this.key.toCSS ? this.key.toCSS(context) : this.key;

//     if (this.op) {
//         value += this.op;
//         value += (this.value.toCSS ? this.value.toCSS(context) : this.value);
//     }

//     return '[' + value + ']';
// };
// module.exports = Attribute;

// },{"./node":76}],54:[function(require,module,exports){
// var Node = require('./node'),
//     Anonymous = require('./anonymous'),
//     FunctionCaller = require('../functions/function-caller');
// //
// // A function call node.
// //
// var Call = function (name, args, index, currentFileInfo) {
//     this.name = name;
//     this.args = args;
//     this.calc = name === 'calc';
//     this._index = index;
//     this._fileInfo = currentFileInfo;
// };
// Call.prototype = new Node();
// Call.prototype.type = 'Call';
// Call.prototype.accept = function (visitor) {
//     if (this.args) {
//         this.args = visitor.visitArray(this.args);
//     }
// };
// //
// // When evaluating a function call,
// // we either find the function in the functionRegistry,
// // in which case we call it, passing the  evaluated arguments,
// // if this returns null or we cannot find the function, we
// // simply print it out as it appeared originally [2].
// //
// // The reason why we evaluate the arguments, is in the case where
// // we try to pass a variable to a function, like: `saturate(@color)`.
// // The function should receive the value, not the variable.
// //
// Call.prototype.eval = function (context) {
//     /**
//      * Turn off math for calc(), and switch back on for evaluating nested functions
//      */
//     var currentMathContext = context.mathOn;
//     context.mathOn = !this.calc;
//     if (this.calc || context.inCalc) {
//         context.enterCalc();
//     }
//     var args = this.args.map(function (a) { return a.eval(context); });
//     if (this.calc || context.inCalc) {
//         context.exitCalc();
//     }
//     context.mathOn = currentMathContext;

//     var result, funcCaller = new FunctionCaller(this.name, context, this.getIndex(), this.fileInfo());
    
//     if (funcCaller.isValid()) {
//         try {
//             result = funcCaller.call(args);
//         } catch (e) {
//             throw { 
//                 type: e.type || 'Runtime',
//                 message: 'error evaluating function `' + this.name + '`' +
//                          (e.message ? ': ' + e.message : ''),
//                 index: this.getIndex(), 
//                 filename: this.fileInfo().filename,
//                 line: e.lineNumber,
//                 column: e.columnNumber
//             };
//         }

//         if (result !== null && result !== undefined) {
//             // Results that that are not nodes are cast as Anonymous nodes
//             // Falsy values or booleans are returned as empty nodes
//             if (!(result instanceof Node)) {
//                 if (!result || result === true) {
//                     result = new Anonymous(null); 
//                 }
//                 else {
//                     result = new Anonymous(result.toString()); 
//                 }
                
//             }
//             result._index = this._index;
//             result._fileInfo = this._fileInfo;
//             return result;
//         }

//     }

//     return new Call(this.name, args, this.getIndex(), this.fileInfo());
// };
// Call.prototype.genCSS = function (context, output) {
//     output.add(this.name + '(', this.fileInfo(), this.getIndex());

//     for (var i = 0; i < this.args.length; i++) {
//         this.args[i].genCSS(context, output);
//         if (i + 1 < this.args.length) {
//             output.add(', ');
//         }
//     }

//     output.add(')');
// };
// module.exports = Call;

// },{"../functions/function-caller":26,"./anonymous":50,"./node":76}],55:[function(require,module,exports){
// var Node = require('./node'),
//     colors = require('../data/colors');

// //
// // RGB Colors - #ff0014, #eee
// //
// var Color = function (rgb, a, originalForm) {
//     var self = this;
//     //
//     // The end goal here, is to parse the arguments
//     // into an integer triplet, such as `128, 255, 0`
//     //
//     // This facilitates operations and conversions.
//     //
//     if (Array.isArray(rgb)) {
//         this.rgb = rgb;
//     } else if (rgb.length >= 6) {
//         this.rgb = [];
//         rgb.match(/.{2}/g).map(function (c, i) {
//             if (i < 3) {
//                 self.rgb.push(parseInt(c, 16));
//             } else {
//                 self.alpha = (parseInt(c, 16)) / 255;
//             }
//         });
//     } else {
//         this.rgb = [];
//         rgb.split('').map(function (c, i) {
//             if (i < 3) {
//                 self.rgb.push(parseInt(c + c, 16));
//             } else {
//                 self.alpha = (parseInt(c + c, 16)) / 255;
//             }
//         });
//     }
//     this.alpha = this.alpha || (typeof a === 'number' ? a : 1);
//     if (typeof originalForm !== 'undefined') {
//         this.value = originalForm;
//     }
// };

// Color.prototype = new Node();
// Color.prototype.type = 'Color';

// function clamp(v, max) {
//     return Math.min(Math.max(v, 0), max);
// }

// function toHex(v) {
//     return '#' + v.map(function (c) {
//         c = clamp(Math.round(c), 255);
//         return (c < 16 ? '0' : '') + c.toString(16);
//     }).join('');
// }

// Color.prototype.luma = function () {
//     var r = this.rgb[0] / 255,
//         g = this.rgb[1] / 255,
//         b = this.rgb[2] / 255;

//     r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
//     g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
//     b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);

//     return 0.2126 * r + 0.7152 * g + 0.0722 * b;
// };
// Color.prototype.genCSS = function (context, output) {
//     output.add(this.toCSS(context));
// };
// Color.prototype.toCSS = function (context, doNotCompress) {
//     var compress = context && context.compress && !doNotCompress, color, alpha,
//         colorFunction, args = [];

//     // `value` is set if this color was originally
//     // converted from a named color string so we need
//     // to respect this and try to output named color too.
//     alpha = this.fround(context, this.alpha);

//     if (this.value) {
//         if (this.value.indexOf('rgb') === 0) {
//             if (alpha < 1) {
//                 colorFunction = 'rgba';
//             }
//         } else if (this.value.indexOf('hsl') === 0) {
//             if (alpha < 1) {
//                 colorFunction = 'hsla';
//             } else {
//                 colorFunction = 'hsl';
//             }
//         } else {
//             return this.value;
//         }
//     } else {
//         if (alpha < 1) {
//             colorFunction = 'rgba';
//         }
//     }

//     switch (colorFunction) {
//         case 'rgba':
//             args = this.rgb.map(function (c) {
//                 return clamp(Math.round(c), 255);
//             }).concat(clamp(alpha, 1));
//             break;
//         case 'hsla':
//             args.push(clamp(alpha, 1));
//         case 'hsl':
//             color = this.toHSL();
//             args = [
//                 this.fround(context, color.h),
//                 this.fround(context, color.s * 100) + '%',
//                 this.fround(context, color.l * 100) + '%'
//             ].concat(args);
//     }

//     if (colorFunction) {
//         // Values are capped between `0` and `255`, rounded and zero-padded.
//         return colorFunction + '(' + args.join(',' + (compress ? '' : ' ')) + ')';
//     }

//     color = this.toRGB();

//     if (compress) {
//         var splitcolor = color.split('');

//         // Convert color to short format
//         if (splitcolor[1] === splitcolor[2] && splitcolor[3] === splitcolor[4] && splitcolor[5] === splitcolor[6]) {
//             color = '#' + splitcolor[1] + splitcolor[3] + splitcolor[5];
//         }
//     }

//     return color;
// };

// //
// // Operations have to be done per-channel, if not,
// // channels will spill onto each other. Once we have
// // our result, in the form of an integer triplet,
// // we create a new Color node to hold the result.
// //
// Color.prototype.operate = function (context, op, other) {
//     var rgb = new Array(3);
//     var alpha = this.alpha * (1 - other.alpha) + other.alpha;
//     for (var c = 0; c < 3; c++) {
//         rgb[c] = this._operate(context, op, this.rgb[c], other.rgb[c]);
//     }
//     return new Color(rgb, alpha);
// };
// Color.prototype.toRGB = function () {
//     return toHex(this.rgb);
// };
// Color.prototype.toHSL = function () {
//     var r = this.rgb[0] / 255,
//         g = this.rgb[1] / 255,
//         b = this.rgb[2] / 255,
//         a = this.alpha;

//     var max = Math.max(r, g, b), min = Math.min(r, g, b);
//     var h, s, l = (max + min) / 2, d = max - min;

//     if (max === min) {
//         h = s = 0;
//     } else {
//         s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

//         switch (max) {
//             case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//             case g: h = (b - r) / d + 2;               break;
//             case b: h = (r - g) / d + 4;               break;
//         }
//         h /= 6;
//     }
//     return { h: h * 360, s: s, l: l, a: a };
// };
// // Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
// Color.prototype.toHSV = function () {
//     var r = this.rgb[0] / 255,
//         g = this.rgb[1] / 255,
//         b = this.rgb[2] / 255,
//         a = this.alpha;

//     var max = Math.max(r, g, b), min = Math.min(r, g, b);
//     var h, s, v = max;

//     var d = max - min;
//     if (max === 0) {
//         s = 0;
//     } else {
//         s = d / max;
//     }

//     if (max === min) {
//         h = 0;
//     } else {
//         switch (max) {
//             case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//             case g: h = (b - r) / d + 2; break;
//             case b: h = (r - g) / d + 4; break;
//         }
//         h /= 6;
//     }
//     return { h: h * 360, s: s, v: v, a: a };
// };
// Color.prototype.toARGB = function () {
//     return toHex([this.alpha * 255].concat(this.rgb));
// };
// Color.prototype.compare = function (x) {
//     return (x.rgb &&
//         x.rgb[0] === this.rgb[0] &&
//         x.rgb[1] === this.rgb[1] &&
//         x.rgb[2] === this.rgb[2] &&
//         x.alpha  === this.alpha) ? 0 : undefined;
// };

// Color.fromKeyword = function(keyword) {
//     var c, key = keyword.toLowerCase();
//     if (colors.hasOwnProperty(key)) {
//         c = new Color(colors[key].slice(1));
//     }
//     else if (key === 'transparent') {
//         c = new Color([0, 0, 0], 0);
//     }

//     if (c) {
//         c.value = keyword;
//         return c;
//     }
// };
// module.exports = Color;

// },{"../data/colors":14,"./node":76}],56:[function(require,module,exports){
// var Node = require('./node');

// var Combinator = function (value) {
//     if (value === ' ') {
//         this.value = ' ';
//         this.emptyOrWhitespace = true;
//     } else {
//         this.value = value ? value.trim() : '';
//         this.emptyOrWhitespace = this.value === '';
//     }
// };
// Combinator.prototype = new Node();
// Combinator.prototype.type = 'Combinator';
// var _noSpaceCombinators = {
//     '': true,
//     ' ': true,
//     '|': true
// };
// Combinator.prototype.genCSS = function (context, output) {
//     var spaceOrEmpty = (context.compress || _noSpaceCombinators[this.value]) ? '' : ' ';
//     output.add(spaceOrEmpty + this.value + spaceOrEmpty);
// };
// module.exports = Combinator;

// },{"./node":76}],57:[function(require,module,exports){
// var Node = require('./node'),
//     getDebugInfo = require('./debug-info');

// var Comment = function (value, isLineComment, index, currentFileInfo) {
//     this.value = value;
//     this.isLineComment = isLineComment;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.allowRoot = true;
// };
// Comment.prototype = new Node();
// Comment.prototype.type = 'Comment';
// Comment.prototype.genCSS = function (context, output) {
//     if (this.debugInfo) {
//         output.add(getDebugInfo(context, this), this.fileInfo(), this.getIndex());
//     }
//     output.add(this.value);
// };
// Comment.prototype.isSilent = function(context) {
//     var isCompressed = context.compress && this.value[2] !== '!';
//     return this.isLineComment || isCompressed;
// };
// module.exports = Comment;

// },{"./debug-info":59,"./node":76}],58:[function(require,module,exports){
// var Node = require('./node');

// var Condition = function (op, l, r, i, negate) {
//     this.op = op.trim();
//     this.lvalue = l;
//     this.rvalue = r;
//     this._index = i;
//     this.negate = negate;
// };
// Condition.prototype = new Node();
// Condition.prototype.type = 'Condition';
// Condition.prototype.accept = function (visitor) {
//     this.lvalue = visitor.visit(this.lvalue);
//     this.rvalue = visitor.visit(this.rvalue);
// };
// Condition.prototype.eval = function (context) {
//     var result = (function (op, a, b) {
//         switch (op) {
//             case 'and': return a && b;
//             case 'or':  return a || b;
//             default:
//                 switch (Node.compare(a, b)) {
//                     case -1:
//                         return op === '<' || op === '=<' || op === '<=';
//                     case 0:
//                         return op === '=' || op === '>=' || op === '=<' || op === '<=';
//                     case 1:
//                         return op === '>' || op === '>=';
//                     default:
//                         return false;
//                 }
//         }
//     })(this.op, this.lvalue.eval(context), this.rvalue.eval(context));

//     return this.negate ? !result : result;
// };
// module.exports = Condition;

// },{"./node":76}],59:[function(require,module,exports){
// var debugInfo = function(context, ctx, lineSeparator) {
//     var result = '';
//     if (context.dumpLineNumbers && !context.compress) {
//         switch (context.dumpLineNumbers) {
//             case 'comments':
//                 result = debugInfo.asComment(ctx);
//                 break;
//             case 'mediaquery':
//                 result = debugInfo.asMediaQuery(ctx);
//                 break;
//             case 'all':
//                 result = debugInfo.asComment(ctx) + (lineSeparator || '') + debugInfo.asMediaQuery(ctx);
//                 break;
//         }
//     }
//     return result;
// };

// debugInfo.asComment = function(ctx) {
//     return '/* line ' + ctx.debugInfo.lineNumber + ', ' + ctx.debugInfo.fileName + ' */\n';
// };

// debugInfo.asMediaQuery = function(ctx) {
//     var filenameWithProtocol = ctx.debugInfo.fileName;
//     if (!/^[a-z]+:\/\//i.test(filenameWithProtocol)) {
//         filenameWithProtocol = 'file://' + filenameWithProtocol;
//     }
//     return '@media -sass-debug-info{filename{font-family:' +
//         filenameWithProtocol.replace(/([.:\/\\])/g, function (a) {
//             if (a == '\\') {
//                 a = '\/';
//             }
//             return '\\' + a;
//         }) +
//         '}line{font-family:\\00003' + ctx.debugInfo.lineNumber + '}}\n';
// };

// module.exports = debugInfo;

// },{}],60:[function(require,module,exports){
// var Node = require('./node'),
//     Value = require('./value'),
//     Keyword = require('./keyword'),
//     Anonymous = require('./anonymous'),
//     MATH = require('../constants').Math;

// var Declaration = function (name, value, important, merge, index, currentFileInfo, inline, variable) {
//     this.name = name;
//     this.value = (value instanceof Node) ? value : new Value([value ? new Anonymous(value) : null]);
//     this.important = important ? ' ' + important.trim() : '';
//     this.merge = merge;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.inline = inline || false;
//     this.variable = (variable !== undefined) ? variable
//         : (name.charAt && (name.charAt(0) === '@'));
//     this.allowRoot = true;
//     this.setParent(this.value, this);
// };

// function evalName(context, name) {
//     var value = '', i, n = name.length,
//         output = {add: function (s) {value += s;}};
//     for (i = 0; i < n; i++) {
//         name[i].eval(context).genCSS(context, output);
//     }
//     return value;
// }

// Declaration.prototype = new Node();
// Declaration.prototype.type = 'Declaration';
// Declaration.prototype.genCSS = function (context, output) {
//     output.add(this.name + (context.compress ? ':' : ': '), this.fileInfo(), this.getIndex());
//     try {
//         this.value.genCSS(context, output);
//     }
//     catch (e) {
//         e.index = this._index;
//         e.filename = this._fileInfo.filename;
//         throw e;
//     }
//     output.add(this.important + ((this.inline || (context.lastRule && context.compress)) ? '' : ';'), this._fileInfo, this._index);
// };
// Declaration.prototype.eval = function (context) {
//     var mathBypass = false, prevMath, name = this.name, evaldValue, variable = this.variable;
//     if (typeof name !== 'string') {
//         // expand 'primitive' name directly to get
//         // things faster (~10% for benchmark.less):
//         name = (name.length === 1) && (name[0] instanceof Keyword) ?
//                 name[0].value : evalName(context, name);
//         variable = false; // never treat expanded interpolation as new variable name
//     }

//     // @todo remove when parens-division is default
//     if (name === 'font' && context.math === MATH.ALWAYS) {
//         mathBypass = true;
//         prevMath = context.math;
//         context.math = MATH.PARENS_DIVISION;
//     }
//     try {
//         context.importantScope.push({});
//         evaldValue = this.value.eval(context);

//         if (!this.variable && evaldValue.type === 'DetachedRuleset') {
//             throw { message: 'Rulesets cannot be evaluated on a property.',
//                 index: this.getIndex(), filename: this.fileInfo().filename };
//         }
//         var important = this.important,
//             importantResult = context.importantScope.pop();
//         if (!important && importantResult.important) {
//             important = importantResult.important;
//         }

//         return new Declaration(name,
//                           evaldValue,
//                           important,
//                           this.merge,
//                           this.getIndex(), this.fileInfo(), this.inline,
//                               variable);
//     }
//     catch (e) {
//         if (typeof e.index !== 'number') {
//             e.index = this.getIndex();
//             e.filename = this.fileInfo().filename;
//         }
//         throw e;
//     }
//     finally {
//         if (mathBypass) {
//             context.math = prevMath;
//         }
//     }
// };
// Declaration.prototype.makeImportant = function () {
//     return new Declaration(this.name,
//                           this.value,
//                           '!important',
//                           this.merge,
//                           this.getIndex(), this.fileInfo(), this.inline);
// };

// module.exports = Declaration;
// },{"../constants":12,"./anonymous":50,"./keyword":70,"./node":76,"./value":86}],61:[function(require,module,exports){
// var Node = require('./node'),
//     contexts = require('../contexts'),
//     utils = require('../utils');

// var DetachedRuleset = function (ruleset, frames) {
//     this.ruleset = ruleset;
//     this.frames = frames;
//     this.setParent(this.ruleset, this);
// };
// DetachedRuleset.prototype = new Node();
// DetachedRuleset.prototype.type = 'DetachedRuleset';
// DetachedRuleset.prototype.evalFirst = true;
// DetachedRuleset.prototype.accept = function (visitor) {
//     this.ruleset = visitor.visit(this.ruleset);
// };
// DetachedRuleset.prototype.eval = function (context) {
//     var frames = this.frames || utils.copyArray(context.frames);
//     return new DetachedRuleset(this.ruleset, frames);
// };
// DetachedRuleset.prototype.callEval = function (context) {
//     return this.ruleset.eval(this.frames ? new contexts.Eval(context, this.frames.concat(context.frames)) : context);
// };
// module.exports = DetachedRuleset;

// },{"../contexts":13,"../utils":89,"./node":76}],62:[function(require,module,exports){
// var Node = require('./node'),
//     unitConversions = require('../data/unit-conversions'),
//     Unit = require('./unit'),
//     Color = require('./color');

// //
// // A number with a unit
// //
// var Dimension = function (value, unit) {
//     this.value = parseFloat(value);
//     if (isNaN(this.value)) {
//         throw new Error('Dimension is not a number.');
//     }
//     this.unit = (unit && unit instanceof Unit) ? unit :
//       new Unit(unit ? [unit] : undefined);
//     this.setParent(this.unit, this);
// };

// Dimension.prototype = new Node();
// Dimension.prototype.type = 'Dimension';
// Dimension.prototype.accept = function (visitor) {
//     this.unit = visitor.visit(this.unit);
// };
// Dimension.prototype.eval = function (context) {
//     return this;
// };
// Dimension.prototype.toColor = function () {
//     return new Color([this.value, this.value, this.value]);
// };
// Dimension.prototype.genCSS = function (context, output) {
//     if ((context && context.strictUnits) && !this.unit.isSingular()) {
//         throw new Error('Multiple units in dimension. Correct the units or use the unit function. Bad unit: ' + this.unit.toString());
//     }

//     var value = this.fround(context, this.value),
//         strValue = String(value);

//     if (value !== 0 && value < 0.000001 && value > -0.000001) {
//         // would be output 1e-6 etc.
//         strValue = value.toFixed(20).replace(/0+$/, '');
//     }

//     if (context && context.compress) {
//         // Zero values doesn't need a unit
//         if (value === 0 && this.unit.isLength()) {
//             output.add(strValue);
//             return;
//         }

//         // Float values doesn't need a leading zero
//         if (value > 0 && value < 1) {
//             strValue = (strValue).substr(1);
//         }
//     }

//     output.add(strValue);
//     this.unit.genCSS(context, output);
// };

// // In an operation between two Dimensions,
// // we default to the first Dimension's unit,
// // so `1px + 2` will yield `3px`.
// Dimension.prototype.operate = function (context, op, other) {
//     /* jshint noempty:false */
//     var value = this._operate(context, op, this.value, other.value),
//         unit = this.unit.clone();

//     if (op === '+' || op === '-') {
//         if (unit.numerator.length === 0 && unit.denominator.length === 0) {
//             unit = other.unit.clone();
//             if (this.unit.backupUnit) {
//                 unit.backupUnit = this.unit.backupUnit;
//             }
//         } else if (other.unit.numerator.length === 0 && unit.denominator.length === 0) {
//             // do nothing
//         } else {
//             other = other.convertTo(this.unit.usedUnits());

//             if (context.strictUnits && other.unit.toString() !== unit.toString()) {
//                 throw new Error('Incompatible units. Change the units or use the unit function. Bad units: \'' + unit.toString() +
//                     '\' and \'' + other.unit.toString() + '\'.');
//             }

//             value = this._operate(context, op, this.value, other.value);
//         }
//     } else if (op === '*') {
//         unit.numerator = unit.numerator.concat(other.unit.numerator).sort();
//         unit.denominator = unit.denominator.concat(other.unit.denominator).sort();
//         unit.cancel();
//     } else if (op === '/') {
//         unit.numerator = unit.numerator.concat(other.unit.denominator).sort();
//         unit.denominator = unit.denominator.concat(other.unit.numerator).sort();
//         unit.cancel();
//     }
//     return new Dimension(value, unit);
// };
// Dimension.prototype.compare = function (other) {
//     var a, b;

//     if (!(other instanceof Dimension)) {
//         return undefined;
//     }

//     if (this.unit.isEmpty() || other.unit.isEmpty()) {
//         a = this;
//         b = other;
//     } else {
//         a = this.unify();
//         b = other.unify();
//         if (a.unit.compare(b.unit) !== 0) {
//             return undefined;
//         }
//     }

//     return Node.numericCompare(a.value, b.value);
// };
// Dimension.prototype.unify = function () {
//     return this.convertTo({ length: 'px', duration: 's', angle: 'rad' });
// };
// Dimension.prototype.convertTo = function (conversions) {
//     var value = this.value, unit = this.unit.clone(),
//         i, groupName, group, targetUnit, derivedConversions = {}, applyUnit;

//     if (typeof conversions === 'string') {
//         for (i in unitConversions) {
//             if (unitConversions[i].hasOwnProperty(conversions)) {
//                 derivedConversions = {};
//                 derivedConversions[i] = conversions;
//             }
//         }
//         conversions = derivedConversions;
//     }
//     applyUnit = function (atomicUnit, denominator) {
//         /* jshint loopfunc:true */
//         if (group.hasOwnProperty(atomicUnit)) {
//             if (denominator) {
//                 value = value / (group[atomicUnit] / group[targetUnit]);
//             } else {
//                 value = value * (group[atomicUnit] / group[targetUnit]);
//             }

//             return targetUnit;
//         }

//         return atomicUnit;
//     };

//     for (groupName in conversions) {
//         if (conversions.hasOwnProperty(groupName)) {
//             targetUnit = conversions[groupName];
//             group = unitConversions[groupName];

//             unit.map(applyUnit);
//         }
//     }

//     unit.cancel();

//     return new Dimension(value, unit);
// };
// module.exports = Dimension;

// },{"../data/unit-conversions":16,"./color":55,"./node":76,"./unit":84}],63:[function(require,module,exports){
// var Node = require('./node'),
//     Paren = require('./paren'),
//     Combinator = require('./combinator');

// var Element = function (combinator, value, isVariable, index, currentFileInfo, visibilityInfo) {
//     this.combinator = combinator instanceof Combinator ?
//                       combinator : new Combinator(combinator);

//     if (typeof value === 'string') {
//         this.value = value.trim();
//     } else if (value) {
//         this.value = value;
//     } else {
//         this.value = '';
//     }
//     this.isVariable = isVariable;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.copyVisibilityInfo(visibilityInfo);
//     this.setParent(this.combinator, this);
// };
// Element.prototype = new Node();
// Element.prototype.type = 'Element';
// Element.prototype.accept = function (visitor) {
//     var value = this.value;
//     this.combinator = visitor.visit(this.combinator);
//     if (typeof value === 'object') {
//         this.value = visitor.visit(value);
//     }
// };
// Element.prototype.eval = function (context) {
//     return new Element(this.combinator,
//                              this.value.eval ? this.value.eval(context) : this.value,
//                              this.isVariable,
//                              this.getIndex(),
//                              this.fileInfo(), this.visibilityInfo());
// };
// Element.prototype.clone = function () {
//     return new Element(this.combinator,
//         this.value,
//         this.isVariable,
//         this.getIndex(),
//         this.fileInfo(), this.visibilityInfo());
// };
// Element.prototype.genCSS = function (context, output) {
//     output.add(this.toCSS(context), this.fileInfo(), this.getIndex());
// };
// Element.prototype.toCSS = function (context) {
//     context = context || {};
//     var value = this.value, firstSelector = context.firstSelector;
//     if (value instanceof Paren) {
//         // selector in parens should not be affected by outer selector
//         // flags (breaks only interpolated selectors - see #1973)
//         context.firstSelector = true;
//     }
//     value = value.toCSS ? value.toCSS(context) : value;
//     context.firstSelector = firstSelector;
//     if (value === '' && this.combinator.value.charAt(0) === '&') {
//         return '';
//     } else {
//         return this.combinator.toCSS(context) + value;
//     }
// };
// module.exports = Element;

// },{"./combinator":56,"./node":76,"./paren":78}],64:[function(require,module,exports){
// var Node = require('./node'),
//     Paren = require('./paren'),
//     Comment = require('./comment'),
//     Dimension = require('./dimension'),
//     MATH = require('../constants').Math;

// var Expression = function (value, noSpacing) {
//     this.value = value;
//     this.noSpacing = noSpacing;
//     if (!value) {
//         throw new Error('Expression requires an array parameter');
//     }
// };
// Expression.prototype = new Node();
// Expression.prototype.type = 'Expression';
// Expression.prototype.accept = function (visitor) {
//     this.value = visitor.visitArray(this.value);
// };
// Expression.prototype.eval = function (context) {
//     var returnValue,
//         mathOn = context.isMathOn(),
//         inParenthesis = this.parens && 
//             (context.math !== MATH.STRICT_LEGACY || !this.parensInOp),
//         doubleParen = false;
//     if (inParenthesis) {
//         context.inParenthesis();
//     }
//     if (this.value.length > 1) {
//         returnValue = new Expression(this.value.map(function (e) {
//             if (!e.eval) {
//                 return e;
//             }
//             return e.eval(context);
//         }), this.noSpacing);
//     } else if (this.value.length === 1) {
//         if (this.value[0].parens && !this.value[0].parensInOp && !context.inCalc) {
//             doubleParen = true;
//         }
//         returnValue = this.value[0].eval(context);
//     } else {
//         returnValue = this;
//     }
//     if (inParenthesis) {
//         context.outOfParenthesis();
//     }
//     if (this.parens && this.parensInOp && !mathOn && !doubleParen 
//         && (!(returnValue instanceof Dimension))) {
//         returnValue = new Paren(returnValue);
//     }
//     return returnValue;
// };
// Expression.prototype.genCSS = function (context, output) {
//     for (var i = 0; i < this.value.length; i++) {
//         this.value[i].genCSS(context, output);
//         if (!this.noSpacing && i + 1 < this.value.length) {
//             output.add(' ');
//         }
//     }
// };
// Expression.prototype.throwAwayComments = function () {
//     this.value = this.value.filter(function(v) {
//         return !(v instanceof Comment);
//     });
// };
// module.exports = Expression;

// },{"../constants":12,"./comment":57,"./dimension":62,"./node":76,"./paren":78}],65:[function(require,module,exports){
// var Node = require('./node'),
//     Selector = require('./selector');

// var Extend = function Extend(selector, option, index, currentFileInfo, visibilityInfo) {
//     this.selector = selector;
//     this.option = option;
//     this.object_id = Extend.next_id++;
//     this.parent_ids = [this.object_id];
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.copyVisibilityInfo(visibilityInfo);
//     this.allowRoot = true;

//     switch (option) {
//         case 'all':
//             this.allowBefore = true;
//             this.allowAfter = true;
//             break;
//         default:
//             this.allowBefore = false;
//             this.allowAfter = false;
//             break;
//     }
//     this.setParent(this.selector, this);
// };
// Extend.next_id = 0;

// Extend.prototype = new Node();
// Extend.prototype.type = 'Extend';
// Extend.prototype.accept = function (visitor) {
//     this.selector = visitor.visit(this.selector);
// };
// Extend.prototype.eval = function (context) {
//     return new Extend(this.selector.eval(context), this.option, this.getIndex(), this.fileInfo(), this.visibilityInfo());
// };
// Extend.prototype.clone = function (context) {
//     return new Extend(this.selector, this.option, this.getIndex(), this.fileInfo(), this.visibilityInfo());
// };
// // it concatenates (joins) all selectors in selector array
// Extend.prototype.findSelfSelectors = function (selectors) {
//     var selfElements = [],
//         i,
//         selectorElements;

//     for (i = 0; i < selectors.length; i++) {
//         selectorElements = selectors[i].elements;
//         // duplicate the logic in genCSS function inside the selector node.
//         // future TODO - move both logics into the selector joiner visitor
//         if (i > 0 && selectorElements.length && selectorElements[0].combinator.value === '') {
//             selectorElements[0].combinator.value = ' ';
//         }
//         selfElements = selfElements.concat(selectors[i].elements);
//     }

//     this.selfSelectors = [new Selector(selfElements)];
//     this.selfSelectors[0].copyVisibilityInfo(this.visibilityInfo());
// };
// module.exports = Extend;

// },{"./node":76,"./selector":82}],66:[function(require,module,exports){
// var Node = require('./node'),
//     Media = require('./media'),
//     URL = require('./url'),
//     Quoted = require('./quoted'),
//     Ruleset = require('./ruleset'),
//     Anonymous = require('./anonymous'),
//     utils = require('../utils'),
//     LessError = require('../less-error');

// //
// // CSS @import node
// //
// // The general strategy here is that we don't want to wait
// // for the parsing to be completed, before we start importing
// // the file. That's because in the context of a browser,
// // most of the time will be spent waiting for the server to respond.
// //
// // On creation, we push the import path to our import queue, though
// // `import,push`, we also pass it a callback, which it'll call once
// // the file has been fetched, and parsed.
// //
// var Import = function (path, features, options, index, currentFileInfo, visibilityInfo) {
//     this.options = options;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.path = path;
//     this.features = features;
//     this.allowRoot = true;

//     if (this.options.less !== undefined || this.options.inline) {
//         this.css = !this.options.less || this.options.inline;
//     } else {
//         var pathValue = this.getPath();
//         if (pathValue && /[#\.\&\?]css([\?;].*)?$/.test(pathValue)) {
//             this.css = true;
//         }
//     }
//     this.copyVisibilityInfo(visibilityInfo);
//     this.setParent(this.features, this);
//     this.setParent(this.path, this);
// };

// //
// // The actual import node doesn't return anything, when converted to CSS.
// // The reason is that it's used at the evaluation stage, so that the rules
// // it imports can be treated like any other rules.
// //
// // In `eval`, we make sure all Import nodes get evaluated, recursively, so
// // we end up with a flat structure, which can easily be imported in the parent
// // ruleset.
// //
// Import.prototype = new Node();
// Import.prototype.type = 'Import';
// Import.prototype.accept = function (visitor) {
//     if (this.features) {
//         this.features = visitor.visit(this.features);
//     }
//     this.path = visitor.visit(this.path);
//     if (!this.options.isPlugin && !this.options.inline && this.root) {
//         this.root = visitor.visit(this.root);
//     }
// };
// Import.prototype.genCSS = function (context, output) {
//     if (this.css && this.path._fileInfo.reference === undefined) {
//         output.add('@import ', this._fileInfo, this._index);
//         this.path.genCSS(context, output);
//         if (this.features) {
//             output.add(' ');
//             this.features.genCSS(context, output);
//         }
//         output.add(';');
//     }
// };
// Import.prototype.getPath = function () {
//     return (this.path instanceof URL) ?
//         this.path.value.value : this.path.value;
// };
// Import.prototype.isVariableImport = function () {
//     var path = this.path;
//     if (path instanceof URL) {
//         path = path.value;
//     }
//     if (path instanceof Quoted) {
//         return path.containsVariables();
//     }

//     return true;
// };
// Import.prototype.evalForImport = function (context) {
//     var path = this.path;

//     if (path instanceof URL) {
//         path = path.value;
//     }

//     return new Import(path.eval(context), this.features, this.options, this._index, this._fileInfo, this.visibilityInfo());
// };
// Import.prototype.evalPath = function (context) {
//     var path = this.path.eval(context);
//     var fileInfo = this._fileInfo;

//     if (!(path instanceof URL)) {
//         // Add the rootpath if the URL requires a rewrite
//         var pathValue = path.value;
//         if (fileInfo &&
//             pathValue &&
//             context.pathRequiresRewrite(pathValue)) {
//             path.value = context.rewritePath(pathValue, fileInfo.rootpath);
//         } else {
//             path.value = context.normalizePath(path.value);
//         }
//     }

//     return path;
// };
// Import.prototype.eval = function (context) {
//     var result = this.doEval(context);
//     if (this.options.reference || this.blocksVisibility()) {
//         if (result.length || result.length === 0) {
//             result.forEach(function (node) {
//                 node.addVisibilityBlock();
//             }
//             );
//         } else {
//             result.addVisibilityBlock();
//         }
//     }
//     return result;
// };
// Import.prototype.doEval = function (context) {
//     var ruleset, registry,
//         features = this.features && this.features.eval(context);

//     if (this.options.isPlugin) {
//         if (this.root && this.root.eval) {
//             try {
//                 this.root.eval(context);
//             }
//             catch (e) {
//                 e.message = 'Plugin error during evaluation';
//                 throw new LessError(e, this.root.imports, this.root.filename);
//             }
//         }
//         registry = context.frames[0] && context.frames[0].functionRegistry;
//         if ( registry && this.root && this.root.functions ) {
//             registry.addMultiple( this.root.functions );
//         }

//         return [];
//     }

//     if (this.skip) {
//         if (typeof this.skip === 'function') {
//             this.skip = this.skip();
//         }
//         if (this.skip) {
//             return [];
//         }
//     }
//     if (this.options.inline) {
//         var contents = new Anonymous(this.root, 0,
//             {
//                 filename: this.importedFilename,
//                 reference: this.path._fileInfo && this.path._fileInfo.reference
//             }, true, true);

//         return this.features ? new Media([contents], this.features.value) : [contents];
//     } else if (this.css) {
//         var newImport = new Import(this.evalPath(context), features, this.options, this._index);
//         if (!newImport.css && this.error) {
//             throw this.error;
//         }
//         return newImport;
//     } else {
//         ruleset = new Ruleset(null, utils.copyArray(this.root.rules));
//         ruleset.evalImports(context);

//         return this.features ? new Media(ruleset.rules, this.features.value) : ruleset.rules;
//     }
// };
// module.exports = Import;

// },{"../less-error":38,"../utils":89,"./anonymous":50,"./media":71,"./node":76,"./quoted":80,"./ruleset":81,"./url":85}],67:[function(require,module,exports){
// var tree = Object.create(null);

// tree.Node = require('./node');
// tree.Color = require('./color');
// tree.AtRule = require('./atrule');
// tree.DetachedRuleset = require('./detached-ruleset');
// tree.Operation = require('./operation');
// tree.Dimension = require('./dimension');
// tree.Unit = require('./unit');
// tree.Keyword = require('./keyword');
// tree.Variable = require('./variable');
// tree.Property = require('./property');
// tree.Ruleset = require('./ruleset');
// tree.Element = require('./element');
// tree.Attribute = require('./attribute');
// tree.Combinator = require('./combinator');
// tree.Selector = require('./selector');
// tree.Quoted = require('./quoted');
// tree.Expression = require('./expression');
// tree.Declaration = require('./declaration');
// tree.Call = require('./call');
// tree.URL = require('./url');
// tree.Import = require('./import');
// tree.mixin = {
//     Call: require('./mixin-call'),
//     Definition: require('./mixin-definition')
// };
// tree.Comment = require('./comment');
// tree.Anonymous = require('./anonymous');
// tree.Value = require('./value');
// tree.JavaScript = require('./javascript');
// tree.Assignment = require('./assignment');
// tree.Condition = require('./condition');
// tree.Paren = require('./paren');
// tree.Media = require('./media');
// tree.UnicodeDescriptor = require('./unicode-descriptor');
// tree.Negative = require('./negative');
// tree.Extend = require('./extend');
// tree.VariableCall = require('./variable-call');
// tree.NamespaceValue = require('./namespace-value');

// module.exports = tree;

// },{"./anonymous":50,"./assignment":51,"./atrule":52,"./attribute":53,"./call":54,"./color":55,"./combinator":56,"./comment":57,"./condition":58,"./declaration":60,"./detached-ruleset":61,"./dimension":62,"./element":63,"./expression":64,"./extend":65,"./import":66,"./javascript":68,"./keyword":70,"./media":71,"./mixin-call":72,"./mixin-definition":73,"./namespace-value":74,"./negative":75,"./node":76,"./operation":77,"./paren":78,"./property":79,"./quoted":80,"./ruleset":81,"./selector":82,"./unicode-descriptor":83,"./unit":84,"./url":85,"./value":86,"./variable":88,"./variable-call":87}],68:[function(require,module,exports){
// var JsEvalNode = require('./js-eval-node'),
//     Dimension = require('./dimension'),
//     Quoted = require('./quoted'),
//     Anonymous = require('./anonymous');

// var JavaScript = function (string, escaped, index, currentFileInfo) {
//     this.escaped = escaped;
//     this.expression = string;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
// };
// JavaScript.prototype = new JsEvalNode();
// JavaScript.prototype.type = 'JavaScript';
// JavaScript.prototype.eval = function(context) {
//     var result = this.evaluateJavaScript(this.expression, context);
//     var type = typeof result;

//     if (type === 'number' && !isNaN(result)) {
//         return new Dimension(result);
//     } else if (type === 'string') {
//         return new Quoted('"' + result + '"', result, this.escaped, this._index);
//     } else if (Array.isArray(result)) {
//         return new Anonymous(result.join(', '));
//     } else {
//         return new Anonymous(result);
//     }
// };

// module.exports = JavaScript;

// },{"./anonymous":50,"./dimension":62,"./js-eval-node":69,"./quoted":80}],69:[function(require,module,exports){
// var Node = require('./node'),
//     Variable = require('./variable');

// var JsEvalNode = function() {
// };
// JsEvalNode.prototype = new Node();

// JsEvalNode.prototype.evaluateJavaScript = function (expression, context) {
//     var result,
//         that = this,
//         evalContext = {};

//     if (!context.javascriptEnabled) {
//         throw { message: 'Inline JavaScript is not enabled. Is it set in your options?',
//             filename: this.fileInfo().filename,
//             index: this.getIndex() };
//     }

//     expression = expression.replace(/@\{([\w-]+)\}/g, function (_, name) {
//         return that.jsify(new Variable('@' + name, that.getIndex(), that.fileInfo()).eval(context));
//     });

//     try {
//         expression = new Function('return (' + expression + ')');
//     } catch (e) {
//         throw { message: 'JavaScript evaluation error: ' + e.message + ' from `' + expression + '`' ,
//             filename: this.fileInfo().filename,
//             index: this.getIndex() };
//     }

//     var variables = context.frames[0].variables();
//     for (var k in variables) {
//         if (variables.hasOwnProperty(k)) {
//             /* jshint loopfunc:true */
//             evalContext[k.slice(1)] = {
//                 value: variables[k].value,
//                 toJS: function () {
//                     return this.value.eval(context).toCSS();
//                 }
//             };
//         }
//     }

//     try {
//         result = expression.call(evalContext);
//     } catch (e) {
//         throw { message: 'JavaScript evaluation error: \'' + e.name + ': ' + e.message.replace(/["]/g, '\'') + '\'' ,
//             filename: this.fileInfo().filename,
//             index: this.getIndex() };
//     }
//     return result;
// };
// JsEvalNode.prototype.jsify = function (obj) {
//     if (Array.isArray(obj.value) && (obj.value.length > 1)) {
//         return '[' + obj.value.map(function (v) { return v.toCSS(); }).join(', ') + ']';
//     } else {
//         return obj.toCSS();
//     }
// };

// module.exports = JsEvalNode;

// },{"./node":76,"./variable":88}],70:[function(require,module,exports){
// var Node = require('./node');

// var Keyword = function (value) { this.value = value; };
// Keyword.prototype = new Node();
// Keyword.prototype.type = 'Keyword';
// Keyword.prototype.genCSS = function (context, output) {
//     if (this.value === '%') { throw { type: 'Syntax', message: 'Invalid % without number' }; }
//     output.add(this.value);
// };

// Keyword.True = new Keyword('true');
// Keyword.False = new Keyword('false');

// module.exports = Keyword;

// },{"./node":76}],71:[function(require,module,exports){
// var Ruleset = require('./ruleset'),
//     Value = require('./value'),
//     Selector = require('./selector'),
//     Anonymous = require('./anonymous'),
//     Expression = require('./expression'),
//     AtRule = require('./atrule'),
//     utils = require('../utils');

// var Media = function (value, features, index, currentFileInfo, visibilityInfo) {
//     this._index = index;
//     this._fileInfo = currentFileInfo;

//     var selectors = (new Selector([], null, null, this._index, this._fileInfo)).createEmptySelectors();

//     this.features = new Value(features);
//     this.rules = [new Ruleset(selectors, value)];
//     this.rules[0].allowImports = true;
//     this.copyVisibilityInfo(visibilityInfo);
//     this.allowRoot = true;
//     this.setParent(selectors, this);
//     this.setParent(this.features, this);
//     this.setParent(this.rules, this);
// };
// Media.prototype = new AtRule();
// Media.prototype.type = 'Media';
// Media.prototype.isRulesetLike = function() { return true; };
// Media.prototype.accept = function (visitor) {
//     if (this.features) {
//         this.features = visitor.visit(this.features);
//     }
//     if (this.rules) {
//         this.rules = visitor.visitArray(this.rules);
//     }
// };
// Media.prototype.genCSS = function (context, output) {
//     output.add('@media ', this._fileInfo, this._index);
//     this.features.genCSS(context, output);
//     this.outputRuleset(context, output, this.rules);
// };
// Media.prototype.eval = function (context) {
//     if (!context.mediaBlocks) {
//         context.mediaBlocks = [];
//         context.mediaPath = [];
//     }

//     var media = new Media(null, [], this._index, this._fileInfo, this.visibilityInfo());
//     if (this.debugInfo) {
//         this.rules[0].debugInfo = this.debugInfo;
//         media.debugInfo = this.debugInfo;
//     }
    
//     media.features = this.features.eval(context);

//     context.mediaPath.push(media);
//     context.mediaBlocks.push(media);

//     this.rules[0].functionRegistry = context.frames[0].functionRegistry.inherit();
//     context.frames.unshift(this.rules[0]);
//     media.rules = [this.rules[0].eval(context)];
//     context.frames.shift();

//     context.mediaPath.pop();

//     return context.mediaPath.length === 0 ? media.evalTop(context) :
//                 media.evalNested(context);
// };
// Media.prototype.evalTop = function (context) {
//     var result = this;

//     // Render all dependent Media blocks.
//     if (context.mediaBlocks.length > 1) {
//         var selectors = (new Selector([], null, null, this.getIndex(), this.fileInfo())).createEmptySelectors();
//         result = new Ruleset(selectors, context.mediaBlocks);
//         result.multiMedia = true;
//         result.copyVisibilityInfo(this.visibilityInfo());
//         this.setParent(result, this);
//     }

//     delete context.mediaBlocks;
//     delete context.mediaPath;

//     return result;
// };
// Media.prototype.evalNested = function (context) {
//     var i, value,
//         path = context.mediaPath.concat([this]);

//     // Extract the media-query conditions separated with `,` (OR).
//     for (i = 0; i < path.length; i++) {
//         value = path[i].features instanceof Value ?
//                     path[i].features.value : path[i].features;
//         path[i] = Array.isArray(value) ? value : [value];
//     }

//     // Trace all permutations to generate the resulting media-query.
//     //
//     // (a, b and c) with nested (d, e) ->
//     //    a and d
//     //    a and e
//     //    b and c and d
//     //    b and c and e
//     this.features = new Value(this.permute(path).map(function (path) {
//         path = path.map(function (fragment) {
//             return fragment.toCSS ? fragment : new Anonymous(fragment);
//         });

//         for (i = path.length - 1; i > 0; i--) {
//             path.splice(i, 0, new Anonymous('and'));
//         }

//         return new Expression(path);
//     }));
//     this.setParent(this.features, this);

//     // Fake a tree-node that doesn't output anything.
//     return new Ruleset([], []);
// };
// Media.prototype.permute = function (arr) {
//     if (arr.length === 0) {
//         return [];
//     } else if (arr.length === 1) {
//         return arr[0];
//     } else {
//         var result = [];
//         var rest = this.permute(arr.slice(1));
//         for (var i = 0; i < rest.length; i++) {
//             for (var j = 0; j < arr[0].length; j++) {
//                 result.push([arr[0][j]].concat(rest[i]));
//             }
//         }
//         return result;
//     }
// };
// Media.prototype.bubbleSelectors = function (selectors) {
//     if (!selectors) {
//         return;
//     }
//     this.rules = [new Ruleset(utils.copyArray(selectors), [this.rules[0]])];
//     this.setParent(this.rules, this);
// };
// module.exports = Media;

// },{"../utils":89,"./anonymous":50,"./atrule":52,"./expression":64,"./ruleset":81,"./selector":82,"./value":86}],72:[function(require,module,exports){
// var Node = require('./node'),
//     Selector = require('./selector'),
//     MixinDefinition = require('./mixin-definition'),
//     defaultFunc = require('../functions/default');

// var MixinCall = function (elements, args, index, currentFileInfo, important) {
//     this.selector = new Selector(elements);
//     this.arguments = args || [];
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.important = important;
//     this.allowRoot = true;
//     this.setParent(this.selector, this);
// };
// MixinCall.prototype = new Node();
// MixinCall.prototype.type = 'MixinCall';
// MixinCall.prototype.accept = function (visitor) {
//     if (this.selector) {
//         this.selector = visitor.visit(this.selector);
//     }
//     if (this.arguments.length) {
//         this.arguments = visitor.visitArray(this.arguments);
//     }
// };
// MixinCall.prototype.eval = function (context) {
//     var mixins, mixin, mixinPath, args = [], arg, argValue,
//         rules = [], match = false, i, m, f, isRecursive, isOneFound,
//         candidates = [], candidate, conditionResult = [], defaultResult, defFalseEitherCase = -1,
//         defNone = 0, defTrue = 1, defFalse = 2, count, originalRuleset, noArgumentsFilter;

//     this.selector = this.selector.eval(context);

//     function calcDefGroup(mixin, mixinPath) {
//         var f, p, namespace;

//         for (f = 0; f < 2; f++) {
//             conditionResult[f] = true;
//             defaultFunc.value(f);
//             for (p = 0; p < mixinPath.length && conditionResult[f]; p++) {
//                 namespace = mixinPath[p];
//                 if (namespace.matchCondition) {
//                     conditionResult[f] = conditionResult[f] && namespace.matchCondition(null, context);
//                 }
//             }
//             if (mixin.matchCondition) {
//                 conditionResult[f] = conditionResult[f] && mixin.matchCondition(args, context);
//             }
//         }
//         if (conditionResult[0] || conditionResult[1]) {
//             if (conditionResult[0] != conditionResult[1]) {
//                 return conditionResult[1] ?
//                     defTrue : defFalse;
//             }

//             return defNone;
//         }
//         return defFalseEitherCase;
//     }

//     for (i = 0; i < this.arguments.length; i++) {
//         arg = this.arguments[i];
//         argValue = arg.value.eval(context);
//         if (arg.expand && Array.isArray(argValue.value)) {
//             argValue = argValue.value;
//             for (m = 0; m < argValue.length; m++) {
//                 args.push({value: argValue[m]});
//             }
//         } else {
//             args.push({name: arg.name, value: argValue});
//         }
//     }

//     noArgumentsFilter = function(rule) {return rule.matchArgs(null, context);};

//     for (i = 0; i < context.frames.length; i++) {
//         if ((mixins = context.frames[i].find(this.selector, null, noArgumentsFilter)).length > 0) {
//             isOneFound = true;

//             // To make `default()` function independent of definition order we have two "subpasses" here.
//             // At first we evaluate each guard *twice* (with `default() == true` and `default() == false`),
//             // and build candidate list with corresponding flags. Then, when we know all possible matches,
//             // we make a final decision.

//             for (m = 0; m < mixins.length; m++) {
//                 mixin = mixins[m].rule;
//                 mixinPath = mixins[m].path;
//                 isRecursive = false;
//                 for (f = 0; f < context.frames.length; f++) {
//                     if ((!(mixin instanceof MixinDefinition)) && mixin === (context.frames[f].originalRuleset || context.frames[f])) {
//                         isRecursive = true;
//                         break;
//                     }
//                 }
//                 if (isRecursive) {
//                     continue;
//                 }

//                 if (mixin.matchArgs(args, context)) {
//                     candidate = {mixin: mixin, group: calcDefGroup(mixin, mixinPath)};

//                     if (candidate.group !== defFalseEitherCase) {
//                         candidates.push(candidate);
//                     }

//                     match = true;
//                 }
//             }

//             defaultFunc.reset();

//             count = [0, 0, 0];
//             for (m = 0; m < candidates.length; m++) {
//                 count[candidates[m].group]++;
//             }

//             if (count[defNone] > 0) {
//                 defaultResult = defFalse;
//             } else {
//                 defaultResult = defTrue;
//                 if ((count[defTrue] + count[defFalse]) > 1) {
//                     throw { type: 'Runtime',
//                         message: 'Ambiguous use of `default()` found when matching for `' + this.format(args) + '`',
//                         index: this.getIndex(), filename: this.fileInfo().filename };
//                 }
//             }

//             for (m = 0; m < candidates.length; m++) {
//                 candidate = candidates[m].group;
//                 if ((candidate === defNone) || (candidate === defaultResult)) {
//                     try {
//                         mixin = candidates[m].mixin;
//                         if (!(mixin instanceof MixinDefinition)) {
//                             originalRuleset = mixin.originalRuleset || mixin;
//                             mixin = new MixinDefinition('', [], mixin.rules, null, false, null, originalRuleset.visibilityInfo());
//                             mixin.originalRuleset = originalRuleset;
//                         }
//                         var newRules = mixin.evalCall(context, args, this.important).rules;
//                         this._setVisibilityToReplacement(newRules);
//                         Array.prototype.push.apply(rules, newRules);
//                     } catch (e) {
//                         throw { message: e.message, index: this.getIndex(), filename: this.fileInfo().filename, stack: e.stack };
//                     }
//                 }
//             }

//             if (match) {
//                 return rules;
//             }
//         }
//     }
//     if (isOneFound) {
//         throw { type:    'Runtime',
//             message: 'No matching definition was found for `' + this.format(args) + '`',
//             index:   this.getIndex(), filename: this.fileInfo().filename };
//     } else {
//         throw { type:    'Name',
//             message: this.selector.toCSS().trim() + ' is undefined',
//             index:   this.getIndex(), filename: this.fileInfo().filename };
//     }
// };

// MixinCall.prototype._setVisibilityToReplacement = function (replacement) {
//     var i, rule;
//     if (this.blocksVisibility()) {
//         for (i = 0; i < replacement.length; i++) {
//             rule = replacement[i];
//             rule.addVisibilityBlock();
//         }
//     }
// };
// MixinCall.prototype.format = function (args) {
//     return this.selector.toCSS().trim() + '(' +
//         (args ? args.map(function (a) {
//             var argValue = '';
//             if (a.name) {
//                 argValue += a.name + ':';
//             }
//             if (a.value.toCSS) {
//                 argValue += a.value.toCSS();
//             } else {
//                 argValue += '???';
//             }
//             return argValue;
//         }).join(', ') : '') + ')';
// };
// module.exports = MixinCall;

// },{"../functions/default":25,"./mixin-definition":73,"./node":76,"./selector":82}],73:[function(require,module,exports){
// var Selector = require('./selector'),
//     Element = require('./element'),
//     Ruleset = require('./ruleset'),
//     Declaration = require('./declaration'),
//     DetachedRuleset = require('./detached-ruleset'),
//     Expression = require('./expression'),
//     contexts = require('../contexts'),
//     utils = require('../utils');

// var Definition = function (name, params, rules, condition, variadic, frames, visibilityInfo) {
//     this.name = name || 'anonymous mixin';
//     this.selectors = [new Selector([new Element(null, name, false, this._index, this._fileInfo)])];
//     this.params = params;
//     this.condition = condition;
//     this.variadic = variadic;
//     this.arity = params.length;
//     this.rules = rules;
//     this._lookups = {};
//     var optionalParameters = [];
//     this.required = params.reduce(function (count, p) {
//         if (!p.name || (p.name && !p.value)) {
//             return count + 1;
//         }
//         else {
//             optionalParameters.push(p.name);
//             return count;
//         }
//     }, 0);
//     this.optionalParameters = optionalParameters;
//     this.frames = frames;
//     this.copyVisibilityInfo(visibilityInfo);
//     this.allowRoot = true;
// };
// Definition.prototype = new Ruleset();
// Definition.prototype.type = 'MixinDefinition';
// Definition.prototype.evalFirst = true;
// Definition.prototype.accept = function (visitor) {
//     if (this.params && this.params.length) {
//         this.params = visitor.visitArray(this.params);
//     }
//     this.rules = visitor.visitArray(this.rules);
//     if (this.condition) {
//         this.condition = visitor.visit(this.condition);
//     }
// };
// Definition.prototype.evalParams = function (context, mixinEnv, args, evaldArguments) {
//     /* jshint boss:true */
//     var frame = new Ruleset(null, null),
//         varargs, arg,
//         params = utils.copyArray(this.params),
//         i, j, val, name, isNamedFound, argIndex, argsLength = 0;

//     if (mixinEnv.frames && mixinEnv.frames[0] && mixinEnv.frames[0].functionRegistry) {
//         frame.functionRegistry = mixinEnv.frames[0].functionRegistry.inherit();
//     }
//     mixinEnv = new contexts.Eval(mixinEnv, [frame].concat(mixinEnv.frames));

//     if (args) {
//         args = utils.copyArray(args);
//         argsLength = args.length;

//         for (i = 0; i < argsLength; i++) {
//             arg = args[i];
//             if (name = (arg && arg.name)) {
//                 isNamedFound = false;
//                 for (j = 0; j < params.length; j++) {
//                     if (!evaldArguments[j] && name === params[j].name) {
//                         evaldArguments[j] = arg.value.eval(context);
//                         frame.prependRule(new Declaration(name, arg.value.eval(context)));
//                         isNamedFound = true;
//                         break;
//                     }
//                 }
//                 if (isNamedFound) {
//                     args.splice(i, 1);
//                     i--;
//                     continue;
//                 } else {
//                     throw { type: 'Runtime', message: 'Named argument for ' + this.name +
//                         ' ' + args[i].name + ' not found' };
//                 }
//             }
//         }
//     }
//     argIndex = 0;
//     for (i = 0; i < params.length; i++) {
//         if (evaldArguments[i]) { continue; }

//         arg = args && args[argIndex];

//         if (name = params[i].name) {
//             if (params[i].variadic) {
//                 varargs = [];
//                 for (j = argIndex; j < argsLength; j++) {
//                     varargs.push(args[j].value.eval(context));
//                 }
//                 frame.prependRule(new Declaration(name, new Expression(varargs).eval(context)));
//             } else {
//                 val = arg && arg.value;
//                 if (val) {
//                     // This was a mixin call, pass in a detached ruleset of it's eval'd rules
//                     if (Array.isArray(val)) {
//                         val = new DetachedRuleset(new Ruleset('', val));
//                     }
//                     else {
//                         val = val.eval(context);
//                     }
//                 } else if (params[i].value) {
//                     val = params[i].value.eval(mixinEnv);
//                     frame.resetCache();
//                 } else {
//                     throw { type: 'Runtime', message: 'wrong number of arguments for ' + this.name +
//                         ' (' + argsLength + ' for ' + this.arity + ')' };
//                 }

//                 frame.prependRule(new Declaration(name, val));
//                 evaldArguments[i] = val;
//             }
//         }

//         if (params[i].variadic && args) {
//             for (j = argIndex; j < argsLength; j++) {
//                 evaldArguments[j] = args[j].value.eval(context);
//             }
//         }
//         argIndex++;
//     }

//     return frame;
// };
// Definition.prototype.makeImportant = function() {
//     var rules = !this.rules ? this.rules : this.rules.map(function (r) {
//         if (r.makeImportant) {
//             return r.makeImportant(true);
//         } else {
//             return r;
//         }
//     });
//     var result = new Definition(this.name, this.params, rules, this.condition, this.variadic, this.frames);
//     return result;
// };
// Definition.prototype.eval = function (context) {
//     return new Definition(this.name, this.params, this.rules, this.condition, this.variadic, this.frames || utils.copyArray(context.frames));
// };
// Definition.prototype.evalCall = function (context, args, important) {
//     var _arguments = [],
//         mixinFrames = this.frames ? this.frames.concat(context.frames) : context.frames,
//         frame = this.evalParams(context, new contexts.Eval(context, mixinFrames), args, _arguments),
//         rules, ruleset;

//     frame.prependRule(new Declaration('@arguments', new Expression(_arguments).eval(context)));

//     rules = utils.copyArray(this.rules);

//     ruleset = new Ruleset(null, rules);
//     ruleset.originalRuleset = this;
//     ruleset = ruleset.eval(new contexts.Eval(context, [this, frame].concat(mixinFrames)));
//     if (important) {
//         ruleset = ruleset.makeImportant();
//     }
//     return ruleset;
// };
// Definition.prototype.matchCondition = function (args, context) {
//     if (this.condition && !this.condition.eval(
//         new contexts.Eval(context,
//             [this.evalParams(context, /* the parameter variables */
//                 new contexts.Eval(context, this.frames ? this.frames.concat(context.frames) : context.frames), args, [])]
//             .concat(this.frames || []) // the parent namespace/mixin frames
//             .concat(context.frames)))) { // the current environment frames
//         return false;
//     }
//     return true;
// };
// Definition.prototype.matchArgs = function (args, context) {
//     var allArgsCnt = (args && args.length) || 0, len, optionalParameters = this.optionalParameters;
//     var requiredArgsCnt = !args ? 0 : args.reduce(function (count, p) {
//         if (optionalParameters.indexOf(p.name) < 0) {
//             return count + 1;
//         } else {
//             return count;
//         }
//     }, 0);

//     if (!this.variadic) {
//         if (requiredArgsCnt < this.required) {
//             return false;
//         }
//         if (allArgsCnt > this.params.length) {
//             return false;
//         }
//     } else {
//         if (requiredArgsCnt < (this.required - 1)) {
//             return false;
//         }
//     }

//     // check patterns
//     len = Math.min(requiredArgsCnt, this.arity);

//     for (var i = 0; i < len; i++) {
//         if (!this.params[i].name && !this.params[i].variadic) {
//             if (args[i].value.eval(context).toCSS() != this.params[i].value.eval(context).toCSS()) {
//                 return false;
//             }
//         }
//     }
//     return true;
// };
// module.exports = Definition;

// },{"../contexts":13,"../utils":89,"./declaration":60,"./detached-ruleset":61,"./element":63,"./expression":64,"./ruleset":81,"./selector":82}],74:[function(require,module,exports){
// var Node = require('./node'),
//     Variable = require('./variable'),
//     Ruleset = require('./ruleset'),
//     Selector = require('./selector');

// var NamespaceValue = function (ruleCall, lookups, important, index, fileInfo) {
//     this.value = ruleCall;
//     this.lookups = lookups;
//     this.important = important;
//     this._index = index;
//     this._fileInfo = fileInfo;
// };
// NamespaceValue.prototype = new Node();
// NamespaceValue.prototype.type = 'NamespaceValue';
// NamespaceValue.prototype.eval = function (context) {
//     var i, j, name, rules = this.value.eval(context);
    
//     for (i = 0; i < this.lookups.length; i++) {
//         name = this.lookups[i];

//         /**
//          * Eval'd DRs return rulesets.
//          * Eval'd mixins return rules, so let's make a ruleset if we need it.
//          * We need to do this because of late parsing of values
//          */
//         if (Array.isArray(rules)) {
//             rules = new Ruleset([new Selector()], rules);
//         }

//         if (name === '') {
//             rules = rules.lastDeclaration();
//         }
//         else if (name.charAt(0) === '@') {
//             if (name.charAt(1) === '@') {
//                 name = '@' + new Variable(name.substr(1)).eval(context).value;
//             }
//             if (rules.variables) {
//                 rules = rules.variable(name);
//             }
            
//             if (!rules) {
//                 throw { type: 'Name',
//                     message: 'variable ' + name + ' not found',
//                     filename: this.fileInfo().filename,
//                     index: this.getIndex() };
//             }
//         }
//         else {
//             if (name.substring(0, 2) === '$@') {
//                 name = '$' + new Variable(name.substr(1)).eval(context).value;
//             }
//             else {
//                 name = name.charAt(0) === '$' ? name : '$' + name;
//             }
//             if (rules.properties) {
//                 rules = rules.property(name);
//             }
        
//             if (!rules) {
//                 throw { type: 'Name',
//                     message: 'property "' + name.substr(1) + '" not found',
//                     filename: this.fileInfo().filename,
//                     index: this.getIndex() };
//             }
//             // Properties are an array of values, since a ruleset can have multiple props.
//             // We pick the last one (the "cascaded" value)
//             rules = rules[rules.length - 1];
//         }

//         if (rules.value) {
//             rules = rules.eval(context).value;
//         }
//         if (rules.ruleset) {
//             rules = rules.ruleset.eval(context);
//         }
//     }
//     return rules;
// };
// module.exports = NamespaceValue;

// },{"./node":76,"./ruleset":81,"./selector":82,"./variable":88}],75:[function(require,module,exports){
// var Node = require('./node'),
//     Operation = require('./operation'),
//     Dimension = require('./dimension');

// var Negative = function (node) {
//     this.value = node;
// };
// Negative.prototype = new Node();
// Negative.prototype.type = 'Negative';
// Negative.prototype.genCSS = function (context, output) {
//     output.add('-');
//     this.value.genCSS(context, output);
// };
// Negative.prototype.eval = function (context) {
//     if (context.isMathOn()) {
//         return (new Operation('*', [new Dimension(-1), this.value])).eval(context);
//     }
//     return new Negative(this.value.eval(context));
// };
// module.exports = Negative;

// },{"./dimension":62,"./node":76,"./operation":77}],76:[function(require,module,exports){
// var Node = function() {
//     this.parent = null;
//     this.visibilityBlocks = undefined;
//     this.nodeVisible = undefined;
//     this.rootNode = null;
//     this.parsed = null;

//     var self = this;
//     Object.defineProperty(this, 'currentFileInfo', {
//         get: function() { return self.fileInfo(); }
//     });
//     Object.defineProperty(this, 'index', {
//         get: function() { return self.getIndex(); }
//     });

// };
// Node.prototype.setParent = function(nodes, parent) {
//     function set(node) {
//         if (node && node instanceof Node) {
//             node.parent = parent;
//         }
//     }
//     if (Array.isArray(nodes)) {
//         nodes.forEach(set);
//     }
//     else {
//         set(nodes);
//     }
// };
// Node.prototype.getIndex = function() {
//     return this._index || (this.parent && this.parent.getIndex()) || 0;
// };
// Node.prototype.fileInfo = function() {
//     return this._fileInfo || (this.parent && this.parent.fileInfo()) || {};
// };
// Node.prototype.isRulesetLike = function() { return false; };
// Node.prototype.toCSS = function (context) {
//     var strs = [];
//     this.genCSS(context, {
//         add: function(chunk, fileInfo, index) {
//             strs.push(chunk);
//         },
//         isEmpty: function () {
//             return strs.length === 0;
//         }
//     });
//     return strs.join('');
// };
// Node.prototype.genCSS = function (context, output) {
//     output.add(this.value);
// };
// Node.prototype.accept = function (visitor) {
//     this.value = visitor.visit(this.value);
// };
// Node.prototype.eval = function () { return this; };
// Node.prototype._operate = function (context, op, a, b) {
//     switch (op) {
//         case '+': return a + b;
//         case '-': return a - b;
//         case '*': return a * b;
//         case '/': return a / b;
//     }
// };
// Node.prototype.fround = function(context, value) {
//     var precision = context && context.numPrecision;
//     // add "epsilon" to ensure numbers like 1.000000005 (represented as 1.000000004999...) are properly rounded:
//     return (precision) ? Number((value + 2e-16).toFixed(precision)) : value;
// };
// Node.compare = function (a, b) {
//     /* returns:
//      -1: a < b
//      0: a = b
//      1: a > b
//      and *any* other value for a != b (e.g. undefined, NaN, -2 etc.) */

//     if ((a.compare) &&
//         // for "symmetric results" force toCSS-based comparison
//         // of Quoted or Anonymous if either value is one of those
//         !(b.type === 'Quoted' || b.type === 'Anonymous')) {
//         return a.compare(b);
//     } else if (b.compare) {
//         return -b.compare(a);
//     } else if (a.type !== b.type) {
//         return undefined;
//     }

//     a = a.value;
//     b = b.value;
//     if (!Array.isArray(a)) {
//         return a === b ? 0 : undefined;
//     }
//     if (a.length !== b.length) {
//         return undefined;
//     }
//     for (var i = 0; i < a.length; i++) {
//         if (Node.compare(a[i], b[i]) !== 0) {
//             return undefined;
//         }
//     }
//     return 0;
// };

// Node.numericCompare = function (a, b) {
//     return a  <  b ? -1
//         : a === b ?  0
//         : a  >  b ?  1 : undefined;
// };
// // Returns true if this node represents root of ast imported by reference
// Node.prototype.blocksVisibility = function () {
//     if (this.visibilityBlocks == null) {
//         this.visibilityBlocks = 0;
//     }
//     return this.visibilityBlocks !== 0;
// };
// Node.prototype.addVisibilityBlock = function () {
//     if (this.visibilityBlocks == null) {
//         this.visibilityBlocks = 0;
//     }
//     this.visibilityBlocks = this.visibilityBlocks + 1;
// };
// Node.prototype.removeVisibilityBlock = function () {
//     if (this.visibilityBlocks == null) {
//         this.visibilityBlocks = 0;
//     }
//     this.visibilityBlocks = this.visibilityBlocks - 1;
// };
// // Turns on node visibility - if called node will be shown in output regardless
// // of whether it comes from import by reference or not
// Node.prototype.ensureVisibility = function () {
//     this.nodeVisible = true;
// };
// // Turns off node visibility - if called node will NOT be shown in output regardless
// // of whether it comes from import by reference or not
// Node.prototype.ensureInvisibility = function () {
//     this.nodeVisible = false;
// };
// // return values:
// // false - the node must not be visible
// // true - the node must be visible
// // undefined or null - the node has the same visibility as its parent
// Node.prototype.isVisible = function () {
//     return this.nodeVisible;
// };
// Node.prototype.visibilityInfo = function() {
//     return {
//         visibilityBlocks: this.visibilityBlocks,
//         nodeVisible: this.nodeVisible
//     };
// };
// Node.prototype.copyVisibilityInfo = function(info) {
//     if (!info) {
//         return;
//     }
//     this.visibilityBlocks = info.visibilityBlocks;
//     this.nodeVisible = info.nodeVisible;
// };
// module.exports = Node;

// },{}],77:[function(require,module,exports){
// var Node = require('./node'),
//     Color = require('./color'),
//     Dimension = require('./dimension'),
//     MATH = require('../constants').Math;

// var Operation = function (op, operands, isSpaced) {
//     this.op = op.trim();
//     this.operands = operands;
//     this.isSpaced = isSpaced;
// };
// Operation.prototype = new Node();
// Operation.prototype.type = 'Operation';
// Operation.prototype.accept = function (visitor) {
//     this.operands = visitor.visit(this.operands);
// };
// Operation.prototype.eval = function (context) {
//     var a = this.operands[0].eval(context),
//         b = this.operands[1].eval(context),
//         op;

//     if (context.isMathOn(this.op)) {
//         op = this.op === './' ? '/' : this.op;
//         if (a instanceof Dimension && b instanceof Color) {
//             a = a.toColor();
//         }
//         if (b instanceof Dimension && a instanceof Color) {
//             b = b.toColor();
//         }
//         if (!a.operate) {
//             if (a instanceof Operation && a.op === '/' && context.math === MATH.PARENS_DIVISION) {
//                 return new Operation(this.op, [a, b], this.isSpaced);
//             }
//             throw { type: 'Operation',
//                 message: 'Operation on an invalid type' };
//         }

//         return a.operate(context, op, b);
//     } else {
//         return new Operation(this.op, [a, b], this.isSpaced);
//     }
// };
// Operation.prototype.genCSS = function (context, output) {
//     this.operands[0].genCSS(context, output);
//     if (this.isSpaced) {
//         output.add(' ');
//     }
//     output.add(this.op);
//     if (this.isSpaced) {
//         output.add(' ');
//     }
//     this.operands[1].genCSS(context, output);
// };

// module.exports = Operation;

// },{"../constants":12,"./color":55,"./dimension":62,"./node":76}],78:[function(require,module,exports){
// var Node = require('./node');

// var Paren = function (node) {
//     this.value = node;
// };
// Paren.prototype = new Node();
// Paren.prototype.type = 'Paren';
// Paren.prototype.genCSS = function (context, output) {
//     output.add('(');
//     this.value.genCSS(context, output);
//     output.add(')');
// };
// Paren.prototype.eval = function (context) {
//     return new Paren(this.value.eval(context));
// };
// module.exports = Paren;

// },{"./node":76}],79:[function(require,module,exports){
// var Node = require('./node'),
//     Declaration = require('./declaration');

// var Property = function (name, index, currentFileInfo) {
//     this.name = name;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
// };
// Property.prototype = new Node();
// Property.prototype.type = 'Property';
// Property.prototype.eval = function (context) {
//     var property, name = this.name;
//     // TODO: shorten this reference
//     var mergeRules = context.pluginManager.less.visitors.ToCSSVisitor.prototype._mergeRules;

//     if (this.evaluating) {
//         throw { type: 'Name',
//             message: 'Recursive property reference for ' + name,
//             filename: this.fileInfo().filename,
//             index: this.getIndex() };
//     }

//     this.evaluating = true;

//     property = this.find(context.frames, function (frame) {

//         var v, vArr = frame.property(name);
//         if (vArr) {
//             for (var i = 0; i < vArr.length; i++) {
//                 v = vArr[i];

//                 vArr[i] = new Declaration(v.name,
//                     v.value,
//                     v.important,
//                     v.merge,
//                     v.index,
//                     v.currentFileInfo,
//                     v.inline,
//                     v.variable
//                 );
//             }
//             mergeRules(vArr);

//             v = vArr[vArr.length - 1];
//             if (v.important) {
//                 var importantScope = context.importantScope[context.importantScope.length - 1];
//                 importantScope.important = v.important;
//             }
//             v = v.value.eval(context);
//             return v;
//         }
//     });
//     if (property) {
//         this.evaluating = false;
//         return property;
//     } else {
//         throw { type: 'Name',
//             message: 'Property \'' + name + '\' is undefined',
//             filename: this.currentFileInfo.filename,
//             index: this.index };
//     }
// };
// Property.prototype.find = function (obj, fun) {
//     for (var i = 0, r; i < obj.length; i++) {
//         r = fun.call(obj, obj[i]);
//         if (r) { return r; }
//     }
//     return null;
// };
// module.exports = Property;

// },{"./declaration":60,"./node":76}],80:[function(require,module,exports){
// var Node = require('./node'),
//     Variable = require('./variable'),
//     Property = require('./property');

// var Quoted = function (str, content, escaped, index, currentFileInfo) {
//     this.escaped = (escaped == null) ? true : escaped;
//     this.value = content || '';
//     this.quote = str.charAt(0);
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.variableRegex = /@\{([\w-]+)\}/g;
//     this.propRegex = /\$\{([\w-]+)\}/g;
// };
// Quoted.prototype = new Node();
// Quoted.prototype.type = 'Quoted';
// Quoted.prototype.genCSS = function (context, output) {
//     if (!this.escaped) {
//         output.add(this.quote, this.fileInfo(), this.getIndex());
//     }
//     output.add(this.value);
//     if (!this.escaped) {
//         output.add(this.quote);
//     }
// };
// Quoted.prototype.containsVariables = function() {
//     return this.value.match(this.variableRegex);
// };
// Quoted.prototype.eval = function (context) {
//     var that = this, value = this.value;
//     var variableReplacement = function (_, name) {
//         var v = new Variable('@' + name, that.getIndex(), that.fileInfo()).eval(context, true);
//         return (v instanceof Quoted) ? v.value : v.toCSS();
//     };
//     var propertyReplacement = function (_, name) {
//         var v = new Property('$' + name, that.getIndex(), that.fileInfo()).eval(context, true);
//         return (v instanceof Quoted) ? v.value : v.toCSS();
//     };
//     function iterativeReplace(value, regexp, replacementFnc) {
//         var evaluatedValue = value;
//         do {
//             value = evaluatedValue;
//             evaluatedValue = value.replace(regexp, replacementFnc);
//         } while (value !== evaluatedValue);
//         return evaluatedValue;
//     }
//     value = iterativeReplace(value, this.variableRegex, variableReplacement);
//     value = iterativeReplace(value, this.propRegex, propertyReplacement);
//     return new Quoted(this.quote + value + this.quote, value, this.escaped, this.getIndex(), this.fileInfo());
// };
// Quoted.prototype.compare = function (other) {
//     // when comparing quoted strings allow the quote to differ
//     if (other.type === 'Quoted' && !this.escaped && !other.escaped) {
//         return Node.numericCompare(this.value, other.value);
//     } else {
//         return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
//     }
// };
// module.exports = Quoted;

// },{"./node":76,"./property":79,"./variable":88}],81:[function(require,module,exports){
// var Node = require('./node'),
//     Declaration = require('./declaration'),
//     Keyword = require('./keyword'),
//     Comment = require('./comment'),
//     Paren = require('./paren'),
//     Selector = require('./selector'),
//     Element = require('./element'),
//     Anonymous = require('./anonymous'),
//     contexts = require('../contexts'),
//     globalFunctionRegistry = require('../functions/function-registry'),
//     defaultFunc = require('../functions/default'),
//     getDebugInfo = require('./debug-info'),
//     utils = require('../utils');

// var Ruleset = function (selectors, rules, strictImports, visibilityInfo) {
//     this.selectors = selectors;
//     this.rules = rules;
//     this._lookups = {};
//     this._variables = null;
//     this._properties = null;
//     this.strictImports = strictImports;
//     this.copyVisibilityInfo(visibilityInfo);
//     this.allowRoot = true;

//     this.setParent(this.selectors, this);
//     this.setParent(this.rules, this);

// };
// Ruleset.prototype = new Node();
// Ruleset.prototype.type = 'Ruleset';
// Ruleset.prototype.isRuleset = true;
// Ruleset.prototype.isRulesetLike = function() { return true; };
// Ruleset.prototype.accept = function (visitor) {
//     if (this.paths) {
//         this.paths = visitor.visitArray(this.paths, true);
//     } else if (this.selectors) {
//         this.selectors = visitor.visitArray(this.selectors);
//     }
//     if (this.rules && this.rules.length) {
//         this.rules = visitor.visitArray(this.rules);
//     }
// };
// Ruleset.prototype.eval = function (context) {
//     var that = this, selectors, selCnt, selector, i, hasVariable, hasOnePassingSelector = false;

//     if (this.selectors && (selCnt = this.selectors.length)) {
//         selectors = new Array(selCnt);
//         defaultFunc.error({
//             type: 'Syntax',
//             message: 'it is currently only allowed in parametric mixin guards,'
//         });

//         for (i = 0; i < selCnt; i++) {
//             selector = this.selectors[i].eval(context);
//             for (var j = 0; j < selector.elements.length; j++) {
//                 if (selector.elements[j].isVariable) {
//                     hasVariable = true;
//                     break;
//                 }
//             }
//             selectors[i] = selector;
//             if (selector.evaldCondition) {
//                 hasOnePassingSelector = true;
//             }
//         }

//         if (hasVariable) {
//             var toParseSelectors = new Array(selCnt);
//             for (i = 0; i < selCnt; i++) {
//                 selector = selectors[i];
//                 toParseSelectors[i] = selector.toCSS(context);
//             }
//             this.parse.parseNode(
//                 toParseSelectors.join(','),
//                 ["selectors"], 
//                 selectors[0].getIndex(), 
//                 selectors[0].fileInfo(), 
//                 function(err, result) {
//                     if (result) {
//                         selectors = utils.flattenArray(result);
//                     }
//                 });
//         }

//         defaultFunc.reset();
//     } else {
//         hasOnePassingSelector = true;
//     }
    
//     var rules = this.rules ? utils.copyArray(this.rules) : null,
//         ruleset = new Ruleset(selectors, rules, this.strictImports, this.visibilityInfo()),
//         rule, subRule;

//     ruleset.originalRuleset = this;
//     ruleset.root = this.root;
//     ruleset.firstRoot = this.firstRoot;
//     ruleset.allowImports = this.allowImports;

//     if (this.debugInfo) {
//         ruleset.debugInfo = this.debugInfo;
//     }

//     if (!hasOnePassingSelector) {
//         rules.length = 0;
//     }

//     // inherit a function registry from the frames stack when possible;
//     // otherwise from the global registry
//     ruleset.functionRegistry = (function (frames) {
//         var i = 0,
//             n = frames.length,
//             found;
//         for ( ; i !== n ; ++i ) {
//             found = frames[ i ].functionRegistry;
//             if ( found ) { return found; }
//         }
//         return globalFunctionRegistry;
//     }(context.frames)).inherit();

//     // push the current ruleset to the frames stack
//     var ctxFrames = context.frames;
//     ctxFrames.unshift(ruleset);

//     // currrent selectors
//     var ctxSelectors = context.selectors;
//     if (!ctxSelectors) {
//         context.selectors = ctxSelectors = [];
//     }
//     ctxSelectors.unshift(this.selectors);

//     // Evaluate imports
//     if (ruleset.root || ruleset.allowImports || !ruleset.strictImports) {
//         ruleset.evalImports(context);
//     }

//     // Store the frames around mixin definitions,
//     // so they can be evaluated like closures when the time comes.
//     var rsRules = ruleset.rules;
//     for (i = 0; (rule = rsRules[i]); i++) {
//         if (rule.evalFirst) {
//             rsRules[i] = rule.eval(context);
//         }
//     }

//     var mediaBlockCount = (context.mediaBlocks && context.mediaBlocks.length) || 0;

//     // Evaluate mixin calls.
//     for (i = 0; (rule = rsRules[i]); i++) {
//         if (rule.type === 'MixinCall') {
//             /* jshint loopfunc:true */
//             rules = rule.eval(context).filter(function(r) {
//                 if ((r instanceof Declaration) && r.variable) {
//                     // do not pollute the scope if the variable is
//                     // already there. consider returning false here
//                     // but we need a way to "return" variable from mixins
//                     return !(ruleset.variable(r.name));
//                 }
//                 return true;
//             });
//             rsRules.splice.apply(rsRules, [i, 1].concat(rules));
//             i += rules.length - 1;
//             ruleset.resetCache();
//         } else if (rule.type ===  'VariableCall') {
//             /* jshint loopfunc:true */
//             rules = rule.eval(context).rules.filter(function(r) {
//                 if ((r instanceof Declaration) && r.variable) {
//                     // do not pollute the scope at all
//                     return false;
//                 }
//                 return true;
//             });
//             rsRules.splice.apply(rsRules, [i, 1].concat(rules));
//             i += rules.length - 1;
//             ruleset.resetCache();
//         }
//     }

//     // Evaluate everything else
//     for (i = 0; (rule = rsRules[i]); i++) {
//         if (!rule.evalFirst) {
//             rsRules[i] = rule = rule.eval ? rule.eval(context) : rule;
//         }
//     }

//     // Evaluate everything else
//     for (i = 0; (rule = rsRules[i]); i++) {
//         // for rulesets, check if it is a css guard and can be removed
//         if (rule instanceof Ruleset && rule.selectors && rule.selectors.length === 1) {
//             // check if it can be folded in (e.g. & where)
//             if (rule.selectors[0] && rule.selectors[0].isJustParentSelector()) {
//                 rsRules.splice(i--, 1);

//                 for (var j = 0; (subRule = rule.rules[j]); j++) {
//                     if (subRule instanceof Node) {
//                         subRule.copyVisibilityInfo(rule.visibilityInfo());
//                         if (!(subRule instanceof Declaration) || !subRule.variable) {
//                             rsRules.splice(++i, 0, subRule);
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     // Pop the stack
//     ctxFrames.shift();
//     ctxSelectors.shift();

//     if (context.mediaBlocks) {
//         for (i = mediaBlockCount; i < context.mediaBlocks.length; i++) {
//             context.mediaBlocks[i].bubbleSelectors(selectors);
//         }
//     }

//     return ruleset;
// };
// Ruleset.prototype.evalImports = function(context) {
//     var rules = this.rules, i, importRules;
//     if (!rules) { return; }

//     for (i = 0; i < rules.length; i++) {
//         if (rules[i].type === 'Import') {
//             importRules = rules[i].eval(context);
//             if (importRules && (importRules.length || importRules.length === 0)) {
//                 rules.splice.apply(rules, [i, 1].concat(importRules));
//                 i += importRules.length - 1;
//             } else {
//                 rules.splice(i, 1, importRules);
//             }
//             this.resetCache();
//         }
//     }
// };
// Ruleset.prototype.makeImportant = function() {
//     var result = new Ruleset(this.selectors, this.rules.map(function (r) {
//         if (r.makeImportant) {
//             return r.makeImportant();
//         } else {
//             return r;
//         }
//     }), this.strictImports, this.visibilityInfo());

//     return result;
// };
// Ruleset.prototype.matchArgs = function (args) {
//     return !args || args.length === 0;
// };
// // lets you call a css selector with a guard
// Ruleset.prototype.matchCondition = function (args, context) {
//     var lastSelector = this.selectors[this.selectors.length - 1];
//     if (!lastSelector.evaldCondition) {
//         return false;
//     }
//     if (lastSelector.condition &&
//         !lastSelector.condition.eval(
//             new contexts.Eval(context,
//                 context.frames))) {
//         return false;
//     }
//     return true;
// };
// Ruleset.prototype.resetCache = function () {
//     this._rulesets = null;
//     this._variables = null;
//     this._properties = null;
//     this._lookups = {};
// };
// Ruleset.prototype.variables = function () {
//     if (!this._variables) {
//         this._variables = !this.rules ? {} : this.rules.reduce(function (hash, r) {
//             if (r instanceof Declaration && r.variable === true) {
//                 hash[r.name] = r;
//             }
//             // when evaluating variables in an import statement, imports have not been eval'd
//             // so we need to go inside import statements.
//             // guard against root being a string (in the case of inlined less)
//             if (r.type === 'Import' && r.root && r.root.variables) {
//                 var vars = r.root.variables();
//                 for (var name in vars) {
//                     if (vars.hasOwnProperty(name)) {
//                         hash[name] = r.root.variable(name);
//                     }
//                 }
//             }
//             return hash;
//         }, {});
//     }
//     return this._variables;
// };
// Ruleset.prototype.properties = function () {
//     if (!this._properties) {
//         this._properties = !this.rules ? {} : this.rules.reduce(function (hash, r) {
//             if (r instanceof Declaration && r.variable !== true) {
//                 var name = (r.name.length === 1) && (r.name[0] instanceof Keyword) ?
//                     r.name[0].value : r.name;
//                 // Properties don't overwrite as they can merge
//                 if (!hash['$' + name]) {
//                     hash['$' + name] = [ r ];
//                 }
//                 else {
//                     hash['$' + name].push(r);
//                 }
//             }
//             return hash;
//         }, {});
//     }
//     return this._properties;
// };
// Ruleset.prototype.variable = function (name) {
//     var decl = this.variables()[name];
//     if (decl) {
//         return this.parseValue(decl);
//     }
// };
// Ruleset.prototype.property = function (name) {
//     var decl = this.properties()[name];
//     if (decl) {
//         return this.parseValue(decl);
//     }
// };
// Ruleset.prototype.lastDeclaration = function () {
//     for (var i = this.rules.length; i > 0; i--) {
//         var decl = this.rules[i - 1];
//         if (decl instanceof Declaration) {
//             return this.parseValue(decl);
//         }
//     }
// };
// Ruleset.prototype.parseValue = function(toParse) {
//     var self = this;
//     function transformDeclaration(decl) {
//         if (decl.value instanceof Anonymous && !decl.parsed) {
//             if (typeof decl.value.value === 'string') {
//                 this.parse.parseNode(
//                     decl.value.value,
//                     ['value', 'important'], 
//                     decl.value.getIndex(), 
//                     decl.fileInfo(), 
//                     function(err, result) {
//                         if (err) {
//                             decl.parsed = true;
//                         }
//                         if (result) {
//                             decl.value = result[0];
//                             decl.important = result[1] || '';
//                             decl.parsed = true;
//                         }
//                     });
//             } else {
//                 decl.parsed = true;
//             }

//             return decl;
//         }
//         else {
//             return decl;
//         }
//     }
//     if (!Array.isArray(toParse)) {
//         return transformDeclaration.call(self, toParse);
//     }
//     else {
//         var nodes = [];
//         toParse.forEach(function(n) {
//             nodes.push(transformDeclaration.call(self, n));
//         });
//         return nodes;
//     }
// };
// Ruleset.prototype.rulesets = function () {
//     if (!this.rules) { return []; }

//     var filtRules = [], rules = this.rules,
//         i, rule;

//     for (i = 0; (rule = rules[i]); i++) {
//         if (rule.isRuleset) {
//             filtRules.push(rule);
//         }
//     }

//     return filtRules;
// };
// Ruleset.prototype.prependRule = function (rule) {
//     var rules = this.rules;
//     if (rules) {
//         rules.unshift(rule);
//     } else {
//         this.rules = [ rule ];
//     }
//     this.setParent(rule, this);
// };
// Ruleset.prototype.find = function (selector, self, filter) {
//     self = self || this;
//     var rules = [], match, foundMixins,
//         key = selector.toCSS();

//     if (key in this._lookups) { return this._lookups[key]; }

//     this.rulesets().forEach(function (rule) {
//         if (rule !== self) {
//             for (var j = 0; j < rule.selectors.length; j++) {
//                 match = selector.match(rule.selectors[j]);
//                 if (match) {
//                     if (selector.elements.length > match) {
//                         if (!filter || filter(rule)) {
//                             foundMixins = rule.find(new Selector(selector.elements.slice(match)), self, filter);
//                             for (var i = 0; i < foundMixins.length; ++i) {
//                                 foundMixins[i].path.push(rule);
//                             }
//                             Array.prototype.push.apply(rules, foundMixins);
//                         }
//                     } else {
//                         rules.push({ rule: rule, path: []});
//                     }
//                     break;
//                 }
//             }
//         }
//     });
//     this._lookups[key] = rules;
//     return rules;
// };
// Ruleset.prototype.genCSS = function (context, output) {
//     var i, j,
//         charsetRuleNodes = [],
//         ruleNodes = [],
//         debugInfo,     // Line number debugging
//         rule,
//         path;

//     context.tabLevel = (context.tabLevel || 0);

//     if (!this.root) {
//         context.tabLevel++;
//     }

//     var tabRuleStr = context.compress ? '' : Array(context.tabLevel + 1).join('  '),
//         tabSetStr = context.compress ? '' : Array(context.tabLevel).join('  '),
//         sep;

//     var charsetNodeIndex = 0;
//     var importNodeIndex = 0;
//     for (i = 0; (rule = this.rules[i]); i++) {
//         if (rule instanceof Comment) {
//             if (importNodeIndex === i) {
//                 importNodeIndex++;
//             }
//             ruleNodes.push(rule);
//         } else if (rule.isCharset && rule.isCharset()) {
//             ruleNodes.splice(charsetNodeIndex, 0, rule);
//             charsetNodeIndex++;
//             importNodeIndex++;
//         } else if (rule.type === 'Import') {
//             ruleNodes.splice(importNodeIndex, 0, rule);
//             importNodeIndex++;
//         } else {
//             ruleNodes.push(rule);
//         }
//     }
//     ruleNodes = charsetRuleNodes.concat(ruleNodes);

//     // If this is the root node, we don't render
//     // a selector, or {}.
//     if (!this.root) {
//         debugInfo = getDebugInfo(context, this, tabSetStr);

//         if (debugInfo) {
//             output.add(debugInfo);
//             output.add(tabSetStr);
//         }

//         var paths = this.paths, pathCnt = paths.length,
//             pathSubCnt;

//         sep = context.compress ? ',' : (',\n' + tabSetStr);

//         for (i = 0; i < pathCnt; i++) {
//             path = paths[i];
//             if (!(pathSubCnt = path.length)) { continue; }
//             if (i > 0) { output.add(sep); }

//             context.firstSelector = true;
//             path[0].genCSS(context, output);

//             context.firstSelector = false;
//             for (j = 1; j < pathSubCnt; j++) {
//                 path[j].genCSS(context, output);
//             }
//         }

//         output.add((context.compress ? '{' : ' {\n') + tabRuleStr);
//     }

//     // Compile rules and rulesets
//     for (i = 0; (rule = ruleNodes[i]); i++) {

//         if (i + 1 === ruleNodes.length) {
//             context.lastRule = true;
//         }

//         var currentLastRule = context.lastRule;
//         if (rule.isRulesetLike(rule)) {
//             context.lastRule = false;
//         }

//         if (rule.genCSS) {
//             rule.genCSS(context, output);
//         } else if (rule.value) {
//             output.add(rule.value.toString());
//         }

//         context.lastRule = currentLastRule;

//         if (!context.lastRule && rule.isVisible()) {
//             output.add(context.compress ? '' : ('\n' + tabRuleStr));
//         } else {
//             context.lastRule = false;
//         }
//     }

//     if (!this.root) {
//         output.add((context.compress ? '}' : '\n' + tabSetStr + '}'));
//         context.tabLevel--;
//     }

//     if (!output.isEmpty() && !context.compress && this.firstRoot) {
//         output.add('\n');
//     }
// };

// Ruleset.prototype.joinSelectors = function (paths, context, selectors) {
//     for (var s = 0; s < selectors.length; s++) {
//         this.joinSelector(paths, context, selectors[s]);
//     }
// };

// Ruleset.prototype.joinSelector = function (paths, context, selector) {

//     function createParenthesis(elementsToPak, originalElement) {
//         var replacementParen, j;
//         if (elementsToPak.length === 0) {
//             replacementParen = new Paren(elementsToPak[0]);
//         } else {
//             var insideParent = new Array(elementsToPak.length);
//             for (j = 0; j < elementsToPak.length; j++) {
//                 insideParent[j] = new Element(
//                     null,
//                     elementsToPak[j],
//                     originalElement.isVariable,
//                     originalElement._index,
//                     originalElement._fileInfo
//                 );
//             }
//             replacementParen = new Paren(new Selector(insideParent));
//         }
//         return replacementParen;
//     }

//     function createSelector(containedElement, originalElement) {
//         var element, selector;
//         element = new Element(null, containedElement, originalElement.isVariable, originalElement._index, originalElement._fileInfo);
//         selector = new Selector([element]);
//         return selector;
//     }

//     // joins selector path from `beginningPath` with selector path in `addPath`
//     // `replacedElement` contains element that is being replaced by `addPath`
//     // returns concatenated path
//     function addReplacementIntoPath(beginningPath, addPath, replacedElement, originalSelector) {
//         var newSelectorPath, lastSelector, newJoinedSelector;
//         // our new selector path
//         newSelectorPath = [];

//         // construct the joined selector - if & is the first thing this will be empty,
//         // if not newJoinedSelector will be the last set of elements in the selector
//         if (beginningPath.length > 0) {
//             newSelectorPath = utils.copyArray(beginningPath);
//             lastSelector = newSelectorPath.pop();
//             newJoinedSelector = originalSelector.createDerived(utils.copyArray(lastSelector.elements));
//         }
//         else {
//             newJoinedSelector = originalSelector.createDerived([]);
//         }

//         if (addPath.length > 0) {
//             // /deep/ is a CSS4 selector - (removed, so should deprecate)
//             // that is valid without anything in front of it
//             // so if the & does not have a combinator that is "" or " " then
//             // and there is a combinator on the parent, then grab that.
//             // this also allows + a { & .b { .a & { ... though not sure why you would want to do that
//             var combinator = replacedElement.combinator, parentEl = addPath[0].elements[0];
//             if (combinator.emptyOrWhitespace && !parentEl.combinator.emptyOrWhitespace) {
//                 combinator = parentEl.combinator;
//             }
//             // join the elements so far with the first part of the parent
//             newJoinedSelector.elements.push(new Element(
//                 combinator,
//                 parentEl.value,
//                 replacedElement.isVariable,
//                 replacedElement._index,
//                 replacedElement._fileInfo
//             ));
//             newJoinedSelector.elements = newJoinedSelector.elements.concat(addPath[0].elements.slice(1));
//         }

//         // now add the joined selector - but only if it is not empty
//         if (newJoinedSelector.elements.length !== 0) {
//             newSelectorPath.push(newJoinedSelector);
//         }

//         // put together the parent selectors after the join (e.g. the rest of the parent)
//         if (addPath.length > 1) {
//             var restOfPath = addPath.slice(1);
//             restOfPath = restOfPath.map(function (selector) {
//                 return selector.createDerived(selector.elements, []);
//             });
//             newSelectorPath = newSelectorPath.concat(restOfPath);
//         }
//         return newSelectorPath;
//     }

//     // joins selector path from `beginningPath` with every selector path in `addPaths` array
//     // `replacedElement` contains element that is being replaced by `addPath`
//     // returns array with all concatenated paths
//     function addAllReplacementsIntoPath( beginningPath, addPaths, replacedElement, originalSelector, result) {
//         var j;
//         for (j = 0; j < beginningPath.length; j++) {
//             var newSelectorPath = addReplacementIntoPath(beginningPath[j], addPaths, replacedElement, originalSelector);
//             result.push(newSelectorPath);
//         }
//         return result;
//     }

//     function mergeElementsOnToSelectors(elements, selectors) {
//         var i, sel;

//         if (elements.length === 0) {
//             return ;
//         }
//         if (selectors.length === 0) {
//             selectors.push([ new Selector(elements) ]);
//             return;
//         }

//         for (i = 0; (sel = selectors[i]); i++) {
//             // if the previous thing in sel is a parent this needs to join on to it
//             if (sel.length > 0) {
//                 sel[sel.length - 1] = sel[sel.length - 1].createDerived(sel[sel.length - 1].elements.concat(elements));
//             }
//             else {
//                 sel.push(new Selector(elements));
//             }
//         }
//     }

//     // replace all parent selectors inside `inSelector` by content of `context` array
//     // resulting selectors are returned inside `paths` array
//     // returns true if `inSelector` contained at least one parent selector
//     function replaceParentSelector(paths, context, inSelector) {
//         // The paths are [[Selector]]
//         // The first list is a list of comma separated selectors
//         // The inner list is a list of inheritance separated selectors
//         // e.g.
//         // .a, .b {
//         //   .c {
//         //   }
//         // }
//         // == [[.a] [.c]] [[.b] [.c]]
//         //
//         var i, j, k, currentElements, newSelectors, selectorsMultiplied, sel, el, hadParentSelector = false, length, lastSelector;
//         function findNestedSelector(element) {
//             var maybeSelector;
//             if (!(element.value instanceof Paren)) {
//                 return null;
//             }

//             maybeSelector = element.value.value;
//             if (!(maybeSelector instanceof Selector)) {
//                 return null;
//             }

//             return maybeSelector;
//         }

//         // the elements from the current selector so far
//         currentElements = [];
//         // the current list of new selectors to add to the path.
//         // We will build it up. We initiate it with one empty selector as we "multiply" the new selectors
//         // by the parents
//         newSelectors = [
//             []
//         ];

//         for (i = 0; (el = inSelector.elements[i]); i++) {
//             // non parent reference elements just get added
//             if (el.value !== '&') {
//                 var nestedSelector = findNestedSelector(el);
//                 if (nestedSelector != null) {
//                     // merge the current list of non parent selector elements
//                     // on to the current list of selectors to add
//                     mergeElementsOnToSelectors(currentElements, newSelectors);

//                     var nestedPaths = [], replaced, replacedNewSelectors = [];
//                     replaced = replaceParentSelector(nestedPaths, context, nestedSelector);
//                     hadParentSelector = hadParentSelector || replaced;
//                     // the nestedPaths array should have only one member - replaceParentSelector does not multiply selectors
//                     for (k = 0; k < nestedPaths.length; k++) {
//                         var replacementSelector = createSelector(createParenthesis(nestedPaths[k], el), el);
//                         addAllReplacementsIntoPath(newSelectors, [replacementSelector], el, inSelector, replacedNewSelectors);
//                     }
//                     newSelectors = replacedNewSelectors;
//                     currentElements = [];

//                 } else {
//                     currentElements.push(el);
//                 }

//             } else {
//                 hadParentSelector = true;
//                 // the new list of selectors to add
//                 selectorsMultiplied = [];

//                 // merge the current list of non parent selector elements
//                 // on to the current list of selectors to add
//                 mergeElementsOnToSelectors(currentElements, newSelectors);

//                 // loop through our current selectors
//                 for (j = 0; j < newSelectors.length; j++) {
//                     sel = newSelectors[j];
//                     // if we don't have any parent paths, the & might be in a mixin so that it can be used
//                     // whether there are parents or not
//                     if (context.length === 0) {
//                         // the combinator used on el should now be applied to the next element instead so that
//                         // it is not lost
//                         if (sel.length > 0) {
//                             sel[0].elements.push(new Element(el.combinator, '', el.isVariable, el._index, el._fileInfo));
//                         }
//                         selectorsMultiplied.push(sel);
//                     }
//                     else {
//                         // and the parent selectors
//                         for (k = 0; k < context.length; k++) {
//                             // We need to put the current selectors
//                             // then join the last selector's elements on to the parents selectors
//                             var newSelectorPath = addReplacementIntoPath(sel, context[k], el, inSelector);
//                             // add that to our new set of selectors
//                             selectorsMultiplied.push(newSelectorPath);
//                         }
//                     }
//                 }

//                 // our new selectors has been multiplied, so reset the state
//                 newSelectors = selectorsMultiplied;
//                 currentElements = [];
//             }
//         }

//         // if we have any elements left over (e.g. .a& .b == .b)
//         // add them on to all the current selectors
//         mergeElementsOnToSelectors(currentElements, newSelectors);

//         for (i = 0; i < newSelectors.length; i++) {
//             length = newSelectors[i].length;
//             if (length > 0) {
//                 paths.push(newSelectors[i]);
//                 lastSelector = newSelectors[i][length - 1];
//                 newSelectors[i][length - 1] = lastSelector.createDerived(lastSelector.elements, inSelector.extendList);
//             }
//         }

//         return hadParentSelector;
//     }

//     function deriveSelector(visibilityInfo, deriveFrom) {
//         var newSelector = deriveFrom.createDerived(deriveFrom.elements, deriveFrom.extendList, deriveFrom.evaldCondition);
//         newSelector.copyVisibilityInfo(visibilityInfo);
//         return newSelector;
//     }

//     // joinSelector code follows
//     var i, newPaths, hadParentSelector;

//     newPaths = [];
//     hadParentSelector = replaceParentSelector(newPaths, context, selector);

//     if (!hadParentSelector) {
//         if (context.length > 0) {
//             newPaths = [];
//             for (i = 0; i < context.length; i++) {

//                 var concatenated = context[i].map(deriveSelector.bind(this, selector.visibilityInfo()));

//                 concatenated.push(selector);
//                 newPaths.push(concatenated);
//             }
//         }
//         else {
//             newPaths = [[selector]];
//         }
//     }

//     for (i = 0; i < newPaths.length; i++) {
//         paths.push(newPaths[i]);
//     }

// };
// module.exports = Ruleset;

// },{"../contexts":13,"../functions/default":25,"../functions/function-registry":27,"../utils":89,"./anonymous":50,"./comment":57,"./debug-info":59,"./declaration":60,"./element":63,"./keyword":70,"./node":76,"./paren":78,"./selector":82}],82:[function(require,module,exports){
// var Node = require('./node'),
//     Element = require('./element'),
//     LessError = require('../less-error');

// var Selector = function (elements, extendList, condition, index, currentFileInfo, visibilityInfo) {
//     this.extendList = extendList;
//     this.condition = condition;
//     this.evaldCondition = !condition;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.elements = this.getElements(elements);
//     this.mixinElements_ = undefined;
//     this.copyVisibilityInfo(visibilityInfo);
//     this.setParent(this.elements, this);
// };
// Selector.prototype = new Node();
// Selector.prototype.type = 'Selector';
// Selector.prototype.accept = function (visitor) {
//     if (this.elements) {
//         this.elements = visitor.visitArray(this.elements);
//     }
//     if (this.extendList) {
//         this.extendList = visitor.visitArray(this.extendList);
//     }
//     if (this.condition) {
//         this.condition = visitor.visit(this.condition);
//     }
// };
// Selector.prototype.createDerived = function(elements, extendList, evaldCondition) {
//     elements = this.getElements(elements);
//     var newSelector = new Selector(elements, extendList || this.extendList,
//         null, this.getIndex(), this.fileInfo(), this.visibilityInfo());
//     newSelector.evaldCondition = (evaldCondition != null) ? evaldCondition : this.evaldCondition;
//     newSelector.mediaEmpty = this.mediaEmpty;
//     return newSelector;
// };
// Selector.prototype.getElements = function(els) {
//     if (!els) {
//         return [new Element('', '&', false, this._index, this._fileInfo)];
//     }
//     if (typeof els === 'string') {
//         this.parse.parseNode(
//             els, 
//             ['selector'],
//             this._index, 
//             this._fileInfo, 
//             function(err, result) {
//                 if (err) {
//                     throw new LessError({
//                         index: err.index,
//                         message: err.message
//                     }, this.parse.imports, this._fileInfo.filename);
//                 }
//                 els = result[0].elements;
//             });
//     }
//     return els;
// };
// Selector.prototype.createEmptySelectors = function() {
//     var el = new Element('', '&', false, this._index, this._fileInfo),
//         sels = [new Selector([el], null, null, this._index, this._fileInfo)];
//     sels[0].mediaEmpty = true;
//     return sels;
// };
// Selector.prototype.match = function (other) {
//     var elements = this.elements,
//         len = elements.length,
//         olen, i;

//     other = other.mixinElements();
//     olen = other.length;
//     if (olen === 0 || len < olen) {
//         return 0;
//     } else {
//         for (i = 0; i < olen; i++) {
//             if (elements[i].value !== other[i]) {
//                 return 0;
//             }
//         }
//     }

//     return olen; // return number of matched elements
// };
// Selector.prototype.mixinElements = function() {
//     if (this.mixinElements_) {
//         return this.mixinElements_;
//     }

//     var elements = this.elements.map( function(v) {
//         return v.combinator.value + (v.value.value || v.value);
//     }).join('').match(/[,&#\*\.\w-]([\w-]|(\\.))*/g);

//     if (elements) {
//         if (elements[0] === '&') {
//             elements.shift();
//         }
//     } else {
//         elements = [];
//     }

//     return (this.mixinElements_ = elements);
// };
// Selector.prototype.isJustParentSelector = function() {
//     return !this.mediaEmpty &&
//         this.elements.length === 1 &&
//         this.elements[0].value === '&' &&
//         (this.elements[0].combinator.value === ' ' || this.elements[0].combinator.value === '');
// };
// Selector.prototype.eval = function (context) {
//     var evaldCondition = this.condition && this.condition.eval(context),
//         elements = this.elements, extendList = this.extendList;

//     elements = elements && elements.map(function (e) { return e.eval(context); });
//     extendList = extendList && extendList.map(function(extend) { return extend.eval(context); });

//     return this.createDerived(elements, extendList, evaldCondition);
// };
// Selector.prototype.genCSS = function (context, output) {
//     var i, element;
//     if ((!context || !context.firstSelector) && this.elements[0].combinator.value === '') {
//         output.add(' ', this.fileInfo(), this.getIndex());
//     }
//     for (i = 0; i < this.elements.length; i++) {
//         element = this.elements[i];
//         element.genCSS(context, output);
//     }
// };
// Selector.prototype.getIsOutput = function() {
//     return this.evaldCondition;
// };
// module.exports = Selector;

// },{"../less-error":38,"./element":63,"./node":76}],83:[function(require,module,exports){
// var Node = require('./node');

// var UnicodeDescriptor = function (value) {
//     this.value = value;
// };
// UnicodeDescriptor.prototype = new Node();
// UnicodeDescriptor.prototype.type = 'UnicodeDescriptor';

// module.exports = UnicodeDescriptor;

// },{"./node":76}],84:[function(require,module,exports){
// var Node = require('./node'),
//     unitConversions = require('../data/unit-conversions'),
//     utils = require('../utils');

// var Unit = function (numerator, denominator, backupUnit) {
//     this.numerator = numerator ? utils.copyArray(numerator).sort() : [];
//     this.denominator = denominator ? utils.copyArray(denominator).sort() : [];
//     if (backupUnit) {
//         this.backupUnit = backupUnit;
//     } else if (numerator && numerator.length) {
//         this.backupUnit = numerator[0];
//     }
// };

// Unit.prototype = new Node();
// Unit.prototype.type = 'Unit';
// Unit.prototype.clone = function () {
//     return new Unit(utils.copyArray(this.numerator), utils.copyArray(this.denominator), this.backupUnit);
// };
// Unit.prototype.genCSS = function (context, output) {
//     // Dimension checks the unit is singular and throws an error if in strict math mode.
//     var strictUnits = context && context.strictUnits;
//     if (this.numerator.length === 1) {
//         output.add(this.numerator[0]); // the ideal situation
//     } else if (!strictUnits && this.backupUnit) {
//         output.add(this.backupUnit);
//     } else if (!strictUnits && this.denominator.length) {
//         output.add(this.denominator[0]);
//     }
// };
// Unit.prototype.toString = function () {
//     var i, returnStr = this.numerator.join('*');
//     for (i = 0; i < this.denominator.length; i++) {
//         returnStr += '/' + this.denominator[i];
//     }
//     return returnStr;
// };
// Unit.prototype.compare = function (other) {
//     return this.is(other.toString()) ? 0 : undefined;
// };
// Unit.prototype.is = function (unitString) {
//     return this.toString().toUpperCase() === unitString.toUpperCase();
// };
// Unit.prototype.isLength = function () {
//     return RegExp('^(px|em|ex|ch|rem|in|cm|mm|pc|pt|ex|vw|vh|vmin|vmax)$', 'gi').test(this.toCSS());
// };
// Unit.prototype.isEmpty = function () {
//     return this.numerator.length === 0 && this.denominator.length === 0;
// };
// Unit.prototype.isSingular = function() {
//     return this.numerator.length <= 1 && this.denominator.length === 0;
// };
// Unit.prototype.map = function(callback) {
//     var i;

//     for (i = 0; i < this.numerator.length; i++) {
//         this.numerator[i] = callback(this.numerator[i], false);
//     }

//     for (i = 0; i < this.denominator.length; i++) {
//         this.denominator[i] = callback(this.denominator[i], true);
//     }
// };
// Unit.prototype.usedUnits = function() {
//     var group, result = {}, mapUnit, groupName;

//     mapUnit = function (atomicUnit) {
//         /* jshint loopfunc:true */
//         if (group.hasOwnProperty(atomicUnit) && !result[groupName]) {
//             result[groupName] = atomicUnit;
//         }

//         return atomicUnit;
//     };

//     for (groupName in unitConversions) {
//         if (unitConversions.hasOwnProperty(groupName)) {
//             group = unitConversions[groupName];

//             this.map(mapUnit);
//         }
//     }

//     return result;
// };
// Unit.prototype.cancel = function () {
//     var counter = {}, atomicUnit, i;

//     for (i = 0; i < this.numerator.length; i++) {
//         atomicUnit = this.numerator[i];
//         counter[atomicUnit] = (counter[atomicUnit] || 0) + 1;
//     }

//     for (i = 0; i < this.denominator.length; i++) {
//         atomicUnit = this.denominator[i];
//         counter[atomicUnit] = (counter[atomicUnit] || 0) - 1;
//     }

//     this.numerator = [];
//     this.denominator = [];

//     for (atomicUnit in counter) {
//         if (counter.hasOwnProperty(atomicUnit)) {
//             var count = counter[atomicUnit];

//             if (count > 0) {
//                 for (i = 0; i < count; i++) {
//                     this.numerator.push(atomicUnit);
//                 }
//             } else if (count < 0) {
//                 for (i = 0; i < -count; i++) {
//                     this.denominator.push(atomicUnit);
//                 }
//             }
//         }
//     }

//     this.numerator.sort();
//     this.denominator.sort();
// };
// module.exports = Unit;

// },{"../data/unit-conversions":16,"../utils":89,"./node":76}],85:[function(require,module,exports){
// var Node = require('./node');

// var URL = function (val, index, currentFileInfo, isEvald) {
//     this.value = val;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.isEvald = isEvald;
// };
// URL.prototype = new Node();
// URL.prototype.type = 'Url';
// URL.prototype.accept = function (visitor) {
//     this.value = visitor.visit(this.value);
// };
// URL.prototype.genCSS = function (context, output) {
//     output.add('url(');
//     this.value.genCSS(context, output);
//     output.add(')');
// };
// URL.prototype.eval = function (context) {
//     var val = this.value.eval(context),
//         rootpath;

//     if (!this.isEvald) {
//         // Add the rootpath if the URL requires a rewrite
//         rootpath = this.fileInfo() && this.fileInfo().rootpath;
//         if (typeof rootpath === 'string' &&
//             typeof val.value === 'string' &&
//             context.pathRequiresRewrite(val.value)) {
//             if (!val.quote) {
//                 rootpath = escapePath(rootpath);
//             }
//             val.value = context.rewritePath(val.value, rootpath);
//         } else {
//             val.value = context.normalizePath(val.value);
//         }

//         // Add url args if enabled
//         if (context.urlArgs) {
//             if (!val.value.match(/^\s*data:/)) {
//                 var delimiter = val.value.indexOf('?') === -1 ? '?' : '&';
//                 var urlArgs = delimiter + context.urlArgs;
//                 if (val.value.indexOf('#') !== -1) {
//                     val.value = val.value.replace('#', urlArgs + '#');
//                 } else {
//                     val.value += urlArgs;
//                 }
//             }
//         }
//     }

//     return new URL(val, this.getIndex(), this.fileInfo(), true);
// };

// function escapePath(path) {
//     return path.replace(/[\(\)'"\s]/g, function(match) { return '\\' + match; });
// }

// module.exports = URL;

// },{"./node":76}],86:[function(require,module,exports){
// var Node = require('./node');

// var Value = function (value) {
//     if (!value) {
//         throw new Error('Value requires an array argument');
//     }
//     if (!Array.isArray(value)) {
//         this.value = [ value ];
//     }
//     else {
//         this.value = value;
//     }
// };
// Value.prototype = new Node();
// Value.prototype.type = 'Value';
// Value.prototype.accept = function (visitor) {
//     if (this.value) {
//         this.value = visitor.visitArray(this.value);
//     }
// };
// Value.prototype.eval = function (context) {
//     if (this.value.length === 1) {
//         return this.value[0].eval(context);
//     } else {
//         return new Value(this.value.map(function (v) {
//             return v.eval(context);
//         }));
//     }
// };
// Value.prototype.genCSS = function (context, output) {
//     var i;
//     for (i = 0; i < this.value.length; i++) {
//         this.value[i].genCSS(context, output);
//         if (i + 1 < this.value.length) {
//             output.add((context && context.compress) ? ',' : ', ');
//         }
//     }
// };
// module.exports = Value;

// },{"./node":76}],87:[function(require,module,exports){
// var Node = require('./node'),
//     Variable = require('./variable'),
//     Ruleset = require('./ruleset'),
//     DetachedRuleset = require('./detached-ruleset'),
//     LessError = require('../less-error');

// var VariableCall = function (variable, index, currentFileInfo) {
//     this.variable = variable;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
//     this.allowRoot = true;
// };
// VariableCall.prototype = new Node();
// VariableCall.prototype.type = 'VariableCall';
// VariableCall.prototype.eval = function (context) {
//     var rules, detachedRuleset = new Variable(this.variable, this.getIndex(), this.fileInfo()).eval(context),
//         error = new LessError({message: 'Could not evaluate variable call ' + this.variable});

//     if (!detachedRuleset.ruleset) {
//         if (Array.isArray(detachedRuleset)) {
//             rules = detachedRuleset;
//         }
//         else if (Array.isArray(detachedRuleset.value)) {
//             rules = detachedRuleset.value;
//         }
//         else {
//             throw error;
//         }
//         detachedRuleset = new DetachedRuleset(new Ruleset('', rules));
//     }
//     if (detachedRuleset.ruleset) {
//         return detachedRuleset.callEval(context);
//     }
//     throw error;
// };
// module.exports = VariableCall;

// },{"../less-error":38,"./detached-ruleset":61,"./node":76,"./ruleset":81,"./variable":88}],88:[function(require,module,exports){
// var Node = require('./node'),
//     Call = require('./call');

// var Variable = function (name, index, currentFileInfo) {
//     this.name = name;
//     this._index = index;
//     this._fileInfo = currentFileInfo;
// };
// Variable.prototype = new Node();
// Variable.prototype.type = 'Variable';
// Variable.prototype.eval = function (context) {
//     var variable, name = this.name;

//     if (name.indexOf('@@') === 0) {
//         name = '@' + new Variable(name.slice(1), this.getIndex(), this.fileInfo()).eval(context).value;
//     }

//     if (this.evaluating) {
//         throw { type: 'Name',
//             message: 'Recursive variable definition for ' + name,
//             filename: this.fileInfo().filename,
//             index: this.getIndex() };
//     }

//     this.evaluating = true;

//     variable = this.find(context.frames, function (frame) {
//         var v = frame.variable(name);
//         if (v) {
//             if (v.important) {
//                 var importantScope = context.importantScope[context.importantScope.length - 1];
//                 importantScope.important = v.important;
//             }
//             // If in calc, wrap vars in a function call to cascade evaluate args first
//             if (context.inCalc) {
//                 return (new Call('_SELF', [v.value])).eval(context);
//             }
//             else {
//                 return v.value.eval(context);
//             }
//         }
//     });
//     if (variable) {
//         this.evaluating = false;
//         return variable;
//     } else {
//         throw { type: 'Name',
//             message: 'variable ' + name + ' is undefined',
//             filename: this.fileInfo().filename,
//             index: this.getIndex() };
//     }
// };
// Variable.prototype.find = function (obj, fun) {
//     for (var i = 0, r; i < obj.length; i++) {
//         r = fun.call(obj, obj[i]);
//         if (r) { return r; }
//     }
//     return null;
// };
// module.exports = Variable;

// },{"./call":54,"./node":76}],89:[function(require,module,exports){
// /* jshint proto: true */
// var Constants = require('./constants');
// var clone = require('clone');

// var utils = {
//     getLocation: function(index, inputStream) {
//         var n = index + 1,
//             line = null,
//             column = -1;

//         while (--n >= 0 && inputStream.charAt(n) !== '\n') {
//             column++;
//         }

//         if (typeof index === 'number') {
//             line = (inputStream.slice(0, index).match(/\n/g) || '').length;
//         }

//         return {
//             line: line,
//             column: column
//         };
//     },
//     copyArray: function(arr) {
//         var i, length = arr.length,
//             copy = new Array(length);
        
//         for (i = 0; i < length; i++) {
//             copy[i] = arr[i];
//         }
//         return copy;
//     },
//     clone: function (obj) {
//         var cloned = {};
//         for (var prop in obj) {
//             if (obj.hasOwnProperty(prop)) {
//                 cloned[prop] = obj[prop];
//             }
//         }
//         return cloned;
//     },
//     copyOptions: function(obj1, obj2) {
//         if (obj2 && obj2._defaults) {
//             return obj2;
//         }
//         var opts = utils.defaults(obj1, obj2);
//         if (opts.strictMath) {
//             opts.math = Constants.Math.STRICT_LEGACY;
//         }
//         // Back compat with changed relativeUrls option
//         if (opts.relativeUrls) {
//             opts.rewriteUrls = Constants.RewriteUrls.ALL;
//         }
//         if (typeof opts.math === 'string') {
//             switch (opts.math.toLowerCase()) {
//                 case 'always':
//                     opts.math = Constants.Math.ALWAYS;
//                     break;
//                 case 'parens-division':
//                     opts.math = Constants.Math.PARENS_DIVISION;
//                     break;
//                 case 'strict':
//                 case 'parens':
//                     opts.math = Constants.Math.PARENS;
//                     break;
//                 case 'strict-legacy':
//                     opts.math = Constants.Math.STRICT_LEGACY;
//             }
//         }
//         if (typeof opts.rewriteUrls === 'string') {
//             switch (opts.rewriteUrls.toLowerCase()) {
//                 case 'off':
//                     opts.rewriteUrls = Constants.RewriteUrls.OFF;
//                     break;
//                 case 'local':
//                     opts.rewriteUrls = Constants.RewriteUrls.LOCAL;
//                     break;
//                 case 'all':
//                     opts.rewriteUrls = Constants.RewriteUrls.ALL;
//                     break;
//             }
//         }
//         return opts;
//     },
//     defaults: function(obj1, obj2) {
//         var newObj = obj2 || {};
//         if (!obj2._defaults) {
//             newObj = {};
//             var defaults = clone(obj1);
//             newObj._defaults = defaults;
//             var cloned = obj2 ? clone(obj2) : {};
//             Object.assign(newObj, defaults, cloned);
//         }
//         return newObj;
//     },
//     merge: function(obj1, obj2) {
//         for (var prop in obj2) {
//             if (obj2.hasOwnProperty(prop)) {
//                 obj1[prop] = obj2[prop];
//             }
//         }
//         return obj1;
//     },
//     flattenArray: function(arr, result) {
//         result = result || [];
//         for (var i = 0, length = arr.length; i < length; i++) {
//             var value = arr[i];
//             if (Array.isArray(value)) {
//                 utils.flattenArray(value, result);
//             } else {
//                 if (value !== undefined) {
//                     result.push(value);
//                 }
//             }
//         }
//         return result;
//     }
// };

// module.exports = utils;
// },{"./constants":12,"clone":102}],90:[function(require,module,exports){
// var tree = require('../tree'),
//     Visitor = require('./visitor'),
//     logger = require('../logger'),
//     utils = require('../utils');

// /* jshint loopfunc:true */

// var ExtendFinderVisitor = function() {
//     this._visitor = new Visitor(this);
//     this.contexts = [];
//     this.allExtendsStack = [[]];
// };

// ExtendFinderVisitor.prototype = {
//     run: function (root) {
//         root = this._visitor.visit(root);
//         root.allExtends = this.allExtendsStack[0];
//         return root;
//     },
//     visitDeclaration: function (declNode, visitArgs) {
//         visitArgs.visitDeeper = false;
//     },
//     visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
//         visitArgs.visitDeeper = false;
//     },
//     visitRuleset: function (rulesetNode, visitArgs) {
//         if (rulesetNode.root) {
//             return;
//         }

//         var i, j, extend, allSelectorsExtendList = [], extendList;

//         // get &:extend(.a); rules which apply to all selectors in this ruleset
//         var rules = rulesetNode.rules, ruleCnt = rules ? rules.length : 0;
//         for (i = 0; i < ruleCnt; i++) {
//             if (rulesetNode.rules[i] instanceof tree.Extend) {
//                 allSelectorsExtendList.push(rules[i]);
//                 rulesetNode.extendOnEveryPath = true;
//             }
//         }

//         // now find every selector and apply the extends that apply to all extends
//         // and the ones which apply to an individual extend
//         var paths = rulesetNode.paths;
//         for (i = 0; i < paths.length; i++) {
//             var selectorPath = paths[i],
//                 selector = selectorPath[selectorPath.length - 1],
//                 selExtendList = selector.extendList;

//             extendList = selExtendList ? utils.copyArray(selExtendList).concat(allSelectorsExtendList)
//                                        : allSelectorsExtendList;

//             if (extendList) {
//                 extendList = extendList.map(function(allSelectorsExtend) {
//                     return allSelectorsExtend.clone();
//                 });
//             }

//             for (j = 0; j < extendList.length; j++) {
//                 this.foundExtends = true;
//                 extend = extendList[j];
//                 extend.findSelfSelectors(selectorPath);
//                 extend.ruleset = rulesetNode;
//                 if (j === 0) { extend.firstExtendOnThisSelectorPath = true; }
//                 this.allExtendsStack[this.allExtendsStack.length - 1].push(extend);
//             }
//         }

//         this.contexts.push(rulesetNode.selectors);
//     },
//     visitRulesetOut: function (rulesetNode) {
//         if (!rulesetNode.root) {
//             this.contexts.length = this.contexts.length - 1;
//         }
//     },
//     visitMedia: function (mediaNode, visitArgs) {
//         mediaNode.allExtends = [];
//         this.allExtendsStack.push(mediaNode.allExtends);
//     },
//     visitMediaOut: function (mediaNode) {
//         this.allExtendsStack.length = this.allExtendsStack.length - 1;
//     },
//     visitAtRule: function (atRuleNode, visitArgs) {
//         atRuleNode.allExtends = [];
//         this.allExtendsStack.push(atRuleNode.allExtends);
//     },
//     visitAtRuleOut: function (atRuleNode) {
//         this.allExtendsStack.length = this.allExtendsStack.length - 1;
//     }
// };

// var ProcessExtendsVisitor = function() {
//     this._visitor = new Visitor(this);
// };

// ProcessExtendsVisitor.prototype = {
//     run: function(root) {
//         var extendFinder = new ExtendFinderVisitor();
//         this.extendIndices = {};
//         extendFinder.run(root);
//         if (!extendFinder.foundExtends) { return root; }
//         root.allExtends = root.allExtends.concat(this.doExtendChaining(root.allExtends, root.allExtends));
//         this.allExtendsStack = [root.allExtends];
//         var newRoot = this._visitor.visit(root);
//         this.checkExtendsForNonMatched(root.allExtends);
//         return newRoot;
//     },
//     checkExtendsForNonMatched: function(extendList) {
//         var indices = this.extendIndices;
//         extendList.filter(function(extend) {
//             return !extend.hasFoundMatches && extend.parent_ids.length == 1;
//         }).forEach(function(extend) {
//             var selector = '_unknown_';
//             try {
//                 selector = extend.selector.toCSS({});
//             }
//             catch (_) {}

//             if (!indices[extend.index + ' ' + selector]) {
//                 indices[extend.index + ' ' + selector] = true;
//                 logger.warn('extend \'' + selector + '\' has no matches');
//             }
//         });
//     },
//     doExtendChaining: function (extendsList, extendsListTarget, iterationCount) {
//         //
//         // chaining is different from normal extension.. if we extend an extend then we are not just copying, altering
//         // and pasting the selector we would do normally, but we are also adding an extend with the same target selector
//         // this means this new extend can then go and alter other extends
//         //
//         // this method deals with all the chaining work - without it, extend is flat and doesn't work on other extend selectors
//         // this is also the most expensive.. and a match on one selector can cause an extension of a selector we had already
//         // processed if we look at each selector at a time, as is done in visitRuleset

//         var extendIndex, targetExtendIndex, matches, extendsToAdd = [], newSelector, extendVisitor = this, selectorPath,
//             extend, targetExtend, newExtend;

//         iterationCount = iterationCount || 0;

//         // loop through comparing every extend with every target extend.
//         // a target extend is the one on the ruleset we are looking at copy/edit/pasting in place
//         // e.g.  .a:extend(.b) {}  and .b:extend(.c) {} then the first extend extends the second one
//         // and the second is the target.
//         // the separation into two lists allows us to process a subset of chains with a bigger set, as is the
//         // case when processing media queries
//         for (extendIndex = 0; extendIndex < extendsList.length; extendIndex++) {
//             for (targetExtendIndex = 0; targetExtendIndex < extendsListTarget.length; targetExtendIndex++) {

//                 extend = extendsList[extendIndex];
//                 targetExtend = extendsListTarget[targetExtendIndex];

//                 // look for circular references
//                 if ( extend.parent_ids.indexOf( targetExtend.object_id ) >= 0 ) { continue; }

//                 // find a match in the target extends self selector (the bit before :extend)
//                 selectorPath = [targetExtend.selfSelectors[0]];
//                 matches = extendVisitor.findMatch(extend, selectorPath);

//                 if (matches.length) {
//                     extend.hasFoundMatches = true;

//                     // we found a match, so for each self selector..
//                     extend.selfSelectors.forEach(function(selfSelector) {
//                         var info = targetExtend.visibilityInfo();

//                         // process the extend as usual
//                         newSelector = extendVisitor.extendSelector(matches, selectorPath, selfSelector, extend.isVisible());

//                         // but now we create a new extend from it
//                         newExtend = new(tree.Extend)(targetExtend.selector, targetExtend.option, 0, targetExtend.fileInfo(), info);
//                         newExtend.selfSelectors = newSelector;

//                         // add the extend onto the list of extends for that selector
//                         newSelector[newSelector.length - 1].extendList = [newExtend];

//                         // record that we need to add it.
//                         extendsToAdd.push(newExtend);
//                         newExtend.ruleset = targetExtend.ruleset;

//                         // remember its parents for circular references
//                         newExtend.parent_ids = newExtend.parent_ids.concat(targetExtend.parent_ids, extend.parent_ids);

//                         // only process the selector once.. if we have :extend(.a,.b) then multiple
//                         // extends will look at the same selector path, so when extending
//                         // we know that any others will be duplicates in terms of what is added to the css
//                         if (targetExtend.firstExtendOnThisSelectorPath) {
//                             newExtend.firstExtendOnThisSelectorPath = true;
//                             targetExtend.ruleset.paths.push(newSelector);
//                         }
//                     });
//                 }
//             }
//         }

//         if (extendsToAdd.length) {
//             // try to detect circular references to stop a stack overflow.
//             // may no longer be needed.
//             this.extendChainCount++;
//             if (iterationCount > 100) {
//                 var selectorOne = '{unable to calculate}';
//                 var selectorTwo = '{unable to calculate}';
//                 try {
//                     selectorOne = extendsToAdd[0].selfSelectors[0].toCSS();
//                     selectorTwo = extendsToAdd[0].selector.toCSS();
//                 }
//                 catch (e) {}
//                 throw { message: 'extend circular reference detected. One of the circular extends is currently:' +
//                     selectorOne + ':extend(' + selectorTwo + ')'};
//             }

//             // now process the new extends on the existing rules so that we can handle a extending b extending c extending
//             // d extending e...
//             return extendsToAdd.concat(extendVisitor.doExtendChaining(extendsToAdd, extendsListTarget, iterationCount + 1));
//         } else {
//             return extendsToAdd;
//         }
//     },
//     visitDeclaration: function (ruleNode, visitArgs) {
//         visitArgs.visitDeeper = false;
//     },
//     visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
//         visitArgs.visitDeeper = false;
//     },
//     visitSelector: function (selectorNode, visitArgs) {
//         visitArgs.visitDeeper = false;
//     },
//     visitRuleset: function (rulesetNode, visitArgs) {
//         if (rulesetNode.root) {
//             return;
//         }
//         var matches, pathIndex, extendIndex, allExtends = this.allExtendsStack[this.allExtendsStack.length - 1],
//             selectorsToAdd = [], extendVisitor = this, selectorPath;

//         // look at each selector path in the ruleset, find any extend matches and then copy, find and replace

//         for (extendIndex = 0; extendIndex < allExtends.length; extendIndex++) {
//             for (pathIndex = 0; pathIndex < rulesetNode.paths.length; pathIndex++) {
//                 selectorPath = rulesetNode.paths[pathIndex];

//                 // extending extends happens initially, before the main pass
//                 if (rulesetNode.extendOnEveryPath) { continue; }
//                 var extendList = selectorPath[selectorPath.length - 1].extendList;
//                 if (extendList && extendList.length) { continue; }

//                 matches = this.findMatch(allExtends[extendIndex], selectorPath);

//                 if (matches.length) {
//                     allExtends[extendIndex].hasFoundMatches = true;

//                     allExtends[extendIndex].selfSelectors.forEach(function(selfSelector) {
//                         var extendedSelectors;
//                         extendedSelectors = extendVisitor.extendSelector(matches, selectorPath, selfSelector, allExtends[extendIndex].isVisible());
//                         selectorsToAdd.push(extendedSelectors);
//                     });
//                 }
//             }
//         }
//         rulesetNode.paths = rulesetNode.paths.concat(selectorsToAdd);
//     },
//     findMatch: function (extend, haystackSelectorPath) {
//         //
//         // look through the haystack selector path to try and find the needle - extend.selector
//         // returns an array of selector matches that can then be replaced
//         //
//         var haystackSelectorIndex, hackstackSelector, hackstackElementIndex, haystackElement,
//             targetCombinator, i,
//             extendVisitor = this,
//             needleElements = extend.selector.elements,
//             potentialMatches = [], potentialMatch, matches = [];

//         // loop through the haystack elements
//         for (haystackSelectorIndex = 0; haystackSelectorIndex < haystackSelectorPath.length; haystackSelectorIndex++) {
//             hackstackSelector = haystackSelectorPath[haystackSelectorIndex];

//             for (hackstackElementIndex = 0; hackstackElementIndex < hackstackSelector.elements.length; hackstackElementIndex++) {

//                 haystackElement = hackstackSelector.elements[hackstackElementIndex];

//                 // if we allow elements before our match we can add a potential match every time. otherwise only at the first element.
//                 if (extend.allowBefore || (haystackSelectorIndex === 0 && hackstackElementIndex === 0)) {
//                     potentialMatches.push({pathIndex: haystackSelectorIndex, index: hackstackElementIndex, matched: 0,
//                         initialCombinator: haystackElement.combinator});
//                 }

//                 for (i = 0; i < potentialMatches.length; i++) {
//                     potentialMatch = potentialMatches[i];

//                     // selectors add " " onto the first element. When we use & it joins the selectors together, but if we don't
//                     // then each selector in haystackSelectorPath has a space before it added in the toCSS phase. so we need to
//                     // work out what the resulting combinator will be
//                     targetCombinator = haystackElement.combinator.value;
//                     if (targetCombinator === '' && hackstackElementIndex === 0) {
//                         targetCombinator = ' ';
//                     }

//                     // if we don't match, null our match to indicate failure
//                     if (!extendVisitor.isElementValuesEqual(needleElements[potentialMatch.matched].value, haystackElement.value) ||
//                         (potentialMatch.matched > 0 && needleElements[potentialMatch.matched].combinator.value !== targetCombinator)) {
//                         potentialMatch = null;
//                     } else {
//                         potentialMatch.matched++;
//                     }

//                     // if we are still valid and have finished, test whether we have elements after and whether these are allowed
//                     if (potentialMatch) {
//                         potentialMatch.finished = potentialMatch.matched === needleElements.length;
//                         if (potentialMatch.finished &&
//                             (!extend.allowAfter &&
//                                 (hackstackElementIndex + 1 < hackstackSelector.elements.length || haystackSelectorIndex + 1 < haystackSelectorPath.length))) {
//                             potentialMatch = null;
//                         }
//                     }
//                     // if null we remove, if not, we are still valid, so either push as a valid match or continue
//                     if (potentialMatch) {
//                         if (potentialMatch.finished) {
//                             potentialMatch.length = needleElements.length;
//                             potentialMatch.endPathIndex = haystackSelectorIndex;
//                             potentialMatch.endPathElementIndex = hackstackElementIndex + 1; // index after end of match
//                             potentialMatches.length = 0; // we don't allow matches to overlap, so start matching again
//                             matches.push(potentialMatch);
//                         }
//                     } else {
//                         potentialMatches.splice(i, 1);
//                         i--;
//                     }
//                 }
//             }
//         }
//         return matches;
//     },
//     isElementValuesEqual: function(elementValue1, elementValue2) {
//         if (typeof elementValue1 === 'string' || typeof elementValue2 === 'string') {
//             return elementValue1 === elementValue2;
//         }
//         if (elementValue1 instanceof tree.Attribute) {
//             if (elementValue1.op !== elementValue2.op || elementValue1.key !== elementValue2.key) {
//                 return false;
//             }
//             if (!elementValue1.value || !elementValue2.value) {
//                 if (elementValue1.value || elementValue2.value) {
//                     return false;
//                 }
//                 return true;
//             }
//             elementValue1 = elementValue1.value.value || elementValue1.value;
//             elementValue2 = elementValue2.value.value || elementValue2.value;
//             return elementValue1 === elementValue2;
//         }
//         elementValue1 = elementValue1.value;
//         elementValue2 = elementValue2.value;
//         if (elementValue1 instanceof tree.Selector) {
//             if (!(elementValue2 instanceof tree.Selector) || elementValue1.elements.length !== elementValue2.elements.length) {
//                 return false;
//             }
//             for (var i = 0; i  < elementValue1.elements.length; i++) {
//                 if (elementValue1.elements[i].combinator.value !== elementValue2.elements[i].combinator.value) {
//                     if (i !== 0 || (elementValue1.elements[i].combinator.value || ' ') !== (elementValue2.elements[i].combinator.value || ' ')) {
//                         return false;
//                     }
//                 }
//                 if (!this.isElementValuesEqual(elementValue1.elements[i].value, elementValue2.elements[i].value)) {
//                     return false;
//                 }
//             }
//             return true;
//         }
//         return false;
//     },
//     extendSelector:function (matches, selectorPath, replacementSelector, isVisible) {

//         // for a set of matches, replace each match with the replacement selector

//         var currentSelectorPathIndex = 0,
//             currentSelectorPathElementIndex = 0,
//             path = [],
//             matchIndex,
//             selector,
//             firstElement,
//             match,
//             newElements;

//         for (matchIndex = 0; matchIndex < matches.length; matchIndex++) {
//             match = matches[matchIndex];
//             selector = selectorPath[match.pathIndex];
//             firstElement = new tree.Element(
//                 match.initialCombinator,
//                 replacementSelector.elements[0].value,
//                 replacementSelector.elements[0].isVariable,
//                 replacementSelector.elements[0].getIndex(),
//                 replacementSelector.elements[0].fileInfo()
//             );

//             if (match.pathIndex > currentSelectorPathIndex && currentSelectorPathElementIndex > 0) {
//                 path[path.length - 1].elements = path[path.length - 1]
//                     .elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
//                 currentSelectorPathElementIndex = 0;
//                 currentSelectorPathIndex++;
//             }

//             newElements = selector.elements
//                 .slice(currentSelectorPathElementIndex, match.index)
//                 .concat([firstElement])
//                 .concat(replacementSelector.elements.slice(1));

//             if (currentSelectorPathIndex === match.pathIndex && matchIndex > 0) {
//                 path[path.length - 1].elements =
//                     path[path.length - 1].elements.concat(newElements);
//             } else {
//                 path = path.concat(selectorPath.slice(currentSelectorPathIndex, match.pathIndex));

//                 path.push(new tree.Selector(
//                     newElements
//                 ));
//             }
//             currentSelectorPathIndex = match.endPathIndex;
//             currentSelectorPathElementIndex = match.endPathElementIndex;
//             if (currentSelectorPathElementIndex >= selectorPath[currentSelectorPathIndex].elements.length) {
//                 currentSelectorPathElementIndex = 0;
//                 currentSelectorPathIndex++;
//             }
//         }

//         if (currentSelectorPathIndex < selectorPath.length && currentSelectorPathElementIndex > 0) {
//             path[path.length - 1].elements = path[path.length - 1]
//                 .elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
//             currentSelectorPathIndex++;
//         }

//         path = path.concat(selectorPath.slice(currentSelectorPathIndex, selectorPath.length));
//         path = path.map(function (currentValue) {
//             // we can re-use elements here, because the visibility property matters only for selectors
//             var derived = currentValue.createDerived(currentValue.elements);
//             if (isVisible) {
//                 derived.ensureVisibility();
//             } else {
//                 derived.ensureInvisibility();
//             }
//             return derived;
//         });
//         return path;
//     },
//     visitMedia: function (mediaNode, visitArgs) {
//         var newAllExtends = mediaNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
//         newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, mediaNode.allExtends));
//         this.allExtendsStack.push(newAllExtends);
//     },
//     visitMediaOut: function (mediaNode) {
//         var lastIndex = this.allExtendsStack.length - 1;
//         this.allExtendsStack.length = lastIndex;
//     },
//     visitAtRule: function (atRuleNode, visitArgs) {
//         var newAllExtends = atRuleNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
//         newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, atRuleNode.allExtends));
//         this.allExtendsStack.push(newAllExtends);
//     },
//     visitAtRuleOut: function (atRuleNode) {
//         var lastIndex = this.allExtendsStack.length - 1;
//         this.allExtendsStack.length = lastIndex;
//     }
// };

// module.exports = ProcessExtendsVisitor;

// },{"../logger":39,"../tree":67,"../utils":89,"./visitor":97}],91:[function(require,module,exports){
// function ImportSequencer(onSequencerEmpty) {
//     this.imports = [];
//     this.variableImports = [];
//     this._onSequencerEmpty = onSequencerEmpty;
//     this._currentDepth = 0;
// }

// ImportSequencer.prototype.addImport = function(callback) {
//     var importSequencer = this,
//         importItem = {
//             callback: callback,
//             args: null,
//             isReady: false
//         };
//     this.imports.push(importItem);
//     return function() {
//         importItem.args = Array.prototype.slice.call(arguments, 0);
//         importItem.isReady = true;
//         importSequencer.tryRun();
//     };
// };

// ImportSequencer.prototype.addVariableImport = function(callback) {
//     this.variableImports.push(callback);
// };

// ImportSequencer.prototype.tryRun = function() {
//     this._currentDepth++;
//     try {
//         while (true) {
//             while (this.imports.length > 0) {
//                 var importItem = this.imports[0];
//                 if (!importItem.isReady) {
//                     return;
//                 }
//                 this.imports = this.imports.slice(1);
//                 importItem.callback.apply(null, importItem.args);
//             }
//             if (this.variableImports.length === 0) {
//                 break;
//             }
//             var variableImport = this.variableImports[0];
//             this.variableImports = this.variableImports.slice(1);
//             variableImport();
//         }
//     } finally {
//         this._currentDepth--;
//     }
//     if (this._currentDepth === 0 && this._onSequencerEmpty) {
//         this._onSequencerEmpty();
//     }
// };

// module.exports = ImportSequencer;

// },{}],92:[function(require,module,exports){
// var contexts = require('../contexts'),
//     Visitor = require('./visitor'),
//     ImportSequencer = require('./import-sequencer'),
//     utils = require('../utils');

// var ImportVisitor = function(importer, finish) {

//     this._visitor = new Visitor(this);
//     this._importer = importer;
//     this._finish = finish;
//     this.context = new contexts.Eval();
//     this.importCount = 0;
//     this.onceFileDetectionMap = {};
//     this.recursionDetector = {};
//     this._sequencer = new ImportSequencer(this._onSequencerEmpty.bind(this));
// };

// ImportVisitor.prototype = {
//     isReplacing: false,
//     run: function (root) {
//         try {
//             // process the contents
//             this._visitor.visit(root);
//         }
//         catch (e) {
//             this.error = e;
//         }

//         this.isFinished = true;
//         this._sequencer.tryRun();
//     },
//     _onSequencerEmpty: function() {
//         if (!this.isFinished) {
//             return;
//         }
//         this._finish(this.error);
//     },
//     visitImport: function (importNode, visitArgs) {
//         var inlineCSS = importNode.options.inline;

//         if (!importNode.css || inlineCSS) {

//             var context = new contexts.Eval(this.context, utils.copyArray(this.context.frames));
//             var importParent = context.frames[0];

//             this.importCount++;
//             if (importNode.isVariableImport()) {
//                 this._sequencer.addVariableImport(this.processImportNode.bind(this, importNode, context, importParent));
//             } else {
//                 this.processImportNode(importNode, context, importParent);
//             }
//         }
//         visitArgs.visitDeeper = false;
//     },
//     processImportNode: function(importNode, context, importParent) {
//         var evaldImportNode,
//             inlineCSS = importNode.options.inline;

//         try {
//             evaldImportNode = importNode.evalForImport(context);
//         } catch (e) {
//             if (!e.filename) { e.index = importNode.getIndex(); e.filename = importNode.fileInfo().filename; }
//             // attempt to eval properly and treat as css
//             importNode.css = true;
//             // if that fails, this error will be thrown
//             importNode.error = e;
//         }

//         if (evaldImportNode && (!evaldImportNode.css || inlineCSS)) {

//             if (evaldImportNode.options.multiple) {
//                 context.importMultiple = true;
//             }

//             // try appending if we haven't determined if it is css or not
//             var tryAppendLessExtension = evaldImportNode.css === undefined;

//             for (var i = 0; i < importParent.rules.length; i++) {
//                 if (importParent.rules[i] === importNode) {
//                     importParent.rules[i] = evaldImportNode;
//                     break;
//                 }
//             }

//             var onImported = this.onImported.bind(this, evaldImportNode, context),
//                 sequencedOnImported = this._sequencer.addImport(onImported);

//             this._importer.push(evaldImportNode.getPath(), tryAppendLessExtension, evaldImportNode.fileInfo(),
//                 evaldImportNode.options, sequencedOnImported);
//         } else {
//             this.importCount--;
//             if (this.isFinished) {
//                 this._sequencer.tryRun();
//             }
//         }
//     },
//     onImported: function (importNode, context, e, root, importedAtRoot, fullPath) {
//         if (e) {
//             if (!e.filename) {
//                 e.index = importNode.getIndex(); e.filename = importNode.fileInfo().filename;
//             }
//             this.error = e;
//         }

//         var importVisitor = this,
//             inlineCSS = importNode.options.inline,
//             isPlugin = importNode.options.isPlugin,
//             isOptional = importNode.options.optional,
//             duplicateImport = importedAtRoot || fullPath in importVisitor.recursionDetector;

//         if (!context.importMultiple) {
//             if (duplicateImport) {
//                 importNode.skip = true;
//             } else {
//                 importNode.skip = function() {
//                     if (fullPath in importVisitor.onceFileDetectionMap) {
//                         return true;
//                     }
//                     importVisitor.onceFileDetectionMap[fullPath] = true;
//                     return false;
//                 };
//             }
//         }

//         if (!fullPath && isOptional) {
//             importNode.skip = true;
//         }

//         if (root) {
//             importNode.root = root;
//             importNode.importedFilename = fullPath;

//             if (!inlineCSS && !isPlugin && (context.importMultiple || !duplicateImport)) {
//                 importVisitor.recursionDetector[fullPath] = true;

//                 var oldContext = this.context;
//                 this.context = context;
//                 try {
//                     this._visitor.visit(root);
//                 } catch (e) {
//                     this.error = e;
//                 }
//                 this.context = oldContext;
//             }
//         }

//         importVisitor.importCount--;

//         if (importVisitor.isFinished) {
//             importVisitor._sequencer.tryRun();
//         }
//     },
//     visitDeclaration: function (declNode, visitArgs) {
//         if (declNode.value.type === 'DetachedRuleset') {
//             this.context.frames.unshift(declNode);
//         } else {
//             visitArgs.visitDeeper = false;
//         }
//     },
//     visitDeclarationOut: function(declNode) {
//         if (declNode.value.type === 'DetachedRuleset') {
//             this.context.frames.shift();
//         }
//     },
//     visitAtRule: function (atRuleNode, visitArgs) {
//         this.context.frames.unshift(atRuleNode);
//     },
//     visitAtRuleOut: function (atRuleNode) {
//         this.context.frames.shift();
//     },
//     visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
//         this.context.frames.unshift(mixinDefinitionNode);
//     },
//     visitMixinDefinitionOut: function (mixinDefinitionNode) {
//         this.context.frames.shift();
//     },
//     visitRuleset: function (rulesetNode, visitArgs) {
//         this.context.frames.unshift(rulesetNode);
//     },
//     visitRulesetOut: function (rulesetNode) {
//         this.context.frames.shift();
//     },
//     visitMedia: function (mediaNode, visitArgs) {
//         this.context.frames.unshift(mediaNode.rules[0]);
//     },
//     visitMediaOut: function (mediaNode) {
//         this.context.frames.shift();
//     }
// };
// module.exports = ImportVisitor;

// },{"../contexts":13,"../utils":89,"./import-sequencer":91,"./visitor":97}],93:[function(require,module,exports){
// var visitors = {
//     Visitor: require('./visitor'),
//     ImportVisitor: require('./import-visitor'),
//     MarkVisibleSelectorsVisitor: require('./set-tree-visibility-visitor'),
//     ExtendVisitor: require('./extend-visitor'),
//     JoinSelectorVisitor: require('./join-selector-visitor'),
//     ToCSSVisitor: require('./to-css-visitor')
// };

// module.exports = visitors;

// },{"./extend-visitor":90,"./import-visitor":92,"./join-selector-visitor":94,"./set-tree-visibility-visitor":95,"./to-css-visitor":96,"./visitor":97}],94:[function(require,module,exports){
// var Visitor = require('./visitor');

// var JoinSelectorVisitor = function() {
//     this.contexts = [[]];
//     this._visitor = new Visitor(this);
// };

// JoinSelectorVisitor.prototype = {
//     run: function (root) {
//         return this._visitor.visit(root);
//     },
//     visitDeclaration: function (declNode, visitArgs) {
//         visitArgs.visitDeeper = false;
//     },
//     visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
//         visitArgs.visitDeeper = false;
//     },

//     visitRuleset: function (rulesetNode, visitArgs) {
//         var context = this.contexts[this.contexts.length - 1],
//             paths = [], selectors;

//         this.contexts.push(paths);

//         if (!rulesetNode.root) {
//             selectors = rulesetNode.selectors;
//             if (selectors) {
//                 selectors = selectors.filter(function(selector) { return selector.getIsOutput(); });
//                 rulesetNode.selectors = selectors.length ? selectors : (selectors = null);
//                 if (selectors) { rulesetNode.joinSelectors(paths, context, selectors); }
//             }
//             if (!selectors) { rulesetNode.rules = null; }
//             rulesetNode.paths = paths;
//         }
//     },
//     visitRulesetOut: function (rulesetNode) {
//         this.contexts.length = this.contexts.length - 1;
//     },
//     visitMedia: function (mediaNode, visitArgs) {
//         var context = this.contexts[this.contexts.length - 1];
//         mediaNode.rules[0].root = (context.length === 0 || context[0].multiMedia);
//     },
//     visitAtRule: function (atRuleNode, visitArgs) {
//         var context = this.contexts[this.contexts.length - 1];
//         if (atRuleNode.rules && atRuleNode.rules.length) {
//             atRuleNode.rules[0].root = (atRuleNode.isRooted || context.length === 0 || null);
//         }
//     }
// };

// module.exports = JoinSelectorVisitor;

// },{"./visitor":97}],95:[function(require,module,exports){
// var SetTreeVisibilityVisitor = function(visible) {
//     this.visible = visible;
// };
// SetTreeVisibilityVisitor.prototype.run = function(root) {
//     this.visit(root);
// };
// SetTreeVisibilityVisitor.prototype.visitArray = function(nodes) {
//     if (!nodes) {
//         return nodes;
//     }

//     var cnt = nodes.length, i;
//     for (i = 0; i < cnt; i++) {
//         this.visit(nodes[i]);
//     }
//     return nodes;
// };
// SetTreeVisibilityVisitor.prototype.visit = function(node) {
//     if (!node) {
//         return node;
//     }
//     if (node.constructor === Array) {
//         return this.visitArray(node);
//     }

//     if (!node.blocksVisibility || node.blocksVisibility()) {
//         return node;
//     }
//     if (this.visible) {
//         node.ensureVisibility();
//     } else {
//         node.ensureInvisibility();
//     }

//     node.accept(this);
//     return node;
// };
// module.exports = SetTreeVisibilityVisitor;
// },{}],96:[function(require,module,exports){
// var tree = require('../tree'),
//     Visitor = require('./visitor');

// var CSSVisitorUtils = function(context) {
//     this._visitor = new Visitor(this);
//     this._context = context;
// };

// CSSVisitorUtils.prototype = {
//     containsSilentNonBlockedChild: function(bodyRules) {
//         var rule;
//         if (!bodyRules) {
//             return false;
//         }
//         for (var r = 0; r < bodyRules.length; r++) {
//             rule = bodyRules[r];
//             if (rule.isSilent && rule.isSilent(this._context) && !rule.blocksVisibility()) {
//                 // the atrule contains something that was referenced (likely by extend)
//                 // therefore it needs to be shown in output too
//                 return true;
//             }
//         }
//         return false;
//     },

//     keepOnlyVisibleChilds: function(owner) {
//         if (owner && owner.rules) {
//             owner.rules = owner.rules.filter(function(thing) {
//                 return thing.isVisible();
//             });
//         }
//     },

//     isEmpty: function(owner) {
//         return (owner && owner.rules) 
//             ? (owner.rules.length === 0) : true;
//     },

//     hasVisibleSelector: function(rulesetNode) {
//         return (rulesetNode && rulesetNode.paths)
//             ? (rulesetNode.paths.length > 0) : false;
//     },

//     resolveVisibility: function (node, originalRules) {
//         if (!node.blocksVisibility()) {
//             if (this.isEmpty(node) && !this.containsSilentNonBlockedChild(originalRules)) {
//                 return ;
//             }

//             return node;
//         }

//         var compiledRulesBody = node.rules[0];
//         this.keepOnlyVisibleChilds(compiledRulesBody);

//         if (this.isEmpty(compiledRulesBody)) {
//             return ;
//         }

//         node.ensureVisibility();
//         node.removeVisibilityBlock();

//         return node;
//     },

//     isVisibleRuleset: function(rulesetNode) {
//         if (rulesetNode.firstRoot) {
//             return true;
//         }

//         if (this.isEmpty(rulesetNode)) {
//             return false;
//         }

//         if (!rulesetNode.root && !this.hasVisibleSelector(rulesetNode)) {
//             return false;
//         }

//         return true;
//     }

// };

// var ToCSSVisitor = function(context) {
//     this._visitor = new Visitor(this);
//     this._context = context;
//     this.utils = new CSSVisitorUtils(context);
// };

// ToCSSVisitor.prototype = {
//     isReplacing: true,
//     run: function (root) {
//         return this._visitor.visit(root);
//     },

//     visitDeclaration: function (declNode, visitArgs) {
//         if (declNode.blocksVisibility() || declNode.variable) {
//             return;
//         }
//         return declNode;
//     },

//     visitMixinDefinition: function (mixinNode, visitArgs) {
//         // mixin definitions do not get eval'd - this means they keep state
//         // so we have to clear that state here so it isn't used if toCSS is called twice
//         mixinNode.frames = [];
//     },

//     visitExtend: function (extendNode, visitArgs) {
//     },

//     visitComment: function (commentNode, visitArgs) {
//         if (commentNode.blocksVisibility() || commentNode.isSilent(this._context)) {
//             return;
//         }
//         return commentNode;
//     },

//     visitMedia: function(mediaNode, visitArgs) {
//         var originalRules = mediaNode.rules[0].rules;
//         mediaNode.accept(this._visitor);
//         visitArgs.visitDeeper = false;

//         return this.utils.resolveVisibility(mediaNode, originalRules);
//     },

//     visitImport: function (importNode, visitArgs) {
//         if (importNode.blocksVisibility()) {
//             return ;
//         }
//         return importNode;
//     },

//     visitAtRule: function(atRuleNode, visitArgs) {
//         if (atRuleNode.rules && atRuleNode.rules.length) {
//             return this.visitAtRuleWithBody(atRuleNode, visitArgs);
//         } else {
//             return this.visitAtRuleWithoutBody(atRuleNode, visitArgs);
//         }
//     },

//     visitAnonymous: function(anonymousNode, visitArgs) {
//         if (!anonymousNode.blocksVisibility()) {
//             anonymousNode.accept(this._visitor);
//             return anonymousNode;
//         }
//     },

//     visitAtRuleWithBody: function(atRuleNode, visitArgs) {
//         // if there is only one nested ruleset and that one has no path, then it is
//         // just fake ruleset
//         function hasFakeRuleset(atRuleNode) {
//             var bodyRules = atRuleNode.rules;
//             return bodyRules.length === 1 && (!bodyRules[0].paths || bodyRules[0].paths.length === 0);
//         }
//         function getBodyRules(atRuleNode) {
//             var nodeRules = atRuleNode.rules;
//             if (hasFakeRuleset(atRuleNode)) {
//                 return nodeRules[0].rules;
//             }

//             return nodeRules;
//         }
//         // it is still true that it is only one ruleset in array
//         // this is last such moment
//         // process childs
//         var originalRules = getBodyRules(atRuleNode);
//         atRuleNode.accept(this._visitor);
//         visitArgs.visitDeeper = false;

//         if (!this.utils.isEmpty(atRuleNode)) {
//             this._mergeRules(atRuleNode.rules[0].rules);
//         }

//         return this.utils.resolveVisibility(atRuleNode, originalRules);
//     },

//     visitAtRuleWithoutBody: function(atRuleNode, visitArgs) {
//         if (atRuleNode.blocksVisibility()) {
//             return;
//         }

//         if (atRuleNode.name === '@charset') {
//             // Only output the debug info together with subsequent @charset definitions
//             // a comment (or @media statement) before the actual @charset atrule would
//             // be considered illegal css as it has to be on the first line
//             if (this.charset) {
//                 if (atRuleNode.debugInfo) {
//                     var comment = new tree.Comment('/* ' + atRuleNode.toCSS(this._context).replace(/\n/g, '') + ' */\n');
//                     comment.debugInfo = atRuleNode.debugInfo;
//                     return this._visitor.visit(comment);
//                 }
//                 return;
//             }
//             this.charset = true;
//         }

//         return atRuleNode;
//     },

//     checkValidNodes: function(rules, isRoot) {
//         if (!rules) {
//             return;
//         }

//         for (var i = 0; i < rules.length; i++) {
//             var ruleNode = rules[i];
//             if (isRoot && ruleNode instanceof tree.Declaration && !ruleNode.variable) {
//                 throw { message: 'Properties must be inside selector blocks. They cannot be in the root',
//                     index: ruleNode.getIndex(), filename: ruleNode.fileInfo() && ruleNode.fileInfo().filename};
//             }
//             if (ruleNode instanceof tree.Call) {
//                 throw { message: 'Function \'' + ruleNode.name + '\' is undefined',
//                     index: ruleNode.getIndex(), filename: ruleNode.fileInfo() && ruleNode.fileInfo().filename};
//             }
//             if (ruleNode.type && !ruleNode.allowRoot) {
//                 throw { message: ruleNode.type + ' node returned by a function is not valid here',
//                     index: ruleNode.getIndex(), filename: ruleNode.fileInfo() && ruleNode.fileInfo().filename};
//             }
//         }
//     },

//     visitRuleset: function (rulesetNode, visitArgs) {
//         // at this point rulesets are nested into each other
//         var rule, rulesets = [];

//         this.checkValidNodes(rulesetNode.rules, rulesetNode.firstRoot);

//         if (!rulesetNode.root) {
//             // remove invisible paths
//             this._compileRulesetPaths(rulesetNode);

//             // remove rulesets from this ruleset body and compile them separately
//             var nodeRules = rulesetNode.rules, nodeRuleCnt = nodeRules ? nodeRules.length : 0;
//             for (var i = 0; i < nodeRuleCnt; ) {
//                 rule = nodeRules[i];
//                 if (rule && rule.rules) {
//                     // visit because we are moving them out from being a child
//                     rulesets.push(this._visitor.visit(rule));
//                     nodeRules.splice(i, 1);
//                     nodeRuleCnt--;
//                     continue;
//                 }
//                 i++;
//             }
//             // accept the visitor to remove rules and refactor itself
//             // then we can decide nogw whether we want it or not
//             // compile body
//             if (nodeRuleCnt > 0) {
//                 rulesetNode.accept(this._visitor);
//             } else {
//                 rulesetNode.rules = null;
//             }
//             visitArgs.visitDeeper = false;

//         } else { // if (! rulesetNode.root) {
//             rulesetNode.accept(this._visitor);
//             visitArgs.visitDeeper = false;
//         }

//         if (rulesetNode.rules) {
//             this._mergeRules(rulesetNode.rules);
//             this._removeDuplicateRules(rulesetNode.rules);
//         }

//         // now decide whether we keep the ruleset
//         if (this.utils.isVisibleRuleset(rulesetNode)) {
//             rulesetNode.ensureVisibility();
//             rulesets.splice(0, 0, rulesetNode);
//         }

//         if (rulesets.length === 1) {
//             return rulesets[0];
//         }
//         return rulesets;
//     },

//     _compileRulesetPaths: function(rulesetNode) {
//         if (rulesetNode.paths) {
//             rulesetNode.paths = rulesetNode.paths
//                 .filter(function(p) {
//                     var i;
//                     if (p[0].elements[0].combinator.value === ' ') {
//                         p[0].elements[0].combinator = new(tree.Combinator)('');
//                     }
//                     for (i = 0; i < p.length; i++) {
//                         if (p[i].isVisible() && p[i].getIsOutput()) {
//                             return true;
//                         }
//                     }
//                     return false;
//                 });
//         }
//     },

//     _removeDuplicateRules: function(rules) {
//         if (!rules) { return; }

//         // remove duplicates
//         var ruleCache = {},
//             ruleList, rule, i;

//         for (i = rules.length - 1; i >= 0 ; i--) {
//             rule = rules[i];
//             if (rule instanceof tree.Declaration) {
//                 if (!ruleCache[rule.name]) {
//                     ruleCache[rule.name] = rule;
//                 } else {
//                     ruleList = ruleCache[rule.name];
//                     if (ruleList instanceof tree.Declaration) {
//                         ruleList = ruleCache[rule.name] = [ruleCache[rule.name].toCSS(this._context)];
//                     }
//                     var ruleCSS = rule.toCSS(this._context);
//                     if (ruleList.indexOf(ruleCSS) !== -1) {
//                         rules.splice(i, 1);
//                     } else {
//                         ruleList.push(ruleCSS);
//                     }
//                 }
//             }
//         }
//     },

//     _mergeRules: function(rules) {
//         if (!rules) {
//             return; 
//         }

//         var groups    = {},
//             groupsArr = [];
        
//         for (var i = 0; i < rules.length; i++) {
//             var rule = rules[i];
//             if (rule.merge) {
//                 var key = rule.name;
//                 groups[key] ? rules.splice(i--, 1) : 
//                     groupsArr.push(groups[key] = []);
//                 groups[key].push(rule);
//             }
//         }

//         groupsArr.forEach(function(group) {
//             if (group.length > 0) {
//                 var result = group[0],
//                     space  = [],
//                     comma  = [new tree.Expression(space)];
//                 group.forEach(function(rule) {
//                     if ((rule.merge === '+') && (space.length > 0)) {
//                         comma.push(new tree.Expression(space = []));
//                     }
//                     space.push(rule.value);
//                     result.important = result.important || rule.important;
//                 });
//                 result.value = new tree.Value(comma);
//             }
//         });
//     }
// };

// module.exports = ToCSSVisitor;

// },{"../tree":67,"./visitor":97}],97:[function(require,module,exports){
// var tree = require('../tree');

// var _visitArgs = { visitDeeper: true },
//     _hasIndexed = false;

// function _noop(node) {
//     return node;
// }

// function indexNodeTypes(parent, ticker) {
//     // add .typeIndex to tree node types for lookup table
//     var key, child;
//     for (key in parent) { 
//         /* eslint guard-for-in: 0 */
//         child = parent[key];
//         switch (typeof child) {
//             case 'function':
//                 // ignore bound functions directly on tree which do not have a prototype
//                 // or aren't nodes
//                 if (child.prototype && child.prototype.type) {
//                     child.prototype.typeIndex = ticker++;
//                 }
//                 break;
//             case 'object':
//                 ticker = indexNodeTypes(child, ticker);
//                 break;
        
//         }
//     }
//     return ticker;
// }

// var Visitor = function(implementation) {
//     this._implementation = implementation;
//     this._visitInCache = {};
//     this._visitOutCache = {};

//     if (!_hasIndexed) {
//         indexNodeTypes(tree, 1);
//         _hasIndexed = true;
//     }
// };

// Visitor.prototype = {
//     visit: function(node) {
//         if (!node) {
//             return node;
//         }

//         var nodeTypeIndex = node.typeIndex;
//         if (!nodeTypeIndex) {
//             // MixinCall args aren't a node type?
//             if (node.value && node.value.typeIndex) {
//                 this.visit(node.value);
//             }
//             return node;
//         }

//         var impl = this._implementation,
//             func = this._visitInCache[nodeTypeIndex],
//             funcOut = this._visitOutCache[nodeTypeIndex],
//             visitArgs = _visitArgs,
//             fnName;

//         visitArgs.visitDeeper = true;

//         if (!func) {
//             fnName = 'visit' + node.type;
//             func = impl[fnName] || _noop;
//             funcOut = impl[fnName + 'Out'] || _noop;
//             this._visitInCache[nodeTypeIndex] = func;
//             this._visitOutCache[nodeTypeIndex] = funcOut;
//         }

//         if (func !== _noop) {
//             var newNode = func.call(impl, node, visitArgs);
//             if (node && impl.isReplacing) {
//                 node = newNode;
//             }
//         }

//         if (visitArgs.visitDeeper && node && node.accept) {
//             node.accept(this);
//         }

//         if (funcOut != _noop) {
//             funcOut.call(impl, node);
//         }

//         return node;
//     },
//     visitArray: function(nodes, nonReplacing) {
//         if (!nodes) {
//             return nodes;
//         }

//         var cnt = nodes.length, i;

//         // Non-replacing
//         if (nonReplacing || !this._implementation.isReplacing) {
//             for (i = 0; i < cnt; i++) {
//                 this.visit(nodes[i]);
//             }
//             return nodes;
//         }

//         // Replacing
//         var out = [];
//         for (i = 0; i < cnt; i++) {
//             var evald = this.visit(nodes[i]);
//             if (evald === undefined) { continue; }
//             if (!evald.splice) {
//                 out.push(evald);
//             } else if (evald.length) {
//                 this.flatten(evald, out);
//             }
//         }
//         return out;
//     },
//     flatten: function(arr, out) {
//         if (!out) {
//             out = [];
//         }

//         var cnt, i, item,
//             nestedCnt, j, nestedItem;

//         for (i = 0, cnt = arr.length; i < cnt; i++) {
//             item = arr[i];
//             if (item === undefined) {
//                 continue;
//             }
//             if (!item.splice) {
//                 out.push(item);
//                 continue;
//             }

//             for (j = 0, nestedCnt = item.length; j < nestedCnt; j++) {
//                 nestedItem = item[j];
//                 if (nestedItem === undefined) {
//                     continue;
//                 }
//                 if (!nestedItem.splice) {
//                     out.push(nestedItem);
//                 } else if (nestedItem.length) {
//                     this.flatten(nestedItem, out);
//                 }
//             }
//         }

//         return out;
//     }
// };
// module.exports = Visitor;

// },{"../tree":67}],98:[function(require,module,exports){
// "use strict";

// // rawAsap provides everything we need except exception management.
// var rawAsap = require("./raw");
// // RawTasks are recycled to reduce GC churn.
// var freeTasks = [];
// // We queue errors to ensure they are thrown in right order (FIFO).
// // Array-as-queue is good enough here, since we are just dealing with exceptions.
// var pendingErrors = [];
// var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

// function throwFirstError() {
//     if (pendingErrors.length) {
//         throw pendingErrors.shift();
//     }
// }

// /**
//  * Calls a task as soon as possible after returning, in its own event, with priority
//  * over other events like animation, reflow, and repaint. An error thrown from an
//  * event will not interrupt, nor even substantially slow down the processing of
//  * other events, but will be rather postponed to a lower priority event.
//  * @param {{call}} task A callable object, typically a function that takes no
//  * arguments.
//  */
// module.exports = asap;
// function asap(task) {
//     var rawTask;
//     if (freeTasks.length) {
//         rawTask = freeTasks.pop();
//     } else {
//         rawTask = new RawTask();
//     }
//     rawTask.task = task;
//     rawAsap(rawTask);
// }

// // We wrap tasks with recyclable task objects.  A task object implements
// // `call`, just like a function.
// function RawTask() {
//     this.task = null;
// }

// // The sole purpose of wrapping the task is to catch the exception and recycle
// // the task object after its single use.
// RawTask.prototype.call = function () {
//     try {
//         this.task.call();
//     } catch (error) {
//         if (asap.onerror) {
//             // This hook exists purely for testing purposes.
//             // Its name will be periodically randomized to break any code that
//             // depends on its existence.
//             asap.onerror(error);
//         } else {
//             // In a web browser, exceptions are not fatal. However, to avoid
//             // slowing down the queue of pending tasks, we rethrow the error in a
//             // lower priority turn.
//             pendingErrors.push(error);
//             requestErrorThrow();
//         }
//     } finally {
//         this.task = null;
//         freeTasks[freeTasks.length] = this;
//     }
// };

// },{"./raw":99}],99:[function(require,module,exports){
// (function (global){
// "use strict";

// // Use the fastest means possible to execute a task in its own turn, with
// // priority over other events including IO, animation, reflow, and redraw
// // events in browsers.
// //
// // An exception thrown by a task will permanently interrupt the processing of
// // subsequent tasks. The higher level `asap` function ensures that if an
// // exception is thrown by a task, that the task queue will continue flushing as
// // soon as possible, but if you use `rawAsap` directly, you are responsible to
// // either ensure that no exceptions are thrown from your task, or to manually
// // call `rawAsap.requestFlush` if an exception is thrown.
// module.exports = rawAsap;
// function rawAsap(task) {
//     if (!queue.length) {
//         requestFlush();
//         flushing = true;
//     }
//     // Equivalent to push, but avoids a function call.
//     queue[queue.length] = task;
// }

// var queue = [];
// // Once a flush has been requested, no further calls to `requestFlush` are
// // necessary until the next `flush` completes.
// var flushing = false;
// // `requestFlush` is an implementation-specific method that attempts to kick
// // off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// // the event queue before yielding to the browser's own event loop.
// var requestFlush;
// // The position of the next task to execute in the task queue. This is
// // preserved between calls to `flush` so that it can be resumed if
// // a task throws an exception.
// var index = 0;
// // If a task schedules additional tasks recursively, the task queue can grow
// // unbounded. To prevent memory exhaustion, the task queue will periodically
// // truncate already-completed tasks.
// var capacity = 1024;

// // The flush function processes all tasks that have been scheduled with
// // `rawAsap` unless and until one of those tasks throws an exception.
// // If a task throws an exception, `flush` ensures that its state will remain
// // consistent and will resume where it left off when called again.
// // However, `flush` does not make any arrangements to be called again if an
// // exception is thrown.
// function flush() {
//     while (index < queue.length) {
//         var currentIndex = index;
//         // Advance the index before calling the task. This ensures that we will
//         // begin flushing on the next task the task throws an error.
//         index = index + 1;
//         queue[currentIndex].call();
//         // Prevent leaking memory for long chains of recursive calls to `asap`.
//         // If we call `asap` within tasks scheduled by `asap`, the queue will
//         // grow, but to avoid an O(n) walk for every task we execute, we don't
//         // shift tasks off the queue after they have been executed.
//         // Instead, we periodically shift 1024 tasks off the queue.
//         if (index > capacity) {
//             // Manually shift all values starting at the index back to the
//             // beginning of the queue.
//             for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
//                 queue[scan] = queue[scan + index];
//             }
//             queue.length -= index;
//             index = 0;
//         }
//     }
//     queue.length = 0;
//     index = 0;
//     flushing = false;
// }

// // `requestFlush` is implemented using a strategy based on data collected from
// // every available SauceLabs Selenium web driver worker at time of writing.
// // https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// // Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// // have WebKitMutationObserver but not un-prefixed MutationObserver.
// // Must use `global` or `self` instead of `window` to work in both frames and web
// // workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

// /* globals self */
// var scope = typeof global !== "undefined" ? global : self;
// var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// // MutationObservers are desirable because they have high priority and work
// // reliably everywhere they are implemented.
// // They are implemented in all modern browsers.
// //
// // - Android 4-4.3
// // - Chrome 26-34
// // - Firefox 14-29
// // - Internet Explorer 11
// // - iPad Safari 6-7.1
// // - iPhone Safari 7-7.1
// // - Safari 6-7
// if (typeof BrowserMutationObserver === "function") {
//     requestFlush = makeRequestCallFromMutationObserver(flush);

// // MessageChannels are desirable because they give direct access to the HTML
// // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// // 11-12, and in web workers in many engines.
// // Although message channels yield to any queued rendering and IO tasks, they
// // would be better than imposing the 4ms delay of timers.
// // However, they do not work reliably in Internet Explorer or Safari.

// // Internet Explorer 10 is the only browser that has setImmediate but does
// // not have MutationObservers.
// // Although setImmediate yields to the browser's renderer, it would be
// // preferrable to falling back to setTimeout since it does not have
// // the minimum 4ms penalty.
// // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// // Desktop to a lesser extent) that renders both setImmediate and
// // MessageChannel useless for the purposes of ASAP.
// // https://github.com/kriskowal/q/issues/396

// // Timers are implemented universally.
// // We fall back to timers in workers in most engines, and in foreground
// // contexts in the following browsers.
// // However, note that even this simple case requires nuances to operate in a
// // broad spectrum of browsers.
// //
// // - Firefox 3-13
// // - Internet Explorer 6-9
// // - iPad Safari 4.3
// // - Lynx 2.8.7
// } else {
//     requestFlush = makeRequestCallFromTimer(flush);
// }

// // `requestFlush` requests that the high priority event queue be flushed as
// // soon as possible.
// // This is useful to prevent an error thrown in a task from stalling the event
// // queue if the exception handled by Node.js’s
// // `process.on("uncaughtException")` or by a domain.
// rawAsap.requestFlush = requestFlush;

// // To request a high priority event, we induce a mutation observer by toggling
// // the text of a text node between "1" and "-1".
// function makeRequestCallFromMutationObserver(callback) {
//     var toggle = 1;
//     var observer = new BrowserMutationObserver(callback);
//     var node = document.createTextNode("");
//     observer.observe(node, {characterData: true});
//     return function requestCall() {
//         toggle = -toggle;
//         node.data = toggle;
//     };
// }

// // The message channel technique was discovered by Malte Ubl and was the
// // original foundation for this library.
// // http://www.nonblocking.io/2011/06/windownexttick.html

// // Safari 6.0.5 (at least) intermittently fails to create message ports on a
// // page's first load. Thankfully, this version of Safari supports
// // MutationObservers, so we don't need to fall back in that case.

// // function makeRequestCallFromMessageChannel(callback) {
// //     var channel = new MessageChannel();
// //     channel.port1.onmessage = callback;
// //     return function requestCall() {
// //         channel.port2.postMessage(0);
// //     };
// // }

// // For reasons explained above, we are also unable to use `setImmediate`
// // under any circumstances.
// // Even if we were, there is another bug in Internet Explorer 10.
// // It is not sufficient to assign `setImmediate` to `requestFlush` because
// // `setImmediate` must be called *by name* and therefore must be wrapped in a
// // closure.
// // Never forget.

// // function makeRequestCallFromSetImmediate(callback) {
// //     return function requestCall() {
// //         setImmediate(callback);
// //     };
// // }

// // Safari 6.0 has a problem where timers will get lost while the user is
// // scrolling. This problem does not impact ASAP because Safari 6.0 supports
// // mutation observers, so that implementation is used instead.
// // However, if we ever elect to use timers in Safari, the prevalent work-around
// // is to add a scroll event listener that calls for a flush.

// // `setTimeout` does not call the passed callback if the delay is less than
// // approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// // even then.

// function makeRequestCallFromTimer(callback) {
//     return function requestCall() {
//         // We dispatch a timeout with a specified delay of 0 for engines that
//         // can reliably accommodate that request. This will usually be snapped
//         // to a 4 milisecond delay, but once we're flushing, there's no delay
//         // between events.
//         var timeoutHandle = setTimeout(handleTimer, 0);
//         // However, since this timer gets frequently dropped in Firefox
//         // workers, we enlist an interval handle that will try to fire
//         // an event 20 times per second until it succeeds.
//         var intervalHandle = setInterval(handleTimer, 50);

//         function handleTimer() {
//             // Whichever timer succeeds will cancel both timers and
//             // execute the callback.
//             clearTimeout(timeoutHandle);
//             clearInterval(intervalHandle);
//             callback();
//         }
//     };
// }

// // This is for `asap.js` only.
// // Its name will be periodically randomized to break any code that depends on
// // its existence.
// rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// // ASAP was originally a nextTick shim included in Q. This was factored out
// // into this ASAP package. It was later adapted to RSVP which made further
// // amendments. These decisions, particularly to marginalize MessageChannel and
// // to capture the MutationObserver implementation in a closure, were integrated
// // back into ASAP proper.
// // https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

// }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
// },{}],100:[function(require,module,exports){
// 'use strict'

// exports.byteLength = byteLength
// exports.toByteArray = toByteArray
// exports.fromByteArray = fromByteArray

// var lookup = []
// var revLookup = []
// var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

// var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
// for (var i = 0, len = code.length; i < len; ++i) {
//   lookup[i] = code[i]
//   revLookup[code.charCodeAt(i)] = i
// }

// revLookup['-'.charCodeAt(0)] = 62
// revLookup['_'.charCodeAt(0)] = 63

// function placeHoldersCount (b64) {
//   var len = b64.length
//   if (len % 4 > 0) {
//     throw new Error('Invalid string. Length must be a multiple of 4')
//   }

//   // the number of equal signs (place holders)
//   // if there are two placeholders, than the two characters before it
//   // represent one byte
//   // if there is only one, then the three characters before it represent 2 bytes
//   // this is just a cheap hack to not do indexOf twice
//   return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
// }

// function byteLength (b64) {
//   // base64 is 4/3 + up to two characters of the original data
//   return (b64.length * 3 / 4) - placeHoldersCount(b64)
// }

// function toByteArray (b64) {
//   var i, l, tmp, placeHolders, arr
//   var len = b64.length
//   placeHolders = placeHoldersCount(b64)

//   arr = new Arr((len * 3 / 4) - placeHolders)

//   // if there are placeholders, only get up to the last complete 4 chars
//   l = placeHolders > 0 ? len - 4 : len

//   var L = 0

//   for (i = 0; i < l; i += 4) {
//     tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
//     arr[L++] = (tmp >> 16) & 0xFF
//     arr[L++] = (tmp >> 8) & 0xFF
//     arr[L++] = tmp & 0xFF
//   }

//   if (placeHolders === 2) {
//     tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
//     arr[L++] = tmp & 0xFF
//   } else if (placeHolders === 1) {
//     tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
//     arr[L++] = (tmp >> 8) & 0xFF
//     arr[L++] = tmp & 0xFF
//   }

//   return arr
// }

// function tripletToBase64 (num) {
//   return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
// }

// function encodeChunk (uint8, start, end) {
//   var tmp
//   var output = []
//   for (var i = start; i < end; i += 3) {
//     tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
//     output.push(tripletToBase64(tmp))
//   }
//   return output.join('')
// }

// function fromByteArray (uint8) {
//   var tmp
//   var len = uint8.length
//   var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
//   var output = ''
//   var parts = []
//   var maxChunkLength = 16383 // must be multiple of 3

//   // go through the array every three bytes, we'll deal with trailing stuff later
//   for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
//     parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
//   }

//   // pad the end with zeros, but make sure to not forget the extra bytes
//   if (extraBytes === 1) {
//     tmp = uint8[len - 1]
//     output += lookup[tmp >> 2]
//     output += lookup[(tmp << 4) & 0x3F]
//     output += '=='
//   } else if (extraBytes === 2) {
//     tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
//     output += lookup[tmp >> 10]
//     output += lookup[(tmp >> 4) & 0x3F]
//     output += lookup[(tmp << 2) & 0x3F]
//     output += '='
//   }

//   parts.push(output)

//   return parts.join('')
// }

// },{}],101:[function(require,module,exports){
// /*!
//  * The buffer module from node.js, for the browser.
//  *
//  * @author   Feross Aboukhadijeh <https://feross.org>
//  * @license  MIT
//  */
// /* eslint-disable no-proto */

// 'use strict'

// var base64 = require('base64-js')
// var ieee754 = require('ieee754')

// exports.Buffer = Buffer
// exports.SlowBuffer = SlowBuffer
// exports.INSPECT_MAX_BYTES = 50

// var K_MAX_LENGTH = 0x7fffffff
// exports.kMaxLength = K_MAX_LENGTH

// /**
//  * If `Buffer.TYPED_ARRAY_SUPPORT`:
//  *   === true    Use Uint8Array implementation (fastest)
//  *   === false   Print warning and recommend using `buffer` v4.x which has an Object
//  *               implementation (most compatible, even IE6)
//  *
//  * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
//  * Opera 11.6+, iOS 4.2+.
//  *
//  * We report that the browser does not support typed arrays if the are not subclassable
//  * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
//  * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
//  * for __proto__ and has a buggy typed array implementation.
//  */
// Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

// if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
//     typeof console.error === 'function') {
//   console.error(
//     'This browser lacks typed array (Uint8Array) support which is required by ' +
//     '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
//   )
// }

// function typedArraySupport () {
//   // Can typed array instances can be augmented?
//   try {
//     var arr = new Uint8Array(1)
//     arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
//     return arr.foo() === 42
//   } catch (e) {
//     return false
//   }
// }

// function createBuffer (length) {
//   if (length > K_MAX_LENGTH) {
//     throw new RangeError('Invalid typed array length')
//   }
//   // Return an augmented `Uint8Array` instance
//   var buf = new Uint8Array(length)
//   buf.__proto__ = Buffer.prototype
//   return buf
// }

// /**
//  * The Buffer constructor returns instances of `Uint8Array` that have their
//  * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
//  * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
//  * and the `Uint8Array` methods. Square bracket notation works as expected -- it
//  * returns a single octet.
//  *
//  * The `Uint8Array` prototype remains unmodified.
//  */

// function Buffer (arg, encodingOrOffset, length) {
//   // Common case.
//   if (typeof arg === 'number') {
//     if (typeof encodingOrOffset === 'string') {
//       throw new Error(
//         'If encoding is specified then the first argument must be a string'
//       )
//     }
//     return allocUnsafe(arg)
//   }
//   return from(arg, encodingOrOffset, length)
// }

// // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
// if (typeof Symbol !== 'undefined' && Symbol.species &&
//     Buffer[Symbol.species] === Buffer) {
//   Object.defineProperty(Buffer, Symbol.species, {
//     value: null,
//     configurable: true,
//     enumerable: false,
//     writable: false
//   })
// }

// Buffer.poolSize = 8192 // not used by this implementation

// function from (value, encodingOrOffset, length) {
//   if (typeof value === 'number') {
//     throw new TypeError('"value" argument must not be a number')
//   }

//   if (isArrayBuffer(value)) {
//     return fromArrayBuffer(value, encodingOrOffset, length)
//   }

//   if (typeof value === 'string') {
//     return fromString(value, encodingOrOffset)
//   }

//   return fromObject(value)
// }

// /**
//  * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
//  * if value is a number.
//  * Buffer.from(str[, encoding])
//  * Buffer.from(array)
//  * Buffer.from(buffer)
//  * Buffer.from(arrayBuffer[, byteOffset[, length]])
//  **/
// Buffer.from = function (value, encodingOrOffset, length) {
//   return from(value, encodingOrOffset, length)
// }

// // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// // https://github.com/feross/buffer/pull/148
// Buffer.prototype.__proto__ = Uint8Array.prototype
// Buffer.__proto__ = Uint8Array

// function assertSize (size) {
//   if (typeof size !== 'number') {
//     throw new TypeError('"size" argument must be a number')
//   } else if (size < 0) {
//     throw new RangeError('"size" argument must not be negative')
//   }
// }

// function alloc (size, fill, encoding) {
//   assertSize(size)
//   if (size <= 0) {
//     return createBuffer(size)
//   }
//   if (fill !== undefined) {
//     // Only pay attention to encoding if it's a string. This
//     // prevents accidentally sending in a number that would
//     // be interpretted as a start offset.
//     return typeof encoding === 'string'
//       ? createBuffer(size).fill(fill, encoding)
//       : createBuffer(size).fill(fill)
//   }
//   return createBuffer(size)
// }

// /**
//  * Creates a new filled Buffer instance.
//  * alloc(size[, fill[, encoding]])
//  **/
// Buffer.alloc = function (size, fill, encoding) {
//   return alloc(size, fill, encoding)
// }

// function allocUnsafe (size) {
//   assertSize(size)
//   return createBuffer(size < 0 ? 0 : checked(size) | 0)
// }

// /**
//  * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
//  * */
// Buffer.allocUnsafe = function (size) {
//   return allocUnsafe(size)
// }
// /**
//  * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
//  */
// Buffer.allocUnsafeSlow = function (size) {
//   return allocUnsafe(size)
// }

// function fromString (string, encoding) {
//   if (typeof encoding !== 'string' || encoding === '') {
//     encoding = 'utf8'
//   }

//   if (!Buffer.isEncoding(encoding)) {
//     throw new TypeError('"encoding" must be a valid string encoding')
//   }

//   var length = byteLength(string, encoding) | 0
//   var buf = createBuffer(length)

//   var actual = buf.write(string, encoding)

//   if (actual !== length) {
//     // Writing a hex string, for example, that contains invalid characters will
//     // cause everything after the first invalid character to be ignored. (e.g.
//     // 'abxxcd' will be treated as 'ab')
//     buf = buf.slice(0, actual)
//   }

//   return buf
// }

// function fromArrayLike (array) {
//   var length = array.length < 0 ? 0 : checked(array.length) | 0
//   var buf = createBuffer(length)
//   for (var i = 0; i < length; i += 1) {
//     buf[i] = array[i] & 255
//   }
//   return buf
// }

// function fromArrayBuffer (array, byteOffset, length) {
//   if (byteOffset < 0 || array.byteLength < byteOffset) {
//     throw new RangeError('\'offset\' is out of bounds')
//   }

//   if (array.byteLength < byteOffset + (length || 0)) {
//     throw new RangeError('\'length\' is out of bounds')
//   }

//   var buf
//   if (byteOffset === undefined && length === undefined) {
//     buf = new Uint8Array(array)
//   } else if (length === undefined) {
//     buf = new Uint8Array(array, byteOffset)
//   } else {
//     buf = new Uint8Array(array, byteOffset, length)
//   }

//   // Return an augmented `Uint8Array` instance
//   buf.__proto__ = Buffer.prototype
//   return buf
// }

// function fromObject (obj) {
//   if (Buffer.isBuffer(obj)) {
//     var len = checked(obj.length) | 0
//     var buf = createBuffer(len)

//     if (buf.length === 0) {
//       return buf
//     }

//     obj.copy(buf, 0, 0, len)
//     return buf
//   }

//   if (obj) {
//     if (isArrayBufferView(obj) || 'length' in obj) {
//       if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
//         return createBuffer(0)
//       }
//       return fromArrayLike(obj)
//     }

//     if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
//       return fromArrayLike(obj.data)
//     }
//   }

//   throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
// }

// function checked (length) {
//   // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
//   // length is NaN (which is otherwise coerced to zero.)
//   if (length >= K_MAX_LENGTH) {
//     throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
//                          'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
//   }
//   return length | 0
// }

// function SlowBuffer (length) {
//   if (+length != length) { // eslint-disable-line eqeqeq
//     length = 0
//   }
//   return Buffer.alloc(+length)
// }

// Buffer.isBuffer = function isBuffer (b) {
//   return b != null && b._isBuffer === true
// }

// Buffer.compare = function compare (a, b) {
//   if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
//     throw new TypeError('Arguments must be Buffers')
//   }

//   if (a === b) return 0

//   var x = a.length
//   var y = b.length

//   for (var i = 0, len = Math.min(x, y); i < len; ++i) {
//     if (a[i] !== b[i]) {
//       x = a[i]
//       y = b[i]
//       break
//     }
//   }

//   if (x < y) return -1
//   if (y < x) return 1
//   return 0
// }

// Buffer.isEncoding = function isEncoding (encoding) {
//   switch (String(encoding).toLowerCase()) {
//     case 'hex':
//     case 'utf8':
//     case 'utf-8':
//     case 'ascii':
//     case 'latin1':
//     case 'binary':
//     case 'base64':
//     case 'ucs2':
//     case 'ucs-2':
//     case 'utf16le':
//     case 'utf-16le':
//       return true
//     default:
//       return false
//   }
// }

// Buffer.concat = function concat (list, length) {
//   if (!Array.isArray(list)) {
//     throw new TypeError('"list" argument must be an Array of Buffers')
//   }

//   if (list.length === 0) {
//     return Buffer.alloc(0)
//   }

//   var i
//   if (length === undefined) {
//     length = 0
//     for (i = 0; i < list.length; ++i) {
//       length += list[i].length
//     }
//   }

//   var buffer = Buffer.allocUnsafe(length)
//   var pos = 0
//   for (i = 0; i < list.length; ++i) {
//     var buf = list[i]
//     if (!Buffer.isBuffer(buf)) {
//       throw new TypeError('"list" argument must be an Array of Buffers')
//     }
//     buf.copy(buffer, pos)
//     pos += buf.length
//   }
//   return buffer
// }

// function byteLength (string, encoding) {
//   if (Buffer.isBuffer(string)) {
//     return string.length
//   }
//   if (isArrayBufferView(string) || isArrayBuffer(string)) {
//     return string.byteLength
//   }
//   if (typeof string !== 'string') {
//     string = '' + string
//   }

//   var len = string.length
//   if (len === 0) return 0

//   // Use a for loop to avoid recursion
//   var loweredCase = false
//   for (;;) {
//     switch (encoding) {
//       case 'ascii':
//       case 'latin1':
//       case 'binary':
//         return len
//       case 'utf8':
//       case 'utf-8':
//       case undefined:
//         return utf8ToBytes(string).length
//       case 'ucs2':
//       case 'ucs-2':
//       case 'utf16le':
//       case 'utf-16le':
//         return len * 2
//       case 'hex':
//         return len >>> 1
//       case 'base64':
//         return base64ToBytes(string).length
//       default:
//         if (loweredCase) return utf8ToBytes(string).length // assume utf8
//         encoding = ('' + encoding).toLowerCase()
//         loweredCase = true
//     }
//   }
// }
// Buffer.byteLength = byteLength

// function slowToString (encoding, start, end) {
//   var loweredCase = false

//   // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
//   // property of a typed array.

//   // This behaves neither like String nor Uint8Array in that we set start/end
//   // to their upper/lower bounds if the value passed is out of range.
//   // undefined is handled specially as per ECMA-262 6th Edition,
//   // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
//   if (start === undefined || start < 0) {
//     start = 0
//   }
//   // Return early if start > this.length. Done here to prevent potential uint32
//   // coercion fail below.
//   if (start > this.length) {
//     return ''
//   }

//   if (end === undefined || end > this.length) {
//     end = this.length
//   }

//   if (end <= 0) {
//     return ''
//   }

//   // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
//   end >>>= 0
//   start >>>= 0

//   if (end <= start) {
//     return ''
//   }

//   if (!encoding) encoding = 'utf8'

//   while (true) {
//     switch (encoding) {
//       case 'hex':
//         return hexSlice(this, start, end)

//       case 'utf8':
//       case 'utf-8':
//         return utf8Slice(this, start, end)

//       case 'ascii':
//         return asciiSlice(this, start, end)

//       case 'latin1':
//       case 'binary':
//         return latin1Slice(this, start, end)

//       case 'base64':
//         return base64Slice(this, start, end)

//       case 'ucs2':
//       case 'ucs-2':
//       case 'utf16le':
//       case 'utf-16le':
//         return utf16leSlice(this, start, end)

//       default:
//         if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
//         encoding = (encoding + '').toLowerCase()
//         loweredCase = true
//     }
//   }
// }

// // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// // reliably in a browserify context because there could be multiple different
// // copies of the 'buffer' package in use. This method works even for Buffer
// // instances that were created from another copy of the `buffer` package.
// // See: https://github.com/feross/buffer/issues/154
// Buffer.prototype._isBuffer = true

// function swap (b, n, m) {
//   var i = b[n]
//   b[n] = b[m]
//   b[m] = i
// }

// Buffer.prototype.swap16 = function swap16 () {
//   var len = this.length
//   if (len % 2 !== 0) {
//     throw new RangeError('Buffer size must be a multiple of 16-bits')
//   }
//   for (var i = 0; i < len; i += 2) {
//     swap(this, i, i + 1)
//   }
//   return this
// }

// Buffer.prototype.swap32 = function swap32 () {
//   var len = this.length
//   if (len % 4 !== 0) {
//     throw new RangeError('Buffer size must be a multiple of 32-bits')
//   }
//   for (var i = 0; i < len; i += 4) {
//     swap(this, i, i + 3)
//     swap(this, i + 1, i + 2)
//   }
//   return this
// }

// Buffer.prototype.swap64 = function swap64 () {
//   var len = this.length
//   if (len % 8 !== 0) {
//     throw new RangeError('Buffer size must be a multiple of 64-bits')
//   }
//   for (var i = 0; i < len; i += 8) {
//     swap(this, i, i + 7)
//     swap(this, i + 1, i + 6)
//     swap(this, i + 2, i + 5)
//     swap(this, i + 3, i + 4)
//   }
//   return this
// }

// Buffer.prototype.toString = function toString () {
//   var length = this.length
//   if (length === 0) return ''
//   if (arguments.length === 0) return utf8Slice(this, 0, length)
//   return slowToString.apply(this, arguments)
// }

// Buffer.prototype.equals = function equals (b) {
//   if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
//   if (this === b) return true
//   return Buffer.compare(this, b) === 0
// }

// Buffer.prototype.inspect = function inspect () {
//   var str = ''
//   var max = exports.INSPECT_MAX_BYTES
//   if (this.length > 0) {
//     str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
//     if (this.length > max) str += ' ... '
//   }
//   return '<Buffer ' + str + '>'
// }

// Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
//   if (!Buffer.isBuffer(target)) {
//     throw new TypeError('Argument must be a Buffer')
//   }

//   if (start === undefined) {
//     start = 0
//   }
//   if (end === undefined) {
//     end = target ? target.length : 0
//   }
//   if (thisStart === undefined) {
//     thisStart = 0
//   }
//   if (thisEnd === undefined) {
//     thisEnd = this.length
//   }

//   if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
//     throw new RangeError('out of range index')
//   }

//   if (thisStart >= thisEnd && start >= end) {
//     return 0
//   }
//   if (thisStart >= thisEnd) {
//     return -1
//   }
//   if (start >= end) {
//     return 1
//   }

//   start >>>= 0
//   end >>>= 0
//   thisStart >>>= 0
//   thisEnd >>>= 0

//   if (this === target) return 0

//   var x = thisEnd - thisStart
//   var y = end - start
//   var len = Math.min(x, y)

//   var thisCopy = this.slice(thisStart, thisEnd)
//   var targetCopy = target.slice(start, end)

//   for (var i = 0; i < len; ++i) {
//     if (thisCopy[i] !== targetCopy[i]) {
//       x = thisCopy[i]
//       y = targetCopy[i]
//       break
//     }
//   }

//   if (x < y) return -1
//   if (y < x) return 1
//   return 0
// }

// // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
// //
// // Arguments:
// // - buffer - a Buffer to search
// // - val - a string, Buffer, or number
// // - byteOffset - an index into `buffer`; will be clamped to an int32
// // - encoding - an optional encoding, relevant is val is a string
// // - dir - true for indexOf, false for lastIndexOf
// function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
//   // Empty buffer means no match
//   if (buffer.length === 0) return -1

//   // Normalize byteOffset
//   if (typeof byteOffset === 'string') {
//     encoding = byteOffset
//     byteOffset = 0
//   } else if (byteOffset > 0x7fffffff) {
//     byteOffset = 0x7fffffff
//   } else if (byteOffset < -0x80000000) {
//     byteOffset = -0x80000000
//   }
//   byteOffset = +byteOffset  // Coerce to Number.
//   if (numberIsNaN(byteOffset)) {
//     // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
//     byteOffset = dir ? 0 : (buffer.length - 1)
//   }

//   // Normalize byteOffset: negative offsets start from the end of the buffer
//   if (byteOffset < 0) byteOffset = buffer.length + byteOffset
//   if (byteOffset >= buffer.length) {
//     if (dir) return -1
//     else byteOffset = buffer.length - 1
//   } else if (byteOffset < 0) {
//     if (dir) byteOffset = 0
//     else return -1
//   }

//   // Normalize val
//   if (typeof val === 'string') {
//     val = Buffer.from(val, encoding)
//   }

//   // Finally, search either indexOf (if dir is true) or lastIndexOf
//   if (Buffer.isBuffer(val)) {
//     // Special case: looking for empty string/buffer always fails
//     if (val.length === 0) {
//       return -1
//     }
//     return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
//   } else if (typeof val === 'number') {
//     val = val & 0xFF // Search for a byte value [0-255]
//     if (typeof Uint8Array.prototype.indexOf === 'function') {
//       if (dir) {
//         return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
//       } else {
//         return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
//       }
//     }
//     return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
//   }

//   throw new TypeError('val must be string, number or Buffer')
// }

// function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
//   var indexSize = 1
//   var arrLength = arr.length
//   var valLength = val.length

//   if (encoding !== undefined) {
//     encoding = String(encoding).toLowerCase()
//     if (encoding === 'ucs2' || encoding === 'ucs-2' ||
//         encoding === 'utf16le' || encoding === 'utf-16le') {
//       if (arr.length < 2 || val.length < 2) {
//         return -1
//       }
//       indexSize = 2
//       arrLength /= 2
//       valLength /= 2
//       byteOffset /= 2
//     }
//   }

//   function read (buf, i) {
//     if (indexSize === 1) {
//       return buf[i]
//     } else {
//       return buf.readUInt16BE(i * indexSize)
//     }
//   }

//   var i
//   if (dir) {
//     var foundIndex = -1
//     for (i = byteOffset; i < arrLength; i++) {
//       if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
//         if (foundIndex === -1) foundIndex = i
//         if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
//       } else {
//         if (foundIndex !== -1) i -= i - foundIndex
//         foundIndex = -1
//       }
//     }
//   } else {
//     if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
//     for (i = byteOffset; i >= 0; i--) {
//       var found = true
//       for (var j = 0; j < valLength; j++) {
//         if (read(arr, i + j) !== read(val, j)) {
//           found = false
//           break
//         }
//       }
//       if (found) return i
//     }
//   }

//   return -1
// }

// Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
//   return this.indexOf(val, byteOffset, encoding) !== -1
// }

// Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
//   return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
// }

// Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
//   return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
// }

// function hexWrite (buf, string, offset, length) {
//   offset = Number(offset) || 0
//   var remaining = buf.length - offset
//   if (!length) {
//     length = remaining
//   } else {
//     length = Number(length)
//     if (length > remaining) {
//       length = remaining
//     }
//   }

//   // must be an even number of digits
//   var strLen = string.length
//   if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

//   if (length > strLen / 2) {
//     length = strLen / 2
//   }
//   for (var i = 0; i < length; ++i) {
//     var parsed = parseInt(string.substr(i * 2, 2), 16)
//     if (numberIsNaN(parsed)) return i
//     buf[offset + i] = parsed
//   }
//   return i
// }

// function utf8Write (buf, string, offset, length) {
//   return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
// }

// function asciiWrite (buf, string, offset, length) {
//   return blitBuffer(asciiToBytes(string), buf, offset, length)
// }

// function latin1Write (buf, string, offset, length) {
//   return asciiWrite(buf, string, offset, length)
// }

// function base64Write (buf, string, offset, length) {
//   return blitBuffer(base64ToBytes(string), buf, offset, length)
// }

// function ucs2Write (buf, string, offset, length) {
//   return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
// }

// Buffer.prototype.write = function write (string, offset, length, encoding) {
//   // Buffer#write(string)
//   if (offset === undefined) {
//     encoding = 'utf8'
//     length = this.length
//     offset = 0
//   // Buffer#write(string, encoding)
//   } else if (length === undefined && typeof offset === 'string') {
//     encoding = offset
//     length = this.length
//     offset = 0
//   // Buffer#write(string, offset[, length][, encoding])
//   } else if (isFinite(offset)) {
//     offset = offset >>> 0
//     if (isFinite(length)) {
//       length = length >>> 0
//       if (encoding === undefined) encoding = 'utf8'
//     } else {
//       encoding = length
//       length = undefined
//     }
//   } else {
//     throw new Error(
//       'Buffer.write(string, encoding, offset[, length]) is no longer supported'
//     )
//   }

//   var remaining = this.length - offset
//   if (length === undefined || length > remaining) length = remaining

//   if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
//     throw new RangeError('Attempt to write outside buffer bounds')
//   }

//   if (!encoding) encoding = 'utf8'

//   var loweredCase = false
//   for (;;) {
//     switch (encoding) {
//       case 'hex':
//         return hexWrite(this, string, offset, length)

//       case 'utf8':
//       case 'utf-8':
//         return utf8Write(this, string, offset, length)

//       case 'ascii':
//         return asciiWrite(this, string, offset, length)

//       case 'latin1':
//       case 'binary':
//         return latin1Write(this, string, offset, length)

//       case 'base64':
//         // Warning: maxLength not taken into account in base64Write
//         return base64Write(this, string, offset, length)

//       case 'ucs2':
//       case 'ucs-2':
//       case 'utf16le':
//       case 'utf-16le':
//         return ucs2Write(this, string, offset, length)

//       default:
//         if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
//         encoding = ('' + encoding).toLowerCase()
//         loweredCase = true
//     }
//   }
// }

// Buffer.prototype.toJSON = function toJSON () {
//   return {
//     type: 'Buffer',
//     data: Array.prototype.slice.call(this._arr || this, 0)
//   }
// }

// function base64Slice (buf, start, end) {
//   if (start === 0 && end === buf.length) {
//     return base64.fromByteArray(buf)
//   } else {
//     return base64.fromByteArray(buf.slice(start, end))
//   }
// }

// function utf8Slice (buf, start, end) {
//   end = Math.min(buf.length, end)
//   var res = []

//   var i = start
//   while (i < end) {
//     var firstByte = buf[i]
//     var codePoint = null
//     var bytesPerSequence = (firstByte > 0xEF) ? 4
//       : (firstByte > 0xDF) ? 3
//       : (firstByte > 0xBF) ? 2
//       : 1

//     if (i + bytesPerSequence <= end) {
//       var secondByte, thirdByte, fourthByte, tempCodePoint

//       switch (bytesPerSequence) {
//         case 1:
//           if (firstByte < 0x80) {
//             codePoint = firstByte
//           }
//           break
//         case 2:
//           secondByte = buf[i + 1]
//           if ((secondByte & 0xC0) === 0x80) {
//             tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
//             if (tempCodePoint > 0x7F) {
//               codePoint = tempCodePoint
//             }
//           }
//           break
//         case 3:
//           secondByte = buf[i + 1]
//           thirdByte = buf[i + 2]
//           if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
//             tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
//             if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
//               codePoint = tempCodePoint
//             }
//           }
//           break
//         case 4:
//           secondByte = buf[i + 1]
//           thirdByte = buf[i + 2]
//           fourthByte = buf[i + 3]
//           if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
//             tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
//             if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
//               codePoint = tempCodePoint
//             }
//           }
//       }
//     }

//     if (codePoint === null) {
//       // we did not generate a valid codePoint so insert a
//       // replacement char (U+FFFD) and advance only 1 byte
//       codePoint = 0xFFFD
//       bytesPerSequence = 1
//     } else if (codePoint > 0xFFFF) {
//       // encode to utf16 (surrogate pair dance)
//       codePoint -= 0x10000
//       res.push(codePoint >>> 10 & 0x3FF | 0xD800)
//       codePoint = 0xDC00 | codePoint & 0x3FF
//     }

//     res.push(codePoint)
//     i += bytesPerSequence
//   }

//   return decodeCodePointsArray(res)
// }

// // Based on http://stackoverflow.com/a/22747272/680742, the browser with
// // the lowest limit is Chrome, with 0x10000 args.
// // We go 1 magnitude less, for safety
// var MAX_ARGUMENTS_LENGTH = 0x1000

// function decodeCodePointsArray (codePoints) {
//   var len = codePoints.length
//   if (len <= MAX_ARGUMENTS_LENGTH) {
//     return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
//   }

//   // Decode in chunks to avoid "call stack size exceeded".
//   var res = ''
//   var i = 0
//   while (i < len) {
//     res += String.fromCharCode.apply(
//       String,
//       codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
//     )
//   }
//   return res
// }

// function asciiSlice (buf, start, end) {
//   var ret = ''
//   end = Math.min(buf.length, end)

//   for (var i = start; i < end; ++i) {
//     ret += String.fromCharCode(buf[i] & 0x7F)
//   }
//   return ret
// }

// function latin1Slice (buf, start, end) {
//   var ret = ''
//   end = Math.min(buf.length, end)

//   for (var i = start; i < end; ++i) {
//     ret += String.fromCharCode(buf[i])
//   }
//   return ret
// }

// function hexSlice (buf, start, end) {
//   var len = buf.length

//   if (!start || start < 0) start = 0
//   if (!end || end < 0 || end > len) end = len

//   var out = ''
//   for (var i = start; i < end; ++i) {
//     out += toHex(buf[i])
//   }
//   return out
// }

// function utf16leSlice (buf, start, end) {
//   var bytes = buf.slice(start, end)
//   var res = ''
//   for (var i = 0; i < bytes.length; i += 2) {
//     res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
//   }
//   return res
// }

// Buffer.prototype.slice = function slice (start, end) {
//   var len = this.length
//   start = ~~start
//   end = end === undefined ? len : ~~end

//   if (start < 0) {
//     start += len
//     if (start < 0) start = 0
//   } else if (start > len) {
//     start = len
//   }

//   if (end < 0) {
//     end += len
//     if (end < 0) end = 0
//   } else if (end > len) {
//     end = len
//   }

//   if (end < start) end = start

//   var newBuf = this.subarray(start, end)
//   // Return an augmented `Uint8Array` instance
//   newBuf.__proto__ = Buffer.prototype
//   return newBuf
// }

// /*
//  * Need to make sure that buffer isn't trying to write out of bounds.
//  */
// function checkOffset (offset, ext, length) {
//   if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
//   if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
// }

// Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
//   offset = offset >>> 0
//   byteLength = byteLength >>> 0
//   if (!noAssert) checkOffset(offset, byteLength, this.length)

//   var val = this[offset]
//   var mul = 1
//   var i = 0
//   while (++i < byteLength && (mul *= 0x100)) {
//     val += this[offset + i] * mul
//   }

//   return val
// }

// Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
//   offset = offset >>> 0
//   byteLength = byteLength >>> 0
//   if (!noAssert) {
//     checkOffset(offset, byteLength, this.length)
//   }

//   var val = this[offset + --byteLength]
//   var mul = 1
//   while (byteLength > 0 && (mul *= 0x100)) {
//     val += this[offset + --byteLength] * mul
//   }

//   return val
// }

// Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 1, this.length)
//   return this[offset]
// }

// Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 2, this.length)
//   return this[offset] | (this[offset + 1] << 8)
// }

// Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 2, this.length)
//   return (this[offset] << 8) | this[offset + 1]
// }

// Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 4, this.length)

//   return ((this[offset]) |
//       (this[offset + 1] << 8) |
//       (this[offset + 2] << 16)) +
//       (this[offset + 3] * 0x1000000)
// }

// Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 4, this.length)

//   return (this[offset] * 0x1000000) +
//     ((this[offset + 1] << 16) |
//     (this[offset + 2] << 8) |
//     this[offset + 3])
// }

// Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
//   offset = offset >>> 0
//   byteLength = byteLength >>> 0
//   if (!noAssert) checkOffset(offset, byteLength, this.length)

//   var val = this[offset]
//   var mul = 1
//   var i = 0
//   while (++i < byteLength && (mul *= 0x100)) {
//     val += this[offset + i] * mul
//   }
//   mul *= 0x80

//   if (val >= mul) val -= Math.pow(2, 8 * byteLength)

//   return val
// }

// Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
//   offset = offset >>> 0
//   byteLength = byteLength >>> 0
//   if (!noAssert) checkOffset(offset, byteLength, this.length)

//   var i = byteLength
//   var mul = 1
//   var val = this[offset + --i]
//   while (i > 0 && (mul *= 0x100)) {
//     val += this[offset + --i] * mul
//   }
//   mul *= 0x80

//   if (val >= mul) val -= Math.pow(2, 8 * byteLength)

//   return val
// }

// Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 1, this.length)
//   if (!(this[offset] & 0x80)) return (this[offset])
//   return ((0xff - this[offset] + 1) * -1)
// }

// Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 2, this.length)
//   var val = this[offset] | (this[offset + 1] << 8)
//   return (val & 0x8000) ? val | 0xFFFF0000 : val
// }

// Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 2, this.length)
//   var val = this[offset + 1] | (this[offset] << 8)
//   return (val & 0x8000) ? val | 0xFFFF0000 : val
// }

// Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 4, this.length)

//   return (this[offset]) |
//     (this[offset + 1] << 8) |
//     (this[offset + 2] << 16) |
//     (this[offset + 3] << 24)
// }

// Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 4, this.length)

//   return (this[offset] << 24) |
//     (this[offset + 1] << 16) |
//     (this[offset + 2] << 8) |
//     (this[offset + 3])
// }

// Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 4, this.length)
//   return ieee754.read(this, offset, true, 23, 4)
// }

// Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 4, this.length)
//   return ieee754.read(this, offset, false, 23, 4)
// }

// Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 8, this.length)
//   return ieee754.read(this, offset, true, 52, 8)
// }

// Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
//   offset = offset >>> 0
//   if (!noAssert) checkOffset(offset, 8, this.length)
//   return ieee754.read(this, offset, false, 52, 8)
// }

// function checkInt (buf, value, offset, ext, max, min) {
//   if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
//   if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
//   if (offset + ext > buf.length) throw new RangeError('Index out of range')
// }

// Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   byteLength = byteLength >>> 0
//   if (!noAssert) {
//     var maxBytes = Math.pow(2, 8 * byteLength) - 1
//     checkInt(this, value, offset, byteLength, maxBytes, 0)
//   }

//   var mul = 1
//   var i = 0
//   this[offset] = value & 0xFF
//   while (++i < byteLength && (mul *= 0x100)) {
//     this[offset + i] = (value / mul) & 0xFF
//   }

//   return offset + byteLength
// }

// Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   byteLength = byteLength >>> 0
//   if (!noAssert) {
//     var maxBytes = Math.pow(2, 8 * byteLength) - 1
//     checkInt(this, value, offset, byteLength, maxBytes, 0)
//   }

//   var i = byteLength - 1
//   var mul = 1
//   this[offset + i] = value & 0xFF
//   while (--i >= 0 && (mul *= 0x100)) {
//     this[offset + i] = (value / mul) & 0xFF
//   }

//   return offset + byteLength
// }

// Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
//   this[offset] = (value & 0xff)
//   return offset + 1
// }

// Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
//   this[offset] = (value & 0xff)
//   this[offset + 1] = (value >>> 8)
//   return offset + 2
// }

// Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
//   this[offset] = (value >>> 8)
//   this[offset + 1] = (value & 0xff)
//   return offset + 2
// }

// Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
//   this[offset + 3] = (value >>> 24)
//   this[offset + 2] = (value >>> 16)
//   this[offset + 1] = (value >>> 8)
//   this[offset] = (value & 0xff)
//   return offset + 4
// }

// Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
//   this[offset] = (value >>> 24)
//   this[offset + 1] = (value >>> 16)
//   this[offset + 2] = (value >>> 8)
//   this[offset + 3] = (value & 0xff)
//   return offset + 4
// }

// Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) {
//     var limit = Math.pow(2, (8 * byteLength) - 1)

//     checkInt(this, value, offset, byteLength, limit - 1, -limit)
//   }

//   var i = 0
//   var mul = 1
//   var sub = 0
//   this[offset] = value & 0xFF
//   while (++i < byteLength && (mul *= 0x100)) {
//     if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
//       sub = 1
//     }
//     this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
//   }

//   return offset + byteLength
// }

// Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) {
//     var limit = Math.pow(2, (8 * byteLength) - 1)

//     checkInt(this, value, offset, byteLength, limit - 1, -limit)
//   }

//   var i = byteLength - 1
//   var mul = 1
//   var sub = 0
//   this[offset + i] = value & 0xFF
//   while (--i >= 0 && (mul *= 0x100)) {
//     if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
//       sub = 1
//     }
//     this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
//   }

//   return offset + byteLength
// }

// Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
//   if (value < 0) value = 0xff + value + 1
//   this[offset] = (value & 0xff)
//   return offset + 1
// }

// Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
//   this[offset] = (value & 0xff)
//   this[offset + 1] = (value >>> 8)
//   return offset + 2
// }

// Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
//   this[offset] = (value >>> 8)
//   this[offset + 1] = (value & 0xff)
//   return offset + 2
// }

// Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
//   this[offset] = (value & 0xff)
//   this[offset + 1] = (value >>> 8)
//   this[offset + 2] = (value >>> 16)
//   this[offset + 3] = (value >>> 24)
//   return offset + 4
// }

// Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
//   if (value < 0) value = 0xffffffff + value + 1
//   this[offset] = (value >>> 24)
//   this[offset + 1] = (value >>> 16)
//   this[offset + 2] = (value >>> 8)
//   this[offset + 3] = (value & 0xff)
//   return offset + 4
// }

// function checkIEEE754 (buf, value, offset, ext, max, min) {
//   if (offset + ext > buf.length) throw new RangeError('Index out of range')
//   if (offset < 0) throw new RangeError('Index out of range')
// }

// function writeFloat (buf, value, offset, littleEndian, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) {
//     checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
//   }
//   ieee754.write(buf, value, offset, littleEndian, 23, 4)
//   return offset + 4
// }

// Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
//   return writeFloat(this, value, offset, true, noAssert)
// }

// Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
//   return writeFloat(this, value, offset, false, noAssert)
// }

// function writeDouble (buf, value, offset, littleEndian, noAssert) {
//   value = +value
//   offset = offset >>> 0
//   if (!noAssert) {
//     checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
//   }
//   ieee754.write(buf, value, offset, littleEndian, 52, 8)
//   return offset + 8
// }

// Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
//   return writeDouble(this, value, offset, true, noAssert)
// }

// Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
//   return writeDouble(this, value, offset, false, noAssert)
// }

// // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
// Buffer.prototype.copy = function copy (target, targetStart, start, end) {
//   if (!start) start = 0
//   if (!end && end !== 0) end = this.length
//   if (targetStart >= target.length) targetStart = target.length
//   if (!targetStart) targetStart = 0
//   if (end > 0 && end < start) end = start

//   // Copy 0 bytes; we're done
//   if (end === start) return 0
//   if (target.length === 0 || this.length === 0) return 0

//   // Fatal error conditions
//   if (targetStart < 0) {
//     throw new RangeError('targetStart out of bounds')
//   }
//   if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
//   if (end < 0) throw new RangeError('sourceEnd out of bounds')

//   // Are we oob?
//   if (end > this.length) end = this.length
//   if (target.length - targetStart < end - start) {
//     end = target.length - targetStart + start
//   }

//   var len = end - start
//   var i

//   if (this === target && start < targetStart && targetStart < end) {
//     // descending copy from end
//     for (i = len - 1; i >= 0; --i) {
//       target[i + targetStart] = this[i + start]
//     }
//   } else if (len < 1000) {
//     // ascending copy from start
//     for (i = 0; i < len; ++i) {
//       target[i + targetStart] = this[i + start]
//     }
//   } else {
//     Uint8Array.prototype.set.call(
//       target,
//       this.subarray(start, start + len),
//       targetStart
//     )
//   }

//   return len
// }

// // Usage:
// //    buffer.fill(number[, offset[, end]])
// //    buffer.fill(buffer[, offset[, end]])
// //    buffer.fill(string[, offset[, end]][, encoding])
// Buffer.prototype.fill = function fill (val, start, end, encoding) {
//   // Handle string cases:
//   if (typeof val === 'string') {
//     if (typeof start === 'string') {
//       encoding = start
//       start = 0
//       end = this.length
//     } else if (typeof end === 'string') {
//       encoding = end
//       end = this.length
//     }
//     if (val.length === 1) {
//       var code = val.charCodeAt(0)
//       if (code < 256) {
//         val = code
//       }
//     }
//     if (encoding !== undefined && typeof encoding !== 'string') {
//       throw new TypeError('encoding must be a string')
//     }
//     if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
//       throw new TypeError('Unknown encoding: ' + encoding)
//     }
//   } else if (typeof val === 'number') {
//     val = val & 255
//   }

//   // Invalid ranges are not set to a default, so can range check early.
//   if (start < 0 || this.length < start || this.length < end) {
//     throw new RangeError('Out of range index')
//   }

//   if (end <= start) {
//     return this
//   }

//   start = start >>> 0
//   end = end === undefined ? this.length : end >>> 0

//   if (!val) val = 0

//   var i
//   if (typeof val === 'number') {
//     for (i = start; i < end; ++i) {
//       this[i] = val
//     }
//   } else {
//     var bytes = Buffer.isBuffer(val)
//       ? val
//       : new Buffer(val, encoding)
//     var len = bytes.length
//     for (i = 0; i < end - start; ++i) {
//       this[i + start] = bytes[i % len]
//     }
//   }

//   return this
// }

// // HELPER FUNCTIONS
// // ================

// var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

// function base64clean (str) {
//   // Node strips out invalid characters like \n and \t from the string, base64-js does not
//   str = str.trim().replace(INVALID_BASE64_RE, '')
//   // Node converts strings with length < 2 to ''
//   if (str.length < 2) return ''
//   // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
//   while (str.length % 4 !== 0) {
//     str = str + '='
//   }
//   return str
// }

// function toHex (n) {
//   if (n < 16) return '0' + n.toString(16)
//   return n.toString(16)
// }

// function utf8ToBytes (string, units) {
//   units = units || Infinity
//   var codePoint
//   var length = string.length
//   var leadSurrogate = null
//   var bytes = []

//   for (var i = 0; i < length; ++i) {
//     codePoint = string.charCodeAt(i)

//     // is surrogate component
//     if (codePoint > 0xD7FF && codePoint < 0xE000) {
//       // last char was a lead
//       if (!leadSurrogate) {
//         // no lead yet
//         if (codePoint > 0xDBFF) {
//           // unexpected trail
//           if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
//           continue
//         } else if (i + 1 === length) {
//           // unpaired lead
//           if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
//           continue
//         }

//         // valid lead
//         leadSurrogate = codePoint

//         continue
//       }

//       // 2 leads in a row
//       if (codePoint < 0xDC00) {
//         if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
//         leadSurrogate = codePoint
//         continue
//       }

//       // valid surrogate pair
//       codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
//     } else if (leadSurrogate) {
//       // valid bmp char, but last char was a lead
//       if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
//     }

//     leadSurrogate = null

//     // encode utf8
//     if (codePoint < 0x80) {
//       if ((units -= 1) < 0) break
//       bytes.push(codePoint)
//     } else if (codePoint < 0x800) {
//       if ((units -= 2) < 0) break
//       bytes.push(
//         codePoint >> 0x6 | 0xC0,
//         codePoint & 0x3F | 0x80
//       )
//     } else if (codePoint < 0x10000) {
//       if ((units -= 3) < 0) break
//       bytes.push(
//         codePoint >> 0xC | 0xE0,
//         codePoint >> 0x6 & 0x3F | 0x80,
//         codePoint & 0x3F | 0x80
//       )
//     } else if (codePoint < 0x110000) {
//       if ((units -= 4) < 0) break
//       bytes.push(
//         codePoint >> 0x12 | 0xF0,
//         codePoint >> 0xC & 0x3F | 0x80,
//         codePoint >> 0x6 & 0x3F | 0x80,
//         codePoint & 0x3F | 0x80
//       )
//     } else {
//       throw new Error('Invalid code point')
//     }
//   }

//   return bytes
// }

// function asciiToBytes (str) {
//   var byteArray = []
//   for (var i = 0; i < str.length; ++i) {
//     // Node's code seems to be doing this and not & 0x7F..
//     byteArray.push(str.charCodeAt(i) & 0xFF)
//   }
//   return byteArray
// }

// function utf16leToBytes (str, units) {
//   var c, hi, lo
//   var byteArray = []
//   for (var i = 0; i < str.length; ++i) {
//     if ((units -= 2) < 0) break

//     c = str.charCodeAt(i)
//     hi = c >> 8
//     lo = c % 256
//     byteArray.push(lo)
//     byteArray.push(hi)
//   }

//   return byteArray
// }

// function base64ToBytes (str) {
//   return base64.toByteArray(base64clean(str))
// }

// function blitBuffer (src, dst, offset, length) {
//   for (var i = 0; i < length; ++i) {
//     if ((i + offset >= dst.length) || (i >= src.length)) break
//     dst[i + offset] = src[i]
//   }
//   return i
// }

// // ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// // but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
// function isArrayBuffer (obj) {
//   return obj instanceof ArrayBuffer ||
//     (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
//       typeof obj.byteLength === 'number')
// }

// // Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
// function isArrayBufferView (obj) {
//   return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
// }

// function numberIsNaN (obj) {
//   return obj !== obj // eslint-disable-line no-self-compare
// }

// },{"base64-js":100,"ieee754":103}],102:[function(require,module,exports){
// (function (Buffer){
// var clone = (function() {
// 'use strict';

// function _instanceof(obj, type) {
//   return type != null && obj instanceof type;
// }

// var nativeMap;
// try {
//   nativeMap = Map;
// } catch(_) {
//   // maybe a reference error because no `Map`. Give it a dummy value that no
//   // value will ever be an instanceof.
//   nativeMap = function() {};
// }

// var nativeSet;
// try {
//   nativeSet = Set;
// } catch(_) {
//   nativeSet = function() {};
// }

// var nativePromise;
// try {
//   nativePromise = Promise;
// } catch(_) {
//   nativePromise = function() {};
// }

// /**
//  * Clones (copies) an Object using deep copying.
//  *
//  * This function supports circular references by default, but if you are certain
//  * there are no circular references in your object, you can save some CPU time
//  * by calling clone(obj, false).
//  *
//  * Caution: if `circular` is false and `parent` contains circular references,
//  * your program may enter an infinite loop and crash.
//  *
//  * @param `parent` - the object to be cloned
//  * @param `circular` - set to true if the object to be cloned may contain
//  *    circular references. (optional - true by default)
//  * @param `depth` - set to a number if the object is only to be cloned to
//  *    a particular depth. (optional - defaults to Infinity)
//  * @param `prototype` - sets the prototype to be used when cloning an object.
//  *    (optional - defaults to parent prototype).
//  * @param `includeNonEnumerable` - set to true if the non-enumerable properties
//  *    should be cloned as well. Non-enumerable properties on the prototype
//  *    chain will be ignored. (optional - false by default)
// */
// function clone(parent, circular, depth, prototype, includeNonEnumerable) {
//   if (typeof circular === 'object') {
//     depth = circular.depth;
//     prototype = circular.prototype;
//     includeNonEnumerable = circular.includeNonEnumerable;
//     circular = circular.circular;
//   }
//   // maintain two arrays for circular references, where corresponding parents
//   // and children have the same index
//   var allParents = [];
//   var allChildren = [];

//   var useBuffer = typeof Buffer != 'undefined';

//   if (typeof circular == 'undefined')
//     circular = true;

//   if (typeof depth == 'undefined')
//     depth = Infinity;

//   // recurse this function so we don't reset allParents and allChildren
//   function _clone(parent, depth) {
//     // cloning null always returns null
//     if (parent === null)
//       return null;

//     if (depth === 0)
//       return parent;

//     var child;
//     var proto;
//     if (typeof parent != 'object') {
//       return parent;
//     }

//     if (_instanceof(parent, nativeMap)) {
//       child = new nativeMap();
//     } else if (_instanceof(parent, nativeSet)) {
//       child = new nativeSet();
//     } else if (_instanceof(parent, nativePromise)) {
//       child = new nativePromise(function (resolve, reject) {
//         parent.then(function(value) {
//           resolve(_clone(value, depth - 1));
//         }, function(err) {
//           reject(_clone(err, depth - 1));
//         });
//       });
//     } else if (clone.__isArray(parent)) {
//       child = [];
//     } else if (clone.__isRegExp(parent)) {
//       child = new RegExp(parent.source, __getRegExpFlags(parent));
//       if (parent.lastIndex) child.lastIndex = parent.lastIndex;
//     } else if (clone.__isDate(parent)) {
//       child = new Date(parent.getTime());
//     } else if (useBuffer && Buffer.isBuffer(parent)) {
//       if (Buffer.allocUnsafe) {
//         // Node.js >= 4.5.0
//         child = Buffer.allocUnsafe(parent.length);
//       } else {
//         // Older Node.js versions
//         child = new Buffer(parent.length);
//       }
//       parent.copy(child);
//       return child;
//     } else if (_instanceof(parent, Error)) {
//       child = Object.create(parent);
//     } else {
//       if (typeof prototype == 'undefined') {
//         proto = Object.getPrototypeOf(parent);
//         child = Object.create(proto);
//       }
//       else {
//         child = Object.create(prototype);
//         proto = prototype;
//       }
//     }

//     if (circular) {
//       var index = allParents.indexOf(parent);

//       if (index != -1) {
//         return allChildren[index];
//       }
//       allParents.push(parent);
//       allChildren.push(child);
//     }

//     if (_instanceof(parent, nativeMap)) {
//       parent.forEach(function(value, key) {
//         var keyChild = _clone(key, depth - 1);
//         var valueChild = _clone(value, depth - 1);
//         child.set(keyChild, valueChild);
//       });
//     }
//     if (_instanceof(parent, nativeSet)) {
//       parent.forEach(function(value) {
//         var entryChild = _clone(value, depth - 1);
//         child.add(entryChild);
//       });
//     }

//     for (var i in parent) {
//       var attrs;
//       if (proto) {
//         attrs = Object.getOwnPropertyDescriptor(proto, i);
//       }

//       if (attrs && attrs.set == null) {
//         continue;
//       }
//       child[i] = _clone(parent[i], depth - 1);
//     }

//     if (Object.getOwnPropertySymbols) {
//       var symbols = Object.getOwnPropertySymbols(parent);
//       for (var i = 0; i < symbols.length; i++) {
//         // Don't need to worry about cloning a symbol because it is a primitive,
//         // like a number or string.
//         var symbol = symbols[i];
//         var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
//         if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
//           continue;
//         }
//         child[symbol] = _clone(parent[symbol], depth - 1);
//         if (!descriptor.enumerable) {
//           Object.defineProperty(child, symbol, {
//             enumerable: false
//           });
//         }
//       }
//     }

//     if (includeNonEnumerable) {
//       var allPropertyNames = Object.getOwnPropertyNames(parent);
//       for (var i = 0; i < allPropertyNames.length; i++) {
//         var propertyName = allPropertyNames[i];
//         var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
//         if (descriptor && descriptor.enumerable) {
//           continue;
//         }
//         child[propertyName] = _clone(parent[propertyName], depth - 1);
//         Object.defineProperty(child, propertyName, {
//           enumerable: false
//         });
//       }
//     }

//     return child;
//   }

//   return _clone(parent, depth);
// }

// /**
//  * Simple flat clone using prototype, accepts only objects, usefull for property
//  * override on FLAT configuration object (no nested props).
//  *
//  * USE WITH CAUTION! This may not behave as you wish if you do not know how this
//  * works.
//  */
// clone.clonePrototype = function clonePrototype(parent) {
//   if (parent === null)
//     return null;

//   var c = function () {};
//   c.prototype = parent;
//   return new c();
// };

// // private utility functions

// function __objToStr(o) {
//   return Object.prototype.toString.call(o);
// }
// clone.__objToStr = __objToStr;

// function __isDate(o) {
//   return typeof o === 'object' && __objToStr(o) === '[object Date]';
// }
// clone.__isDate = __isDate;

// function __isArray(o) {
//   return typeof o === 'object' && __objToStr(o) === '[object Array]';
// }
// clone.__isArray = __isArray;

// function __isRegExp(o) {
//   return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
// }
// clone.__isRegExp = __isRegExp;

// function __getRegExpFlags(re) {
//   var flags = '';
//   if (re.global) flags += 'g';
//   if (re.ignoreCase) flags += 'i';
//   if (re.multiline) flags += 'm';
//   return flags;
// }
// clone.__getRegExpFlags = __getRegExpFlags;

// return clone;
// })();

// if (typeof module === 'object' && module.exports) {
//   module.exports = clone;
// }

// }).call(this,require("buffer").Buffer)
// },{"buffer":101}],103:[function(require,module,exports){
// exports.read = function (buffer, offset, isLE, mLen, nBytes) {
//   var e, m
//   var eLen = nBytes * 8 - mLen - 1
//   var eMax = (1 << eLen) - 1
//   var eBias = eMax >> 1
//   var nBits = -7
//   var i = isLE ? (nBytes - 1) : 0
//   var d = isLE ? -1 : 1
//   var s = buffer[offset + i]

//   i += d

//   e = s & ((1 << (-nBits)) - 1)
//   s >>= (-nBits)
//   nBits += eLen
//   for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

//   m = e & ((1 << (-nBits)) - 1)
//   e >>= (-nBits)
//   nBits += mLen
//   for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

//   if (e === 0) {
//     e = 1 - eBias
//   } else if (e === eMax) {
//     return m ? NaN : ((s ? -1 : 1) * Infinity)
//   } else {
//     m = m + Math.pow(2, mLen)
//     e = e - eBias
//   }
//   return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
// }

// exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
//   var e, m, c
//   var eLen = nBytes * 8 - mLen - 1
//   var eMax = (1 << eLen) - 1
//   var eBias = eMax >> 1
//   var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
//   var i = isLE ? 0 : (nBytes - 1)
//   var d = isLE ? 1 : -1
//   var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

//   value = Math.abs(value)

//   if (isNaN(value) || value === Infinity) {
//     m = isNaN(value) ? 1 : 0
//     e = eMax
//   } else {
//     e = Math.floor(Math.log(value) / Math.LN2)
//     if (value * (c = Math.pow(2, -e)) < 1) {
//       e--
//       c *= 2
//     }
//     if (e + eBias >= 1) {
//       value += rt / c
//     } else {
//       value += rt * Math.pow(2, 1 - eBias)
//     }
//     if (value * c >= 2) {
//       e++
//       c /= 2
//     }

//     if (e + eBias >= eMax) {
//       m = 0
//       e = eMax
//     } else if (e + eBias >= 1) {
//       m = (value * c - 1) * Math.pow(2, mLen)
//       e = e + eBias
//     } else {
//       m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
//       e = 0
//     }
//   }

//   for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

//   e = (e << mLen) | m
//   eLen += mLen
//   for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

//   buffer[offset + i - d] |= s * 128
// }

// },{}],104:[function(require,module,exports){
// 'use strict';

// var asap = require('asap/raw');

// function noop() {}

// // States:
// //
// // 0 - pending
// // 1 - fulfilled with _value
// // 2 - rejected with _value
// // 3 - adopted the state of another promise, _value
// //
// // once the state is no longer pending (0) it is immutable

// // All `_` prefixed properties will be reduced to `_{random number}`
// // at build time to obfuscate them and discourage their use.
// // We don't use symbols or Object.defineProperty to fully hide them
// // because the performance isn't good enough.


// // to avoid using try/catch inside critical functions, we
// // extract them to here.
// var LAST_ERROR = null;
// var IS_ERROR = {};
// function getThen(obj) {
//   try {
//     return obj.then;
//   } catch (ex) {
//     LAST_ERROR = ex;
//     return IS_ERROR;
//   }
// }

// function tryCallOne(fn, a) {
//   try {
//     return fn(a);
//   } catch (ex) {
//     LAST_ERROR = ex;
//     return IS_ERROR;
//   }
// }
// function tryCallTwo(fn, a, b) {
//   try {
//     fn(a, b);
//   } catch (ex) {
//     LAST_ERROR = ex;
//     return IS_ERROR;
//   }
// }

// module.exports = Promise;

// function Promise(fn) {
//   if (typeof this !== 'object') {
//     throw new TypeError('Promises must be constructed via new');
//   }
//   if (typeof fn !== 'function') {
//     throw new TypeError('Promise constructor\'s argument is not a function');
//   }
//   this._40 = 0;
//   this._65 = 0;
//   this._55 = null;
//   this._72 = null;
//   if (fn === noop) return;
//   doResolve(fn, this);
// }
// Promise._37 = null;
// Promise._87 = null;
// Promise._61 = noop;

// Promise.prototype.then = function(onFulfilled, onRejected) {
//   if (this.constructor !== Promise) {
//     return safeThen(this, onFulfilled, onRejected);
//   }
//   var res = new Promise(noop);
//   handle(this, new Handler(onFulfilled, onRejected, res));
//   return res;
// };

// function safeThen(self, onFulfilled, onRejected) {
//   return new self.constructor(function (resolve, reject) {
//     var res = new Promise(noop);
//     res.then(resolve, reject);
//     handle(self, new Handler(onFulfilled, onRejected, res));
//   });
// }
// function handle(self, deferred) {
//   while (self._65 === 3) {
//     self = self._55;
//   }
//   if (Promise._37) {
//     Promise._37(self);
//   }
//   if (self._65 === 0) {
//     if (self._40 === 0) {
//       self._40 = 1;
//       self._72 = deferred;
//       return;
//     }
//     if (self._40 === 1) {
//       self._40 = 2;
//       self._72 = [self._72, deferred];
//       return;
//     }
//     self._72.push(deferred);
//     return;
//   }
//   handleResolved(self, deferred);
// }

// function handleResolved(self, deferred) {
//   asap(function() {
//     var cb = self._65 === 1 ? deferred.onFulfilled : deferred.onRejected;
//     if (cb === null) {
//       if (self._65 === 1) {
//         resolve(deferred.promise, self._55);
//       } else {
//         reject(deferred.promise, self._55);
//       }
//       return;
//     }
//     var ret = tryCallOne(cb, self._55);
//     if (ret === IS_ERROR) {
//       reject(deferred.promise, LAST_ERROR);
//     } else {
//       resolve(deferred.promise, ret);
//     }
//   });
// }
// function resolve(self, newValue) {
//   // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
//   if (newValue === self) {
//     return reject(
//       self,
//       new TypeError('A promise cannot be resolved with itself.')
//     );
//   }
//   if (
//     newValue &&
//     (typeof newValue === 'object' || typeof newValue === 'function')
//   ) {
//     var then = getThen(newValue);
//     if (then === IS_ERROR) {
//       return reject(self, LAST_ERROR);
//     }
//     if (
//       then === self.then &&
//       newValue instanceof Promise
//     ) {
//       self._65 = 3;
//       self._55 = newValue;
//       finale(self);
//       return;
//     } else if (typeof then === 'function') {
//       doResolve(then.bind(newValue), self);
//       return;
//     }
//   }
//   self._65 = 1;
//   self._55 = newValue;
//   finale(self);
// }

// function reject(self, newValue) {
//   self._65 = 2;
//   self._55 = newValue;
//   if (Promise._87) {
//     Promise._87(self, newValue);
//   }
//   finale(self);
// }
// function finale(self) {
//   if (self._40 === 1) {
//     handle(self, self._72);
//     self._72 = null;
//   }
//   if (self._40 === 2) {
//     for (var i = 0; i < self._72.length; i++) {
//       handle(self, self._72[i]);
//     }
//     self._72 = null;
//   }
// }

// function Handler(onFulfilled, onRejected, promise){
//   this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
//   this.onRejected = typeof onRejected === 'function' ? onRejected : null;
//   this.promise = promise;
// }

// /**
//  * Take a potentially misbehaving resolver function and make sure
//  * onFulfilled and onRejected are only called once.
//  *
//  * Makes no guarantees about asynchrony.
//  */
// function doResolve(fn, promise) {
//   var done = false;
//   var res = tryCallTwo(fn, function (value) {
//     if (done) return;
//     done = true;
//     resolve(promise, value);
//   }, function (reason) {
//     if (done) return;
//     done = true;
//     reject(promise, reason);
//   });
//   if (!done && res === IS_ERROR) {
//     done = true;
//     reject(promise, LAST_ERROR);
//   }
// }

// },{"asap/raw":99}],105:[function(require,module,exports){
// 'use strict';

// //This file contains the ES6 extensions to the core Promises/A+ API

// var Promise = require('./core.js');

// module.exports = Promise;

// /* Static Functions */

// var TRUE = valuePromise(true);
// var FALSE = valuePromise(false);
// var NULL = valuePromise(null);
// var UNDEFINED = valuePromise(undefined);
// var ZERO = valuePromise(0);
// var EMPTYSTRING = valuePromise('');

// function valuePromise(value) {
//   var p = new Promise(Promise._61);
//   p._65 = 1;
//   p._55 = value;
//   return p;
// }
// Promise.resolve = function (value) {
//   if (value instanceof Promise) return value;

//   if (value === null) return NULL;
//   if (value === undefined) return UNDEFINED;
//   if (value === true) return TRUE;
//   if (value === false) return FALSE;
//   if (value === 0) return ZERO;
//   if (value === '') return EMPTYSTRING;

//   if (typeof value === 'object' || typeof value === 'function') {
//     try {
//       var then = value.then;
//       if (typeof then === 'function') {
//         return new Promise(then.bind(value));
//       }
//     } catch (ex) {
//       return new Promise(function (resolve, reject) {
//         reject(ex);
//       });
//     }
//   }
//   return valuePromise(value);
// };

// Promise.all = function (arr) {
//   var args = Array.prototype.slice.call(arr);

//   return new Promise(function (resolve, reject) {
//     if (args.length === 0) return resolve([]);
//     var remaining = args.length;
//     function res(i, val) {
//       if (val && (typeof val === 'object' || typeof val === 'function')) {
//         if (val instanceof Promise && val.then === Promise.prototype.then) {
//           while (val._65 === 3) {
//             val = val._55;
//           }
//           if (val._65 === 1) return res(i, val._55);
//           if (val._65 === 2) reject(val._55);
//           val.then(function (val) {
//             res(i, val);
//           }, reject);
//           return;
//         } else {
//           var then = val.then;
//           if (typeof then === 'function') {
//             var p = new Promise(then.bind(val));
//             p.then(function (val) {
//               res(i, val);
//             }, reject);
//             return;
//           }
//         }
//       }
//       args[i] = val;
//       if (--remaining === 0) {
//         resolve(args);
//       }
//     }
//     for (var i = 0; i < args.length; i++) {
//       res(i, args[i]);
//     }
//   });
// };

// Promise.reject = function (value) {
//   return new Promise(function (resolve, reject) {
//     reject(value);
//   });
// };

// Promise.race = function (values) {
//   return new Promise(function (resolve, reject) {
//     values.forEach(function(value){
//       Promise.resolve(value).then(resolve, reject);
//     });
//   });
// };

// /* Prototype Methods */

// Promise.prototype['catch'] = function (onRejected) {
//   return this.then(null, onRejected);
// };

// },{"./core.js":104}],106:[function(require,module,exports){
// // should work in any browser without browserify

// if (typeof Promise.prototype.done !== 'function') {
//   Promise.prototype.done = function (onFulfilled, onRejected) {
//     var self = arguments.length ? this.then.apply(this, arguments) : this
//     self.then(null, function (err) {
//       setTimeout(function () {
//         throw err
//       }, 0)
//     })
//   }
// }
// },{}],107:[function(require,module,exports){
// // not "use strict" so we can declare global "Promise"

// var asap = require('asap');

// if (typeof Promise === 'undefined') {
//   Promise = require('./lib/core.js')
//   require('./lib/es6-extensions.js')
// }

// require('./polyfill-done.js');

// },{"./lib/core.js":104,"./lib/es6-extensions.js":105,"./polyfill-done.js":106,"asap":98}]},{},[2])(2)
// });

"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){if("object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.less=e()}}(function(){return function e(t,n,r){function i(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var c=n[s]={exports:{}};t[s][0].call(c.exports,function(e){var n=t[s][1][e];return i(n||e)},c,c.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t,n){var r=e("./utils").addDataAttr,i=e("./browser");t.exports=function(e,t){r(t,i.currentScript(e)),void 0===t.isFileProtocol&&(t.isFileProtocol=/^(file|(chrome|safari)(-extension)?|resource|qrc|app):/.test(e.location.protocol)),t.async=t.async||!1,t.fileAsync=t.fileAsync||!1,t.poll=t.poll||(t.isFileProtocol?1e3:1500),t.env=t.env||("127.0.0.1"==e.location.hostname||"0.0.0.0"==e.location.hostname||"localhost"==e.location.hostname||e.location.port&&e.location.port.length>0||t.isFileProtocol?"development":"production");var n=/!dumpLineNumbers:(comments|mediaquery|all)/.exec(e.location.hash);n&&(t.dumpLineNumbers=n[1]),void 0===t.useFileCache&&(t.useFileCache=!0),void 0===t.onReady&&(t.onReady=!0),t.relativeUrls&&(t.rewriteUrls="all")}},{"./browser":3,"./utils":11}],2:[function(e,t,n){function r(e){e.filename&&console.warn(e),i.async||a.removeChild(u)}e("promise/polyfill");var i=e("../less/default-options")();if(window.less)for(key in window.less)window.less.hasOwnProperty(key)&&(i[key]=window.less[key]);e("./add-default-options")(window,i),i.plugins=i.plugins||[],window.LESS_PLUGINS&&(i.plugins=i.plugins.concat(window.LESS_PLUGINS));var o=t.exports=e("./index")(window,i);window.less=o;var s,a,u;i.onReady&&"undefined"==typeof Jet&&(/!watch/.test(window.location.hash)&&o.watch(),i.async||(s="body { display: none !important }",a=document.head||document.getElementsByTagName("head")[0],u=document.createElement("style"),u.type="text/css",u.styleSheet?u.styleSheet.cssText=s:u.appendChild(document.createTextNode(s)),a.appendChild(u)),o.registerStylesheetsImmediately(),o.pageLoadFinished=o.refresh("development"===o.env).then(r,r))},{"../less/default-options":17,"./add-default-options":1,"./index":8,"promise/polyfill":107}],3:[function(e,t,n){var r=e("./utils");t.exports={createCSS:function(e,t,n){var i=n.href||"",o="less:"+(n.title||r.extractId(i)),s=e.getElementById(o),a=!1,u=e.createElement("style");u.setAttribute("type","text/css"),n.media&&u.setAttribute("media",n.media),u.id=o,u.styleSheet||(u.appendChild(e.createTextNode(t)),a=null!==s&&s.childNodes.length>0&&u.childNodes.length>0&&s.firstChild.nodeValue===u.firstChild.nodeValue);var l=e.getElementsByTagName("head")[0];if(null===s||!1===a){var c=n&&n.nextSibling||null;c?c.parentNode.insertBefore(u,c):l.appendChild(u)}if(s&&!1===a&&s.parentNode.removeChild(s),u.styleSheet)try{u.styleSheet.cssText=t}catch(e){throw new Error("Couldn't reassign styleSheet.cssText.")}},currentScript:function(e){var t=e.document;return t.currentScript||function(){var e=t.getElementsByTagName("script");return e[e.length-1]}()}}},{"./utils":11}],4:[function(e,t,n){t.exports=function(e,t,n){var r=null;if("development"!==t.env)try{r=void 0===e.localStorage?null:e.localStorage}catch(e){}return{setCSS:function(e,t,i,o){if(r){n.info("saving "+e+" to cache.");try{r.setItem(e,o),r.setItem(e+":timestamp",t),i&&r.setItem(e+":vars",JSON.stringify(i))}catch(t){n.error('failed to save "'+e+'" to local storage for caching.')}}},getCSS:function(e,t,n){var i=r&&r.getItem(e),o=r&&r.getItem(e+":timestamp"),s=r&&r.getItem(e+":vars");if(n=n||{},s=s||"{}",o&&t.lastModified&&new Date(t.lastModified).valueOf()===new Date(o).valueOf()&&JSON.stringify(n)===s)return i}}}},{}],5:[function(e,t,n){var r=e("./utils"),i=e("./browser");t.exports=function(e,t,n){function o(t,o){var s,a,u="less-error-message:"+r.extractId(o||""),l='<li><label>{line}</label><pre class="{class}">{content}</pre></li>',c=e.document.createElement("div"),f=[],h=t.filename||o,p=h.match(/([^\/]+(\?.*)?)$/)[1];c.id=u,c.className="less-error-message",a="<h3>"+(t.type||"Syntax")+"Error: "+(t.message||"There is an error in your .less file")+'</h3><p>in <a href="'+h+'">'+p+"</a> ";var d=function(e,t,n){void 0!==e.extract[t]&&f.push(l.replace(/\{line\}/,(parseInt(e.line,10)||0)+(t-1)).replace(/\{class\}/,n).replace(/\{content\}/,e.extract[t]))};t.line&&(d(t,0,""),d(t,1,"line"),d(t,2,""),a+="on line "+t.line+", column "+(t.column+1)+":</p><ul>"+f.join("")+"</ul>"),t.stack&&(t.extract||n.logLevel>=4)&&(a+="<br/>Stack Trace</br />"+t.stack.split("\n").slice(1).join("<br/>")),c.innerHTML=a,i.createCSS(e.document,[".less-error-message ul, .less-error-message li {","list-style-type: none;","margin-right: 15px;","padding: 4px 0;","margin: 0;","}",".less-error-message label {","font-size: 12px;","margin-right: 15px;","padding: 4px 0;","color: #cc7777;","}",".less-error-message pre {","color: #dd6666;","padding: 4px 0;","margin: 0;","display: inline-block;","}",".less-error-message pre.line {","color: #ff0000;","}",".less-error-message h3 {","font-size: 20px;","font-weight: bold;","padding: 15px 0 5px 0;","margin: 0;","}",".less-error-message a {","color: #10a","}",".less-error-message .error {","color: red;","font-weight: bold;","padding-bottom: 2px;","border-bottom: 1px dashed red;","}"].join("\n"),{title:"error-message"}),c.style.cssText=["font-family: Arial, sans-serif","border: 1px solid #e00","background-color: #eee","border-radius: 5px","-webkit-border-radius: 5px","-moz-border-radius: 5px","color: #e00","padding: 15px","margin-bottom: 15px"].join(";"),"development"===n.env&&(s=setInterval(function(){var t=e.document,n=t.body;n&&(t.getElementById(u)?n.replaceChild(c,t.getElementById(u)):n.insertBefore(c,n.firstChild),clearInterval(s))},10))}function s(t){var n=e.document.getElementById("less-error-message:"+r.extractId(t));n&&n.parentNode.removeChild(n)}function a(e){}function u(e){n.errorReporting&&"html"!==n.errorReporting?"console"===n.errorReporting?a(e):"function"==typeof n.errorReporting&&n.errorReporting("remove",e):s(e)}function l(e,r){var i="{line} {content}",o=e.filename||r,s=[],a=(e.type||"Syntax")+"Error: "+(e.message||"There is an error in your .less file")+" in "+o,u=function(e,t,n){void 0!==e.extract[t]&&s.push(i.replace(/\{line\}/,(parseInt(e.line,10)||0)+(t-1)).replace(/\{class\}/,n).replace(/\{content\}/,e.extract[t]))};e.line&&(u(e,0,""),u(e,1,"line"),u(e,2,""),a+=" on line "+e.line+", column "+(e.column+1)+":\n"+s.join("\n")),e.stack&&(e.extract||n.logLevel>=4)&&(a+="\nStack Trace\n"+e.stack),t.logger.error(a)}function c(e,t){n.errorReporting&&"html"!==n.errorReporting?"console"===n.errorReporting?l(e,t):"function"==typeof n.errorReporting&&n.errorReporting("add",e,t):o(e,t)}return{add:c,remove:u}}},{"./browser":3,"./utils":11}],6:[function(e,t,n){t.exports=function(t,n){var r=e("../less/environment/abstract-file-manager.js"),i={},o=function(){};return o.prototype=new r,o.prototype.alwaysMakePathsAbsolute=function(){return!0},o.prototype.join=function(e,t){return e?this.extractUrlParts(t,e).path:t},o.prototype.doXHR=function(e,r,i,o){function s(t,n,r){t.status>=200&&t.status<300?n(t.responseText,t.getResponseHeader("Last-Modified")):"function"==typeof r&&r(t.status,e)}var a=new XMLHttpRequest,u=!t.isFileProtocol||t.fileAsync;"function"==typeof a.overrideMimeType&&a.overrideMimeType("text/css"),n.debug("XHR: Getting '"+e+"'"),a.open("GET",e,u),a.setRequestHeader("Accept",r||"text/x-less, text/css; q=0.9, */*; q=0.5"),a.send(null),t.isFileProtocol&&!t.fileAsync?0===a.status||a.status>=200&&a.status<300?i(a.responseText):o(a.status,e):u?a.onreadystatechange=function(){4==a.readyState&&s(a,i,o)}:s(a,i,o)},o.prototype.supports=function(e,t,n,r){return!0},o.prototype.clearFileCache=function(){i={}},o.prototype.loadFile=function(e,t,n,r){t&&!this.isPathAbsolute(e)&&(e=t+e),e=n.ext?this.tryAppendExtension(e,n.ext):e,n=n||{};var o=this.extractUrlParts(e,window.location.href),s=o.url,a=this;return new Promise(function(e,t){if(n.useFileCache&&i[s])try{var r=i[s];return e({contents:r,filename:s,webInfo:{lastModified:new Date}})}catch(e){return t({filename:s,message:"Error loading file "+s+" error was "+e.message})}a.doXHR(s,n.mime,function(t,n){i[s]=t,e({contents:t,filename:s,webInfo:{lastModified:n}})},function(e,n){t({type:"File",message:"'"+n+"' wasn't found ("+e+")",href:s})})})},o}},{"../less/environment/abstract-file-manager.js":18}],7:[function(e,t,n){t.exports=function(){function t(){throw{type:"Runtime",message:"Image size functions are not supported in browser version of less"}}var n=e("./../less/functions/function-registry"),r={"image-size":function(e){return t(),-1},"image-width":function(e){return t(),-1},"image-height":function(e){return t(),-1}};n.addMultiple(r)}},{"./../less/functions/function-registry":27}],8:[function(e,t,n){var r=e("./utils").addDataAttr,i=e("./browser");t.exports=function(t,n){function o(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function s(e,t){var n=Array.prototype.slice.call(arguments,2);return function(){var r=n.concat(Array.prototype.slice.call(arguments,0));return e.apply(t,r)}}function a(e){for(var t,r=f.getElementsByTagName("style"),i=0;i<r.length;i++)if(t=r[i],t.type.match(y)){var a=o(n);a.modifyVars=e;var u=t.innerHTML||"";a.filename=f.location.href.replace(/#.*$/,""),h.render(u,a,s(function(e,t,n){t?m.add(t,"inline"):(e.type="text/css",e.styleSheet?e.styleSheet.cssText=n.css:e.innerHTML=n.css)},null,t))}}function u(e,t,i,s,a){function u(n){var r=n.contents,o=n.filename,a=n.webInfo,u={currentDirectory:v.getPath(o),filename:o,rootFilename:o,rewriteUrls:l.rewriteUrls};if(u.entryPath=u.currentDirectory,u.rootpath=l.rootpath||u.currentDirectory,a){a.remaining=s;var c=g.getCSS(o,a,l.modifyVars);if(!i&&c)return a.local=!0,void t(null,c,r,e,a,o)}m.remove(o),l.rootFileInfo=u,h.render(r,l,function(n,i){n?(n.href=o,t(n)):(g.setCSS(e.href,a.lastModified,l.modifyVars,i.css),t(null,i.css,r,e,a,o))})}var l=o(n);r(l,e),l.mime=e.type,a&&(l.modifyVars=a),v.loadFile(e.href,null,l,p).then(function(e){u(e)}).catch(function(e){console.log(e),t(e)})}function l(e,t,n){for(var r=0;r<h.sheets.length;r++)u(h.sheets[r],e,t,h.sheets.length-(r+1),n)}function c(){"development"===h.env&&(h.watchTimer=setInterval(function(){h.watchMode&&(v.clearFileCache(),l(function(e,n,r,o,s){e?m.add(e,e.href||o.href):n&&i.createCSS(t.document,n,o)}))},n.poll))}var f=t.document,h=e("../less")();h.options=n;var p=h.environment,d=e("./file-manager")(n,h.logger),v=new d;p.addFileManager(v),h.FileManager=d,h.PluginLoader=e("./plugin-loader"),e("./log-listener")(h,n);var m=e("./error-reporting")(t,h,n),g=h.cache=n.cache||e("./cache")(t,n,h.logger);e("./image-size")(h.environment),n.functions&&h.functions.functionRegistry.addMultiple(n.functions);var y=/^text\/(x-)?less$/;return h.watch=function(){return h.watchMode||(h.env="development",c()),this.watchMode=!0,!0},h.unwatch=function(){return clearInterval(h.watchTimer),this.watchMode=!1,!1},h.registerStylesheetsImmediately=function(){var e=f.getElementsByTagName("link");h.sheets=[];for(var t=0;t<e.length;t++)("stylesheet/less"===e[t].rel||e[t].rel.match(/stylesheet/)&&e[t].type.match(y))&&h.sheets.push(e[t])},h.registerStylesheets=function(){return new Promise(function(e,t){h.registerStylesheetsImmediately(),e()})},h.modifyVars=function(e){return h.refresh(!0,e,!1)},h.refresh=function(e,n,r){return(e||r)&&!1!==r&&v.clearFileCache(),new Promise(function(r,o){var s,u,c,f;s=u=new Date,f=h.sheets.length,0===f?(u=new Date,c=u-s,h.logger.info("Less has finished and no sheets were loaded."),r({startTime:s,endTime:u,totalMilliseconds:c,sheets:h.sheets.length})):l(function(e,n,a,l,p){if(e)return m.add(e,e.href||l.href),void o(e);p.local?h.logger.info("Loading "+l.href+" from cache."):h.logger.info("Rendered "+l.href+" successfully."),i.createCSS(t.document,n,l),h.logger.info("CSS for "+l.href+" generated in "+(new Date-u)+"ms"),f--,0===f&&(c=new Date-s,h.logger.info("Less has finished. CSS generated in "+c+"ms"),r({startTime:s,endTime:u,totalMilliseconds:c,sheets:h.sheets.length})),u=new Date},e,n),a(n)})},h.refreshStyles=a,h.toCss=function(e){if(""===e.trim())return"";var t=new h.ImportManager("","",""),n=h.parse(e,function(){}),r=new h.ParseTree(n,t),i=r.toCSS(t).css;return""===i?(console.warn("Jet.less 转换less代码出错，可能是less语法错误，请检查以下代码："),console.warn(e),e):i},"undefined"!=typeof Jet?Jet.less=h:t.$toCss=h.toCss,h}},{"../less":37,"./browser":3,"./cache":4,"./error-reporting":5,"./file-manager":6,"./image-size":7,"./log-listener":9,"./plugin-loader":10,"./utils":11}],9:[function(e,t,n){t.exports=function(e,t){t.logLevel=void 0!==t.logLevel?t.logLevel:"development"===t.env?3:1,t.loggers||(t.loggers=[{debug:function(e){t.logLevel>=4&&console.log(e)},info:function(e){t.logLevel>=3&&console.log(e)},warn:function(e){t.logLevel>=2&&console.warn(e)},error:function(e){t.logLevel>=1&&console.error(e)}}]);for(var n=0;n<t.loggers.length;n++)e.logger.addListener(t.loggers[n])}},{}],10:[function(e,t,n){var r=e("../less/environment/abstract-plugin-loader.js"),i=function(e){this.less=e};i.prototype=new r,i.prototype.loadPlugin=function(e,t,n,r,i){return new Promise(function(o,s){i.loadFile(e,t,n,r).then(o).catch(s)})},t.exports=i},{"../less/environment/abstract-plugin-loader.js":19}],11:[function(e,t,n){t.exports={extractId:function(e){return e.replace(/^[a-z-]+:\/+?[^\/]+/,"").replace(/[\?\&]livereload=\w+/,"").replace(/^\//,"").replace(/\.[a-zA-Z]+$/,"").replace(/[^\.\w-]+/g,"-").replace(/\./g,":")},addDataAttr:function(e,t){for(var n in t.dataset)if(t.dataset.hasOwnProperty(n))if("env"===n||"dumpLineNumbers"===n||"rootpath"===n||"errorReporting"===n)e[n]=t.dataset[n];else try{e[n]=JSON.parse(t.dataset[n])}catch(e){}}}},{}],12:[function(e,t,n){t.exports={Math:{ALWAYS:0,PARENS_DIVISION:1,PARENS:2,STRICT_LEGACY:3},RewriteUrls:{OFF:0,LOCAL:1,ALL:2}}},{}],13:[function(e,t,n){function r(e){return!/^(?:[a-z-]+:|\/|#)/i.test(e)}function i(e){return"."===e.charAt(0)}var o={};t.exports=o;var s=e("./constants"),a=function(e,t,n){if(e)for(var r=0;r<n.length;r++)e.hasOwnProperty(n[r])&&(t[n[r]]=e[n[r]])},u=["paths","rewriteUrls","rootpath","strictImports","insecure","dumpLineNumbers","compress","syncImport","chunkInput","mime","useFileCache","processImports","pluginManager"];o.Parse=function(e){a(e,this,u),"string"==typeof this.paths&&(this.paths=[this.paths])};var l=["paths","compress","ieCompat","math","strictUnits","sourceMap","importMultiple","urlArgs","javascriptEnabled","pluginManager","importantScope","rewriteUrls"];o.Eval=function(e,t){a(e,this,l),"string"==typeof this.paths&&(this.paths=[this.paths]),this.frames=t||[],this.importantScope=this.importantScope||[]},o.Eval.prototype.enterCalc=function(){this.calcStack||(this.calcStack=[]),this.calcStack.push(!0),this.inCalc=!0},o.Eval.prototype.exitCalc=function(){this.calcStack.pop(),this.calcStack||(this.inCalc=!1)},o.Eval.prototype.inParenthesis=function(){this.parensStack||(this.parensStack=[]),this.parensStack.push(!0)},o.Eval.prototype.outOfParenthesis=function(){this.parensStack.pop()},o.Eval.prototype.inCalc=!1,o.Eval.prototype.mathOn=!0,o.Eval.prototype.isMathOn=function(e){return!!this.mathOn&&(!!("/"!==e||this.math===s.Math.ALWAYS||this.parensStack&&this.parensStack.length)&&(!(this.math>s.Math.PARENS_DIVISION)||this.parensStack&&this.parensStack.length))},o.Eval.prototype.pathRequiresRewrite=function(e){return(this.rewriteUrls===s.RewriteUrls.LOCAL?i:r)(e)},o.Eval.prototype.rewritePath=function(e,t){var n;return t=t||"",n=this.normalizePath(t+e),i(e)&&r(t)&&!1===i(n)&&(n="./"+n),n},o.Eval.prototype.normalizePath=function(e){var t,n=e.split("/").reverse();for(e=[];0!==n.length;)switch(t=n.pop()){case".":break;case"..":0===e.length||".."===e[e.length-1]?e.push(t):e.pop();break;default:e.push(t)}return e.join("/")}},{"./constants":12}],14:[function(e,t,n){t.exports={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}},{}],15:[function(e,t,n){t.exports={colors:e("./colors"),unitConversions:e("./unit-conversions")}},{"./colors":14,"./unit-conversions":16}],16:[function(e,t,n){t.exports={length:{m:1,cm:.01,mm:.001,in:.0254,px:.0254/96,pt:.0254/72,pc:.0254/72*12},duration:{s:1,ms:.001},angle:{rad:1/(2*Math.PI),deg:1/360,grad:.0025,turn:1}}},{}],17:[function(e,t,n){t.exports=function(){return{javascriptEnabled:!1,depends:!1,compress:!1,lint:!1,paths:[],color:!0,strictImports:!1,insecure:!1,rootpath:"",rewriteUrls:!1,ieCompat:!1,math:0,strictUnits:!1,globalVars:null,modifyVars:null,urlArgs:""}}},{}],18:[function(e,t,n){var r=function(){};r.prototype.getPath=function(e){var t=e.lastIndexOf("?");return t>0&&(e=e.slice(0,t)),t=e.lastIndexOf("/"),t<0&&(t=e.lastIndexOf("\\")),t<0?"":e.slice(0,t+1)},r.prototype.tryAppendExtension=function(e,t){return/(\.[a-z]*$)|([\?;].*)$/.test(e)?e:e+t},r.prototype.tryAppendLessExtension=function(e){return this.tryAppendExtension(e,".less")},r.prototype.supportsSync=function(){return!1},r.prototype.alwaysMakePathsAbsolute=function(){return!1},r.prototype.isPathAbsolute=function(e){return/^(?:[a-z-]+:|\/|\\|#)/i.test(e)},r.prototype.join=function(e,t){return e?e+t:t},r.prototype.pathDiff=function(e,t){var n,r,i,o,s=this.extractUrlParts(e),a=this.extractUrlParts(t),u="";if(s.hostPart!==a.hostPart)return"";for(r=Math.max(a.directories.length,s.directories.length),n=0;n<r&&a.directories[n]===s.directories[n];n++);for(o=a.directories.slice(n),i=s.directories.slice(n),n=0;n<o.length-1;n++)u+="../";for(n=0;n<i.length-1;n++)u+=i[n]+"/";return u},r.prototype.extractUrlParts=function(e,t){var n,r,i=/^((?:[a-z-]+:)?\/{2}(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i,o=e.match(i),s={},a=[],u=[];if(!o)throw new Error("Could not parse sheet href - '"+e+"'");if(t&&(!o[1]||o[2])){if(!(r=t.match(i)))throw new Error("Could not parse page url - '"+t+"'");o[1]=o[1]||r[1]||"",o[2]||(o[3]=r[3]+o[3])}if(o[3])for(a=o[3].replace(/\\/g,"/").split("/"),n=0;n<a.length;n++)".."===a[n]?u.pop():"."!==a[n]&&u.push(a[n]);return s.hostPart=o[1],s.directories=u,s.rawPath=(o[1]||"")+a.join("/"),s.path=(o[1]||"")+u.join("/"),s.filename=o[4],s.fileUrl=s.path+(o[4]||""),s.url=s.fileUrl+(o[5]||""),s},t.exports=r},{}],19:[function(e,t,n){var r=e("../functions/function-registry"),i=e("../less-error"),o=function(){this.require=function(){return null}};o.prototype.evalPlugin=function(e,t,n,o,s){var a,u,l,c,f,h,p;f=t.pluginManager,s&&(h="string"==typeof s?s:s.filename);var d=(new this.less.FileManager).extractUrlParts(h).filename;if(h&&(l=f.get(h))){if(p=this.trySetOptions(l,h,d,o))return p;try{l.use&&l.use.call(this.context,l)}catch(e){return e.message=e.message||"Error during @plugin call",new i(e,n,h)}return l}c={exports:{},pluginManager:f,fileInfo:s},u=r.create();var v=function(e){l=e};try{a=new Function("module","require","registerPlugin","functions","tree","less","fileInfo",e),a(c,this.require(h),v,u,this.less.tree,this.less,s)}catch(e){return new i(e,n,h)}if(l||(l=c.exports),(l=this.validatePlugin(l,h,d))instanceof i)return l;if(!l)return new i({message:"Not a valid plugin"},n,h);if(l.imports=n,l.filename=h,(!l.minVersion||this.compareVersion("3.0.0",l.minVersion)<0)&&(p=this.trySetOptions(l,h,d,o)))return p;if(f.addPlugin(l,s.filename,u),l.functions=u.getLocalFunctions(),p=this.trySetOptions(l,h,d,o))return p;try{l.use&&l.use.call(this.context,l)}catch(e){return e.message=e.message||"Error during @plugin call",new i(e,n,h)}return l},o.prototype.trySetOptions=function(e,t,n,r){if(r&&!e.setOptions)return new i({message:"Options have been provided but the plugin "+n+" does not support any options."});try{e.setOptions&&e.setOptions(r)}catch(e){return new i(e)}},o.prototype.validatePlugin=function(e,t,n){return e?("function"==typeof e&&(e=new e),e.minVersion&&this.compareVersion(e.minVersion,this.less.version)<0?new i({message:"Plugin "+n+" requires version "+this.versionToString(e.minVersion)}):e):null},o.prototype.compareVersion=function(e,t){"string"==typeof e&&(e=e.match(/^(\d+)\.?(\d+)?\.?(\d+)?/),e.shift());for(var n=0;n<e.length;n++)if(e[n]!==t[n])return parseInt(e[n])>parseInt(t[n])?-1:1;return 0},o.prototype.versionToString=function(e){for(var t="",n=0;n<e.length;n++)t+=(t?".":"")+e[n];return t},o.prototype.printUsage=function(e){for(var t=0;t<e.length;t++){var n=e[t];n.printUsage&&n.printUsage()}},t.exports=o},{"../functions/function-registry":27,"../less-error":38}],20:[function(e,t,n){var r=e("../logger"),i=function(e,t){this.fileManagers=t||[],e=e||{};for(var n=["encodeBase64","mimeLookup","charsetLookup","getSourceMapGenerator"],r=[],i=r.concat(n),o=0;o<i.length;o++){var s=i[o],a=e[s];a?this[s]=a.bind(e):o<r.length&&this.warn("missing required function in environment - "+s)}};i.prototype.getFileManager=function(e,t,n,i,o){e||r.warn("getFileManager called with no filename.. Please report this issue. continuing."),null==t&&r.warn("getFileManager called with null directory.. Please report this issue. continuing.");var s=this.fileManagers;n.pluginManager&&(s=[].concat(s).concat(n.pluginManager.getFileManagers()));for(var a=s.length-1;a>=0;a--){var u=s[a];if(u[o?"supportsSync":"supports"](e,t,n,i))return u}return null},i.prototype.addFileManager=function(e){this.fileManagers.push(e)},i.prototype.clearFileManagers=function(){this.fileManagers=[]},t.exports=i},{"../logger":39}],21:[function(e,t,n){var r=e("./function-registry"),i=e("../tree/anonymous"),o=e("../tree/keyword");r.addMultiple({boolean:function(e){return e?o.True:o.False},if:function(e,t,n){return e?t:n||new i}})},{"../tree/anonymous":50,"../tree/keyword":70,"./function-registry":27}],22:[function(e,t,n){function r(e,t,n){var r,o,s,a,u=t.alpha,l=n.alpha,c=[];s=l+u*(1-l);for(var f=0;f<3;f++)r=t.rgb[f]/255,o=n.rgb[f]/255,a=e(r,o),s&&(a=(l*o+u*(r-l*(r+o-a)))/s),c[f]=255*a;return new i(c,s)}var i=e("../tree/color"),o=e("./function-registry"),s={multiply:function(e,t){return e*t},screen:function(e,t){return e+t-e*t},overlay:function(e,t){return e*=2,e<=1?s.multiply(e,t):s.screen(e-1,t)},softlight:function(e,t){var n=1,r=e;return t>.5&&(r=1,n=e>.25?Math.sqrt(e):((16*e-12)*e+4)*e),e-(1-2*t)*r*(n-e)},hardlight:function(e,t){return s.overlay(t,e)},difference:function(e,t){return Math.abs(e-t)},exclusion:function(e,t){return e+t-2*e*t},average:function(e,t){return(e+t)/2},negation:function(e,t){return 1-Math.abs(e+t-1)}};for(var a in s)s.hasOwnProperty(a)&&(r[a]=r.bind(null,s[a]));o.addMultiple(r)},{"../tree/color":55,"./function-registry":27}],23:[function(e,t,n){function r(e){return Math.min(1,Math.max(0,e))}function i(e,t){var n=a.hsla(t.h,t.s,t.l,t.a);if(n)return e.value&&/^(rgb|hsl)/.test(e.value)?n.value=e.value:n.value="rgb",n}function o(e){if(e instanceof u)return parseFloat(e.unit.is("%")?e.value/100:e.value);if("number"==typeof e)return e;throw{type:"Argument",message:"color functions take numbers as parameters"}}function s(e,t){return e instanceof u&&e.unit.is("%")?parseFloat(e.value*t/100):o(e)}var a,u=e("../tree/dimension"),l=e("../tree/color"),c=e("../tree/quoted"),f=e("../tree/anonymous"),h=e("./function-registry");a={rgb:function(e,t,n){var r=a.rgba(e,t,n,1);if(r)return r.value="rgb",r},rgba:function(e,t,n,r){try{if(e instanceof l)return r=t?o(t):e.alpha,new l(e.rgb,r,"rgba");var i=[e,t,n].map(function(e){return s(e,255)});return r=o(r),new l(i,r,"rgba")}catch(e){}},hsl:function(e,t,n){var r=a.hsla(e,t,n,1);if(r)return r.value="hsl",r},hsla:function(e,t,n,i){try{var s=function(e){return e=e<0?e+1:e>1?e-1:e,6*e<1?a+(u-a)*e*6:2*e<1?u:3*e<2?a+(u-a)*(2/3-e)*6:a};if(e instanceof l)return i=t?o(t):e.alpha,new l(e.rgb,i,"hsla");var a,u;e=o(e)%360/360,t=r(o(t)),n=r(o(n)),i=r(o(i)),u=n<=.5?n*(t+1):n+t-n*t,a=2*n-u;var c=[255*s(e+1/3),255*s(e),255*s(e-1/3)];return i=o(i),new l(c,i,"hsla")}catch(e){}},hsv:function(e,t,n){return a.hsva(e,t,n,1)},hsva:function(e,t,n,r){e=o(e)%360/360*360,t=o(t),n=o(n),r=o(r);var i,s;i=Math.floor(e/60%6),s=e/60-i;var u=[n,n*(1-t),n*(1-s*t),n*(1-(1-s)*t)],l=[[0,3,1],[2,0,1],[1,0,3],[1,2,0],[3,1,0],[0,1,2]];return a.rgba(255*u[l[i][0]],255*u[l[i][1]],255*u[l[i][2]],r)},hue:function(e){return new u(e.toHSL().h)},saturation:function(e){return new u(100*e.toHSL().s,"%")},lightness:function(e){return new u(100*e.toHSL().l,"%")},hsvhue:function(e){return new u(e.toHSV().h)},hsvsaturation:function(e){return new u(100*e.toHSV().s,"%")},hsvvalue:function(e){return new u(100*e.toHSV().v,"%")},red:function(e){return new u(e.rgb[0])},green:function(e){return new u(e.rgb[1])},blue:function(e){return new u(e.rgb[2])},alpha:function(e){return new u(e.toHSL().a)},luma:function(e){return new u(e.luma()*e.alpha*100,"%")},luminance:function(e){var t=.2126*e.rgb[0]/255+.7152*e.rgb[1]/255+.0722*e.rgb[2]/255;return new u(t*e.alpha*100,"%")},saturate:function(e,t,n){if(!e.rgb)return null;var o=e.toHSL();return void 0!==n&&"relative"===n.value?o.s+=o.s*t.value/100:o.s+=t.value/100,o.s=r(o.s),i(e,o)},desaturate:function(e,t,n){var o=e.toHSL();return void 0!==n&&"relative"===n.value?o.s-=o.s*t.value/100:o.s-=t.value/100,o.s=r(o.s),i(e,o)},lighten:function(e,t,n){var o=e.toHSL();return void 0!==n&&"relative"===n.value?o.l+=o.l*t.value/100:o.l+=t.value/100,o.l=r(o.l),i(e,o)},darken:function(e,t,n){var o=e.toHSL();return void 0!==n&&"relative"===n.value?o.l-=o.l*t.value/100:o.l-=t.value/100,o.l=r(o.l),i(e,o)},fadein:function(e,t,n){var o=e.toHSL();return void 0!==n&&"relative"===n.value?o.a+=o.a*t.value/100:o.a+=t.value/100,o.a=r(o.a),i(e,o)},fadeout:function(e,t,n){var o=e.toHSL();return void 0!==n&&"relative"===n.value?o.a-=o.a*t.value/100:o.a-=t.value/100,o.a=r(o.a),i(e,o)},fade:function(e,t){var n=e.toHSL();return n.a=t.value/100,n.a=r(n.a),i(e,n)},spin:function(e,t){var n=e.toHSL(),r=(n.h+t.value)%360;return n.h=r<0?360+r:r,i(e,n)},mix:function(e,t,n){e.toHSL&&t.toHSL||(console.log(t.type),console.dir(t)),n||(n=new u(50));var r=n.value/100,i=2*r-1,o=e.toHSL().a-t.toHSL().a,s=((i*o==-1?i:(i+o)/(1+i*o))+1)/2,a=1-s,c=[e.rgb[0]*s+t.rgb[0]*a,e.rgb[1]*s+t.rgb[1]*a,e.rgb[2]*s+t.rgb[2]*a],f=e.alpha*r+t.alpha*(1-r);return new l(c,f)},greyscale:function(e){return a.desaturate(e,new u(100))},contrast:function(e,t,n,r){if(!e.rgb)return null;if(void 0===n&&(n=a.rgba(255,255,255,1)),void 0===t&&(t=a.rgba(0,0,0,1)),t.luma()>n.luma()){var i=n;n=t,t=i}return r=void 0===r?.43:o(r),e.luma()<r?n:t},argb:function(e){return new f(e.toARGB())},color:function(e){if(e instanceof c&&/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})$/i.test(e.value)){var t=e.value.slice(1);return new l(t,void 0,"#"+t)}if(e instanceof l||(e=l.fromKeyword(e.value)))return e.value=void 0,e;throw{type:"Argument",message:"argument must be a color keyword or 3|4|6|8 digit hex e.g. #FFF"}},tint:function(e,t){return a.mix(a.rgb(255,255,255),e,t)},shade:function(e,t){return a.mix(a.rgb(0,0,0),e,t)}},h.addMultiple(a)},{"../tree/anonymous":50,"../tree/color":55,"../tree/dimension":62,"../tree/quoted":80,"./function-registry":27}],24:[function(e,t,n){t.exports=function(t){var n=e("../tree/quoted"),r=e("../tree/url"),i=e("../utils"),o=e("./function-registry"),s=function(e,t){return new r(t,e.index,e.currentFileInfo).eval(e.context)},a=e("../logger");o.add("data-uri",function(e,o){o||(o=e,e=null);var u=e&&e.value,l=o.value,c=this.currentFileInfo,f=c.rewriteUrls?c.currentDirectory:c.entryPath,h=l.indexOf("#"),p="";-1!==h&&(p=l.slice(h),l=l.slice(0,h));var d=i.clone(this.context);d.rawBuffer=!0;var v=t.getFileManager(l,f,d,t,!0);if(!v)return s(this,o);var m=!1;if(e)m=/;base64$/.test(u);else{if("image/svg+xml"===(u=t.mimeLookup(l)))m=!1;else{m=["US-ASCII","UTF-8"].indexOf(t.charsetLookup(u))<0}m&&(u+=";base64")}var g=v.loadFileSync(l,f,d,t);if(!g.contents)return a.warn("Skipped data-uri embedding of "+l+" because file not found"),s(this,o||e);var y=g.contents;if(m&&!t.encodeBase64)return s(this,o);y=m?t.encodeBase64(y):encodeURIComponent(y);var w="data:"+u+","+y+p;return w.length>=32768&&!1!==this.context.ieCompat?(a.warn("Skipped data-uri embedding of "+l+" because its size ("+w.length+" characters) exceeds IE8-safe 32768 characters!"),s(this,o||e)):new r(new n('"'+w+'"',w,!1,this.index,this.currentFileInfo),this.index,this.currentFileInfo)})}},{"../logger":39,"../tree/quoted":80,"../tree/url":85,"../utils":89,"./function-registry":27}],25:[function(e,t,n){var r=e("../tree/keyword"),i=e("./function-registry"),o={eval:function(){var e=this.value_,t=this.error_;if(t)throw t;if(null!=e)return e?r.True:r.False},value:function(e){this.value_=e},error:function(e){this.error_=e},reset:function(){this.value_=this.error_=null}};i.add("default",o.eval.bind(o)),
t.exports=o},{"../tree/keyword":70,"./function-registry":27}],26:[function(e,t,n){var r=e("../tree/expression"),i=function(e,t,n,r){this.name=e.toLowerCase(),this.index=n,this.context=t,this.currentFileInfo=r,this.func=t.frames[0].functionRegistry.get(this.name)};i.prototype.isValid=function(){return Boolean(this.func)},i.prototype.call=function(e){return Array.isArray(e)&&(e=e.filter(function(e){return"Comment"!==e.type}).map(function(e){if("Expression"===e.type){var t=e.value.filter(function(e){return"Comment"!==e.type});return 1===t.length?t[0]:new r(t)}return e})),this.func.apply(this,e)},t.exports=i},{"../tree/expression":64}],27:[function(e,t,n){function r(e){return{_data:{},add:function(e,t){e=e.toLowerCase(),this._data.hasOwnProperty(e),this._data[e]=t},addMultiple:function(e){Object.keys(e).forEach(function(t){this.add(t,e[t])}.bind(this))},get:function(t){return this._data[t]||e&&e.get(t)},getLocalFunctions:function(){return this._data},inherit:function(){return r(this)},create:function(e){return r(e)}}}t.exports=r(null)},{}],28:[function(e,t,n){t.exports=function(t){var n={functionRegistry:e("./function-registry"),functionCaller:e("./function-caller")};return e("./boolean"),e("./default"),e("./color"),e("./color-blending"),e("./data-uri")(t),e("./list"),e("./math"),e("./number"),e("./string"),e("./svg")(t),e("./types"),n}},{"./boolean":21,"./color":23,"./color-blending":22,"./data-uri":24,"./default":25,"./function-caller":26,"./function-registry":27,"./list":29,"./math":31,"./number":32,"./string":33,"./svg":34,"./types":35}],29:[function(e,t,n){var r=e("../tree/dimension"),i=e("../tree/declaration"),o=e("../tree/ruleset"),s=e("../tree/selector"),a=e("../tree/element"),u=e("./function-registry"),l=function(e){return Array.isArray(e.value)?e.value:Array(e)};u.addMultiple({_SELF:function(e){return e},extract:function(e,t){return t=t.value-1,l(e)[t]},length:function(e){return new r(l(e).length)},each:function(e,t){var n,u,l=0,c=[];u=e.value?Array.isArray(e.value)?e.value:[e.value]:e.ruleset?e.ruleset.rules:Array.isArray(e)?e:[e];var f="@value",h="@key",p="@index";return t.params?(f=t.params[0]&&t.params[0].name,h=t.params[1]&&t.params[1].name,p=t.params[2]&&t.params[2].name,t=t.rules):t=t.ruleset,u.forEach(function(e){l+=1;var u,d;e instanceof i?(u="string"==typeof e.name?e.name:e.name[0].value,d=e.value):(u=new r(l),d=e),n=t.rules.slice(0),f&&n.push(new i(f,d,!1,!1,this.index,this.currentFileInfo)),p&&n.push(new i(p,new r(l),!1,!1,this.index,this.currentFileInfo)),h&&n.push(new i(h,u,!1,!1,this.index,this.currentFileInfo)),c.push(new o([new s([new a("","&")])],n,t.strictImports,t.visibilityInfo()))}),new o([new s([new a("","&")])],c,t.strictImports,t.visibilityInfo()).eval(this.context)}})},{"../tree/declaration":60,"../tree/dimension":62,"../tree/element":63,"../tree/ruleset":81,"../tree/selector":82,"./function-registry":27}],30:[function(e,t,n){var r=e("../tree/dimension"),i=function(){};i._math=function(e,t,n){if(!(n instanceof r))throw{type:"Argument",message:"argument must be a number"};return null==t?t=n.unit:n=n.unify(),new r(e(parseFloat(n.value)),t)},t.exports=i},{"../tree/dimension":62}],31:[function(e,t,n){var r=e("./function-registry"),i=e("./math-helper.js"),o={ceil:null,floor:null,sqrt:null,abs:null,tan:"",sin:"",cos:"",atan:"rad",asin:"rad",acos:"rad"};for(var s in o)o.hasOwnProperty(s)&&(o[s]=i._math.bind(null,Math[s],o[s]));o.round=function(e,t){var n=void 0===t?0:t.value;return i._math(function(e){return e.toFixed(n)},null,e)},r.addMultiple(o)},{"./function-registry":27,"./math-helper.js":30}],32:[function(e,t,n){var r=e("../tree/dimension"),i=e("../tree/anonymous"),o=e("./function-registry"),s=e("./math-helper.js"),a=function(e,t){switch(t=Array.prototype.slice.call(t),t.length){case 0:throw{type:"Argument",message:"one or more arguments required"}}var n,o,s,a,u,l,c,f,h=[],p={};for(n=0;n<t.length;n++)if((s=t[n])instanceof r)if(a=""===s.unit.toString()&&void 0!==f?new r(s.value,f).unify():s.unify(),l=""===a.unit.toString()&&void 0!==c?c:a.unit.toString(),c=""!==l&&void 0===c||""!==l&&""===h[0].unify().unit.toString()?l:c,f=""!==l&&void 0===f?s.unit.toString():f,void 0!==(o=void 0!==p[""]&&""!==l&&l===c?p[""]:p[l]))u=""===h[o].unit.toString()&&void 0!==f?new r(h[o].value,f).unify():h[o].unify(),(e&&a.value<u.value||!e&&a.value>u.value)&&(h[o]=s);else{if(void 0!==c&&l!==c)throw{type:"Argument",message:"incompatible types"};p[l]=h.length,h.push(s)}else Array.isArray(t[n].value)&&Array.prototype.push.apply(t,Array.prototype.slice.call(t[n].value));return 1==h.length?h[0]:(t=h.map(function(e){return e.toCSS(this.context)}).join(this.context.compress?",":", "),new i((e?"min":"max")+"("+t+")"))};o.addMultiple({min:function(){return a(!0,arguments)},max:function(){return a(!1,arguments)},convert:function(e,t){return e.convertTo(t.value)},pi:function(){return new r(Math.PI)},mod:function(e,t){return new r(e.value%t.value,e.unit)},pow:function(e,t){if("number"==typeof e&&"number"==typeof t)e=new r(e),t=new r(t);else if(!(e instanceof r&&t instanceof r))throw{type:"Argument",message:"arguments must be numbers"};return new r(Math.pow(e.value,t.value),e.unit)},percentage:function(e){return s._math(function(e){return 100*e},"%",e)}})},{"../tree/anonymous":50,"../tree/dimension":62,"./function-registry":27,"./math-helper.js":30}],33:[function(e,t,n){var r=e("../tree/quoted"),i=e("../tree/anonymous"),o=e("../tree/javascript");e("./function-registry").addMultiple({e:function(e){return new i(e instanceof o?e.evaluated:e.value)},escape:function(e){return new i(encodeURI(e.value).replace(/=/g,"%3D").replace(/:/g,"%3A").replace(/#/g,"%23").replace(/;/g,"%3B").replace(/\(/g,"%28").replace(/\)/g,"%29"))},replace:function(e,t,n,i){var o=e.value;return n="Quoted"===n.type?n.value:n.toCSS(),o=o.replace(new RegExp(t.value,i?i.value:""),n),new r(e.quote||"",o,e.escaped)},"%":function(e){for(var t=Array.prototype.slice.call(arguments,1),n=e.value,i=0;i<t.length;i++)n=n.replace(/%[sda]/i,function(e){var n="Quoted"===t[i].type&&e.match(/s/i)?t[i].value:t[i].toCSS();return e.match(/[A-Z]$/)?encodeURIComponent(n):n});return n=n.replace(/%%/g,"%"),new r(e.quote||"",n,e.escaped)}})},{"../tree/anonymous":50,"../tree/javascript":68,"../tree/quoted":80,"./function-registry":27}],34:[function(e,t,n){t.exports=function(t){var n=e("../tree/dimension"),r=e("../tree/color"),i=e("../tree/expression"),o=e("../tree/quoted"),s=e("../tree/url");e("./function-registry").add("svg-gradient",function(e){function t(){throw{type:"Argument",message:"svg-gradient expects direction, start_color [start_position], [color position,]..., end_color [end_position] or direction, color list"}}var a,u,l,c,f,h,p,d,v="linear",m='x="0" y="0" width="1" height="1"',g={compress:!1},y=e.toCSS(g);switch(2==arguments.length?(arguments[1].value.length<2&&t(),a=arguments[1].value):arguments.length<3?t():a=Array.prototype.slice.call(arguments,1),y){case"to bottom":u='x1="0%" y1="0%" x2="0%" y2="100%"';break;case"to right":u='x1="0%" y1="0%" x2="100%" y2="0%"';break;case"to bottom right":u='x1="0%" y1="0%" x2="100%" y2="100%"';break;case"to top right":u='x1="0%" y1="100%" x2="100%" y2="0%"';break;case"ellipse":case"ellipse at center":v="radial",u='cx="50%" cy="50%" r="75%"',m='x="-50" y="-50" width="101" height="101"';break;default:throw{type:"Argument",message:"svg-gradient direction must be 'to bottom', 'to right', 'to bottom right', 'to top right' or 'ellipse at center'"}}for(l='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><'+v+'Gradient id="g" '+u+">",c=0;c<a.length;c+=1)a[c]instanceof i?(f=a[c].value[0],h=a[c].value[1]):(f=a[c],h=void 0),f instanceof r&&((0===c||c+1===a.length)&&void 0===h||h instanceof n)||t(),p=h?h.toCSS(g):0===c?"0%":"100%",d=f.alpha,l+='<stop offset="'+p+'" stop-color="'+f.toRGB()+'"'+(d<1?' stop-opacity="'+d+'"':"")+"/>";return l+="</"+v+"Gradient><rect "+m+' fill="url(#g)" /></svg>',l=encodeURIComponent(l),l="data:image/svg+xml,"+l,new s(new o("'"+l+"'",l,!1,this.index,this.currentFileInfo),this.index,this.currentFileInfo)})}},{"../tree/color":55,"../tree/dimension":62,"../tree/expression":64,"../tree/quoted":80,"../tree/url":85,"./function-registry":27}],35:[function(e,t,n){var r=e("../tree/keyword"),i=e("../tree/detached-ruleset"),o=e("../tree/dimension"),s=e("../tree/color"),a=e("../tree/quoted"),u=e("../tree/anonymous"),l=e("../tree/url"),c=e("../tree/operation"),f=e("./function-registry"),h=function(e,t){return e instanceof t?r.True:r.False},p=function(e,t){if(void 0===t)throw{type:"Argument",message:"missing the required second argument to isunit."};if("string"!=typeof(t="string"==typeof t.value?t.value:t))throw{type:"Argument",message:"Second argument to isunit should be a unit or a string."};return e instanceof o&&e.unit.is(t)?r.True:r.False};f.addMultiple({isruleset:function(e){return h(e,i)},iscolor:function(e){return h(e,s)},isnumber:function(e){return h(e,o)},isstring:function(e){return h(e,a)},iskeyword:function(e){return h(e,r)},isurl:function(e){return h(e,l)},ispixel:function(e){return p(e,"px")},ispercentage:function(e){return p(e,"%")},isem:function(e){return p(e,"em")},isunit:p,unit:function(e,t){if(!(e instanceof o))throw{type:"Argument",message:"the first argument to unit must be a number"+(e instanceof c?". Have you forgotten parenthesis?":"")};return t=t?t instanceof r?t.value:t.toCSS():"",new o(e.value,t)},"get-unit":function(e){return new u(e.unit)}})},{"../tree/anonymous":50,"../tree/color":55,"../tree/detached-ruleset":61,"../tree/dimension":62,"../tree/keyword":70,"../tree/operation":77,"../tree/quoted":80,"../tree/url":85,"./function-registry":27}],36:[function(e,t,n){var r=e("./contexts"),i=e("./parser/parser"),o=e("./less-error"),s=e("./utils"),a=("undefined"==typeof Promise?e("promise"):Promise,e("./logger"));t.exports=function(e){var t=function(e,t,n){this.less=e,this.rootFilename=n.filename,this.paths=t.paths||[],this.contents={},this.contentsIgnoredChars={},this.mime=t.mime,this.error=null,this.context=t,this.queue=[],this.files={}};return t.prototype.push=function(t,n,u,l,c){var f=this,h=this.context.pluginManager.Loader;this.queue.push(t);var p=function(e,n,r){f.queue.splice(f.queue.indexOf(t),1);var i=r===f.rootFilename;l.optional&&e?(c(null,{rules:[]},!1,null),a.info("The file "+r+" was skipped because it was not found and the import was marked optional.")):(f.files[r]||l.inline||(f.files[r]={root:n,options:l}),e&&!f.error&&(f.error=e),c(e,n,i,r))},d={rewriteUrls:this.context.rewriteUrls,entryPath:u.entryPath,rootpath:u.rootpath,rootFilename:u.rootFilename},v=e.getFileManager(t,u.currentDirectory,this.context,e);if(!v)return void p({message:"Could not find a file-manager for "+t});var m,g=function(e){var t,n=e.filename,s=e.contents.replace(/^\uFEFF/,"");d.currentDirectory=v.getPath(n),d.rewriteUrls&&(d.rootpath=v.join(f.context.rootpath||"",v.pathDiff(d.currentDirectory,d.entryPath)),!v.isPathAbsolute(d.rootpath)&&v.alwaysMakePathsAbsolute()&&(d.rootpath=v.join(d.entryPath,d.rootpath))),d.filename=n;var a=new r.Parse(f.context);a.processImports=!1,f.contents[n]=s,(u.reference||l.reference)&&(d.reference=!0),l.isPlugin?(t=h.evalPlugin(s,a,f,l.pluginArgs,d),t instanceof o?p(t,null,n):p(null,t,n)):l.inline?p(null,s,n):!f.files[n]||f.files[n].options.multiple||l.multiple?new i(a,f,d).parse(s,function(e,t){p(e,t,n)}):p(null,f.files[n].root,n)},y=s.clone(this.context);n&&(y.ext=l.isPlugin?".js":".less"),(m=l.isPlugin?h.loadPlugin(t,u.currentDirectory,y,e,v):v.loadFile(t,u.currentDirectory,y,e,function(e,t){e?p(e):g(t)}))&&m.then(g,p)},t}},{"./contexts":13,"./less-error":38,"./logger":39,"./parser/parser":44,"./utils":89,promise:void 0}],37:[function(e,t,n){t.exports=function(t,n){var r,i,o,s,a,u,l={version:[3,8,1],data:e("./data"),tree:e("./tree"),Environment:a=e("./environment/environment"),AbstractFileManager:e("./environment/abstract-file-manager"),AbstractPluginLoader:e("./environment/abstract-plugin-loader"),environment:t=new a(t,n),visitors:e("./visitors"),Parser:e("./parser/parser"),functions:e("./functions")(t),contexts:e("./contexts"),SourceMapOutput:r=e("./source-map-output")(t),SourceMapBuilder:i=e("./source-map-builder")(r,t),ParseTree:o=e("./parse-tree")(i),ImportManager:s=e("./import-manager")(t),render:e("./render")(t,o,s),parse:e("./parse")(t,o,s),LessError:e("./less-error"),transformTree:e("./transform-tree"),utils:e("./utils"),PluginManager:e("./plugin-manager"),logger:e("./logger")},c=function(e){return function(){var t=Object.create(e.prototype);return e.apply(t,Array.prototype.slice.call(arguments,0)),t}},f=Object.create(l);for(var h in l.tree)if("function"==typeof(u=l.tree[h]))f[h.toLowerCase()]=c(u);else{f[h]=Object.create(null);for(var p in u)f[h][p.toLowerCase()]=c(u[p])}return f}},{"./contexts":13,"./data":15,"./environment/abstract-file-manager":18,"./environment/abstract-plugin-loader":19,"./environment/environment":20,"./functions":28,"./import-manager":36,"./less-error":38,"./logger":39,"./parse":41,"./parse-tree":40,"./parser/parser":44,"./plugin-manager":45,"./render":46,"./source-map-builder":47,"./source-map-output":48,"./transform-tree":49,"./tree":67,"./utils":89,"./visitors":93}],38:[function(e,t,n){var r=e("./utils"),i=t.exports=function(e,t,n){Error.call(this);var i=e.filename||n;if(this.message=e.message,this.stack=e.stack,t&&i){var o=t.contents[i],s=r.getLocation(e.index,o),a=s.line,u=s.column,l=e.call&&r.getLocation(e.call,o).line,c=o?o.split("\n"):"";if(this.type=e.type||"Syntax",this.filename=i,this.index=e.index,this.line="number"==typeof a?a+1:null,this.column=u,!this.line&&this.stack){var f=this.stack.match(/(<anonymous>|Function):(\d+):(\d+)/);f&&(f[2]&&(this.line=parseInt(f[2])-2),f[3]&&(this.column=parseInt(f[3])))}this.callLine=l+1,this.callExtract=c[l],this.extract=[c[this.line-2],c[this.line-1],c[this.line]]}};if(void 0===Object.create){var o=function(){};o.prototype=Error.prototype,i.prototype=new o}else i.prototype=Object.create(Error.prototype);i.prototype.constructor=i,i.prototype.toString=function(e){e=e||{};var t="",n=this.extract||[],r=[],i=function(e){return e};if(e.stylize){var o=_typeof(e.stylize);if("function"!==o)throw Error("options.stylize should be a function, got a "+o+"!");i=e.stylize}if(null!==this.line){if("string"==typeof n[0]&&r.push(i(this.line-1+" "+n[0],"grey")),"string"==typeof n[1]){var s=this.line+" ";n[1]&&(s+=n[1].slice(0,this.column)+i(i(i(n[1].substr(this.column,1),"bold")+n[1].slice(this.column+1),"red"),"inverse")),r.push(s)}"string"==typeof n[2]&&r.push(i(this.line+1+" "+n[2],"grey")),r=r.join("\n")+i("","reset")+"\n"}return t+=i(this.type+"Error: "+this.message,"red"),this.filename&&(t+=i(" in ","red")+this.filename),this.line&&(t+=i(" on line "+this.line+", column "+(this.column+1)+":","grey")),t+="\n"+r,this.callLine&&(t+=i("from ","red")+(this.filename||"")+"/n",t+=i(this.callLine,"grey")+" "+this.callExtract+"/n"),t}},{"./utils":89}],39:[function(e,t,n){t.exports={error:function(e){this._fireEvent("error",e)},warn:function(e){this._fireEvent("warn",e)},info:function(e){this._fireEvent("info",e)},debug:function(e){this._fireEvent("debug",e)},addListener:function(e){this._listeners.push(e)},removeListener:function(e){for(var t=0;t<this._listeners.length;t++)if(this._listeners[t]===e)return void this._listeners.splice(t,1)},_fireEvent:function(e,t){for(var n=0;n<this._listeners.length;n++){var r=this._listeners[n][e];r&&r(t)}},_listeners:[]}},{}],40:[function(e,t,n){var r=e("./less-error"),i=e("./transform-tree"),o=e("./logger");t.exports=function(e){var t=function(e,t){this.root=e,this.imports=t};return t.prototype.toCSS=function(t){var n,s,a={};try{n=i(this.root,t)}catch(e){throw new r(e,this.imports)}try{var u=Boolean(t.compress);u&&o.warn("The compress option has been deprecated. We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.");var l={compress:u,dumpLineNumbers:t.dumpLineNumbers,strictUnits:Boolean(t.strictUnits),numPrecision:8};t.sourceMap?(s=new e(t.sourceMap),a.css=s.toCSS(n,l,this.imports)):a.css=n.toCSS(l)}catch(e){throw new r(e,this.imports)}if(t.pluginManager)for(var c=t.pluginManager.getPostProcessors(),f=0;f<c.length;f++)a.css=c[f].process(a.css,{sourceMap:s,options:t,imports:this.imports});t.sourceMap&&(a.map=s.getExternalSourceMap()),a.imports=[];for(var h in this.imports.files)this.imports.files.hasOwnProperty(h)&&h!==this.imports.rootFilename&&a.imports.push(h);return a},t}},{"./less-error":38,"./logger":39,"./transform-tree":49}],41:[function(e,t,n){var r,i=e("./contexts"),o=e("./parser/parser"),s=e("./plugin-manager"),a=e("./less-error"),u=e("./utils");t.exports=function(t,n,l){return function t(n,c,f){if("function"==typeof c?(f=c,c=u.copyOptions(this.options,{})):c=u.copyOptions(this.options,c||{}),f){var h,p,d=new s(this,!c.reUsePluginManager);if(c.pluginManager=d,h=new i.Parse(c),c.rootFileInfo)p=c.rootFileInfo;else{var v=c.filename||"input",m=v.replace(/[^\/\\]*$/,"");p={filename:v,rewriteUrls:h.rewriteUrls,rootpath:h.rootpath||"",currentDirectory:m,entryPath:m,rootFilename:v},p.rootpath&&"/"!==p.rootpath.slice(-1)&&(p.rootpath+="/")}var g=new l(this,h,p);return this.importManager=g,c.plugins&&c.plugins.forEach(function(e){var t,n;if(e.fileContent){if(n=e.fileContent.replace(/^\uFEFF/,""),(t=d.Loader.evalPlugin(n,h,g,e.options,e.filename))instanceof a)return f(t)}else d.addPlugin(e)}),new o(h,g,p).parse(n,function(e,t){if(e)return f(e);f(null,t,g,c)},c)}r||(r="undefined"==typeof Promise?e("promise"):Promise);var y=this;return new r(function(e,r){t.call(y,n,c,function(t,n){t?r(t):e(n)})})}}},{"./contexts":13,"./less-error":38,"./parser/parser":44,"./plugin-manager":45,"./utils":89,promise:void 0}],42:[function(e,t,n){t.exports=function(e,t){function n(t){var n=a-m;n<512&&!t||!n||(v.push(e.slice(m,a+1)),m=a+1)}var r,i,o,s,a,u,l,c,f,h=e.length,p=0,d=0,v=[],m=0;for(a=0;a<h;a++)if(!((l=e.charCodeAt(a))>=97&&l<=122||l<34))switch(l){case 40:d++,i=a;continue;case 41:if(--d<0)return t("missing opening `(`",a);continue;case 59:d||n();continue;case 123:p++,r=a;continue;case 125:if(--p<0)return t("missing opening `{`",a);p||d||n();continue;case 92:if(a<h-1){a++;continue}return t("unescaped `\\`",a);case 34:case 39:case 96:for(f=0,u=a,a+=1;a<h;a++)if(!((c=e.charCodeAt(a))>96)){if(c==l){f=1;break}if(92==c){if(a==h-1)return t("unescaped `\\`",a);a++}}if(f)continue;return t("unmatched `"+String.fromCharCode(l)+"`",u);case 47:if(d||a==h-1)continue;if(47==(c=e.charCodeAt(a+1)))for(a+=2;a<h&&(!((c=e.charCodeAt(a))<=13)||10!=c&&13!=c);a++);else if(42==c){for(o=u=a,a+=2;a<h-1&&(c=e.charCodeAt(a),125==c&&(s=a),42!=c||47!=e.charCodeAt(a+1));a++);if(a==h-1)return t("missing closing `*/`",u);a++}continue;case 42:if(a<h-1&&47==e.charCodeAt(a+1))return t("unmatched `/*`",a);continue}return 0!==p?o>r&&s>o?t("missing closing `}` or `*/`",r):t("missing closing `}`",r):0!==d?t("missing closing `)`",i):(n(!0),v)}},{}],43:[function(e,t,n){var r=e("./chunker");t.exports=function(){function e(r){for(var i,o,l,m=c.i,g=n,y=c.i-u,w=c.i+a.length-y,b=c.i+=r,x=t;c.i<w;c.i++){if(i=x.charCodeAt(c.i),c.autoCommentAbsorb&&i===v){if("/"===(o=x.charAt(c.i+1))){l={index:c.i,isLineComment:!0};var S=x.indexOf("\n",c.i+2);S<0&&(S=w),c.i=S,l.text=x.substr(l.index,c.i-l.index),c.commentStore.push(l);continue}if("*"===o){var I=x.indexOf("*/",c.i+2);if(I>=0){l={index:c.i,text:x.substr(c.i,I+2-c.i),isLineComment:!1},c.i+=l.text.length-1,c.commentStore.push(l);continue}}break}if(i!==f&&i!==p&&i!==h&&i!==d)break}if(a=a.slice(r+c.i-b+y),u=c.i,!a.length){if(n<s.length-1)return a=s[++n],e(0),!0;c.finished=!0}return m!==c.i||g!==n}var t,n,i,o,s,a,u,l=[],c={},f=32,h=9,p=10,d=13,v=47;return c.save=function(){u=c.i,l.push({current:a,i:c.i,j:n})},c.restore=function(e){(c.i>i||c.i===i&&e&&!o)&&(i=c.i,o=e);var t=l.pop();a=t.current,u=c.i=t.i,n=t.j},c.forget=function(){l.pop()},c.isWhitespace=function(e){var n=c.i+(e||0),r=t.charCodeAt(n);return r===f||r===d||r===h||r===p},c.$re=function(t){c.i>u&&(a=a.slice(c.i-u),u=c.i);var n=t.exec(a);return n?(e(n[0].length),"string"==typeof n?n:1===n.length?n[0]:n):null},c.$char=function(n){return t.charAt(c.i)!==n?null:(e(1),n)},c.$str=function(n){for(var r=n.length,i=0;i<r;i++)if(t.charAt(c.i+i)!==n.charAt(i))return null;return e(r),n},c.$quoted=function(n){var r=n||c.i,i=t.charAt(r);if("'"===i||'"'===i){for(var o=t.length,s=r,a=1;a+s<o;a++){switch(t.charAt(a+s)){case"\\":a++;continue;case"\r":case"\n":break;case i:var u=t.substr(s,a+1);return n||0===n?[i,u]:(e(a+1),u)}}return null}},c.$parseUntil=function(n){var r,i="",o=null,s=!1,a=0,u=[],l=[],f=t.length,h=c.i,p=c.i,d=c.i,v=!0;r="string"==typeof n?function(e){return e===n}:function(e){return n.test(e)};do{var m=t.charAt(d);if(0===a&&r(m))o=t.substr(p,d-p),o?l.push(o):l.push(" "),o=l,e(d-h),v=!1;else{if(s){"*"===m&&"/"===t.charAt(d+1)&&(d++,a--,s=!1),d++;continue}switch(m){case"\\":d++,m=t.charAt(d),l.push(t.substr(p,d-p+1)),p=d+1;break;case"/":"*"===t.charAt(d+1)&&(d++,s=!0,a++);break;case"'":case'"':i=c.$quoted(d),i?(l.push(t.substr(p,d-p),i),d+=i[1].length-1,p=d+1):(e(d-h),o=m,v=!1);break;case"{":u.push("}"),a++;break;case"(":u.push(")"),a++;break;case"[":u.push("]"),a++;break;case"}":case")":case"]":var g=u.pop();m===g?a--:(e(d-h),o=g,v=!1)}d++,d>f&&(v=!1)}m}while(v);return o||null},c.autoCommentAbsorb=!0,c.commentStore=[],c.finished=!1,c.peek=function(e){if("string"==typeof e){for(var n=0;n<e.length;n++)if(t.charAt(c.i+n)!==e.charAt(n))return!1;return!0}return e.test(a)},c.peekChar=function(e){return t.charAt(c.i)===e},c.currentChar=function(){return t.charAt(c.i)},c.prevChar=function(){return t.charAt(c.i-1)},c.getInput=function(){return t},c.peekNotNumeric=function(){var e=t.charCodeAt(c.i);return e>57||e<43||e===v||44===e},c.start=function(o,l,f){t=o,c.i=n=u=i=0,s=l?r(o,f):[o],a=s[0],e(0)},c.end=function(){var e,n=c.i>=t.length;return c.i<i&&(e=o,c.i=i),{isFinished:n,furthest:c.i,furthestPossibleErrorMessage:e,furthestReachedEnd:c.i>=t.length-1,furthestChar:t[c.i]}},c}},{"./chunker":42}],44:[function(e,t,n){var r=e("../less-error"),i=e("../tree"),o=e("../visitors"),s=e("./parser-input"),a=e("../utils"),u=e("../functions/function-registry"),l=function e(t,n,l){function c(e,t){throw new r({index:m.i,filename:l.filename,type:t||"Syntax",message:e},n)}function f(e,t){var n=e instanceof Function?e.call(v):m.$re(e);if(n)return n;c(t||("string"==typeof e?"expected '"+e+"' got '"+m.currentChar()+"'":"unexpected token"))}function h(e,t){if(m.$char(e))return e;c(t||"expected '"+e+"' got '"+m.currentChar()+"'")}function p(e){var t=l.filename;return{lineNumber:a.getLocation(e,m.getInput()).line+1,fileName:t}}function d(e,t,i,o,s){var a,u=[],l=m;try{l.start(e,!1,function(e,t){s({message:e,index:t+i})});for(var c,f,h=0;c=t[h];h++)f=l.i,a=v[c](),a?(a._index=f+i,a._fileInfo=o,u.push(a)):u.push(null);l.end().isFinished?s(null,u):s(!0,null)}catch(e){throw new r({index:e.index+i,message:e.message},n,o.filename)}}var v,m=s();return{parserInput:m,imports:n,fileInfo:l,parseNode:d,parse:function(s,a,c){var f,h,p,d,v=null,g="";if(h=c&&c.globalVars?e.serializeVars(c.globalVars)+"\n":"",p=c&&c.modifyVars?"\n"+e.serializeVars(c.modifyVars):"",t.pluginManager)for(var y=t.pluginManager.getPreProcessors(),w=0;w<y.length;w++)s=y[w].process(s,{context:t,imports:n,fileInfo:l});(h||c&&c.banner)&&(g=(c&&c.banner?c.banner:"")+h,d=n.contentsIgnoredChars,d[l.filename]=d[l.filename]||0,d[l.filename]+=g.length),s=s.replace(/\r\n?/g,"\n"),s=g+s.replace(/^\uFEFF/,"")+p,n.contents[l.filename]=s;try{m.start(s,t.chunkInput,function(e,t){throw new r({index:t,type:"Parse",message:e,filename:l.filename},n)}),i.Node.prototype.parse=this,f=new i.Ruleset(null,this.parsers.primary()),i.Node.prototype.rootNode=f,f.root=!0,f.firstRoot=!0,f.functionRegistry=u.inherit()}catch(e){return a(new r(e,n,l.filename))}var b=m.end();if(!b.isFinished){var x=b.furthestPossibleErrorMessage;x||(x="Unrecognised input","}"===b.furthestChar?x+=". Possibly missing opening '{'":")"===b.furthestChar?x+=". Possibly missing opening '('":b.furthestReachedEnd&&(x+=". Possibly missing something")),v=new r({type:"Parse",message:x,index:b.furthest,filename:l.filename},n)}var S=function(e){return e=v||e||n.error,e?(e instanceof r||(e=new r(e,n,l.filename)),a(e)):a(null,f)};return!1!==t.processImports?(new o.ImportVisitor(n,S).run(f),f):S()},parsers:v={primary:function(){for(var e,t=this.mixin,n=[];;){for(;;){if(!(e=this.comment()))break;n.push(e)}if(m.finished)break;if(m.peek("}"))break;if(e=this.extendRule())n=n.concat(e);else if(e=t.definition()||this.declaration()||this.ruleset()||t.call(!1,!1)||this.variableCall()||this.entities.call()||this.atrule())n.push(e);else{for(var r=!1;m.$char(";");)r=!0;if(!r)break}}return n},comment:function(){if(m.commentStore.length){var e=m.commentStore.shift();return new i.Comment(e.text,e.isLineComment,e.index,l)}},entities:{mixinLookup:function(){return v.mixin.call(!0,!0)},quoted:function(e){var t,n=m.i,r=!1;if(m.save(),m.$char("~"))r=!0;else if(e)return void m.restore();return(t=m.$quoted())?(m.forget(),new i.Quoted(t.charAt(0),t.substr(1,t.length-2),r,n,l)):void m.restore()},keyword:function(){var e=m.$char("%")||m.$re(/^\[?(?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+\]?/);if(e)return i.Color.fromKeyword(e)||new i.Keyword(e)},call:function(){var e,t,n,r=m.i;if(!m.peek(/^url\(/i))return m.save(),(e=m.$re(/^([\w-]+|%|progid:[\w\.]+)\(/))?(e=e[1],(n=this.customFuncCall(e))&&(t=n.parse())&&n.stop?(m.forget(),t):(t=this.arguments(t),m.$char(")")?(m.forget(),new i.Call(e,t,r,l)):void m.restore("Could not parse call arguments or missing ')'"))):void m.forget()},customFuncCall:function(e){function t(e,t){return{parse:e,stop:t}}function n(){return[f(v.condition,"expected condition")]}return{alpha:t(v.ieAlpha,!0),boolean:t(n),if:t(n)}[e.toLowerCase()]},arguments:function(e){var t,n,r=e||[],o=[];for(m.save();;){if(e)e=!1;else{if(!(n=v.detachedRuleset()||this.assignment()||v.expression()))break;n.value&&1==n.value.length&&(n=n.value[0]),r.push(n)}m.$char(",")||(m.$char(";")||t)&&(t=!0,n=r.length<1?r[0]:new i.Value(r),o.push(n),r=[])}return m.forget(),t?o:r},literal:function(){return this.dimension()||this.color()||this.quoted()||this.unicodeDescriptor()},assignment:function(){var e,t;return m.save(),(e=m.$re(/^\w+(?=\s?=)/i))&&m.$char("=")&&(t=v.entity())?(m.forget(),new i.Assignment(e,t)):void m.restore()},url:function(){var e,t=m.i;return m.autoCommentAbsorb=!1,m.$str("url(")?(e=this.quoted()||this.variable()||this.property()||m.$re(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/)||"",m.autoCommentAbsorb=!0,h(")"),new i.URL(null!=e.value||e instanceof i.Variable||e instanceof i.Property?e:new i.Anonymous(e,t),t,l)):void(m.autoCommentAbsorb=!0)},variable:function(){var e,t,n=m.i;if(m.save(),"@"===m.currentChar()&&(t=m.$re(/^@@?[\w-]+/))){if("("===(e=m.currentChar())||"["===e&&!m.prevChar().match(/^\s/)){var r=v.variableCall(t);if(r)return m.forget(),r}return m.forget(),new i.Variable(t,n,l)}m.restore()},variableCurly:function(){var e,t=m.i;if("@"===m.currentChar()&&(e=m.$re(/^@\{([\w-]+)\}/)))return new i.Variable("@"+e[1],t,l)},property:function(){var e,t=m.i;if("$"===m.currentChar()&&(e=m.$re(/^\$[\w-]+/)))return new i.Property(e,t,l)},propertyCurly:function(){var e,t=m.i;if("$"===m.currentChar()&&(e=m.$re(/^\$\{([\w-]+)\}/)))return new i.Property("$"+e[1],t,l)},color:function(){var e;if("#"===m.currentChar()&&(e=m.$re(/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})/)))return new i.Color(e[1],void 0,e[0])},colorKeyword:function(){m.save();var e=m.autoCommentAbsorb;m.autoCommentAbsorb=!1;var t=m.$re(/^[_A-Za-z-][_A-Za-z0-9-]+/);if(m.autoCommentAbsorb=e,!t)return void m.forget();m.restore();var n=i.Color.fromKeyword(t);return n?(m.$str(t),n):void 0},dimension:function(){if(!m.peekNotNumeric()){var e=m.$re(/^([+-]?\d*\.?\d+)(%|[a-z_]+)?/i);return e?new i.Dimension(e[1],e[2]):void 0}},unicodeDescriptor:function(){var e;if(e=m.$re(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/))return new i.UnicodeDescriptor(e[0])},javascript:function(){var e,t=m.i;m.save();var n=m.$char("~");return m.$char("`")?(e=m.$re(/^[^`]*`/))?(m.forget(),new i.JavaScript(e.substr(0,e.length-1),Boolean(n),t,l)):void m.restore("invalid javascript definition"):void m.restore()}},variable:function(){var e;if("@"===m.currentChar()&&(e=m.$re(/^(@[\w-]+)\s*:/)))return e[1]},variableCall:function(e){var t,n,r=m.i,o=!!e,s=e;if(m.save(),s||"@"===m.currentChar()&&(s=m.$re(/^(@[\w-]+)(\(\s*\))?/))){if(!(t=this.mixin.ruleLookups())&&(o&&"()"!==m.$str("()")||"()"!==s[2]))return void m.restore("Missing '[...]' lookup in variable call");o||(s=s[1]),t&&v.important()&&(n=!0);var a=new i.VariableCall(s,r,l);return!o&&v.end()?(m.forget(),a):(m.forget(),new i.NamespaceValue(a,t,n,r,l))}m.restore()},extend:function(e){var t,n,r,o,s,a=m.i;if(m.$str(e?"&:extend(":":extend(")){do{for(r=null,t=null;!(r=m.$re(/^(all)(?=\s*(\)|,))/))&&(n=this.element());)t?t.push(n):t=[n];r=r&&r[1],t||c("Missing target selector for :extend()."),s=new i.Extend(new i.Selector(t),r,a,l),o?o.push(s):o=[s]}while(m.$char(","));return f(/^\)/),e&&f(/^;/),o}},extendRule:function(){return this.extend(!0)},mixin:{call:function(e,t){var n,r,o,s,a=m.currentChar(),u=!1,c=m.i;if("."===a||"#"===a){if(m.save(),r=this.elements()){if(m.$char("(")&&(o=this.args(!0).args,h(")"),s=!0),!1!==t&&(n=this.ruleLookups()),!0===t&&!n)return void m.restore();if(e&&!n&&!s)return void m.restore();if(!e&&v.important()&&(u=!0),e||v.end()){m.forget();var f=new i.mixin.Call(r,o,c,l,!n&&u);return n?new i.NamespaceValue(f,n,u):f}}m.restore()}},elements:function(){for(var e,t,n,r,o,s=/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/;;){if(o=m.i,!(t=m.$re(s)))break;r=new i.Element(n,t,!1,o,l),e?e.push(r):e=[r],n=m.$char(">")}return e},args:function(e){var t,n,r,o,s,a,u,l=v.entities,f={args:null,variadic:!1},h=[],p=[],d=[],g=!0;for(m.save();;){if(e)a=v.detachedRuleset()||v.expression();else{if(m.commentStore.length=0,m.$str("...")){f.variadic=!0,m.$char(";")&&!t&&(t=!0),(t?p:d).push({variadic:!0});break}a=l.variable()||l.property()||l.literal()||l.keyword()||this.call(!0)}if(!a||!g)break;o=null,a.throwAwayComments&&a.throwAwayComments(),s=a;var y=null;if(e?a.value&&1==a.value.length&&(y=a.value[0]):y=a,y&&(y instanceof i.Variable||y instanceof i.Property))if(m.$char(":")){if(h.length>0&&(t&&c("Cannot mix ; and , as delimiter types"),n=!0),!(s=v.detachedRuleset()||v.expression())){if(!e)return m.restore(),f.args=[],f;c("could not understand value for named argument")}o=r=y.name}else if(m.$str("...")){if(!e){f.variadic=!0,m.$char(";")&&!t&&(t=!0),(t?p:d).push({name:a.name,variadic:!0});break}u=!0}else e||(r=o=y.name,s=null);s&&h.push(s),d.push({name:o,value:s,expand:u}),m.$char(",")?g=!0:((g=";"===m.$char(";"))||t)&&(n&&c("Cannot mix ; and , as delimiter types"),t=!0,h.length>1&&(s=new i.Value(h)),p.push({name:r,value:s,expand:u}),r=null,h=[],n=!1)}return m.forget(),f.args=t?p:d,f},definition:function(){var e,t,n,r,o=[],s=!1;if(!("."!==m.currentChar()&&"#"!==m.currentChar()||m.peek(/^[^{]*\}/)))if(m.save(),t=m.$re(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/)){e=t[1];var a=this.args(!1);if(o=a.args,s=a.variadic,!m.$char(")"))return void m.restore("Missing closing ')'");if(m.commentStore.length=0,m.$str("when")&&(r=f(v.conditions,"expected condition")),n=v.block())return m.forget(),new i.mixin.Definition(e,o,n,r,s);m.restore()}else m.forget()},ruleLookups:function(){var e,t=[];if("["===m.currentChar()){for(;;){if(m.save(),null,!(e=this.lookupValue())&&""!==e){m.restore();break}t.push(e),m.forget()}return t.length>0?t:void 0}},lookupValue:function(){if(m.save(),!m.$char("["))return void m.restore();var e=m.$re(/^(?:[@$]{0,2})[_a-zA-Z0-9-]*/);return m.$char("]")&&(e||""===e)?(m.forget(),e):void m.restore()}},entity:function(){var e=this.entities;return this.comment()||e.literal()||e.variable()||e.url()||e.property()||e.call()||e.keyword()||this.mixin.call(!0)||e.javascript()},end:function(){return m.$char(";")||m.peek("}")},
ieAlpha:function(){var e;if(m.$re(/^opacity=/i))return e=m.$re(/^\d+/),e||(e=f(v.entities.variable,"Could not parse alpha"),e="@{"+e.name.slice(1)+"}"),h(")"),new i.Quoted("","alpha(opacity="+e+")")},element:function(){var e,t,n,r=m.i;if(t=this.combinator(),e=m.$re(/^(?:\d+\.\d+|\d+)%/)||m.$re(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/)||m.$char("*")||m.$char("&")||this.attribute()||m.$re(/^\([^&()@]+\)/)||m.$re(/^[\.#:](?=@)/)||this.entities.variableCurly(),e||(m.save(),m.$char("(")?(n=this.selector(!1))&&m.$char(")")?(e=new i.Paren(n),m.forget()):m.restore("Missing closing ')'"):m.forget()),e)return new i.Element(t,e,e instanceof i.Variable,r,l)},combinator:function(){var e=m.currentChar();if("/"===e){m.save();var t=m.$re(/^\/[a-z]+\//i);if(t)return m.forget(),new i.Combinator(t);m.restore()}if(">"===e||"+"===e||"~"===e||"|"===e||"^"===e){for(m.i++,"^"===e&&"^"===m.currentChar()&&(e="^^",m.i++);m.isWhitespace();)m.i++;return new i.Combinator(e)}return m.isWhitespace(-1)?new i.Combinator(" "):new i.Combinator(null)},selector:function(e){var t,n,r,o,s,a,u,h=m.i;for(e=!1!==e;(e&&(n=this.extend())||e&&(a=m.$str("when"))||(o=this.element()))&&(a?u=f(this.conditions,"expected condition"):u?c("CSS guard can only be used at the end of selector"):n?s=s?s.concat(n):n:(s&&c("Extend can only be used at the end of selector"),r=m.currentChar(),t?t.push(o):t=[o],o=null),"{"!==r&&"}"!==r&&";"!==r&&","!==r&&")"!==r););if(t)return new i.Selector(t,s,u,h,l);s&&c("Extend must be used to extend a selector, it cannot be used on its own")},selectors:function(){for(var e,t;;){if(!(e=this.selector()))break;if(t?t.push(e):t=[e],m.commentStore.length=0,e.condition&&t.length>1&&c("Guards are only currently allowed on a single selector."),!m.$char(","))break;e.condition&&c("Guards are only currently allowed on a single selector."),m.commentStore.length=0}return t},attribute:function(){if(m.$char("[")){var e,t,n,r=this.entities;return(e=r.variableCurly())||(e=f(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/)),n=m.$re(/^[|~*$^]?=/),n&&(t=r.quoted()||m.$re(/^[0-9]+%/)||m.$re(/^[\w-]+/)||r.variableCurly()),h("]"),new i.Attribute(e,n,t)}},block:function(){var e;if(m.$char("{")&&(e=this.primary())&&m.$char("}"))return e},blockRuleset:function(){var e=this.block();return e&&(e=new i.Ruleset(null,e)),e},detachedRuleset:function(){var e,t,n;if(m.save(),m.$re(/^[.#]\(/)&&(e=this.mixin.args(!1),t=e.args,n=e.variadic,!m.$char(")")))return void m.restore();var r=this.blockRuleset();if(r)return m.forget(),t?new i.mixin.Definition(null,t,r,null,n):new i.DetachedRuleset(r);m.restore()},ruleset:function(){var e,n,r;if(m.save(),t.dumpLineNumbers&&(r=p(m.i)),(e=this.selectors())&&(n=this.block())){m.forget();var o=new i.Ruleset(e,n,t.strictImports);return t.dumpLineNumbers&&(o.debugInfo=r),o}m.restore()},declaration:function(){var e,t,n,r,o,s,a=m.i,u=m.currentChar();if("."!==u&&"#"!==u&&"&"!==u&&":"!==u)if(m.save(),e=this.variable()||this.ruleProperty()){if(s="string"==typeof e,s&&(t=this.detachedRuleset())&&(n=!0),m.commentStore.length=0,!t){if(o=!s&&e.length>1&&e.pop().value,t=e[0].value&&"--"===e[0].value.slice(0,2)?this.permissiveValue():this.anonymousValue())return m.forget(),new i.Declaration(e,t,!1,o,a,l);t||(t=this.value()),t?r=this.important():s&&(t=this.permissiveValue())}if(t&&(this.end()||n))return m.forget(),new i.Declaration(e,t,r,o,a,l);m.restore()}else m.restore()},anonymousValue:function(){var e=m.i,t=m.$re(/^([^.#@\$+\/'"*`(;{}-]*);/);if(t)return new i.Anonymous(t[1],e)},permissiveValue:function(e){function t(){var e=m.currentChar();return"string"==typeof a?e===a:a.test(e)}var n,r,o,s,a=e||";",u=m.i,f=[];if(!t()){s=[];do{r=this.comment(),r?s.push(r):(r=this.entity())&&s.push(r)}while(r);if(o=t(),s.length>0){if(s=new i.Expression(s),o)return s;f.push(s)," "===m.prevChar()&&f.push(new i.Anonymous(" ",u))}if(m.save(),s=m.$parseUntil(a)){if("string"==typeof s&&c("Expected '"+s+"'","Parse"),1===s.length&&" "===s[0])return m.forget(),new i.Anonymous("",u);var h;for(n=0;n<s.length;n++)if(h=s[n],Array.isArray(h))f.push(new i.Quoted(h[0],h[1],!0,u,l));else{n===s.length-1&&(h=h.trim());var p=new i.Quoted("'",h,!0,u,l);p.variableRegex=/@([\w-]+)/g,p.propRegex=/\$([\w-]+)/g,f.push(p)}return m.forget(),new i.Expression(f,!0)}m.restore()}},import:function(){var e,t,n=m.i,r=m.$re(/^@import?\s+/);if(r){var o=(r?this.importOptions():null)||{};if(e=this.entities.quoted()||this.entities.url())return t=this.mediaFeatures(),m.$char(";")||(m.i=n,c("missing semi-colon or unrecognised media features on import")),t=t&&new i.Value(t),new i.Import(e,t,o,n,l);m.i=n,c("malformed import statement")}},importOptions:function(){var e,t,n,r={};if(!m.$char("("))return null;do{if(e=this.importOption()){switch(t=e,n=!0,t){case"css":t="less",n=!1;break;case"once":t="multiple",n=!1}if(r[t]=n,!m.$char(","))break}}while(e);return h(")"),r},importOption:function(){var e=m.$re(/^(less|css|multiple|once|inline|reference|optional)/);if(e)return e[1]},mediaFeature:function(){var e,t,n=this.entities,r=[];m.save();do{e=n.keyword()||n.variable()||n.mixinLookup(),e?r.push(e):m.$char("(")&&(t=this.property(),e=this.value(),m.$char(")")?t&&e?r.push(new i.Paren(new i.Declaration(t,e,null,null,m.i,l,!0))):e?r.push(new i.Paren(e)):c("badly formed media feature definition"):c("Missing closing ')'","Parse"))}while(e);if(m.forget(),r.length>0)return new i.Expression(r)},mediaFeatures:function(){var e,t=this.entities,n=[];do{if(e=this.mediaFeature()){if(n.push(e),!m.$char(","))break}else if((e=t.variable()||t.mixinLookup())&&(n.push(e),!m.$char(",")))break}while(e);return n.length>0?n:null},media:function(){var e,n,r,o,s=m.i;if(t.dumpLineNumbers&&(o=p(s)),m.save(),m.$str("@media"))return e=this.mediaFeatures(),n=this.block(),n||c("media definitions require block statements after any features"),m.forget(),r=new i.Media(n,e,s,l),t.dumpLineNumbers&&(r.debugInfo=o),r;m.restore()},plugin:function(){var e,t,n,r=m.i;if(m.$re(/^@plugin?\s+/)){if(t=this.pluginArgs(),n=t?{pluginArgs:t,isPlugin:!0}:{isPlugin:!0},e=this.entities.quoted()||this.entities.url())return m.$char(";")||(m.i=r,c("missing semi-colon on @plugin")),new i.Import(e,null,n,r,l);m.i=r,c("malformed @plugin statement")}},pluginArgs:function(){if(m.save(),!m.$char("("))return m.restore(),null;var e=m.$re(/^\s*([^\);]+)\)\s*/);return e[1]?(m.forget(),e[1].trim()):(m.restore(),null)},atrule:function(){var e,n,r,o,s,a,u,f=m.i,h=!0,d=!0;if("@"===m.currentChar()){if(n=this.import()||this.plugin()||this.media())return n;if(m.save(),e=m.$re(/^@[a-z-]+/)){switch(o=e,"-"==e.charAt(1)&&e.indexOf("-",2)>0&&(o="@"+e.slice(e.indexOf("-",2)+1)),o){case"@charset":s=!0,h=!1;break;case"@namespace":a=!0,h=!1;break;case"@keyframes":case"@counter-style":s=!0;break;case"@document":case"@supports":u=!0,d=!1;break;default:u=!0}if(m.commentStore.length=0,s?(n=this.entity())||c("expected "+e+" identifier"):a?(n=this.expression())||c("expected "+e+" expression"):u&&(n=this.permissiveValue(/^[{;]/),h="{"===m.currentChar(),n?n.value||(n=null):h||";"===m.currentChar()||c(e+" rule is missing block or ending semi-colon")),h&&(r=this.blockRuleset()),r||!h&&n&&m.$char(";"))return m.forget(),new i.AtRule(e,n,r,f,l,t.dumpLineNumbers?p(f):null,d);m.restore("at-rule options not recognised")}}},value:function(){var e,t=[],n=m.i;do{if((e=this.expression())&&(t.push(e),!m.$char(",")))break}while(e);if(t.length>0)return new i.Value(t,n)},important:function(){if("!"===m.currentChar())return m.$re(/^! *important/)},sub:function(){var e,t;if(m.save(),m.$char("("))return(e=this.addition())&&m.$char(")")?(m.forget(),t=new i.Expression([e]),t.parens=!0,t):void m.restore("Expected ')'");m.restore()},multiplication:function(){var e,t,n,r,o;if(e=this.operand()){for(o=m.isWhitespace(-1);;){if(m.peek(/^\/[*\/]/))break;if(m.save(),!(n=m.$char("/")||m.$char("*")||m.$str("./"))){m.forget();break}if(!(t=this.operand())){m.restore();break}m.forget(),e.parensInOp=!0,t.parensInOp=!0,r=new i.Operation(n,[r||e,t],o),o=m.isWhitespace(-1)}return r||e}},addition:function(){var e,t,n,r,o;if(e=this.multiplication()){for(o=m.isWhitespace(-1);;){if(!(n=m.$re(/^[-+]\s+/)||!o&&(m.$char("+")||m.$char("-"))))break;if(!(t=this.multiplication()))break;e.parensInOp=!0,t.parensInOp=!0,r=new i.Operation(n,[r||e,t],o),o=m.isWhitespace(-1)}return r||e}},conditions:function(){var e,t,n,r=m.i;if(e=this.condition(!0)){for(;;){if(!m.peek(/^,\s*(not\s*)?\(/)||!m.$char(","))break;if(!(t=this.condition(!0)))break;n=new i.Condition("or",n||e,t,r)}return n||e}},condition:function(e){var t,n,r;if(t=this.conditionAnd(e)){if(n=function(){return m.$str("or")}()){if(!(r=this.condition(e)))return;t=new i.Condition(n,t,r)}return t}},conditionAnd:function(e){var t,n,r,o=this;if(t=function(){var t=o.negatedCondition(e)||o.parenthesisCondition(e);return t||e?t:o.atomicCondition(e)}()){if(n=function(){return m.$str("and")}()){if(!(r=this.conditionAnd(e)))return;t=new i.Condition(n,t,r)}return t}},negatedCondition:function(e){if(m.$str("not")){var t=this.parenthesisCondition(e);return t&&(t.negate=!t.negate),t}},parenthesisCondition:function(e){var t;return m.save(),m.$str("(")?(t=function(t){var n;return m.save(),(n=t.condition(e))&&m.$char(")")?(m.forget(),n):void m.restore()}(this))?(m.forget(),t):(t=this.atomicCondition(e))?m.$char(")")?(m.forget(),t):void m.restore("expected ')' got '"+m.currentChar()+"'"):void m.restore():void m.restore()},atomicCondition:function(e){function t(){return this.addition()||a.keyword()||a.quoted()||a.mixinLookup()}var n,r,o,s,a=this.entities,u=m.i;if(t=t.bind(this),n=t())return m.$char(">")?s=m.$char("=")?">=":">":m.$char("<")?s=m.$char("=")?"<=":"<":m.$char("=")&&(s=m.$char(">")?"=>":m.$char("<")?"=<":"="),s?(r=t(),r?o=new i.Condition(s,n,r,u,!1):c("expected expression")):o=new i.Condition("=",n,new i.Keyword("true"),u,!1),o},operand:function(){var e,t=this.entities;m.peek(/^-[@\$\(]/)&&(e=m.$char("-"));var n=this.sub()||t.dimension()||t.color()||t.variable()||t.property()||t.call()||t.quoted(!0)||t.colorKeyword()||t.mixinLookup();return e&&(n.parensInOp=!0,n=new i.Negative(n)),n},expression:function(){var e,t,n=[],r=m.i;do{e=this.comment(),e?n.push(e):(e=this.addition()||this.entity())&&(n.push(e),m.peek(/^\/[\/*]/)||(t=m.$char("/"))&&n.push(new i.Anonymous(t,r)))}while(e);if(n.length>0)return new i.Expression(n)},property:function(){var e=m.$re(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/);if(e)return e[1]},ruleProperty:function(){function e(e){var t=m.i,n=m.$re(e);if(n)return o.push(t),r.push(n[1])}var t,n,r=[],o=[];m.save();var s=m.$re(/^([_a-zA-Z0-9-]+)\s*:/);if(s)return r=[new i.Keyword(s[1])],m.forget(),r;for(e(/^(\*?)/);;)if(!e(/^((?:[\w-]+)|(?:[@\$]\{[\w-]+\}))/))break;if(r.length>1&&e(/^((?:\+_|\+)?)\s*:/)){for(m.forget(),""===r[0]&&(r.shift(),o.shift()),n=0;n<r.length;n++)t=r[n],r[n]="@"!==t.charAt(0)&&"$"!==t.charAt(0)?new i.Keyword(t):"@"===t.charAt(0)?new i.Variable("@"+t.slice(2,-1),o[n],l):new i.Property("$"+t.slice(2,-1),o[n],l);return r}m.restore()}}}};l.serializeVars=function(e){var t="";for(var n in e)if(Object.hasOwnProperty.call(e,n)){var r=e[n];t+=("@"===n[0]?"":"@")+n+": "+r+(";"===String(r).slice(-1)?"":";")}return t},t.exports=l},{"../functions/function-registry":27,"../less-error":38,"../tree":67,"../utils":89,"../visitors":93,"./parser-input":43}],45:[function(e,t,n){var r,i=function(e){this.less=e,this.visitors=[],this.preProcessors=[],this.postProcessors=[],this.installedPlugins=[],this.fileManagers=[],this.iterator=-1,this.pluginCache={},this.Loader=new e.PluginLoader(e)},o=function(e,t){return!t&&r||(r=new i(e)),r};i.prototype.addPlugins=function(e){if(e)for(var t=0;t<e.length;t++)this.addPlugin(e[t])},i.prototype.addPlugin=function(e,t,n){this.installedPlugins.push(e),t&&(this.pluginCache[t]=e),e.install&&e.install(this.less,this,n||this.less.functions.functionRegistry)},i.prototype.get=function(e){return this.pluginCache[e]},i.prototype.addVisitor=function(e){this.visitors.push(e)},i.prototype.addPreProcessor=function(e,t){var n;for(n=0;n<this.preProcessors.length&&!(this.preProcessors[n].priority>=t);n++);this.preProcessors.splice(n,0,{preProcessor:e,priority:t})},i.prototype.addPostProcessor=function(e,t){var n;for(n=0;n<this.postProcessors.length&&!(this.postProcessors[n].priority>=t);n++);this.postProcessors.splice(n,0,{postProcessor:e,priority:t})},i.prototype.addFileManager=function(e){this.fileManagers.push(e)},i.prototype.getPreProcessors=function(){for(var e=[],t=0;t<this.preProcessors.length;t++)e.push(this.preProcessors[t].preProcessor);return e},i.prototype.getPostProcessors=function(){for(var e=[],t=0;t<this.postProcessors.length;t++)e.push(this.postProcessors[t].postProcessor);return e},i.prototype.getVisitors=function(){return this.visitors},i.prototype.visitor=function(){var e=this;return{first:function(){return e.iterator=-1,e.visitors[e.iterator]},get:function(){return e.iterator+=1,e.visitors[e.iterator]}}},i.prototype.getFileManagers=function(){return this.fileManagers},t.exports=o},{}],46:[function(e,t,n){var r,i=e("./utils");t.exports=function(t,n,o){return function t(o,s,a){if("function"==typeof s?(a=s,s=i.copyOptions(this.options,{})):s=i.copyOptions(this.options,s||{}),!a){r||(r="undefined"==typeof Promise?e("promise"):Promise);var u=this;return new r(function(e,n){t.call(u,o,s,function(t,r){t?n(t):e(r)})})}this.parse(o,s,function(e,t,r,i){if(e)return a(e);var o;try{o=new n(t,r).toCSS(i)}catch(e){return a(e)}a(null,o)})}}},{"./utils":89,promise:void 0}],47:[function(e,t,n){t.exports=function(e,t){var n=function(e){this.options=e};return n.prototype.toCSS=function(t,n,r){var i=new e({contentsIgnoredCharsMap:r.contentsIgnoredChars,rootNode:t,contentsMap:r.contents,sourceMapFilename:this.options.sourceMapFilename,sourceMapURL:this.options.sourceMapURL,outputFilename:this.options.sourceMapOutputFilename,sourceMapBasepath:this.options.sourceMapBasepath,sourceMapRootpath:this.options.sourceMapRootpath,outputSourceFiles:this.options.outputSourceFiles,sourceMapGenerator:this.options.sourceMapGenerator,sourceMapFileInline:this.options.sourceMapFileInline}),o=i.toCSS(n);return this.sourceMap=i.sourceMap,this.sourceMapURL=i.sourceMapURL,this.options.sourceMapInputFilename&&(this.sourceMapInputFilename=i.normalizeFilename(this.options.sourceMapInputFilename)),void 0!==this.options.sourceMapBasepath&&void 0!==this.sourceMapURL&&(this.sourceMapURL=i.removeBasepath(this.sourceMapURL)),o+this.getCSSAppendage()},n.prototype.getCSSAppendage=function(){var e=this.sourceMapURL;if(this.options.sourceMapFileInline){if(void 0===this.sourceMap)return"";e="data:application/json;base64,"+t.encodeBase64(this.sourceMap)}return e?"/*# sourceMappingURL="+e+" */":""},n.prototype.getExternalSourceMap=function(){return this.sourceMap},n.prototype.setExternalSourceMap=function(e){this.sourceMap=e},n.prototype.isInline=function(){return this.options.sourceMapFileInline},n.prototype.getSourceMapURL=function(){return this.sourceMapURL},n.prototype.getOutputFilename=function(){return this.options.sourceMapOutputFilename},n.prototype.getInputFilename=function(){return this.sourceMapInputFilename},n}},{}],48:[function(e,t,n){t.exports=function(e){var t=function(t){this._css=[],this._rootNode=t.rootNode,this._contentsMap=t.contentsMap,this._contentsIgnoredCharsMap=t.contentsIgnoredCharsMap,t.sourceMapFilename&&(this._sourceMapFilename=t.sourceMapFilename.replace(/\\/g,"/")),this._outputFilename=t.outputFilename,this.sourceMapURL=t.sourceMapURL,t.sourceMapBasepath&&(this._sourceMapBasepath=t.sourceMapBasepath.replace(/\\/g,"/")),t.sourceMapRootpath?(this._sourceMapRootpath=t.sourceMapRootpath.replace(/\\/g,"/"),"/"!==this._sourceMapRootpath.charAt(this._sourceMapRootpath.length-1)&&(this._sourceMapRootpath+="/")):this._sourceMapRootpath="",this._outputSourceFiles=t.outputSourceFiles,this._sourceMapGeneratorConstructor=e.getSourceMapGenerator(),this._lineNumber=0,this._column=0};return t.prototype.removeBasepath=function(e){return this._sourceMapBasepath&&0===e.indexOf(this._sourceMapBasepath)&&(e=e.substring(this._sourceMapBasepath.length),"\\"!==e.charAt(0)&&"/"!==e.charAt(0)||(e=e.substring(1))),e},t.prototype.normalizeFilename=function(e){return e=e.replace(/\\/g,"/"),e=this.removeBasepath(e),(this._sourceMapRootpath||"")+e},t.prototype.add=function(e,t,n,r){if(e){var i,o,s,a,u;if(t&&t.filename){var l=this._contentsMap[t.filename];this._contentsIgnoredCharsMap[t.filename]&&(n-=this._contentsIgnoredCharsMap[t.filename],n<0&&(n=0),l=l.slice(this._contentsIgnoredCharsMap[t.filename])),l=l.substring(0,n),o=l.split("\n"),a=o[o.length-1]}if(i=e.split("\n"),s=i[i.length-1],t&&t.filename)if(r)for(u=0;u<i.length;u++)this._sourceMapGenerator.addMapping({generated:{line:this._lineNumber+u+1,column:0===u?this._column:0},original:{line:o.length+u,column:0===u?a.length:0},source:this.normalizeFilename(t.filename)});else this._sourceMapGenerator.addMapping({generated:{line:this._lineNumber+1,column:this._column},original:{line:o.length,column:a.length},source:this.normalizeFilename(t.filename)});1===i.length?this._column+=s.length:(this._lineNumber+=i.length-1,this._column=s.length),this._css.push(e)}},t.prototype.isEmpty=function(){return 0===this._css.length},t.prototype.toCSS=function(e){if(this._sourceMapGenerator=new this._sourceMapGeneratorConstructor({file:this._outputFilename,sourceRoot:null}),this._outputSourceFiles)for(var t in this._contentsMap)if(this._contentsMap.hasOwnProperty(t)){var n=this._contentsMap[t];this._contentsIgnoredCharsMap[t]&&(n=n.slice(this._contentsIgnoredCharsMap[t])),this._sourceMapGenerator.setSourceContent(this.normalizeFilename(t),n)}if(this._rootNode.genCSS(e,this),this._css.length>0){var r,i=JSON.stringify(this._sourceMapGenerator.toJSON());this.sourceMapURL?r=this.sourceMapURL:this._sourceMapFilename&&(r=this._sourceMapFilename),this.sourceMapURL=r,this.sourceMap=i}return this._css.join("")},t}},{}],49:[function(e,t,n){var r=e("./contexts"),i=e("./visitors"),o=e("./tree");t.exports=function(e,t){t=t||{};var n,s=t.variables,a=new r.Eval(t);"object"!==(void 0===s?"undefined":_typeof(s))||Array.isArray(s)||(s=Object.keys(s).map(function(e){var t=s[e];return t instanceof o.Value||(t instanceof o.Expression||(t=new o.Expression([t])),t=new o.Value([t])),new o.Declaration("@"+e,t,!1,null,0)}),a.frames=[new o.Ruleset(null,s)]);var u,l,c=[new i.JoinSelectorVisitor,new i.MarkVisibleSelectorsVisitor(!0),new i.ExtendVisitor,new i.ToCSSVisitor({compress:Boolean(t.compress)})],f=[];if(t.pluginManager){l=t.pluginManager.visitor();for(var h=0;h<2;h++)for(l.first();u=l.get();)u.isPreEvalVisitor?0!==h&&-1!==f.indexOf(u)||(f.push(u),u.run(e)):0!==h&&-1!==c.indexOf(u)||(u.isPreVisitor?c.unshift(u):c.push(u))}n=e.eval(a);for(var h=0;h<c.length;h++)c[h].run(n);if(t.pluginManager)for(l.first();u=l.get();)-1===c.indexOf(u)&&-1===f.indexOf(u)&&u.run(n);return n}},{"./contexts":13,"./tree":67,"./visitors":93}],50:[function(e,t,n){var r=e("./node"),i=function(e,t,n,r,i,o){this.value=e,this._index=t,this._fileInfo=n,this.mapLines=r,this.rulesetLike=void 0!==i&&i,this.allowRoot=!0,this.copyVisibilityInfo(o)};i.prototype=new r,i.prototype.type="Anonymous",i.prototype.eval=function(){return new i(this.value,this._index,this._fileInfo,this.mapLines,this.rulesetLike,this.visibilityInfo())},i.prototype.compare=function(e){return e.toCSS&&this.toCSS()===e.toCSS()?0:void 0},i.prototype.isRulesetLike=function(){return this.rulesetLike},i.prototype.genCSS=function(e,t){this.nodeVisible=Boolean(this.value),this.nodeVisible&&t.add(this.value,this._fileInfo,this._index,this.mapLines)},t.exports=i},{"./node":76}],51:[function(e,t,n){var r=e("./node"),i=function(e,t){this.key=e,this.value=t};i.prototype=new r,i.prototype.type="Assignment",i.prototype.accept=function(e){this.value=e.visit(this.value)},i.prototype.eval=function(e){return this.value.eval?new i(this.key,this.value.eval(e)):this},i.prototype.genCSS=function(e,t){t.add(this.key+"="),this.value.genCSS?this.value.genCSS(e,t):t.add(this.value)},t.exports=i},{"./node":76}],52:[function(e,t,n){var r=e("./node"),i=e("./selector"),o=e("./ruleset"),s=e("./anonymous"),a=function(e,t,n,o,a,u,l,c){var f;if(this.name=e,this.value=t instanceof r?t:t?new s(t):t,n){for(Array.isArray(n)?this.rules=n:(this.rules=[n],this.rules[0].selectors=new i([],null,null,o,a).createEmptySelectors()),f=0;f<this.rules.length;f++)this.rules[f].allowImports=!0;this.setParent(this.rules,this)}this._index=o,this._fileInfo=a,this.debugInfo=u,this.isRooted=l||!1,this.copyVisibilityInfo(c),this.allowRoot=!0};a.prototype=new r,a.prototype.type="AtRule",a.prototype.accept=function(e){var t=this.value,n=this.rules;n&&(this.rules=e.visitArray(n)),t&&(this.value=e.visit(t))},a.prototype.isRulesetLike=function(){return this.rules||!this.isCharset()},a.prototype.isCharset=function(){return"@charset"===this.name},a.prototype.genCSS=function(e,t){var n=this.value,r=this.rules;t.add(this.name,this.fileInfo(),this.getIndex()),n&&(t.add(" "),n.genCSS(e,t)),r?this.outputRuleset(e,t,r):t.add(";")},a.prototype.eval=function(e){var t,n,r=this.value,i=this.rules;return t=e.mediaPath,n=e.mediaBlocks,e.mediaPath=[],e.mediaBlocks=[],r&&(r=r.eval(e)),i&&(i=[i[0].eval(e)],i[0].root=!0),e.mediaPath=t,e.mediaBlocks=n,new a(this.name,r,i,this.getIndex(),this.fileInfo(),this.debugInfo,this.isRooted,this.visibilityInfo())},a.prototype.variable=function(e){if(this.rules)return o.prototype.variable.call(this.rules[0],e)},a.prototype.find=function(){if(this.rules)return o.prototype.find.apply(this.rules[0],arguments)},a.prototype.rulesets=function(){if(this.rules)return o.prototype.rulesets.apply(this.rules[0])},a.prototype.outputRuleset=function(e,t,n){var r,i=n.length;if(e.tabLevel=1+(0|e.tabLevel),e.compress){for(t.add("{"),r=0;r<i;r++)n[r].genCSS(e,t);return t.add("}"),void e.tabLevel--}var o="\n"+Array(e.tabLevel).join("  "),s=o+"  ";if(i){for(t.add(" {"+s),n[0].genCSS(e,t),r=1;r<i;r++)t.add(s),n[r].genCSS(e,t);t.add(o+"}")}else t.add(" {"+o+"}");e.tabLevel--},t.exports=a},{"./anonymous":50,"./node":76,"./ruleset":81,"./selector":82}],53:[function(e,t,n){var r=e("./node"),i=function(e,t,n){this.key=e,this.op=t,this.value=n};i.prototype=new r,i.prototype.type="Attribute",i.prototype.eval=function(e){return new i(this.key.eval?this.key.eval(e):this.key,this.op,this.value&&this.value.eval?this.value.eval(e):this.value)},i.prototype.genCSS=function(e,t){t.add(this.toCSS(e))},i.prototype.toCSS=function(e){var t=this.key.toCSS?this.key.toCSS(e):this.key;return this.op&&(t+=this.op,t+=this.value.toCSS?this.value.toCSS(e):this.value),"["+t+"]"},t.exports=i},{"./node":76}],54:[function(e,t,n){var r=e("./node"),i=e("./anonymous"),o=e("../functions/function-caller"),s=function(e,t,n,r){this.name=e,this.args=t,this.calc="calc"===e,this._index=n,this._fileInfo=r};s.prototype=new r,s.prototype.type="Call",s.prototype.accept=function(e){this.args&&(this.args=e.visitArray(this.args))},s.prototype.eval=function(e){var t=e.mathOn;e.mathOn=!this.calc,(this.calc||e.inCalc)&&e.enterCalc();var n=this.args.map(function(t){return t.eval(e)});(this.calc||e.inCalc)&&e.exitCalc(),e.mathOn=t;var a,u=new o(this.name,e,this.getIndex(),this.fileInfo());if(u.isValid()){try{a=u.call(n)}catch(e){throw{type:e.type||"Runtime",message:"error evaluating function `"+this.name+"`"+(e.message?": "+e.message:""),index:this.getIndex(),filename:this.fileInfo().filename,line:e.lineNumber,column:e.columnNumber}}if(null!==a&&void 0!==a)return a instanceof r||(a=new i(a&&!0!==a?a.toString():null)),a._index=this._index,a._fileInfo=this._fileInfo,a}return new s(this.name,n,this.getIndex(),this.fileInfo())},s.prototype.genCSS=function(e,t){t.add(this.name+"(",this.fileInfo(),this.getIndex());for(var n=0;n<this.args.length;n++)this.args[n].genCSS(e,t),n+1<this.args.length&&t.add(", ");t.add(")")},t.exports=s},{"../functions/function-caller":26,"./anonymous":50,"./node":76}],55:[function(e,t,n){function r(e,t){return Math.min(Math.max(e,0),t)}function i(e){return"#"+e.map(function(e){return e=r(Math.round(e),255),(e<16?"0":"")+e.toString(16)}).join("")}var o=e("./node"),s=e("../data/colors"),a=function(e,t,n){var r=this;Array.isArray(e)?this.rgb=e:e.length>=6?(this.rgb=[],e.match(/.{2}/g).map(function(e,t){t<3?r.rgb.push(parseInt(e,16)):r.alpha=parseInt(e,16)/255})):(this.rgb=[],e.split("").map(function(e,t){t<3?r.rgb.push(parseInt(e+e,16)):r.alpha=parseInt(e+e,16)/255})),this.alpha=this.alpha||("number"==typeof t?t:1),void 0!==n&&(this.value=n)};a.prototype=new o,a.prototype.type="Color",a.prototype.luma=function(){var e=this.rgb[0]/255,t=this.rgb[1]/255,n=this.rgb[2]/255;return e=e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4),t=t<=.03928?t/12.92:Math.pow((t+.055)/1.055,2.4),n=n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4),.2126*e+.7152*t+.0722*n},a.prototype.genCSS=function(e,t){t.add(this.toCSS(e))},a.prototype.toCSS=function(e,t){var n,i,o,s=e&&e.compress&&!t,a=[];if(i=this.fround(e,this.alpha),this.value)if(0===this.value.indexOf("rgb"))i<1&&(o="rgba");else{if(0!==this.value.indexOf("hsl"))return this.value;o=i<1?"hsla":"hsl"}else i<1&&(o="rgba");switch(o){case"rgba":a=this.rgb.map(function(e){return r(Math.round(e),255)}).concat(r(i,1));break;case"hsla":a.push(r(i,1));case"hsl":n=this.toHSL(),a=[this.fround(e,n.h),this.fround(e,100*n.s)+"%",this.fround(e,100*n.l)+"%"].concat(a)}if(o)return o+"("+a.join(","+(s?"":" "))+")";if(n=this.toRGB(),s){var u=n.split("");u[1]===u[2]&&u[3]===u[4]&&u[5]===u[6]&&(n="#"+u[1]+u[3]+u[5])}return n},a.prototype.operate=function(e,t,n){for(var r=new Array(3),i=this.alpha*(1-n.alpha)+n.alpha,o=0;o<3;o++)r[o]=this._operate(e,t,this.rgb[o],n.rgb[o]);return new a(r,i)},a.prototype.toRGB=function(){return i(this.rgb)},a.prototype.toHSL=function(){var e,t,n=this.rgb[0]/255,r=this.rgb[1]/255,i=this.rgb[2]/255,o=this.alpha,s=Math.max(n,r,i),a=Math.min(n,r,i),u=(s+a)/2,l=s-a;if(s===a)e=t=0;else{switch(t=u>.5?l/(2-s-a):l/(s+a),s){case n:e=(r-i)/l+(r<i?6:0);break;case r:e=(i-n)/l+2;break;case i:e=(n-r)/l+4}e/=6}return{h:360*e,s:t,l:u,a:o}},a.prototype.toHSV=function(){var e,t,n=this.rgb[0]/255,r=this.rgb[1]/255,i=this.rgb[2]/255,o=this.alpha,s=Math.max(n,r,i),a=Math.min(n,r,i),u=s,l=s-a;if(t=0===s?0:l/s,s===a)e=0;else{switch(s){case n:e=(r-i)/l+(r<i?6:0);break;case r:e=(i-n)/l+2;break;case i:e=(n-r)/l+4}e/=6}return{h:360*e,s:t,v:u,a:o}},a.prototype.toARGB=function(){return i([255*this.alpha].concat(this.rgb))},a.prototype.compare=function(e){return e.rgb&&e.rgb[0]===this.rgb[0]&&e.rgb[1]===this.rgb[1]&&e.rgb[2]===this.rgb[2]&&e.alpha===this.alpha?0:void 0},a.fromKeyword=function(e){var t,n=e.toLowerCase();if(s.hasOwnProperty(n)?t=new a(s[n].slice(1)):"transparent"===n&&(t=new a([0,0,0],0)),t)return t.value=e,t},t.exports=a},{"../data/colors":14,"./node":76}],56:[function(e,t,n){var r=e("./node"),i=function(e){" "===e?(this.value=" ",this.emptyOrWhitespace=!0):(this.value=e?e.trim():"",this.emptyOrWhitespace=""===this.value)};i.prototype=new r,i.prototype.type="Combinator";var o={"":!0," ":!0,"|":!0};i.prototype.genCSS=function(e,t){var n=e.compress||o[this.value]?"":" ";t.add(n+this.value+n)},t.exports=i},{"./node":76}],57:[function(e,t,n){var r=e("./node"),i=e("./debug-info"),o=function(e,t,n,r){this.value=e,this.isLineComment=t,this._index=n,this._fileInfo=r,this.allowRoot=!0};o.prototype=new r,o.prototype.type="Comment",o.prototype.genCSS=function(e,t){this.debugInfo&&t.add(i(e,this),this.fileInfo(),this.getIndex()),t.add(this.value)},o.prototype.isSilent=function(e){var t=e.compress&&"!"!==this.value[2];return this.isLineComment||t},t.exports=o},{"./debug-info":59,"./node":76}],58:[function(e,t,n){var r=e("./node"),i=function(e,t,n,r,i){this.op=e.trim(),this.lvalue=t,this.rvalue=n,this._index=r,this.negate=i};i.prototype=new r,i.prototype.type="Condition",i.prototype.accept=function(e){this.lvalue=e.visit(this.lvalue),this.rvalue=e.visit(this.rvalue)},i.prototype.eval=function(e){var t=function(e,t,n){switch(e){case"and":return t&&n;case"or":return t||n;default:switch(r.compare(t,n)){case-1:return"<"===e||"=<"===e||"<="===e;case 0:return"="===e||">="===e||"=<"===e||"<="===e;case 1:return">"===e||">="===e;default:return!1}}}(this.op,this.lvalue.eval(e),this.rvalue.eval(e));return this.negate?!t:t},t.exports=i},{"./node":76}],59:[function(e,t,n){var r=function e(t,n,r){var i="";if(t.dumpLineNumbers&&!t.compress)switch(t.dumpLineNumbers){case"comments":i=e.asComment(n);break;case"mediaquery":i=e.asMediaQuery(n);break;case"all":i=e.asComment(n)+(r||"")+e.asMediaQuery(n)}return i};r.asComment=function(e){return"/* line "+e.debugInfo.lineNumber+", "+e.debugInfo.fileName+" */\n"},r.asMediaQuery=function(e){var t=e.debugInfo.fileName;return/^[a-z]+:\/\//i.test(t)||(t="file://"+t),"@media -sass-debug-info{filename{font-family:"+t.replace(/([.:\/\\])/g,function(e){return"\\"==e&&(e="/"),"\\"+e})+"}line{font-family:\\00003"+e.debugInfo.lineNumber+"}}\n"},t.exports=r},{}],60:[function(e,t,n){function r(e,t){var n,r="",i=t.length,o={add:function(e){r+=e}};for(n=0;n<i;n++)t[n].eval(e).genCSS(e,o);return r}var i=e("./node"),o=e("./value"),s=e("./keyword"),a=e("./anonymous"),u=e("../constants").Math,l=function(e,t,n,r,s,u,l,c){this.name=e,this.value=t instanceof i?t:new o([t?new a(t):null]),this.important=n?" "+n.trim():"",this.merge=r,this._index=s,this._fileInfo=u,this.inline=l||!1,this.variable=void 0!==c?c:e.charAt&&"@"===e.charAt(0),this.allowRoot=!0,this.setParent(this.value,this)};l.prototype=new i,l.prototype.type="Declaration",l.prototype.genCSS=function(e,t){t.add(this.name+(e.compress?":":": "),this.fileInfo(),this.getIndex());try{this.value.genCSS(e,t)}catch(e){throw e.index=this._index,e.filename=this._fileInfo.filename,e}t.add(this.important+(this.inline||e.lastRule&&e.compress?"":";"),this._fileInfo,this._index)},l.prototype.eval=function(e){var t,n,i=!1,o=this.name,a=this.variable;"string"!=typeof o&&(o=1===o.length&&o[0]instanceof s?o[0].value:r(e,o),a=!1),"font"===o&&e.math===u.ALWAYS&&(i=!0,t=e.math,e.math=u.PARENS_DIVISION);try{if(e.importantScope.push({}),n=this.value.eval(e),!this.variable&&"DetachedRuleset"===n.type)throw{message:"Rulesets cannot be evaluated on a property.",index:this.getIndex(),filename:this.fileInfo().filename};var c=this.important,f=e.importantScope.pop();return!c&&f.important&&(c=f.important),new l(o,n,c,this.merge,this.getIndex(),this.fileInfo(),this.inline,a)}catch(e){throw"number"!=typeof e.index&&(e.index=this.getIndex(),e.filename=this.fileInfo().filename),e}finally{i&&(e.math=t)}},l.prototype.makeImportant=function(){return new l(this.name,this.value,"!important",this.merge,this.getIndex(),this.fileInfo(),this.inline)},t.exports=l},{"../constants":12,"./anonymous":50,"./keyword":70,"./node":76,"./value":86}],61:[function(e,t,n){var r=e("./node"),i=e("../contexts"),o=e("../utils"),s=function(e,t){this.ruleset=e,this.frames=t,this.setParent(this.ruleset,this)};s.prototype=new r,s.prototype.type="DetachedRuleset",s.prototype.evalFirst=!0,s.prototype.accept=function(e){this.ruleset=e.visit(this.ruleset)},s.prototype.eval=function(e){var t=this.frames||o.copyArray(e.frames);return new s(this.ruleset,t)},s.prototype.callEval=function(e){return this.ruleset.eval(this.frames?new i.Eval(e,this.frames.concat(e.frames)):e)},t.exports=s},{"../contexts":13,"../utils":89,"./node":76}],62:[function(e,t,n){var r=e("./node"),i=e("../data/unit-conversions"),o=e("./unit"),s=e("./color"),a=function(e,t){if(this.value=parseFloat(e),isNaN(this.value))throw new Error("Dimension is not a number.");this.unit=t&&t instanceof o?t:new o(t?[t]:void 0),this.setParent(this.unit,this)};a.prototype=new r,a.prototype.type="Dimension",a.prototype.accept=function(e){this.unit=e.visit(this.unit)},a.prototype.eval=function(e){return this},a.prototype.toColor=function(){return new s([this.value,this.value,this.value])},a.prototype.genCSS=function(e,t){
if(e&&e.strictUnits&&!this.unit.isSingular())throw new Error("Multiple units in dimension. Correct the units or use the unit function. Bad unit: "+this.unit.toString());var n=this.fround(e,this.value),r=String(n);if(0!==n&&n<1e-6&&n>-1e-6&&(r=n.toFixed(20).replace(/0+$/,"")),e&&e.compress){if(0===n&&this.unit.isLength())return void t.add(r);n>0&&n<1&&(r=r.substr(1))}t.add(r),this.unit.genCSS(e,t)},a.prototype.operate=function(e,t,n){var r=this._operate(e,t,this.value,n.value),i=this.unit.clone();if("+"===t||"-"===t)if(0===i.numerator.length&&0===i.denominator.length)i=n.unit.clone(),this.unit.backupUnit&&(i.backupUnit=this.unit.backupUnit);else if(0===n.unit.numerator.length&&0===i.denominator.length);else{if(n=n.convertTo(this.unit.usedUnits()),e.strictUnits&&n.unit.toString()!==i.toString())throw new Error("Incompatible units. Change the units or use the unit function. Bad units: '"+i.toString()+"' and '"+n.unit.toString()+"'.");r=this._operate(e,t,this.value,n.value)}else"*"===t?(i.numerator=i.numerator.concat(n.unit.numerator).sort(),i.denominator=i.denominator.concat(n.unit.denominator).sort(),i.cancel()):"/"===t&&(i.numerator=i.numerator.concat(n.unit.denominator).sort(),i.denominator=i.denominator.concat(n.unit.numerator).sort(),i.cancel());return new a(r,i)},a.prototype.compare=function(e){var t,n;if(e instanceof a){if(this.unit.isEmpty()||e.unit.isEmpty())t=this,n=e;else if(t=this.unify(),n=e.unify(),0!==t.unit.compare(n.unit))return;return r.numericCompare(t.value,n.value)}},a.prototype.unify=function(){return this.convertTo({length:"px",duration:"s",angle:"rad"})},a.prototype.convertTo=function(e){var t,n,r,o,s,u=this.value,l=this.unit.clone(),c={};if("string"==typeof e){for(t in i)i[t].hasOwnProperty(e)&&(c={},c[t]=e);e=c}s=function(e,t){return r.hasOwnProperty(e)?(t?u/=r[e]/r[o]:u*=r[e]/r[o],o):e};for(n in e)e.hasOwnProperty(n)&&(o=e[n],r=i[n],l.map(s));return l.cancel(),new a(u,l)},t.exports=a},{"../data/unit-conversions":16,"./color":55,"./node":76,"./unit":84}],63:[function(e,t,n){var r=e("./node"),i=e("./paren"),o=e("./combinator"),s=function(e,t,n,r,i,s){this.combinator=e instanceof o?e:new o(e),this.value="string"==typeof t?t.trim():t||"",this.isVariable=n,this._index=r,this._fileInfo=i,this.copyVisibilityInfo(s),this.setParent(this.combinator,this)};s.prototype=new r,s.prototype.type="Element",s.prototype.accept=function(e){var t=this.value;this.combinator=e.visit(this.combinator),"object"===(void 0===t?"undefined":_typeof(t))&&(this.value=e.visit(t))},s.prototype.eval=function(e){return new s(this.combinator,this.value.eval?this.value.eval(e):this.value,this.isVariable,this.getIndex(),this.fileInfo(),this.visibilityInfo())},s.prototype.clone=function(){return new s(this.combinator,this.value,this.isVariable,this.getIndex(),this.fileInfo(),this.visibilityInfo())},s.prototype.genCSS=function(e,t){t.add(this.toCSS(e),this.fileInfo(),this.getIndex())},s.prototype.toCSS=function(e){e=e||{};var t=this.value,n=e.firstSelector;return t instanceof i&&(e.firstSelector=!0),t=t.toCSS?t.toCSS(e):t,e.firstSelector=n,""===t&&"&"===this.combinator.value.charAt(0)?"":this.combinator.toCSS(e)+t},t.exports=s},{"./combinator":56,"./node":76,"./paren":78}],64:[function(e,t,n){var r=e("./node"),i=e("./paren"),o=e("./comment"),s=e("./dimension"),a=e("../constants").Math,u=function(e,t){if(this.value=e,this.noSpacing=t,!e)throw new Error("Expression requires an array parameter")};u.prototype=new r,u.prototype.type="Expression",u.prototype.accept=function(e){this.value=e.visitArray(this.value)},u.prototype.eval=function(e){var t,n=e.isMathOn(),r=this.parens&&(e.math!==a.STRICT_LEGACY||!this.parensInOp),o=!1;return r&&e.inParenthesis(),this.value.length>1?t=new u(this.value.map(function(t){return t.eval?t.eval(e):t}),this.noSpacing):1===this.value.length?(!this.value[0].parens||this.value[0].parensInOp||e.inCalc||(o=!0),t=this.value[0].eval(e)):t=this,r&&e.outOfParenthesis(),!this.parens||!this.parensInOp||n||o||t instanceof s||(t=new i(t)),t},u.prototype.genCSS=function(e,t){for(var n=0;n<this.value.length;n++)this.value[n].genCSS(e,t),!this.noSpacing&&n+1<this.value.length&&t.add(" ")},u.prototype.throwAwayComments=function(){this.value=this.value.filter(function(e){return!(e instanceof o)})},t.exports=u},{"../constants":12,"./comment":57,"./dimension":62,"./node":76,"./paren":78}],65:[function(e,t,n){var r=e("./node"),i=e("./selector"),o=function e(t,n,r,i,o){switch(this.selector=t,this.option=n,this.object_id=e.next_id++,this.parent_ids=[this.object_id],this._index=r,this._fileInfo=i,this.copyVisibilityInfo(o),this.allowRoot=!0,n){case"all":this.allowBefore=!0,this.allowAfter=!0;break;default:this.allowBefore=!1,this.allowAfter=!1}this.setParent(this.selector,this)};o.next_id=0,o.prototype=new r,o.prototype.type="Extend",o.prototype.accept=function(e){this.selector=e.visit(this.selector)},o.prototype.eval=function(e){return new o(this.selector.eval(e),this.option,this.getIndex(),this.fileInfo(),this.visibilityInfo())},o.prototype.clone=function(e){return new o(this.selector,this.option,this.getIndex(),this.fileInfo(),this.visibilityInfo())},o.prototype.findSelfSelectors=function(e){var t,n,r=[];for(t=0;t<e.length;t++)n=e[t].elements,t>0&&n.length&&""===n[0].combinator.value&&(n[0].combinator.value=" "),r=r.concat(e[t].elements);this.selfSelectors=[new i(r)],this.selfSelectors[0].copyVisibilityInfo(this.visibilityInfo())},t.exports=o},{"./node":76,"./selector":82}],66:[function(e,t,n){var r=e("./node"),i=e("./media"),o=e("./url"),s=e("./quoted"),a=e("./ruleset"),u=e("./anonymous"),l=e("../utils"),c=e("../less-error"),f=function(e,t,n,r,i,o){if(this.options=n,this._index=r,this._fileInfo=i,this.path=e,this.features=t,this.allowRoot=!0,void 0!==this.options.less||this.options.inline)this.css=!this.options.less||this.options.inline;else{var s=this.getPath();s&&/[#\.\&\?]css([\?;].*)?$/.test(s)&&(this.css=!0)}this.copyVisibilityInfo(o),this.setParent(this.features,this),this.setParent(this.path,this)};f.prototype=new r,f.prototype.type="Import",f.prototype.accept=function(e){this.features&&(this.features=e.visit(this.features)),this.path=e.visit(this.path),this.options.isPlugin||this.options.inline||!this.root||(this.root=e.visit(this.root))},f.prototype.genCSS=function(e,t){this.css&&void 0===this.path._fileInfo.reference&&(t.add("@import ",this._fileInfo,this._index),this.path.genCSS(e,t),this.features&&(t.add(" "),this.features.genCSS(e,t)),t.add(";"))},f.prototype.getPath=function(){return this.path instanceof o?this.path.value.value:this.path.value},f.prototype.isVariableImport=function(){var e=this.path;return e instanceof o&&(e=e.value),!(e instanceof s)||e.containsVariables()},f.prototype.evalForImport=function(e){var t=this.path;return t instanceof o&&(t=t.value),new f(t.eval(e),this.features,this.options,this._index,this._fileInfo,this.visibilityInfo())},f.prototype.evalPath=function(e){var t=this.path.eval(e),n=this._fileInfo;if(!(t instanceof o)){var r=t.value;n&&r&&e.pathRequiresRewrite(r)?t.value=e.rewritePath(r,n.rootpath):t.value=e.normalizePath(t.value)}return t},f.prototype.eval=function(e){var t=this.doEval(e);return(this.options.reference||this.blocksVisibility())&&(t.length||0===t.length?t.forEach(function(e){e.addVisibilityBlock()}):t.addVisibilityBlock()),t},f.prototype.doEval=function(e){var t,n,r=this.features&&this.features.eval(e);if(this.options.isPlugin){if(this.root&&this.root.eval)try{this.root.eval(e)}catch(e){throw e.message="Plugin error during evaluation",new c(e,this.root.imports,this.root.filename)}return n=e.frames[0]&&e.frames[0].functionRegistry,n&&this.root&&this.root.functions&&n.addMultiple(this.root.functions),[]}if(this.skip&&("function"==typeof this.skip&&(this.skip=this.skip()),this.skip))return[];if(this.options.inline){var o=new u(this.root,0,{filename:this.importedFilename,reference:this.path._fileInfo&&this.path._fileInfo.reference},!0,!0);return this.features?new i([o],this.features.value):[o]}if(this.css){var s=new f(this.evalPath(e),r,this.options,this._index);if(!s.css&&this.error)throw this.error;return s}return t=new a(null,l.copyArray(this.root.rules)),t.evalImports(e),this.features?new i(t.rules,this.features.value):t.rules},t.exports=f},{"../less-error":38,"../utils":89,"./anonymous":50,"./media":71,"./node":76,"./quoted":80,"./ruleset":81,"./url":85}],67:[function(e,t,n){var r=Object.create(null);r.Node=e("./node"),r.Color=e("./color"),r.AtRule=e("./atrule"),r.DetachedRuleset=e("./detached-ruleset"),r.Operation=e("./operation"),r.Dimension=e("./dimension"),r.Unit=e("./unit"),r.Keyword=e("./keyword"),r.Variable=e("./variable"),r.Property=e("./property"),r.Ruleset=e("./ruleset"),r.Element=e("./element"),r.Attribute=e("./attribute"),r.Combinator=e("./combinator"),r.Selector=e("./selector"),r.Quoted=e("./quoted"),r.Expression=e("./expression"),r.Declaration=e("./declaration"),r.Call=e("./call"),r.URL=e("./url"),r.Import=e("./import"),r.mixin={Call:e("./mixin-call"),Definition:e("./mixin-definition")},r.Comment=e("./comment"),r.Anonymous=e("./anonymous"),r.Value=e("./value"),r.JavaScript=e("./javascript"),r.Assignment=e("./assignment"),r.Condition=e("./condition"),r.Paren=e("./paren"),r.Media=e("./media"),r.UnicodeDescriptor=e("./unicode-descriptor"),r.Negative=e("./negative"),r.Extend=e("./extend"),r.VariableCall=e("./variable-call"),r.NamespaceValue=e("./namespace-value"),t.exports=r},{"./anonymous":50,"./assignment":51,"./atrule":52,"./attribute":53,"./call":54,"./color":55,"./combinator":56,"./comment":57,"./condition":58,"./declaration":60,"./detached-ruleset":61,"./dimension":62,"./element":63,"./expression":64,"./extend":65,"./import":66,"./javascript":68,"./keyword":70,"./media":71,"./mixin-call":72,"./mixin-definition":73,"./namespace-value":74,"./negative":75,"./node":76,"./operation":77,"./paren":78,"./property":79,"./quoted":80,"./ruleset":81,"./selector":82,"./unicode-descriptor":83,"./unit":84,"./url":85,"./value":86,"./variable":88,"./variable-call":87}],68:[function(e,t,n){var r=e("./js-eval-node"),i=e("./dimension"),o=e("./quoted"),s=e("./anonymous"),a=function(e,t,n,r){this.escaped=t,this.expression=e,this._index=n,this._fileInfo=r};a.prototype=new r,a.prototype.type="JavaScript",a.prototype.eval=function(e){var t=this.evaluateJavaScript(this.expression,e),n=void 0===t?"undefined":_typeof(t);return"number"!==n||isNaN(t)?"string"===n?new o('"'+t+'"',t,this.escaped,this._index):new s(Array.isArray(t)?t.join(", "):t):new i(t)},t.exports=a},{"./anonymous":50,"./dimension":62,"./js-eval-node":69,"./quoted":80}],69:[function(e,t,n){var r=e("./node"),i=e("./variable"),o=function(){};o.prototype=new r,o.prototype.evaluateJavaScript=function(e,t){var n,r=this,o={};if(!t.javascriptEnabled)throw{message:"Inline JavaScript is not enabled. Is it set in your options?",filename:this.fileInfo().filename,index:this.getIndex()};e=e.replace(/@\{([\w-]+)\}/g,function(e,n){return r.jsify(new i("@"+n,r.getIndex(),r.fileInfo()).eval(t))});try{e=new Function("return ("+e+")")}catch(t){throw{message:"JavaScript evaluation error: "+t.message+" from `"+e+"`",filename:this.fileInfo().filename,index:this.getIndex()}}var s=t.frames[0].variables();for(var a in s)s.hasOwnProperty(a)&&(o[a.slice(1)]={value:s[a].value,toJS:function(){return this.value.eval(t).toCSS()}});try{n=e.call(o)}catch(e){throw{message:"JavaScript evaluation error: '"+e.name+": "+e.message.replace(/["]/g,"'")+"'",filename:this.fileInfo().filename,index:this.getIndex()}}return n},o.prototype.jsify=function(e){return Array.isArray(e.value)&&e.value.length>1?"["+e.value.map(function(e){return e.toCSS()}).join(", ")+"]":e.toCSS()},t.exports=o},{"./node":76,"./variable":88}],70:[function(e,t,n){var r=e("./node"),i=function(e){this.value=e};i.prototype=new r,i.prototype.type="Keyword",i.prototype.genCSS=function(e,t){if("%"===this.value)throw{type:"Syntax",message:"Invalid % without number"};t.add(this.value)},i.True=new i("true"),i.False=new i("false"),t.exports=i},{"./node":76}],71:[function(e,t,n){var r=e("./ruleset"),i=e("./value"),o=e("./selector"),s=e("./anonymous"),a=e("./expression"),u=e("./atrule"),l=e("../utils"),c=function(e,t,n,s,a){this._index=n,this._fileInfo=s;var u=new o([],null,null,this._index,this._fileInfo).createEmptySelectors();this.features=new i(t),this.rules=[new r(u,e)],this.rules[0].allowImports=!0,this.copyVisibilityInfo(a),this.allowRoot=!0,this.setParent(u,this),this.setParent(this.features,this),this.setParent(this.rules,this)};c.prototype=new u,c.prototype.type="Media",c.prototype.isRulesetLike=function(){return!0},c.prototype.accept=function(e){this.features&&(this.features=e.visit(this.features)),this.rules&&(this.rules=e.visitArray(this.rules))},c.prototype.genCSS=function(e,t){t.add("@media ",this._fileInfo,this._index),this.features.genCSS(e,t),this.outputRuleset(e,t,this.rules)},c.prototype.eval=function(e){e.mediaBlocks||(e.mediaBlocks=[],e.mediaPath=[]);var t=new c(null,[],this._index,this._fileInfo,this.visibilityInfo());return this.debugInfo&&(this.rules[0].debugInfo=this.debugInfo,t.debugInfo=this.debugInfo),t.features=this.features.eval(e),e.mediaPath.push(t),e.mediaBlocks.push(t),this.rules[0].functionRegistry=e.frames[0].functionRegistry.inherit(),e.frames.unshift(this.rules[0]),t.rules=[this.rules[0].eval(e)],e.frames.shift(),e.mediaPath.pop(),0===e.mediaPath.length?t.evalTop(e):t.evalNested(e)},c.prototype.evalTop=function(e){var t=this;if(e.mediaBlocks.length>1){var n=new o([],null,null,this.getIndex(),this.fileInfo()).createEmptySelectors();t=new r(n,e.mediaBlocks),t.multiMedia=!0,t.copyVisibilityInfo(this.visibilityInfo()),this.setParent(t,this)}return delete e.mediaBlocks,delete e.mediaPath,t},c.prototype.evalNested=function(e){var t,n,o=e.mediaPath.concat([this]);for(t=0;t<o.length;t++)n=o[t].features instanceof i?o[t].features.value:o[t].features,o[t]=Array.isArray(n)?n:[n];return this.features=new i(this.permute(o).map(function(e){for(e=e.map(function(e){return e.toCSS?e:new s(e)}),t=e.length-1;t>0;t--)e.splice(t,0,new s("and"));return new a(e)})),this.setParent(this.features,this),new r([],[])},c.prototype.permute=function(e){if(0===e.length)return[];if(1===e.length)return e[0];for(var t=[],n=this.permute(e.slice(1)),r=0;r<n.length;r++)for(var i=0;i<e[0].length;i++)t.push([e[0][i]].concat(n[r]));return t},c.prototype.bubbleSelectors=function(e){e&&(this.rules=[new r(l.copyArray(e),[this.rules[0]])],this.setParent(this.rules,this))},t.exports=c},{"../utils":89,"./anonymous":50,"./atrule":52,"./expression":64,"./ruleset":81,"./selector":82,"./value":86}],72:[function(e,t,n){var r=e("./node"),i=e("./selector"),o=e("./mixin-definition"),s=e("../functions/default"),a=function(e,t,n,r,o){this.selector=new i(e),this.arguments=t||[],this._index=n,this._fileInfo=r,this.important=o,this.allowRoot=!0,this.setParent(this.selector,this)};a.prototype=new r,a.prototype.type="MixinCall",a.prototype.accept=function(e){this.selector&&(this.selector=e.visit(this.selector)),this.arguments.length&&(this.arguments=e.visitArray(this.arguments))},a.prototype.eval=function(e){var t,n,r,i,a,u,l,c,f,h,p,d,v,m,g,y=[],w=[],b=!1,x=[],S=[],I=-1,C=0,_=1,k=2;for(this.selector=this.selector.eval(e),u=0;u<this.arguments.length;u++)if(i=this.arguments[u],a=i.value.eval(e),i.expand&&Array.isArray(a.value))for(a=a.value,l=0;l<a.length;l++)y.push({value:a[l]});else y.push({name:i.name,value:a});for(g=function(t){return t.matchArgs(null,e)},u=0;u<e.frames.length;u++)if((t=e.frames[u].find(this.selector,null,g)).length>0){for(h=!0,l=0;l<t.length;l++){for(n=t[l].rule,r=t[l].path,f=!1,c=0;c<e.frames.length;c++)if(!(n instanceof o)&&n===(e.frames[c].originalRuleset||e.frames[c])){f=!0;break}f||n.matchArgs(y,e)&&(p={mixin:n,group:function(t,n){var r,i,o;for(r=0;r<2;r++){for(S[r]=!0,s.value(r),i=0;i<n.length&&S[r];i++)o=n[i],o.matchCondition&&(S[r]=S[r]&&o.matchCondition(null,e));t.matchCondition&&(S[r]=S[r]&&t.matchCondition(y,e))}return S[0]||S[1]?S[0]!=S[1]?S[1]?_:k:C:I}(n,r)},p.group!==I&&x.push(p),b=!0)}for(s.reset(),v=[0,0,0],l=0;l<x.length;l++)v[x[l].group]++;if(v[C]>0)d=k;else if(d=_,v[_]+v[k]>1)throw{type:"Runtime",message:"Ambiguous use of `default()` found when matching for `"+this.format(y)+"`",index:this.getIndex(),filename:this.fileInfo().filename};for(l=0;l<x.length;l++)if((p=x[l].group)===C||p===d)try{n=x[l].mixin,n instanceof o||(m=n.originalRuleset||n,n=new o("",[],n.rules,null,!1,null,m.visibilityInfo()),n.originalRuleset=m);var A=n.evalCall(e,y,this.important).rules;this._setVisibilityToReplacement(A),Array.prototype.push.apply(w,A)}catch(e){throw{message:e.message,index:this.getIndex(),filename:this.fileInfo().filename,stack:e.stack}}if(b)return w}throw h?{type:"Runtime",message:"No matching definition was found for `"+this.format(y)+"`",index:this.getIndex(),filename:this.fileInfo().filename}:{type:"Name",message:this.selector.toCSS().trim()+" is undefined",index:this.getIndex(),filename:this.fileInfo().filename}},a.prototype._setVisibilityToReplacement=function(e){var t,n;if(this.blocksVisibility())for(t=0;t<e.length;t++)n=e[t],n.addVisibilityBlock()},a.prototype.format=function(e){return this.selector.toCSS().trim()+"("+(e?e.map(function(e){var t="";return e.name&&(t+=e.name+":"),e.value.toCSS?t+=e.value.toCSS():t+="???",t}).join(", "):"")+")"},t.exports=a},{"../functions/default":25,"./mixin-definition":73,"./node":76,"./selector":82}],73:[function(e,t,n){var r=e("./selector"),i=e("./element"),o=e("./ruleset"),s=e("./declaration"),a=e("./detached-ruleset"),u=e("./expression"),l=e("../contexts"),c=e("../utils"),f=function(e,t,n,o,s,a,u){this.name=e||"anonymous mixin",this.selectors=[new r([new i(null,e,!1,this._index,this._fileInfo)])],this.params=t,this.condition=o,this.variadic=s,this.arity=t.length,this.rules=n,this._lookups={};var l=[];this.required=t.reduce(function(e,t){return!t.name||t.name&&!t.value?e+1:(l.push(t.name),e)},0),this.optionalParameters=l,this.frames=a,this.copyVisibilityInfo(u),this.allowRoot=!0};f.prototype=new o,f.prototype.type="MixinDefinition",f.prototype.evalFirst=!0,f.prototype.accept=function(e){this.params&&this.params.length&&(this.params=e.visitArray(this.params)),this.rules=e.visitArray(this.rules),this.condition&&(this.condition=e.visit(this.condition))},f.prototype.evalParams=function(e,t,n,r){var i,f,h,p,d,v,m,g,y=new o(null,null),w=c.copyArray(this.params),b=0;if(t.frames&&t.frames[0]&&t.frames[0].functionRegistry&&(y.functionRegistry=t.frames[0].functionRegistry.inherit()),t=new l.Eval(t,[y].concat(t.frames)),n)for(n=c.copyArray(n),b=n.length,h=0;h<b;h++)if(f=n[h],v=f&&f.name){for(m=!1,p=0;p<w.length;p++)if(!r[p]&&v===w[p].name){r[p]=f.value.eval(e),y.prependRule(new s(v,f.value.eval(e))),m=!0;break}if(m){n.splice(h,1),h--;continue}throw{type:"Runtime",message:"Named argument for "+this.name+" "+n[h].name+" not found"}}for(g=0,h=0;h<w.length;h++)if(!r[h]){if(f=n&&n[g],v=w[h].name)if(w[h].variadic){for(i=[],p=g;p<b;p++)i.push(n[p].value.eval(e));y.prependRule(new s(v,new u(i).eval(e)))}else{if(d=f&&f.value)d=Array.isArray(d)?new a(new o("",d)):d.eval(e);else{if(!w[h].value)throw{type:"Runtime",message:"wrong number of arguments for "+this.name+" ("+b+" for "+this.arity+")"};d=w[h].value.eval(t),y.resetCache()}y.prependRule(new s(v,d)),r[h]=d}if(w[h].variadic&&n)for(p=g;p<b;p++)r[p]=n[p].value.eval(e);g++}return y},f.prototype.makeImportant=function(){var e=this.rules?this.rules.map(function(e){return e.makeImportant?e.makeImportant(!0):e}):this.rules;return new f(this.name,this.params,e,this.condition,this.variadic,this.frames)},f.prototype.eval=function(e){return new f(this.name,this.params,this.rules,this.condition,this.variadic,this.frames||c.copyArray(e.frames))},f.prototype.evalCall=function(e,t,n){var r,i,a=[],f=this.frames?this.frames.concat(e.frames):e.frames,h=this.evalParams(e,new l.Eval(e,f),t,a);return h.prependRule(new s("@arguments",new u(a).eval(e))),r=c.copyArray(this.rules),i=new o(null,r),i.originalRuleset=this,i=i.eval(new l.Eval(e,[this,h].concat(f))),n&&(i=i.makeImportant()),i},f.prototype.matchCondition=function(e,t){return!(this.condition&&!this.condition.eval(new l.Eval(t,[this.evalParams(t,new l.Eval(t,this.frames?this.frames.concat(t.frames):t.frames),e,[])].concat(this.frames||[]).concat(t.frames))))},f.prototype.matchArgs=function(e,t){var n,r=e&&e.length||0,i=this.optionalParameters,o=e?e.reduce(function(e,t){return i.indexOf(t.name)<0?e+1:e},0):0;if(this.variadic){if(o<this.required-1)return!1}else{if(o<this.required)return!1;if(r>this.params.length)return!1}n=Math.min(o,this.arity);for(var s=0;s<n;s++)if(!this.params[s].name&&!this.params[s].variadic&&e[s].value.eval(t).toCSS()!=this.params[s].value.eval(t).toCSS())return!1;return!0},t.exports=f},{"../contexts":13,"../utils":89,"./declaration":60,"./detached-ruleset":61,"./element":63,"./expression":64,"./ruleset":81,"./selector":82}],74:[function(e,t,n){var r=e("./node"),i=e("./variable"),o=e("./ruleset"),s=e("./selector"),a=function(e,t,n,r,i){this.value=e,this.lookups=t,this.important=n,this._index=r,this._fileInfo=i};a.prototype=new r,a.prototype.type="NamespaceValue",a.prototype.eval=function(e){var t,n,r=this.value.eval(e);for(t=0;t<this.lookups.length;t++){if(n=this.lookups[t],Array.isArray(r)&&(r=new o([new s],r)),""===n)r=r.lastDeclaration();else if("@"===n.charAt(0)){if("@"===n.charAt(1)&&(n="@"+new i(n.substr(1)).eval(e).value),r.variables&&(r=r.variable(n)),!r)throw{type:"Name",message:"variable "+n+" not found",filename:this.fileInfo().filename,index:this.getIndex()}}else{if(n="$@"===n.substring(0,2)?"$"+new i(n.substr(1)).eval(e).value:"$"===n.charAt(0)?n:"$"+n,r.properties&&(r=r.property(n)),!r)throw{type:"Name",message:'property "'+n.substr(1)+'" not found',filename:this.fileInfo().filename,index:this.getIndex()};r=r[r.length-1]}r.value&&(r=r.eval(e).value),r.ruleset&&(r=r.ruleset.eval(e))}return r},t.exports=a},{"./node":76,"./ruleset":81,"./selector":82,"./variable":88}],75:[function(e,t,n){var r=e("./node"),i=e("./operation"),o=e("./dimension"),s=function(e){this.value=e};s.prototype=new r,s.prototype.type="Negative",s.prototype.genCSS=function(e,t){t.add("-"),this.value.genCSS(e,t)},s.prototype.eval=function(e){return e.isMathOn()?new i("*",[new o(-1),this.value]).eval(e):new s(this.value.eval(e))},t.exports=s},{"./dimension":62,"./node":76,"./operation":77}],76:[function(e,t,n){var r=function(){this.parent=null,this.visibilityBlocks=void 0,this.nodeVisible=void 0,this.rootNode=null,this.parsed=null;var e=this;Object.defineProperty(this,"currentFileInfo",{get:function(){return e.fileInfo()}}),Object.defineProperty(this,"index",{get:function(){return e.getIndex()}})};r.prototype.setParent=function(e,t){function n(e){e&&e instanceof r&&(e.parent=t)}Array.isArray(e)?e.forEach(n):n(e)},r.prototype.getIndex=function(){return this._index||this.parent&&this.parent.getIndex()||0},r.prototype.fileInfo=function(){return this._fileInfo||this.parent&&this.parent.fileInfo()||{}},r.prototype.isRulesetLike=function(){return!1},r.prototype.toCSS=function(e){var t=[];return this.genCSS(e,{add:function(e,n,r){t.push(e)},isEmpty:function(){return 0===t.length}}),t.join("")},r.prototype.genCSS=function(e,t){t.add(this.value)},r.prototype.accept=function(e){this.value=e.visit(this.value)},r.prototype.eval=function(){return this},r.prototype._operate=function(e,t,n,r){switch(t){case"+":return n+r;case"-":return n-r;case"*":return n*r;case"/":return n/r}},r.prototype.fround=function(e,t){var n=e&&e.numPrecision;return n?Number((t+2e-16).toFixed(n)):t},r.compare=function(e,t){if(e.compare&&"Quoted"!==t.type&&"Anonymous"!==t.type)return e.compare(t);if(t.compare)return-t.compare(e);if(e.type===t.type){if(e=e.value,t=t.value,!Array.isArray(e))return e===t?0:void 0;if(e.length===t.length){for(var n=0;n<e.length;n++)if(0!==r.compare(e[n],t[n]))return;return 0}}},r.numericCompare=function(e,t){return e<t?-1:e===t?0:e>t?1:void 0},r.prototype.blocksVisibility=function(){return null==this.visibilityBlocks&&(this.visibilityBlocks=0),0!==this.visibilityBlocks},r.prototype.addVisibilityBlock=function(){null==this.visibilityBlocks&&(this.visibilityBlocks=0),this.visibilityBlocks=this.visibilityBlocks+1},r.prototype.removeVisibilityBlock=function(){null==this.visibilityBlocks&&(this.visibilityBlocks=0),this.visibilityBlocks=this.visibilityBlocks-1},r.prototype.ensureVisibility=function(){this.nodeVisible=!0},r.prototype.ensureInvisibility=function(){this.nodeVisible=!1},r.prototype.isVisible=function(){return this.nodeVisible},r.prototype.visibilityInfo=function(){return{visibilityBlocks:this.visibilityBlocks,nodeVisible:this.nodeVisible}},r.prototype.copyVisibilityInfo=function(e){e&&(this.visibilityBlocks=e.visibilityBlocks,this.nodeVisible=e.nodeVisible)},t.exports=r},{}],77:[function(e,t,n){var r=e("./node"),i=e("./color"),o=e("./dimension"),s=e("../constants").Math,a=function(e,t,n){this.op=e.trim(),this.operands=t,this.isSpaced=n};a.prototype=new r,a.prototype.type="Operation",a.prototype.accept=function(e){this.operands=e.visit(this.operands)},a.prototype.eval=function(e){var t,n=this.operands[0].eval(e),r=this.operands[1].eval(e);if(e.isMathOn(this.op)){if(t="./"===this.op?"/":this.op,n instanceof o&&r instanceof i&&(n=n.toColor()),r instanceof o&&n instanceof i&&(r=r.toColor()),!n.operate){if(n instanceof a&&"/"===n.op&&e.math===s.PARENS_DIVISION)return new a(this.op,[n,r],this.isSpaced);throw{type:"Operation",message:"Operation on an invalid type"}}return n.operate(e,t,r)}return new a(this.op,[n,r],this.isSpaced)},a.prototype.genCSS=function(e,t){this.operands[0].genCSS(e,t),this.isSpaced&&t.add(" "),t.add(this.op),this.isSpaced&&t.add(" "),this.operands[1].genCSS(e,t)},t.exports=a},{"../constants":12,"./color":55,"./dimension":62,"./node":76}],78:[function(e,t,n){var r=e("./node"),i=function(e){this.value=e};i.prototype=new r,i.prototype.type="Paren",i.prototype.genCSS=function(e,t){t.add("("),this.value.genCSS(e,t),t.add(")")},i.prototype.eval=function(e){return new i(this.value.eval(e))},t.exports=i},{"./node":76}],79:[function(e,t,n){var r=e("./node"),i=e("./declaration"),o=function(e,t,n){this.name=e,this._index=t,this._fileInfo=n};o.prototype=new r,o.prototype.type="Property",o.prototype.eval=function(e){var t,n=this.name,r=e.pluginManager.less.visitors.ToCSSVisitor.prototype._mergeRules;if(this.evaluating)throw{type:"Name",message:"Recursive property reference for "+n,filename:this.fileInfo().filename,index:this.getIndex()};if(this.evaluating=!0,t=this.find(e.frames,function(t){var o,s=t.property(n);if(s){for(var a=0;a<s.length;a++)o=s[a],s[a]=new i(o.name,o.value,o.important,o.merge,o.index,o.currentFileInfo,o.inline,o.variable);if(r(s),o=s[s.length-1],o.important){e.importantScope[e.importantScope.length-1].important=o.important}return o=o.value.eval(e)}}))return this.evaluating=!1,t;throw{type:"Name",message:"Property '"+n+"' is undefined",filename:this.currentFileInfo.filename,index:this.index}},o.prototype.find=function(e,t){for(var n,r=0;r<e.length;r++)if(n=t.call(e,e[r]))return n;return null},t.exports=o},{"./declaration":60,"./node":76}],80:[function(e,t,n){var r=e("./node"),i=e("./variable"),o=e("./property"),s=function(e,t,n,r,i){this.escaped=null==n||n,this.value=t||"",this.quote=e.charAt(0),this._index=r,this._fileInfo=i,this.variableRegex=/@\{([\w-]+)\}/g,this.propRegex=/\$\{([\w-]+)\}/g};s.prototype=new r,s.prototype.type="Quoted",s.prototype.genCSS=function(e,t){this.escaped||t.add(this.quote,this.fileInfo(),this.getIndex()),t.add(this.value),this.escaped||t.add(this.quote)},s.prototype.containsVariables=function(){return this.value.match(this.variableRegex)},s.prototype.eval=function(e){function t(e,t,n){var r=e;do{e=r,r=e.replace(t,n)}while(e!==r);return r}var n=this,r=this.value,a=function(t,r){var o=new i("@"+r,n.getIndex(),n.fileInfo()).eval(e,!0);return o instanceof s?o.value:o.toCSS()},u=function(t,r){var i=new o("$"+r,n.getIndex(),n.fileInfo()).eval(e,!0);return i instanceof s?i.value:i.toCSS()};return r=t(r,this.variableRegex,a),r=t(r,this.propRegex,u),new s(this.quote+r+this.quote,r,this.escaped,this.getIndex(),this.fileInfo())},s.prototype.compare=function(e){return"Quoted"!==e.type||this.escaped||e.escaped?e.toCSS&&this.toCSS()===e.toCSS()?0:void 0:r.numericCompare(this.value,e.value)},t.exports=s},{"./node":76,"./property":79,"./variable":88}],81:[function(e,t,n){var r=e("./node"),i=e("./declaration"),o=e("./keyword"),s=e("./comment"),a=e("./paren"),u=e("./selector"),l=e("./element"),c=e("./anonymous"),f=e("../contexts"),h=e("../functions/function-registry"),p=e("../functions/default"),d=e("./debug-info"),v=e("../utils"),m=function(e,t,n,r){this.selectors=e,this.rules=t,this._lookups={},this._variables=null,this._properties=null,this.strictImports=n,this.copyVisibilityInfo(r),this.allowRoot=!0,this.setParent(this.selectors,this),this.setParent(this.rules,this)};m.prototype=new r,m.prototype.type="Ruleset",m.prototype.isRuleset=!0,m.prototype.isRulesetLike=function(){return!0},m.prototype.accept=function(e){this.paths?this.paths=e.visitArray(this.paths,!0):this.selectors&&(this.selectors=e.visitArray(this.selectors)),this.rules&&this.rules.length&&(this.rules=e.visitArray(this.rules))},m.prototype.eval=function(e){var t,n,o,s,a,u=!1;if(this.selectors&&(n=this.selectors.length)){for(t=new Array(n),p.error({type:"Syntax",message:"it is currently only allowed in parametric mixin guards,"}),s=0;s<n;s++){o=this.selectors[s].eval(e);for(var l=0;l<o.elements.length;l++)if(o.elements[l].isVariable){a=!0;break}t[s]=o,o.evaldCondition&&(u=!0)}if(a){var c=new Array(n);for(s=0;s<n;s++)o=t[s],c[s]=o.toCSS(e);this.parse.parseNode(c.join(","),["selectors"],t[0].getIndex(),t[0].fileInfo(),function(e,n){n&&(t=v.flattenArray(n))})}p.reset()}else u=!0;var f,d,g=this.rules?v.copyArray(this.rules):null,y=new m(t,g,this.strictImports,this.visibilityInfo());y.originalRuleset=this,y.root=this.root,y.firstRoot=this.firstRoot,y.allowImports=this.allowImports,this.debugInfo&&(y.debugInfo=this.debugInfo),u||(g.length=0),y.functionRegistry=function(e){for(var t,n=0,r=e.length;n!==r;++n)if(t=e[n].functionRegistry)return t;return h}(e.frames).inherit();var w=e.frames;w.unshift(y);var b=e.selectors;b||(e.selectors=b=[]),b.unshift(this.selectors),(y.root||y.allowImports||!y.strictImports)&&y.evalImports(e);var x=y.rules;for(s=0;f=x[s];s++)f.evalFirst&&(x[s]=f.eval(e));var S=e.mediaBlocks&&e.mediaBlocks.length||0;for(s=0;f=x[s];s++)"MixinCall"===f.type?(g=f.eval(e).filter(function(e){return!(e instanceof i&&e.variable)||!y.variable(e.name)}),x.splice.apply(x,[s,1].concat(g)),s+=g.length-1,y.resetCache()):"VariableCall"===f.type&&(g=f.eval(e).rules.filter(function(e){return!(e instanceof i&&e.variable)}),x.splice.apply(x,[s,1].concat(g)),s+=g.length-1,y.resetCache());for(s=0;f=x[s];s++)f.evalFirst||(x[s]=f=f.eval?f.eval(e):f);for(s=0;f=x[s];s++)if(f instanceof m&&f.selectors&&1===f.selectors.length&&f.selectors[0]&&f.selectors[0].isJustParentSelector()){x.splice(s--,1);for(var l=0;d=f.rules[l];l++)d instanceof r&&(d.copyVisibilityInfo(f.visibilityInfo()),d instanceof i&&d.variable||x.splice(++s,0,d))}if(w.shift(),b.shift(),e.mediaBlocks)for(s=S;s<e.mediaBlocks.length;s++)e.mediaBlocks[s].bubbleSelectors(t);return y},m.prototype.evalImports=function(e){var t,n,r=this.rules;if(r)for(t=0;t<r.length;t++)"Import"===r[t].type&&(n=r[t].eval(e),n&&(n.length||0===n.length)?(r.splice.apply(r,[t,1].concat(n)),t+=n.length-1):r.splice(t,1,n),this.resetCache())},m.prototype.makeImportant=function(){return new m(this.selectors,this.rules.map(function(e){return e.makeImportant?e.makeImportant():e}),this.strictImports,this.visibilityInfo())},m.prototype.matchArgs=function(e){return!e||0===e.length},m.prototype.matchCondition=function(e,t){var n=this.selectors[this.selectors.length-1];return!!n.evaldCondition&&!(n.condition&&!n.condition.eval(new f.Eval(t,t.frames)))},m.prototype.resetCache=function(){this._rulesets=null,this._variables=null,
this._properties=null,this._lookups={}},m.prototype.variables=function(){return this._variables||(this._variables=this.rules?this.rules.reduce(function(e,t){if(t instanceof i&&!0===t.variable&&(e[t.name]=t),"Import"===t.type&&t.root&&t.root.variables){var n=t.root.variables();for(var r in n)n.hasOwnProperty(r)&&(e[r]=t.root.variable(r))}return e},{}):{}),this._variables},m.prototype.properties=function(){return this._properties||(this._properties=this.rules?this.rules.reduce(function(e,t){if(t instanceof i&&!0!==t.variable){var n=1===t.name.length&&t.name[0]instanceof o?t.name[0].value:t.name;e["$"+n]?e["$"+n].push(t):e["$"+n]=[t]}return e},{}):{}),this._properties},m.prototype.variable=function(e){var t=this.variables()[e];if(t)return this.parseValue(t)},m.prototype.property=function(e){var t=this.properties()[e];if(t)return this.parseValue(t)},m.prototype.lastDeclaration=function(){for(var e=this.rules.length;e>0;e--){var t=this.rules[e-1];if(t instanceof i)return this.parseValue(t)}},m.prototype.parseValue=function(e){function t(e){return e.value instanceof c&&!e.parsed?("string"==typeof e.value.value?this.parse.parseNode(e.value.value,["value","important"],e.value.getIndex(),e.fileInfo(),function(t,n){t&&(e.parsed=!0),n&&(e.value=n[0],e.important=n[1]||"",e.parsed=!0)}):e.parsed=!0,e):e}var n=this;if(Array.isArray(e)){var r=[];return e.forEach(function(e){r.push(t.call(n,e))}),r}return t.call(n,e)},m.prototype.rulesets=function(){if(!this.rules)return[];var e,t,n=[],r=this.rules;for(e=0;t=r[e];e++)t.isRuleset&&n.push(t);return n},m.prototype.prependRule=function(e){var t=this.rules;t?t.unshift(e):this.rules=[e],this.setParent(e,this)},m.prototype.find=function(e,t,n){t=t||this;var r,i,o=[],s=e.toCSS();return s in this._lookups?this._lookups[s]:(this.rulesets().forEach(function(s){if(s!==t)for(var a=0;a<s.selectors.length;a++)if(r=e.match(s.selectors[a])){if(e.elements.length>r){if(!n||n(s)){i=s.find(new u(e.elements.slice(r)),t,n);for(var l=0;l<i.length;++l)i[l].path.push(s);Array.prototype.push.apply(o,i)}}else o.push({rule:s,path:[]});break}}),this._lookups[s]=o,o)},m.prototype.genCSS=function(e,t){var n,r,i,o,a,u=[],l=[];e.tabLevel=e.tabLevel||0,this.root||e.tabLevel++;var c,f=e.compress?"":Array(e.tabLevel+1).join("  "),h=e.compress?"":Array(e.tabLevel).join("  "),p=0,v=0;for(n=0;o=this.rules[n];n++)o instanceof s?(v===n&&v++,l.push(o)):o.isCharset&&o.isCharset()?(l.splice(p,0,o),p++,v++):"Import"===o.type?(l.splice(v,0,o),v++):l.push(o);if(l=u.concat(l),!this.root){i=d(e,this,h),i&&(t.add(i),t.add(h));var m,g=this.paths,y=g.length;for(c=e.compress?",":",\n"+h,n=0;n<y;n++)if(a=g[n],m=a.length)for(n>0&&t.add(c),e.firstSelector=!0,a[0].genCSS(e,t),e.firstSelector=!1,r=1;r<m;r++)a[r].genCSS(e,t);t.add((e.compress?"{":" {\n")+f)}for(n=0;o=l[n];n++){n+1===l.length&&(e.lastRule=!0);var w=e.lastRule;o.isRulesetLike(o)&&(e.lastRule=!1),o.genCSS?o.genCSS(e,t):o.value&&t.add(o.value.toString()),e.lastRule=w,!e.lastRule&&o.isVisible()?t.add(e.compress?"":"\n"+f):e.lastRule=!1}this.root||(t.add(e.compress?"}":"\n"+h+"}"),e.tabLevel--),t.isEmpty()||e.compress||!this.firstRoot||t.add("\n")},m.prototype.joinSelectors=function(e,t,n){for(var r=0;r<n.length;r++)this.joinSelector(e,t,n[r])},m.prototype.joinSelector=function(e,t,n){function r(e,t){var n,r;if(0===e.length)n=new a(e[0]);else{var i=new Array(e.length);for(r=0;r<e.length;r++)i[r]=new l(null,e[r],t.isVariable,t._index,t._fileInfo);n=new a(new u(i))}return n}function i(e,t){var n;return n=new l(null,e,t.isVariable,t._index,t._fileInfo),new u([n])}function o(e,t,n,r){var i,o,s;if(i=[],e.length>0?(i=v.copyArray(e),o=i.pop(),s=r.createDerived(v.copyArray(o.elements))):s=r.createDerived([]),t.length>0){var a=n.combinator,u=t[0].elements[0];a.emptyOrWhitespace&&!u.combinator.emptyOrWhitespace&&(a=u.combinator),s.elements.push(new l(a,u.value,n.isVariable,n._index,n._fileInfo)),s.elements=s.elements.concat(t[0].elements.slice(1))}if(0!==s.elements.length&&i.push(s),t.length>1){var c=t.slice(1);c=c.map(function(e){return e.createDerived(e.elements,[])}),i=i.concat(c)}return i}function s(e,t,n,r,i){var s;for(s=0;s<e.length;s++){var a=o(e[s],t,n,r);i.push(a)}return i}function c(e,t){var n,r;if(0!==e.length){if(0===t.length)return void t.push([new u(e)]);for(n=0;r=t[n];n++)r.length>0?r[r.length-1]=r[r.length-1].createDerived(r[r.length-1].elements.concat(e)):r.push(new u(e))}}function f(e,t,n){var h,p,d,v,m,g,y,w,b,x,S=!1;for(v=[],m=[[]],h=0;w=n.elements[h];h++)if("&"!==w.value){var I=function(e){var t;return e.value instanceof a?(t=e.value.value,t instanceof u?t:null):null}(w);if(null!=I){c(v,m);var C,_=[],k=[];for(C=f(_,t,I),S=S||C,d=0;d<_.length;d++){var A=i(r(_[d],w),w);s(m,[A],w,n,k)}m=k,v=[]}else v.push(w)}else{for(S=!0,g=[],c(v,m),p=0;p<m.length;p++)if(y=m[p],0===t.length)y.length>0&&y[0].elements.push(new l(w.combinator,"",w.isVariable,w._index,w._fileInfo)),g.push(y);else for(d=0;d<t.length;d++){var E=o(y,t[d],w,n);g.push(E)}m=g,v=[]}for(c(v,m),h=0;h<m.length;h++)(b=m[h].length)>0&&(e.push(m[h]),x=m[h][b-1],m[h][b-1]=x.createDerived(x.elements,n.extendList));return S}function h(e,t){var n=t.createDerived(t.elements,t.extendList,t.evaldCondition);return n.copyVisibilityInfo(e),n}var p,d;if(d=[],!f(d,t,n))if(t.length>0)for(d=[],p=0;p<t.length;p++){var m=t[p].map(h.bind(this,n.visibilityInfo()));m.push(n),d.push(m)}else d=[[n]];for(p=0;p<d.length;p++)e.push(d[p])},t.exports=m},{"../contexts":13,"../functions/default":25,"../functions/function-registry":27,"../utils":89,"./anonymous":50,"./comment":57,"./debug-info":59,"./declaration":60,"./element":63,"./keyword":70,"./node":76,"./paren":78,"./selector":82}],82:[function(e,t,n){var r=e("./node"),i=e("./element"),o=e("../less-error"),s=function(e,t,n,r,i,o){this.extendList=t,this.condition=n,this.evaldCondition=!n,this._index=r,this._fileInfo=i,this.elements=this.getElements(e),this.mixinElements_=void 0,this.copyVisibilityInfo(o),this.setParent(this.elements,this)};s.prototype=new r,s.prototype.type="Selector",s.prototype.accept=function(e){this.elements&&(this.elements=e.visitArray(this.elements)),this.extendList&&(this.extendList=e.visitArray(this.extendList)),this.condition&&(this.condition=e.visit(this.condition))},s.prototype.createDerived=function(e,t,n){e=this.getElements(e);var r=new s(e,t||this.extendList,null,this.getIndex(),this.fileInfo(),this.visibilityInfo());return r.evaldCondition=null!=n?n:this.evaldCondition,r.mediaEmpty=this.mediaEmpty,r},s.prototype.getElements=function(e){return e?("string"==typeof e&&this.parse.parseNode(e,["selector"],this._index,this._fileInfo,function(t,n){if(t)throw new o({index:t.index,message:t.message},this.parse.imports,this._fileInfo.filename);e=n[0].elements}),e):[new i("","&",!1,this._index,this._fileInfo)]},s.prototype.createEmptySelectors=function(){var e=new i("","&",!1,this._index,this._fileInfo),t=[new s([e],null,null,this._index,this._fileInfo)];return t[0].mediaEmpty=!0,t},s.prototype.match=function(e){var t,n,r=this.elements,i=r.length;if(e=e.mixinElements(),0===(t=e.length)||i<t)return 0;for(n=0;n<t;n++)if(r[n].value!==e[n])return 0;return t},s.prototype.mixinElements=function(){if(this.mixinElements_)return this.mixinElements_;var e=this.elements.map(function(e){return e.combinator.value+(e.value.value||e.value)}).join("").match(/[,&#\*\.\w-]([\w-]|(\\.))*/g);return e?"&"===e[0]&&e.shift():e=[],this.mixinElements_=e},s.prototype.isJustParentSelector=function(){return!this.mediaEmpty&&1===this.elements.length&&"&"===this.elements[0].value&&(" "===this.elements[0].combinator.value||""===this.elements[0].combinator.value)},s.prototype.eval=function(e){var t=this.condition&&this.condition.eval(e),n=this.elements,r=this.extendList;return n=n&&n.map(function(t){return t.eval(e)}),r=r&&r.map(function(t){return t.eval(e)}),this.createDerived(n,r,t)},s.prototype.genCSS=function(e,t){var n,r;for(e&&e.firstSelector||""!==this.elements[0].combinator.value||t.add(" ",this.fileInfo(),this.getIndex()),n=0;n<this.elements.length;n++)r=this.elements[n],r.genCSS(e,t)},s.prototype.getIsOutput=function(){return this.evaldCondition},t.exports=s},{"../less-error":38,"./element":63,"./node":76}],83:[function(e,t,n){var r=e("./node"),i=function(e){this.value=e};i.prototype=new r,i.prototype.type="UnicodeDescriptor",t.exports=i},{"./node":76}],84:[function(e,t,n){var r=e("./node"),i=e("../data/unit-conversions"),o=e("../utils"),s=function(e,t,n){this.numerator=e?o.copyArray(e).sort():[],this.denominator=t?o.copyArray(t).sort():[],n?this.backupUnit=n:e&&e.length&&(this.backupUnit=e[0])};s.prototype=new r,s.prototype.type="Unit",s.prototype.clone=function(){return new s(o.copyArray(this.numerator),o.copyArray(this.denominator),this.backupUnit)},s.prototype.genCSS=function(e,t){var n=e&&e.strictUnits;1===this.numerator.length?t.add(this.numerator[0]):!n&&this.backupUnit?t.add(this.backupUnit):!n&&this.denominator.length&&t.add(this.denominator[0])},s.prototype.toString=function(){var e,t=this.numerator.join("*");for(e=0;e<this.denominator.length;e++)t+="/"+this.denominator[e];return t},s.prototype.compare=function(e){return this.is(e.toString())?0:void 0},s.prototype.is=function(e){return this.toString().toUpperCase()===e.toUpperCase()},s.prototype.isLength=function(){return RegExp("^(px|em|ex|ch|rem|in|cm|mm|pc|pt|ex|vw|vh|vmin|vmax)$","gi").test(this.toCSS())},s.prototype.isEmpty=function(){return 0===this.numerator.length&&0===this.denominator.length},s.prototype.isSingular=function(){return this.numerator.length<=1&&0===this.denominator.length},s.prototype.map=function(e){var t;for(t=0;t<this.numerator.length;t++)this.numerator[t]=e(this.numerator[t],!1);for(t=0;t<this.denominator.length;t++)this.denominator[t]=e(this.denominator[t],!0)},s.prototype.usedUnits=function(){var e,t,n,r={};t=function(t){return e.hasOwnProperty(t)&&!r[n]&&(r[n]=t),t};for(n in i)i.hasOwnProperty(n)&&(e=i[n],this.map(t));return r},s.prototype.cancel=function(){var e,t,n={};for(t=0;t<this.numerator.length;t++)e=this.numerator[t],n[e]=(n[e]||0)+1;for(t=0;t<this.denominator.length;t++)e=this.denominator[t],n[e]=(n[e]||0)-1;this.numerator=[],this.denominator=[];for(e in n)if(n.hasOwnProperty(e)){var r=n[e];if(r>0)for(t=0;t<r;t++)this.numerator.push(e);else if(r<0)for(t=0;t<-r;t++)this.denominator.push(e)}this.numerator.sort(),this.denominator.sort()},t.exports=s},{"../data/unit-conversions":16,"../utils":89,"./node":76}],85:[function(e,t,n){function r(e){return e.replace(/[\(\)'"\s]/g,function(e){return"\\"+e})}var i=e("./node"),o=function(e,t,n,r){this.value=e,this._index=t,this._fileInfo=n,this.isEvald=r};o.prototype=new i,o.prototype.type="Url",o.prototype.accept=function(e){this.value=e.visit(this.value)},o.prototype.genCSS=function(e,t){t.add("url("),this.value.genCSS(e,t),t.add(")")},o.prototype.eval=function(e){var t,n=this.value.eval(e);if(!this.isEvald&&(t=this.fileInfo()&&this.fileInfo().rootpath,"string"==typeof t&&"string"==typeof n.value&&e.pathRequiresRewrite(n.value)?(n.quote||(t=r(t)),n.value=e.rewritePath(n.value,t)):n.value=e.normalizePath(n.value),e.urlArgs&&!n.value.match(/^\s*data:/))){var i=-1===n.value.indexOf("?")?"?":"&",s=i+e.urlArgs;-1!==n.value.indexOf("#")?n.value=n.value.replace("#",s+"#"):n.value+=s}return new o(n,this.getIndex(),this.fileInfo(),!0)},t.exports=o},{"./node":76}],86:[function(e,t,n){var r=e("./node"),i=function(e){if(!e)throw new Error("Value requires an array argument");Array.isArray(e)?this.value=e:this.value=[e]};i.prototype=new r,i.prototype.type="Value",i.prototype.accept=function(e){this.value&&(this.value=e.visitArray(this.value))},i.prototype.eval=function(e){return 1===this.value.length?this.value[0].eval(e):new i(this.value.map(function(t){return t.eval(e)}))},i.prototype.genCSS=function(e,t){var n;for(n=0;n<this.value.length;n++)this.value[n].genCSS(e,t),n+1<this.value.length&&t.add(e&&e.compress?",":", ")},t.exports=i},{"./node":76}],87:[function(e,t,n){var r=e("./node"),i=e("./variable"),o=e("./ruleset"),s=e("./detached-ruleset"),a=e("../less-error"),u=function(e,t,n){this.variable=e,this._index=t,this._fileInfo=n,this.allowRoot=!0};u.prototype=new r,u.prototype.type="VariableCall",u.prototype.eval=function(e){var t,n=new i(this.variable,this.getIndex(),this.fileInfo()).eval(e),r=new a({message:"Could not evaluate variable call "+this.variable});if(!n.ruleset){if(Array.isArray(n))t=n;else{if(!Array.isArray(n.value))throw r;t=n.value}n=new s(new o("",t))}if(n.ruleset)return n.callEval(e);throw r},t.exports=u},{"../less-error":38,"./detached-ruleset":61,"./node":76,"./ruleset":81,"./variable":88}],88:[function(e,t,n){var r=e("./node"),i=e("./call"),o=function(e,t,n){this.name=e,this._index=t,this._fileInfo=n};o.prototype=new r,o.prototype.type="Variable",o.prototype.eval=function(e){var t,n=this.name;if(0===n.indexOf("@@")&&(n="@"+new o(n.slice(1),this.getIndex(),this.fileInfo()).eval(e).value),this.evaluating)throw{type:"Name",message:"Recursive variable definition for "+n,filename:this.fileInfo().filename,index:this.getIndex()};if(this.evaluating=!0,t=this.find(e.frames,function(t){var r=t.variable(n);if(r){if(r.important){e.importantScope[e.importantScope.length-1].important=r.important}return e.inCalc?new i("_SELF",[r.value]).eval(e):r.value.eval(e)}}))return this.evaluating=!1,t;throw{type:"Name",message:"variable "+n+" is undefined",filename:this.fileInfo().filename,index:this.getIndex()}},o.prototype.find=function(e,t){for(var n,r=0;r<e.length;r++)if(n=t.call(e,e[r]))return n;return null},t.exports=o},{"./call":54,"./node":76}],89:[function(e,t,n){var r=e("./constants"),i=e("clone"),o={getLocation:function(e,t){for(var n=e+1,r=null,i=-1;--n>=0&&"\n"!==t.charAt(n);)i++;return"number"==typeof e&&(r=(t.slice(0,e).match(/\n/g)||"").length),{line:r,column:i}},copyArray:function(e){var t,n=e.length,r=new Array(n);for(t=0;t<n;t++)r[t]=e[t];return r},clone:function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},copyOptions:function(e,t){if(t&&t._defaults)return t;var n=o.defaults(e,t);if(n.strictMath&&(n.math=r.Math.STRICT_LEGACY),n.relativeUrls&&(n.rewriteUrls=r.RewriteUrls.ALL),"string"==typeof n.math)switch(n.math.toLowerCase()){case"always":n.math=r.Math.ALWAYS;break;case"parens-division":n.math=r.Math.PARENS_DIVISION;break;case"strict":case"parens":n.math=r.Math.PARENS;break;case"strict-legacy":n.math=r.Math.STRICT_LEGACY}if("string"==typeof n.rewriteUrls)switch(n.rewriteUrls.toLowerCase()){case"off":n.rewriteUrls=r.RewriteUrls.OFF;break;case"local":n.rewriteUrls=r.RewriteUrls.LOCAL;break;case"all":n.rewriteUrls=r.RewriteUrls.ALL}return n},defaults:function(e,t){var n=t||{};if(!t._defaults){n={};var r=i(e);n._defaults=r;var o=t?i(t):{};Object.assign(n,r,o)}return n},merge:function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},flattenArray:function(e,t){t=t||[];for(var n=0,r=e.length;n<r;n++){var i=e[n];Array.isArray(i)?o.flattenArray(i,t):void 0!==i&&t.push(i)}return t}};t.exports=o},{"./constants":12,clone:102}],90:[function(e,t,n){var r=e("../tree"),i=e("./visitor"),o=e("../logger"),s=e("../utils"),a=function(){this._visitor=new i(this),this.contexts=[],this.allExtendsStack=[[]]};a.prototype={run:function(e){return e=this._visitor.visit(e),e.allExtends=this.allExtendsStack[0],e},visitDeclaration:function(e,t){t.visitDeeper=!1},visitMixinDefinition:function(e,t){t.visitDeeper=!1},visitRuleset:function(e,t){if(!e.root){var n,i,o,a,u=[],l=e.rules,c=l?l.length:0;for(n=0;n<c;n++)e.rules[n]instanceof r.Extend&&(u.push(l[n]),e.extendOnEveryPath=!0);var f=e.paths;for(n=0;n<f.length;n++){var h=f[n],p=h[h.length-1],d=p.extendList;for(a=d?s.copyArray(d).concat(u):u,a&&(a=a.map(function(e){return e.clone()})),i=0;i<a.length;i++)this.foundExtends=!0,o=a[i],o.findSelfSelectors(h),o.ruleset=e,0===i&&(o.firstExtendOnThisSelectorPath=!0),this.allExtendsStack[this.allExtendsStack.length-1].push(o)}this.contexts.push(e.selectors)}},visitRulesetOut:function(e){e.root||(this.contexts.length=this.contexts.length-1)},visitMedia:function(e,t){e.allExtends=[],this.allExtendsStack.push(e.allExtends)},visitMediaOut:function(e){this.allExtendsStack.length=this.allExtendsStack.length-1},visitAtRule:function(e,t){e.allExtends=[],this.allExtendsStack.push(e.allExtends)},visitAtRuleOut:function(e){this.allExtendsStack.length=this.allExtendsStack.length-1}};var u=function(){this._visitor=new i(this)};u.prototype={run:function(e){var t=new a;if(this.extendIndices={},t.run(e),!t.foundExtends)return e;e.allExtends=e.allExtends.concat(this.doExtendChaining(e.allExtends,e.allExtends)),this.allExtendsStack=[e.allExtends];var n=this._visitor.visit(e);return this.checkExtendsForNonMatched(e.allExtends),n},checkExtendsForNonMatched:function(e){var t=this.extendIndices;e.filter(function(e){return!e.hasFoundMatches&&1==e.parent_ids.length}).forEach(function(e){var n="_unknown_";try{n=e.selector.toCSS({})}catch(e){}t[e.index+" "+n]||(t[e.index+" "+n]=!0,o.warn("extend '"+n+"' has no matches"))})},doExtendChaining:function(e,t,n){var i,o,s,a,u,l,c,f,h=[],p=this;for(n=n||0,i=0;i<e.length;i++)for(o=0;o<t.length;o++)l=e[i],c=t[o],l.parent_ids.indexOf(c.object_id)>=0||(u=[c.selfSelectors[0]],s=p.findMatch(l,u),s.length&&(l.hasFoundMatches=!0,l.selfSelectors.forEach(function(e){var t=c.visibilityInfo();a=p.extendSelector(s,u,e,l.isVisible()),f=new r.Extend(c.selector,c.option,0,c.fileInfo(),t),f.selfSelectors=a,a[a.length-1].extendList=[f],h.push(f),f.ruleset=c.ruleset,f.parent_ids=f.parent_ids.concat(c.parent_ids,l.parent_ids),c.firstExtendOnThisSelectorPath&&(f.firstExtendOnThisSelectorPath=!0,c.ruleset.paths.push(a))})));if(h.length){if(this.extendChainCount++,n>100){var d="{unable to calculate}",v="{unable to calculate}";try{d=h[0].selfSelectors[0].toCSS(),v=h[0].selector.toCSS()}catch(e){}throw{message:"extend circular reference detected. One of the circular extends is currently:"+d+":extend("+v+")"}}return h.concat(p.doExtendChaining(h,t,n+1))}return h},visitDeclaration:function(e,t){t.visitDeeper=!1},visitMixinDefinition:function(e,t){t.visitDeeper=!1},visitSelector:function(e,t){t.visitDeeper=!1},visitRuleset:function(e,t){if(!e.root){var n,r,i,o,s=this.allExtendsStack[this.allExtendsStack.length-1],a=[],u=this;for(i=0;i<s.length;i++)for(r=0;r<e.paths.length;r++)if(o=e.paths[r],!e.extendOnEveryPath){var l=o[o.length-1].extendList;l&&l.length||(n=this.findMatch(s[i],o),n.length&&(s[i].hasFoundMatches=!0,s[i].selfSelectors.forEach(function(e){var t;t=u.extendSelector(n,o,e,s[i].isVisible()),a.push(t)})))}e.paths=e.paths.concat(a)}},findMatch:function(e,t){var n,r,i,o,s,a,u,l=this,c=e.selector.elements,f=[],h=[];for(n=0;n<t.length;n++)for(r=t[n],i=0;i<r.elements.length;i++)for(o=r.elements[i],(e.allowBefore||0===n&&0===i)&&f.push({pathIndex:n,index:i,matched:0,initialCombinator:o.combinator}),a=0;a<f.length;a++)u=f[a],s=o.combinator.value,""===s&&0===i&&(s=" "),!l.isElementValuesEqual(c[u.matched].value,o.value)||u.matched>0&&c[u.matched].combinator.value!==s?u=null:u.matched++,u&&(u.finished=u.matched===c.length,u.finished&&!e.allowAfter&&(i+1<r.elements.length||n+1<t.length)&&(u=null)),u?u.finished&&(u.length=c.length,u.endPathIndex=n,u.endPathElementIndex=i+1,f.length=0,h.push(u)):(f.splice(a,1),a--);return h},isElementValuesEqual:function(e,t){if("string"==typeof e||"string"==typeof t)return e===t;if(e instanceof r.Attribute)return e.op===t.op&&e.key===t.key&&(e.value&&t.value?(e=e.value.value||e.value,t=t.value.value||t.value,e===t):!e.value&&!t.value);if(e=e.value,t=t.value,e instanceof r.Selector){if(!(t instanceof r.Selector)||e.elements.length!==t.elements.length)return!1;for(var n=0;n<e.elements.length;n++){if(e.elements[n].combinator.value!==t.elements[n].combinator.value&&(0!==n||(e.elements[n].combinator.value||" ")!==(t.elements[n].combinator.value||" ")))return!1;if(!this.isElementValuesEqual(e.elements[n].value,t.elements[n].value))return!1}return!0}return!1},extendSelector:function(e,t,n,i){var o,s,a,u,l,c=0,f=0,h=[];for(o=0;o<e.length;o++)u=e[o],s=t[u.pathIndex],a=new r.Element(u.initialCombinator,n.elements[0].value,n.elements[0].isVariable,n.elements[0].getIndex(),n.elements[0].fileInfo()),u.pathIndex>c&&f>0&&(h[h.length-1].elements=h[h.length-1].elements.concat(t[c].elements.slice(f)),f=0,c++),l=s.elements.slice(f,u.index).concat([a]).concat(n.elements.slice(1)),c===u.pathIndex&&o>0?h[h.length-1].elements=h[h.length-1].elements.concat(l):(h=h.concat(t.slice(c,u.pathIndex)),h.push(new r.Selector(l))),c=u.endPathIndex,(f=u.endPathElementIndex)>=t[c].elements.length&&(f=0,c++);return c<t.length&&f>0&&(h[h.length-1].elements=h[h.length-1].elements.concat(t[c].elements.slice(f)),c++),h=h.concat(t.slice(c,t.length)),h=h.map(function(e){var t=e.createDerived(e.elements);return i?t.ensureVisibility():t.ensureInvisibility(),t})},visitMedia:function(e,t){var n=e.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1]);n=n.concat(this.doExtendChaining(n,e.allExtends)),this.allExtendsStack.push(n)},visitMediaOut:function(e){var t=this.allExtendsStack.length-1;this.allExtendsStack.length=t},visitAtRule:function(e,t){var n=e.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1]);n=n.concat(this.doExtendChaining(n,e.allExtends)),this.allExtendsStack.push(n)},visitAtRuleOut:function(e){var t=this.allExtendsStack.length-1;this.allExtendsStack.length=t}},t.exports=u},{"../logger":39,"../tree":67,"../utils":89,"./visitor":97}],91:[function(e,t,n){function r(e){this.imports=[],this.variableImports=[],this._onSequencerEmpty=e,this._currentDepth=0}r.prototype.addImport=function(e){var t=this,n={callback:e,args:null,isReady:!1};return this.imports.push(n),function(){n.args=Array.prototype.slice.call(arguments,0),n.isReady=!0,t.tryRun()}},r.prototype.addVariableImport=function(e){this.variableImports.push(e)},r.prototype.tryRun=function(){this._currentDepth++;try{for(;;){for(;this.imports.length>0;){var e=this.imports[0];if(!e.isReady)return;this.imports=this.imports.slice(1),e.callback.apply(null,e.args)}if(0===this.variableImports.length)break;var t=this.variableImports[0];this.variableImports=this.variableImports.slice(1),t()}}finally{this._currentDepth--}0===this._currentDepth&&this._onSequencerEmpty&&this._onSequencerEmpty()},t.exports=r},{}],92:[function(e,t,n){var r=e("../contexts"),i=e("./visitor"),o=e("./import-sequencer"),s=e("../utils"),a=function(e,t){this._visitor=new i(this),this._importer=e,this._finish=t,this.context=new r.Eval,this.importCount=0,this.onceFileDetectionMap={},this.recursionDetector={},this._sequencer=new o(this._onSequencerEmpty.bind(this))};a.prototype={isReplacing:!1,run:function(e){try{this._visitor.visit(e)}catch(e){this.error=e}this.isFinished=!0,this._sequencer.tryRun()},_onSequencerEmpty:function(){this.isFinished&&this._finish(this.error)},visitImport:function(e,t){var n=e.options.inline;if(!e.css||n){var i=new r.Eval(this.context,s.copyArray(this.context.frames)),o=i.frames[0];this.importCount++,e.isVariableImport()?this._sequencer.addVariableImport(this.processImportNode.bind(this,e,i,o)):this.processImportNode(e,i,o)}t.visitDeeper=!1},processImportNode:function(e,t,n){var r,i=e.options.inline;try{r=e.evalForImport(t)}catch(t){t.filename||(t.index=e.getIndex(),t.filename=e.fileInfo().filename),e.css=!0,e.error=t}if(!r||r.css&&!i)this.importCount--,this.isFinished&&this._sequencer.tryRun();else{r.options.multiple&&(t.importMultiple=!0);for(var o=void 0===r.css,s=0;s<n.rules.length;s++)if(n.rules[s]===e){n.rules[s]=r;break}var a=this.onImported.bind(this,r,t),u=this._sequencer.addImport(a);this._importer.push(r.getPath(),o,r.fileInfo(),r.options,u)}},onImported:function(e,t,n,r,i,o){n&&(n.filename||(n.index=e.getIndex(),n.filename=e.fileInfo().filename),this.error=n);var s=this,a=e.options.inline,u=e.options.isPlugin,l=e.options.optional,c=i||o in s.recursionDetector;if(t.importMultiple||(e.skip=!!c||function(){return o in s.onceFileDetectionMap||(s.onceFileDetectionMap[o]=!0,!1)}),!o&&l&&(e.skip=!0),r&&(e.root=r,e.importedFilename=o,!a&&!u&&(t.importMultiple||!c))){s.recursionDetector[o]=!0;var f=this.context;this.context=t;try{this._visitor.visit(r)}catch(n){this.error=n}this.context=f}s.importCount--,s.isFinished&&s._sequencer.tryRun()},visitDeclaration:function(e,t){"DetachedRuleset"===e.value.type?this.context.frames.unshift(e):t.visitDeeper=!1},visitDeclarationOut:function(e){"DetachedRuleset"===e.value.type&&this.context.frames.shift()},visitAtRule:function(e,t){this.context.frames.unshift(e)},visitAtRuleOut:function(e){this.context.frames.shift()},visitMixinDefinition:function(e,t){this.context.frames.unshift(e)},visitMixinDefinitionOut:function(e){this.context.frames.shift()},visitRuleset:function(e,t){this.context.frames.unshift(e)},visitRulesetOut:function(e){this.context.frames.shift()},visitMedia:function(e,t){this.context.frames.unshift(e.rules[0])},visitMediaOut:function(e){this.context.frames.shift()}},t.exports=a},{"../contexts":13,"../utils":89,"./import-sequencer":91,"./visitor":97}],93:[function(e,t,n){var r={Visitor:e("./visitor"),ImportVisitor:e("./import-visitor"),MarkVisibleSelectorsVisitor:e("./set-tree-visibility-visitor"),ExtendVisitor:e("./extend-visitor"),JoinSelectorVisitor:e("./join-selector-visitor"),ToCSSVisitor:e("./to-css-visitor")};t.exports=r},{"./extend-visitor":90,"./import-visitor":92,"./join-selector-visitor":94,"./set-tree-visibility-visitor":95,"./to-css-visitor":96,"./visitor":97}],94:[function(e,t,n){var r=e("./visitor"),i=function(){this.contexts=[[]],this._visitor=new r(this)};i.prototype={run:function(e){return this._visitor.visit(e)},visitDeclaration:function(e,t){t.visitDeeper=!1},visitMixinDefinition:function(e,t){t.visitDeeper=!1},visitRuleset:function(e,t){var n,r=this.contexts[this.contexts.length-1],i=[];this.contexts.push(i),e.root||(n=e.selectors,n&&(n=n.filter(function(e){return e.getIsOutput()}),e.selectors=n.length?n:n=null,n&&e.joinSelectors(i,r,n)),n||(e.rules=null),e.paths=i)},visitRulesetOut:function(e){this.contexts.length=this.contexts.length-1},visitMedia:function(e,t){var n=this.contexts[this.contexts.length-1];e.rules[0].root=0===n.length||n[0].multiMedia},visitAtRule:function(e,t){var n=this.contexts[this.contexts.length-1];e.rules&&e.rules.length&&(e.rules[0].root=e.isRooted||0===n.length||null)}},t.exports=i},{"./visitor":97}],95:[function(e,t,n){var r=function(e){this.visible=e};r.prototype.run=function(e){this.visit(e)},r.prototype.visitArray=function(e){if(!e)return e;var t,n=e.length;for(t=0;t<n;t++)this.visit(e[t]);return e},r.prototype.visit=function(e){return e?e.constructor===Array?this.visitArray(e):!e.blocksVisibility||e.blocksVisibility()?e:(this.visible?e.ensureVisibility():e.ensureInvisibility(),e.accept(this),e):e},t.exports=r},{}],96:[function(e,t,n){var r=e("../tree"),i=e("./visitor"),o=function(e){this._visitor=new i(this),this._context=e};o.prototype={containsSilentNonBlockedChild:function(e){var t;if(!e)return!1;for(var n=0;n<e.length;n++)if(t=e[n],t.isSilent&&t.isSilent(this._context)&&!t.blocksVisibility())return!0;return!1},keepOnlyVisibleChilds:function(e){e&&e.rules&&(e.rules=e.rules.filter(function(e){return e.isVisible()}))},isEmpty:function(e){return!e||!e.rules||0===e.rules.length},hasVisibleSelector:function(e){return!(!e||!e.paths)&&e.paths.length>0},resolveVisibility:function(e,t){if(!e.blocksVisibility()){if(this.isEmpty(e)&&!this.containsSilentNonBlockedChild(t))return;return e}var n=e.rules[0];if(this.keepOnlyVisibleChilds(n),!this.isEmpty(n))return e.ensureVisibility(),e.removeVisibilityBlock(),e},isVisibleRuleset:function(e){return!!e.firstRoot||!this.isEmpty(e)&&!(!e.root&&!this.hasVisibleSelector(e))}};var s=function(e){this._visitor=new i(this),this._context=e,this.utils=new o(e)};s.prototype={isReplacing:!0,run:function(e){return this._visitor.visit(e)},visitDeclaration:function(e,t){if(!e.blocksVisibility()&&!e.variable)return e},visitMixinDefinition:function(e,t){e.frames=[]},visitExtend:function(e,t){},visitComment:function(e,t){if(!e.blocksVisibility()&&!e.isSilent(this._context))return e},visitMedia:function(e,t){var n=e.rules[0].rules;return e.accept(this._visitor),t.visitDeeper=!1,this.utils.resolveVisibility(e,n)},visitImport:function(e,t){if(!e.blocksVisibility())return e},visitAtRule:function(e,t){return e.rules&&e.rules.length?this.visitAtRuleWithBody(e,t):this.visitAtRuleWithoutBody(e,t)},visitAnonymous:function(e,t){if(!e.blocksVisibility())return e.accept(this._visitor),e},visitAtRuleWithBody:function(e,t){function n(e){var t=e.rules;return 1===t.length&&(!t[0].paths||0===t[0].paths.length)}var r=function(e){var t=e.rules;return n(e)?t[0].rules:t}(e);return e.accept(this._visitor),t.visitDeeper=!1,this.utils.isEmpty(e)||this._mergeRules(e.rules[0].rules),this.utils.resolveVisibility(e,r)},visitAtRuleWithoutBody:function(e,t){if(!e.blocksVisibility()){if("@charset"===e.name){if(this.charset){if(e.debugInfo){var n=new r.Comment("/* "+e.toCSS(this._context).replace(/\n/g,"")+" */\n");return n.debugInfo=e.debugInfo,this._visitor.visit(n)}return}this.charset=!0}return e}},checkValidNodes:function(e,t){if(e)for(var n=0;n<e.length;n++){var i=e[n];if(t&&i instanceof r.Declaration&&!i.variable)throw{message:"Properties must be inside selector blocks. They cannot be in the root",index:i.getIndex(),filename:i.fileInfo()&&i.fileInfo().filename};if(i instanceof r.Call)throw{message:"Function '"+i.name+"' is undefined",index:i.getIndex(),filename:i.fileInfo()&&i.fileInfo().filename};if(i.type&&!i.allowRoot)throw{message:i.type+" node returned by a function is not valid here",index:i.getIndex(),filename:i.fileInfo()&&i.fileInfo().filename}}},visitRuleset:function(e,t){var n,r=[];if(this.checkValidNodes(e.rules,e.firstRoot),e.root)e.accept(this._visitor),t.visitDeeper=!1;else{this._compileRulesetPaths(e);for(var i=e.rules,o=i?i.length:0,s=0;s<o;)n=i[s],n&&n.rules?(r.push(this._visitor.visit(n)),i.splice(s,1),o--):s++;o>0?e.accept(this._visitor):e.rules=null,t.visitDeeper=!1}return e.rules&&(this._mergeRules(e.rules),this._removeDuplicateRules(e.rules)),this.utils.isVisibleRuleset(e)&&(e.ensureVisibility(),r.splice(0,0,e)),1===r.length?r[0]:r},_compileRulesetPaths:function(e){e.paths&&(e.paths=e.paths.filter(function(e){var t;for(" "===e[0].elements[0].combinator.value&&(e[0].elements[0].combinator=new r.Combinator("")),t=0;t<e.length;t++)if(e[t].isVisible()&&e[t].getIsOutput())return!0;return!1}))},_removeDuplicateRules:function(e){if(e){var t,n,i,o={};for(i=e.length-1;i>=0;i--)if((n=e[i])instanceof r.Declaration)if(o[n.name]){t=o[n.name],t instanceof r.Declaration&&(t=o[n.name]=[o[n.name].toCSS(this._context)]);var s=n.toCSS(this._context);-1!==t.indexOf(s)?e.splice(i,1):t.push(s)}else o[n.name]=n}},_mergeRules:function(e){if(e){for(var t={},n=[],i=0;i<e.length;i++){var o=e[i];if(o.merge){var s=o.name;t[s]?e.splice(i--,1):n.push(t[s]=[]),t[s].push(o)}}n.forEach(function(e){if(e.length>0){var t=e[0],n=[],i=[new r.Expression(n)];e.forEach(function(e){"+"===e.merge&&n.length>0&&i.push(new r.Expression(n=[])),n.push(e.value),t.important=t.important||e.important}),t.value=new r.Value(i)}})}}},t.exports=s},{"../tree":67,"./visitor":97}],97:[function(e,t,n){function r(e){return e}function i(e,t){var n,r;for(n in e)switch(r=e[n],void 0===r?"undefined":_typeof(r)){case"function":r.prototype&&r.prototype.type&&(r.prototype.typeIndex=t++);break;case"object":t=i(r,t)}return t}var o=e("../tree"),s={visitDeeper:!0},a=!1,u=function(e){this._implementation=e,this._visitInCache={},this._visitOutCache={},a||(i(o,1),a=!0)};u.prototype={visit:function(e){if(!e)return e;var t=e.typeIndex;if(!t)return e.value&&e.value.typeIndex&&this.visit(e.value),e;var n,i=this._implementation,o=this._visitInCache[t],a=this._visitOutCache[t],u=s;if(u.visitDeeper=!0,o||(n="visit"+e.type,o=i[n]||r,a=i[n+"Out"]||r,this._visitInCache[t]=o,this._visitOutCache[t]=a),o!==r){var l=o.call(i,e,u);e&&i.isReplacing&&(e=l)}return u.visitDeeper&&e&&e.accept&&e.accept(this),a!=r&&a.call(i,e),e},
visitArray:function(e,t){if(!e)return e;var n,r=e.length;if(t||!this._implementation.isReplacing){for(n=0;n<r;n++)this.visit(e[n]);return e}var i=[];for(n=0;n<r;n++){var o=this.visit(e[n]);void 0!==o&&(o.splice?o.length&&this.flatten(o,i):i.push(o))}return i},flatten:function(e,t){t||(t=[]);var n,r,i,o,s,a;for(r=0,n=e.length;r<n;r++)if(void 0!==(i=e[r]))if(i.splice)for(s=0,o=i.length;s<o;s++)void 0!==(a=i[s])&&(a.splice?a.length&&this.flatten(a,t):t.push(a));else t.push(i);return t}},t.exports=u},{"../tree":67}],98:[function(e,t,n){function r(){if(u.length)throw u.shift()}function i(e){var t;t=a.length?a.pop():new o,t.task=e,s(t)}function o(){this.task=null}var s=e("./raw"),a=[],u=[],l=s.makeRequestCallFromTimer(r);t.exports=i,o.prototype.call=function(){try{this.task.call()}catch(e){i.onerror?i.onerror(e):(u.push(e),l())}finally{this.task=null,a[a.length]=this}}},{"./raw":99}],99:[function(e,t,n){(function(e){function n(e){s.length||(o(),a=!0),s[s.length]=e}function r(){for(;u<s.length;){var e=u;if(u+=1,s[e].call(),u>l){for(var t=0,n=s.length-u;t<n;t++)s[t]=s[t+u];s.length-=u,u=0}}s.length=0,u=0,a=!1}function i(e){return function(){function t(){clearTimeout(n),clearInterval(r),e()}var n=setTimeout(t,0),r=setInterval(t,50)}}t.exports=n;var o,s=[],a=!1,u=0,l=1024,c=void 0!==e?e:self,f=c.MutationObserver||c.WebKitMutationObserver;o="function"==typeof f?function(e){var t=1,n=new f(e),r=document.createTextNode("");return n.observe(r,{characterData:!0}),function(){t=-t,r.data=t}}(r):i(r),n.requestFlush=o,n.makeRequestCallFromTimer=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],100:[function(e,t,n){function r(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===e[t-2]?2:"="===e[t-1]?1:0}function i(e){return 3*e.length/4-r(e)}function o(e){var t,n,i,o,s,a=e.length;o=r(e),s=new f(3*a/4-o),n=o>0?a-4:a;var u=0;for(t=0;t<n;t+=4)i=c[e.charCodeAt(t)]<<18|c[e.charCodeAt(t+1)]<<12|c[e.charCodeAt(t+2)]<<6|c[e.charCodeAt(t+3)],s[u++]=i>>16&255,s[u++]=i>>8&255,s[u++]=255&i;return 2===o?(i=c[e.charCodeAt(t)]<<2|c[e.charCodeAt(t+1)]>>4,s[u++]=255&i):1===o&&(i=c[e.charCodeAt(t)]<<10|c[e.charCodeAt(t+1)]<<4|c[e.charCodeAt(t+2)]>>2,s[u++]=i>>8&255,s[u++]=255&i),s}function s(e){return l[e>>18&63]+l[e>>12&63]+l[e>>6&63]+l[63&e]}function a(e,t,n){for(var r,i=[],o=t;o<n;o+=3)r=(e[o]<<16)+(e[o+1]<<8)+e[o+2],i.push(s(r));return i.join("")}function u(e){for(var t,n=e.length,r=n%3,i="",o=[],s=0,u=n-r;s<u;s+=16383)o.push(a(e,s,s+16383>u?u:s+16383));return 1===r?(t=e[n-1],i+=l[t>>2],i+=l[t<<4&63],i+="=="):2===r&&(t=(e[n-2]<<8)+e[n-1],i+=l[t>>10],i+=l[t>>4&63],i+=l[t<<2&63],i+="="),o.push(i),o.join("")}n.byteLength=i,n.toByteArray=o,n.fromByteArray=u;for(var l=[],c=[],f="undefined"!=typeof Uint8Array?Uint8Array:Array,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",p=0,d=h.length;p<d;++p)l[p]=h[p],c[h.charCodeAt(p)]=p;c["-".charCodeAt(0)]=62,c["_".charCodeAt(0)]=63},{}],101:[function(e,t,n){function r(e){if(e>K)throw new RangeError("Invalid typed array length");var t=new Uint8Array(e);return t.__proto__=i.prototype,t}function i(e,t,n){if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return u(e)}return o(e,t,n)}function o(e,t,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return H(e)?f(e,t,n):"string"==typeof e?l(e,t):h(e)}function s(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function a(e,t,n){return s(e),e<=0?r(e):void 0!==t?"string"==typeof n?r(e).fill(t,n):r(e).fill(t):r(e)}function u(e){return s(e),r(e<0?0:0|p(e))}function l(e,t){if("string"==typeof t&&""!==t||(t="utf8"),!i.isEncoding(t))throw new TypeError('"encoding" must be a valid string encoding');var n=0|v(e,t),o=r(n),s=o.write(e,t);return s!==n&&(o=o.slice(0,s)),o}function c(e){for(var t=e.length<0?0:0|p(e.length),n=r(t),i=0;i<t;i+=1)n[i]=255&e[i];return n}function f(e,t,n){if(t<0||e.byteLength<t)throw new RangeError("'offset' is out of bounds");if(e.byteLength<t+(n||0))throw new RangeError("'length' is out of bounds");var r;return r=void 0===t&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,t):new Uint8Array(e,t,n),r.__proto__=i.prototype,r}function h(e){if(i.isBuffer(e)){var t=0|p(e.length),n=r(t);return 0===n.length?n:(e.copy(n,0,0,t),n)}if(e){if(G(e)||"length"in e)return"number"!=typeof e.length||J(e.length)?r(0):c(e);if("Buffer"===e.type&&Array.isArray(e.data))return c(e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function p(e){if(e>=K)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+K.toString(16)+" bytes");return 0|e}function d(e){return+e!=e&&(e=0),i.alloc(+e)}function v(e,t){if(i.isBuffer(e))return e.length;if(G(e)||H(e))return e.byteLength;"string"!=typeof e&&(e=""+e);var n=e.length;if(0===n)return 0;for(var r=!1;;)switch(t){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return D(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return q(e).length;default:if(r)return D(e).length;t=(""+t).toLowerCase(),r=!0}}function m(e,t,n){var r=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if(n>>>=0,t>>>=0,n<=t)return"";for(e||(e="utf8");;)switch(e){case"hex":return P(this,t,n);case"utf8":case"utf-8":return A(this,t,n);case"ascii":return M(this,t,n);case"latin1":case"binary":return R(this,t,n);case"base64":return k(this,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return L(this,t,n);default:if(r)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),r=!0}}function g(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function y(e,t,n,r,o){if(0===e.length)return-1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,J(n)&&(n=o?0:e.length-1),n<0&&(n=e.length+n),n>=e.length){if(o)return-1;n=e.length-1}else if(n<0){if(!o)return-1;n=0}if("string"==typeof t&&(t=i.from(t,r)),i.isBuffer(t))return 0===t.length?-1:w(e,t,n,r,o);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(e,t,n):Uint8Array.prototype.lastIndexOf.call(e,t,n):w(e,[t],n,r,o);throw new TypeError("val must be string, number or Buffer")}function w(e,t,n,r,i){function o(e,t){return 1===s?e[t]:e.readUInt16BE(t*s)}var s=1,a=e.length,u=t.length;if(void 0!==r&&("ucs2"===(r=String(r).toLowerCase())||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(e.length<2||t.length<2)return-1;s=2,a/=2,u/=2,n/=2}var l;if(i){var c=-1;for(l=n;l<a;l++)if(o(e,l)===o(t,-1===c?0:l-c)){if(-1===c&&(c=l),l-c+1===u)return c*s}else-1!==c&&(l-=l-c),c=-1}else for(n+u>a&&(n=a-u),l=n;l>=0;l--){for(var f=!0,h=0;h<u;h++)if(o(e,l+h)!==o(t,h)){f=!1;break}if(f)return l}return-1}function b(e,t,n,r){n=Number(n)||0;var i=e.length-n;r?(r=Number(r))>i&&(r=i):r=i;var o=t.length;if(o%2!=0)throw new TypeError("Invalid hex string");r>o/2&&(r=o/2);for(var s=0;s<r;++s){var a=parseInt(t.substr(2*s,2),16);if(J(a))return s;e[n+s]=a}return s}function x(e,t,n,r){return z(D(t,e.length-n),e,n,r)}function S(e,t,n,r){return z(N(t),e,n,r)}function I(e,t,n,r){return S(e,t,n,r)}function C(e,t,n,r){return z(q(t),e,n,r)}function _(e,t,n,r){return z(T(t,e.length-n),e,n,r)}function k(e,t,n){return 0===t&&n===e.length?W.fromByteArray(e):W.fromByteArray(e.slice(t,n))}function A(e,t,n){n=Math.min(e.length,n);for(var r=[],i=t;i<n;){var o=e[i],s=null,a=o>239?4:o>223?3:o>191?2:1;if(i+a<=n){var u,l,c,f;switch(a){case 1:o<128&&(s=o);break;case 2:u=e[i+1],128==(192&u)&&(f=(31&o)<<6|63&u)>127&&(s=f);break;case 3:u=e[i+1],l=e[i+2],128==(192&u)&&128==(192&l)&&(f=(15&o)<<12|(63&u)<<6|63&l)>2047&&(f<55296||f>57343)&&(s=f);break;case 4:u=e[i+1],l=e[i+2],c=e[i+3],128==(192&u)&&128==(192&l)&&128==(192&c)&&(f=(15&o)<<18|(63&u)<<12|(63&l)<<6|63&c)>65535&&f<1114112&&(s=f)}}null===s?(s=65533,a=1):s>65535&&(s-=65536,r.push(s>>>10&1023|55296),s=56320|1023&s),r.push(s),i+=a}return E(r)}function E(e){var t=e.length;if(t<=Q)return String.fromCharCode.apply(String,e);for(var n="",r=0;r<t;)n+=String.fromCharCode.apply(String,e.slice(r,r+=Q));return n}function M(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(127&e[i]);return r}function R(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(e[i]);return r}function P(e,t,n){var r=e.length;(!t||t<0)&&(t=0),(!n||n<0||n>r)&&(n=r);for(var i="",o=t;o<n;++o)i+=j(e[o]);return i}function L(e,t,n){for(var r=e.slice(t,n),i="",o=0;o<r.length;o+=2)i+=String.fromCharCode(r[o]+256*r[o+1]);return i}function F(e,t,n){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>n)throw new RangeError("Trying to access beyond buffer length")}function O(e,t,n,r,o,s){if(!i.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>o||t<s)throw new RangeError('"value" argument is out of bounds');if(n+r>e.length)throw new RangeError("Index out of range")}function V(e,t,n,r,i,o){if(n+r>e.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function $(e,t,n,r,i){return t=+t,n>>>=0,i||V(e,t,n,4,3.4028234663852886e38,-3.4028234663852886e38),Y.write(e,t,n,r,23,4),n+4}function B(e,t,n,r,i){return t=+t,n>>>=0,i||V(e,t,n,8,1.7976931348623157e308,-1.7976931348623157e308),Y.write(e,t,n,r,52,8),n+8}function U(e){if(e=e.trim().replace(Z,""),e.length<2)return"";for(;e.length%4!=0;)e+="=";return e}function j(e){return e<16?"0"+e.toString(16):e.toString(16)}function D(e,t){t=t||1/0;for(var n,r=e.length,i=null,o=[],s=0;s<r;++s){if((n=e.charCodeAt(s))>55295&&n<57344){if(!i){if(n>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(s+1===r){(t-=3)>-1&&o.push(239,191,189);continue}i=n;continue}if(n<56320){(t-=3)>-1&&o.push(239,191,189),i=n;continue}n=65536+(i-55296<<10|n-56320)}else i&&(t-=3)>-1&&o.push(239,191,189);if(i=null,n<128){if((t-=1)<0)break;o.push(n)}else if(n<2048){if((t-=2)<0)break;o.push(n>>6|192,63&n|128)}else if(n<65536){if((t-=3)<0)break;o.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return o}function N(e){for(var t=[],n=0;n<e.length;++n)t.push(255&e.charCodeAt(n));return t}function T(e,t){for(var n,r,i,o=[],s=0;s<e.length&&!((t-=2)<0);++s)n=e.charCodeAt(s),r=n>>8,i=n%256,o.push(i),o.push(r);return o}function q(e){return W.toByteArray(U(e))}function z(e,t,n,r){for(var i=0;i<r&&!(i+n>=t.length||i>=e.length);++i)t[i+n]=e[i];return i}function H(e){return e instanceof ArrayBuffer||null!=e&&null!=e.constructor&&"ArrayBuffer"===e.constructor.name&&"number"==typeof e.byteLength}function G(e){return"function"==typeof ArrayBuffer.isView&&ArrayBuffer.isView(e)}function J(e){return e!==e}var W=e("base64-js"),Y=e("ieee754");n.Buffer=i,n.SlowBuffer=d,n.INSPECT_MAX_BYTES=50;var K=2147483647;n.kMaxLength=K,i.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()}catch(e){return!1}}(),i.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),"undefined"!=typeof Symbol&&Symbol.species&&i[Symbol.species]===i&&Object.defineProperty(i,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),i.poolSize=8192,i.from=function(e,t,n){return o(e,t,n)},i.prototype.__proto__=Uint8Array.prototype,i.__proto__=Uint8Array,i.alloc=function(e,t,n){return a(e,t,n)},i.allocUnsafe=function(e){return u(e)},i.allocUnsafeSlow=function(e){return u(e)},i.isBuffer=function(e){return null!=e&&!0===e._isBuffer},i.compare=function(e,t){if(!i.isBuffer(e)||!i.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var n=e.length,r=t.length,o=0,s=Math.min(n,r);o<s;++o)if(e[o]!==t[o]){n=e[o],r=t[o];break}return n<r?-1:r<n?1:0},i.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},i.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return i.alloc(0);var n;if(void 0===t)for(t=0,n=0;n<e.length;++n)t+=e[n].length;var r=i.allocUnsafe(t),o=0;for(n=0;n<e.length;++n){var s=e[n];if(!i.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(r,o),o+=s.length}return r},i.byteLength=v,i.prototype._isBuffer=!0,i.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)g(this,t,t+1);return this},i.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)g(this,t,t+3),g(this,t+1,t+2);return this},i.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)g(this,t,t+7),g(this,t+1,t+6),g(this,t+2,t+5),g(this,t+3,t+4);return this},i.prototype.toString=function(){var e=this.length;return 0===e?"":0===arguments.length?A(this,0,e):m.apply(this,arguments)},i.prototype.equals=function(e){if(!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===i.compare(this,e)},i.prototype.inspect=function(){var e="",t=n.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,t).match(/.{2}/g).join(" "),this.length>t&&(e+=" ... ")),"<Buffer "+e+">"},i.prototype.compare=function(e,t,n,r,o){if(!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===n&&(n=e?e.length:0),void 0===r&&(r=0),void 0===o&&(o=this.length),t<0||n>e.length||r<0||o>this.length)throw new RangeError("out of range index");if(r>=o&&t>=n)return 0;if(r>=o)return-1;if(t>=n)return 1;if(t>>>=0,n>>>=0,r>>>=0,o>>>=0,this===e)return 0;for(var s=o-r,a=n-t,u=Math.min(s,a),l=this.slice(r,o),c=e.slice(t,n),f=0;f<u;++f)if(l[f]!==c[f]){s=l[f],a=c[f];break}return s<a?-1:a<s?1:0},i.prototype.includes=function(e,t,n){return-1!==this.indexOf(e,t,n)},i.prototype.indexOf=function(e,t,n){return y(this,e,t,n,!0)},i.prototype.lastIndexOf=function(e,t,n){return y(this,e,t,n,!1)},i.prototype.write=function(e,t,n,r){if(void 0===t)r="utf8",n=this.length,t=0;else if(void 0===n&&"string"==typeof t)r=t,n=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(n)?(n>>>=0,void 0===r&&(r="utf8")):(r=n,n=void 0)}var i=this.length-t;if((void 0===n||n>i)&&(n=i),e.length>0&&(n<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var o=!1;;)switch(r){case"hex":return b(this,e,t,n);case"utf8":case"utf-8":return x(this,e,t,n);case"ascii":return S(this,e,t,n);case"latin1":case"binary":return I(this,e,t,n);case"base64":return C(this,e,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return _(this,e,t,n);default:if(o)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),o=!0}},i.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var Q=4096;i.prototype.slice=function(e,t){var n=this.length;e=~~e,t=void 0===t?n:~~t,e<0?(e+=n)<0&&(e=0):e>n&&(e=n),t<0?(t+=n)<0&&(t=0):t>n&&(t=n),t<e&&(t=e);var r=this.subarray(e,t);return r.__proto__=i.prototype,r},i.prototype.readUIntLE=function(e,t,n){e>>>=0,t>>>=0,n||F(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return r},i.prototype.readUIntBE=function(e,t,n){e>>>=0,t>>>=0,n||F(e,t,this.length);for(var r=this[e+--t],i=1;t>0&&(i*=256);)r+=this[e+--t]*i;return r},i.prototype.readUInt8=function(e,t){return e>>>=0,t||F(e,1,this.length),this[e]},i.prototype.readUInt16LE=function(e,t){return e>>>=0,t||F(e,2,this.length),this[e]|this[e+1]<<8},i.prototype.readUInt16BE=function(e,t){return e>>>=0,t||F(e,2,this.length),this[e]<<8|this[e+1]},i.prototype.readUInt32LE=function(e,t){return e>>>=0,t||F(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},i.prototype.readUInt32BE=function(e,t){return e>>>=0,t||F(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},i.prototype.readIntLE=function(e,t,n){e>>>=0,t>>>=0,n||F(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return i*=128,r>=i&&(r-=Math.pow(2,8*t)),r},i.prototype.readIntBE=function(e,t,n){e>>>=0,t>>>=0,n||F(e,t,this.length);for(var r=t,i=1,o=this[e+--r];r>0&&(i*=256);)o+=this[e+--r]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*t)),o},i.prototype.readInt8=function(e,t){return e>>>=0,t||F(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},i.prototype.readInt16LE=function(e,t){e>>>=0,t||F(e,2,this.length);var n=this[e]|this[e+1]<<8;return 32768&n?4294901760|n:n},i.prototype.readInt16BE=function(e,t){e>>>=0,t||F(e,2,this.length);var n=this[e+1]|this[e]<<8;return 32768&n?4294901760|n:n},i.prototype.readInt32LE=function(e,t){return e>>>=0,t||F(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},i.prototype.readInt32BE=function(e,t){return e>>>=0,t||F(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},i.prototype.readFloatLE=function(e,t){return e>>>=0,t||F(e,4,this.length),Y.read(this,e,!0,23,4)},i.prototype.readFloatBE=function(e,t){return e>>>=0,t||F(e,4,this.length),Y.read(this,e,!1,23,4)},i.prototype.readDoubleLE=function(e,t){return e>>>=0,t||F(e,8,this.length),Y.read(this,e,!0,52,8)},i.prototype.readDoubleBE=function(e,t){return e>>>=0,t||F(e,8,this.length),Y.read(this,e,!1,52,8)},i.prototype.writeUIntLE=function(e,t,n,r){if(e=+e,t>>>=0,n>>>=0,!r){O(this,e,t,n,Math.pow(2,8*n)-1,0)}var i=1,o=0;for(this[t]=255&e;++o<n&&(i*=256);)this[t+o]=e/i&255;return t+n},i.prototype.writeUIntBE=function(e,t,n,r){if(e=+e,t>>>=0,n>>>=0,!r){O(this,e,t,n,Math.pow(2,8*n)-1,0)}var i=n-1,o=1;for(this[t+i]=255&e;--i>=0&&(o*=256);)this[t+i]=e/o&255;return t+n},i.prototype.writeUInt8=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,1,255,0),this[t]=255&e,t+1},i.prototype.writeUInt16LE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},i.prototype.writeUInt16BE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},i.prototype.writeUInt32LE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},i.prototype.writeUInt32BE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},i.prototype.writeIntLE=function(e,t,n,r){if(e=+e,t>>>=0,!r){var i=Math.pow(2,8*n-1);O(this,e,t,n,i-1,-i)}var o=0,s=1,a=0;for(this[t]=255&e;++o<n&&(s*=256);)e<0&&0===a&&0!==this[t+o-1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+n},i.prototype.writeIntBE=function(e,t,n,r){if(e=+e,t>>>=0,!r){var i=Math.pow(2,8*n-1);O(this,e,t,n,i-1,-i)}var o=n-1,s=1,a=0;for(this[t+o]=255&e;--o>=0&&(s*=256);)e<0&&0===a&&0!==this[t+o+1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+n},i.prototype.writeInt8=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},i.prototype.writeInt16LE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},i.prototype.writeInt16BE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},i.prototype.writeInt32LE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},i.prototype.writeInt32BE=function(e,t,n){return e=+e,t>>>=0,n||O(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},i.prototype.writeFloatLE=function(e,t,n){return $(this,e,t,!0,n)},i.prototype.writeFloatBE=function(e,t,n){return $(this,e,t,!1,n)},i.prototype.writeDoubleLE=function(e,t,n){return B(this,e,t,!0,n)},i.prototype.writeDoubleBE=function(e,t,n){return B(this,e,t,!1,n)},i.prototype.copy=function(e,t,n,r){if(n||(n=0),r||0===r||(r=this.length),t>=e.length&&(t=e.length),t||(t=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-t<r-n&&(r=e.length-t+n);var i,o=r-n;if(this===e&&n<t&&t<r)for(i=o-1;i>=0;--i)e[i+t]=this[i+n];else if(o<1e3)for(i=0;i<o;++i)e[i+t]=this[i+n];else Uint8Array.prototype.set.call(e,this.subarray(n,n+o),t);return o},i.prototype.fill=function(e,t,n,r){if("string"==typeof e){if("string"==typeof t?(r=t,t=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===e.length){var o=e.charCodeAt(0);o<256&&(e=o)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!i.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<n)throw new RangeError("Out of range index");if(n<=t)return this;t>>>=0,n=void 0===n?this.length:n>>>0,e||(e=0);var s;if("number"==typeof e)for(s=t;s<n;++s)this[s]=e;else{var a=i.isBuffer(e)?e:new i(e,r),u=a.length;for(s=0;s<n-t;++s)this[s+t]=a[s%u]}return this};var Z=/[^+\/0-9A-Za-z-_]/g},{"base64-js":100,ieee754:103}],102:[function(e,t,n){(function(e){var n=function(){function t(e,t){return null!=t&&e instanceof t}function n(r,i,o,s,f){function h(r,o){if(null===r)return null;if(0===o)return r;var m,g;if("object"!=(void 0===r?"undefined":_typeof(r)))return r;if(t(r,u))m=new u;else if(t(r,l))m=new l;else if(t(r,c))m=new c(function(e,t){r.then(function(t){e(h(t,o-1))},function(e){t(h(e,o-1))})});else if(n.__isArray(r))m=[];else if(n.__isRegExp(r))m=new RegExp(r.source,a(r)),r.lastIndex&&(m.lastIndex=r.lastIndex);else if(n.__isDate(r))m=new Date(r.getTime());else{if(v&&e.isBuffer(r))return m=e.allocUnsafe?e.allocUnsafe(r.length):new e(r.length),r.copy(m),m;t(r,Error)?m=Object.create(r):void 0===s?(g=Object.getPrototypeOf(r),m=Object.create(g)):(m=Object.create(s),g=s)}if(i){var y=p.indexOf(r);if(-1!=y)return d[y];p.push(r),d.push(m)}t(r,u)&&r.forEach(function(e,t){var n=h(t,o-1),r=h(e,o-1);m.set(n,r)}),t(r,l)&&r.forEach(function(e){var t=h(e,o-1);m.add(t)});for(var w in r){var b;g&&(b=Object.getOwnPropertyDescriptor(g,w)),b&&null==b.set||(m[w]=h(r[w],o-1))}if(Object.getOwnPropertySymbols)for(var x=Object.getOwnPropertySymbols(r),w=0;w<x.length;w++){var S=x[w],I=Object.getOwnPropertyDescriptor(r,S);(!I||I.enumerable||f)&&(m[S]=h(r[S],o-1),I.enumerable||Object.defineProperty(m,S,{enumerable:!1}))}if(f)for(var C=Object.getOwnPropertyNames(r),w=0;w<C.length;w++){var _=C[w],I=Object.getOwnPropertyDescriptor(r,_);I&&I.enumerable||(m[_]=h(r[_],o-1),Object.defineProperty(m,_,{enumerable:!1}))}return m}"object"===(void 0===i?"undefined":_typeof(i))&&(o=i.depth,s=i.prototype,f=i.includeNonEnumerable,i=i.circular);var p=[],d=[],v=void 0!==e;return void 0===i&&(i=!0),void 0===o&&(o=1/0),h(r,o)}function r(e){return Object.prototype.toString.call(e)}function i(e){return"object"===(void 0===e?"undefined":_typeof(e))&&"[object Date]"===r(e)}function o(e){return"object"===(void 0===e?"undefined":_typeof(e))&&"[object Array]"===r(e)}function s(e){return"object"===(void 0===e?"undefined":_typeof(e))&&"[object RegExp]"===r(e)}function a(e){var t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),t}var u;try{u=Map}catch(e){u=function(){}}var l;try{l=Set}catch(e){l=function(){}}var c;try{c=Promise}catch(e){c=function(){}}return n.clonePrototype=function(e){if(null===e)return null;var t=function(){};return t.prototype=e,new t},n.__objToStr=r,n.__isDate=i,n.__isArray=o,n.__isRegExp=s,n.__getRegExpFlags=a,n}();"object"===(void 0===t?"undefined":_typeof(t))&&t.exports&&(t.exports=n)}).call(this,e("buffer").Buffer)},{buffer:101}],103:[function(e,t,n){n.read=function(e,t,n,r,i){var o,s,a=8*i-r-1,u=(1<<a)-1,l=u>>1,c=-7,f=n?i-1:0,h=n?-1:1,p=e[t+f];for(f+=h,o=p&(1<<-c)-1,p>>=-c,c+=a;c>0;o=256*o+e[t+f],f+=h,c-=8);for(s=o&(1<<-c)-1,o>>=-c,c+=r;c>0;s=256*s+e[t+f],f+=h,c-=8);if(0===o)o=1-l;else{if(o===u)return s?NaN:1/0*(p?-1:1);s+=Math.pow(2,r),o-=l}return(p?-1:1)*s*Math.pow(2,o-r)},n.write=function(e,t,n,r,i,o){var s,a,u,l=8*o-i-1,c=(1<<l)-1,f=c>>1,h=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=r?0:o-1,d=r?1:-1,v=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(a=isNaN(t)?1:0,s=c):(s=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-s))<1&&(s--,u*=2),t+=s+f>=1?h/u:h*Math.pow(2,1-f),t*u>=2&&(s++,u/=2),s+f>=c?(a=0,s=c):s+f>=1?(a=(t*u-1)*Math.pow(2,i),s+=f):(a=t*Math.pow(2,f-1)*Math.pow(2,i),s=0));i>=8;e[n+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,l+=i;l>0;e[n+p]=255&s,p+=d,s/=256,l-=8);e[n+p-d]|=128*v}},{}],104:[function(e,t,n){function r(){}function i(e){try{return e.then}catch(e){return g=e,y}}function o(e,t){try{return e(t)}catch(e){return g=e,y}}function s(e,t,n){try{e(t,n)}catch(e){return g=e,y}}function a(e){if("object"!==_typeof(this))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("Promise constructor's argument is not a function");this._40=0,this._65=0,this._55=null,this._72=null,e!==r&&v(e,this)}function u(e,t,n){return new e.constructor(function(i,o){var s=new a(r);s.then(i,o),l(e,new d(t,n,s))})}function l(e,t){for(;3===e._65;)e=e._55;if(a._37&&a._37(e),0===e._65)return 0===e._40?(e._40=1,void(e._72=t)):1===e._40?(e._40=2,void(e._72=[e._72,t])):void e._72.push(t);c(e,t)}function c(e,t){m(function(){var n=1===e._65?t.onFulfilled:t.onRejected;if(null===n)return void(1===e._65?f(t.promise,e._55):h(t.promise,e._55));var r=o(n,e._55);r===y?h(t.promise,g):f(t.promise,r)})}function f(e,t){if(t===e)return h(e,new TypeError("A promise cannot be resolved with itself."));if(t&&("object"===(void 0===t?"undefined":_typeof(t))||"function"==typeof t)){var n=i(t);if(n===y)return h(e,g);if(n===e.then&&t instanceof a)return e._65=3,e._55=t,void p(e);if("function"==typeof n)return void v(n.bind(t),e)}e._65=1,e._55=t,p(e)}function h(e,t){e._65=2,e._55=t,a._87&&a._87(e,t),p(e)}function p(e){if(1===e._40&&(l(e,e._72),e._72=null),2===e._40){for(var t=0;t<e._72.length;t++)l(e,e._72[t]);e._72=null}}function d(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function v(e,t){var n=!1,r=s(e,function(e){n||(n=!0,f(t,e))},function(e){n||(n=!0,h(t,e))});n||r!==y||(n=!0,h(t,g))}var m=e("asap/raw"),g=null,y={};t.exports=a,a._37=null,a._87=null,a._61=r,a.prototype.then=function(e,t){if(this.constructor!==a)return u(this,e,t);var n=new a(r);return l(this,new d(e,t,n)),n}},{"asap/raw":99}],105:[function(e,t,n){function r(e){var t=new i(i._61);return t._65=1,t._55=e,t}var i=e("./core.js");t.exports=i;var o=r(!0),s=r(!1),a=r(null),u=r(void 0),l=r(0),c=r("");i.resolve=function(e){if(e instanceof i)return e;if(null===e)return a;if(void 0===e)return u;if(!0===e)return o;if(!1===e)return s;if(0===e)return l;if(""===e)return c;if("object"===(void 0===e?"undefined":_typeof(e))||"function"==typeof e)try{var t=e.then;if("function"==typeof t)return new i(t.bind(e))}catch(e){return new i(function(t,n){n(e)})}return r(e)},i.all=function(e){var t=Array.prototype.slice.call(e);return new i(function(e,n){function r(s,a){if(a&&("object"===(void 0===a?"undefined":_typeof(a))||"function"==typeof a)){if(a instanceof i&&a.then===i.prototype.then){for(;3===a._65;)a=a._55;return 1===a._65?r(s,a._55):(2===a._65&&n(a._55),void a.then(function(e){r(s,e)},n))}var u=a.then;if("function"==typeof u){return void new i(u.bind(a)).then(function(e){r(s,e)},n)}}t[s]=a,0==--o&&e(t)}if(0===t.length)return e([]);for(var o=t.length,s=0;s<t.length;s++)r(s,t[s])})},i.reject=function(e){return new i(function(t,n){n(e)})},i.race=function(e){return new i(function(t,n){e.forEach(function(e){i.resolve(e).then(t,n)})})},i.prototype.catch=function(e){return this.then(null,e)}},{"./core.js":104}],106:[function(e,t,n){"function"!=typeof Promise.prototype.done&&(Promise.prototype.done=function(e,t){(arguments.length?this.then.apply(this,arguments):this).then(null,function(e){setTimeout(function(){throw e},0)})})},{}],107:[function(e,t,n){e("asap");"undefined"==typeof Promise&&(Promise=e("./lib/core.js"),e("./lib/es6-extensions.js")),e("./polyfill-done.js")},{"./lib/core.js":104,"./lib/es6-extensions.js":105,"./polyfill-done.js":106,asap:98}]},{},[2])(2)});