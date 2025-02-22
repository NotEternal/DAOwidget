(this["webpackJsonpdaofactory"] = this["webpackJsonpdaofactory"] || []).push([[1],{

/***/ 584:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(__webpack_require__(626), exports);

__exportStar(__webpack_require__(627), exports);

/***/ }),

/***/ 585:
/***/ (function(module, exports) {

var toSJISFunction;
var CODEWORDS_COUNT = [0, // Not used
26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
/**
 * Returns the QR Code size for the specified version
 *
 * @param  {Number} version QR Code version
 * @return {Number}         size of QR code
 */

exports.getSymbolSize = function getSymbolSize(version) {
  if (!version) throw new Error('"version" cannot be null or undefined');
  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
  return version * 4 + 17;
};
/**
 * Returns the total number of codewords used to store data and EC information.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Data length in bits
 */


exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
  return CODEWORDS_COUNT[version];
};
/**
 * Encode data with Bose-Chaudhuri-Hocquenghem
 *
 * @param  {Number} data Value to encode
 * @return {Number}      Encoded value
 */


exports.getBCHDigit = function (data) {
  var digit = 0;

  while (data !== 0) {
    digit++;
    data >>>= 1;
  }

  return digit;
};

exports.setToSJISFunction = function setToSJISFunction(f) {
  if (typeof f !== 'function') {
    throw new Error('"toSJISFunc" is not a valid function.');
  }

  toSJISFunction = f;
};

exports.isKanjiModeEnabled = function () {
  return typeof toSJISFunction !== 'undefined';
};

exports.toSJIS = function toSJIS(kanji) {
  return toSJISFunction(kanji);
};

/***/ }),

/***/ 586:
/***/ (function(module, exports, __webpack_require__) {

var VersionCheck = __webpack_require__(622);

var Regex = __webpack_require__(623);
/**
 * Numeric mode encodes data from the decimal digit set (0 - 9)
 * (byte values 30HEX to 39HEX).
 * Normally, 3 data characters are represented by 10 bits.
 *
 * @type {Object}
 */


exports.NUMERIC = {
  id: 'Numeric',
  bit: 1 << 0,
  ccBits: [10, 12, 14]
};
/**
 * Alphanumeric mode encodes data from a set of 45 characters,
 * i.e. 10 numeric digits (0 - 9),
 *      26 alphabetic characters (A - Z),
 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
 * Normally, two input characters are represented by 11 bits.
 *
 * @type {Object}
 */

exports.ALPHANUMERIC = {
  id: 'Alphanumeric',
  bit: 1 << 1,
  ccBits: [9, 11, 13]
};
/**
 * In byte mode, data is encoded at 8 bits per character.
 *
 * @type {Object}
 */

exports.BYTE = {
  id: 'Byte',
  bit: 1 << 2,
  ccBits: [8, 16, 16]
};
/**
 * The Kanji mode efficiently encodes Kanji characters in accordance with
 * the Shift JIS system based on JIS X 0208.
 * The Shift JIS values are shifted from the JIS X 0208 values.
 * JIS X 0208 gives details of the shift coded representation.
 * Each two-byte character value is compacted to a 13-bit binary codeword.
 *
 * @type {Object}
 */

exports.KANJI = {
  id: 'Kanji',
  bit: 1 << 3,
  ccBits: [8, 10, 12]
};
/**
 * Mixed mode will contain a sequences of data in a combination of any of
 * the modes described above
 *
 * @type {Object}
 */

exports.MIXED = {
  bit: -1
};
/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 *
 * @param  {Mode}   mode    Data mode
 * @param  {Number} version QR Code version
 * @return {Number}         Number of bits
 */

exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode);

  if (!VersionCheck.isValid(version)) {
    throw new Error('Invalid version: ' + version);
  }

  if (version >= 1 && version < 10) return mode.ccBits[0];else if (version < 27) return mode.ccBits[1];
  return mode.ccBits[2];
};
/**
 * Returns the most efficient mode to store the specified data
 *
 * @param  {String} dataStr Input data string
 * @return {Mode}           Best mode
 */


exports.getBestModeForData = function getBestModeForData(dataStr) {
  if (Regex.testNumeric(dataStr)) return exports.NUMERIC;else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;else if (Regex.testKanji(dataStr)) return exports.KANJI;else return exports.BYTE;
};
/**
 * Return mode name as string
 *
 * @param {Mode} mode Mode object
 * @returns {String}  Mode name
 */


exports.toString = function toString(mode) {
  if (mode && mode.id) return mode.id;
  throw new Error('Invalid mode');
};
/**
 * Check if input param is a valid mode object
 *
 * @param   {Mode}    mode Mode object
 * @returns {Boolean} True if valid mode, false otherwise
 */


exports.isValid = function isValid(mode) {
  return mode && mode.bit && mode.ccBits;
};
/**
 * Get mode object from its name
 *
 * @param   {String} string Mode name
 * @returns {Mode}          Mode object
 */


function fromString(string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string');
  }

  var lcStr = string.toLowerCase();

  switch (lcStr) {
    case 'numeric':
      return exports.NUMERIC;

    case 'alphanumeric':
      return exports.ALPHANUMERIC;

    case 'kanji':
      return exports.KANJI;

    case 'byte':
      return exports.BYTE;

    default:
      throw new Error('Unknown mode: ' + string);
  }
}
/**
 * Returns mode from a value.
 * If value is not a valid mode, returns defaultValue
 *
 * @param  {Mode|String} value        Encoding mode
 * @param  {Mode}        defaultValue Fallback value
 * @return {Mode}                     Encoding mode
 */


exports.from = function from(value, defaultValue) {
  if (exports.isValid(value)) {
    return value;
  }

  try {
    return fromString(value);
  } catch (e) {
    return defaultValue;
  }
};

/***/ }),

/***/ 587:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Implementation of a subset of node.js Buffer methods for the browser.
 * Based on https://github.com/feross/buffer
 */

/* eslint-disable no-proto */


var isArray = __webpack_require__(597);

function typedArraySupport() {
  // Can typed array instances be augmented?
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = {
      __proto__: Uint8Array.prototype,
      foo: function foo() {
        return 42;
      }
    };
    return arr.foo() === 42;
  } catch (e) {
    return false;
  }
}

Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
var K_MAX_LENGTH = Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;

function Buffer(arg, offset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, offset, length);
  }

  if (typeof arg === 'number') {
    return allocUnsafe(this, arg);
  }

  return from(this, arg, offset, length);
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array; // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97

  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true,
      enumerable: false,
      writable: false
    });
  }
}

function checked(length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
  }

  return length | 0;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}

function createBuffer(that, length) {
  var buf;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    buf = new Uint8Array(length);
    buf.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    buf = that;

    if (buf === null) {
      buf = new Buffer(length);
    }

    buf.length = length;
  }

  return buf;
}

function allocUnsafe(that, size) {
  var buf = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      buf[i] = 0;
    }
  }

  return buf;
}

function fromString(that, string) {
  var length = byteLength(string) | 0;
  var buf = createBuffer(that, length);
  var actual = buf.write(string);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
  }

  return buf;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  var buf = createBuffer(that, length);

  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }

  return buf;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  var buf;

  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array);
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    buf.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    buf = fromArrayLike(that, buf);
  }

  return buf;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    var buf = createBuffer(that, len);

    if (buf.length === 0) {
      return buf;
    }

    obj.copy(buf, 0, 0, len);
    return buf;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }

      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i); // is surrogate component

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } // valid lead


        leadSurrogate = codePoint;
        continue;
      } // 2 leads in a row


      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      } // valid surrogate pair


      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null; // encode utf8

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function byteLength(string) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }

  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }

  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;
  return utf8ToBytes(string).length;
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }

  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function from(that, value, offset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, offset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, offset);
  }

  return fromObject(that, value);
}

Buffer.prototype.write = function write(string, offset, length) {
  // Buffer#write(string)
  if (offset === undefined) {
    length = this.length;
    offset = 0; // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    length = this.length;
    offset = 0; // Buffer#write(string, offset[, length])
  } else if (isFinite(offset)) {
    offset = offset | 0;

    if (isFinite(length)) {
      length = length | 0;
    } else {
      length = undefined;
    }
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  return utf8Write(this, string, offset, length);
};

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;
  var newBuf;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end); // Return an augmented `Uint8Array` instance

    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);

    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }

  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

Buffer.prototype.fill = function fill(val, start, end) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      end = this.length;
    }

    if (val.length === 1) {
      var code = val.charCodeAt(0);

      if (code < 256) {
        val = code;
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } // Invalid ranges are not set to a default, so can range check early.


  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;

  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : new Buffer(val);
    var len = bytes.length;

    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return createBuffer(null, 0);
  }

  var i;

  if (length === undefined) {
    length = 0;

    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = allocUnsafe(null, length);
  var pos = 0;

  for (i = 0; i < list.length; ++i) {
    var buf = list[i];

    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    buf.copy(buffer, pos);
    pos += buf.length;
  }

  return buffer;
};

Buffer.byteLength = byteLength;
Buffer.prototype._isBuffer = true;

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

module.exports.alloc = function (size) {
  var buffer = new Buffer(size);
  buffer.fill(0);
  return buffer;
};

module.exports.from = function (data) {
  return new Buffer(data);
};

/***/ }),

/***/ 588:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "g", function() { return /* reexport */ esm["detectEnv"]; });
__webpack_require__.d(__webpack_exports__, "s", function() { return /* reexport */ esm["isMobile"]; });
__webpack_require__.d(__webpack_exports__, "n", function() { return /* reexport */ esm["isBrowser"]; });
__webpack_require__.d(__webpack_exports__, "k", function() { return /* reexport */ esm["getLocation"]; });
__webpack_require__.d(__webpack_exports__, "i", function() { return /* reexport */ esm["getClientMeta"]; });
__webpack_require__.d(__webpack_exports__, "C", function() { return /* reexport */ esm["setLocal"]; });
__webpack_require__.d(__webpack_exports__, "j", function() { return /* reexport */ esm["getLocal"]; });
__webpack_require__.d(__webpack_exports__, "B", function() { return /* reexport */ esm["removeLocal"]; });
__webpack_require__.d(__webpack_exports__, "w", function() { return /* reexport */ esm["mobileLinkChoiceKey"]; });
__webpack_require__.d(__webpack_exports__, "D", function() { return /* reexport */ signingMethods; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* reexport */ convertArrayBufferToBuffer; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* reexport */ convertArrayBufferToHex; });
__webpack_require__.d(__webpack_exports__, "d", function() { return /* reexport */ convertBufferToArrayBuffer; });
__webpack_require__.d(__webpack_exports__, "e", function() { return /* reexport */ convertHexToArrayBuffer; });
__webpack_require__.d(__webpack_exports__, "f", function() { return /* reexport */ convertNumberToHex; });
__webpack_require__.d(__webpack_exports__, "x", function() { return /* reexport */ parsePersonalSign; });
__webpack_require__.d(__webpack_exports__, "y", function() { return /* reexport */ parseTransactionData; });
__webpack_require__.d(__webpack_exports__, "A", function() { return /* reexport */ payloadId; });
__webpack_require__.d(__webpack_exports__, "E", function() { return /* reexport */ uuid; });
__webpack_require__.d(__webpack_exports__, "m", function() { return /* reexport */ getRpcUrl; });
__webpack_require__.d(__webpack_exports__, "h", function() { return /* reexport */ formatRpcError; });
__webpack_require__.d(__webpack_exports__, "v", function() { return /* reexport */ isWalletConnectSession; });
__webpack_require__.d(__webpack_exports__, "z", function() { return /* reexport */ parseWalletConnectUri; });
__webpack_require__.d(__webpack_exports__, "l", function() { return /* reexport */ getQueryString; });
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ appendToQueryString; });
__webpack_require__.d(__webpack_exports__, "p", function() { return /* reexport */ isJsonRpcRequest; });
__webpack_require__.d(__webpack_exports__, "r", function() { return /* reexport */ isJsonRpcResponseSuccess; });
__webpack_require__.d(__webpack_exports__, "q", function() { return /* reexport */ isJsonRpcResponseError; });
__webpack_require__.d(__webpack_exports__, "o", function() { return /* reexport */ isInternalEvent; });
__webpack_require__.d(__webpack_exports__, "t", function() { return /* reexport */ isReservedEvent; });
__webpack_require__.d(__webpack_exports__, "u", function() { return /* reexport */ isSilentPayload; });

// UNUSED EXPORTS: detectOS, isAndroid, isIOS, isNode, getFromWindow, getFromWindowOrThrow, getDocumentOrThrow, getDocument, getNavigatorOrThrow, getNavigator, getLocationOrThrow, getCryptoOrThrow, getCrypto, getLocalStorageOrThrow, getLocalStorage, safeJsonParse, safeJsonStringify, formatIOSMobile, saveMobileLinkInfo, getMobileRegistryEntry, getMobileLinkRegistry, getWalletRegistryUrl, getDappRegistryUrl, formatMobileRegistryEntry, formatMobileRegistry, reservedEvents, stateMethods, infuraNetworks, convertArrayBufferToUtf8, convertArrayBufferToNumber, concatArrayBuffers, convertBufferToUtf8, convertBufferToHex, convertBufferToNumber, concatBuffers, convertUtf8ToArrayBuffer, convertUtf8ToBuffer, convertUtf8ToHex, convertUtf8ToNumber, convertHexToBuffer, convertHexToUtf8, convertHexToNumber, convertNumberToBuffer, convertNumberToArrayBuffer, convertNumberToUtf8, toChecksumAddress, isValidAddress, sanitizeHex, addHexPrefix, removeHexPrefix, removeHexLeadingZeros, logDeprecationWarning, getInfuraRpcUrl, promisify, parseQueryString, formatQueryString, isEmptyString, isEmptyArray, isBuffer, isTypedArray, isArrayBuffer, getType, getEncoding, isHexString, isJsonRpcSubscription

// EXTERNAL MODULE: ./node_modules/@walletconnect/browser-utils/dist/esm/index.js + 5 modules
var esm = __webpack_require__(599);

// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/constants.js
var reservedEvents = ["session_request", "session_update", "exchange_key", "connect", "disconnect", "display_uri", "modal_closed", "transport_open", "transport_close", "transport_error"];
var signingMethods = ["eth_sendTransaction", "eth_signTransaction", "eth_sign", "eth_signTypedData", "eth_signTypedData_v1", "eth_signTypedData_v2", "eth_signTypedData_v3", "eth_signTypedData_v4", "personal_sign", "wallet_addEthereumChain", "wallet_switchEthereumChain", "wallet_getPermissions", "wallet_requestPermissions", "wallet_registerOnboarding", "wallet_watchAsset", "wallet_scanQRCode"];
var stateMethods = ["eth_accounts", "eth_chainId", "net_version"];
var infuraNetworks = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan"
};
// EXTERNAL MODULE: ./node_modules/@walletconnect/utils/node_modules/bn.js/lib/bn.js
var bn = __webpack_require__(630);
var bn_default = /*#__PURE__*/__webpack_require__.n(bn);

// EXTERNAL MODULE: ./node_modules/@walletconnect/encoding/dist/esm/index.js
var dist_esm = __webpack_require__(589);

// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/encoding.js


function convertArrayBufferToBuffer(arrBuf) {
  return dist_esm["arrayToBuffer"](new Uint8Array(arrBuf));
}
function convertArrayBufferToUtf8(arrBuf) {
  return dist_esm["arrayToUtf8"](new Uint8Array(arrBuf));
}
function convertArrayBufferToHex(arrBuf, noPrefix) {
  return dist_esm["arrayToHex"](new Uint8Array(arrBuf), !noPrefix);
}
function convertArrayBufferToNumber(arrBuf) {
  return dist_esm["arrayToNumber"](new Uint8Array(arrBuf));
}
function concatArrayBuffers() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return dist_esm["hexToArray"](args.map(function (b) {
    return dist_esm["arrayToHex"](new Uint8Array(b));
  }).join("")).buffer;
}
function convertBufferToArrayBuffer(buf) {
  return dist_esm["bufferToArray"](buf).buffer;
}
function convertBufferToUtf8(buf) {
  return dist_esm["bufferToUtf8"](buf);
}
function convertBufferToHex(buf, noPrefix) {
  return dist_esm["bufferToHex"](buf, !noPrefix);
}
function convertBufferToNumber(buf) {
  return dist_esm["bufferToNumber"](buf);
}
function concatBuffers() {
  return dist_esm["concatBuffers"].apply(dist_esm, arguments);
}
function convertUtf8ToArrayBuffer(utf8) {
  return dist_esm["utf8ToArray"](utf8).buffer;
}
function convertUtf8ToBuffer(utf8) {
  return dist_esm["utf8ToBuffer"](utf8);
}
function convertUtf8ToHex(utf8, noPrefix) {
  return dist_esm["utf8ToHex"](utf8, !noPrefix);
}
function convertUtf8ToNumber(utf8) {
  return new bn_default.a(utf8, 10).toNumber();
}
function convertHexToBuffer(hex) {
  return dist_esm["hexToBuffer"](hex);
}
function convertHexToArrayBuffer(hex) {
  return dist_esm["hexToArray"](hex).buffer;
}
function convertHexToUtf8(hex) {
  return dist_esm["hexToUtf8"](hex);
}
function convertHexToNumber(hex) {
  return new bn_default.a(dist_esm["removeHexPrefix"](hex), "hex").toNumber();
}
function convertNumberToBuffer(num) {
  return dist_esm["numberToBuffer"](num);
}
function convertNumberToArrayBuffer(num) {
  return dist_esm["numberToArray"](num).buffer;
}
function convertNumberToUtf8(num) {
  return new bn_default.a(num).toString();
}
function convertNumberToHex(num, noPrefix) {
  var hex = dist_esm["removeHexPrefix"](dist_esm["sanitizeHex"](new bn_default.a(num).toString(16)));
  return noPrefix ? hex : dist_esm["addHexPrefix"](hex);
}
// EXTERNAL MODULE: ./node_modules/js-sha3/src/sha3.js
var sha3 = __webpack_require__(99);

// EXTERNAL MODULE: ./node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
var jsonrpc_utils_dist_esm = __webpack_require__(590);

// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/misc.js



function sanitizeHex(hex) {
  return dist_esm["sanitizeHex"](hex);
}
function addHexPrefix(hex) {
  return dist_esm["addHexPrefix"](hex);
}
function removeHexPrefix(hex) {
  return dist_esm["removeHexPrefix"](hex);
}
function removeHexLeadingZeros(hex) {
  return dist_esm["removeHexLeadingZeros"](dist_esm["addHexPrefix"](hex));
}
var payloadId = jsonrpc_utils_dist_esm["payloadId"];
function uuid() {
  var result = function (a, b) {
    for (b = a = ""; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : "-") {}

    return b;
  }();

  return result;
}
function logDeprecationWarning() {
  console.warn("DEPRECATION WARNING: This WalletConnect client library will be deprecated in favor of @walletconnect/client. Please check docs.walletconnect.org to learn more about this migration!");
}
function getInfuraRpcUrl(chainId, infuraId) {
  var rpcUrl;
  var network = infuraNetworks[chainId];

  if (network) {
    rpcUrl = "https://".concat(network, ".infura.io/v3/").concat(infuraId);
  }

  return rpcUrl;
}
function getRpcUrl(chainId, rpc) {
  var rpcUrl;
  var infuraUrl = getInfuraRpcUrl(chainId, rpc.infuraId);

  if (rpc.custom && rpc.custom[chainId]) {
    rpcUrl = rpc.custom[chainId];
  } else if (infuraUrl) {
    rpcUrl = infuraUrl;
  }

  return rpcUrl;
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/validators.js


function isEmptyString(value) {
  return value === "" || typeof value === "string" && value.trim() === "";
}
function isEmptyArray(array) {
  return !(array && array.length);
}
function isBuffer(val) {
  return dist_esm["isBuffer"](val);
}
function isTypedArray(val) {
  return dist_esm["isTypedArray"](val);
}
function isArrayBuffer(val) {
  return dist_esm["isArrayBuffer"](val);
}
function getType(val) {
  return dist_esm["getType"](val);
}
function getEncoding(val) {
  return dist_esm["getEncoding"](val);
}
function isHexString(value, length) {
  return dist_esm["isHexString"](value, length);
}
function isJsonRpcSubscription(object) {
  return typeof object.params === "object";
}
function isJsonRpcRequest(object) {
  return typeof object.method !== "undefined";
}
function isJsonRpcResponseSuccess(object) {
  return typeof object.result !== "undefined";
}
function isJsonRpcResponseError(object) {
  return typeof object.error !== "undefined";
}
function isInternalEvent(object) {
  return typeof object.event !== "undefined";
}
function isReservedEvent(event) {
  return reservedEvents.includes(event) || event.startsWith("wc_");
}
function isSilentPayload(request) {
  if (request.method.startsWith("wc_")) {
    return true;
  }

  if (signingMethods.includes(request.method)) {
    return false;
  }

  return true;
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/ethereum.js





function toChecksumAddress(address) {
  address = Object(dist_esm["removeHexPrefix"])(address.toLowerCase());
  var hash = Object(dist_esm["removeHexPrefix"])(Object(sha3["keccak_256"])(convertUtf8ToBuffer(address)));
  var checksum = "";

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) > 7) {
      checksum += address[i].toUpperCase();
    } else {
      checksum += address[i];
    }
  }

  return Object(dist_esm["addHexPrefix"])(checksum);
}
var isValidAddress = function isValidAddress(address) {
  if (!address) {
    return false;
  } else if (address.toLowerCase().substring(0, 2) !== "0x") {
    return false;
  } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    return true;
  } else {
    return address === toChecksumAddress(address);
  }
};
function parsePersonalSign(params) {
  if (!isEmptyArray(params) && !isHexString(params[0])) {
    params[0] = convertUtf8ToHex(params[0]);
  }

  return params;
}
function parseTransactionData(txData) {
  if (typeof txData.type !== "undefined" && txData.type !== "0") return txData;

  if (typeof txData.from === "undefined" || !isValidAddress(txData.from)) {
    throw new Error("Transaction object must include a valid 'from' value.");
  }

  function parseHexValues(value) {
    var result = value;

    if (typeof value === "number" || typeof value === "string" && !isEmptyString(value)) {
      if (!isHexString(value)) {
        result = convertNumberToHex(value);
      } else if (typeof value === "string") {
        result = sanitizeHex(value);
      }
    }

    if (typeof result === "string") {
      result = removeHexLeadingZeros(result);
    }

    return result;
  }

  var txDataRPC = {
    from: sanitizeHex(txData.from),
    to: typeof txData.to === "undefined" ? undefined : sanitizeHex(txData.to),
    gasPrice: typeof txData.gasPrice === "undefined" ? "" : parseHexValues(txData.gasPrice),
    gas: typeof txData.gas === "undefined" ? typeof txData.gasLimit === "undefined" ? "" : parseHexValues(txData.gasLimit) : parseHexValues(txData.gas),
    value: typeof txData.value === "undefined" ? "" : parseHexValues(txData.value),
    nonce: typeof txData.nonce === "undefined" ? "" : parseHexValues(txData.nonce),
    data: typeof txData.data === "undefined" ? "" : sanitizeHex(txData.data) || "0x"
  };
  var prunable = ["gasPrice", "gas", "value", "nonce"];
  Object.keys(txDataRPC).forEach(function (key) {
    if ((typeof txDataRPC[key] === "undefined" || typeof txDataRPC[key] === "string" && !txDataRPC[key].trim().length) && prunable.includes(key)) {
      delete txDataRPC[key];
    }
  });
  return txDataRPC;
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js
var regeneratorRuntime = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(14);

// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/payload.js


function promisify(originalFn, thisArg) {
  var promisifiedFunction = /*#__PURE__*/function () {
    var _ref = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee() {
      var _len,
          callArgs,
          _key,
          _args = arguments;

      return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              for (_len = _args.length, callArgs = new Array(_len), _key = 0; _key < _len; _key++) {
                callArgs[_key] = _args[_key];
              }

              return _context.abrupt("return", new Promise(function (resolve, reject) {
                var callback = function callback(err, data) {
                  if (err === null || typeof err === "undefined") {
                    reject(err);
                  }

                  resolve(data);
                };

                originalFn.apply(thisArg, [].concat(callArgs, [callback]));
              }));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function promisifiedFunction() {
      return _ref.apply(this, arguments);
    };
  }();

  return promisifiedFunction;
}
function formatRpcError(error) {
  var message = error.message || "Failed or Rejected Request";
  var code = -32000;

  if (error && !error.code) {
    switch (message) {
      case "Parse error":
        code = -32700;
        break;

      case "Invalid request":
        code = -32600;
        break;

      case "Method not found":
        code = -32601;
        break;

      case "Invalid params":
        code = -32602;
        break;

      case "Internal error":
        code = -32603;
        break;

      default:
        code = -32000;
        break;
    }
  }

  var result = {
    code: code,
    message: message
  };
  return result;
}
// EXTERNAL MODULE: ./node_modules/query-string/index.js
var query_string = __webpack_require__(633);

// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/url.js

function getQueryString(url) {
  var pathEnd = url.indexOf("?") !== -1 ? url.indexOf("?") : undefined;
  var queryString = typeof pathEnd !== "undefined" ? url.substr(pathEnd) : "";
  return queryString;
}
function appendToQueryString(queryString, newQueryParams) {
  var queryParams = parseQueryString(queryString);
  queryParams = Object.assign(Object.assign({}, queryParams), newQueryParams);
  queryString = formatQueryString(queryParams);
  return queryString;
}
function parseQueryString(queryString) {
  return query_string["parse"](queryString);
}
function formatQueryString(queryParams) {
  return query_string["stringify"](queryParams);
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/session.js

function isWalletConnectSession(object) {
  return typeof object.bridge !== "undefined";
}
function parseWalletConnectUri(str) {
  var pathStart = str.indexOf(":");
  var pathEnd = str.indexOf("?") !== -1 ? str.indexOf("?") : undefined;
  var protocol = str.substring(0, pathStart);
  var path = str.substring(pathStart + 1, pathEnd);

  function parseRequiredParams(path) {
    var separator = "@";
    var values = path.split(separator);
    var requiredParams = {
      handshakeTopic: values[0],
      version: parseInt(values[1], 10)
    };
    return requiredParams;
  }

  var requiredParams = parseRequiredParams(path);
  var queryString = typeof pathEnd !== "undefined" ? str.substr(pathEnd) : "";

  function parseQueryParams(queryString) {
    var result = parseQueryString(queryString);
    var parameters = {
      key: result.key || "",
      bridge: result.bridge || ""
    };
    return parameters;
  }

  var queryParams = parseQueryParams(queryString);
  var result = Object.assign(Object.assign({
    protocol: protocol
  }, requiredParams), queryParams);
  return result;
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/utils/dist/esm/index.js










/***/ }),

/***/ 589:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferToArray", function() { return bufferToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferToHex", function() { return bufferToHex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferToUtf8", function() { return bufferToUtf8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferToNumber", function() { return bufferToNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferToBinary", function() { return bufferToBinary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayToBuffer", function() { return arrayToBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayToHex", function() { return arrayToHex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayToUtf8", function() { return arrayToUtf8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayToNumber", function() { return arrayToNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayToBinary", function() { return arrayToBinary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToBuffer", function() { return hexToBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToArray", function() { return hexToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToUtf8", function() { return hexToUtf8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToNumber", function() { return hexToNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToBinary", function() { return hexToBinary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8ToBuffer", function() { return utf8ToBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8ToArray", function() { return utf8ToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8ToHex", function() { return utf8ToHex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8ToNumber", function() { return utf8ToNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8ToBinary", function() { return utf8ToBinary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numberToBuffer", function() { return numberToBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numberToArray", function() { return numberToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numberToHex", function() { return numberToHex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numberToUtf8", function() { return numberToUtf8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numberToBinary", function() { return numberToBinary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "binaryToBuffer", function() { return binaryToBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "binaryToArray", function() { return binaryToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "binaryToHex", function() { return binaryToHex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "binaryToUtf8", function() { return binaryToUtf8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "binaryToNumber", function() { return binaryToNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBinaryString", function() { return isBinaryString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isHexString", function() { return isHexString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBuffer", function() { return isBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isTypedArray", function() { return isTypedArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArrayBuffer", function() { return isArrayBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getType", function() { return getType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEncoding", function() { return getEncoding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concatBuffers", function() { return concatBuffers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concatArrays", function() { return concatArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimLeft", function() { return trimLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimRight", function() { return trimRight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calcByteLength", function() { return calcByteLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitBytes", function() { return splitBytes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "swapBytes", function() { return swapBytes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "swapHex", function() { return swapHex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeBytes", function() { return sanitizeBytes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "padLeft", function() { return padLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "padRight", function() { return padRight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeHexPrefix", function() { return removeHexPrefix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addHexPrefix", function() { return addHexPrefix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeHex", function() { return sanitizeHex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeHexLeadingZeros", function() { return removeHexLeadingZeros; });
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(137);
/* harmony import */ var is_typedarray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(612);
/* harmony import */ var is_typedarray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(is_typedarray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var typedarray_to_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(632);
/* harmony import */ var typedarray_to_buffer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(typedarray_to_buffer__WEBPACK_IMPORTED_MODULE_2__);



var ENC_HEX = "hex";
var ENC_UTF8 = "utf8";
var ENC_BIN = "binary";
var TYPE_BUFFER = "buffer";
var TYPE_ARRAY = "array";
var TYPE_TYPED_ARRAY = "typed-array";
var TYPE_ARRAY_BUFFER = "array-buffer";
var STRING_ZERO = "0";
function bufferToArray(buf) {
  return new Uint8Array(buf);
}
function bufferToHex(buf) {
  var prefixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var hex = buf.toString(ENC_HEX);
  return prefixed ? addHexPrefix(hex) : hex;
}
function bufferToUtf8(buf) {
  return buf.toString(ENC_UTF8);
}
function bufferToNumber(buf) {
  return buf.readUIntBE(0, buf.length);
}
function bufferToBinary(buf) {
  return arrayToBinary(bufferToArray(buf));
}
function arrayToBuffer(arr) {
  return typedarray_to_buffer__WEBPACK_IMPORTED_MODULE_2___default()(arr);
}
function arrayToHex(arr) {
  var prefixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return bufferToHex(arrayToBuffer(arr), prefixed);
}
function arrayToUtf8(arr) {
  return bufferToUtf8(arrayToBuffer(arr));
}
function arrayToNumber(arr) {
  return bufferToNumber(arrayToBuffer(arr));
}
function arrayToBinary(arr) {
  return Array.from(arr).map(numberToBinary).join("");
}
function hexToBuffer(hex) {
  return Buffer.from(removeHexPrefix(hex), ENC_HEX);
}
function hexToArray(hex) {
  return bufferToArray(hexToBuffer(hex));
}
function hexToUtf8(hex) {
  return bufferToUtf8(hexToBuffer(hex));
}
function hexToNumber(hex) {
  return arrayToNumber(hexToArray(hex));
}
function hexToBinary(hex) {
  return arrayToBinary(hexToArray(hex));
}
function utf8ToBuffer(utf8) {
  return Buffer.from(utf8, ENC_UTF8);
}
function utf8ToArray(utf8) {
  return bufferToArray(utf8ToBuffer(utf8));
}
function utf8ToHex(utf8) {
  var prefixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return bufferToHex(utf8ToBuffer(utf8), prefixed);
}
function utf8ToNumber(utf8) {
  var num = parseInt(utf8, 10);
  assert(isDefined(num), "Number can only safely store up to 53 bits");
  return num;
}
function utf8ToBinary(utf8) {
  return arrayToBinary(utf8ToArray(utf8));
}
function numberToBuffer(num) {
  return binaryToBuffer(numberToBinary(num));
}
function numberToArray(num) {
  return binaryToArray(numberToBinary(num));
}
function numberToHex(num, prefixed) {
  return binaryToHex(numberToBinary(num), prefixed);
}
function numberToUtf8(num) {
  return "".concat(num);
}
function numberToBinary(num) {
  var bin = (num >>> 0).toString(2);
  return sanitizeBytes(bin);
}
function binaryToBuffer(bin) {
  return arrayToBuffer(binaryToArray(bin));
}
function binaryToArray(bin) {
  return new Uint8Array(splitBytes(bin).map(function (x) {
    return parseInt(x, 2);
  }));
}
function binaryToHex(bin, prefixed) {
  return arrayToHex(binaryToArray(bin), prefixed);
}
function binaryToUtf8(bin) {
  return arrayToUtf8(binaryToArray(bin));
}
function binaryToNumber(bin) {
  return arrayToNumber(binaryToArray(bin));
}
function isBinaryString(str) {
  if (typeof str !== "string" || !new RegExp(/^[01]+$/).test(str)) {
    return false;
  }

  if (str.length % 8 !== 0) {
    return false;
  }

  return true;
}
function isHexString(str, length) {
  if (typeof str !== "string" || !str.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  if (length && str.length !== 2 + 2 * length) {
    return false;
  }

  return true;
}
function isBuffer(val) {
  return Buffer.isBuffer(val);
}
function isTypedArray(val) {
  return is_typedarray__WEBPACK_IMPORTED_MODULE_1___default.a.strict(val) && !isBuffer(val);
}
function isArrayBuffer(val) {
  return !isTypedArray(val) && !isBuffer(val) && typeof val.byteLength !== "undefined";
}
function getType(val) {
  if (isBuffer(val)) {
    return TYPE_BUFFER;
  } else if (isTypedArray(val)) {
    return TYPE_TYPED_ARRAY;
  } else if (isArrayBuffer(val)) {
    return TYPE_ARRAY_BUFFER;
  } else if (Array.isArray(val)) {
    return TYPE_ARRAY;
  } else {
    return typeof val;
  }
}
function getEncoding(str) {
  if (isBinaryString(str)) {
    return ENC_BIN;
  }

  if (isHexString(str)) {
    return ENC_HEX;
  }

  return ENC_UTF8;
}
function concatBuffers() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var result = Buffer.concat(args);
  return result;
}
function concatArrays() {
  var result = [];

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  args.forEach(function (arg) {
    return result = result.concat(Array.from(arg));
  });
  return new Uint8Array(Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(result));
}
function trimLeft(data, length) {
  var diff = data.length - length;

  if (diff > 0) {
    data = data.slice(diff);
  }

  return data;
}
function trimRight(data, length) {
  return data.slice(0, length);
}
function calcByteLength(length) {
  var byteSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var remainder = length % byteSize;
  return remainder ? (length - remainder) / byteSize * byteSize + byteSize : length;
}
function splitBytes(str) {
  var byteSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var bytes = sanitizeBytes(str).match(new RegExp(".{".concat(byteSize, "}"), "gi"));
  return Array.from(bytes || []);
}
function swapBytes(str) {
  return splitBytes(str).map(reverseString).join("");
}
function swapHex(str) {
  return binaryToHex(swapBytes(hexToBinary(str)));
}
function sanitizeBytes(str) {
  var byteSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : STRING_ZERO;
  return padLeft(str, calcByteLength(str.length, byteSize), padding);
}
function padLeft(str, length) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : STRING_ZERO;
  return padString(str, length, true, padding);
}
function padRight(str, length) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : STRING_ZERO;
  return padString(str, length, false, padding);
}
function removeHexPrefix(hex) {
  return hex.replace(/^0x/, "");
}
function addHexPrefix(hex) {
  return hex.startsWith("0x") ? hex : "0x".concat(hex);
}
function sanitizeHex(hex) {
  hex = removeHexPrefix(hex);
  hex = sanitizeBytes(hex, 2);

  if (hex) {
    hex = addHexPrefix(hex);
  }

  return hex;
}
function removeHexLeadingZeros(hex) {
  var prefixed = hex.startsWith("0x");
  hex = removeHexPrefix(hex);
  hex = hex.startsWith(STRING_ZERO) ? hex.substring(1) : hex;
  return prefixed ? addHexPrefix(hex) : hex;
}

function isUndefined(value) {
  return typeof value === "undefined";
}

function isDefined(value) {
  return !isUndefined(value);
}

function assert(assertion, errorMessage) {
  if (!assertion) {
    throw new Error(errorMessage);
  }
}

function reverseString(str) {
  return str.split("").reverse().join("");
}

function padString(str, length, left) {
  var padding = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : STRING_ZERO;
  var diff = length - str.length;
  var result = str;

  if (diff > 0) {
    var pad = padding.repeat(diff);
    result = left ? pad + str : str + pad;
  }

  return result;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8).Buffer))

/***/ }),

/***/ 590:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(591);
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(592);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "parseConnectionError", function() { return _error__WEBPACK_IMPORTED_MODULE_1__["d"]; });

/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(601);
/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_2__, "IJsonRpcProvider")) __webpack_require__.d(__webpack_exports__, "IJsonRpcProvider", function() { return _env__WEBPACK_IMPORTED_MODULE_2__["IJsonRpcProvider"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_2__, "formatJsonRpcError")) __webpack_require__.d(__webpack_exports__, "formatJsonRpcError", function() { return _env__WEBPACK_IMPORTED_MODULE_2__["formatJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_2__, "formatJsonRpcRequest")) __webpack_require__.d(__webpack_exports__, "formatJsonRpcRequest", function() { return _env__WEBPACK_IMPORTED_MODULE_2__["formatJsonRpcRequest"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_2__, "isHttpUrl")) __webpack_require__.d(__webpack_exports__, "isHttpUrl", function() { return _env__WEBPACK_IMPORTED_MODULE_2__["isHttpUrl"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_2__, "isJsonRpcError")) __webpack_require__.d(__webpack_exports__, "isJsonRpcError", function() { return _env__WEBPACK_IMPORTED_MODULE_2__["isJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_2__, "isJsonRpcResponse")) __webpack_require__.d(__webpack_exports__, "isJsonRpcResponse", function() { return _env__WEBPACK_IMPORTED_MODULE_2__["isJsonRpcResponse"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_2__, "payloadId")) __webpack_require__.d(__webpack_exports__, "payloadId", function() { return _env__WEBPACK_IMPORTED_MODULE_2__["payloadId"]; });

/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(602);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "formatJsonRpcError", function() { return _format__WEBPACK_IMPORTED_MODULE_3__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "formatJsonRpcRequest", function() { return _format__WEBPACK_IMPORTED_MODULE_3__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "payloadId", function() { return _format__WEBPACK_IMPORTED_MODULE_3__["c"]; });

/* harmony import */ var _routing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(603);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(604);
/* harmony reexport (checked) */ if(__webpack_require__.o(_types__WEBPACK_IMPORTED_MODULE_5__, "IJsonRpcProvider")) __webpack_require__.d(__webpack_exports__, "IJsonRpcProvider", function() { return _types__WEBPACK_IMPORTED_MODULE_5__["IJsonRpcProvider"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_types__WEBPACK_IMPORTED_MODULE_5__, "isHttpUrl")) __webpack_require__.d(__webpack_exports__, "isHttpUrl", function() { return _types__WEBPACK_IMPORTED_MODULE_5__["isHttpUrl"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_types__WEBPACK_IMPORTED_MODULE_5__, "isJsonRpcError")) __webpack_require__.d(__webpack_exports__, "isJsonRpcError", function() { return _types__WEBPACK_IMPORTED_MODULE_5__["isJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_types__WEBPACK_IMPORTED_MODULE_5__, "isJsonRpcResponse")) __webpack_require__.d(__webpack_exports__, "isJsonRpcResponse", function() { return _types__WEBPACK_IMPORTED_MODULE_5__["isJsonRpcResponse"]; });

/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(608);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isHttpUrl", function() { return _url__WEBPACK_IMPORTED_MODULE_6__["a"]; });

/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(609);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isJsonRpcError", function() { return _validators__WEBPACK_IMPORTED_MODULE_7__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isJsonRpcResponse", function() { return _validators__WEBPACK_IMPORTED_MODULE_7__["b"]; });










/***/ }),

/***/ 591:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export PARSE_ERROR */
/* unused harmony export INVALID_REQUEST */
/* unused harmony export METHOD_NOT_FOUND */
/* unused harmony export INVALID_PARAMS */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return INTERNAL_ERROR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SERVER_ERROR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return RESERVED_ERROR_CODES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SERVER_ERROR_CODE_RANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return STANDARD_ERROR_MAP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DEFAULT_ERROR; });
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


var _STANDARD_ERROR_MAP;

var PARSE_ERROR = "PARSE_ERROR";
var INVALID_REQUEST = "INVALID_REQUEST";
var METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
var INVALID_PARAMS = "INVALID_PARAMS";
var INTERNAL_ERROR = "INTERNAL_ERROR";
var SERVER_ERROR = "SERVER_ERROR";
var RESERVED_ERROR_CODES = [-32700, -32600, -32601, -32602, -32603];
var SERVER_ERROR_CODE_RANGE = [-32000, -32099];
var STANDARD_ERROR_MAP = (_STANDARD_ERROR_MAP = {}, Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(_STANDARD_ERROR_MAP, PARSE_ERROR, {
  code: -32700,
  message: "Parse error"
}), Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(_STANDARD_ERROR_MAP, INVALID_REQUEST, {
  code: -32600,
  message: "Invalid Request"
}), Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(_STANDARD_ERROR_MAP, METHOD_NOT_FOUND, {
  code: -32601,
  message: "Method not found"
}), Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(_STANDARD_ERROR_MAP, INVALID_PARAMS, {
  code: -32602,
  message: "Invalid params"
}), Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(_STANDARD_ERROR_MAP, INTERNAL_ERROR, {
  code: -32603,
  message: "Internal error"
}), Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(_STANDARD_ERROR_MAP, SERVER_ERROR, {
  code: -32000,
  message: "Server error"
}), _STANDARD_ERROR_MAP);
var DEFAULT_ERROR = SERVER_ERROR;

/***/ }),

/***/ 592:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isServerErrorCode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isReservedErrorCode; });
/* unused harmony export isValidErrorCode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getErrorByCode; });
/* unused harmony export validateJsonRpcError */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return parseConnectionError; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(591);

function isServerErrorCode(code) {
  return code <= _constants__WEBPACK_IMPORTED_MODULE_0__[/* SERVER_ERROR_CODE_RANGE */ "e"][0] && code >= _constants__WEBPACK_IMPORTED_MODULE_0__[/* SERVER_ERROR_CODE_RANGE */ "e"][1];
}
function isReservedErrorCode(code) {
  return _constants__WEBPACK_IMPORTED_MODULE_0__[/* RESERVED_ERROR_CODES */ "c"].includes(code);
}
function isValidErrorCode(code) {
  return typeof code === "number";
}
function getError(type) {
  if (!Object.keys(_constants__WEBPACK_IMPORTED_MODULE_0__[/* STANDARD_ERROR_MAP */ "f"]).includes(type)) {
    return _constants__WEBPACK_IMPORTED_MODULE_0__[/* STANDARD_ERROR_MAP */ "f"][_constants__WEBPACK_IMPORTED_MODULE_0__[/* DEFAULT_ERROR */ "a"]];
  }

  return _constants__WEBPACK_IMPORTED_MODULE_0__[/* STANDARD_ERROR_MAP */ "f"][type];
}
function getErrorByCode(code) {
  var match = Object.values(_constants__WEBPACK_IMPORTED_MODULE_0__[/* STANDARD_ERROR_MAP */ "f"]).find(function (e) {
    return e.code === code;
  });

  if (!match) {
    return _constants__WEBPACK_IMPORTED_MODULE_0__[/* STANDARD_ERROR_MAP */ "f"][_constants__WEBPACK_IMPORTED_MODULE_0__[/* DEFAULT_ERROR */ "a"]];
  }

  return match;
}
function validateJsonRpcError(response) {
  if (typeof response.error.code === "undefined") {
    return {
      valid: false,
      error: "Missing code for JSON-RPC error"
    };
  }

  if (typeof response.error.message === "undefined") {
    return {
      valid: false,
      error: "Missing message for JSON-RPC error"
    };
  }

  if (!isValidErrorCode(response.error.code)) {
    return {
      valid: false,
      error: "Invalid error code type for JSON-RPC: ".concat(response.error.code)
    };
  }

  if (isReservedErrorCode(response.error.code)) {
    var error = getErrorByCode(response.error.code);

    if (error.message !== _constants__WEBPACK_IMPORTED_MODULE_0__[/* STANDARD_ERROR_MAP */ "f"][_constants__WEBPACK_IMPORTED_MODULE_0__[/* DEFAULT_ERROR */ "a"]].message && response.error.message === error.message) {
      return {
        valid: false,
        error: "Invalid error code message for JSON-RPC: ".concat(response.error.code)
      };
    }
  }

  return {
    valid: true
  };
}
function parseConnectionError(e, url, type) {
  return e.message.includes("getaddrinfo ENOTFOUND") || e.message.includes("connect ECONNREFUSED") ? new Error("Unavailable ".concat(type, " RPC url at ").concat(url)) : e;
}

/***/ }),

/***/ 593:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _jsonrpc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(605);
/* harmony import */ var _jsonrpc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jsonrpc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_jsonrpc__WEBPACK_IMPORTED_MODULE_0__, "IJsonRpcConnection")) __webpack_require__.d(__webpack_exports__, "IJsonRpcConnection", function() { return _jsonrpc__WEBPACK_IMPORTED_MODULE_0__["IJsonRpcConnection"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_jsonrpc__WEBPACK_IMPORTED_MODULE_0__, "IJsonRpcProvider")) __webpack_require__.d(__webpack_exports__, "IJsonRpcProvider", function() { return _jsonrpc__WEBPACK_IMPORTED_MODULE_0__["IJsonRpcProvider"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_jsonrpc__WEBPACK_IMPORTED_MODULE_0__, "isHttpUrl")) __webpack_require__.d(__webpack_exports__, "isHttpUrl", function() { return _jsonrpc__WEBPACK_IMPORTED_MODULE_0__["isHttpUrl"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_jsonrpc__WEBPACK_IMPORTED_MODULE_0__, "isJsonRpcError")) __webpack_require__.d(__webpack_exports__, "isJsonRpcError", function() { return _jsonrpc__WEBPACK_IMPORTED_MODULE_0__["isJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_jsonrpc__WEBPACK_IMPORTED_MODULE_0__, "isJsonRpcResponse")) __webpack_require__.d(__webpack_exports__, "isJsonRpcResponse", function() { return _jsonrpc__WEBPACK_IMPORTED_MODULE_0__["isJsonRpcResponse"]; });

/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(594);
/* harmony import */ var _provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(606);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IJsonRpcConnection", function() { return _provider__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IJsonRpcProvider", function() { return _provider__WEBPACK_IMPORTED_MODULE_2__["b"]; });

/* harmony import */ var _validator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(607);
/* harmony import */ var _validator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_validator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_validator__WEBPACK_IMPORTED_MODULE_3__, "isHttpUrl")) __webpack_require__.d(__webpack_exports__, "isHttpUrl", function() { return _validator__WEBPACK_IMPORTED_MODULE_3__["isHttpUrl"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_validator__WEBPACK_IMPORTED_MODULE_3__, "isJsonRpcError")) __webpack_require__.d(__webpack_exports__, "isJsonRpcError", function() { return _validator__WEBPACK_IMPORTED_MODULE_3__["isJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_validator__WEBPACK_IMPORTED_MODULE_3__, "isJsonRpcResponse")) __webpack_require__.d(__webpack_exports__, "isJsonRpcResponse", function() { return _validator__WEBPACK_IMPORTED_MODULE_3__["isJsonRpcResponse"]; });






/***/ }),

/***/ 594:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IEvents; });
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


var IEvents = /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(function IEvents() {
  Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(this, IEvents);
});

/***/ }),

/***/ 595:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getAlgo */
/* unused harmony export getOps */
/* unused harmony export browserExportKey */
/* unused harmony export browserImportKey */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return browserAesEncrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return browserAesDecrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return browserHmacSha256Sign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return browserHmacSha512Sign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return browserSha256; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return browserSha512; });
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(584);
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(600);




function getAlgo(type) {
  return type === _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"] ? {
    length: _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_LENGTH */ "b"],
    name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"]
  } : {
    hash: {
      name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* HMAC_BROWSER_ALGO */ "f"]
    },
    name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* HMAC_BROWSER */ "e"]
  };
}
function getOps(type) {
  return type === _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"] ? [_constants__WEBPACK_IMPORTED_MODULE_3__[/* ENCRYPT_OP */ "d"], _constants__WEBPACK_IMPORTED_MODULE_3__[/* DECRYPT_OP */ "c"]] : [_constants__WEBPACK_IMPORTED_MODULE_3__[/* SIGN_OP */ "k"], _constants__WEBPACK_IMPORTED_MODULE_3__[/* VERIFY_OP */ "l"]];
}
function browserExportKey(_x) {
  return _browserExportKey.apply(this, arguments);
}

function _browserExportKey() {
  _browserExportKey = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee(cryptoKey) {
    var type,
        subtle,
        _args = arguments;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = _args.length > 1 && _args[1] !== undefined ? _args[1] : _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"];
            subtle = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]();
            _context.t0 = Uint8Array;
            _context.next = 5;
            return subtle.exportKey("raw", cryptoKey);

          case 5:
            _context.t1 = _context.sent;
            return _context.abrupt("return", new _context.t0(_context.t1));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _browserExportKey.apply(this, arguments);
}

function browserImportKey(_x2) {
  return _browserImportKey.apply(this, arguments);
}

function _browserImportKey() {
  _browserImportKey = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee2(buffer) {
    var type,
        _args2 = arguments;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            type = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"];
            return _context2.abrupt("return", _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]().importKey("raw", buffer, getAlgo(type), true, getOps(type)));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _browserImportKey.apply(this, arguments);
}

function browserAesEncrypt(_x3, _x4, _x5) {
  return _browserAesEncrypt.apply(this, arguments);
}

function _browserAesEncrypt() {
  _browserAesEncrypt = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee3(iv, key, data) {
    var subtle, cryptoKey, result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            subtle = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]();
            _context3.next = 3;
            return browserImportKey(key, _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"]);

          case 3:
            cryptoKey = _context3.sent;
            _context3.next = 6;
            return subtle.encrypt({
              iv: iv,
              name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"]
            }, cryptoKey, data);

          case 6:
            result = _context3.sent;
            return _context3.abrupt("return", new Uint8Array(result));

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _browserAesEncrypt.apply(this, arguments);
}

function browserAesDecrypt(_x6, _x7, _x8) {
  return _browserAesDecrypt.apply(this, arguments);
}

function _browserAesDecrypt() {
  _browserAesDecrypt = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee4(iv, key, data) {
    var subtle, cryptoKey, result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            subtle = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]();
            _context4.next = 3;
            return browserImportKey(key, _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"]);

          case 3:
            cryptoKey = _context4.sent;
            _context4.next = 6;
            return subtle.decrypt({
              iv: iv,
              name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* AES_BROWSER_ALGO */ "a"]
            }, cryptoKey, data);

          case 6:
            result = _context4.sent;
            return _context4.abrupt("return", new Uint8Array(result));

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _browserAesDecrypt.apply(this, arguments);
}

function browserHmacSha256Sign(_x9, _x10) {
  return _browserHmacSha256Sign.apply(this, arguments);
}

function _browserHmacSha256Sign() {
  _browserHmacSha256Sign = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee5(key, data) {
    var subtle, cryptoKey, signature;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            subtle = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]();
            _context5.next = 3;
            return browserImportKey(key, _constants__WEBPACK_IMPORTED_MODULE_3__[/* HMAC_BROWSER */ "e"]);

          case 3:
            cryptoKey = _context5.sent;
            _context5.next = 6;
            return subtle.sign({
              length: _constants__WEBPACK_IMPORTED_MODULE_3__[/* HMAC_LENGTH */ "g"],
              name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* HMAC_BROWSER */ "e"]
            }, cryptoKey, data);

          case 6:
            signature = _context5.sent;
            return _context5.abrupt("return", new Uint8Array(signature));

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _browserHmacSha256Sign.apply(this, arguments);
}

function browserHmacSha512Sign(_x11, _x12) {
  return _browserHmacSha512Sign.apply(this, arguments);
}

function _browserHmacSha512Sign() {
  _browserHmacSha512Sign = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee6(key, data) {
    var subtle, cryptoKey, signature;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            subtle = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]();
            _context6.next = 3;
            return browserImportKey(key, _constants__WEBPACK_IMPORTED_MODULE_3__[/* HMAC_BROWSER */ "e"]);

          case 3:
            cryptoKey = _context6.sent;
            _context6.next = 6;
            return subtle.sign({
              length: _constants__WEBPACK_IMPORTED_MODULE_3__[/* LENGTH_512 */ "h"],
              name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* HMAC_BROWSER */ "e"]
            }, cryptoKey, data);

          case 6:
            signature = _context6.sent;
            return _context6.abrupt("return", new Uint8Array(signature));

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _browserHmacSha512Sign.apply(this, arguments);
}

function browserSha256(_x13) {
  return _browserSha.apply(this, arguments);
}

function _browserSha() {
  _browserSha = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee7(data) {
    var subtle, result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            subtle = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]();
            _context7.next = 3;
            return subtle.digest({
              name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* SHA256_BROWSER_ALGO */ "i"]
            }, data);

          case 3:
            result = _context7.sent;
            return _context7.abrupt("return", new Uint8Array(result));

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _browserSha.apply(this, arguments);
}

function browserSha512(_x14) {
  return _browserSha2.apply(this, arguments);
}

function _browserSha2() {
  _browserSha2 = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee8(data) {
    var subtle, result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            subtle = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_2__["getSubtleCrypto"]();
            _context8.next = 3;
            return subtle.digest({
              name: _constants__WEBPACK_IMPORTED_MODULE_3__[/* SHA512_BROWSER_ALGO */ "j"]
            }, data);

          case 3:
            result = _context8.sent;
            return _context8.abrupt("return", new Uint8Array(result));

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _browserSha2.apply(this, arguments);
}

/***/ }),

/***/ 596:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(616);
/* harmony reexport (checked) */ if(__webpack_require__.o(_env__WEBPACK_IMPORTED_MODULE_0__, "isConstantTime")) __webpack_require__.d(__webpack_exports__, "isConstantTime", function() { return _env__WEBPACK_IMPORTED_MODULE_0__["isConstantTime"]; });

/* harmony import */ var _pkcs7__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(617);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(618);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_types__WEBPACK_IMPORTED_MODULE_2__, "isConstantTime")) __webpack_require__.d(__webpack_exports__, "isConstantTime", function() { return _types__WEBPACK_IMPORTED_MODULE_2__["isConstantTime"]; });

/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(619);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isConstantTime", function() { return _validators__WEBPACK_IMPORTED_MODULE_3__["a"]; });






/***/ }),

/***/ 597:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),

/***/ 598:
/***/ (function(module, exports) {

exports.L = {
  bit: 1
};
exports.M = {
  bit: 0
};
exports.Q = {
  bit: 3
};
exports.H = {
  bit: 2
};

function fromString(string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string');
  }

  var lcStr = string.toLowerCase();

  switch (lcStr) {
    case 'l':
    case 'low':
      return exports.L;

    case 'm':
    case 'medium':
      return exports.M;

    case 'q':
    case 'quartile':
      return exports.Q;

    case 'h':
    case 'high':
      return exports.H;

    default:
      throw new Error('Unknown EC Level: ' + string);
  }
}

exports.isValid = function isValid(level) {
  return level && typeof level.bit !== 'undefined' && level.bit >= 0 && level.bit < 4;
};

exports.from = function from(value, defaultValue) {
  if (exports.isValid(value)) {
    return value;
  }

  try {
    return fromString(value);
  } catch (e) {
    return defaultValue;
  }
};

/***/ }),

/***/ 599:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "detectEnv", function() { return /* reexport */ detectEnv; });
__webpack_require__.d(__webpack_exports__, "detectOS", function() { return /* reexport */ detectOS; });
__webpack_require__.d(__webpack_exports__, "isAndroid", function() { return /* reexport */ isAndroid; });
__webpack_require__.d(__webpack_exports__, "isIOS", function() { return /* reexport */ isIOS; });
__webpack_require__.d(__webpack_exports__, "isMobile", function() { return /* reexport */ isMobile; });
__webpack_require__.d(__webpack_exports__, "isNode", function() { return /* reexport */ isNode; });
__webpack_require__.d(__webpack_exports__, "isBrowser", function() { return /* reexport */ isBrowser; });
__webpack_require__.d(__webpack_exports__, "getFromWindow", function() { return /* reexport */ getFromWindow; });
__webpack_require__.d(__webpack_exports__, "getFromWindowOrThrow", function() { return /* reexport */ getFromWindowOrThrow; });
__webpack_require__.d(__webpack_exports__, "getDocumentOrThrow", function() { return /* reexport */ getDocumentOrThrow; });
__webpack_require__.d(__webpack_exports__, "getDocument", function() { return /* reexport */ getDocument; });
__webpack_require__.d(__webpack_exports__, "getNavigatorOrThrow", function() { return /* reexport */ getNavigatorOrThrow; });
__webpack_require__.d(__webpack_exports__, "getNavigator", function() { return /* reexport */ getNavigator; });
__webpack_require__.d(__webpack_exports__, "getLocationOrThrow", function() { return /* reexport */ getLocationOrThrow; });
__webpack_require__.d(__webpack_exports__, "getLocation", function() { return /* reexport */ getLocation; });
__webpack_require__.d(__webpack_exports__, "getCryptoOrThrow", function() { return /* reexport */ getCryptoOrThrow; });
__webpack_require__.d(__webpack_exports__, "getCrypto", function() { return /* reexport */ getCrypto; });
__webpack_require__.d(__webpack_exports__, "getLocalStorageOrThrow", function() { return /* reexport */ getLocalStorageOrThrow; });
__webpack_require__.d(__webpack_exports__, "getLocalStorage", function() { return /* reexport */ getLocalStorage; });
__webpack_require__.d(__webpack_exports__, "getClientMeta", function() { return /* reexport */ getClientMeta; });
__webpack_require__.d(__webpack_exports__, "safeJsonParse", function() { return /* reexport */ safeJsonParse; });
__webpack_require__.d(__webpack_exports__, "safeJsonStringify", function() { return /* reexport */ safeJsonStringify; });
__webpack_require__.d(__webpack_exports__, "setLocal", function() { return /* reexport */ setLocal; });
__webpack_require__.d(__webpack_exports__, "getLocal", function() { return /* reexport */ getLocal; });
__webpack_require__.d(__webpack_exports__, "removeLocal", function() { return /* reexport */ removeLocal; });
__webpack_require__.d(__webpack_exports__, "mobileLinkChoiceKey", function() { return /* reexport */ mobileLinkChoiceKey; });
__webpack_require__.d(__webpack_exports__, "formatIOSMobile", function() { return /* reexport */ formatIOSMobile; });
__webpack_require__.d(__webpack_exports__, "saveMobileLinkInfo", function() { return /* reexport */ saveMobileLinkInfo; });
__webpack_require__.d(__webpack_exports__, "getMobileRegistryEntry", function() { return /* reexport */ getMobileRegistryEntry; });
__webpack_require__.d(__webpack_exports__, "getMobileLinkRegistry", function() { return /* reexport */ getMobileLinkRegistry; });
__webpack_require__.d(__webpack_exports__, "getWalletRegistryUrl", function() { return /* reexport */ getWalletRegistryUrl; });
__webpack_require__.d(__webpack_exports__, "getDappRegistryUrl", function() { return /* reexport */ getDappRegistryUrl; });
__webpack_require__.d(__webpack_exports__, "formatMobileRegistryEntry", function() { return /* reexport */ formatMobileRegistryEntry; });
__webpack_require__.d(__webpack_exports__, "formatMobileRegistry", function() { return /* reexport */ formatMobileRegistry; });

// EXTERNAL MODULE: ./node_modules/@walletconnect/window-metadata/dist/cjs/index.js
var cjs = __webpack_require__(628);

// EXTERNAL MODULE: ./node_modules/@walletconnect/window-getters/dist/cjs/index.js
var dist_cjs = __webpack_require__(611);

// EXTERNAL MODULE: ./node_modules/detect-browser/es/index.js
var es = __webpack_require__(629);

// CONCATENATED MODULE: ./node_modules/@walletconnect/browser-utils/dist/esm/browser.js



function detectEnv(userAgent) {
  return Object(es["a" /* detect */])(userAgent);
}
function detectOS() {
  var env = detectEnv();
  return env && env.os ? env.os : undefined;
}
function isAndroid() {
  var os = detectOS();
  return os ? os.toLowerCase().includes("android") : false;
}
function isIOS() {
  var os = detectOS();
  return os ? os.toLowerCase().includes("ios") || os.toLowerCase().includes("mac") && navigator.maxTouchPoints > 1 : false;
}
function isMobile() {
  var os = detectOS();
  return os ? isAndroid() || isIOS() : false;
}
function isNode() {
  var env = detectEnv();
  var result = env && env.name ? env.name.toLowerCase() === "node" : false;
  return result;
}
function isBrowser() {
  var result = !isNode() && !!getNavigator();
  return result;
}
var getFromWindow = dist_cjs["getFromWindow"];
var getFromWindowOrThrow = dist_cjs["getFromWindowOrThrow"];
var getDocumentOrThrow = dist_cjs["getDocumentOrThrow"];
var getDocument = dist_cjs["getDocument"];
var getNavigatorOrThrow = dist_cjs["getNavigatorOrThrow"];
var getNavigator = dist_cjs["getNavigator"];
var getLocationOrThrow = dist_cjs["getLocationOrThrow"];
var getLocation = dist_cjs["getLocation"];
var getCryptoOrThrow = dist_cjs["getCryptoOrThrow"];
var getCrypto = dist_cjs["getCrypto"];
var getLocalStorageOrThrow = dist_cjs["getLocalStorageOrThrow"];
var getLocalStorage = dist_cjs["getLocalStorage"];
function getClientMeta() {
  return cjs["getWindowMetadata"]();
}
// EXTERNAL MODULE: ./node_modules/@walletconnect/safe-json/dist/esm/index.js
var esm = __webpack_require__(610);

// CONCATENATED MODULE: ./node_modules/@walletconnect/browser-utils/dist/esm/json.js

var safeJsonParse = esm["a" /* safeJsonParse */];
var safeJsonStringify = esm["b" /* safeJsonStringify */];
// CONCATENATED MODULE: ./node_modules/@walletconnect/browser-utils/dist/esm/local.js


function setLocal(key, data) {
  var raw = safeJsonStringify(data);
  var local = getLocalStorage();

  if (local) {
    local.setItem(key, raw);
  }
}
function getLocal(key) {
  var data = null;
  var raw = null;
  var local = getLocalStorage();

  if (local) {
    raw = local.getItem(key);
  }

  data = raw ? safeJsonParse(raw) : raw;
  return data;
}
function removeLocal(key) {
  var local = getLocalStorage();

  if (local) {
    local.removeItem(key);
  }
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/browser-utils/dist/esm/mobile.js

var mobileLinkChoiceKey = "WALLETCONNECT_DEEPLINK_CHOICE";
function formatIOSMobile(uri, entry) {
  var encodedUri = encodeURIComponent(uri);
  return entry.universalLink ? "".concat(entry.universalLink, "/wc?uri=").concat(encodedUri) : entry.deepLink ? "".concat(entry.deepLink).concat(entry.deepLink.endsWith(":") ? "//" : "/", "wc?uri=").concat(encodedUri) : "";
}
function saveMobileLinkInfo(data) {
  var focusUri = data.href.split("?")[0];
  setLocal(mobileLinkChoiceKey, Object.assign(Object.assign({}, data), {
    href: focusUri
  }));
}
function getMobileRegistryEntry(registry, name) {
  return registry.filter(function (entry) {
    return entry.name.toLowerCase().includes(name.toLowerCase());
  })[0];
}
function getMobileLinkRegistry(registry, whitelist) {
  var links = registry;

  if (whitelist) {
    links = whitelist.map(function (name) {
      return getMobileRegistryEntry(registry, name);
    }).filter(Boolean);
  }

  return links;
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/browser-utils/dist/esm/registry.js
var API_URL = "https://registry.walletconnect.com";
function getWalletRegistryUrl() {
  return API_URL + "/api/v2/wallets";
}
function getDappRegistryUrl() {
  return API_URL + "/api/v2/dapps";
}
function formatMobileRegistryEntry(entry) {
  var platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "mobile";

  var _a;

  return {
    name: entry.name || "",
    shortName: entry.metadata.shortName || "",
    color: entry.metadata.colors.primary || "",
    logo: (_a = entry.image_url.sm) !== null && _a !== void 0 ? _a : "",
    universalLink: entry[platform].universal || "",
    deepLink: entry[platform].native || ""
  };
}
function formatMobileRegistry(registry) {
  var platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "mobile";
  return Object.values(registry).filter(function (entry) {
    return !!entry[platform].universal || !!entry[platform].native;
  }).map(function (entry) {
    return formatMobileRegistryEntry(entry, platform);
  });
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/browser-utils/dist/esm/index.js






/***/ }),

/***/ 600:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "b", function() { return /* reexport */ AES_LENGTH; });
__webpack_require__.d(__webpack_exports__, "g", function() { return /* reexport */ HMAC_LENGTH; });
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ AES_BROWSER_ALGO; });
__webpack_require__.d(__webpack_exports__, "f", function() { return /* reexport */ HMAC_BROWSER_ALGO; });
__webpack_require__.d(__webpack_exports__, "e", function() { return /* reexport */ HMAC_BROWSER; });
__webpack_require__.d(__webpack_exports__, "i", function() { return /* reexport */ SHA256_BROWSER_ALGO; });
__webpack_require__.d(__webpack_exports__, "j", function() { return /* reexport */ SHA512_BROWSER_ALGO; });
__webpack_require__.d(__webpack_exports__, "h", function() { return /* reexport */ LENGTH_512; });
__webpack_require__.d(__webpack_exports__, "d", function() { return /* reexport */ ENCRYPT_OP; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* reexport */ DECRYPT_OP; });
__webpack_require__.d(__webpack_exports__, "k", function() { return /* reexport */ SIGN_OP; });
__webpack_require__.d(__webpack_exports__, "l", function() { return /* reexport */ VERIFY_OP; });

// UNUSED EXPORTS: AES_NODE_ALGO, HMAC_NODE_ALGO, SHA256_NODE_ALGO, SHA512_NODE_ALGO, RIPEMD160_NODE_ALGO, PREFIX_LENGTH, KEY_LENGTH, IV_LENGTH, MAC_LENGTH, HEX_ENC, UTF8_ENC, ERROR_BAD_MAC, LENGTH_0, LENGTH_1, LENGTH_16, LENGTH_32, LENGTH_64, LENGTH_128, LENGTH_256, LENGTH_1024

// CONCATENATED MODULE: ./node_modules/@walletconnect/crypto/dist/esm/constants/length.js
var LENGTH_0 = 0;
var LENGTH_1 = 1;
var LENGTH_16 = 16;
var LENGTH_32 = 32;
var LENGTH_64 = 64;
var LENGTH_128 = 128;
var LENGTH_256 = 256;
var LENGTH_512 = 512;
var LENGTH_1024 = 1024;
// CONCATENATED MODULE: ./node_modules/@walletconnect/crypto/dist/esm/constants/default.js

var AES_LENGTH = LENGTH_256;
var HMAC_LENGTH = LENGTH_256;
var AES_BROWSER_ALGO = "AES-CBC";
var HMAC_BROWSER_ALGO = "SHA-".concat(AES_LENGTH);
var HMAC_BROWSER = "HMAC";
var SHA256_BROWSER_ALGO = "SHA-256";
var SHA512_BROWSER_ALGO = "SHA-512";
var AES_NODE_ALGO = "aes-".concat(AES_LENGTH, "-cbc");
var HMAC_NODE_ALGO = "sha".concat(HMAC_LENGTH);
var SHA256_NODE_ALGO = "sha256";
var SHA512_NODE_ALGO = "sha512";
var RIPEMD160_NODE_ALGO = "ripemd160";
var PREFIX_LENGTH = LENGTH_1;
var KEY_LENGTH = LENGTH_32;
var IV_LENGTH = LENGTH_16;
var MAC_LENGTH = LENGTH_32;
// CONCATENATED MODULE: ./node_modules/@walletconnect/crypto/dist/esm/constants/encoding.js
var HEX_ENC = "hex";
var UTF8_ENC = "utf8";
// CONCATENATED MODULE: ./node_modules/@walletconnect/crypto/dist/esm/constants/error.js
var ERROR_BAD_MAC = "Bad MAC";
// CONCATENATED MODULE: ./node_modules/@walletconnect/crypto/dist/esm/constants/operations.js
var ENCRYPT_OP = "encrypt";
var DECRYPT_OP = "decrypt";
var SIGN_OP = "sign";
var VERIFY_OP = "verify";
// CONCATENATED MODULE: ./node_modules/@walletconnect/crypto/dist/esm/constants/index.js






/***/ }),

/***/ 601:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isNodeJs */
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(584);
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "IJsonRpcProvider")) __webpack_require__.d(__webpack_exports__, "IJsonRpcProvider", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["IJsonRpcProvider"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "formatJsonRpcError")) __webpack_require__.d(__webpack_exports__, "formatJsonRpcError", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["formatJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "formatJsonRpcRequest")) __webpack_require__.d(__webpack_exports__, "formatJsonRpcRequest", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["formatJsonRpcRequest"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "isHttpUrl")) __webpack_require__.d(__webpack_exports__, "isHttpUrl", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["isHttpUrl"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "isJsonRpcError")) __webpack_require__.d(__webpack_exports__, "isJsonRpcError", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["isJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "isJsonRpcResponse")) __webpack_require__.d(__webpack_exports__, "isJsonRpcResponse", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["isJsonRpcResponse"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "payloadId")) __webpack_require__.d(__webpack_exports__, "payloadId", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["payloadId"]; });


var isNodeJs = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["isNode"];


/***/ }),

/***/ 602:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return payloadId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return formatJsonRpcRequest; });
/* unused harmony export formatJsonRpcResult */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return formatJsonRpcError; });
/* unused harmony export formatErrorMessage */
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(592);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(591);


function payloadId() {
  var date = Date.now() * Math.pow(10, 3);
  var extra = Math.floor(Math.random() * Math.pow(10, 3));
  return date + extra;
}
function formatJsonRpcRequest(method, params, id) {
  return {
    id: id || payloadId(),
    jsonrpc: "2.0",
    method: method,
    params: params
  };
}
function formatJsonRpcResult(id, result) {
  return {
    id: id,
    jsonrpc: "2.0",
    result: result
  };
}
function formatJsonRpcError(id, error, data) {
  return {
    id: id,
    jsonrpc: "2.0",
    error: formatErrorMessage(error, data)
  };
}
function formatErrorMessage(error, data) {
  if (typeof error === "undefined") {
    return Object(_error__WEBPACK_IMPORTED_MODULE_0__[/* getError */ "a"])(_constants__WEBPACK_IMPORTED_MODULE_1__[/* INTERNAL_ERROR */ "b"]);
  }

  if (typeof error === "string") {
    error = Object.assign(Object.assign({}, Object(_error__WEBPACK_IMPORTED_MODULE_0__[/* getError */ "a"])(_constants__WEBPACK_IMPORTED_MODULE_1__[/* SERVER_ERROR */ "d"])), {
      message: error
    });
  }

  if (typeof data !== "undefined") {
    error.data = data;
  }

  if (Object(_error__WEBPACK_IMPORTED_MODULE_0__[/* isReservedErrorCode */ "c"])(error.code)) {
    error = Object(_error__WEBPACK_IMPORTED_MODULE_0__[/* getErrorByCode */ "b"])(error.code);
  }

  return error;
}

/***/ }),

/***/ 603:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isValidRoute */
/* unused harmony export isValidDefaultRoute */
/* unused harmony export isValidWildcardRoute */
/* unused harmony export isValidLeadingWildcardRoute */
/* unused harmony export isValidTrailingWildcardRoute */
function isValidRoute(route) {
  if (route.includes("*")) {
    return isValidWildcardRoute(route);
  }

  if (/\W/g.test(route)) {
    return false;
  }

  return true;
}
function isValidDefaultRoute(route) {
  return route === "*";
}
function isValidWildcardRoute(route) {
  if (isValidDefaultRoute(route)) {
    return true;
  }

  if (!route.includes("*")) {
    return false;
  }

  if (route.split("*").length !== 2) {
    return false;
  }

  if (route.split("*").filter(function (x) {
    return x.trim() === "";
  }).length !== 1) {
    return false;
  }

  return true;
}
function isValidLeadingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[0].trim();
}
function isValidTrailingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[1].trim();
}

/***/ }),

/***/ 604:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(593);
/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__, "IJsonRpcProvider")) __webpack_require__.d(__webpack_exports__, "IJsonRpcProvider", function() { return _walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__["IJsonRpcProvider"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__, "isHttpUrl")) __webpack_require__.d(__webpack_exports__, "isHttpUrl", function() { return _walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__["isHttpUrl"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__, "isJsonRpcError")) __webpack_require__.d(__webpack_exports__, "isJsonRpcError", function() { return _walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__["isJsonRpcError"]; });

/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__, "isJsonRpcResponse")) __webpack_require__.d(__webpack_exports__, "isJsonRpcResponse", function() { return _walletconnect_jsonrpc_types__WEBPACK_IMPORTED_MODULE_0__["isJsonRpcResponse"]; });



/***/ }),

/***/ 605:
/***/ (function(module, exports) {



/***/ }),

/***/ 606:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IJsonRpcConnection; });
/* unused harmony export IBaseJsonRpcProvider */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return IJsonRpcProvider; });
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createSuper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(594);





var IJsonRpcConnection = /*#__PURE__*/function (_IEvents) {
  Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(IJsonRpcConnection, _IEvents);

  var _super = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createSuper_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(IJsonRpcConnection);

  function IJsonRpcConnection(opts) {
    Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(this, IJsonRpcConnection);

    return _super.call(this);
  }

  return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(IJsonRpcConnection);
}(_misc__WEBPACK_IMPORTED_MODULE_4__[/* IEvents */ "a"]);
var IBaseJsonRpcProvider = /*#__PURE__*/function (_IEvents2) {
  Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(IBaseJsonRpcProvider, _IEvents2);

  var _super2 = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createSuper_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(IBaseJsonRpcProvider);

  function IBaseJsonRpcProvider() {
    Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(this, IBaseJsonRpcProvider);

    return _super2.call(this);
  }

  return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(IBaseJsonRpcProvider);
}(_misc__WEBPACK_IMPORTED_MODULE_4__[/* IEvents */ "a"]);
var IJsonRpcProvider = /*#__PURE__*/function (_IBaseJsonRpcProvider) {
  Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(IJsonRpcProvider, _IBaseJsonRpcProvider);

  var _super3 = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createSuper_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(IJsonRpcProvider);

  function IJsonRpcProvider(connection) {
    Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(this, IJsonRpcProvider);

    return _super3.call(this);
  }

  return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(IJsonRpcProvider);
}(IBaseJsonRpcProvider);

/***/ }),

/***/ 607:
/***/ (function(module, exports) {



/***/ }),

/***/ 608:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isHttpUrl; });
/* unused harmony export isWsUrl */
/* unused harmony export isLocalhostUrl */
var HTTP_REGEX = "^https?:";
var WS_REGEX = "^wss?:";

function getUrlProtocol(url) {
  var matches = url.match(new RegExp(/^\w+:/, "gi"));
  if (!matches || !matches.length) return;
  return matches[0];
}

function matchRegexProtocol(url, regex) {
  var protocol = getUrlProtocol(url);
  if (typeof protocol === "undefined") return false;
  return new RegExp(regex).test(protocol);
}

function isHttpUrl(url) {
  return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
  return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
  return new RegExp("wss?://localhost(:d{2,5})?").test(url);
}

/***/ }),

/***/ 609:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isJsonRpcPayload */
/* unused harmony export isJsonRpcRequest */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isJsonRpcResponse; });
/* unused harmony export isJsonRpcResult */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isJsonRpcError; });
/* unused harmony export isJsonRpcValidationInvalid */
function isJsonRpcPayload(payload) {
  return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest(payload) {
  return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
  return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
  return "result" in payload;
}
function isJsonRpcError(payload) {
  return "error" in payload;
}
function isJsonRpcValidationInvalid(validation) {
  return "error" in validation && validation.valid === false;
}

/***/ }),

/***/ 610:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return safeJsonParse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return safeJsonStringify; });
function safeJsonParse(value) {
  if (typeof value !== "string") {
    throw new Error("Cannot safe json parse value of type ".concat(typeof value));
  }

  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
}
function safeJsonStringify(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

/***/ }),

/***/ 611:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalStorage = exports.getLocalStorageOrThrow = exports.getCrypto = exports.getCryptoOrThrow = exports.getLocation = exports.getLocationOrThrow = exports.getNavigator = exports.getNavigatorOrThrow = exports.getDocument = exports.getDocumentOrThrow = exports.getFromWindowOrThrow = exports.getFromWindow = void 0;

function getFromWindow(name) {
  var res = undefined;

  if (typeof window !== "undefined" && typeof window[name] !== "undefined") {
    res = window[name];
  }

  return res;
}

exports.getFromWindow = getFromWindow;

function getFromWindowOrThrow(name) {
  var res = getFromWindow(name);

  if (!res) {
    throw new Error("".concat(name, " is not defined in Window"));
  }

  return res;
}

exports.getFromWindowOrThrow = getFromWindowOrThrow;

function getDocumentOrThrow() {
  return getFromWindowOrThrow("document");
}

exports.getDocumentOrThrow = getDocumentOrThrow;

function getDocument() {
  return getFromWindow("document");
}

exports.getDocument = getDocument;

function getNavigatorOrThrow() {
  return getFromWindowOrThrow("navigator");
}

exports.getNavigatorOrThrow = getNavigatorOrThrow;

function getNavigator() {
  return getFromWindow("navigator");
}

exports.getNavigator = getNavigator;

function getLocationOrThrow() {
  return getFromWindowOrThrow("location");
}

exports.getLocationOrThrow = getLocationOrThrow;

function getLocation() {
  return getFromWindow("location");
}

exports.getLocation = getLocation;

function getCryptoOrThrow() {
  return getFromWindowOrThrow("crypto");
}

exports.getCryptoOrThrow = getCryptoOrThrow;

function getCrypto() {
  return getFromWindow("crypto");
}

exports.getCrypto = getCrypto;

function getLocalStorageOrThrow() {
  return getFromWindowOrThrow("localStorage");
}

exports.getLocalStorageOrThrow = getLocalStorageOrThrow;

function getLocalStorage() {
  return getFromWindow("localStorage");
}

exports.getLocalStorage = getLocalStorage;

/***/ }),

/***/ 612:
/***/ (function(module, exports) {

module.exports = isTypedArray;
isTypedArray.strict = isStrictTypedArray;
isTypedArray.loose = isLooseTypedArray;
var toString = Object.prototype.toString;
var names = {
  '[object Int8Array]': true,
  '[object Int16Array]': true,
  '[object Int32Array]': true,
  '[object Uint8Array]': true,
  '[object Uint8ClampedArray]': true,
  '[object Uint16Array]': true,
  '[object Uint32Array]': true,
  '[object Float32Array]': true,
  '[object Float64Array]': true
};

function isTypedArray(arr) {
  return isStrictTypedArray(arr) || isLooseTypedArray(arr);
}

function isStrictTypedArray(arr) {
  return arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Float32Array || arr instanceof Float64Array;
}

function isLooseTypedArray(arr) {
  return names[toString.call(arr)];
}

/***/ }),

/***/ 613:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return randomBytes; });
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(584);
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__);

function randomBytes(length) {
  var browserCrypto = _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["getBrowerCrypto"]();
  return browserCrypto.getRandomValues(new Uint8Array(length));
}

/***/ }),

/***/ 614:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return aesCbcEncrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return aesCbcDecrypt; });
/* harmony import */ var _lib_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(595);

function aesCbcEncrypt(iv, key, data) {
  return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_0__[/* browserAesEncrypt */ "b"])(iv, key, data);
}
function aesCbcDecrypt(iv, key, data) {
  return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_0__[/* browserAesDecrypt */ "a"])(iv, key, data);
}

/***/ }),

/***/ 615:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return hmacSha256Sign; });
/* unused harmony export hmacSha256Verify */
/* unused harmony export hmacSha512Sign */
/* unused harmony export hmacSha512Verify */
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _lib_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(595);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(596);




function hmacSha256Sign(_x, _x2) {
  return _hmacSha256Sign.apply(this, arguments);
}

function _hmacSha256Sign() {
  _hmacSha256Sign = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee(key, msg) {
    var result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_2__[/* browserHmacSha256Sign */ "c"])(key, msg);

          case 2:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _hmacSha256Sign.apply(this, arguments);
}

function hmacSha256Verify(_x3, _x4, _x5) {
  return _hmacSha256Verify.apply(this, arguments);
}

function _hmacSha256Verify() {
  _hmacSha256Verify = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee2(key, msg, sig) {
    var expectedSig, result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_2__[/* browserHmacSha256Sign */ "c"])(key, msg);

          case 2:
            expectedSig = _context2.sent;
            result = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["isConstantTime"])(expectedSig, sig);
            return _context2.abrupt("return", result);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _hmacSha256Verify.apply(this, arguments);
}

function hmacSha512Sign(_x6, _x7) {
  return _hmacSha512Sign.apply(this, arguments);
}

function _hmacSha512Sign() {
  _hmacSha512Sign = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee3(key, msg) {
    var result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_2__[/* browserHmacSha512Sign */ "d"])(key, msg);

          case 2:
            result = _context3.sent;
            return _context3.abrupt("return", result);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _hmacSha512Sign.apply(this, arguments);
}

function hmacSha512Verify(_x8, _x9, _x10) {
  return _hmacSha512Verify.apply(this, arguments);
}

function _hmacSha512Verify() {
  _hmacSha512Verify = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee4(key, msg, sig) {
    var expectedSig, result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_2__[/* browserHmacSha512Sign */ "d"])(key, msg);

          case 2:
            expectedSig = _context4.sent;
            result = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["isConstantTime"])(expectedSig, sig);
            return _context4.abrupt("return", result);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _hmacSha512Verify.apply(this, arguments);
}

/***/ }),

/***/ 616:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(584);
/* harmony import */ var _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__, "isConstantTime")) __webpack_require__.d(__webpack_exports__, "isConstantTime", function() { return _walletconnect_environment__WEBPACK_IMPORTED_MODULE_0__["isConstantTime"]; });



/***/ }),

/***/ 617:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export pkcs7 */
var PADDING = [[16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16], [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15], [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14], [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13], [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12], [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11], [10, 10, 10, 10, 10, 10, 10, 10, 10, 10], [9, 9, 9, 9, 9, 9, 9, 9, 9], [8, 8, 8, 8, 8, 8, 8, 8], [7, 7, 7, 7, 7, 7, 7], [6, 6, 6, 6, 6, 6], [5, 5, 5, 5, 5], [4, 4, 4, 4], [3, 3, 3], [2, 2], [1]];
var pkcs7 = {
  pad: function pad(plaintext) {
    var padding = PADDING[plaintext.byteLength % 16 || 0];
    var result = new Uint8Array(plaintext.byteLength + padding.length);
    result.set(plaintext);
    result.set(padding, plaintext.byteLength);
    return result;
  },
  unpad: function unpad(padded) {
    return padded.subarray(0, padded.byteLength - padded[padded.byteLength - 1]);
  }
};

/***/ }),

/***/ 618:
/***/ (function(module, exports) {



/***/ }),

/***/ 619:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export assert */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isConstantTime; });
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}
function isConstantTime(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  var res = 0;

  for (var i = 0; i < arr1.length; i++) {
    res |= arr1[i] ^ arr2[i];
  }

  return res === 0;
}

/***/ }),

/***/ 620:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export sha256 */
/* unused harmony export sha512 */
/* unused harmony export ripemd160 */
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _lib_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(595);



function sha256(_x) {
  return _sha.apply(this, arguments);
}

function _sha() {
  _sha = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee(msg) {
    var result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_2__[/* browserSha256 */ "e"])(msg);

          case 2:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sha.apply(this, arguments);
}

function sha512(_x2) {
  return _sha2.apply(this, arguments);
}

function _sha2() {
  _sha2 = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee2(msg) {
    var result;
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Object(_lib_browser__WEBPACK_IMPORTED_MODULE_2__[/* browserSha512 */ "f"])(msg);

          case 2:
            result = _context2.sent;
            return _context2.abrupt("return", result);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _sha2.apply(this, arguments);
}

function ripemd160(_x3) {
  return _ripemd.apply(this, arguments);
}

function _ripemd() {
  _ripemd = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee3(msg) {
    return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            throw new Error("Not supported for Browser async methods, use sync instead!");

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _ripemd.apply(this, arguments);
}

/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

var ECLevel = __webpack_require__(598);

var EC_BLOCKS_TABLE = [// L  M  Q  H
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81];
var EC_CODEWORDS_TABLE = [// L  M  Q  H
7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
/**
 * Returns the number of error correction block that the QR Code should contain
 * for the specified version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction blocks
 */

exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];

    case ECLevel.M:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];

    case ECLevel.Q:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];

    case ECLevel.H:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];

    default:
      return undefined;
  }
};
/**
 * Returns the number of error correction codewords to use for the specified
 * version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction codewords
 */


exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];

    case ECLevel.M:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];

    case ECLevel.Q:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];

    case ECLevel.H:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];

    default:
      return undefined;
  }
};

/***/ }),

/***/ 622:
/***/ (function(module, exports) {

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
exports.isValid = function isValid(version) {
  return !isNaN(version) && version >= 1 && version <= 40;
};

/***/ }),

/***/ 623:
/***/ (function(module, exports) {

var numeric = '[0-9]+';
var alphanumeric = '[A-Z $%*+\\-./:]+';
var kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' + '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' + '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' + '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+';
kanji = kanji.replace(/u/g, "\\u");
var byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+';
exports.KANJI = new RegExp(kanji, 'g');
exports.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g');
exports.BYTE = new RegExp(byte, 'g');
exports.NUMERIC = new RegExp(numeric, 'g');
exports.ALPHANUMERIC = new RegExp(alphanumeric, 'g');
var TEST_KANJI = new RegExp('^' + kanji + '$');
var TEST_NUMERIC = new RegExp('^' + numeric + '$');
var TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$');

exports.testKanji = function testKanji(str) {
  return TEST_KANJI.test(str);
};

exports.testNumeric = function testNumeric(str) {
  return TEST_NUMERIC.test(str);
};

exports.testAlphanumeric = function testAlphanumeric(str) {
  return TEST_ALPHANUMERIC.test(str);
};

/***/ }),

/***/ 624:
/***/ (function(module, exports) {

function hex2rgba(hex) {
  if (typeof hex === 'number') {
    hex = hex.toString();
  }

  if (typeof hex !== 'string') {
    throw new Error('Color should be defined as hex string');
  }

  var hexCode = hex.slice().replace('#', '').split('');

  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
    throw new Error('Invalid hex color: ' + hex);
  } // Convert from short to long form (fff -> ffffff)


  if (hexCode.length === 3 || hexCode.length === 4) {
    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
      return [c, c];
    }));
  } // Add default alpha value


  if (hexCode.length === 6) hexCode.push('F', 'F');
  var hexValue = parseInt(hexCode.join(''), 16);
  return {
    r: hexValue >> 24 & 255,
    g: hexValue >> 16 & 255,
    b: hexValue >> 8 & 255,
    a: hexValue & 255,
    hex: '#' + hexCode.slice(0, 6).join('')
  };
}

exports.getOptions = function getOptions(options) {
  if (!options) options = {};
  if (!options.color) options.color = {};
  var margin = typeof options.margin === 'undefined' || options.margin === null || options.margin < 0 ? 4 : options.margin;
  var width = options.width && options.width >= 21 ? options.width : undefined;
  var scale = options.scale || 4;
  return {
    width: width,
    scale: width ? 4 : scale,
    margin: margin,
    color: {
      dark: hex2rgba(options.color.dark || '#000000ff'),
      light: hex2rgba(options.color.light || '#ffffffff')
    },
    type: options.type,
    rendererOpts: options.rendererOpts || {}
  };
};

exports.getScale = function getScale(qrSize, opts) {
  return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
};

exports.getImageWidth = function getImageWidth(qrSize, opts) {
  var scale = exports.getScale(qrSize, opts);
  return Math.floor((qrSize + opts.margin * 2) * scale);
};

exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
  var size = qr.modules.size;
  var data = qr.modules.data;
  var scale = exports.getScale(size, opts);
  var symbolSize = Math.floor((size + opts.margin * 2) * scale);
  var scaledMargin = opts.margin * scale;
  var palette = [opts.color.light, opts.color.dark];

  for (var i = 0; i < symbolSize; i++) {
    for (var j = 0; j < symbolSize; j++) {
      var posDst = (i * symbolSize + j) * 4;
      var pxColor = opts.color.light;

      if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
        var iSrc = Math.floor((i - scaledMargin) / scale);
        var jSrc = Math.floor((j - scaledMargin) / scale);
        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
      }

      imgData[posDst++] = pxColor.r;
      imgData[posDst++] = pxColor.g;
      imgData[posDst++] = pxColor.b;
      imgData[posDst] = pxColor.a;
    }
  }
};

/***/ }),

/***/ 625:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty,
    prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */

function Events() {} //
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//


if (Object.create) {
  Events.prototype = Object.create(null); //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //

  if (!new Events().__proto__) prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */


function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */


function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once),
      evt = prefix ? prefix + event : event;
  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];
  return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */


function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */


function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */


EventEmitter.prototype.eventNames = function eventNames() {
  var names = [],
      events,
      name;
  if (this._eventsCount === 0) return names;

  for (name in events = this._events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */


EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event,
      handlers = this._events[evt];
  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */


EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event,
      listeners = this._events[evt];
  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */


EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return false;
  var listeners = this._events[evt],
      len = arguments.length,
      args,
      i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1:
        return listeners.fn.call(listeners.context), true;

      case 2:
        return listeners.fn.call(listeners.context, a1), true;

      case 3:
        return listeners.fn.call(listeners.context, a1, a2), true;

      case 4:
        return listeners.fn.call(listeners.context, a1, a2, a3), true;

      case 5:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;

      case 6:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len - 1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length,
        j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1:
          listeners[i].fn.call(listeners[i].context);
          break;

        case 2:
          listeners[i].fn.call(listeners[i].context, a1);
          break;

        case 3:
          listeners[i].fn.call(listeners[i].context, a1, a2);
          break;

        case 4:
          listeners[i].fn.call(listeners[i].context, a1, a2, a3);
          break;

        default:
          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
            args[j - 1] = arguments[j];
          }
          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return this;

  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
        events.push(listeners[i]);
      }
    } //
    // Reset the array, or remove it completely if we have no more listeners.
    //


    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
  }

  return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
}; //
// Alias methods names because people roll like that.
//


EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on; //
// Expose the prefix.
//

EventEmitter.prefixed = prefix; //
// Allow `EventEmitter` to be imported as module namespace.
//

EventEmitter.EventEmitter = EventEmitter; //
// Expose the module.
//

if (true) {
  module.exports = EventEmitter;
}

/***/ }),

/***/ 626:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBrowserCryptoAvailable = exports.getSubtleCrypto = exports.getBrowerCrypto = void 0;

function getBrowerCrypto() {
  return (global === null || global === void 0 ? void 0 : global.crypto) || (global === null || global === void 0 ? void 0 : global.msCrypto) || {};
}

exports.getBrowerCrypto = getBrowerCrypto;

function getSubtleCrypto() {
  var browserCrypto = getBrowerCrypto();
  return browserCrypto.subtle || browserCrypto.webkitSubtle;
}

exports.getSubtleCrypto = getSubtleCrypto;

function isBrowserCryptoAvailable() {
  return !!getBrowerCrypto() && !!getSubtleCrypto();
}

exports.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(21)))

/***/ }),

/***/ 627:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBrowser = exports.isNode = exports.isReactNative = void 0;

function isReactNative() {
  return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
}

exports.isReactNative = isReactNative;

function isNode() {
  return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
}

exports.isNode = isNode;

function isBrowser() {
  return !isReactNative() && !isNode();
}

exports.isBrowser = isBrowser;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(19)))

/***/ }),

/***/ 628:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWindowMetadata = void 0;

var window_getters_1 = __webpack_require__(611);

function getWindowMetadata() {
  var doc;
  var loc;

  try {
    doc = window_getters_1.getDocumentOrThrow();
    loc = window_getters_1.getLocationOrThrow();
  } catch (e) {
    return null;
  }

  function getIcons() {
    var links = doc.getElementsByTagName("link");
    var icons = [];

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var rel = link.getAttribute("rel");

      if (rel) {
        if (rel.toLowerCase().indexOf("icon") > -1) {
          var href = link.getAttribute("href");

          if (href) {
            if (href.toLowerCase().indexOf("https:") === -1 && href.toLowerCase().indexOf("http:") === -1 && href.indexOf("//") !== 0) {
              var absoluteHref = loc.protocol + "//" + loc.host;

              if (href.indexOf("/") === 0) {
                absoluteHref += href;
              } else {
                var path = loc.pathname.split("/");
                path.pop();
                var finalPath = path.join("/");
                absoluteHref += finalPath + "/" + href;
              }

              icons.push(absoluteHref);
            } else if (href.indexOf("//") === 0) {
              var absoluteUrl = loc.protocol + href;
              icons.push(absoluteUrl);
            } else {
              icons.push(href);
            }
          }
        }
      }
    }

    return icons;
  }

  function getWindowMetadataOfAny() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var metaTags = doc.getElementsByTagName("meta");

    var _loop = function _loop(i) {
      var tag = metaTags[i];
      var attributes = ["itemprop", "property", "name"].map(function (target) {
        return tag.getAttribute(target);
      }).filter(function (attr) {
        if (attr) {
          return args.includes(attr);
        }

        return false;
      });

      if (attributes.length && attributes) {
        var content = tag.getAttribute("content");

        if (content) {
          return {
            v: content
          };
        }
      }
    };

    for (var i = 0; i < metaTags.length; i++) {
      var _ret = _loop(i);

      if (typeof _ret === "object") return _ret.v;
    }

    return "";
  }

  function getName() {
    var name = getWindowMetadataOfAny("name", "og:site_name", "og:title", "twitter:title");

    if (!name) {
      name = doc.title;
    }

    return name;
  }

  function getDescription() {
    var description = getWindowMetadataOfAny("description", "og:description", "twitter:description", "keywords");
    return description;
  }

  var name = getName();
  var description = getDescription();
  var url = loc.origin;
  var icons = getIcons();
  var meta = {
    description: description,
    url: url,
    icons: icons,
    name: name
  };
  return meta;
}

exports.getWindowMetadata = getWindowMetadata;

/***/ }),

/***/ 629:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export BrowserInfo */
/* unused harmony export NodeInfo */
/* unused harmony export SearchBotDeviceInfo */
/* unused harmony export BotInfo */
/* unused harmony export ReactNativeInfo */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detect; });
/* unused harmony export browserName */
/* unused harmony export parseUserAgent */
/* unused harmony export detectOS */
/* unused harmony export getNodeVersion */
var __spreadArrays = undefined && undefined.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var BrowserInfo =
/** @class */
function () {
  function BrowserInfo(name, version, os) {
    this.name = name;
    this.version = version;
    this.os = os;
    this.type = 'browser';
  }

  return BrowserInfo;
}();



var NodeInfo =
/** @class */
function () {
  function NodeInfo(version) {
    this.version = version;
    this.type = 'node';
    this.name = 'node';
    this.os = process.platform;
  }

  return NodeInfo;
}();



var SearchBotDeviceInfo =
/** @class */
function () {
  function SearchBotDeviceInfo(name, version, os, bot) {
    this.name = name;
    this.version = version;
    this.os = os;
    this.bot = bot;
    this.type = 'bot-device';
  }

  return SearchBotDeviceInfo;
}();



var BotInfo =
/** @class */
function () {
  function BotInfo() {
    this.type = 'bot';
    this.bot = true; // NOTE: deprecated test name instead

    this.name = 'bot';
    this.version = null;
    this.os = null;
  }

  return BotInfo;
}();



var ReactNativeInfo =
/** @class */
function () {
  function ReactNativeInfo() {
    this.type = 'react-native';
    this.name = 'react-native';
    this.version = null;
    this.os = null;
  }

  return ReactNativeInfo;
}();

 // tslint:disable-next-line:max-line-length

var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [['aol', /AOLShield\/([0-9\._]+)/], ['edge', /Edge\/([0-9\._]+)/], ['edge-ios', /EdgiOS\/([0-9\._]+)/], ['yandexbrowser', /YaBrowser\/([0-9\._]+)/], ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/], ['samsung', /SamsungBrowser\/([0-9\.]+)/], ['silk', /\bSilk\/([0-9._-]+)\b/], ['miui', /MiuiBrowser\/([0-9\.]+)$/], ['beaker', /BeakerBrowser\/([0-9\.]+)/], ['edge-chromium', /EdgA?\/([0-9\.]+)/], ['chromium-webview', /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/], ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/], ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/], ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/], ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/], ['fxios', /FxiOS\/([0-9\.]+)/], ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/], ['opera', /Opera\/([0-9\.]+)(?:\s|$)/], ['opera', /OPR\/([0-9\.]+)(:?\s|$)/], ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/], ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/], ['ie', /MSIE\s(7\.0)/], ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/], ['android', /Android\s([0-9\.]+)/], ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/], ['safari', /Version\/([0-9\._]+).*Safari/], ['facebook', /FBAV\/([0-9\.]+)/], ['instagram', /Instagram\s([0-9\.]+)/], ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/], ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/], ['searchbot', SEARCHBOX_UA_REGEX]];
var operatingSystemRules = [['iOS', /iP(hone|od|ad)/], ['Android OS', /Android/], ['BlackBerry OS', /BlackBerry|BB10/], ['Windows Mobile', /IEMobile/], ['Amazon OS', /Kindle/], ['Windows 3.11', /Win16/], ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/], ['Windows 98', /(Windows 98)|(Win98)/], ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/], ['Windows XP', /(Windows NT 5.1)|(Windows XP)/], ['Windows Server 2003', /(Windows NT 5.2)/], ['Windows Vista', /(Windows NT 6.0)/], ['Windows 7', /(Windows NT 6.1)/], ['Windows 8', /(Windows NT 6.2)/], ['Windows 8.1', /(Windows NT 6.3)/], ['Windows 10', /(Windows NT 10.0)/], ['Windows ME', /Windows ME/], ['Open BSD', /OpenBSD/], ['Sun OS', /SunOS/], ['Chrome OS', /CrOS/], ['Linux', /(Linux)|(X11)/], ['Mac OS', /(Mac_PowerPC)|(Macintosh)/], ['QNX', /QNX/], ['BeOS', /BeOS/], ['OS/2', /OS\/2/]];
function detect(userAgent) {
  if (!!userAgent) {
    return parseUserAgent(userAgent);
  }

  if (typeof document === 'undefined' && typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return new ReactNativeInfo();
  }

  if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }

  return getNodeVersion();
}

function matchUserAgent(ua) {
  // opted for using reduce here rather than Array#first with a regex.test call
  // this is primarily because using the reduce we only perform the regex
  // execution once rather than once for the test and for the exec again below
  // probably something that needs to be benchmarked though
  return ua !== '' && userAgentRules.reduce(function (matched, _a) {
    var browser = _a[0],
        regex = _a[1];

    if (matched) {
      return matched;
    }

    var uaMatch = regex.exec(ua);
    return !!uaMatch && [browser, uaMatch];
  }, false);
}

function browserName(ua) {
  var data = matchUserAgent(ua);
  return data ? data[0] : null;
}
function parseUserAgent(ua) {
  var matchedRule = matchUserAgent(ua);

  if (!matchedRule) {
    return null;
  }

  var name = matchedRule[0],
      match = matchedRule[1];

  if (name === 'searchbot') {
    return new BotInfo();
  }

  var versionParts = match[1] && match[1].split(/[._]/).slice(0, 3);

  if (versionParts) {
    if (versionParts.length < REQUIRED_VERSION_PARTS) {
      versionParts = __spreadArrays(versionParts, createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length));
    }
  } else {
    versionParts = [];
  }

  var version = versionParts.join('.');
  var os = detectOS(ua);
  var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);

  if (searchBotMatch && searchBotMatch[1]) {
    return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
  }

  return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
  for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
    var _a = operatingSystemRules[ii],
        os = _a[0],
        regex = _a[1];
    var match = regex.exec(ua);

    if (match) {
      return os;
    }
  }

  return null;
}
function getNodeVersion() {
  var isNode = typeof process !== 'undefined' && process.version;
  return isNode ? new NodeInfo(process.version.slice(1)) : null;
}

function createVersionParts(count) {
  var output = [];

  for (var ii = 0; ii < count; ii++) {
    output.push('0');
  }

  return output;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(19)))

/***/ }),

/***/ 630:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function (module, exports) {
  'use strict'; // Utils

  function assert(val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  } // Could use `inherits` module, but don't want to move from single file
  // architecture yet.


  function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;

    var TempCtor = function TempCtor() {};

    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  } // BN


  function BN(number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0; // Reduction context

    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }

  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;
  var Buffer;

  try {
    Buffer = __webpack_require__(631).Buffer;
  } catch (e) {}

  BN.isBN = function isBN(num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max(left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min(left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init(number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }

    assert(base === (base | 0) && base >= 2 && base <= 36);
    number = number.toString().replace(/\s+/g, '');
    var start = 0;

    if (number[0] === '-') {
      start++;
    }

    if (base === 16) {
      this._parseHex(number, start);
    } else {
      this._parseBase(number, base, start);
    }

    if (number[0] === '-') {
      this.negative = 1;
    }

    this.strip();
    if (endian !== 'le') return;

    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initNumber = function _initNumber(number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }

    if (number < 0x4000000) {
      this.words = [number & 0x3ffffff];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [number & 0x3ffffff, number / 0x4000000 & 0x3ffffff];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)

      this.words = [number & 0x3ffffff, number / 0x4000000 & 0x3ffffff, 1];
      this.length = 3;
    }

    if (endian !== 'le') return; // Reverse the bytes

    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray(number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');

    if (number.length <= 0) {
      this.words = [0];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;

    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
        this.words[j] |= w << off & 0x3ffffff;
        this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
        off += 24;

        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
        this.words[j] |= w << off & 0x3ffffff;
        this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
        off += 24;

        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }

    return this.strip();
  };

  function parseHex(str, start, end) {
    var r = 0;
    var len = Math.min(str.length, end);

    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;
      r <<= 4; // 'a' - 'f'

      if (c >= 49 && c <= 54) {
        r |= c - 49 + 0xa; // 'A' - 'F'
      } else if (c >= 17 && c <= 22) {
        r |= c - 17 + 0xa; // '0' - '9'
      } else {
        r |= c & 0xf;
      }
    }

    return r;
  }

  BN.prototype._parseHex = function _parseHex(number, start) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w; // Scan 24-bit chunks and add them to the number

    var off = 0;

    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
      w = parseHex(number, i, i + 6);
      this.words[j] |= w << off & 0x3ffffff; // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb

      this.words[j + 1] |= w >>> 26 - off & 0x3fffff;
      off += 24;

      if (off >= 26) {
        off -= 26;
        j++;
      }
    }

    if (i + 6 !== start) {
      w = parseHex(number, start, i + 6);
      this.words[j] |= w << off & 0x3ffffff;
      this.words[j + 1] |= w >>> 26 - off & 0x3fffff;
    }

    this.strip();
  };

  function parseBase(str, start, end, mul) {
    var r = 0;
    var len = Math.min(str.length, end);

    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;
      r *= mul; // 'a'

      if (c >= 49) {
        r += c - 49 + 0xa; // 'A'
      } else if (c >= 17) {
        r += c - 17 + 0xa; // '0' - '9'
      } else {
        r += c;
      }
    }

    return r;
  }

  BN.prototype._parseBase = function _parseBase(number, base, start) {
    // Initialize as zero
    this.words = [0];
    this.length = 1; // Find length of limb in base

    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }

    limbLen--;
    limbPow = limbPow / base | 0;
    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;
    var word = 0;

    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);
      this.imuln(limbPow);

      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);

      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }
  };

  BN.prototype.copy = function copy(dest) {
    dest.words = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }

    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype.clone = function clone() {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand(size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }

    return this;
  }; // Remove leading `0` from `this`


  BN.prototype.strip = function strip() {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }

    return this._normSign();
  };

  BN.prototype._normSign = function _normSign() {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }

    return this;
  };

  BN.prototype.inspect = function inspect() {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  };
  /*
   var zeros = [];
  var groupSizes = [];
  var groupBases = [];
   var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }
   */


  var zeros = ['', '0', '00', '000', '0000', '00000', '000000', '0000000', '00000000', '000000000', '0000000000', '00000000000', '000000000000', '0000000000000', '00000000000000', '000000000000000', '0000000000000000', '00000000000000000', '000000000000000000', '0000000000000000000', '00000000000000000000', '000000000000000000000', '0000000000000000000000', '00000000000000000000000', '000000000000000000000000', '0000000000000000000000000'];
  var groupSizes = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
  var groupBases = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

  BN.prototype.toString = function toString(base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;
    var out;

    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;

      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = ((w << off | carry) & 0xffffff).toString(16);
        carry = w >>> 24 - off & 0xffffff;

        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }

        off += 2;

        if (off >= 26) {
          off -= 26;
          i--;
        }
      }

      if (carry !== 0) {
        out = carry.toString(16) + out;
      }

      while (out.length % padding !== 0) {
        out = '0' + out;
      }

      if (this.negative !== 0) {
        out = '-' + out;
      }

      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base]; // var groupBase = Math.pow(base, groupSize);

      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;

      while (!c.isZero()) {
        var r = c.modn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }

      if (this.isZero()) {
        out = '0' + out;
      }

      while (out.length % padding !== 0) {
        out = '0' + out;
      }

      if (this.negative !== 0) {
        out = '-' + out;
      }

      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber() {
    var ret = this.words[0];

    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + this.words[1] * 0x4000000;
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }

    return this.negative !== 0 ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON() {
    return this.toString(16);
  };

  BN.prototype.toBuffer = function toBuffer(endian, length) {
    assert(typeof Buffer !== 'undefined');
    return this.toArrayLike(Buffer, endian, length);
  };

  BN.prototype.toArray = function toArray(endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');
    this.strip();
    var littleEndian = endian === 'le';
    var res = new ArrayType(reqLength);
    var b, i;
    var q = this.clone();

    if (!littleEndian) {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        res[i] = 0;
      }

      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);
        res[reqLength - i - 1] = b;
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);
        res[i] = b;
      }

      for (; i < reqLength; i++) {
        res[i] = 0;
      }
    }

    return res;
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits(w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits(w) {
      var t = w;
      var r = 0;

      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }

      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }

      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }

      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }

      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits(w) {
    // Short-cut
    if (w === 0) return 26;
    var t = w;
    var r = 0;

    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }

    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }

    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }

    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }

    if ((t & 0x1) === 0) {
      r++;
    }

    return r;
  }; // Return number of used bits in a BN


  BN.prototype.bitLength = function bitLength() {
    var w = this.words[this.length - 1];

    var hi = this._countBits(w);

    return (this.length - 1) * 26 + hi;
  };

  function toBitArray(num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = bit / 26 | 0;
      var wbit = bit % 26;
      w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
    }

    return w;
  } // Number of trailing zero bits


  BN.prototype.zeroBits = function zeroBits() {
    if (this.isZero()) return 0;
    var r = 0;

    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);

      r += b;
      if (b !== 26) break;
    }

    return r;
  };

  BN.prototype.byteLength = function byteLength() {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos(width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }

    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos(width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }

    return this.clone();
  };

  BN.prototype.isNeg = function isNeg() {
    return this.negative !== 0;
  }; // Return negative clone of `this`


  BN.prototype.neg = function neg() {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg() {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  }; // Or `num` with `this` in-place


  BN.prototype.iuor = function iuor(num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this.strip();
  };

  BN.prototype.ior = function ior(num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  }; // Or `num` with `this`


  BN.prototype.or = function or(num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor(num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  }; // And `num` with `this` in-place


  BN.prototype.iuand = function iuand(num) {
    // b = min-length(num, this)
    var b;

    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;
    return this.strip();
  };

  BN.prototype.iand = function iand(num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  }; // And `num` with `this`


  BN.prototype.and = function and(num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand(num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  }; // Xor `num` with `this` in-place


  BN.prototype.iuxor = function iuxor(num) {
    // a.length > b.length
    var a;
    var b;

    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;
    return this.strip();
  };

  BN.prototype.ixor = function ixor(num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  }; // Xor `num` with `this`


  BN.prototype.xor = function xor(num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor(num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  }; // Not ``this`` with ``width`` bitwidth


  BN.prototype.inotn = function inotn(width) {
    assert(typeof width === 'number' && width >= 0);
    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26; // Extend the buffer with leading zeroes

    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    } // Handle complete words


    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    } // Handle the residue


    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & 0x3ffffff >> 26 - bitsLeft;
    } // And remove leading zeroes


    return this.strip();
  };

  BN.prototype.notn = function notn(width) {
    return this.clone().inotn(width);
  }; // Set `bit` of `this`


  BN.prototype.setn = function setn(bit, val) {
    assert(typeof bit === 'number' && bit >= 0);
    var off = bit / 26 | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | 1 << wbit;
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this.strip();
  }; // Add `num` to `this` in-place


  BN.prototype.iadd = function iadd(num) {
    var r; // negative + positive

    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign(); // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    } // a.length > b.length


    var a, b;

    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;

    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;

    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++; // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  }; // Add `num` to `this`


  BN.prototype.add = function add(num) {
    var res;

    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);
    return num.clone().iadd(this);
  }; // Subtract `num` from `this` in-place


  BN.prototype.isub = function isub(num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign(); // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    } // At this point both numbers are positive


    var cmp = this.cmp(num); // Optimization - zeroify

    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    } // a > b


    var a, b;

    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;

    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    } // Copy rest of the words


    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this.strip();
  }; // Subtract `num` from `this`


  BN.prototype.sub = function sub(num) {
    return this.clone().isub(num);
  };

  function smallMulTo(self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = self.length + num.length | 0;
    out.length = len;
    len = len - 1 | 0; // Peel one iteration (compiler can't do it, because of code complexity)

    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;
    var lo = r & 0x3ffffff;
    var carry = r / 0x4000000 | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);

      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += r / 0x4000000 | 0;
        rword = r & 0x3ffffff;
      }

      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }

    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out.strip();
  } // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).


  var comb10MulTo = function comb10MulTo(self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;
    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */

    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = mid + Math.imul(ah0, bl0) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */

    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = mid + Math.imul(ah1, bl0) | 0;
    hi = Math.imul(ah1, bh0);
    lo = lo + Math.imul(al0, bl1) | 0;
    mid = mid + Math.imul(al0, bh1) | 0;
    mid = mid + Math.imul(ah0, bl1) | 0;
    hi = hi + Math.imul(ah0, bh1) | 0;
    var w1 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */

    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = mid + Math.imul(ah2, bl0) | 0;
    hi = Math.imul(ah2, bh0);
    lo = lo + Math.imul(al1, bl1) | 0;
    mid = mid + Math.imul(al1, bh1) | 0;
    mid = mid + Math.imul(ah1, bl1) | 0;
    hi = hi + Math.imul(ah1, bh1) | 0;
    lo = lo + Math.imul(al0, bl2) | 0;
    mid = mid + Math.imul(al0, bh2) | 0;
    mid = mid + Math.imul(ah0, bl2) | 0;
    hi = hi + Math.imul(ah0, bh2) | 0;
    var w2 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */

    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = mid + Math.imul(ah3, bl0) | 0;
    hi = Math.imul(ah3, bh0);
    lo = lo + Math.imul(al2, bl1) | 0;
    mid = mid + Math.imul(al2, bh1) | 0;
    mid = mid + Math.imul(ah2, bl1) | 0;
    hi = hi + Math.imul(ah2, bh1) | 0;
    lo = lo + Math.imul(al1, bl2) | 0;
    mid = mid + Math.imul(al1, bh2) | 0;
    mid = mid + Math.imul(ah1, bl2) | 0;
    hi = hi + Math.imul(ah1, bh2) | 0;
    lo = lo + Math.imul(al0, bl3) | 0;
    mid = mid + Math.imul(al0, bh3) | 0;
    mid = mid + Math.imul(ah0, bl3) | 0;
    hi = hi + Math.imul(ah0, bh3) | 0;
    var w3 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */

    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = mid + Math.imul(ah4, bl0) | 0;
    hi = Math.imul(ah4, bh0);
    lo = lo + Math.imul(al3, bl1) | 0;
    mid = mid + Math.imul(al3, bh1) | 0;
    mid = mid + Math.imul(ah3, bl1) | 0;
    hi = hi + Math.imul(ah3, bh1) | 0;
    lo = lo + Math.imul(al2, bl2) | 0;
    mid = mid + Math.imul(al2, bh2) | 0;
    mid = mid + Math.imul(ah2, bl2) | 0;
    hi = hi + Math.imul(ah2, bh2) | 0;
    lo = lo + Math.imul(al1, bl3) | 0;
    mid = mid + Math.imul(al1, bh3) | 0;
    mid = mid + Math.imul(ah1, bl3) | 0;
    hi = hi + Math.imul(ah1, bh3) | 0;
    lo = lo + Math.imul(al0, bl4) | 0;
    mid = mid + Math.imul(al0, bh4) | 0;
    mid = mid + Math.imul(ah0, bl4) | 0;
    hi = hi + Math.imul(ah0, bh4) | 0;
    var w4 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */

    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = mid + Math.imul(ah5, bl0) | 0;
    hi = Math.imul(ah5, bh0);
    lo = lo + Math.imul(al4, bl1) | 0;
    mid = mid + Math.imul(al4, bh1) | 0;
    mid = mid + Math.imul(ah4, bl1) | 0;
    hi = hi + Math.imul(ah4, bh1) | 0;
    lo = lo + Math.imul(al3, bl2) | 0;
    mid = mid + Math.imul(al3, bh2) | 0;
    mid = mid + Math.imul(ah3, bl2) | 0;
    hi = hi + Math.imul(ah3, bh2) | 0;
    lo = lo + Math.imul(al2, bl3) | 0;
    mid = mid + Math.imul(al2, bh3) | 0;
    mid = mid + Math.imul(ah2, bl3) | 0;
    hi = hi + Math.imul(ah2, bh3) | 0;
    lo = lo + Math.imul(al1, bl4) | 0;
    mid = mid + Math.imul(al1, bh4) | 0;
    mid = mid + Math.imul(ah1, bl4) | 0;
    hi = hi + Math.imul(ah1, bh4) | 0;
    lo = lo + Math.imul(al0, bl5) | 0;
    mid = mid + Math.imul(al0, bh5) | 0;
    mid = mid + Math.imul(ah0, bl5) | 0;
    hi = hi + Math.imul(ah0, bh5) | 0;
    var w5 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */

    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = mid + Math.imul(ah6, bl0) | 0;
    hi = Math.imul(ah6, bh0);
    lo = lo + Math.imul(al5, bl1) | 0;
    mid = mid + Math.imul(al5, bh1) | 0;
    mid = mid + Math.imul(ah5, bl1) | 0;
    hi = hi + Math.imul(ah5, bh1) | 0;
    lo = lo + Math.imul(al4, bl2) | 0;
    mid = mid + Math.imul(al4, bh2) | 0;
    mid = mid + Math.imul(ah4, bl2) | 0;
    hi = hi + Math.imul(ah4, bh2) | 0;
    lo = lo + Math.imul(al3, bl3) | 0;
    mid = mid + Math.imul(al3, bh3) | 0;
    mid = mid + Math.imul(ah3, bl3) | 0;
    hi = hi + Math.imul(ah3, bh3) | 0;
    lo = lo + Math.imul(al2, bl4) | 0;
    mid = mid + Math.imul(al2, bh4) | 0;
    mid = mid + Math.imul(ah2, bl4) | 0;
    hi = hi + Math.imul(ah2, bh4) | 0;
    lo = lo + Math.imul(al1, bl5) | 0;
    mid = mid + Math.imul(al1, bh5) | 0;
    mid = mid + Math.imul(ah1, bl5) | 0;
    hi = hi + Math.imul(ah1, bh5) | 0;
    lo = lo + Math.imul(al0, bl6) | 0;
    mid = mid + Math.imul(al0, bh6) | 0;
    mid = mid + Math.imul(ah0, bl6) | 0;
    hi = hi + Math.imul(ah0, bh6) | 0;
    var w6 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */

    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = mid + Math.imul(ah7, bl0) | 0;
    hi = Math.imul(ah7, bh0);
    lo = lo + Math.imul(al6, bl1) | 0;
    mid = mid + Math.imul(al6, bh1) | 0;
    mid = mid + Math.imul(ah6, bl1) | 0;
    hi = hi + Math.imul(ah6, bh1) | 0;
    lo = lo + Math.imul(al5, bl2) | 0;
    mid = mid + Math.imul(al5, bh2) | 0;
    mid = mid + Math.imul(ah5, bl2) | 0;
    hi = hi + Math.imul(ah5, bh2) | 0;
    lo = lo + Math.imul(al4, bl3) | 0;
    mid = mid + Math.imul(al4, bh3) | 0;
    mid = mid + Math.imul(ah4, bl3) | 0;
    hi = hi + Math.imul(ah4, bh3) | 0;
    lo = lo + Math.imul(al3, bl4) | 0;
    mid = mid + Math.imul(al3, bh4) | 0;
    mid = mid + Math.imul(ah3, bl4) | 0;
    hi = hi + Math.imul(ah3, bh4) | 0;
    lo = lo + Math.imul(al2, bl5) | 0;
    mid = mid + Math.imul(al2, bh5) | 0;
    mid = mid + Math.imul(ah2, bl5) | 0;
    hi = hi + Math.imul(ah2, bh5) | 0;
    lo = lo + Math.imul(al1, bl6) | 0;
    mid = mid + Math.imul(al1, bh6) | 0;
    mid = mid + Math.imul(ah1, bl6) | 0;
    hi = hi + Math.imul(ah1, bh6) | 0;
    lo = lo + Math.imul(al0, bl7) | 0;
    mid = mid + Math.imul(al0, bh7) | 0;
    mid = mid + Math.imul(ah0, bl7) | 0;
    hi = hi + Math.imul(ah0, bh7) | 0;
    var w7 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */

    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = mid + Math.imul(ah8, bl0) | 0;
    hi = Math.imul(ah8, bh0);
    lo = lo + Math.imul(al7, bl1) | 0;
    mid = mid + Math.imul(al7, bh1) | 0;
    mid = mid + Math.imul(ah7, bl1) | 0;
    hi = hi + Math.imul(ah7, bh1) | 0;
    lo = lo + Math.imul(al6, bl2) | 0;
    mid = mid + Math.imul(al6, bh2) | 0;
    mid = mid + Math.imul(ah6, bl2) | 0;
    hi = hi + Math.imul(ah6, bh2) | 0;
    lo = lo + Math.imul(al5, bl3) | 0;
    mid = mid + Math.imul(al5, bh3) | 0;
    mid = mid + Math.imul(ah5, bl3) | 0;
    hi = hi + Math.imul(ah5, bh3) | 0;
    lo = lo + Math.imul(al4, bl4) | 0;
    mid = mid + Math.imul(al4, bh4) | 0;
    mid = mid + Math.imul(ah4, bl4) | 0;
    hi = hi + Math.imul(ah4, bh4) | 0;
    lo = lo + Math.imul(al3, bl5) | 0;
    mid = mid + Math.imul(al3, bh5) | 0;
    mid = mid + Math.imul(ah3, bl5) | 0;
    hi = hi + Math.imul(ah3, bh5) | 0;
    lo = lo + Math.imul(al2, bl6) | 0;
    mid = mid + Math.imul(al2, bh6) | 0;
    mid = mid + Math.imul(ah2, bl6) | 0;
    hi = hi + Math.imul(ah2, bh6) | 0;
    lo = lo + Math.imul(al1, bl7) | 0;
    mid = mid + Math.imul(al1, bh7) | 0;
    mid = mid + Math.imul(ah1, bl7) | 0;
    hi = hi + Math.imul(ah1, bh7) | 0;
    lo = lo + Math.imul(al0, bl8) | 0;
    mid = mid + Math.imul(al0, bh8) | 0;
    mid = mid + Math.imul(ah0, bl8) | 0;
    hi = hi + Math.imul(ah0, bh8) | 0;
    var w8 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */

    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = mid + Math.imul(ah9, bl0) | 0;
    hi = Math.imul(ah9, bh0);
    lo = lo + Math.imul(al8, bl1) | 0;
    mid = mid + Math.imul(al8, bh1) | 0;
    mid = mid + Math.imul(ah8, bl1) | 0;
    hi = hi + Math.imul(ah8, bh1) | 0;
    lo = lo + Math.imul(al7, bl2) | 0;
    mid = mid + Math.imul(al7, bh2) | 0;
    mid = mid + Math.imul(ah7, bl2) | 0;
    hi = hi + Math.imul(ah7, bh2) | 0;
    lo = lo + Math.imul(al6, bl3) | 0;
    mid = mid + Math.imul(al6, bh3) | 0;
    mid = mid + Math.imul(ah6, bl3) | 0;
    hi = hi + Math.imul(ah6, bh3) | 0;
    lo = lo + Math.imul(al5, bl4) | 0;
    mid = mid + Math.imul(al5, bh4) | 0;
    mid = mid + Math.imul(ah5, bl4) | 0;
    hi = hi + Math.imul(ah5, bh4) | 0;
    lo = lo + Math.imul(al4, bl5) | 0;
    mid = mid + Math.imul(al4, bh5) | 0;
    mid = mid + Math.imul(ah4, bl5) | 0;
    hi = hi + Math.imul(ah4, bh5) | 0;
    lo = lo + Math.imul(al3, bl6) | 0;
    mid = mid + Math.imul(al3, bh6) | 0;
    mid = mid + Math.imul(ah3, bl6) | 0;
    hi = hi + Math.imul(ah3, bh6) | 0;
    lo = lo + Math.imul(al2, bl7) | 0;
    mid = mid + Math.imul(al2, bh7) | 0;
    mid = mid + Math.imul(ah2, bl7) | 0;
    hi = hi + Math.imul(ah2, bh7) | 0;
    lo = lo + Math.imul(al1, bl8) | 0;
    mid = mid + Math.imul(al1, bh8) | 0;
    mid = mid + Math.imul(ah1, bl8) | 0;
    hi = hi + Math.imul(ah1, bh8) | 0;
    lo = lo + Math.imul(al0, bl9) | 0;
    mid = mid + Math.imul(al0, bh9) | 0;
    mid = mid + Math.imul(ah0, bl9) | 0;
    hi = hi + Math.imul(ah0, bh9) | 0;
    var w9 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */

    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = mid + Math.imul(ah9, bl1) | 0;
    hi = Math.imul(ah9, bh1);
    lo = lo + Math.imul(al8, bl2) | 0;
    mid = mid + Math.imul(al8, bh2) | 0;
    mid = mid + Math.imul(ah8, bl2) | 0;
    hi = hi + Math.imul(ah8, bh2) | 0;
    lo = lo + Math.imul(al7, bl3) | 0;
    mid = mid + Math.imul(al7, bh3) | 0;
    mid = mid + Math.imul(ah7, bl3) | 0;
    hi = hi + Math.imul(ah7, bh3) | 0;
    lo = lo + Math.imul(al6, bl4) | 0;
    mid = mid + Math.imul(al6, bh4) | 0;
    mid = mid + Math.imul(ah6, bl4) | 0;
    hi = hi + Math.imul(ah6, bh4) | 0;
    lo = lo + Math.imul(al5, bl5) | 0;
    mid = mid + Math.imul(al5, bh5) | 0;
    mid = mid + Math.imul(ah5, bl5) | 0;
    hi = hi + Math.imul(ah5, bh5) | 0;
    lo = lo + Math.imul(al4, bl6) | 0;
    mid = mid + Math.imul(al4, bh6) | 0;
    mid = mid + Math.imul(ah4, bl6) | 0;
    hi = hi + Math.imul(ah4, bh6) | 0;
    lo = lo + Math.imul(al3, bl7) | 0;
    mid = mid + Math.imul(al3, bh7) | 0;
    mid = mid + Math.imul(ah3, bl7) | 0;
    hi = hi + Math.imul(ah3, bh7) | 0;
    lo = lo + Math.imul(al2, bl8) | 0;
    mid = mid + Math.imul(al2, bh8) | 0;
    mid = mid + Math.imul(ah2, bl8) | 0;
    hi = hi + Math.imul(ah2, bh8) | 0;
    lo = lo + Math.imul(al1, bl9) | 0;
    mid = mid + Math.imul(al1, bh9) | 0;
    mid = mid + Math.imul(ah1, bl9) | 0;
    hi = hi + Math.imul(ah1, bh9) | 0;
    var w10 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */

    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = mid + Math.imul(ah9, bl2) | 0;
    hi = Math.imul(ah9, bh2);
    lo = lo + Math.imul(al8, bl3) | 0;
    mid = mid + Math.imul(al8, bh3) | 0;
    mid = mid + Math.imul(ah8, bl3) | 0;
    hi = hi + Math.imul(ah8, bh3) | 0;
    lo = lo + Math.imul(al7, bl4) | 0;
    mid = mid + Math.imul(al7, bh4) | 0;
    mid = mid + Math.imul(ah7, bl4) | 0;
    hi = hi + Math.imul(ah7, bh4) | 0;
    lo = lo + Math.imul(al6, bl5) | 0;
    mid = mid + Math.imul(al6, bh5) | 0;
    mid = mid + Math.imul(ah6, bl5) | 0;
    hi = hi + Math.imul(ah6, bh5) | 0;
    lo = lo + Math.imul(al5, bl6) | 0;
    mid = mid + Math.imul(al5, bh6) | 0;
    mid = mid + Math.imul(ah5, bl6) | 0;
    hi = hi + Math.imul(ah5, bh6) | 0;
    lo = lo + Math.imul(al4, bl7) | 0;
    mid = mid + Math.imul(al4, bh7) | 0;
    mid = mid + Math.imul(ah4, bl7) | 0;
    hi = hi + Math.imul(ah4, bh7) | 0;
    lo = lo + Math.imul(al3, bl8) | 0;
    mid = mid + Math.imul(al3, bh8) | 0;
    mid = mid + Math.imul(ah3, bl8) | 0;
    hi = hi + Math.imul(ah3, bh8) | 0;
    lo = lo + Math.imul(al2, bl9) | 0;
    mid = mid + Math.imul(al2, bh9) | 0;
    mid = mid + Math.imul(ah2, bl9) | 0;
    hi = hi + Math.imul(ah2, bh9) | 0;
    var w11 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */

    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = mid + Math.imul(ah9, bl3) | 0;
    hi = Math.imul(ah9, bh3);
    lo = lo + Math.imul(al8, bl4) | 0;
    mid = mid + Math.imul(al8, bh4) | 0;
    mid = mid + Math.imul(ah8, bl4) | 0;
    hi = hi + Math.imul(ah8, bh4) | 0;
    lo = lo + Math.imul(al7, bl5) | 0;
    mid = mid + Math.imul(al7, bh5) | 0;
    mid = mid + Math.imul(ah7, bl5) | 0;
    hi = hi + Math.imul(ah7, bh5) | 0;
    lo = lo + Math.imul(al6, bl6) | 0;
    mid = mid + Math.imul(al6, bh6) | 0;
    mid = mid + Math.imul(ah6, bl6) | 0;
    hi = hi + Math.imul(ah6, bh6) | 0;
    lo = lo + Math.imul(al5, bl7) | 0;
    mid = mid + Math.imul(al5, bh7) | 0;
    mid = mid + Math.imul(ah5, bl7) | 0;
    hi = hi + Math.imul(ah5, bh7) | 0;
    lo = lo + Math.imul(al4, bl8) | 0;
    mid = mid + Math.imul(al4, bh8) | 0;
    mid = mid + Math.imul(ah4, bl8) | 0;
    hi = hi + Math.imul(ah4, bh8) | 0;
    lo = lo + Math.imul(al3, bl9) | 0;
    mid = mid + Math.imul(al3, bh9) | 0;
    mid = mid + Math.imul(ah3, bl9) | 0;
    hi = hi + Math.imul(ah3, bh9) | 0;
    var w12 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */

    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = mid + Math.imul(ah9, bl4) | 0;
    hi = Math.imul(ah9, bh4);
    lo = lo + Math.imul(al8, bl5) | 0;
    mid = mid + Math.imul(al8, bh5) | 0;
    mid = mid + Math.imul(ah8, bl5) | 0;
    hi = hi + Math.imul(ah8, bh5) | 0;
    lo = lo + Math.imul(al7, bl6) | 0;
    mid = mid + Math.imul(al7, bh6) | 0;
    mid = mid + Math.imul(ah7, bl6) | 0;
    hi = hi + Math.imul(ah7, bh6) | 0;
    lo = lo + Math.imul(al6, bl7) | 0;
    mid = mid + Math.imul(al6, bh7) | 0;
    mid = mid + Math.imul(ah6, bl7) | 0;
    hi = hi + Math.imul(ah6, bh7) | 0;
    lo = lo + Math.imul(al5, bl8) | 0;
    mid = mid + Math.imul(al5, bh8) | 0;
    mid = mid + Math.imul(ah5, bl8) | 0;
    hi = hi + Math.imul(ah5, bh8) | 0;
    lo = lo + Math.imul(al4, bl9) | 0;
    mid = mid + Math.imul(al4, bh9) | 0;
    mid = mid + Math.imul(ah4, bl9) | 0;
    hi = hi + Math.imul(ah4, bh9) | 0;
    var w13 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */

    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = mid + Math.imul(ah9, bl5) | 0;
    hi = Math.imul(ah9, bh5);
    lo = lo + Math.imul(al8, bl6) | 0;
    mid = mid + Math.imul(al8, bh6) | 0;
    mid = mid + Math.imul(ah8, bl6) | 0;
    hi = hi + Math.imul(ah8, bh6) | 0;
    lo = lo + Math.imul(al7, bl7) | 0;
    mid = mid + Math.imul(al7, bh7) | 0;
    mid = mid + Math.imul(ah7, bl7) | 0;
    hi = hi + Math.imul(ah7, bh7) | 0;
    lo = lo + Math.imul(al6, bl8) | 0;
    mid = mid + Math.imul(al6, bh8) | 0;
    mid = mid + Math.imul(ah6, bl8) | 0;
    hi = hi + Math.imul(ah6, bh8) | 0;
    lo = lo + Math.imul(al5, bl9) | 0;
    mid = mid + Math.imul(al5, bh9) | 0;
    mid = mid + Math.imul(ah5, bl9) | 0;
    hi = hi + Math.imul(ah5, bh9) | 0;
    var w14 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */

    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = mid + Math.imul(ah9, bl6) | 0;
    hi = Math.imul(ah9, bh6);
    lo = lo + Math.imul(al8, bl7) | 0;
    mid = mid + Math.imul(al8, bh7) | 0;
    mid = mid + Math.imul(ah8, bl7) | 0;
    hi = hi + Math.imul(ah8, bh7) | 0;
    lo = lo + Math.imul(al7, bl8) | 0;
    mid = mid + Math.imul(al7, bh8) | 0;
    mid = mid + Math.imul(ah7, bl8) | 0;
    hi = hi + Math.imul(ah7, bh8) | 0;
    lo = lo + Math.imul(al6, bl9) | 0;
    mid = mid + Math.imul(al6, bh9) | 0;
    mid = mid + Math.imul(ah6, bl9) | 0;
    hi = hi + Math.imul(ah6, bh9) | 0;
    var w15 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */

    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = mid + Math.imul(ah9, bl7) | 0;
    hi = Math.imul(ah9, bh7);
    lo = lo + Math.imul(al8, bl8) | 0;
    mid = mid + Math.imul(al8, bh8) | 0;
    mid = mid + Math.imul(ah8, bl8) | 0;
    hi = hi + Math.imul(ah8, bh8) | 0;
    lo = lo + Math.imul(al7, bl9) | 0;
    mid = mid + Math.imul(al7, bh9) | 0;
    mid = mid + Math.imul(ah7, bl9) | 0;
    hi = hi + Math.imul(ah7, bh9) | 0;
    var w16 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */

    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = mid + Math.imul(ah9, bl8) | 0;
    hi = Math.imul(ah9, bh8);
    lo = lo + Math.imul(al8, bl9) | 0;
    mid = mid + Math.imul(al8, bh9) | 0;
    mid = mid + Math.imul(ah8, bl9) | 0;
    hi = hi + Math.imul(ah8, bh9) | 0;
    var w17 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */

    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = mid + Math.imul(ah9, bl9) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
    c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;

    if (c !== 0) {
      o[19] = c;
      out.length++;
    }

    return out;
  }; // Polyfill comb


  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo(self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;
    var carry = 0;
    var hncarry = 0;

    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);

      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;
        var lo = r & 0x3ffffff;
        ncarry = ncarry + (r / 0x4000000 | 0) | 0;
        lo = lo + rword | 0;
        rword = lo & 0x3ffffff;
        ncarry = ncarry + (lo >>> 26) | 0;
        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }

      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }

    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out.strip();
  }

  function jumboMulTo(self, num, out) {
    var fftm = new FFTM();
    return fftm.mulp(self, num, out);
  }

  BN.prototype.mulTo = function mulTo(num, out) {
    var res;
    var len = this.length + num.length;

    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  }; // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion


  function FFTM(x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT(N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;

    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  }; // Returns binary-reversed representation of `x`


  FFTM.prototype.revBin = function revBin(x, l, N) {
    if (x === 0 || x === N - 1) return x;
    var rb = 0;

    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << l - i - 1;
      x >>= 1;
    }

    return rb;
  }; // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm


  FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;
      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];
          var ro = rtws[p + j + s];
          var io = itws[p + j + s];
          var rx = rtwdf_ * ro - itwdf_ * io;
          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;
          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;
          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;
          /* jshint maxdepth : false */

          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;
            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;

    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];
      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;
      t = iws[i];
      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b(ws, N) {
    var carry = 0;

    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 + Math.round(ws[2 * i] / N) + carry;
      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
    var carry = 0;

    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);
      rws[2 * i] = carry & 0x1fff;
      carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff;
      carry = carry >>> 13;
    } // Pad with zeroes


    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub(N) {
    var ph = new Array(N);

    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp(x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);
    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);
    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);
    var rmws = out.words;
    rmws.length = N;
    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);
    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);
    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out.strip();
  }; // Multiply `this` by `num`


  BN.prototype.mul = function mul(num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  }; // Multiply employing FFT


  BN.prototype.mulf = function mulf(num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  }; // In-place Multiplication


  BN.prototype.imul = function imul(num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln(num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000); // Carry

    var carry = 0;

    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += w / 0x4000000 | 0; // NOTE: lo is 27bit maximum

      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return this;
  };

  BN.prototype.muln = function muln(num) {
    return this.clone().imuln(num);
  }; // `this` * `this`


  BN.prototype.sqr = function sqr() {
    return this.mul(this);
  }; // `this` * `this` in-place


  BN.prototype.isqr = function isqr() {
    return this.imul(this.clone());
  }; // Math.pow(`this`, `num`)


  BN.prototype.pow = function pow(num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1); // Skip leading zeroes

    var res = this;

    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;
        res = res.mul(q);
      }
    }

    return res;
  }; // Shift-left in-place


  BN.prototype.iushln = function iushln(bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = 0x3ffffff >>> 26 - r << 26 - r;
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = (this.words[i] | 0) - newCarry << r;
        this.words[i] = c | carry;
        carry = newCarry >>> 26 - r;
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this.strip();
  };

  BN.prototype.ishln = function ishln(bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  }; // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits


  BN.prototype.iushrn = function iushrn(bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;

    if (hint) {
      h = (hint - hint % 26) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
    var maskedWords = extended;
    h -= s;
    h = Math.max(0, h); // Extended mode, copy masked part

    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }

      maskedWords.length = s;
    }

    if (s === 0) {// No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;

      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;

    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = carry << 26 - r | word >>> r;
      carry = word & mask;
    } // Push carried bits as a mask


    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this.strip();
  };

  BN.prototype.ishrn = function ishrn(bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  }; // Shift-left


  BN.prototype.shln = function shln(bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln(bits) {
    return this.clone().iushln(bits);
  }; // Shift-right


  BN.prototype.shrn = function shrn(bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn(bits) {
    return this.clone().iushrn(bits);
  }; // Test if n bit is set


  BN.prototype.testn = function testn(bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r; // Fast case: bit is much higher than all existing words

    if (this.length <= s) return false; // Check bit and return

    var w = this.words[s];
    return !!(w & q);
  }; // Return only lowers bits of number (in-place)


  BN.prototype.imaskn = function imaskn(bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }

    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
      this.words[this.length - 1] &= mask;
    }

    return this.strip();
  }; // Return only lowers bits of number


  BN.prototype.maskn = function maskn(bits) {
    return this.clone().imaskn(bits);
  }; // Add plain number `num` to `this`


  BN.prototype.iaddn = function iaddn(num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num); // Possible sign change

    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) < num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    } // Add without checks


    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn(num) {
    this.words[0] += num; // Carry

    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;

      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }

    this.length = Math.max(this.length, i + 1);
    return this;
  }; // Subtract plain number `num` from `this`


  BN.prototype.isubn = function isubn(num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this.strip();
  };

  BN.prototype.addn = function addn(num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn(num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs() {
    this.negative = 0;
    return this;
  };

  BN.prototype.abs = function abs() {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;

    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - (right / 0x4000000 | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }

    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this.strip(); // Subtraction overflow

    assert(carry === -1);
    carry = 0;

    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }

    this.negative = 1;
    return this.strip();
  };

  BN.prototype._wordDiv = function _wordDiv(num, mode) {
    var shift = this.length - num.length;
    var a = this.clone();
    var b = num; // Normalize

    var bhi = b.words[b.length - 1] | 0;

    var bhiBits = this._countBits(bhi);

    shift = 26 - bhiBits;

    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    } // Initialize quotient


    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);

      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);

    if (diff.negative === 0) {
      a = diff;

      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 + (a.words[b.length + j - 1] | 0); // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)

      qj = Math.min(qj / bhi | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);

      while (a.negative !== 0) {
        qj--;
        a.negative = 0;

        a._ishlnsubmul(b, 1, j);

        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }

      if (q) {
        q.words[j] = qj;
      }
    }

    if (q) {
      q.strip();
    }

    a.strip(); // Denormalize

    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  }; // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested


  BN.prototype.divmod = function divmod(num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;

    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();

        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();

        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    } // Both numbers are positive at this point
    // Strip both numbers to approximate shift value


    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    } // Very short reduction


    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  }; // Find `this` / `num`


  BN.prototype.div = function div(num) {
    return this.divmod(num, 'div', false).div;
  }; // Find `this` % `num`


  BN.prototype.mod = function mod(num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod(num) {
    return this.divmod(num, 'mod', true).mod;
  }; // Find Round(`this` / `num`)


  BN.prototype.divRound = function divRound(num) {
    var dm = this.divmod(num); // Fast case - exact division

    if (dm.mod.isZero()) return dm.div;
    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half); // Round down

    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div; // Round up

    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modn = function modn(num) {
    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;
    var acc = 0;

    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return acc;
  }; // In-place division by number


  BN.prototype.idivn = function idivn(num) {
    assert(num <= 0x3ffffff);
    var carry = 0;

    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = w / num | 0;
      carry = w % num;
    }

    return this.strip();
  };

  BN.prototype.divn = function divn(num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd(p) {
    assert(p.negative === 0);
    assert(!p.isZero());
    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    } // A * x + B * y = x


    var A = new BN(1);
    var B = new BN(0); // C * x + D * y = y

    var C = new BN(0);
    var D = new BN(1);
    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1) {
        ;
      }

      if (i > 0) {
        x.iushrn(i);

        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1) {
        ;
      }

      if (j > 0) {
        y.iushrn(j);

        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  }; // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed


  BN.prototype._invmp = function _invmp(p) {
    assert(p.negative === 0);
    assert(!p.isZero());
    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);
    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1) {
        ;
      }

      if (i > 0) {
        a.iushrn(i);

        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1) {
        ;
      }

      if (j > 0) {
        b.iushrn(j);

        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;

    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd(num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();
    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0; // Remove common factor of two

    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }

      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);

      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  }; // Invert number in the field F(num)


  BN.prototype.invm = function invm(num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven() {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd() {
    return (this.words[0] & 1) === 1;
  }; // And first word and num


  BN.prototype.andln = function andln(num) {
    return this.words[0] & num;
  }; // Increment at the bit position in-line


  BN.prototype.bincn = function bincn(bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r; // Fast case: bit is much higher than all existing words

    if (this.length <= s) {
      this._expand(s + 1);

      this.words[s] |= q;
      return this;
    } // Add bit and propagate, if needed


    var carry = q;

    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return this;
  };

  BN.prototype.isZero = function isZero() {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn(num) {
    var negative = num < 0;
    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;
    this.strip();
    var res;

    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');
      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }

    if (this.negative !== 0) return -res | 0;
    return res;
  }; // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`


  BN.prototype.cmp = function cmp(num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;
    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  }; // Unsigned comparison


  BN.prototype.ucmp = function ucmp(num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;
    var res = 0;

    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;
      if (a === b) continue;

      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }

      break;
    }

    return res;
  };

  BN.prototype.gtn = function gtn(num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt(num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten(num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte(num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn(num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt(num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten(num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte(num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn(num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq(num) {
    return this.cmp(num) === 0;
  }; //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //


  BN.red = function red(num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed(ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed() {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed(ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed(ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd(num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd(num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub(num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub(num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl(num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul(num) {
    assert(this.red, 'redMul works only with red numbers');

    this.red._verify2(this, num);

    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul(num) {
    assert(this.red, 'redMul works only with red numbers');

    this.red._verify2(this, num);

    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr() {
    assert(this.red, 'redSqr works only with red numbers');

    this.red._verify1(this);

    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr() {
    assert(this.red, 'redISqr works only with red numbers');

    this.red._verify1(this);

    return this.red.isqr(this);
  }; // Square root over p


  BN.prototype.redSqrt = function redSqrt() {
    assert(this.red, 'redSqrt works only with red numbers');

    this.red._verify1(this);

    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm() {
    assert(this.red, 'redInvm works only with red numbers');

    this.red._verify1(this);

    return this.red.invm(this);
  }; // Return negative clone of `this` % `red modulo`


  BN.prototype.redNeg = function redNeg() {
    assert(this.red, 'redNeg works only with red numbers');

    this.red._verify1(this);

    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow(num) {
    assert(this.red && !num.red, 'redPow(normalNum)');

    this.red._verify1(this);

    return this.red.pow(this, num);
  }; // Prime numbers with efficient reduction


  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  }; // Pseudo-Mersenne prime

  function MPrime(name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);
    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp() {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce(num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);

    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      r.strip();
    }

    return r;
  };

  MPrime.prototype.split = function split(input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK(num) {
    return num.imul(this.k);
  };

  function K256() {
    MPrime.call(this, 'k256', 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }

  inherits(K256, MPrime);

  K256.prototype.split = function split(input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;
    var outLen = Math.min(input.length, 9);

    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }

    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    } // Shift by 9 limbs


    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
      prev = next;
    }

    prev >>>= 22;
    input.words[i - 10] = prev;

    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK(num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2; // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390

    var lo = 0;

    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + (lo / 0x4000000 | 0);
    } // Fast length reduction


    if (num.words[num.length - 1] === 0) {
      num.length--;

      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }

    return num;
  };

  function P224() {
    MPrime.call(this, 'p224', 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }

  inherits(P224, MPrime);

  function P192() {
    MPrime.call(this, 'p192', 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }

  inherits(P192, MPrime);

  function P25519() {
    // 2 ^ 255 - 19
    MPrime.call(this, '25519', '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }

  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK(num) {
    // K = 0x13
    var carry = 0;

    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;
      num.words[i] = lo;
      carry = hi;
    }

    if (carry !== 0) {
      num.words[num.length++] = carry;
    }

    return num;
  }; // Exported mostly for testing purposes, use plain name instead


  BN._prime = function prime(name) {
    // Cached version of prime
    if (primes[name]) return primes[name];
    var prime;

    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }

    primes[name] = prime;
    return prime;
  }; //
  // Base reduction engine
  //


  function Red(m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);

      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1(a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2(a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red, 'red works only with red numbers');
  };

  Red.prototype.imod = function imod(a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
    return a.umod(this.m)._forceRed(this);
  };

  Red.prototype.neg = function neg(a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add(a, b) {
    this._verify2(a, b);

    var res = a.add(b);

    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }

    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd(a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);

    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }

    return res;
  };

  Red.prototype.sub = function sub(a, b) {
    this._verify2(a, b);

    var res = a.sub(b);

    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Red.prototype.isub = function isub(a, b) {
    this._verify2(a, b);

    var res = a.isub(b);

    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }

    return res;
  };

  Red.prototype.shl = function shl(a, num) {
    this._verify1(a);

    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul(a, b) {
    this._verify2(a, b);

    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul(a, b) {
    this._verify2(a, b);

    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr(a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr(a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt(a) {
    if (a.isZero()) return a.clone();
    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1); // Fast case

    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    } // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)


    var q = this.m.subn(1);
    var s = 0;

    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }

    assert(!q.isZero());
    var one = new BN(1).toRed(this);
    var nOne = one.redNeg(); // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.

    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;

    while (t.cmp(one) !== 0) {
      var tmp = t;

      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }

      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));
      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm(a) {
    var inv = a._invmp(this.m);

    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow(a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();
    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;

    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;

    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];

      for (var j = start - 1; j >= 0; j--) {
        var bit = word >> j & 1;

        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }

      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo(num) {
    var r = num.umod(this.m);
    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom(num) {
    var res = num.clone();
    res.red = null;
    return res;
  }; //
  // Montgomery method engine
  //


  BN.mont = function mont(num) {
    return new Mont(num);
  };

  function Mont(m) {
    Red.call(this, m);
    this.shift = this.m.bitLength();

    if (this.shift % 26 !== 0) {
      this.shift += 26 - this.shift % 26;
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);
    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }

  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo(num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom(num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul(a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul(a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm(a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})( false || module, this);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(29)(module)))

/***/ }),

/***/ 631:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 632:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Convert a typed array to a Buffer without a copy
 *
 * Author:   Feross Aboukhadijeh <https://feross.org>
 * License:  MIT
 *
 * `npm install typedarray-to-buffer`
 */
var isTypedArray = __webpack_require__(612).strict;

module.exports = function typedarrayToBuffer(arr) {
  if (isTypedArray(arr)) {
    // To avoid a copy, use the typed array's underlying ArrayBuffer to back new Buffer
    var buf = Buffer.from(arr.buffer);

    if (arr.byteLength !== arr.buffer.byteLength) {
      // Respect the "view", i.e. byteOffset and byteLength, without doing a copy
      buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
    }

    return buf;
  } else {
    // Pass through all other types to `Buffer.from`
    return Buffer.from(arr);
  }
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8).Buffer))

/***/ }),

/***/ 633:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = __webpack_require__(43).default;

var _createForOfIteratorHelper = __webpack_require__(44).default;

var _toConsumableArray = __webpack_require__(247).default;

var strictUriEncode = __webpack_require__(634);

var decodeComponent = __webpack_require__(248);

var splitOnFirst = __webpack_require__(635);

var isNullOrUndefined = function isNullOrUndefined(value) {
  return value === null || value === undefined;
};

function encoderForArrayFormat(options) {
  switch (options.arrayFormat) {
    case 'index':
      return function (key) {
        return function (result, value) {
          var index = result.length;

          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }

          if (value === null) {
            return [].concat(_toConsumableArray(result), [[encode(key, options), '[', index, ']'].join('')]);
          }

          return [].concat(_toConsumableArray(result), [[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')]);
        };
      };

    case 'bracket':
      return function (key) {
        return function (result, value) {
          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }

          if (value === null) {
            return [].concat(_toConsumableArray(result), [[encode(key, options), '[]'].join('')]);
          }

          return [].concat(_toConsumableArray(result), [[encode(key, options), '[]=', encode(value, options)].join('')]);
        };
      };

    case 'comma':
    case 'separator':
      return function (key) {
        return function (result, value) {
          if (value === null || value === undefined || value.length === 0) {
            return result;
          }

          if (result.length === 0) {
            return [[encode(key, options), '=', encode(value, options)].join('')];
          }

          return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
        };
      };

    default:
      return function (key) {
        return function (result, value) {
          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }

          if (value === null) {
            return [].concat(_toConsumableArray(result), [encode(key, options)]);
          }

          return [].concat(_toConsumableArray(result), [[encode(key, options), '=', encode(value, options)].join('')]);
        };
      };
  }
}

function parserForArrayFormat(options) {
  var result;

  switch (options.arrayFormat) {
    case 'index':
      return function (key, value, accumulator) {
        result = /\[(\d*)\]$/.exec(key);
        key = key.replace(/\[\d*\]$/, '');

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = {};
        }

        accumulator[key][result[1]] = value;
      };

    case 'bracket':
      return function (key, value, accumulator) {
        result = /(\[\])$/.exec(key);
        key = key.replace(/\[\]$/, '');

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = [value];
          return;
        }

        accumulator[key] = [].concat(accumulator[key], value);
      };

    case 'comma':
    case 'separator':
      return function (key, value, accumulator) {
        var isArray = typeof value === 'string' && value.split('').indexOf(options.arrayFormatSeparator) > -1;
        var newValue = isArray ? value.split(options.arrayFormatSeparator).map(function (item) {
          return decode(item, options);
        }) : value === null ? value : decode(value, options);
        accumulator[key] = newValue;
      };

    default:
      return function (key, value, accumulator) {
        if (accumulator[key] === undefined) {
          accumulator[key] = value;
          return;
        }

        accumulator[key] = [].concat(accumulator[key], value);
      };
  }
}

function validateArrayFormatSeparator(value) {
  if (typeof value !== 'string' || value.length !== 1) {
    throw new TypeError('arrayFormatSeparator must be single character string');
  }
}

function encode(value, options) {
  if (options.encode) {
    return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
  }

  return value;
}

function decode(value, options) {
  if (options.decode) {
    return decodeComponent(value);
  }

  return value;
}

function keysSorter(input) {
  if (Array.isArray(input)) {
    return input.sort();
  }

  if (typeof input === 'object') {
    return keysSorter(Object.keys(input)).sort(function (a, b) {
      return Number(a) - Number(b);
    }).map(function (key) {
      return input[key];
    });
  }

  return input;
}

function removeHash(input) {
  var hashStart = input.indexOf('#');

  if (hashStart !== -1) {
    input = input.slice(0, hashStart);
  }

  return input;
}

function getHash(url) {
  var hash = '';
  var hashStart = url.indexOf('#');

  if (hashStart !== -1) {
    hash = url.slice(hashStart);
  }

  return hash;
}

function extract(input) {
  input = removeHash(input);
  var queryStart = input.indexOf('?');

  if (queryStart === -1) {
    return '';
  }

  return input.slice(queryStart + 1);
}

function parseValue(value, options) {
  if (options.parseNumbers && !Number.isNaN(Number(value)) && typeof value === 'string' && value.trim() !== '') {
    value = Number(value);
  } else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    value = value.toLowerCase() === 'true';
  }

  return value;
}

function parse(input, options) {
  options = Object.assign({
    decode: true,
    sort: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    parseNumbers: false,
    parseBooleans: false
  }, options);
  validateArrayFormatSeparator(options.arrayFormatSeparator);
  var formatter = parserForArrayFormat(options); // Create an object with no prototype

  var ret = Object.create(null);

  if (typeof input !== 'string') {
    return ret;
  }

  input = input.trim().replace(/^[?#&]/, '');

  if (!input) {
    return ret;
  }

  var _iterator = _createForOfIteratorHelper(input.split('&')),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var param = _step.value;

      var _splitOnFirst = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '='),
          _splitOnFirst2 = _slicedToArray(_splitOnFirst, 2),
          _key = _splitOnFirst2[0],
          _value = _splitOnFirst2[1]; // Missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters


      _value = _value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? _value : decode(_value, options);
      formatter(decode(_key, options), _value, ret);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  for (var _i = 0, _Object$keys = Object.keys(ret); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var value = ret[key];

    if (typeof value === 'object' && value !== null) {
      for (var _i2 = 0, _Object$keys2 = Object.keys(value); _i2 < _Object$keys2.length; _i2++) {
        var k = _Object$keys2[_i2];
        value[k] = parseValue(value[k], options);
      }
    } else {
      ret[key] = parseValue(value, options);
    }
  }

  if (options.sort === false) {
    return ret;
  }

  return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce(function (result, key) {
    var value = ret[key];

    if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
      // Sort object keys, not values
      result[key] = keysSorter(value);
    } else {
      result[key] = value;
    }

    return result;
  }, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = function (object, options) {
  if (!object) {
    return '';
  }

  options = Object.assign({
    encode: true,
    strict: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ','
  }, options);
  validateArrayFormatSeparator(options.arrayFormatSeparator);

  var shouldFilter = function shouldFilter(key) {
    return options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === '';
  };

  var formatter = encoderForArrayFormat(options);
  var objectCopy = {};

  for (var _i3 = 0, _Object$keys3 = Object.keys(object); _i3 < _Object$keys3.length; _i3++) {
    var key = _Object$keys3[_i3];

    if (!shouldFilter(key)) {
      objectCopy[key] = object[key];
    }
  }

  var keys = Object.keys(objectCopy);

  if (options.sort !== false) {
    keys.sort(options.sort);
  }

  return keys.map(function (key) {
    var value = object[key];

    if (value === undefined) {
      return '';
    }

    if (value === null) {
      return encode(key, options);
    }

    if (Array.isArray(value)) {
      return value.reduce(formatter(key), []).join('&');
    }

    return encode(key, options) + '=' + encode(value, options);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&');
};

exports.parseUrl = function (input, options) {
  options = Object.assign({
    decode: true
  }, options);

  var _splitOnFirst3 = splitOnFirst(input, '#'),
      _splitOnFirst4 = _slicedToArray(_splitOnFirst3, 2),
      url = _splitOnFirst4[0],
      hash = _splitOnFirst4[1];

  return Object.assign({
    url: url.split('?')[0] || '',
    query: parse(extract(input), options)
  }, options && options.parseFragmentIdentifier && hash ? {
    fragmentIdentifier: decode(hash, options)
  } : {});
};

exports.stringifyUrl = function (input, options) {
  options = Object.assign({
    encode: true,
    strict: true
  }, options);
  var url = removeHash(input.url).split('?')[0] || '';
  var queryFromUrl = exports.extract(input.url);
  var parsedQueryFromUrl = exports.parse(queryFromUrl, {
    sort: false
  });
  var query = Object.assign(parsedQueryFromUrl, input.query);
  var queryString = exports.stringify(query, options);

  if (queryString) {
    queryString = "?".concat(queryString);
  }

  var hash = getHash(input.url);

  if (input.fragmentIdentifier) {
    hash = "#".concat(encode(input.fragmentIdentifier, options));
  }

  return "".concat(url).concat(queryString).concat(hash);
};

/***/ }),

/***/ 634:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (x) {
    return "%".concat(x.charCodeAt(0).toString(16).toUpperCase());
  });
};

/***/ }),

/***/ 635:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (string, separator) {
  if (!(typeof string === 'string' && typeof separator === 'string')) {
    throw new TypeError('Expected the arguments to be of type `string`');
  }

  if (separator === '') {
    return [string];
  }

  var separatorIndex = string.indexOf(separator);

  if (separatorIndex === -1) {
    return [string];
  }

  return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
};

/***/ }),

/***/ 636:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty,
    prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */

function Events() {} //
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//


if (Object.create) {
  Events.prototype = Object.create(null); //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //

  if (!new Events().__proto__) prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */


function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */


function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once),
      evt = prefix ? prefix + event : event;
  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];
  return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */


function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */


function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */


EventEmitter.prototype.eventNames = function eventNames() {
  var names = [],
      events,
      name;
  if (this._eventsCount === 0) return names;

  for (name in events = this._events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */


EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event,
      handlers = this._events[evt];
  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */


EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event,
      listeners = this._events[evt];
  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */


EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return false;
  var listeners = this._events[evt],
      len = arguments.length,
      args,
      i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1:
        return listeners.fn.call(listeners.context), true;

      case 2:
        return listeners.fn.call(listeners.context, a1), true;

      case 3:
        return listeners.fn.call(listeners.context, a1, a2), true;

      case 4:
        return listeners.fn.call(listeners.context, a1, a2, a3), true;

      case 5:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;

      case 6:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len - 1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length,
        j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1:
          listeners[i].fn.call(listeners[i].context);
          break;

        case 2:
          listeners[i].fn.call(listeners[i].context, a1);
          break;

        case 3:
          listeners[i].fn.call(listeners[i].context, a1, a2);
          break;

        case 4:
          listeners[i].fn.call(listeners[i].context, a1, a2, a3);
          break;

        default:
          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
            args[j - 1] = arguments[j];
          }
          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return this;

  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
        events.push(listeners[i]);
      }
    } //
    // Reset the array, or remove it completely if we have no more listeners.
    //


    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
  }

  return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
}; //
// Alias methods names because people roll like that.
//


EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on; //
// Expose the prefix.
//

EventEmitter.prefixed = prefix; //
// Allow `EventEmitter` to be imported as module namespace.
//

EventEmitter.EventEmitter = EventEmitter; //
// Expose the module.
//

if (true) {
  module.exports = EventEmitter;
}

/***/ }),

/***/ 637:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _walletconnect_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(588);
/* harmony import */ var _network__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(638);






var WS = typeof global.WebSocket !== "undefined" ? global.WebSocket : __webpack_require__(639);

var SocketTransport = /*#__PURE__*/function () {
  function SocketTransport(opts) {
    var _this = this;

    Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(this, SocketTransport);

    this.opts = opts;
    this._queue = [];
    this._events = [];
    this._subscriptions = [];
    this._protocol = opts.protocol;
    this._version = opts.version;
    this._url = "";
    this._netMonitor = null;
    this._socket = null;
    this._nextSocket = null;
    this._subscriptions = opts.subscriptions || [];
    this._netMonitor = opts.netMonitor || new _network__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"]();

    if (!opts.url || typeof opts.url !== "string") {
      throw new Error("Missing or invalid WebSocket url");
    }

    this._url = opts.url;

    this._netMonitor.on("online", function () {
      return _this._socketCreate();
    });
  }

  Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(SocketTransport, [{
    key: "readyState",
    get: function get() {
      return this._socket ? this._socket.readyState : -1;
    },
    set: function set(value) {}
  }, {
    key: "connecting",
    get: function get() {
      return this.readyState === 0;
    },
    set: function set(value) {}
  }, {
    key: "connected",
    get: function get() {
      return this.readyState === 1;
    },
    set: function set(value) {}
  }, {
    key: "closing",
    get: function get() {
      return this.readyState === 2;
    },
    set: function set(value) {}
  }, {
    key: "closed",
    get: function get() {
      return this.readyState === 3;
    },
    set: function set(value) {}
  }, {
    key: "open",
    value: function open() {
      this._socketCreate();
    }
  }, {
    key: "close",
    value: function close() {
      this._socketClose();
    }
  }, {
    key: "send",
    value: function send(message, topic, silent) {
      if (!topic || typeof topic !== "string") {
        throw new Error("Missing or invalid topic field");
      }

      this._socketSend({
        topic: topic,
        type: "pub",
        payload: message,
        silent: !!silent
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(topic) {
      this._socketSend({
        topic: topic,
        type: "sub",
        payload: "",
        silent: true
      });
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      this._events.push({
        event: event,
        callback: callback
      });
    }
  }, {
    key: "_socketCreate",
    value: function _socketCreate() {
      var _this2 = this;

      if (this._nextSocket) {
        return;
      }

      var url = getWebSocketUrl(this._url, this._protocol, this._version);
      this._nextSocket = new WS(url);

      if (!this._nextSocket) {
        throw new Error("Failed to create socket");
      }

      this._nextSocket.onmessage = function (event) {
        return _this2._socketReceive(event);
      };

      this._nextSocket.onopen = function () {
        return _this2._socketOpen();
      };

      this._nextSocket.onerror = function (event) {
        return _this2._socketError(event);
      };

      this._nextSocket.onclose = function () {
        setTimeout(function () {
          _this2._nextSocket = null;

          _this2._socketCreate();
        }, 1000);
      };
    }
  }, {
    key: "_socketOpen",
    value: function _socketOpen() {
      this._socketClose();

      this._socket = this._nextSocket;
      this._nextSocket = null;

      this._queueSubscriptions();

      this._pushQueue();
    }
  }, {
    key: "_socketClose",
    value: function _socketClose() {
      if (this._socket) {
        this._socket.onclose = function () {};

        this._socket.close();
      }
    }
  }, {
    key: "_socketSend",
    value: function _socketSend(socketMessage) {
      var message = JSON.stringify(socketMessage);

      if (this._socket && this._socket.readyState === 1) {
        this._socket.send(message);
      } else {
        this._setToQueue(socketMessage);

        this._socketCreate();
      }
    }
  }, {
    key: "_socketReceive",
    value: function () {
      var _socketReceive2 = Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])( /*#__PURE__*/Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().mark(function _callee(event) {
        var socketMessage, events;
        return Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                socketMessage = JSON.parse(event.data);
                _context.next = 7;
                break;

              case 4:
                _context.prev = 4;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return");

              case 7:
                this._socketSend({
                  topic: socketMessage.topic,
                  type: "ack",
                  payload: "",
                  silent: true
                });

                if (this._socket && this._socket.readyState === 1) {
                  events = this._events.filter(function (event) {
                    return event.event === "message";
                  });

                  if (events && events.length) {
                    events.forEach(function (event) {
                      return event.callback(socketMessage);
                    });
                  }
                }

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 4]]);
      }));

      function _socketReceive(_x) {
        return _socketReceive2.apply(this, arguments);
      }

      return _socketReceive;
    }()
  }, {
    key: "_socketError",
    value: function _socketError(e) {
      var events = this._events.filter(function (event) {
        return event.event === "error";
      });

      if (events && events.length) {
        events.forEach(function (event) {
          return event.callback(e);
        });
      }
    }
  }, {
    key: "_queueSubscriptions",
    value: function _queueSubscriptions() {
      var _this3 = this;

      var subscriptions = this._subscriptions;
      subscriptions.forEach(function (topic) {
        return _this3._queue.push({
          topic: topic,
          type: "sub",
          payload: "",
          silent: true
        });
      });
      this._subscriptions = this.opts.subscriptions || [];
    }
  }, {
    key: "_setToQueue",
    value: function _setToQueue(socketMessage) {
      this._queue.push(socketMessage);
    }
  }, {
    key: "_pushQueue",
    value: function _pushQueue() {
      var _this4 = this;

      var queue = this._queue;
      queue.forEach(function (socketMessage) {
        return _this4._socketSend(socketMessage);
      });
      this._queue = [];
    }
  }]);

  return SocketTransport;
}();

function getWebSocketUrl(_url, protocol, version) {
  var _a, _b;

  var url = _url.startsWith("https") ? _url.replace("https", "wss") : _url.startsWith("http") ? _url.replace("http", "ws") : _url;
  var splitUrl = url.split("?");
  var params = Object(_walletconnect_utils__WEBPACK_IMPORTED_MODULE_4__[/* isBrowser */ "n"])() ? {
    protocol: protocol,
    version: version,
    env: "browser",
    host: ((_a = Object(_walletconnect_utils__WEBPACK_IMPORTED_MODULE_4__[/* getLocation */ "k"])()) === null || _a === void 0 ? void 0 : _a.host) || ""
  } : {
    protocol: protocol,
    version: version,
    env: ((_b = Object(_walletconnect_utils__WEBPACK_IMPORTED_MODULE_4__[/* detectEnv */ "g"])()) === null || _b === void 0 ? void 0 : _b.name) || ""
  };
  var queryString = Object(_walletconnect_utils__WEBPACK_IMPORTED_MODULE_4__[/* appendToQueryString */ "a"])(Object(_walletconnect_utils__WEBPACK_IMPORTED_MODULE_4__[/* getQueryString */ "l"])(splitUrl[1] || ""), params);
  return splitUrl[0] + "?" + queryString;
}

/* harmony default export */ __webpack_exports__["a"] = (SocketTransport);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(21)))

/***/ }),

/***/ 638:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);



var NetworkMonitor = /*#__PURE__*/function () {
  function NetworkMonitor() {
    var _this = this;

    Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(this, NetworkMonitor);

    this._eventEmitters = [];

    if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined") {
      window.addEventListener("online", function () {
        return _this.trigger("online");
      });
      window.addEventListener("offline", function () {
        return _this.trigger("offline");
      });
    }
  }

  Object(_Users_vitaliyshulik_Programming_Work_OnOut_dao_votes_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(NetworkMonitor, [{
    key: "on",
    value: function on(event, callback) {
      this._eventEmitters.push({
        event: event,
        callback: callback
      });
    }
  }, {
    key: "trigger",
    value: function trigger(event) {
      var eventEmitters = [];

      if (event) {
        eventEmitters = this._eventEmitters.filter(function (eventEmitter) {
          return eventEmitter.event === event;
        });
      }

      eventEmitters.forEach(function (eventEmitter) {
        eventEmitter.callback();
      });
    }
  }]);

  return NetworkMonitor;
}();

/* harmony default export */ __webpack_exports__["a"] = (NetworkMonitor);

/***/ }),

/***/ 639:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  throw new Error('ws does not work in the browser. Browser clients must use the native ' + 'WebSocket object');
};

/***/ }),

/***/ 640:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _walletconnect_randombytes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(613);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "randomBytes", function() { return _walletconnect_randombytes__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony import */ var _aes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(614);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "aesCbcDecrypt", function() { return _aes__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "aesCbcEncrypt", function() { return _aes__WEBPACK_IMPORTED_MODULE_1__["b"]; });

/* harmony import */ var _hmac__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(615);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hmacSha256Sign", function() { return _hmac__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony import */ var _sha2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(620);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(596);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(600);







/***/ }),

/***/ 641:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var browserUtils = __webpack_require__(599);

var QRCode = _interopDefault(__webpack_require__(642));

var copy = _interopDefault(__webpack_require__(663));

var React = __webpack_require__(665);

function open(uri) {
  QRCode.toString(uri, {
    type: "terminal"
  }).then(console.log);
}

var WALLETCONNECT_STYLE_SHEET = ":root {\n  --animation-duration: 300ms;\n}\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes fadeOut {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n\n.animated {\n  animation-duration: var(--animation-duration);\n  animation-fill-mode: both;\n}\n\n.fadeIn {\n  animation-name: fadeIn;\n}\n\n.fadeOut {\n  animation-name: fadeOut;\n}\n\n#walletconnect-wrapper {\n  -webkit-user-select: none;\n  align-items: center;\n  display: flex;\n  height: 100%;\n  justify-content: center;\n  left: 0;\n  pointer-events: none;\n  position: fixed;\n  top: 0;\n  user-select: none;\n  width: 100%;\n  z-index: 99999999999999;\n}\n\n.walletconnect-modal__headerLogo {\n  height: 21px;\n}\n\n.walletconnect-modal__header p {\n  color: #ffffff;\n  font-size: 20px;\n  font-weight: 600;\n  margin: 0;\n  align-items: flex-start;\n  display: flex;\n  flex: 1;\n  margin-left: 5px;\n}\n\n.walletconnect-modal__close__wrapper {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  z-index: 10000;\n  background: white;\n  border-radius: 26px;\n  padding: 6px;\n  box-sizing: border-box;\n  width: 26px;\n  height: 26px;\n  cursor: pointer;\n}\n\n.walletconnect-modal__close__icon {\n  position: relative;\n  top: 7px;\n  right: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transform: rotate(45deg);\n}\n\n.walletconnect-modal__close__line1 {\n  position: absolute;\n  width: 100%;\n  border: 1px solid rgb(48, 52, 59);\n}\n\n.walletconnect-modal__close__line2 {\n  position: absolute;\n  width: 100%;\n  border: 1px solid rgb(48, 52, 59);\n  transform: rotate(90deg);\n}\n\n.walletconnect-qrcode__base {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  background: rgba(37, 41, 46, 0.95);\n  height: 100%;\n  left: 0;\n  pointer-events: auto;\n  position: fixed;\n  top: 0;\n  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n  width: 100%;\n  will-change: opacity;\n  padding: 40px;\n  box-sizing: border-box;\n}\n\n.walletconnect-qrcode__text {\n  color: rgba(60, 66, 82, 0.6);\n  font-size: 16px;\n  font-weight: 600;\n  letter-spacing: 0;\n  line-height: 1.1875em;\n  margin: 10px 0 20px 0;\n  text-align: center;\n  width: 100%;\n}\n\n@media only screen and (max-width: 768px) {\n  .walletconnect-qrcode__text {\n    font-size: 4vw;\n  }\n}\n\n@media only screen and (max-width: 320px) {\n  .walletconnect-qrcode__text {\n    font-size: 14px;\n  }\n}\n\n.walletconnect-qrcode__image {\n  width: calc(100% - 30px);\n  box-sizing: border-box;\n  cursor: none;\n  margin: 0 auto;\n}\n\n.walletconnect-qrcode__notification {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  font-size: 16px;\n  padding: 16px 20px;\n  border-radius: 16px;\n  text-align: center;\n  transition: all 0.1s ease-in-out;\n  background: white;\n  color: black;\n  margin-bottom: -60px;\n  opacity: 0;\n}\n\n.walletconnect-qrcode__notification.notification__show {\n  opacity: 1;\n}\n\n@media only screen and (max-width: 768px) {\n  .walletconnect-modal__header {\n    height: 130px;\n  }\n  .walletconnect-modal__base {\n    overflow: auto;\n  }\n}\n\n@media only screen and (min-device-width: 415px) and (max-width: 768px) {\n  #content {\n    max-width: 768px;\n    box-sizing: border-box;\n  }\n}\n\n@media only screen and (min-width: 375px) and (max-width: 415px) {\n  #content {\n    max-width: 414px;\n    box-sizing: border-box;\n  }\n}\n\n@media only screen and (min-width: 320px) and (max-width: 375px) {\n  #content {\n    max-width: 375px;\n    box-sizing: border-box;\n  }\n}\n\n@media only screen and (max-width: 320px) {\n  #content {\n    max-width: 320px;\n    box-sizing: border-box;\n  }\n}\n\n.walletconnect-modal__base {\n  -webkit-font-smoothing: antialiased;\n  background: #ffffff;\n  border-radius: 24px;\n  box-shadow: 0 10px 50px 5px rgba(0, 0, 0, 0.4);\n  font-family: ui-rounded, \"SF Pro Rounded\", \"SF Pro Text\", medium-content-sans-serif-font,\n    -apple-system, BlinkMacSystemFont, ui-sans-serif, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell,\n    \"Open Sans\", \"Helvetica Neue\", sans-serif;\n  margin-top: 41px;\n  padding: 24px 24px 22px;\n  pointer-events: auto;\n  position: relative;\n  text-align: center;\n  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n  will-change: transform;\n  overflow: visible;\n  transform: translateY(-50%);\n  top: 50%;\n  max-width: 500px;\n  margin: auto;\n}\n\n@media only screen and (max-width: 320px) {\n  .walletconnect-modal__base {\n    padding: 24px 12px;\n  }\n}\n\n.walletconnect-modal__base .hidden {\n  transform: translateY(150%);\n  transition: 0.125s cubic-bezier(0.4, 0, 1, 1);\n}\n\n.walletconnect-modal__header {\n  align-items: center;\n  display: flex;\n  height: 26px;\n  left: 0;\n  justify-content: space-between;\n  position: absolute;\n  top: -42px;\n  width: 100%;\n}\n\n.walletconnect-modal__base .wc-logo {\n  align-items: center;\n  display: flex;\n  height: 26px;\n  margin-top: 15px;\n  padding-bottom: 15px;\n  pointer-events: auto;\n}\n\n.walletconnect-modal__base .wc-logo div {\n  background-color: #3399ff;\n  height: 21px;\n  margin-right: 5px;\n  mask-image: url(\"images/wc-logo.svg\") center no-repeat;\n  width: 32px;\n}\n\n.walletconnect-modal__base .wc-logo p {\n  color: #ffffff;\n  font-size: 20px;\n  font-weight: 600;\n  margin: 0;\n}\n\n.walletconnect-modal__base h2 {\n  color: rgba(60, 66, 82, 0.6);\n  font-size: 16px;\n  font-weight: 600;\n  letter-spacing: 0;\n  line-height: 1.1875em;\n  margin: 0 0 19px 0;\n  text-align: center;\n  width: 100%;\n}\n\n.walletconnect-modal__base__row {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  align-items: center;\n  border-radius: 20px;\n  cursor: pointer;\n  display: flex;\n  height: 56px;\n  justify-content: space-between;\n  padding: 0 15px;\n  position: relative;\n  margin: 0px 0px 8px;\n  text-align: left;\n  transition: 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  will-change: transform;\n  text-decoration: none;\n}\n\n.walletconnect-modal__base__row:hover {\n  background: rgba(60, 66, 82, 0.06);\n}\n\n.walletconnect-modal__base__row:active {\n  background: rgba(60, 66, 82, 0.06);\n  transform: scale(0.975);\n  transition: 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n\n.walletconnect-modal__base__row__h3 {\n  color: #25292e;\n  font-size: 20px;\n  font-weight: 700;\n  margin: 0;\n  padding-bottom: 3px;\n}\n\n.walletconnect-modal__base__row__right {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n}\n\n.walletconnect-modal__base__row__right__app-icon {\n  border-radius: 8px;\n  height: 34px;\n  margin: 0 11px 2px 0;\n  width: 34px;\n  background-size: 100%;\n  box-shadow: 0 4px 12px 0 rgba(37, 41, 46, 0.25);\n}\n\n.walletconnect-modal__base__row__right__caret {\n  height: 18px;\n  opacity: 0.3;\n  transition: 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  width: 8px;\n  will-change: opacity;\n}\n\n.walletconnect-modal__base__row:hover .caret,\n.walletconnect-modal__base__row:active .caret {\n  opacity: 0.6;\n}\n\n.walletconnect-modal__mobile__toggle {\n  width: 80%;\n  display: flex;\n  margin: 0 auto;\n  position: relative;\n  overflow: hidden;\n  border-radius: 8px;\n  margin-bottom: 18px;\n  background: #d4d5d9;\n}\n\n.walletconnect-modal__single_wallet {\n  display: flex;\n  justify-content: center;\n  margin-top: 7px;\n  margin-bottom: 18px;\n}\n\n.walletconnect-modal__single_wallet a {\n  cursor: pointer;\n  color: rgb(64, 153, 255);\n  font-size: 21px;\n  font-weight: 800;\n  text-decoration: none !important;\n  margin: 0 auto;\n}\n\n.walletconnect-modal__mobile__toggle_selector {\n  width: calc(50% - 8px);\n  background: white;\n  position: absolute;\n  border-radius: 5px;\n  height: calc(100% - 8px);\n  top: 4px;\n  transition: all 0.2s ease-in-out;\n  transform: translate3d(4px, 0, 0);\n}\n\n.walletconnect-modal__mobile__toggle.right__selected .walletconnect-modal__mobile__toggle_selector {\n  transform: translate3d(calc(100% + 12px), 0, 0);\n}\n\n.walletconnect-modal__mobile__toggle a {\n  font-size: 12px;\n  width: 50%;\n  text-align: center;\n  padding: 8px;\n  margin: 0;\n  font-weight: 600;\n  z-index: 1;\n}\n\n.walletconnect-modal__footer {\n  display: flex;\n  justify-content: center;\n  margin-top: 20px;\n}\n\n@media only screen and (max-width: 768px) {\n  .walletconnect-modal__footer {\n    margin-top: 5vw;\n  }\n}\n\n.walletconnect-modal__footer a {\n  cursor: pointer;\n  color: #898d97;\n  font-size: 15px;\n  margin: 0 auto;\n}\n\n@media only screen and (max-width: 320px) {\n  .walletconnect-modal__footer a {\n    font-size: 14px;\n  }\n}\n\n.walletconnect-connect__buttons__wrapper {\n  max-height: 44vh;\n}\n\n.walletconnect-connect__buttons__wrapper__android {\n  margin: 50% 0;\n}\n\n.walletconnect-connect__buttons__wrapper__wrap {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  margin: 10px 0;\n}\n\n@media only screen and (min-width: 768px) {\n  .walletconnect-connect__buttons__wrapper__wrap {\n    margin-top: 40px;\n  }\n}\n\n.walletconnect-connect__button {\n  background-color: rgb(64, 153, 255);\n  padding: 12px;\n  border-radius: 8px;\n  text-decoration: none;\n  color: rgb(255, 255, 255);\n  font-weight: 500;\n}\n\n.walletconnect-connect__button__icon_anchor {\n  cursor: pointer;\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  margin: 8px;\n  width: 42px;\n  justify-self: center;\n  flex-direction: column;\n  text-decoration: none !important;\n}\n\n@media only screen and (max-width: 320px) {\n  .walletconnect-connect__button__icon_anchor {\n    margin: 4px;\n  }\n}\n\n.walletconnect-connect__button__icon {\n  border-radius: 10px;\n  height: 42px;\n  margin: 0;\n  width: 42px;\n  background-size: cover !important;\n  box-shadow: 0 4px 12px 0 rgba(37, 41, 46, 0.25);\n}\n\n.walletconnect-connect__button__text {\n  color: #424952;\n  font-size: 2.7vw;\n  text-decoration: none !important;\n  padding: 0;\n  margin-top: 1.8vw;\n  font-weight: 600;\n}\n\n@media only screen and (min-width: 768px) {\n  .walletconnect-connect__button__text {\n    font-size: 16px;\n    margin-top: 12px;\n  }\n}\n\n.walletconnect-search__input {\n  border: none;\n  background: #d4d5d9;\n  border-style: none;\n  padding: 8px 16px;\n  outline: none;\n  font-style: normal;\n  font-stretch: normal;\n  font-size: 16px;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  border-radius: 8px;\n  width: calc(100% - 16px);\n  margin: 0;\n  margin-bottom: 8px;\n}\n"; // A type of promise-like that resolves synchronously and supports only one observer

var _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator"; // Asynchronously iterate through an object's values


var _asyncIteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator"; // Asynchronously iterate on a value using it's async iterator if present, or its synchronous iterator if missing


function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
} // Asynchronously await a promise and pass the result to a finally continuation


var WALLETCONNECT_LOGO_SVG_URL = "data:image/svg+xml,%3Csvg height='185' viewBox='0 0 300 185' width='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m61.4385429 36.2562612c48.9112241-47.8881663 128.2119871-47.8881663 177.1232091 0l5.886545 5.7634174c2.445561 2.3944081 2.445561 6.2765112 0 8.6709204l-20.136695 19.715503c-1.222781 1.1972051-3.2053 1.1972051-4.428081 0l-8.100584-7.9311479c-34.121692-33.4079817-89.443886-33.4079817-123.5655788 0l-8.6750562 8.4936051c-1.2227816 1.1972041-3.205301 1.1972041-4.4280806 0l-20.1366949-19.7155031c-2.4455612-2.3944092-2.4455612-6.2765122 0-8.6709204zm218.7677961 40.7737449 17.921697 17.546897c2.445549 2.3943969 2.445563 6.2764769.000031 8.6708899l-80.810171 79.121134c-2.445544 2.394426-6.410582 2.394453-8.85616.000062-.00001-.00001-.000022-.000022-.000032-.000032l-57.354143-56.154572c-.61139-.598602-1.60265-.598602-2.21404 0-.000004.000004-.000007.000008-.000011.000011l-57.3529212 56.154531c-2.4455368 2.394432-6.4105755 2.394472-8.8561612.000087-.0000143-.000014-.0000296-.000028-.0000449-.000044l-80.81241943-79.122185c-2.44556021-2.394408-2.44556021-6.2765115 0-8.6709197l17.92172963-17.5468673c2.4455602-2.3944082 6.4105989-2.3944082 8.8561602 0l57.3549775 56.155357c.6113908.598602 1.602649.598602 2.2140398 0 .0000092-.000009.0000174-.000017.0000265-.000024l57.3521031-56.155333c2.445505-2.3944633 6.410544-2.3945531 8.856161-.0002.000034.0000336.000068.0000673.000101.000101l57.354902 56.155432c.61139.598601 1.60265.598601 2.21404 0l57.353975-56.1543249c2.445561-2.3944092 6.410599-2.3944092 8.85616 0z' fill='%233b99fc'/%3E%3C/svg%3E";
var WALLETCONNECT_HEADER_TEXT = "WalletConnect";
var ANIMATION_DURATION = 300;
var DEFAULT_BUTTON_COLOR = "rgb(64, 153, 255)";
var WALLETCONNECT_WRAPPER_ID = "walletconnect-wrapper";
var WALLETCONNECT_STYLE_ID = "walletconnect-style-sheet";
var WALLETCONNECT_MODAL_ID = "walletconnect-qrcode-modal";
var WALLETCONNECT_CLOSE_BUTTON_ID = "walletconnect-qrcode-close";
var WALLETCONNECT_CTA_TEXT_ID = "walletconnect-qrcode-text";
var WALLETCONNECT_CONNECT_BUTTON_ID = "walletconnect-connect-button";

function Header(props) {
  return React.createElement("div", {
    className: "walletconnect-modal__header"
  }, React.createElement("img", {
    src: WALLETCONNECT_LOGO_SVG_URL,
    className: "walletconnect-modal__headerLogo"
  }), React.createElement("p", null, WALLETCONNECT_HEADER_TEXT), React.createElement("div", {
    className: "walletconnect-modal__close__wrapper",
    onClick: props.onClose
  }, React.createElement("div", {
    id: WALLETCONNECT_CLOSE_BUTTON_ID,
    className: "walletconnect-modal__close__icon"
  }, React.createElement("div", {
    className: "walletconnect-modal__close__line1"
  }), React.createElement("div", {
    className: "walletconnect-modal__close__line2"
  }))));
}

function ConnectButton(props) {
  return React.createElement("a", {
    className: "walletconnect-connect__button",
    href: props.href,
    id: WALLETCONNECT_CONNECT_BUTTON_ID + "-" + props.name,
    onClick: props.onClick,
    rel: "noopener noreferrer",
    style: {
      backgroundColor: props.color
    },
    target: "_blank"
  }, props.name);
}

var CARET_SVG_URL = "data:image/svg+xml,%3Csvg fill='none' height='18' viewBox='0 0 8 18' width='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath clip-rule='evenodd' d='m.586301.213898c-.435947.33907-.5144813.967342-.175411 1.403292l4.87831 6.27212c.28087.36111.28087.86677 0 1.22788l-4.878311 6.27211c-.33907.436-.260536 1.0642.175412 1.4033.435949.3391 1.064219.2605 1.403289-.1754l4.87832-6.2721c.84259-1.08336.84259-2.60034 0-3.68367l-4.87832-6.27212c-.33907-.4359474-.96734-.514482-1.403289-.175412z' fill='%233c4252' fill-rule='evenodd'/%3E%3C/svg%3E";

function WalletButton(props) {
  var color = props.color;
  var href = props.href;
  var name = props.name;
  var logo = props.logo;
  var onClick = props.onClick;
  return React.createElement("a", {
    className: "walletconnect-modal__base__row",
    href: href,
    onClick: onClick,
    rel: "noopener noreferrer",
    target: "_blank"
  }, React.createElement("h3", {
    className: "walletconnect-modal__base__row__h3"
  }, name), React.createElement("div", {
    className: "walletconnect-modal__base__row__right"
  }, React.createElement("div", {
    className: "walletconnect-modal__base__row__right__app-icon",
    style: {
      background: "url('" + logo + "') " + color,
      backgroundSize: "100%"
    }
  }), React.createElement("img", {
    src: CARET_SVG_URL,
    className: "walletconnect-modal__base__row__right__caret"
  })));
}

function WalletIcon(props) {
  var color = props.color;
  var href = props.href;
  var name = props.name;
  var logo = props.logo;
  var onClick = props.onClick;
  var fontSize = window.innerWidth < 768 ? (name.length > 8 ? 2.5 : 2.7) + "vw" : "inherit";
  return React.createElement("a", {
    className: "walletconnect-connect__button__icon_anchor",
    href: href,
    onClick: onClick,
    rel: "noopener noreferrer",
    target: "_blank"
  }, React.createElement("div", {
    className: "walletconnect-connect__button__icon",
    style: {
      background: "url('" + logo + "') " + color,
      backgroundSize: "100%"
    }
  }), React.createElement("div", {
    style: {
      fontSize: fontSize
    },
    className: "walletconnect-connect__button__text"
  }, name));
}

var GRID_MIN_COUNT = 5;
var LINKS_PER_PAGE = 12;

function LinkDisplay(props) {
  var android = browserUtils.isAndroid();
  var ref = React.useState("");
  var input = ref[0];
  var setInput = ref[1];
  var ref$1 = React.useState("");
  var filter = ref$1[0];
  var setFilter = ref$1[1];
  var ref$2 = React.useState(1);
  var page = ref$2[0];
  var setPage = ref$2[1];
  var links = filter ? props.links.filter(function (link) {
    return link.name.toLowerCase().includes(filter.toLowerCase());
  }) : props.links;
  var errorMessage = props.errorMessage;
  var grid = filter || links.length > GRID_MIN_COUNT;
  var pages = Math.ceil(links.length / LINKS_PER_PAGE);
  var range = [(page - 1) * LINKS_PER_PAGE + 1, page * LINKS_PER_PAGE];
  var pageLinks = links.length ? links.filter(function (_, index) {
    return index + 1 >= range[0] && index + 1 <= range[1];
  }) : [];
  var hasPaging = !!(!android && pages > 1);
  var filterTimeout = undefined;

  function handleInput(e) {
    setInput(e.target.value);
    clearTimeout(filterTimeout);

    if (e.target.value) {
      filterTimeout = setTimeout(function () {
        setFilter(e.target.value);
        setPage(1);
      }, 1000);
    } else {
      setInput("");
      setFilter("");
      setPage(1);
    }
  }

  return React.createElement("div", null, React.createElement("p", {
    id: WALLETCONNECT_CTA_TEXT_ID,
    className: "walletconnect-qrcode__text"
  }, android ? props.text.connect_mobile_wallet : props.text.choose_preferred_wallet), !android && React.createElement("input", {
    className: "walletconnect-search__input",
    placeholder: "Search",
    value: input,
    onChange: handleInput
  }), React.createElement("div", {
    className: "walletconnect-connect__buttons__wrapper" + (android ? "__android" : grid && links.length ? "__wrap" : "")
  }, !android ? pageLinks.length ? pageLinks.map(function (entry) {
    var color = entry.color;
    var name = entry.name;
    var shortName = entry.shortName;
    var logo = entry.logo;
    var href = browserUtils.formatIOSMobile(props.uri, entry);
    var handleClickIOS = React.useCallback(function () {
      browserUtils.saveMobileLinkInfo({
        name: name,
        href: href
      });
    }, [pageLinks]);
    return !grid ? React.createElement(WalletButton, {
      color: color,
      href: href,
      name: name,
      logo: logo,
      onClick: handleClickIOS
    }) : React.createElement(WalletIcon, {
      color: color,
      href: href,
      name: shortName || name,
      logo: logo,
      onClick: handleClickIOS
    });
  }) : React.createElement(React.Fragment, null, React.createElement("p", null, errorMessage.length ? props.errorMessage : !!props.links.length && !links.length ? props.text.no_wallets_found : props.text.loading)) : React.createElement(ConnectButton, {
    name: props.text.connect,
    color: DEFAULT_BUTTON_COLOR,
    href: props.uri,
    onClick: React.useCallback(function () {
      browserUtils.saveMobileLinkInfo({
        name: "Unknown",
        href: props.uri
      });
    }, [])
  })), hasPaging && React.createElement("div", {
    className: "walletconnect-modal__footer"
  }, Array(pages).fill(0).map(function (_, index) {
    var pageNumber = index + 1;
    var selected = page === pageNumber;
    return React.createElement("a", {
      style: {
        margin: "auto 10px",
        fontWeight: selected ? "bold" : "normal"
      },
      onClick: function onClick() {
        return setPage(pageNumber);
      }
    }, pageNumber);
  })));
}

function Notification(props) {
  var show = !!props.message.trim();
  return React.createElement("div", {
    className: "walletconnect-qrcode__notification" + (show ? " notification__show" : "")
  }, props.message);
}

var formatQRCodeImage = function formatQRCodeImage(data) {
  try {
    var result = "";
    return Promise.resolve(QRCode.toString(data, {
      margin: 0,
      type: "svg"
    })).then(function (dataString) {
      if (typeof dataString === "string") {
        result = dataString.replace("<svg", "<svg class=\"walletconnect-qrcode__image\"");
      }

      return result;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

function QRCodeDisplay(props) {
  var ref = React.useState("");
  var notification = ref[0];
  var setNotification = ref[1];
  var ref$1 = React.useState("");
  var svg = ref$1[0];
  var setSvg = ref$1[1];
  React.useEffect(function () {
    try {
      return Promise.resolve(formatQRCodeImage(props.uri)).then(function (_formatQRCodeImage) {
        setSvg(_formatQRCodeImage);
      });
    } catch (e) {
      Promise.reject(e);
    }
  }, []);

  var copyToClipboard = function copyToClipboard() {
    var success = copy(props.uri);

    if (success) {
      setNotification(props.text.copied_to_clipboard);
      setInterval(function () {
        return setNotification("");
      }, 1200);
    } else {
      setNotification("Error");
      setInterval(function () {
        return setNotification("");
      }, 1200);
    }
  };

  return React.createElement("div", null, React.createElement("p", {
    id: WALLETCONNECT_CTA_TEXT_ID,
    className: "walletconnect-qrcode__text"
  }, props.text.scan_qrcode_with_wallet), React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: svg
    }
  }), React.createElement("div", {
    className: "walletconnect-modal__footer"
  }, React.createElement("a", {
    onClick: copyToClipboard
  }, props.text.copy_to_clipboard)), React.createElement(Notification, {
    message: notification
  }));
}

function Modal(props) {
  var android = browserUtils.isAndroid();
  var mobile = browserUtils.isMobile();
  var whitelist = mobile ? props.qrcodeModalOptions && props.qrcodeModalOptions.mobileLinks ? props.qrcodeModalOptions.mobileLinks : undefined : props.qrcodeModalOptions && props.qrcodeModalOptions.desktopLinks ? props.qrcodeModalOptions.desktopLinks : undefined;
  var ref = React.useState(false);
  var loading = ref[0];
  var setLoading = ref[1];
  var ref$1 = React.useState(false);
  var fetched = ref$1[0];
  var setFetched = ref$1[1];
  var ref$2 = React.useState(!mobile);
  var displayQRCode = ref$2[0];
  var setDisplayQRCode = ref$2[1];
  var displayProps = {
    mobile: mobile,
    text: props.text,
    uri: props.uri,
    qrcodeModalOptions: props.qrcodeModalOptions
  };
  var ref$3 = React.useState("");
  var singleLinkHref = ref$3[0];
  var setSingleLinkHref = ref$3[1];
  var ref$4 = React.useState(false);
  var hasSingleLink = ref$4[0];
  var setHasSingleLink = ref$4[1];
  var ref$5 = React.useState([]);
  var links = ref$5[0];
  var setLinks = ref$5[1];
  var ref$6 = React.useState("");
  var errorMessage = ref$6[0];
  var setErrorMessage = ref$6[1];

  var getLinksIfNeeded = function getLinksIfNeeded() {
    if (fetched || loading || whitelist && !whitelist.length || links.length > 0) {
      return;
    }

    React.useEffect(function () {
      var initLinks = function initLinks() {
        try {
          if (android) {
            return Promise.resolve();
          }

          setLoading(true);

          var _temp = _catch(function () {
            var url = props.qrcodeModalOptions && props.qrcodeModalOptions.registryUrl ? props.qrcodeModalOptions.registryUrl : browserUtils.getWalletRegistryUrl();
            return Promise.resolve(fetch(url)).then(function (registryResponse) {
              return Promise.resolve(registryResponse.json()).then(function (_registryResponse$jso) {
                var registry = _registryResponse$jso.listings;
                var platform = mobile ? "mobile" : "desktop";

                var _links = browserUtils.getMobileLinkRegistry(browserUtils.formatMobileRegistry(registry, platform), whitelist);

                setLoading(false);
                setFetched(true);
                setErrorMessage(!_links.length ? props.text.no_supported_wallets : "");
                setLinks(_links);
                var hasSingleLink = _links.length === 1;

                if (hasSingleLink) {
                  setSingleLinkHref(browserUtils.formatIOSMobile(props.uri, _links[0]));
                  setDisplayQRCode(true);
                }

                setHasSingleLink(hasSingleLink);
              });
            });
          }, function (e) {
            setLoading(false);
            setFetched(true);
            setErrorMessage(props.text.something_went_wrong);
            console.error(e);
          });

          return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      };

      initLinks();
    });
  };

  getLinksIfNeeded();
  var rightSelected = mobile ? displayQRCode : !displayQRCode;
  return React.createElement("div", {
    id: WALLETCONNECT_MODAL_ID,
    className: "walletconnect-qrcode__base animated fadeIn"
  }, React.createElement("div", {
    className: "walletconnect-modal__base"
  }, React.createElement(Header, {
    onClose: props.onClose
  }), hasSingleLink && displayQRCode ? React.createElement("div", {
    className: "walletconnect-modal__single_wallet"
  }, React.createElement("a", {
    onClick: function onClick() {
      return browserUtils.saveMobileLinkInfo({
        name: links[0].name,
        href: singleLinkHref
      });
    },
    href: singleLinkHref,
    rel: "noopener noreferrer",
    target: "_blank"
  }, props.text.connect_with + " " + (hasSingleLink ? links[0].name : "") + " ›")) : android || loading || !loading && links.length ? React.createElement("div", {
    className: "walletconnect-modal__mobile__toggle" + (rightSelected ? " right__selected" : "")
  }, React.createElement("div", {
    className: "walletconnect-modal__mobile__toggle_selector"
  }), mobile ? React.createElement(React.Fragment, null, React.createElement("a", {
    onClick: function onClick() {
      return setDisplayQRCode(false), getLinksIfNeeded();
    }
  }, props.text.mobile), React.createElement("a", {
    onClick: function onClick() {
      return setDisplayQRCode(true);
    }
  }, props.text.qrcode)) : React.createElement(React.Fragment, null, React.createElement("a", {
    onClick: function onClick() {
      return setDisplayQRCode(true);
    }
  }, props.text.qrcode), React.createElement("a", {
    onClick: function onClick() {
      return setDisplayQRCode(false), getLinksIfNeeded();
    }
  }, props.text.desktop))) : null, React.createElement("div", null, displayQRCode || !android && !loading && !links.length ? React.createElement(QRCodeDisplay, Object.assign({}, displayProps)) : React.createElement(LinkDisplay, Object.assign({}, displayProps, {
    links: links,
    errorMessage: errorMessage
  })))));
}

var de = {
  choose_preferred_wallet: "Wähle bevorzugte Wallet",
  connect_mobile_wallet: "Verbinde mit Mobile Wallet",
  scan_qrcode_with_wallet: "Scanne den QR-code mit einer WalletConnect kompatiblen Wallet",
  connect: "Verbinden",
  qrcode: "QR-Code",
  mobile: "Mobile",
  desktop: "Desktop",
  copy_to_clipboard: "In die Zwischenablage kopieren",
  copied_to_clipboard: "In die Zwischenablage kopiert!",
  connect_with: "Verbinden mit Hilfe von",
  loading: "Laden...",
  something_went_wrong: "Etwas ist schief gelaufen",
  no_supported_wallets: "Es gibt noch keine unterstützten Wallet",
  no_wallets_found: "keine Wallet gefunden"
};
var en = {
  choose_preferred_wallet: "Choose your preferred wallet",
  connect_mobile_wallet: "Connect to Mobile Wallet",
  scan_qrcode_with_wallet: "Scan QR code with a WalletConnect-compatible wallet",
  connect: "Connect",
  qrcode: "QR Code",
  mobile: "Mobile",
  desktop: "Desktop",
  copy_to_clipboard: "Copy to clipboard",
  copied_to_clipboard: "Copied to clipboard!",
  connect_with: "Connect with",
  loading: "Loading...",
  something_went_wrong: "Something went wrong",
  no_supported_wallets: "There are no supported wallets yet",
  no_wallets_found: "No wallets found"
};
var es = {
  choose_preferred_wallet: "Elige tu billetera preferida",
  connect_mobile_wallet: "Conectar a billetera móvil",
  scan_qrcode_with_wallet: "Escanea el código QR con una billetera compatible con WalletConnect",
  connect: "Conectar",
  qrcode: "Código QR",
  mobile: "Móvil",
  desktop: "Desktop",
  copy_to_clipboard: "Copiar",
  copied_to_clipboard: "Copiado!",
  connect_with: "Conectar mediante",
  loading: "Cargando...",
  something_went_wrong: "Algo salió mal",
  no_supported_wallets: "Todavía no hay billeteras compatibles",
  no_wallets_found: "No se encontraron billeteras"
};
var fr = {
  choose_preferred_wallet: "Choisissez votre portefeuille préféré",
  connect_mobile_wallet: "Se connecter au portefeuille mobile",
  scan_qrcode_with_wallet: "Scannez le QR code avec un portefeuille compatible WalletConnect",
  connect: "Se connecter",
  qrcode: "QR Code",
  mobile: "Mobile",
  desktop: "Desktop",
  copy_to_clipboard: "Copier",
  copied_to_clipboard: "Copié!",
  connect_with: "Connectez-vous à l'aide de",
  loading: "Chargement...",
  something_went_wrong: "Quelque chose a mal tourné",
  no_supported_wallets: "Il n'y a pas encore de portefeuilles pris en charge",
  no_wallets_found: "Aucun portefeuille trouvé"
};
var ko = {
  choose_preferred_wallet: "원하는 지갑을 선택하세요",
  connect_mobile_wallet: "모바일 지갑과 연결",
  scan_qrcode_with_wallet: "WalletConnect 지원 지갑에서 QR코드를 스캔하세요",
  connect: "연결",
  qrcode: "QR 코드",
  mobile: "모바일",
  desktop: "데스크탑",
  copy_to_clipboard: "클립보드에 복사",
  copied_to_clipboard: "클립보드에 복사되었습니다!",
  connect_with: "와 연결하다",
  loading: "로드 중...",
  something_went_wrong: "문제가 발생했습니다.",
  no_supported_wallets: "아직 지원되는 지갑이 없습니다",
  no_wallets_found: "지갑을 찾을 수 없습니다"
};
var pt = {
  choose_preferred_wallet: "Escolha sua carteira preferida",
  connect_mobile_wallet: "Conectar-se à carteira móvel",
  scan_qrcode_with_wallet: "Ler o código QR com uma carteira compatível com WalletConnect",
  connect: "Conectar",
  qrcode: "Código QR",
  mobile: "Móvel",
  desktop: "Desktop",
  copy_to_clipboard: "Copiar",
  copied_to_clipboard: "Copiado!",
  connect_with: "Ligar por meio de",
  loading: "Carregamento...",
  something_went_wrong: "Algo correu mal",
  no_supported_wallets: "Ainda não há carteiras suportadas",
  no_wallets_found: "Nenhuma carteira encontrada"
};
var zh = {
  choose_preferred_wallet: "选择你的钱包",
  connect_mobile_wallet: "连接至移动端钱包",
  scan_qrcode_with_wallet: "使用兼容 WalletConnect 的钱包扫描二维码",
  connect: "连接",
  qrcode: "二维码",
  mobile: "移动",
  desktop: "桌面",
  copy_to_clipboard: "复制到剪贴板",
  copied_to_clipboard: "复制到剪贴板成功！",
  connect_with: "通过以下方式连接",
  loading: "正在加载...",
  something_went_wrong: "出了问题",
  no_supported_wallets: "目前还没有支持的钱包",
  no_wallets_found: "没有找到钱包"
};
var fa = {
  choose_preferred_wallet: "کیف پول مورد نظر خود را انتخاب کنید",
  connect_mobile_wallet: "به کیف پول موبایل وصل شوید",
  scan_qrcode_with_wallet: "کد QR را با یک کیف پول سازگار با WalletConnect اسکن کنید",
  connect: "اتصال",
  qrcode: "کد QR",
  mobile: "سیار",
  desktop: "دسکتاپ",
  copy_to_clipboard: "کپی به کلیپ بورد",
  copied_to_clipboard: "در کلیپ بورد کپی شد!",
  connect_with: "ارتباط با",
  loading: "...بارگذاری",
  something_went_wrong: "مشکلی پیش آمد",
  no_supported_wallets: "هنوز هیچ کیف پول پشتیبانی شده ای وجود ندارد",
  no_wallets_found: "هیچ کیف پولی پیدا نشد"
};
var languages = {
  de: de,
  en: en,
  es: es,
  fr: fr,
  ko: ko,
  pt: pt,
  zh: zh,
  fa: fa
};

function injectStyleSheet() {
  var doc = browserUtils.getDocumentOrThrow();
  var prev = doc.getElementById(WALLETCONNECT_STYLE_ID);

  if (prev) {
    doc.head.removeChild(prev);
  }

  var style = doc.createElement("style");
  style.setAttribute("id", WALLETCONNECT_STYLE_ID);
  style.innerText = WALLETCONNECT_STYLE_SHEET;
  doc.head.appendChild(style);
}

function renderWrapper() {
  var doc = browserUtils.getDocumentOrThrow();
  var wrapper = doc.createElement("div");
  wrapper.setAttribute("id", WALLETCONNECT_WRAPPER_ID);
  doc.body.appendChild(wrapper);
  return wrapper;
}

function triggerCloseAnimation() {
  var doc = browserUtils.getDocumentOrThrow();
  var modal = doc.getElementById(WALLETCONNECT_MODAL_ID);

  if (modal) {
    modal.className = modal.className.replace("fadeIn", "fadeOut");
    setTimeout(function () {
      var wrapper = doc.getElementById(WALLETCONNECT_WRAPPER_ID);

      if (wrapper) {
        doc.body.removeChild(wrapper);
      }
    }, ANIMATION_DURATION);
  }
}

function getWrappedCallback(cb) {
  return function () {
    triggerCloseAnimation();

    if (cb) {
      cb();
    }
  };
}

function getText() {
  var lang = browserUtils.getNavigatorOrThrow().language.split("-")[0] || "en";
  return languages[lang] || languages["en"];
}

function open$1(uri, cb, qrcodeModalOptions) {
  injectStyleSheet();
  var wrapper = renderWrapper();
  React.render(React.createElement(Modal, {
    text: getText(),
    uri: uri,
    onClose: getWrappedCallback(cb),
    qrcodeModalOptions: qrcodeModalOptions
  }), wrapper);
}

function close$1() {
  triggerCloseAnimation();
}

var isNode = function isNode() {
  return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
};

function open$2(uri, cb, qrcodeModalOptions) {
  console.log(uri);

  if (isNode()) {
    open(uri);
  } else {
    open$1(uri, cb, qrcodeModalOptions);
  }
}

function close$2() {
  if (isNode()) ;else {
    close$1();
  }
}

var index = {
  open: open$2,
  close: close$2
};
module.exports = index;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(19)))

/***/ }),

/***/ 642:
/***/ (function(module, exports, __webpack_require__) {

var canPromise = __webpack_require__(643);

var QRCode = __webpack_require__(644);

var CanvasRenderer = __webpack_require__(661);

var SvgRenderer = __webpack_require__(662);

function renderCanvas(renderFunc, canvas, text, opts, cb) {
  var args = [].slice.call(arguments, 1);
  var argsNum = args.length;
  var isLastArgCb = typeof args[argsNum - 1] === 'function';

  if (!isLastArgCb && !canPromise()) {
    throw new Error('Callback required as last argument');
  }

  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error('Too few arguments provided');
    }

    if (argsNum === 2) {
      cb = text;
      text = canvas;
      canvas = opts = undefined;
    } else if (argsNum === 3) {
      if (canvas.getContext && typeof cb === 'undefined') {
        cb = opts;
        opts = undefined;
      } else {
        cb = opts;
        opts = text;
        text = canvas;
        canvas = undefined;
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error('Too few arguments provided');
    }

    if (argsNum === 1) {
      text = canvas;
      canvas = opts = undefined;
    } else if (argsNum === 2 && !canvas.getContext) {
      opts = text;
      text = canvas;
      canvas = undefined;
    }

    return new Promise(function (resolve, reject) {
      try {
        var data = QRCode.create(text, opts);
        resolve(renderFunc(data, canvas, opts));
      } catch (e) {
        reject(e);
      }
    });
  }

  try {
    var data = QRCode.create(text, opts);
    cb(null, renderFunc(data, canvas, opts));
  } catch (e) {
    cb(e);
  }
}

exports.create = QRCode.create;
exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL); // only svg for now.

exports.toString = renderCanvas.bind(null, function (data, _, opts) {
  return SvgRenderer.render(data, opts);
});

/***/ }),

/***/ 643:
/***/ (function(module, exports) {

// can-promise has a crash in some versions of react native that dont have
// standard global objects
// https://github.com/soldair/node-qrcode/issues/157
module.exports = function () {
  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then;
};

/***/ }),

/***/ 644:
/***/ (function(module, exports, __webpack_require__) {

var BufferUtil = __webpack_require__(587);

var Utils = __webpack_require__(585);

var ECLevel = __webpack_require__(598);

var BitBuffer = __webpack_require__(645);

var BitMatrix = __webpack_require__(646);

var AlignmentPattern = __webpack_require__(647);

var FinderPattern = __webpack_require__(648);

var MaskPattern = __webpack_require__(649);

var ECCode = __webpack_require__(621);

var ReedSolomonEncoder = __webpack_require__(650);

var Version = __webpack_require__(653);

var FormatInfo = __webpack_require__(654);

var Mode = __webpack_require__(586);

var Segments = __webpack_require__(655);

var isArray = __webpack_require__(597);
/**
 * QRCode for JavaScript
 *
 * modified by Ryan Day for nodejs support
 * Copyright (c) 2011 Ryan Day
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
*/

/**
 * Add finder patterns bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */


function setupFinderPattern(matrix, version) {
  var size = matrix.size;
  var pos = FinderPattern.getPositions(version);

  for (var i = 0; i < pos.length; i++) {
    var row = pos[i][0];
    var col = pos[i][1];

    for (var r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r) continue;

      for (var c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c) continue;

        if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          matrix.set(row + r, col + c, true, true);
        } else {
          matrix.set(row + r, col + c, false, true);
        }
      }
    }
  }
}
/**
 * Add timing pattern bits to matrix
 *
 * Note: this function must be called before {@link setupAlignmentPattern}
 *
 * @param  {BitMatrix} matrix Modules matrix
 */


function setupTimingPattern(matrix) {
  var size = matrix.size;

  for (var r = 8; r < size - 8; r++) {
    var value = r % 2 === 0;
    matrix.set(r, 6, value, true);
    matrix.set(6, r, value, true);
  }
}
/**
 * Add alignment patterns bits to matrix
 *
 * Note: this function must be called after {@link setupTimingPattern}
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */


function setupAlignmentPattern(matrix, version) {
  var pos = AlignmentPattern.getPositions(version);

  for (var i = 0; i < pos.length; i++) {
    var row = pos[i][0];
    var col = pos[i][1];

    for (var r = -2; r <= 2; r++) {
      for (var c = -2; c <= 2; c++) {
        if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
          matrix.set(row + r, col + c, true, true);
        } else {
          matrix.set(row + r, col + c, false, true);
        }
      }
    }
  }
}
/**
 * Add version info bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */


function setupVersionInfo(matrix, version) {
  var size = matrix.size;
  var bits = Version.getEncodedBits(version);
  var row, col, mod;

  for (var i = 0; i < 18; i++) {
    row = Math.floor(i / 3);
    col = i % 3 + size - 8 - 3;
    mod = (bits >> i & 1) === 1;
    matrix.set(row, col, mod, true);
    matrix.set(col, row, mod, true);
  }
}
/**
 * Add format info bits to matrix
 *
 * @param  {BitMatrix} matrix               Modules matrix
 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
 * @param  {Number}    maskPattern          Mask pattern reference value
 */


function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
  var size = matrix.size;
  var bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
  var i, mod;

  for (i = 0; i < 15; i++) {
    mod = (bits >> i & 1) === 1; // vertical

    if (i < 6) {
      matrix.set(i, 8, mod, true);
    } else if (i < 8) {
      matrix.set(i + 1, 8, mod, true);
    } else {
      matrix.set(size - 15 + i, 8, mod, true);
    } // horizontal


    if (i < 8) {
      matrix.set(8, size - i - 1, mod, true);
    } else if (i < 9) {
      matrix.set(8, 15 - i - 1 + 1, mod, true);
    } else {
      matrix.set(8, 15 - i - 1, mod, true);
    }
  } // fixed module


  matrix.set(size - 8, 8, 1, true);
}
/**
 * Add encoded data bits to matrix
 *
 * @param  {BitMatrix} matrix Modules matrix
 * @param  {Buffer}    data   Data codewords
 */


function setupData(matrix, data) {
  var size = matrix.size;
  var inc = -1;
  var row = size - 1;
  var bitIndex = 7;
  var byteIndex = 0;

  for (var col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;

    while (true) {
      for (var c = 0; c < 2; c++) {
        if (!matrix.isReserved(row, col - c)) {
          var dark = false;

          if (byteIndex < data.length) {
            dark = (data[byteIndex] >>> bitIndex & 1) === 1;
          }

          matrix.set(row, col - c, dark);
          bitIndex--;

          if (bitIndex === -1) {
            byteIndex++;
            bitIndex = 7;
          }
        }
      }

      row += inc;

      if (row < 0 || size <= row) {
        row -= inc;
        inc = -inc;
        break;
      }
    }
  }
}
/**
 * Create encoded codewords from data input
 *
 * @param  {Number}   version              QR Code version
 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
 * @param  {ByteData} data                 Data input
 * @return {Buffer}                        Buffer containing encoded codewords
 */


function createData(version, errorCorrectionLevel, segments) {
  // Prepare data buffer
  var buffer = new BitBuffer();
  segments.forEach(function (data) {
    // prefix data with mode indicator (4 bits)
    buffer.put(data.mode.bit, 4); // Prefix data with character count indicator.
    // The character count indicator is a string of bits that represents the
    // number of characters that are being encoded.
    // The character count indicator must be placed after the mode indicator
    // and must be a certain number of bits long, depending on the QR version
    // and data mode
    // @see {@link Mode.getCharCountIndicator}.

    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version)); // add binary data sequence to buffer

    data.write(buffer);
  }); // Calculate required number of bits

  var totalCodewords = Utils.getSymbolTotalCodewords(version);
  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
  var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8; // Add a terminator.
  // If the bit string is shorter than the total number of required bits,
  // a terminator of up to four 0s must be added to the right side of the string.
  // If the bit string is more than four bits shorter than the required number of bits,
  // add four 0s to the end.

  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
    buffer.put(0, 4);
  } // If the bit string is fewer than four bits shorter, add only the number of 0s that
  // are needed to reach the required number of bits.
  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
  // pad the string on the right with 0s to make the string's length a multiple of 8.


  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(0);
  } // Add pad bytes if the string is still shorter than the total number of required bits.
  // Extend the buffer to fill the data capacity of the symbol corresponding to
  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
  // and 00010001 (0x11) alternately.


  var remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;

  for (var i = 0; i < remainingByte; i++) {
    buffer.put(i % 2 ? 0x11 : 0xEC, 8);
  }

  return createCodewords(buffer, version, errorCorrectionLevel);
}
/**
 * Encode input data with Reed-Solomon and return codewords with
 * relative error correction bits
 *
 * @param  {BitBuffer} bitBuffer            Data to encode
 * @param  {Number}    version              QR Code version
 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
 * @return {Buffer}                         Buffer containing encoded codewords
 */


function createCodewords(bitBuffer, version, errorCorrectionLevel) {
  // Total codewords for this QR code version (Data + Error correction)
  var totalCodewords = Utils.getSymbolTotalCodewords(version); // Total number of error correction codewords

  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel); // Total number of data codewords

  var dataTotalCodewords = totalCodewords - ecTotalCodewords; // Total number of blocks

  var ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel); // Calculate how many blocks each group should contain

  var blocksInGroup2 = totalCodewords % ecTotalBlocks;
  var blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
  var totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
  var dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
  var dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1; // Number of EC codewords is the same for both groups

  var ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1; // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount

  var rs = new ReedSolomonEncoder(ecCount);
  var offset = 0;
  var dcData = new Array(ecTotalBlocks);
  var ecData = new Array(ecTotalBlocks);
  var maxDataSize = 0;
  var buffer = BufferUtil.from(bitBuffer.buffer); // Divide the buffer into the required number of blocks

  for (var b = 0; b < ecTotalBlocks; b++) {
    var dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2; // extract a block of data from buffer

    dcData[b] = buffer.slice(offset, offset + dataSize); // Calculate EC codewords for this data block

    ecData[b] = rs.encode(dcData[b]);
    offset += dataSize;
    maxDataSize = Math.max(maxDataSize, dataSize);
  } // Create final data
  // Interleave the data and error correction codewords from each block


  var data = BufferUtil.alloc(totalCodewords);
  var index = 0;
  var i, r; // Add data codewords

  for (i = 0; i < maxDataSize; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r].length) {
        data[index++] = dcData[r][i];
      }
    }
  } // Apped EC codewords


  for (i = 0; i < ecCount; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      data[index++] = ecData[r][i];
    }
  }

  return data;
}
/**
 * Build QR Code symbol
 *
 * @param  {String} data                 Input string
 * @param  {Number} version              QR Code version
 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
 * @param  {MaskPattern} maskPattern     Mask pattern
 * @return {Object}                      Object containing symbol data
 */


function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
  var segments;

  if (isArray(data)) {
    segments = Segments.fromArray(data);
  } else if (typeof data === 'string') {
    var estimatedVersion = version;

    if (!estimatedVersion) {
      var rawSegments = Segments.rawSplit(data); // Estimate best version that can contain raw splitted segments

      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
    } // Build optimized segments
    // If estimated version is undefined, try with the highest version


    segments = Segments.fromString(data, estimatedVersion || 40);
  } else {
    throw new Error('Invalid data');
  } // Get the min version that can contain data


  var bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel); // If no version is found, data cannot be stored

  if (!bestVersion) {
    throw new Error('The amount of data is too big to be stored in a QR Code');
  } // If not specified, use min version as default


  if (!version) {
    version = bestVersion; // Check if the specified version can contain the data
  } else if (version < bestVersion) {
    throw new Error('\n' + 'The chosen QR Code version cannot contain this amount of data.\n' + 'Minimum version required to store current data is: ' + bestVersion + '.\n');
  }

  var dataBits = createData(version, errorCorrectionLevel, segments); // Allocate matrix buffer

  var moduleCount = Utils.getSymbolSize(version);
  var modules = new BitMatrix(moduleCount); // Add function modules

  setupFinderPattern(modules, version);
  setupTimingPattern(modules);
  setupAlignmentPattern(modules, version); // Add temporary dummy bits for format info just to set them as reserved.
  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
  // since the masking operation must be performed only on the encoding region.
  // These blocks will be replaced with correct values later in code.

  setupFormatInfo(modules, errorCorrectionLevel, 0);

  if (version >= 7) {
    setupVersionInfo(modules, version);
  } // Add data codewords


  setupData(modules, dataBits);

  if (isNaN(maskPattern)) {
    // Find best mask pattern
    maskPattern = MaskPattern.getBestMask(modules, setupFormatInfo.bind(null, modules, errorCorrectionLevel));
  } // Apply mask pattern


  MaskPattern.applyMask(maskPattern, modules); // Replace format info bits with correct values

  setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
  return {
    modules: modules,
    version: version,
    errorCorrectionLevel: errorCorrectionLevel,
    maskPattern: maskPattern,
    segments: segments
  };
}
/**
 * QR Code
 *
 * @param {String | Array} data                 Input data
 * @param {Object} options                      Optional configurations
 * @param {Number} options.version              QR Code version
 * @param {String} options.errorCorrectionLevel Error correction level
 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
 */


exports.create = function create(data, options) {
  if (typeof data === 'undefined' || data === '') {
    throw new Error('No input text');
  }

  var errorCorrectionLevel = ECLevel.M;
  var version;
  var mask;

  if (typeof options !== 'undefined') {
    // Use higher error correction level as default
    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
    version = Version.from(options.version);
    mask = MaskPattern.from(options.maskPattern);

    if (options.toSJISFunc) {
      Utils.setToSJISFunction(options.toSJISFunc);
    }
  }

  return createSymbol(data, version, errorCorrectionLevel, mask);
};

/***/ }),

/***/ 645:
/***/ (function(module, exports) {

function BitBuffer() {
  this.buffer = [];
  this.length = 0;
}

BitBuffer.prototype = {
  get: function get(index) {
    var bufIndex = Math.floor(index / 8);
    return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
  },
  put: function put(num, length) {
    for (var i = 0; i < length; i++) {
      this.putBit((num >>> length - i - 1 & 1) === 1);
    }
  },
  getLengthInBits: function getLengthInBits() {
    return this.length;
  },
  putBit: function putBit(bit) {
    var bufIndex = Math.floor(this.length / 8);

    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }

    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
    }

    this.length++;
  }
};
module.exports = BitBuffer;

/***/ }),

/***/ 646:
/***/ (function(module, exports, __webpack_require__) {

var BufferUtil = __webpack_require__(587);
/**
 * Helper class to handle QR Code symbol modules
 *
 * @param {Number} size Symbol size
 */


function BitMatrix(size) {
  if (!size || size < 1) {
    throw new Error('BitMatrix size must be defined and greater than 0');
  }

  this.size = size;
  this.data = BufferUtil.alloc(size * size);
  this.reservedBit = BufferUtil.alloc(size * size);
}
/**
 * Set bit value at specified location
 * If reserved flag is set, this bit will be ignored during masking process
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 * @param {Boolean} reserved
 */


BitMatrix.prototype.set = function (row, col, value, reserved) {
  var index = row * this.size + col;
  this.data[index] = value;
  if (reserved) this.reservedBit[index] = true;
};
/**
 * Returns bit value at specified location
 *
 * @param  {Number}  row
 * @param  {Number}  col
 * @return {Boolean}
 */


BitMatrix.prototype.get = function (row, col) {
  return this.data[row * this.size + col];
};
/**
 * Applies xor operator at specified location
 * (used during masking process)
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 */


BitMatrix.prototype.xor = function (row, col, value) {
  this.data[row * this.size + col] ^= value;
};
/**
 * Check if bit at specified location is reserved
 *
 * @param {Number}   row
 * @param {Number}   col
 * @return {Boolean}
 */


BitMatrix.prototype.isReserved = function (row, col) {
  return this.reservedBit[row * this.size + col];
};

module.exports = BitMatrix;

/***/ }),

/***/ 647:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */
var getSymbolSize = __webpack_require__(585).getSymbolSize;
/**
 * Calculate the row/column coordinates of the center module of each alignment pattern
 * for the specified QR Code version.
 *
 * The alignment patterns are positioned symmetrically on either side of the diagonal
 * running from the top left corner of the symbol to the bottom right corner.
 *
 * Since positions are simmetrical only half of the coordinates are returned.
 * Each item of the array will represent in turn the x and y coordinate.
 * @see {@link getPositions}
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinate
 */


exports.getRowColCoords = function getRowColCoords(version) {
  if (version === 1) return [];
  var posCount = Math.floor(version / 7) + 2;
  var size = getSymbolSize(version);
  var intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
  var positions = [size - 7]; // Last coord is always (size - 7)

  for (var i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1] - intervals;
  }

  positions.push(6); // First coord is always 6

  return positions.reverse();
};
/**
 * Returns an array containing the positions of each alignment pattern.
 * Each array's element represent the center point of the pattern as (x, y) coordinates
 *
 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
 * and filtering out the items that overlaps with finder pattern
 *
 * @example
 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
 * The alignment patterns, therefore, are to be centered on (row, column)
 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
 * and are not therefore used for alignment patterns.
 *
 * var pos = getPositions(7)
 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */


exports.getPositions = function getPositions(version) {
  var coords = [];
  var pos = exports.getRowColCoords(version);
  var posLength = pos.length;

  for (var i = 0; i < posLength; i++) {
    for (var j = 0; j < posLength; j++) {
      // Skip if position is occupied by finder patterns
      if (i === 0 && j === 0 || // top-left
      i === 0 && j === posLength - 1 || // bottom-left
      i === posLength - 1 && j === 0) {
        // top-right
        continue;
      }

      coords.push([pos[i], pos[j]]);
    }
  }

  return coords;
};

/***/ }),

/***/ 648:
/***/ (function(module, exports, __webpack_require__) {

var getSymbolSize = __webpack_require__(585).getSymbolSize;

var FINDER_PATTERN_SIZE = 7;
/**
 * Returns an array containing the positions of each finder pattern.
 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */

exports.getPositions = function getPositions(version) {
  var size = getSymbolSize(version);
  return [// top-left
  [0, 0], // top-right
  [size - FINDER_PATTERN_SIZE, 0], // bottom-left
  [0, size - FINDER_PATTERN_SIZE]];
};

/***/ }),

/***/ 649:
/***/ (function(module, exports) {

/**
 * Data mask pattern reference
 * @type {Object}
 */
exports.Patterns = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};
/**
 * Weighted penalty scores for the undesirable features
 * @type {Object}
 */

var PenaltyScores = {
  N1: 3,
  N2: 3,
  N3: 40,
  N4: 10
};
/**
 * Check if mask pattern value is valid
 *
 * @param  {Number}  mask    Mask pattern
 * @return {Boolean}         true if valid, false otherwise
 */

exports.isValid = function isValid(mask) {
  return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7;
};
/**
 * Returns mask pattern from a value.
 * If value is not valid, returns undefined
 *
 * @param  {Number|String} value        Mask pattern value
 * @return {Number}                     Valid mask pattern or undefined
 */


exports.from = function from(value) {
  return exports.isValid(value) ? parseInt(value, 10) : undefined;
};
/**
* Find adjacent modules in row/column with the same color
* and assign a penalty value.
*
* Points: N1 + i
* i is the amount by which the number of adjacent modules of the same color exceeds 5
*/


exports.getPenaltyN1 = function getPenaltyN1(data) {
  var size = data.size;
  var points = 0;
  var sameCountCol = 0;
  var sameCountRow = 0;
  var lastCol = null;
  var lastRow = null;

  for (var row = 0; row < size; row++) {
    sameCountCol = sameCountRow = 0;
    lastCol = lastRow = null;

    for (var col = 0; col < size; col++) {
      var module = data.get(row, col);

      if (module === lastCol) {
        sameCountCol++;
      } else {
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        lastCol = module;
        sameCountCol = 1;
      }

      module = data.get(col, row);

      if (module === lastRow) {
        sameCountRow++;
      } else {
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
        lastRow = module;
        sameCountRow = 1;
      }
    }

    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
  }

  return points;
};
/**
 * Find 2x2 blocks with the same color and assign a penalty value
 *
 * Points: N2 * (m - 1) * (n - 1)
 */


exports.getPenaltyN2 = function getPenaltyN2(data) {
  var size = data.size;
  var points = 0;

  for (var row = 0; row < size - 1; row++) {
    for (var col = 0; col < size - 1; col++) {
      var last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
      if (last === 4 || last === 0) points++;
    }
  }

  return points * PenaltyScores.N2;
};
/**
 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
 * preceded or followed by light area 4 modules wide
 *
 * Points: N3 * number of pattern found
 */


exports.getPenaltyN3 = function getPenaltyN3(data) {
  var size = data.size;
  var points = 0;
  var bitsCol = 0;
  var bitsRow = 0;

  for (var row = 0; row < size; row++) {
    bitsCol = bitsRow = 0;

    for (var col = 0; col < size; col++) {
      bitsCol = bitsCol << 1 & 0x7FF | data.get(row, col);
      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++;
      bitsRow = bitsRow << 1 & 0x7FF | data.get(col, row);
      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++;
    }
  }

  return points * PenaltyScores.N3;
};
/**
 * Calculate proportion of dark modules in entire symbol
 *
 * Points: N4 * k
 *
 * k is the rating of the deviation of the proportion of dark modules
 * in the symbol from 50% in steps of 5%
 */


exports.getPenaltyN4 = function getPenaltyN4(data) {
  var darkCount = 0;
  var modulesCount = data.data.length;

  for (var i = 0; i < modulesCount; i++) {
    darkCount += data.data[i];
  }

  var k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
  return k * PenaltyScores.N4;
};
/**
 * Return mask value at given position
 *
 * @param  {Number} maskPattern Pattern reference value
 * @param  {Number} i           Row
 * @param  {Number} j           Column
 * @return {Boolean}            Mask value
 */


function getMaskAt(maskPattern, i, j) {
  switch (maskPattern) {
    case exports.Patterns.PATTERN000:
      return (i + j) % 2 === 0;

    case exports.Patterns.PATTERN001:
      return i % 2 === 0;

    case exports.Patterns.PATTERN010:
      return j % 3 === 0;

    case exports.Patterns.PATTERN011:
      return (i + j) % 3 === 0;

    case exports.Patterns.PATTERN100:
      return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;

    case exports.Patterns.PATTERN101:
      return i * j % 2 + i * j % 3 === 0;

    case exports.Patterns.PATTERN110:
      return (i * j % 2 + i * j % 3) % 2 === 0;

    case exports.Patterns.PATTERN111:
      return (i * j % 3 + (i + j) % 2) % 2 === 0;

    default:
      throw new Error('bad maskPattern:' + maskPattern);
  }
}
/**
 * Apply a mask pattern to a BitMatrix
 *
 * @param  {Number}    pattern Pattern reference number
 * @param  {BitMatrix} data    BitMatrix data
 */


exports.applyMask = function applyMask(pattern, data) {
  var size = data.size;

  for (var col = 0; col < size; col++) {
    for (var row = 0; row < size; row++) {
      if (data.isReserved(row, col)) continue;
      data.xor(row, col, getMaskAt(pattern, row, col));
    }
  }
};
/**
 * Returns the best mask pattern for data
 *
 * @param  {BitMatrix} data
 * @return {Number} Mask pattern reference number
 */


exports.getBestMask = function getBestMask(data, setupFormatFunc) {
  var numPatterns = Object.keys(exports.Patterns).length;
  var bestPattern = 0;
  var lowerPenalty = Infinity;

  for (var p = 0; p < numPatterns; p++) {
    setupFormatFunc(p);
    exports.applyMask(p, data); // Calculate penalty

    var penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data); // Undo previously applied mask

    exports.applyMask(p, data);

    if (penalty < lowerPenalty) {
      lowerPenalty = penalty;
      bestPattern = p;
    }
  }

  return bestPattern;
};

/***/ }),

/***/ 650:
/***/ (function(module, exports, __webpack_require__) {

var BufferUtil = __webpack_require__(587);

var Polynomial = __webpack_require__(651);

var Buffer = __webpack_require__(8).Buffer;

function ReedSolomonEncoder(degree) {
  this.genPoly = undefined;
  this.degree = degree;
  if (this.degree) this.initialize(this.degree);
}
/**
 * Initialize the encoder.
 * The input param should correspond to the number of error correction codewords.
 *
 * @param  {Number} degree
 */


ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
  // create an irreducible generator polynomial
  this.degree = degree;
  this.genPoly = Polynomial.generateECPolynomial(this.degree);
};
/**
 * Encodes a chunk of data
 *
 * @param  {Buffer} data Buffer containing input data
 * @return {Buffer}      Buffer containing encoded data
 */


ReedSolomonEncoder.prototype.encode = function encode(data) {
  if (!this.genPoly) {
    throw new Error('Encoder not initialized');
  } // Calculate EC for this data block
  // extends data size to data+genPoly size


  var pad = BufferUtil.alloc(this.degree);
  var paddedData = Buffer.concat([data, pad], data.length + this.degree); // The error correction codewords are the remainder after dividing the data codewords
  // by a generator polynomial

  var remainder = Polynomial.mod(paddedData, this.genPoly); // return EC data blocks (last n byte, where n is the degree of genPoly)
  // If coefficients number in remainder are less than genPoly degree,
  // pad with 0s to the left to reach the needed number of coefficients

  var start = this.degree - remainder.length;

  if (start > 0) {
    var buff = BufferUtil.alloc(this.degree);
    remainder.copy(buff, start);
    return buff;
  }

  return remainder;
};

module.exports = ReedSolomonEncoder;

/***/ }),

/***/ 651:
/***/ (function(module, exports, __webpack_require__) {

var BufferUtil = __webpack_require__(587);

var GF = __webpack_require__(652);
/**
 * Multiplies two polynomials inside Galois Field
 *
 * @param  {Buffer} p1 Polynomial
 * @param  {Buffer} p2 Polynomial
 * @return {Buffer}    Product of p1 and p2
 */


exports.mul = function mul(p1, p2) {
  var coeff = BufferUtil.alloc(p1.length + p2.length - 1);

  for (var i = 0; i < p1.length; i++) {
    for (var j = 0; j < p2.length; j++) {
      coeff[i + j] ^= GF.mul(p1[i], p2[j]);
    }
  }

  return coeff;
};
/**
 * Calculate the remainder of polynomials division
 *
 * @param  {Buffer} divident Polynomial
 * @param  {Buffer} divisor  Polynomial
 * @return {Buffer}          Remainder
 */


exports.mod = function mod(divident, divisor) {
  var result = BufferUtil.from(divident);

  while (result.length - divisor.length >= 0) {
    var coeff = result[0];

    for (var i = 0; i < divisor.length; i++) {
      result[i] ^= GF.mul(divisor[i], coeff);
    } // remove all zeros from buffer head


    var offset = 0;

    while (offset < result.length && result[offset] === 0) {
      offset++;
    }

    result = result.slice(offset);
  }

  return result;
};
/**
 * Generate an irreducible generator polynomial of specified degree
 * (used by Reed-Solomon encoder)
 *
 * @param  {Number} degree Degree of the generator polynomial
 * @return {Buffer}        Buffer containing polynomial coefficients
 */


exports.generateECPolynomial = function generateECPolynomial(degree) {
  var poly = BufferUtil.from([1]);

  for (var i = 0; i < degree; i++) {
    poly = exports.mul(poly, [1, GF.exp(i)]);
  }

  return poly;
};

/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

var BufferUtil = __webpack_require__(587);

var EXP_TABLE = BufferUtil.alloc(512);
var LOG_TABLE = BufferUtil.alloc(256)
/**
 * Precompute the log and anti-log tables for faster computation later
 *
 * For each possible value in the galois field 2^8, we will pre-compute
 * the logarithm and anti-logarithm (exponential) of this value
 *
 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
 */
;

(function initTables() {
  var x = 1;

  for (var i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1; // multiply by 2
    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
    // This means that when a number is 256 or larger, it should be XORed with 0x11D.

    if (x & 0x100) {
      // similar to x >= 256, but a lot faster (because 0x100 == 256)
      x ^= 0x11D;
    }
  } // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
  // stay inside the bounds (because we will mainly use this table for the multiplication of
  // two GF numbers, no more).
  // @see {@link mul}


  for (i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255];
  }
})();
/**
 * Returns log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */


exports.log = function log(n) {
  if (n < 1) throw new Error('log(' + n + ')');
  return LOG_TABLE[n];
};
/**
 * Returns anti-log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */


exports.exp = function exp(n) {
  return EXP_TABLE[n];
};
/**
 * Multiplies two number inside Galois Field
 *
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number}
 */


exports.mul = function mul(x, y) {
  if (x === 0 || y === 0) return 0; // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
  // @see {@link initTables}

  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
};

/***/ }),

/***/ 653:
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(585);

var ECCode = __webpack_require__(621);

var ECLevel = __webpack_require__(598);

var Mode = __webpack_require__(586);

var VersionCheck = __webpack_require__(622);

var isArray = __webpack_require__(597); // Generator polynomial used to encode version information


var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
var G18_BCH = Utils.getBCHDigit(G18);

function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
  for (var currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion;
    }
  }

  return undefined;
}

function getReservedBitsCount(mode, version) {
  // Character count indicator + mode indicator bits
  return Mode.getCharCountIndicator(mode, version) + 4;
}

function getTotalBitsFromDataArray(segments, version) {
  var totalBits = 0;
  segments.forEach(function (data) {
    var reservedBits = getReservedBitsCount(data.mode, version);
    totalBits += reservedBits + data.getBitsLength();
  });
  return totalBits;
}

function getBestVersionForMixedData(segments, errorCorrectionLevel) {
  for (var currentVersion = 1; currentVersion <= 40; currentVersion++) {
    var length = getTotalBitsFromDataArray(segments, currentVersion);

    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
      return currentVersion;
    }
  }

  return undefined;
}
/**
 * Returns version number from a value.
 * If value is not a valid version, returns defaultValue
 *
 * @param  {Number|String} value        QR Code version
 * @param  {Number}        defaultValue Fallback value
 * @return {Number}                     QR Code version number
 */


exports.from = function from(value, defaultValue) {
  if (VersionCheck.isValid(value)) {
    return parseInt(value, 10);
  }

  return defaultValue;
};
/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 *
 * @param  {Number} version              QR Code version (1-40)
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Mode}   mode                 Data mode
 * @return {Number}                      Quantity of storable data
 */


exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
  if (!VersionCheck.isValid(version)) {
    throw new Error('Invalid QR Code version');
  } // Use Byte mode as default


  if (typeof mode === 'undefined') mode = Mode.BYTE; // Total codewords for this QR code version (Data + Error correction)

  var totalCodewords = Utils.getSymbolTotalCodewords(version); // Total number of error correction codewords

  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel); // Total number of data codewords

  var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
  if (mode === Mode.MIXED) return dataTotalCodewordsBits;
  var usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version); // Return max number of storable codewords

  switch (mode) {
    case Mode.NUMERIC:
      return Math.floor(usableBits / 10 * 3);

    case Mode.ALPHANUMERIC:
      return Math.floor(usableBits / 11 * 2);

    case Mode.KANJI:
      return Math.floor(usableBits / 13);

    case Mode.BYTE:
    default:
      return Math.floor(usableBits / 8);
  }
};
/**
 * Returns the minimum version needed to contain the amount of data
 *
 * @param  {Segment} data                    Segment of data
 * @param  {Number} [errorCorrectionLevel=H] Error correction level
 * @param  {Mode} mode                       Data mode
 * @return {Number}                          QR Code version
 */


exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
  var seg;
  var ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

  if (isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl);
    }

    if (data.length === 0) {
      return 1;
    }

    seg = data[0];
  } else {
    seg = data;
  }

  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
};
/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Encoded version info bits
 */


exports.getEncodedBits = function getEncodedBits(version) {
  if (!VersionCheck.isValid(version) || version < 7) {
    throw new Error('Invalid QR Code version');
  }

  var d = version << 12;

  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
    d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
  }

  return version << 12 | d;
};

/***/ }),

/***/ 654:
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(585);

var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
var G15_BCH = Utils.getBCHDigit(G15);
/**
 * Returns format information with relative error correction bits
 *
 * The format information is a 15-bit sequence containing 5 data bits,
 * with 10 error correction bits calculated using the (15, 5) BCH code.
 *
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Number} mask                 Mask pattern
 * @return {Number}                      Encoded format information bits
 */

exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
  var data = errorCorrectionLevel.bit << 3 | mask;
  var d = data << 10;

  while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
    d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
  } // xor final data with mask pattern in order to ensure that
  // no combination of Error Correction Level and data mask pattern
  // will result in an all-zero data string


  return (data << 10 | d) ^ G15_MASK;
};

/***/ }),

/***/ 655:
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(586);

var NumericData = __webpack_require__(656);

var AlphanumericData = __webpack_require__(657);

var ByteData = __webpack_require__(658);

var KanjiData = __webpack_require__(659);

var Regex = __webpack_require__(623);

var Utils = __webpack_require__(585);

var dijkstra = __webpack_require__(660);
/**
 * Returns UTF8 byte length
 *
 * @param  {String} str Input string
 * @return {Number}     Number of byte
 */


function getStringByteLength(str) {
  return unescape(encodeURIComponent(str)).length;
}
/**
 * Get a list of segments of the specified mode
 * from a string
 *
 * @param  {Mode}   mode Segment mode
 * @param  {String} str  String to process
 * @return {Array}       Array of object with segments data
 */


function getSegments(regex, mode, str) {
  var segments = [];
  var result;

  while ((result = regex.exec(str)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode: mode,
      length: result[0].length
    });
  }

  return segments;
}
/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 *
 * @param  {String} dataStr Input string
 * @return {Array}          Array of object with segments data
 */


function getSegmentsFromString(dataStr) {
  var numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
  var alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
  var byteSegs;
  var kanjiSegs;

  if (Utils.isKanjiModeEnabled()) {
    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
  } else {
    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
    kanjiSegs = [];
  }

  var segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
  return segs.sort(function (s1, s2) {
    return s1.index - s2.index;
  }).map(function (obj) {
    return {
      data: obj.data,
      mode: obj.mode,
      length: obj.length
    };
  });
}
/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 *
 * @param  {Number} length String length
 * @param  {Mode} mode     Segment mode
 * @return {Number}        Bit length
 */


function getSegmentBitsLength(length, mode) {
  switch (mode) {
    case Mode.NUMERIC:
      return NumericData.getBitsLength(length);

    case Mode.ALPHANUMERIC:
      return AlphanumericData.getBitsLength(length);

    case Mode.KANJI:
      return KanjiData.getBitsLength(length);

    case Mode.BYTE:
      return ByteData.getBitsLength(length);
  }
}
/**
 * Merges adjacent segments which have the same mode
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */


function mergeSegments(segs) {
  return segs.reduce(function (acc, curr) {
    var prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;

    if (prevSeg && prevSeg.mode === curr.mode) {
      acc[acc.length - 1].data += curr.data;
      return acc;
    }

    acc.push(curr);
    return acc;
  }, []);
}
/**
 * Generates a list of all possible nodes combination which
 * will be used to build a segments graph.
 *
 * Nodes are divided by groups. Each group will contain a list of all the modes
 * in which is possible to encode the given text.
 *
 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
 * The group for '12345' will contain then 3 objects, one for each
 * possible encoding mode.
 *
 * Each node represents a possible segment.
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */


function buildNodes(segs) {
  var nodes = [];

  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i];

    switch (seg.mode) {
      case Mode.NUMERIC:
        nodes.push([seg, {
          data: seg.data,
          mode: Mode.ALPHANUMERIC,
          length: seg.length
        }, {
          data: seg.data,
          mode: Mode.BYTE,
          length: seg.length
        }]);
        break;

      case Mode.ALPHANUMERIC:
        nodes.push([seg, {
          data: seg.data,
          mode: Mode.BYTE,
          length: seg.length
        }]);
        break;

      case Mode.KANJI:
        nodes.push([seg, {
          data: seg.data,
          mode: Mode.BYTE,
          length: getStringByteLength(seg.data)
        }]);
        break;

      case Mode.BYTE:
        nodes.push([{
          data: seg.data,
          mode: Mode.BYTE,
          length: getStringByteLength(seg.data)
        }]);
    }
  }

  return nodes;
}
/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length.
 *
 * @param  {Array} nodes    Array of object with segments data
 * @param  {Number} version QR Code version
 * @return {Object}         Graph of all possible segments
 */


function buildGraph(nodes, version) {
  var table = {};
  var graph = {
    'start': {}
  };
  var prevNodeIds = ['start'];

  for (var i = 0; i < nodes.length; i++) {
    var nodeGroup = nodes[i];
    var currentNodeIds = [];

    for (var j = 0; j < nodeGroup.length; j++) {
      var node = nodeGroup[j];
      var key = '' + i + j;
      currentNodeIds.push(key);
      table[key] = {
        node: node,
        lastCount: 0
      };
      graph[key] = {};

      for (var n = 0; n < prevNodeIds.length; n++) {
        var prevNodeId = prevNodeIds[n];

        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
          graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
          table[prevNodeId].lastCount += node.length;
        } else {
          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version); // switch cost
        }
      }
    }

    prevNodeIds = currentNodeIds;
  }

  for (n = 0; n < prevNodeIds.length; n++) {
    graph[prevNodeIds[n]]['end'] = 0;
  }

  return {
    map: graph,
    table: table
  };
}
/**
 * Builds a segment from a specified data and mode.
 * If a mode is not specified, the more suitable will be used.
 *
 * @param  {String} data             Input data
 * @param  {Mode | String} modesHint Data mode
 * @return {Segment}                 Segment
 */


function buildSingleSegment(data, modesHint) {
  var mode;
  var bestMode = Mode.getBestModeForData(data);
  mode = Mode.from(modesHint, bestMode); // Make sure data can be encoded

  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
    throw new Error('"' + data + '"' + ' cannot be encoded with mode ' + Mode.toString(mode) + '.\n Suggested mode is: ' + Mode.toString(bestMode));
  } // Use Mode.BYTE if Kanji support is disabled


  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
    mode = Mode.BYTE;
  }

  switch (mode) {
    case Mode.NUMERIC:
      return new NumericData(data);

    case Mode.ALPHANUMERIC:
      return new AlphanumericData(data);

    case Mode.KANJI:
      return new KanjiData(data);

    case Mode.BYTE:
      return new ByteData(data);
  }
}
/**
 * Builds a list of segments from an array.
 * Array can contain Strings or Objects with segment's info.
 *
 * For each item which is a string, will be generated a segment with the given
 * string and the more appropriate encoding mode.
 *
 * For each item which is an object, will be generated a segment with the given
 * data and mode.
 * Objects must contain at least the property "data".
 * If property "mode" is not present, the more suitable mode will be used.
 *
 * @param  {Array} array Array of objects with segments data
 * @return {Array}       Array of Segments
 */


exports.fromArray = function fromArray(array) {
  return array.reduce(function (acc, seg) {
    if (typeof seg === 'string') {
      acc.push(buildSingleSegment(seg, null));
    } else if (seg.data) {
      acc.push(buildSingleSegment(seg.data, seg.mode));
    }

    return acc;
  }, []);
};
/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 *
 * @param  {String} data    Input string
 * @param  {Number} version QR Code version
 * @return {Array}          Array of segments
 */


exports.fromString = function fromString(data, version) {
  var segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
  var nodes = buildNodes(segs);
  var graph = buildGraph(nodes, version);
  var path = dijkstra.find_path(graph.map, 'start', 'end');
  var optimizedSegs = [];

  for (var i = 1; i < path.length - 1; i++) {
    optimizedSegs.push(graph.table[path[i]].node);
  }

  return exports.fromArray(mergeSegments(optimizedSegs));
};
/**
 * Splits a string in various segments with the modes which
 * best represent their content.
 * The produced segments are far from being optimized.
 * The output of this function is only used to estimate a QR Code version
 * which may contain the data.
 *
 * @param  {string} data Input string
 * @return {Array}       Array of segments
 */


exports.rawSplit = function rawSplit(data) {
  return exports.fromArray(getSegmentsFromString(data, Utils.isKanjiModeEnabled()));
};

/***/ }),

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(586);

function NumericData(data) {
  this.mode = Mode.NUMERIC;
  this.data = data.toString();
}

NumericData.getBitsLength = function getBitsLength(length) {
  return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
};

NumericData.prototype.getLength = function getLength() {
  return this.data.length;
};

NumericData.prototype.getBitsLength = function getBitsLength() {
  return NumericData.getBitsLength(this.data.length);
};

NumericData.prototype.write = function write(bitBuffer) {
  var i, group, value; // The input data string is divided into groups of three digits,
  // and each group is converted to its 10-bit binary equivalent.

  for (i = 0; i + 3 <= this.data.length; i += 3) {
    group = this.data.substr(i, 3);
    value = parseInt(group, 10);
    bitBuffer.put(value, 10);
  } // If the number of input digits is not an exact multiple of three,
  // the final one or two digits are converted to 4 or 7 bits respectively.


  var remainingNum = this.data.length - i;

  if (remainingNum > 0) {
    group = this.data.substr(i);
    value = parseInt(group, 10);
    bitBuffer.put(value, remainingNum * 3 + 1);
  }
};

module.exports = NumericData;

/***/ }),

/***/ 657:
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(586);
/**
 * Array of characters available in alphanumeric mode
 *
 * As per QR Code specification, to each character
 * is assigned a value from 0 to 44 which in this case coincides
 * with the array index
 *
 * @type {Array}
 */


var ALPHA_NUM_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '$', '%', '*', '+', '-', '.', '/', ':'];

function AlphanumericData(data) {
  this.mode = Mode.ALPHANUMERIC;
  this.data = data;
}

AlphanumericData.getBitsLength = function getBitsLength(length) {
  return 11 * Math.floor(length / 2) + 6 * (length % 2);
};

AlphanumericData.prototype.getLength = function getLength() {
  return this.data.length;
};

AlphanumericData.prototype.getBitsLength = function getBitsLength() {
  return AlphanumericData.getBitsLength(this.data.length);
};

AlphanumericData.prototype.write = function write(bitBuffer) {
  var i; // Input data characters are divided into groups of two characters
  // and encoded as 11-bit binary codes.

  for (i = 0; i + 2 <= this.data.length; i += 2) {
    // The character value of the first character is multiplied by 45
    var value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45; // The character value of the second digit is added to the product

    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]); // The sum is then stored as 11-bit binary number

    bitBuffer.put(value, 11);
  } // If the number of input data characters is not a multiple of two,
  // the character value of the final character is encoded as a 6-bit binary number.


  if (this.data.length % 2) {
    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
  }
};

module.exports = AlphanumericData;

/***/ }),

/***/ 658:
/***/ (function(module, exports, __webpack_require__) {

var BufferUtil = __webpack_require__(587);

var Mode = __webpack_require__(586);

function ByteData(data) {
  this.mode = Mode.BYTE;
  this.data = BufferUtil.from(data);
}

ByteData.getBitsLength = function getBitsLength(length) {
  return length * 8;
};

ByteData.prototype.getLength = function getLength() {
  return this.data.length;
};

ByteData.prototype.getBitsLength = function getBitsLength() {
  return ByteData.getBitsLength(this.data.length);
};

ByteData.prototype.write = function (bitBuffer) {
  for (var i = 0, l = this.data.length; i < l; i++) {
    bitBuffer.put(this.data[i], 8);
  }
};

module.exports = ByteData;

/***/ }),

/***/ 659:
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(586);

var Utils = __webpack_require__(585);

function KanjiData(data) {
  this.mode = Mode.KANJI;
  this.data = data;
}

KanjiData.getBitsLength = function getBitsLength(length) {
  return length * 13;
};

KanjiData.prototype.getLength = function getLength() {
  return this.data.length;
};

KanjiData.prototype.getBitsLength = function getBitsLength() {
  return KanjiData.getBitsLength(this.data.length);
};

KanjiData.prototype.write = function (bitBuffer) {
  var i; // In the Shift JIS system, Kanji characters are represented by a two byte combination.
  // These byte values are shifted from the JIS X 0208 values.
  // JIS X 0208 gives details of the shift coded representation.

  for (i = 0; i < this.data.length; i++) {
    var value = Utils.toSJIS(this.data[i]); // For characters with Shift JIS values from 0x8140 to 0x9FFC:

    if (value >= 0x8140 && value <= 0x9FFC) {
      // Subtract 0x8140 from Shift JIS value
      value -= 0x8140; // For characters with Shift JIS values from 0xE040 to 0xEBBF
    } else if (value >= 0xE040 && value <= 0xEBBF) {
      // Subtract 0xC140 from Shift JIS value
      value -= 0xC140;
    } else {
      throw new Error('Invalid SJIS character: ' + this.data[i] + '\n' + 'Make sure your charset is UTF-8');
    } // Multiply most significant byte of result by 0xC0
    // and add least significant byte to product


    value = (value >>> 8 & 0xff) * 0xC0 + (value & 0xff); // Convert result to a 13-bit binary string

    bitBuffer.put(value, 13);
  }
};

module.exports = KanjiData;

/***/ }),

/***/ 660:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/******************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *****************************************************************************/

var dijkstra = {
  single_source_shortest_paths: function single_source_shortest_paths(graph, s, d) {
    // Predecessor map for each node that has been encountered.
    // node ID => predecessor node ID
    var predecessors = {}; // Costs of shortest paths from s to all nodes encountered.
    // node ID => cost

    var costs = {};
    costs[s] = 0; // Costs of shortest paths from s to all nodes encountered; differs from
    // `costs` in that it provides easy access to the node that currently has
    // the known shortest path from s.
    // XXX: Do we actually need both `costs` and `open`?

    var open = dijkstra.PriorityQueue.make();
    open.push(s, 0);
    var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;

    while (!open.empty()) {
      // In the nodes remaining in graph that have a known cost from s,
      // find the node, u, that currently has the shortest path from s.
      closest = open.pop();
      u = closest.value;
      cost_of_s_to_u = closest.cost; // Get nodes adjacent to u...

      adjacent_nodes = graph[u] || {}; // ...and explore the edges that connect u to those nodes, updating
      // the cost of the shortest paths to any or all of those nodes as
      // necessary. v is the node across the current edge from u.

      for (v in adjacent_nodes) {
        if (adjacent_nodes.hasOwnProperty(v)) {
          // Get the cost of the edge running from u to v.
          cost_of_e = adjacent_nodes[v]; // Cost of s to u plus the cost of u to v across e--this is *a*
          // cost from s to v that may or may not be less than the current
          // known cost to v.

          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e; // If we haven't visited v yet OR if the current known cost from s to
          // v is greater than the new cost we just found (cost of s to u plus
          // cost of u to v across e), update v's cost in the cost list and
          // update v's predecessor in the predecessor list (it's now u).

          cost_of_s_to_v = costs[v];
          first_visit = typeof costs[v] === 'undefined';

          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
            costs[v] = cost_of_s_to_u_plus_cost_of_e;
            open.push(v, cost_of_s_to_u_plus_cost_of_e);
            predecessors[v] = u;
          }
        }
      }
    }

    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
      throw new Error(msg);
    }

    return predecessors;
  },
  extract_shortest_path_from_predecessor_list: function extract_shortest_path_from_predecessor_list(predecessors, d) {
    var nodes = [];
    var u = d;
    var predecessor;

    while (u) {
      nodes.push(u);
      predecessor = predecessors[u];
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  },
  find_path: function find_path(graph, s, d) {
    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
    return dijkstra.extract_shortest_path_from_predecessor_list(predecessors, d);
  },

  /**
   * A very naive priority queue implementation.
   */
  PriorityQueue: {
    make: function make(opts) {
      var T = dijkstra.PriorityQueue,
          t = {},
          key;
      opts = opts || {};

      for (key in T) {
        if (T.hasOwnProperty(key)) {
          t[key] = T[key];
        }
      }

      t.queue = [];
      t.sorter = opts.sorter || T.default_sorter;
      return t;
    },
    default_sorter: function default_sorter(a, b) {
      return a.cost - b.cost;
    },

    /**
     * Add a new item to the queue and ensure the highest priority element
     * is at the front of the queue.
     */
    push: function push(value, cost) {
      var item = {
        value: value,
        cost: cost
      };
      this.queue.push(item);
      this.queue.sort(this.sorter);
    },

    /**
     * Return the highest priority element in the queue.
     */
    pop: function pop() {
      return this.queue.shift();
    },
    empty: function empty() {
      return this.queue.length === 0;
    }
  }
}; // node.js module exports

if (true) {
  module.exports = dijkstra;
}

/***/ }),

/***/ 661:
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(624);

function clearCanvas(ctx, canvas, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!canvas.style) canvas.style = {};
  canvas.height = size;
  canvas.width = size;
  canvas.style.height = size + 'px';
  canvas.style.width = size + 'px';
}

function getCanvasElement() {
  try {
    return document.createElement('canvas');
  } catch (e) {
    throw new Error('You need to specify a canvas element');
  }
}

exports.render = function render(qrData, canvas, options) {
  var opts = options;
  var canvasEl = canvas;

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas;
    canvas = undefined;
  }

  if (!canvas) {
    canvasEl = getCanvasElement();
  }

  opts = Utils.getOptions(opts);
  var size = Utils.getImageWidth(qrData.modules.size, opts);
  var ctx = canvasEl.getContext('2d');
  var image = ctx.createImageData(size, size);
  Utils.qrToImageData(image.data, qrData, opts);
  clearCanvas(ctx, canvasEl, size);
  ctx.putImageData(image, 0, 0);
  return canvasEl;
};

exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
  var opts = options;

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas;
    canvas = undefined;
  }

  if (!opts) opts = {};
  var canvasEl = exports.render(qrData, canvas, opts);
  var type = opts.type || 'image/png';
  var rendererOpts = opts.rendererOpts || {};
  return canvasEl.toDataURL(type, rendererOpts.quality);
};

/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(624);

function getColorAttrib(color, attrib) {
  var alpha = color.a / 255;
  var str = attrib + '="' + color.hex + '"';
  return alpha < 1 ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
}

function svgCmd(cmd, x, y) {
  var str = cmd + x;
  if (typeof y !== 'undefined') str += ' ' + y;
  return str;
}

function qrToPath(data, size, margin) {
  var path = '';
  var moveBy = 0;
  var newRow = false;
  var lineLength = 0;

  for (var i = 0; i < data.length; i++) {
    var col = Math.floor(i % size);
    var row = Math.floor(i / size);
    if (!col && !newRow) newRow = true;

    if (data[i]) {
      lineLength++;

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow ? svgCmd('M', col + margin, 0.5 + row + margin) : svgCmd('m', moveBy, 0);
        moveBy = 0;
        newRow = false;
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd('h', lineLength);
        lineLength = 0;
      }
    } else {
      moveBy++;
    }
  }

  return path;
}

exports.render = function render(qrData, options, cb) {
  var opts = Utils.getOptions(options);
  var size = qrData.modules.size;
  var data = qrData.modules.data;
  var qrcodesize = size + opts.margin * 2;
  var bg = !opts.color.light.a ? '' : '<path ' + getColorAttrib(opts.color.light, 'fill') + ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';
  var path = '<path ' + getColorAttrib(opts.color.dark, 'stroke') + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
  var viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';
  var width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" ';
  var svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n';

  if (typeof cb === 'function') {
    cb(null, svgTag);
  }

  return svgTag;
};

/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var deselectCurrent = __webpack_require__(664);

var clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
};
var defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

function copy(text, options) {
  var debug,
      message,
      reselectPrevious,
      range,
      selection,
      mark,
      success = false;

  if (!options) {
    options = {};
  }

  debug = options.debug || false;

  try {
    reselectPrevious = deselectCurrent();
    range = document.createRange();
    selection = document.getSelection();
    mark = document.createElement("span");
    mark.textContent = text; // reset user styles for span element

    mark.style.all = "unset"; // prevents scrolling to the end of the page

    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)"; // used to preserve spaces and line breaks

    mark.style.whiteSpace = "pre"; // do not inherit user-select (it may be `none`)

    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function (e) {
      e.stopPropagation();

      if (options.format) {
        e.preventDefault();

        if (typeof e.clipboardData === "undefined") {
          // IE 11
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          window.clipboardData.clearData();
          var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
          window.clipboardData.setData(format, text);
        } else {
          // all other browsers
          e.clipboardData.clearData();
          e.clipboardData.setData(options.format, text);
        }
      }

      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });
    document.body.appendChild(mark);
    range.selectNodeContents(mark);
    selection.addRange(range);
    var successful = document.execCommand("copy");

    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }

    success = true;
  } catch (err) {
    debug && console.error("unable to copy using execCommand: ", err);
    debug && console.warn("trying IE specific stuff");

    try {
      window.clipboardData.setData(options.format || "text", text);
      options.onCopy && options.onCopy(window.clipboardData);
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using clipboardData: ", err);
      debug && console.error("falling back to prompt");
      message = format("message" in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }

    reselectPrevious();
  }

  return success;
}

module.exports = copy;

/***/ }),

/***/ 664:
/***/ (function(module, exports) {

module.exports = function () {
  var selection = document.getSelection();

  if (!selection.rangeCount) {
    return function () {};
  }

  var active = document.activeElement;
  var ranges = [];

  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (active.tagName.toUpperCase()) {
    // .toUpperCase handles XHTML
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return function () {
    selection.type === 'Caret' && selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function (range) {
        selection.addRange(range);
      });
    }

    active && active.focus();
  };
};

/***/ }),

/***/ 665:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "useState", function() { return /* reexport */ hooks_module_m; });
__webpack_require__.d(__webpack_exports__, "useReducer", function() { return /* reexport */ hooks_module_p; });
__webpack_require__.d(__webpack_exports__, "useEffect", function() { return /* reexport */ hooks_module_l; });
__webpack_require__.d(__webpack_exports__, "useLayoutEffect", function() { return /* reexport */ hooks_module_y; });
__webpack_require__.d(__webpack_exports__, "useRef", function() { return /* reexport */ hooks_module_d; });
__webpack_require__.d(__webpack_exports__, "useImperativeHandle", function() { return /* reexport */ hooks_module_s; });
__webpack_require__.d(__webpack_exports__, "useMemo", function() { return /* reexport */ hooks_module_h; });
__webpack_require__.d(__webpack_exports__, "useCallback", function() { return /* reexport */ hooks_module_T; });
__webpack_require__.d(__webpack_exports__, "useContext", function() { return /* reexport */ hooks_module_w; });
__webpack_require__.d(__webpack_exports__, "useDebugValue", function() { return /* reexport */ hooks_module_A; });
__webpack_require__.d(__webpack_exports__, "useErrorBoundary", function() { return /* reexport */ F; });
__webpack_require__.d(__webpack_exports__, "createElement", function() { return /* reexport */ h; });
__webpack_require__.d(__webpack_exports__, "createContext", function() { return /* reexport */ M; });
__webpack_require__.d(__webpack_exports__, "createRef", function() { return /* reexport */ y; });
__webpack_require__.d(__webpack_exports__, "Fragment", function() { return /* reexport */ d; });
__webpack_require__.d(__webpack_exports__, "Component", function() { return /* reexport */ m; });
__webpack_require__.d(__webpack_exports__, "version", function() { return /* binding */ B; });
__webpack_require__.d(__webpack_exports__, "Children", function() { return /* binding */ R; });
__webpack_require__.d(__webpack_exports__, "render", function() { return /* binding */ compat_module_T; });
__webpack_require__.d(__webpack_exports__, "hydrate", function() { return /* binding */ V; });
__webpack_require__.d(__webpack_exports__, "unmountComponentAtNode", function() { return /* binding */ Q; });
__webpack_require__.d(__webpack_exports__, "createPortal", function() { return /* binding */ compat_module_z; });
__webpack_require__.d(__webpack_exports__, "createFactory", function() { return /* binding */ G; });
__webpack_require__.d(__webpack_exports__, "cloneElement", function() { return /* binding */ K; });
__webpack_require__.d(__webpack_exports__, "isValidElement", function() { return /* binding */ J; });
__webpack_require__.d(__webpack_exports__, "findDOMNode", function() { return /* binding */ X; });
__webpack_require__.d(__webpack_exports__, "PureComponent", function() { return /* binding */ compat_module_C; });
__webpack_require__.d(__webpack_exports__, "memo", function() { return /* binding */ compat_module_; });
__webpack_require__.d(__webpack_exports__, "forwardRef", function() { return /* binding */ S; });
__webpack_require__.d(__webpack_exports__, "unstable_batchedUpdates", function() { return /* binding */ Y; });
__webpack_require__.d(__webpack_exports__, "Suspense", function() { return /* binding */ U; });
__webpack_require__.d(__webpack_exports__, "SuspenseList", function() { return /* binding */ O; });
__webpack_require__.d(__webpack_exports__, "lazy", function() { return /* binding */ compat_module_L; });

// CONCATENATED MODULE: ./node_modules/preact/dist/preact.module.js
var preact_module_n,
    l,
    preact_module_u,
    preact_module_i,
    preact_module_t,
    preact_module_r,
    preact_module_o,
    f,
    preact_module_e = {},
    c = [],
    s = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

function a(n, l) {
  for (var u in l) {
    n[u] = l[u];
  }

  return n;
}

function v(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}

function h(n, l, u) {
  var i,
      t = arguments,
      r = {};

  for (i in l) {
    "key" !== i && "ref" !== i && (r[i] = l[i]);
  }

  if (arguments.length > 3) for (u = [u], i = 3; i < arguments.length; i++) {
    u.push(t[i]);
  }
  if (null != u && (r.children = u), "function" == typeof n && null != n.defaultProps) for (i in n.defaultProps) {
    void 0 === r[i] && (r[i] = n.defaultProps[i]);
  }
  return p(n, r, l && l.key, l && l.ref, null);
}

function p(l, u, i, t, r) {
  var o = {
    type: l,
    props: u,
    key: i,
    ref: t,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: r
  };
  return null == r && (o.__v = o), preact_module_n.vnode && preact_module_n.vnode(o), o;
}

function y() {
  return {};
}

function d(n) {
  return n.children;
}

function m(n, l) {
  this.props = n, this.context = l;
}

function w(n, l) {
  if (null == l) return n.__ ? w(n.__, n.__.__k.indexOf(n) + 1) : null;

  for (var u; l < n.__k.length; l++) {
    if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
  }

  return "function" == typeof n.type ? w(n) : null;
}

function preact_module_k(n) {
  var l, u;

  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) {
      if (null != (u = n.__k[l]) && null != u.__e) {
        n.__e = n.__c.base = u.__e;
        break;
      }
    }

    return preact_module_k(n);
  }
}

function g(l) {
  (!l.__d && (l.__d = !0) && preact_module_u.push(l) && !preact_module_i++ || preact_module_r !== preact_module_n.debounceRendering) && ((preact_module_r = preact_module_n.debounceRendering) || preact_module_t)(_);
}

function _() {
  for (var n; preact_module_i = preact_module_u.length;) {
    n = preact_module_u.sort(function (n, l) {
      return n.__v.__b - l.__v.__b;
    }), preact_module_u = [], n.some(function (n) {
      var l, u, i, t, r, o, f;
      n.__d && (o = (r = (l = n).__v).__e, (f = l.__P) && (u = [], (i = a({}, r)).__v = i, t = A(f, r, i, l.__n, void 0 !== f.ownerSVGElement, null, u, null == o ? w(r) : o), T(u, r), t != o && preact_module_k(r)));
    });
  }
}

function b(n, l, u, i, t, r, o, f, s) {
  var a,
      h,
      p,
      y,
      d,
      m,
      k,
      g = u && u.__k || c,
      _ = g.length;
  if (f == preact_module_e && (f = null != r ? r[0] : _ ? w(u, 0) : null), a = 0, l.__k = x(l.__k, function (u) {
    if (null != u) {
      if (u.__ = l, u.__b = l.__b + 1, null === (p = g[a]) || p && u.key == p.key && u.type === p.type) g[a] = void 0;else for (h = 0; h < _; h++) {
        if ((p = g[h]) && u.key == p.key && u.type === p.type) {
          g[h] = void 0;
          break;
        }

        p = null;
      }

      if (y = A(n, u, p = p || preact_module_e, i, t, r, o, f, s), (h = u.ref) && p.ref != h && (k || (k = []), p.ref && k.push(p.ref, null, u), k.push(h, u.__c || y, u)), null != y) {
        var c;
        if (null == m && (m = y), void 0 !== u.__d) c = u.__d, u.__d = void 0;else if (r == p || y != f || null == y.parentNode) {
          n: if (null == f || f.parentNode !== n) n.appendChild(y), c = null;else {
            for (d = f, h = 0; (d = d.nextSibling) && h < _; h += 2) {
              if (d == y) break n;
            }

            n.insertBefore(y, f), c = f;
          }

          "option" == l.type && (n.value = "");
        }
        f = void 0 !== c ? c : y.nextSibling, "function" == typeof l.type && (l.__d = f);
      } else f && p.__e == f && f.parentNode != n && (f = w(p));
    }

    return a++, u;
  }), l.__e = m, null != r && "function" != typeof l.type) for (a = r.length; a--;) {
    null != r[a] && v(r[a]);
  }

  for (a = _; a--;) {
    null != g[a] && D(g[a], g[a]);
  }

  if (k) for (a = 0; a < k.length; a++) {
    j(k[a], k[++a], k[++a]);
  }
}

function x(n, l, u) {
  if (null == u && (u = []), null == n || "boolean" == typeof n) l && u.push(l(null));else if (Array.isArray(n)) for (var i = 0; i < n.length; i++) {
    x(n[i], l, u);
  } else u.push(l ? l("string" == typeof n || "number" == typeof n ? p(null, n, null, null, n) : null != n.__e || null != n.__c ? p(n.type, n.props, n.key, null, n.__v) : n) : n);
  return u;
}

function P(n, l, u, i, t) {
  var r;

  for (r in u) {
    "children" === r || "key" === r || r in l || N(n, r, null, u[r], i);
  }

  for (r in l) {
    t && "function" != typeof l[r] || "children" === r || "key" === r || "value" === r || "checked" === r || u[r] === l[r] || N(n, r, l[r], u[r], i);
  }
}

function C(n, l, u) {
  "-" === l[0] ? n.setProperty(l, u) : n[l] = "number" == typeof u && !1 === s.test(l) ? u + "px" : null == u ? "" : u;
}

function N(n, l, u, i, t) {
  var r, o, f, e, c;
  if (t ? "className" === l && (l = "class") : "class" === l && (l = "className"), "style" === l) {
    if (r = n.style, "string" == typeof u) r.cssText = u;else {
      if ("string" == typeof i && (r.cssText = "", i = null), i) for (e in i) {
        u && e in u || C(r, e, "");
      }
      if (u) for (c in u) {
        i && u[c] === i[c] || C(r, c, u[c]);
      }
    }
  } else "o" === l[0] && "n" === l[1] ? (o = l !== (l = l.replace(/Capture$/, "")), f = l.toLowerCase(), l = (f in n ? f : l).slice(2), u ? (i || n.addEventListener(l, z, o), (n.l || (n.l = {}))[l] = u) : n.removeEventListener(l, z, o)) : "list" !== l && "tagName" !== l && "form" !== l && "type" !== l && "size" !== l && !t && l in n ? n[l] = null == u ? "" : u : "function" != typeof u && "dangerouslySetInnerHTML" !== l && (l !== (l = l.replace(/^xlink:?/, "")) ? null == u || !1 === u ? n.removeAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase(), u) : null == u || !1 === u && !/^ar/.test(l) ? n.removeAttribute(l) : n.setAttribute(l, u));
}

function z(l) {
  this.l[l.type](preact_module_n.event ? preact_module_n.event(l) : l);
}

function A(l, u, i, t, r, o, f, e, c) {
  var s,
      v,
      h,
      p,
      y,
      w,
      k,
      g,
      _,
      x,
      P = u.type;

  if (void 0 !== u.constructor) return null;
  (s = preact_module_n.__b) && s(u);

  try {
    n: if ("function" == typeof P) {
      if (g = u.props, _ = (s = P.contextType) && t[s.__c], x = s ? _ ? _.props.value : s.__ : t, i.__c ? k = (v = u.__c = i.__c).__ = v.__E : ("prototype" in P && P.prototype.render ? u.__c = v = new P(g, x) : (u.__c = v = new m(g, x), v.constructor = P, v.render = E), _ && _.sub(v), v.props = g, v.state || (v.state = {}), v.context = x, v.__n = t, h = v.__d = !0, v.__h = []), null == v.__s && (v.__s = v.state), null != P.getDerivedStateFromProps && (v.__s == v.state && (v.__s = a({}, v.__s)), a(v.__s, P.getDerivedStateFromProps(g, v.__s))), p = v.props, y = v.state, h) null == P.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && v.__h.push(v.componentDidMount);else {
        if (null == P.getDerivedStateFromProps && g !== p && null != v.componentWillReceiveProps && v.componentWillReceiveProps(g, x), !v.__e && null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(g, v.__s, x) || u.__v === i.__v && !v.__) {
          for (v.props = g, v.state = v.__s, u.__v !== i.__v && (v.__d = !1), v.__v = u, u.__e = i.__e, u.__k = i.__k, v.__h.length && f.push(v), s = 0; s < u.__k.length; s++) {
            u.__k[s] && (u.__k[s].__ = u);
          }

          break n;
        }

        null != v.componentWillUpdate && v.componentWillUpdate(g, v.__s, x), null != v.componentDidUpdate && v.__h.push(function () {
          v.componentDidUpdate(p, y, w);
        });
      }
      v.context = x, v.props = g, v.state = v.__s, (s = preact_module_n.__r) && s(u), v.__d = !1, v.__v = u, v.__P = l, s = v.render(v.props, v.state, v.context), u.__k = null != s && s.type == d && null == s.key ? s.props.children : Array.isArray(s) ? s : [s], null != v.getChildContext && (t = a(a({}, t), v.getChildContext())), h || null == v.getSnapshotBeforeUpdate || (w = v.getSnapshotBeforeUpdate(p, y)), b(l, u, i, t, r, o, f, e, c), v.base = u.__e, v.__h.length && f.push(v), k && (v.__E = v.__ = null), v.__e = !1;
    } else null == o && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = $(i.__e, u, i, t, r, o, f, c);

    (s = preact_module_n.diffed) && s(u);
  } catch (l) {
    u.__v = null, preact_module_n.__e(l, u, i);
  }

  return u.__e;
}

function T(l, u) {
  preact_module_n.__c && preact_module_n.__c(u, l), l.some(function (u) {
    try {
      l = u.__h, u.__h = [], l.some(function (n) {
        n.call(u);
      });
    } catch (l) {
      preact_module_n.__e(l, u.__v);
    }
  });
}

function $(n, l, u, i, t, r, o, f) {
  var s,
      a,
      v,
      h,
      p,
      y = u.props,
      d = l.props;
  if (t = "svg" === l.type || t, null != r) for (s = 0; s < r.length; s++) {
    if (null != (a = r[s]) && ((null === l.type ? 3 === a.nodeType : a.localName === l.type) || n == a)) {
      n = a, r[s] = null;
      break;
    }
  }

  if (null == n) {
    if (null === l.type) return document.createTextNode(d);
    n = t ? document.createElementNS("http://www.w3.org/2000/svg", l.type) : document.createElement(l.type, d.is && {
      is: d.is
    }), r = null, f = !1;
  }

  if (null === l.type) y !== d && n.data != d && (n.data = d);else {
    if (null != r && (r = c.slice.call(n.childNodes)), v = (y = u.props || preact_module_e).dangerouslySetInnerHTML, h = d.dangerouslySetInnerHTML, !f) {
      if (y === preact_module_e) for (y = {}, p = 0; p < n.attributes.length; p++) {
        y[n.attributes[p].name] = n.attributes[p].value;
      }
      (h || v) && (h && v && h.__html == v.__html || (n.innerHTML = h && h.__html || ""));
    }

    P(n, d, y, t, f), h ? l.__k = [] : (l.__k = l.props.children, b(n, l, u, i, "foreignObject" !== l.type && t, r, o, preact_module_e, f)), f || ("value" in d && void 0 !== (s = d.value) && s !== n.value && N(n, "value", s, y.value, !1), "checked" in d && void 0 !== (s = d.checked) && s !== n.checked && N(n, "checked", s, y.checked, !1));
  }
  return n;
}

function j(l, u, i) {
  try {
    "function" == typeof l ? l(u) : l.current = u;
  } catch (l) {
    preact_module_n.__e(l, i);
  }
}

function D(l, u, i) {
  var t, r, o;

  if (preact_module_n.unmount && preact_module_n.unmount(l), (t = l.ref) && (t.current && t.current !== l.__e || j(t, null, u)), i || "function" == typeof l.type || (i = null != (r = l.__e)), l.__e = l.__d = void 0, null != (t = l.__c)) {
    if (t.componentWillUnmount) try {
      t.componentWillUnmount();
    } catch (l) {
      preact_module_n.__e(l, u);
    }
    t.base = t.__P = null;
  }

  if (t = l.__k) for (o = 0; o < t.length; o++) {
    t[o] && D(t[o], u, i);
  }
  null != r && v(r);
}

function E(n, l, u) {
  return this.constructor(n, u);
}

function H(l, u, i) {
  var t, r, f;
  preact_module_n.__ && preact_module_n.__(l, u), r = (t = i === preact_module_o) ? null : i && i.__k || u.__k, l = h(d, null, [l]), f = [], A(u, (t ? u : i || u).__k = l, r || preact_module_e, preact_module_e, void 0 !== u.ownerSVGElement, i && !t ? [i] : r ? null : c.slice.call(u.childNodes), f, i || preact_module_e, t), T(f, l);
}

function I(n, l) {
  H(n, l, preact_module_o);
}

function L(n, l) {
  var u, i;

  for (i in l = a(a({}, n.props), l), arguments.length > 2 && (l.children = c.slice.call(arguments, 2)), u = {}, l) {
    "key" !== i && "ref" !== i && (u[i] = l[i]);
  }

  return p(n.type, u, l.key || n.key, l.ref || n.ref, null);
}

function M(n) {
  var l = {},
      u = {
    __c: "__cC" + f++,
    __: n,
    Consumer: function Consumer(n, l) {
      return n.children(l);
    },
    Provider: function Provider(n) {
      var i,
          t = this;
      return this.getChildContext || (i = [], this.getChildContext = function () {
        return l[u.__c] = t, l;
      }, this.shouldComponentUpdate = function (n) {
        t.props.value !== n.value && i.some(function (l) {
          l.context = n.value, g(l);
        });
      }, this.sub = function (n) {
        i.push(n);
        var l = n.componentWillUnmount;

        n.componentWillUnmount = function () {
          i.splice(i.indexOf(n), 1), l && l.call(n);
        };
      }), n.children;
    }
  };
  return u.Consumer.contextType = u, u.Provider.__ = u, u;
}

preact_module_n = {
  __e: function __e(n, l) {
    for (var u, i; l = l.__;) {
      if ((u = l.__c) && !u.__) try {
        if (u.constructor && null != u.constructor.getDerivedStateFromError && (i = !0, u.setState(u.constructor.getDerivedStateFromError(n))), null != u.componentDidCatch && (i = !0, u.componentDidCatch(n)), i) return g(u.__E = u);
      } catch (l) {
        n = l;
      }
    }

    throw n;
  }
}, l = function l(n) {
  return null != n && void 0 === n.constructor;
}, m.prototype.setState = function (n, l) {
  var u;
  u = this.__s !== this.state ? this.__s : this.__s = a({}, this.state), "function" == typeof n && (n = n(u, this.props)), n && a(u, n), null != n && this.__v && (l && this.__h.push(l), g(this));
}, m.prototype.forceUpdate = function (n) {
  this.__v && (this.__e = !0, n && this.__h.push(n), g(this));
}, m.prototype.render = d, preact_module_u = [], preact_module_i = 0, preact_module_t = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, preact_module_o = preact_module_e, f = 0;

// CONCATENATED MODULE: ./node_modules/preact/hooks/dist/hooks.module.js

var hooks_module_t,
    hooks_module_u,
    hooks_module_r,
    hooks_module_i = 0,
    hooks_module_o = [],
    hooks_module_c = preact_module_n.__r,
    hooks_module_f = preact_module_n.diffed,
    hooks_module_e = preact_module_n.__c,
    hooks_module_a = preact_module_n.unmount;

function hooks_module_v(t, r) {
  preact_module_n.__h && preact_module_n.__h(hooks_module_u, t, hooks_module_i || r), hooks_module_i = 0;
  var o = hooks_module_u.__H || (hooks_module_u.__H = {
    __: [],
    __h: []
  });
  return t >= o.__.length && o.__.push({}), o.__[t];
}

function hooks_module_m(n) {
  return hooks_module_i = 1, hooks_module_p(hooks_module_E, n);
}

function hooks_module_p(n, r, i) {
  var o = hooks_module_v(hooks_module_t++, 2);
  return o.__c || (o.__c = hooks_module_u, o.__ = [i ? i(r) : hooks_module_E(void 0, r), function (t) {
    var u = n(o.__[0], t);
    o.__[0] !== u && (o.__[0] = u, o.__c.setState({}));
  }]), o.__;
}

function hooks_module_l(r, i) {
  var o = hooks_module_v(hooks_module_t++, 3);
  !preact_module_n.__s && hooks_module_x(o.__H, i) && (o.__ = r, o.__H = i, hooks_module_u.__H.__h.push(o));
}

function hooks_module_y(r, i) {
  var o = hooks_module_v(hooks_module_t++, 4);
  !preact_module_n.__s && hooks_module_x(o.__H, i) && (o.__ = r, o.__H = i, hooks_module_u.__h.push(o));
}

function hooks_module_d(n) {
  return hooks_module_i = 5, hooks_module_h(function () {
    return {
      current: n
    };
  }, []);
}

function hooks_module_s(n, t, u) {
  hooks_module_i = 6, hooks_module_y(function () {
    "function" == typeof n ? n(t()) : n && (n.current = t());
  }, null == u ? u : u.concat(n));
}

function hooks_module_h(n, u) {
  var r = hooks_module_v(hooks_module_t++, 7);
  return hooks_module_x(r.__H, u) ? (r.__H = u, r.__h = n, r.__ = n()) : r.__;
}

function hooks_module_T(n, t) {
  return hooks_module_i = 8, hooks_module_h(function () {
    return n;
  }, t);
}

function hooks_module_w(n) {
  var r = hooks_module_u.context[n.__c],
      i = hooks_module_v(hooks_module_t++, 9);
  return i.__c = n, r ? (null == i.__ && (i.__ = !0, r.sub(hooks_module_u)), r.props.value) : n.__;
}

function hooks_module_A(t, u) {
  preact_module_n.useDebugValue && preact_module_n.useDebugValue(u ? u(t) : t);
}

function F(n) {
  var r = hooks_module_v(hooks_module_t++, 10),
      i = hooks_module_m();
  return r.__ = n, hooks_module_u.componentDidCatch || (hooks_module_u.componentDidCatch = function (n) {
    r.__ && r.__(n), i[1](n);
  }), [i[0], function () {
    i[1](void 0);
  }];
}

function hooks_module_() {
  hooks_module_o.some(function (t) {
    if (t.__P) try {
      t.__H.__h.forEach(hooks_module_g), t.__H.__h.forEach(q), t.__H.__h = [];
    } catch (u) {
      return t.__H.__h = [], preact_module_n.__e(u, t.__v), !0;
    }
  }), hooks_module_o = [];
}

function hooks_module_g(n) {
  n.t && n.t();
}

function q(n) {
  var t = n.__();

  "function" == typeof t && (n.t = t);
}

function hooks_module_x(n, t) {
  return !n || t.some(function (t, u) {
    return t !== n[u];
  });
}

function hooks_module_E(n, t) {
  return "function" == typeof t ? t(n) : t;
}

preact_module_n.__r = function (n) {
  hooks_module_c && hooks_module_c(n), hooks_module_t = 0, (hooks_module_u = n.__c).__H && (hooks_module_u.__H.__h.forEach(hooks_module_g), hooks_module_u.__H.__h.forEach(q), hooks_module_u.__H.__h = []);
}, preact_module_n.diffed = function (t) {
  hooks_module_f && hooks_module_f(t);
  var u = t.__c;

  if (u) {
    var i = u.__H;
    i && i.__h.length && (1 !== hooks_module_o.push(u) && hooks_module_r === preact_module_n.requestAnimationFrame || ((hooks_module_r = preact_module_n.requestAnimationFrame) || function (n) {
      var t,
          u = function u() {
        clearTimeout(r), cancelAnimationFrame(t), setTimeout(n);
      },
          r = setTimeout(u, 100);

      "undefined" != typeof window && (t = requestAnimationFrame(u));
    })(hooks_module_));
  }
}, preact_module_n.__c = function (t, u) {
  u.some(function (t) {
    try {
      t.__h.forEach(hooks_module_g), t.__h = t.__h.filter(function (n) {
        return !n.__ || q(n);
      });
    } catch (r) {
      u.some(function (n) {
        n.__h && (n.__h = []);
      }), u = [], preact_module_n.__e(r, t.__v);
    }
  }), hooks_module_e && hooks_module_e(t, u);
}, preact_module_n.unmount = function (t) {
  hooks_module_a && hooks_module_a(t);
  var u = t.__c;

  if (u) {
    var r = u.__H;
    if (r) try {
      r.__.forEach(function (n) {
        return n.t && n.t();
      });
    } catch (t) {
      preact_module_n.__e(t, u.__v);
    }
  }
};

// CONCATENATED MODULE: ./node_modules/preact/compat/dist/compat.module.js





function compat_module_E(n, t) {
  for (var e in t) {
    n[e] = t[e];
  }

  return n;
}

function compat_module_w(n, t) {
  for (var e in n) {
    if ("__source" !== e && !(e in t)) return !0;
  }

  for (var r in t) {
    if ("__source" !== r && n[r] !== t[r]) return !0;
  }

  return !1;
}

var compat_module_C = function (n) {
  var t, e;

  function r(t) {
    var e;
    return (e = n.call(this, t) || this).isPureReactComponent = !0, e;
  }

  return e = n, (t = r).prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e, r.prototype.shouldComponentUpdate = function (n, t) {
    return compat_module_w(this.props, n) || compat_module_w(this.state, t);
  }, r;
}(m);

function compat_module_(n, t) {
  function e(n) {
    var e = this.props.ref,
        r = e == n.ref;
    return !r && e && (e.call ? e(null) : e.current = null), t ? !t(this.props, n) || !r : compat_module_w(this.props, n);
  }

  function r(t) {
    return this.shouldComponentUpdate = e, h(n, compat_module_E({}, t));
  }

  return r.prototype.isReactComponent = !0, r.displayName = "Memo(" + (n.displayName || n.name) + ")", r.t = !0, r;
}

var compat_module_A = preact_module_n.__b;

function S(n) {
  function t(t) {
    var e = compat_module_E({}, t);
    return delete e.ref, n(e, t.ref);
  }

  return t.prototype.isReactComponent = t.t = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
}

preact_module_n.__b = function (n) {
  n.type && n.type.t && n.ref && (n.props.ref = n.ref, n.ref = null), compat_module_A && compat_module_A(n);
};

var compat_module_k = function k(n, t) {
  return n ? x(n).reduce(function (n, e, r) {
    return n.concat(t(e, r));
  }, []) : null;
},
    R = {
  map: compat_module_k,
  forEach: compat_module_k,
  count: function count(n) {
    return n ? x(n).length : 0;
  },
  only: function only(n) {
    if (1 !== (n = x(n)).length) throw new Error("Children.only() expects only one child.");
    return n[0];
  },
  toArray: x
},
    compat_module_F = preact_module_n.__e;

function compat_module_N(n) {
  return n && ((n = compat_module_E({}, n)).__c = null, n.__k = n.__k && n.__k.map(compat_module_N)), n;
}

function U() {
  this.__u = 0, this.o = null, this.__b = null;
}

function compat_module_M(n) {
  var t = n.__.__c;
  return t && t.u && t.u(n);
}

function compat_module_L(n) {
  var t, e, r;

  function o(o) {
    if (t || (t = n()).then(function (n) {
      e = n.default || n;
    }, function (n) {
      r = n;
    }), r) throw r;
    if (!e) throw t;
    return h(e, o);
  }

  return o.displayName = "Lazy", o.t = !0, o;
}

function O() {
  this.i = null, this.l = null;
}

preact_module_n.__e = function (n, t, e) {
  if (n.then) for (var r, o = t; o = o.__;) {
    if ((r = o.__c) && r.__c) return r.__c(n, t.__c);
  }
  compat_module_F(n, t, e);
}, (U.prototype = new m()).__c = function (n, t) {
  var e = this;
  null == e.o && (e.o = []), e.o.push(t);

  var r = compat_module_M(e.__v),
      o = !1,
      u = function u() {
    o || (o = !0, r ? r(i) : i());
  };

  t.__c = t.componentWillUnmount, t.componentWillUnmount = function () {
    u(), t.__c && t.__c();
  };

  var i = function i() {
    var n;
    if (! --e.__u) for (e.__v.__k[0] = e.state.u, e.setState({
      u: e.__b = null
    }); n = e.o.pop();) {
      n.forceUpdate();
    }
  };

  e.__u++ || e.setState({
    u: e.__b = e.__v.__k[0]
  }), n.then(u, u);
}, U.prototype.render = function (n, t) {
  return this.__b && (this.__v.__k[0] = compat_module_N(this.__b), this.__b = null), [h(m, null, t.u ? null : n.children), t.u && n.fallback];
};

var compat_module_P = function P(n, t, e) {
  if (++e[1] === e[0] && n.l.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e = n.i; e;) {
    for (; e.length > 3;) {
      e.pop()();
    }

    if (e[1] < e[0]) break;
    n.i = e = e[2];
  }
};

(O.prototype = new m()).u = function (n) {
  var t = this,
      e = compat_module_M(t.__v),
      r = t.l.get(n);
  return r[0]++, function (o) {
    var u = function u() {
      t.props.revealOrder ? (r.push(o), compat_module_P(t, n, r)) : o();
    };

    e ? e(u) : u();
  };
}, O.prototype.render = function (n) {
  this.i = null, this.l = new Map();
  var t = x(n.children);
  n.revealOrder && "b" === n.revealOrder[0] && t.reverse();

  for (var e = t.length; e--;) {
    this.l.set(t[e], this.i = [1, 0, this.i]);
  }

  return n.children;
}, O.prototype.componentDidUpdate = O.prototype.componentDidMount = function () {
  var n = this;
  n.l.forEach(function (t, e) {
    compat_module_P(n, e, t);
  });
};

var W = function () {
  function n() {}

  var t = n.prototype;
  return t.getChildContext = function () {
    return this.props.context;
  }, t.render = function (n) {
    return n.children;
  }, n;
}();

function compat_module_j(n) {
  var t = this,
      e = n.container,
      r = h(W, {
    context: t.context
  }, n.vnode);
  return t.s && t.s !== e && (t.v.parentNode && t.s.removeChild(t.v), D(t.h), t.p = !1), n.vnode ? t.p ? (e.__k = t.__k, H(r, e), t.__k = e.__k) : (t.v = document.createTextNode(""), I("", e), e.appendChild(t.v), t.p = !0, t.s = e, H(r, e, t.v), t.__k = t.v.__k) : t.p && (t.v.parentNode && t.s.removeChild(t.v), D(t.h)), t.h = r, t.componentWillUnmount = function () {
    t.v.parentNode && t.s.removeChild(t.v), D(t.h);
  }, null;
}

function compat_module_z(n, t) {
  return h(compat_module_j, {
    vnode: n,
    container: t
  });
}

var compat_module_D = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
m.prototype.isReactComponent = {};
var compat_module_H = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;

function compat_module_T(n, t, e) {
  if (null == t.__k) for (; t.firstChild;) {
    t.removeChild(t.firstChild);
  }
  return H(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

function V(n, t, e) {
  return I(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

var Z = preact_module_n.event;

function compat_module_I(n, t) {
  n["UNSAFE_" + t] && !n[t] && Object.defineProperty(n, t, {
    configurable: !1,
    get: function get() {
      return this["UNSAFE_" + t];
    },
    set: function set(n) {
      this["UNSAFE_" + t] = n;
    }
  });
}

preact_module_n.event = function (n) {
  Z && (n = Z(n)), n.persist = function () {};
  var t = !1,
      e = !1,
      r = n.stopPropagation;

  n.stopPropagation = function () {
    r.call(n), t = !0;
  };

  var o = n.preventDefault;
  return n.preventDefault = function () {
    o.call(n), e = !0;
  }, n.isPropagationStopped = function () {
    return t;
  }, n.isDefaultPrevented = function () {
    return e;
  }, n.nativeEvent = n;
};

var compat_module_$ = {
  configurable: !0,
  get: function get() {
    return this.class;
  }
},
    compat_module_q = preact_module_n.vnode;

preact_module_n.vnode = function (n) {
  n.$$typeof = compat_module_H;
  var t = n.type,
      e = n.props;

  if (t) {
    if (e.class != e.className && (compat_module_$.enumerable = "className" in e, null != e.className && (e.class = e.className), Object.defineProperty(e, "className", compat_module_$)), "function" != typeof t) {
      var r, o, u;

      for (u in e.defaultValue && void 0 !== e.value && (e.value || 0 === e.value || (e.value = e.defaultValue), delete e.defaultValue), Array.isArray(e.value) && e.multiple && "select" === t && (x(e.children).forEach(function (n) {
        -1 != e.value.indexOf(n.props.value) && (n.props.selected = !0);
      }), delete e.value), e) {
        if (r = compat_module_D.test(u)) break;
      }

      if (r) for (u in o = n.props = {}, e) {
        o[compat_module_D.test(u) ? u.replace(/[A-Z0-9]/, "-$&").toLowerCase() : u] = e[u];
      }
    }

    !function (t) {
      var e = n.type,
          r = n.props;

      if (r && "string" == typeof e) {
        var o = {};

        for (var u in r) {
          /^on(Ani|Tra|Tou)/.test(u) && (r[u.toLowerCase()] = r[u], delete r[u]), o[u.toLowerCase()] = u;
        }

        if (o.ondoubleclick && (r.ondblclick = r[o.ondoubleclick], delete r[o.ondoubleclick]), o.onbeforeinput && (r.onbeforeinput = r[o.onbeforeinput], delete r[o.onbeforeinput]), o.onchange && ("textarea" === e || "input" === e.toLowerCase() && !/^fil|che|ra/i.test(r.type))) {
          var i = o.oninput || "oninput";
          r[i] || (r[i] = r[o.onchange], delete r[o.onchange]);
        }
      }
    }(), "function" == typeof t && !t.m && t.prototype && (compat_module_I(t.prototype, "componentWillMount"), compat_module_I(t.prototype, "componentWillReceiveProps"), compat_module_I(t.prototype, "componentWillUpdate"), t.m = !0);
  }

  compat_module_q && compat_module_q(n);
};

var B = "16.8.0";

function G(n) {
  return h.bind(null, n);
}

function J(n) {
  return !!n && n.$$typeof === compat_module_H;
}

function K(n) {
  return J(n) ? L.apply(null, arguments) : n;
}

function Q(n) {
  return !!n.__k && (H(null, n), !0);
}

function X(n) {
  return n && (n.base || 1 === n.nodeType && n) || null;
}

var Y = function Y(n, t) {
  return n(t);
};

/* harmony default export */ var compat_module = __webpack_exports__["default"] = ({
  useState: hooks_module_m,
  useReducer: hooks_module_p,
  useEffect: hooks_module_l,
  useLayoutEffect: hooks_module_y,
  useRef: hooks_module_d,
  useImperativeHandle: hooks_module_s,
  useMemo: hooks_module_h,
  useCallback: hooks_module_T,
  useContext: hooks_module_w,
  useDebugValue: hooks_module_A,
  version: "16.8.0",
  Children: R,
  render: compat_module_T,
  hydrate: compat_module_T,
  unmountComponentAtNode: Q,
  createPortal: compat_module_z,
  createElement: h,
  createContext: M,
  createFactory: G,
  cloneElement: K,
  createRef: y,
  Fragment: d,
  isValidElement: J,
  findDOMNode: X,
  Component: m,
  PureComponent: compat_module_C,
  memo: compat_module_,
  forwardRef: S,
  unstable_batchedUpdates: Y,
  Suspense: U,
  SuspenseList: O,
  lazy: compat_module_L
});


/***/ }),

/***/ 667:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// NAMESPACE OBJECT: ./node_modules/@walletconnect/iso-crypto/dist/esm/index.js
var iso_crypto_dist_esm_namespaceObject = {};
__webpack_require__.r(iso_crypto_dist_esm_namespaceObject);
__webpack_require__.d(iso_crypto_dist_esm_namespaceObject, "generateKey", function() { return generateKey; });
__webpack_require__.d(iso_crypto_dist_esm_namespaceObject, "verifyHmac", function() { return verifyHmac; });
__webpack_require__.d(iso_crypto_dist_esm_namespaceObject, "encrypt", function() { return encrypt; });
__webpack_require__.d(iso_crypto_dist_esm_namespaceObject, "decrypt", function() { return decrypt; });

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js
var regeneratorRuntime = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(14);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(6);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(7);

// EXTERNAL MODULE: ./node_modules/@walletconnect/ethereum-provider/node_modules/eventemitter3/index.js
var eventemitter3 = __webpack_require__(625);
var eventemitter3_default = /*#__PURE__*/__webpack_require__.n(eventemitter3);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(11);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js + 2 modules
var createSuper = __webpack_require__(10);

// EXTERNAL MODULE: ./node_modules/events/events.js
var events = __webpack_require__(30);

// EXTERNAL MODULE: ./node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
var esm = __webpack_require__(590);

// CONCATENATED MODULE: ./node_modules/@walletconnect/jsonrpc-provider/dist/esm/provider.js








var provider_JsonRpcProvider = /*#__PURE__*/function (_IJsonRpcProvider) {
  Object(inherits["a" /* default */])(JsonRpcProvider, _IJsonRpcProvider);

  var _super = Object(createSuper["a" /* default */])(JsonRpcProvider);

  function JsonRpcProvider(connection) {
    var _this;

    Object(classCallCheck["a" /* default */])(this, JsonRpcProvider);

    _this = _super.call(this, connection);
    _this.events = new events["EventEmitter"]();
    _this.hasRegisteredEventListeners = false;
    _this.connection = _this.setConnection(connection);

    if (_this.connection.connected) {
      _this.registerEventListeners();
    }

    return _this;
  }

  Object(createClass["a" /* default */])(JsonRpcProvider, [{
    key: "connect",
    value: function () {
      var _connect = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee() {
        var connection,
            _args = arguments;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                connection = _args.length > 0 && _args[0] !== undefined ? _args[0] : this.connection;
                _context.next = 3;
                return this.open(connection);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2() {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.close();

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "on",
    value: function on(event, listener) {
      this.events.on(event, listener);
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      this.events.once(event, listener);
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      this.events.off(event, listener);
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      this.events.removeListener(event, listener);
    }
  }, {
    key: "request",
    value: function () {
      var _request2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee3(_request, context) {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.requestStrict(Object(esm["formatJsonRpcRequest"])(_request.method, _request.params || []), context));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function request(_x, _x2) {
        return _request2.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: "requestStrict",
    value: function () {
      var _requestStrict = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee5(request, context) {
        var _this2 = this;

        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee4(resolve, reject) {
                    return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (_this2.connection.connected) {
                              _context4.next = 9;
                              break;
                            }

                            _context4.prev = 1;
                            _context4.next = 4;
                            return _this2.open();

                          case 4:
                            _context4.next = 9;
                            break;

                          case 6:
                            _context4.prev = 6;
                            _context4.t0 = _context4["catch"](1);
                            reject(_context4.t0);

                          case 9:
                            _this2.events.on("".concat(request.id), function (response) {
                              if (Object(esm["isJsonRpcError"])(response)) {
                                reject(response.error);
                              } else {
                                resolve(response.result);
                              }
                            });

                            _context4.prev = 10;
                            _context4.next = 13;
                            return _this2.connection.send(request, context);

                          case 13:
                            _context4.next = 18;
                            break;

                          case 15:
                            _context4.prev = 15;
                            _context4.t1 = _context4["catch"](10);
                            reject(_context4.t1);

                          case 18:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4, null, [[1, 6], [10, 15]]);
                  }));

                  return function (_x5, _x6) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function requestStrict(_x3, _x4) {
        return _requestStrict.apply(this, arguments);
      }

      return requestStrict;
    }()
  }, {
    key: "setConnection",
    value: function setConnection() {
      var connection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.connection;
      return connection;
    }
  }, {
    key: "onPayload",
    value: function onPayload(payload) {
      this.events.emit("payload", payload);

      if (Object(esm["isJsonRpcResponse"])(payload)) {
        this.events.emit("".concat(payload.id), payload);
      } else {
        this.events.emit("message", {
          type: payload.method,
          data: payload.params
        });
      }
    }
  }, {
    key: "open",
    value: function () {
      var _open = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee6() {
        var connection,
            _args6 = arguments;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                connection = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : this.connection;

                if (!(this.connection === connection && this.connection.connected)) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt("return");

              case 3:
                if (this.connection.connected) this.close();

                if (!(typeof connection === "string")) {
                  _context6.next = 8;
                  break;
                }

                _context6.next = 7;
                return this.connection.open(connection);

              case 7:
                connection = this.connection;

              case 8:
                this.connection = this.setConnection(connection);
                _context6.next = 11;
                return this.connection.open();

              case 11:
                this.registerEventListeners();
                this.events.emit("connect");

              case 13:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function open() {
        return _open.apply(this, arguments);
      }

      return open;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee7() {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.connection.close();

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: "registerEventListeners",
    value: function registerEventListeners() {
      var _this3 = this;

      if (this.hasRegisteredEventListeners) return;
      this.connection.on("payload", function (payload) {
        return _this3.onPayload(payload);
      });
      this.connection.on("close", function () {
        return _this3.events.emit("disconnect");
      });
      this.connection.on("error", function (error) {
        return _this3.events.emit("error", error);
      });
      this.hasRegisteredEventListeners = true;
    }
  }]);

  return JsonRpcProvider;
}(esm["IJsonRpcProvider"]);
/* harmony default export */ var provider = (provider_JsonRpcProvider);
// CONCATENATED MODULE: ./node_modules/@walletconnect/jsonrpc-provider/dist/esm/index.js


/* harmony default export */ var dist_esm = (provider);
// EXTERNAL MODULE: ./node_modules/cross-fetch/dist/browser-ponyfill.js
var browser_ponyfill = __webpack_require__(96);
var browser_ponyfill_default = /*#__PURE__*/__webpack_require__.n(browser_ponyfill);

// EXTERNAL MODULE: ./node_modules/@walletconnect/safe-json/dist/esm/index.js
var safe_json_dist_esm = __webpack_require__(610);

// CONCATENATED MODULE: ./node_modules/@walletconnect/jsonrpc-http-connection/dist/esm/http.js








var DEFAULT_HTTP_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
var DEFAULT_HTTP_METHOD = "POST";
var DEFAULT_FETCH_OPTS = {
  headers: DEFAULT_HTTP_HEADERS,
  method: DEFAULT_HTTP_METHOD
};
var http_HttpConnection = /*#__PURE__*/function () {
  function HttpConnection(url) {
    Object(classCallCheck["a" /* default */])(this, HttpConnection);

    this.url = url;
    this.events = new events["EventEmitter"]();
    this.isAvailable = false;
    this.registering = false;

    if (!Object(esm["isHttpUrl"])(url)) {
      throw new Error("Provided URL is not compatible with HTTP connection: ".concat(url));
    }

    this.url = url;
  }

  Object(createClass["a" /* default */])(HttpConnection, [{
    key: "connected",
    get: function get() {
      return this.isAvailable;
    }
  }, {
    key: "connecting",
    get: function get() {
      return this.registering;
    }
  }, {
    key: "on",
    value: function on(event, listener) {
      this.events.on(event, listener);
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      this.events.once(event, listener);
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      this.events.off(event, listener);
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      this.events.removeListener(event, listener);
    }
  }, {
    key: "open",
    value: function () {
      var _open = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee() {
        var url,
            _args = arguments;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = _args.length > 0 && _args[0] !== undefined ? _args[0] : this.url;
                _context.next = 3;
                return this.register(url);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function open() {
        return _open.apply(this, arguments);
      }

      return open;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2() {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.isAvailable) {
                  _context2.next = 2;
                  break;
                }

                throw new Error("Connection already closed");

              case 2:
                this.onClose();

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: "send",
    value: function () {
      var _send = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee3(payload, context) {
        var body, res, data;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.isAvailable) {
                  _context3.next = 3;
                  break;
                }

                _context3.next = 3;
                return this.register();

              case 3:
                _context3.prev = 3;
                body = Object(safe_json_dist_esm["b" /* safeJsonStringify */])(payload);
                _context3.next = 7;
                return browser_ponyfill_default()(this.url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), {
                  body: body
                }));

              case 7:
                res = _context3.sent;
                _context3.next = 10;
                return res.json();

              case 10:
                data = _context3.sent;
                this.onPayload({
                  data: data
                });
                _context3.next = 17;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3["catch"](3);
                this.onError(payload.id, _context3.t0);

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 14]]);
      }));

      function send(_x, _x2) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: "register",
    value: function () {
      var _register = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee4() {
        var _this = this;

        var url,
            body,
            error,
            _args4 = arguments;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : this.url;

                if (Object(esm["isHttpUrl"])(url)) {
                  _context4.next = 3;
                  break;
                }

                throw new Error("Provided URL is not compatible with HTTP connection: ".concat(url));

              case 3:
                if (!this.registering) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", new Promise(function (resolve, reject) {
                  _this.events.once("register_error", function (error) {
                    reject(error);
                  });

                  _this.events.once("open", function () {
                    if (typeof _this.isAvailable === "undefined") {
                      return reject(new Error("HTTP connection is missing or invalid"));
                    }

                    resolve();
                  });
                }));

              case 5:
                this.url = url;
                this.registering = true;
                _context4.prev = 7;
                body = Object(safe_json_dist_esm["b" /* safeJsonStringify */])({
                  id: 1,
                  jsonrpc: "2.0",
                  method: "test",
                  params: []
                });
                _context4.next = 11;
                return browser_ponyfill_default()(url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), {
                  body: body
                }));

              case 11:
                this.onOpen();
                _context4.next = 20;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4["catch"](7);
                error = this.parseError(_context4.t0);
                this.events.emit("register_error", error);
                this.onClose();
                throw error;

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[7, 14]]);
      }));

      function register() {
        return _register.apply(this, arguments);
      }

      return register;
    }()
  }, {
    key: "onOpen",
    value: function onOpen() {
      this.isAvailable = true;
      this.registering = false;
      this.events.emit("open");
    }
  }, {
    key: "onClose",
    value: function onClose() {
      this.isAvailable = false;
      this.registering = false;
      this.events.emit("close");
    }
  }, {
    key: "onPayload",
    value: function onPayload(e) {
      if (typeof e.data === "undefined") return;
      var payload = typeof e.data === "string" ? Object(safe_json_dist_esm["a" /* safeJsonParse */])(e.data) : e.data;
      this.events.emit("payload", payload);
    }
  }, {
    key: "onError",
    value: function onError(id, e) {
      var error = this.parseError(e);
      var message = error.message || error.toString();
      var payload = Object(esm["formatJsonRpcError"])(id, message);
      this.events.emit("payload", payload);
    }
  }, {
    key: "parseError",
    value: function parseError(e) {
      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.url;
      return Object(esm["parseConnectionError"])(e, url, "HTTP");
    }
  }]);

  return HttpConnection;
}();
/* harmony default export */ var esm_http = (http_HttpConnection);
// CONCATENATED MODULE: ./node_modules/@walletconnect/jsonrpc-http-connection/dist/esm/index.js


/* harmony default export */ var jsonrpc_http_connection_dist_esm = (esm_http);
// EXTERNAL MODULE: ./node_modules/@walletconnect/utils/dist/esm/index.js + 8 modules
var utils_dist_esm = __webpack_require__(588);

// EXTERNAL MODULE: ./node_modules/@walletconnect/signer-connection/node_modules/eventemitter3/index.js
var node_modules_eventemitter3 = __webpack_require__(636);
var node_modules_eventemitter3_default = /*#__PURE__*/__webpack_require__.n(node_modules_eventemitter3);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js + 3 modules
var toConsumableArray = __webpack_require__(137);

// EXTERNAL MODULE: ./node_modules/@walletconnect/socket-transport/dist/esm/index.js
var socket_transport_dist_esm = __webpack_require__(637);

// CONCATENATED MODULE: ./node_modules/@walletconnect/core/dist/esm/errors.js
var ERROR_SESSION_CONNECTED = "Session currently connected";
var ERROR_SESSION_DISCONNECTED = "Session currently disconnected";
var ERROR_SESSION_REJECTED = "Session Rejected";
var ERROR_MISSING_JSON_RPC = "Missing JSON RPC response";
var ERROR_MISSING_RESULT = "JSON-RPC success response must include \"result\" field";
var ERROR_MISSING_ERROR = "JSON-RPC error response must include \"error\" field";
var ERROR_MISSING_METHOD = "JSON RPC request must have valid \"method\" value";
var ERROR_MISSING_ID = "JSON RPC request must have valid \"id\" value";
var ERROR_MISSING_REQUIRED = "Missing one of the required parameters: bridge / uri / session";
var ERROR_INVALID_RESPONSE = "JSON RPC response format is invalid";
var ERROR_INVALID_URI = "URI format is invalid";
var ERROR_QRCODE_MODAL_NOT_PROVIDED = "QRCode Modal not provided";
var ERROR_QRCODE_MODAL_USER_CLOSED = "User close QRCode Modal";
// CONCATENATED MODULE: ./node_modules/@walletconnect/core/dist/esm/events.js




var events_EventManager = /*#__PURE__*/function () {
  function EventManager() {
    Object(classCallCheck["a" /* default */])(this, EventManager);

    this._eventEmitters = [];
  }

  Object(createClass["a" /* default */])(EventManager, [{
    key: "subscribe",
    value: function subscribe(eventEmitter) {
      this._eventEmitters.push(eventEmitter);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(event) {
      this._eventEmitters = this._eventEmitters.filter(function (x) {
        return x.event !== event;
      });
    }
  }, {
    key: "trigger",
    value: function trigger(payload) {
      var eventEmitters = [];
      var event;

      if (Object(utils_dist_esm["p" /* isJsonRpcRequest */])(payload)) {
        event = payload.method;
      } else if (Object(utils_dist_esm["r" /* isJsonRpcResponseSuccess */])(payload) || Object(utils_dist_esm["q" /* isJsonRpcResponseError */])(payload)) {
        event = "response:".concat(payload.id);
      } else if (Object(utils_dist_esm["o" /* isInternalEvent */])(payload)) {
        event = payload.event;
      } else {
        event = "";
      }

      if (event) {
        eventEmitters = this._eventEmitters.filter(function (eventEmitter) {
          return eventEmitter.event === event;
        });
      }

      if ((!eventEmitters || !eventEmitters.length) && !Object(utils_dist_esm["t" /* isReservedEvent */])(event) && !Object(utils_dist_esm["o" /* isInternalEvent */])(event)) {
        eventEmitters = this._eventEmitters.filter(function (eventEmitter) {
          return eventEmitter.event === "call_request";
        });
      }

      eventEmitters.forEach(function (eventEmitter) {
        if (Object(utils_dist_esm["q" /* isJsonRpcResponseError */])(payload)) {
          var error = new Error(payload.error.message);
          eventEmitter.callback(error, null);
        } else {
          eventEmitter.callback(null, payload);
        }
      });
    }
  }]);

  return EventManager;
}();

/* harmony default export */ var esm_events = (events_EventManager);
// CONCATENATED MODULE: ./node_modules/@walletconnect/core/dist/esm/storage.js




var storage_SessionStorage = /*#__PURE__*/function () {
  function SessionStorage() {
    var storageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "walletconnect";

    Object(classCallCheck["a" /* default */])(this, SessionStorage);

    this.storageId = storageId;
  }

  Object(createClass["a" /* default */])(SessionStorage, [{
    key: "getSession",
    value: function getSession() {
      var session = null;
      var json = Object(utils_dist_esm["j" /* getLocal */])(this.storageId);

      if (json && Object(utils_dist_esm["v" /* isWalletConnectSession */])(json)) {
        session = json;
      }

      return session;
    }
  }, {
    key: "setSession",
    value: function setSession(session) {
      Object(utils_dist_esm["C" /* setLocal */])(this.storageId, session);
      return session;
    }
  }, {
    key: "removeSession",
    value: function removeSession() {
      Object(utils_dist_esm["B" /* removeLocal */])(this.storageId);
    }
  }]);

  return SessionStorage;
}();

/* harmony default export */ var storage = (storage_SessionStorage);
// CONCATENATED MODULE: ./node_modules/@walletconnect/core/dist/esm/url.js
var domain = "walletconnect.org";
var alphanumerical = "abcdefghijklmnopqrstuvwxyz0123456789";
var bridges = alphanumerical.split("").map(function (char) {
  return "https://".concat(char, ".bridge.walletconnect.org");
});
function extractHostname(url) {
  var hostname = url.indexOf("//") > -1 ? url.split("/")[2] : url.split("/")[0];
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];
  return hostname;
}
function extractRootDomain(url) {
  return extractHostname(url).split(".").slice(-2).join(".");
}
function randomBridgeIndex() {
  return Math.floor(Math.random() * bridges.length);
}
function selectRandomBridgeUrl() {
  return bridges[randomBridgeIndex()];
}
function shouldSelectRandomly(url) {
  return extractRootDomain(url) === domain;
}
function getBridgeUrl(url) {
  if (shouldSelectRandomly(url)) {
    return selectRandomBridgeUrl();
  }

  return url;
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/core/dist/esm/index.js












var esm_Connector = /*#__PURE__*/function () {
  function Connector(opts) {
    Object(classCallCheck["a" /* default */])(this, Connector);

    this.protocol = "wc";
    this.version = 1;
    this._bridge = "";
    this._key = null;
    this._clientId = "";
    this._clientMeta = null;
    this._peerId = "";
    this._peerMeta = null;
    this._handshakeId = 0;
    this._handshakeTopic = "";
    this._connected = false;
    this._accounts = [];
    this._chainId = 0;
    this._networkId = 0;
    this._rpcUrl = "";
    this._eventManager = new esm_events();
    this._clientMeta = Object(utils_dist_esm["i" /* getClientMeta */])() || opts.connectorOpts.clientMeta || null;
    this._cryptoLib = opts.cryptoLib;
    this._sessionStorage = opts.sessionStorage || new storage(opts.connectorOpts.storageId);
    this._qrcodeModal = opts.connectorOpts.qrcodeModal;
    this._qrcodeModalOptions = opts.connectorOpts.qrcodeModalOptions;
    this._signingMethods = [].concat(Object(toConsumableArray["a" /* default */])(utils_dist_esm["D" /* signingMethods */]), Object(toConsumableArray["a" /* default */])(opts.connectorOpts.signingMethods || []));

    if (!opts.connectorOpts.bridge && !opts.connectorOpts.uri && !opts.connectorOpts.session) {
      throw new Error(ERROR_MISSING_REQUIRED);
    }

    if (opts.connectorOpts.bridge) {
      this.bridge = getBridgeUrl(opts.connectorOpts.bridge);
    }

    if (opts.connectorOpts.uri) {
      this.uri = opts.connectorOpts.uri;
    }

    var session = opts.connectorOpts.session || this._getStorageSession();

    if (session) {
      this.session = session;
    }

    if (this.handshakeId) {
      this._subscribeToSessionResponse(this.handshakeId, "Session request rejected");
    }

    this._transport = opts.transport || new socket_transport_dist_esm["a" /* default */]({
      protocol: this.protocol,
      version: this.version,
      url: this.bridge,
      subscriptions: [this.clientId]
    });

    this._subscribeToInternalEvents();

    this._initTransport();

    if (opts.connectorOpts.uri) {
      this._subscribeToSessionRequest();
    }

    if (opts.pushServerOpts) {
      this._registerPushServer(opts.pushServerOpts);
    }
  }

  Object(createClass["a" /* default */])(Connector, [{
    key: "bridge",
    get: function get() {
      return this._bridge;
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      this._bridge = value;
    }
  }, {
    key: "key",
    get: function get() {
      if (this._key) {
        var key = Object(utils_dist_esm["c" /* convertArrayBufferToHex */])(this._key, true);
        return key;
      }

      return "";
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      var key = Object(utils_dist_esm["e" /* convertHexToArrayBuffer */])(value);
      this._key = key;
    }
  }, {
    key: "clientId",
    get: function get() {
      var clientId = this._clientId;

      if (!clientId) {
        clientId = this._clientId = Object(utils_dist_esm["E" /* uuid */])();
      }

      return this._clientId;
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      this._clientId = value;
    }
  }, {
    key: "peerId",
    get: function get() {
      return this._peerId;
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      this._peerId = value;
    }
  }, {
    key: "clientMeta",
    get: function get() {
      var clientMeta = this._clientMeta;

      if (!clientMeta) {
        clientMeta = this._clientMeta = Object(utils_dist_esm["i" /* getClientMeta */])();
      }

      return clientMeta;
    },
    set: function set(value) {}
  }, {
    key: "peerMeta",
    get: function get() {
      var peerMeta = this._peerMeta;
      return peerMeta;
    },
    set: function set(value) {
      this._peerMeta = value;
    }
  }, {
    key: "handshakeTopic",
    get: function get() {
      return this._handshakeTopic;
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      this._handshakeTopic = value;
    }
  }, {
    key: "handshakeId",
    get: function get() {
      return this._handshakeId;
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      this._handshakeId = value;
    }
  }, {
    key: "uri",
    get: function get() {
      var _uri = this._formatUri();

      return _uri;
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      var _this$_parseUri = this._parseUri(value),
          handshakeTopic = _this$_parseUri.handshakeTopic,
          bridge = _this$_parseUri.bridge,
          key = _this$_parseUri.key;

      this.handshakeTopic = handshakeTopic;
      this.bridge = bridge;
      this.key = key;
    }
  }, {
    key: "chainId",
    get: function get() {
      var chainId = this._chainId;
      return chainId;
    },
    set: function set(value) {
      this._chainId = value;
    }
  }, {
    key: "networkId",
    get: function get() {
      var networkId = this._networkId;
      return networkId;
    },
    set: function set(value) {
      this._networkId = value;
    }
  }, {
    key: "accounts",
    get: function get() {
      var accounts = this._accounts;
      return accounts;
    },
    set: function set(value) {
      this._accounts = value;
    }
  }, {
    key: "rpcUrl",
    get: function get() {
      var rpcUrl = this._rpcUrl;
      return rpcUrl;
    },
    set: function set(value) {
      this._rpcUrl = value;
    }
  }, {
    key: "connected",
    get: function get() {
      return this._connected;
    },
    set: function set(value) {}
  }, {
    key: "pending",
    get: function get() {
      return !!this._handshakeTopic;
    },
    set: function set(value) {}
  }, {
    key: "session",
    get: function get() {
      return {
        connected: this.connected,
        accounts: this.accounts,
        chainId: this.chainId,
        bridge: this.bridge,
        key: this.key,
        clientId: this.clientId,
        clientMeta: this.clientMeta,
        peerId: this.peerId,
        peerMeta: this.peerMeta,
        handshakeId: this.handshakeId,
        handshakeTopic: this.handshakeTopic
      };
    },
    set: function set(value) {
      if (!value) {
        return;
      }

      this._connected = value.connected;
      this.accounts = value.accounts;
      this.chainId = value.chainId;
      this.bridge = value.bridge;
      this.key = value.key;
      this.clientId = value.clientId;
      this.clientMeta = value.clientMeta;
      this.peerId = value.peerId;
      this.peerMeta = value.peerMeta;
      this.handshakeId = value.handshakeId;
      this.handshakeTopic = value.handshakeTopic;
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      var eventEmitter = {
        event: event,
        callback: callback
      };

      this._eventManager.subscribe(eventEmitter);
    }
  }, {
    key: "off",
    value: function off(event) {
      this._eventManager.unsubscribe(event);
    }
  }, {
    key: "createInstantRequest",
    value: function () {
      var _createInstantRequest = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(instantRequest) {
        var _this = this;

        var request, endInstantRequest, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._generateKey();

              case 2:
                this._key = _context.sent;
                request = this._formatRequest({
                  method: "wc_instantRequest",
                  params: [{
                    peerId: this.clientId,
                    peerMeta: this.clientMeta,
                    request: this._formatRequest(instantRequest)
                  }]
                });
                this.handshakeId = request.id;
                this.handshakeTopic = Object(utils_dist_esm["E" /* uuid */])();

                this._eventManager.trigger({
                  event: "display_uri",
                  params: [this.uri]
                });

                this.on("modal_closed", function () {
                  throw new Error(ERROR_QRCODE_MODAL_USER_CLOSED);
                });

                endInstantRequest = function endInstantRequest() {
                  _this.killSession();
                };

                _context.prev = 9;
                _context.next = 12;
                return this._sendCallRequest(request);

              case 12:
                result = _context.sent;

                if (result) {
                  endInstantRequest();
                }

                return _context.abrupt("return", result);

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](9);
                endInstantRequest();
                throw _context.t0;

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 17]]);
      }));

      function createInstantRequest(_x) {
        return _createInstantRequest.apply(this, arguments);
      }

      return createInstantRequest;
    }()
  }, {
    key: "connect",
    value: function () {
      var _connect = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee3(opts) {
        var _this2 = this;

        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this._qrcodeModal) {
                  _context3.next = 2;
                  break;
                }

                throw new Error(ERROR_QRCODE_MODAL_NOT_PROVIDED);

              case 2:
                if (!this.connected) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return", {
                  chainId: this.chainId,
                  accounts: this.accounts
                });

              case 4:
                _context3.next = 6;
                return this.createSession(opts);

              case 6:
                return _context3.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2(resolve, reject) {
                    return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _this2.on("modal_closed", function () {
                              return reject(new Error(ERROR_QRCODE_MODAL_USER_CLOSED));
                            });

                            _this2.on("connect", function (error, payload) {
                              if (error) {
                                return reject(error);
                              }

                              resolve(payload.params[0]);
                            });

                          case 2:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x3, _x4) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function connect(_x2) {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "createSession",
    value: function () {
      var _createSession = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee4(opts) {
        var request;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this._connected) {
                  _context4.next = 2;
                  break;
                }

                throw new Error(ERROR_SESSION_CONNECTED);

              case 2:
                if (!this.pending) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return");

              case 4:
                _context4.next = 6;
                return this._generateKey();

              case 6:
                this._key = _context4.sent;
                request = this._formatRequest({
                  method: "wc_sessionRequest",
                  params: [{
                    peerId: this.clientId,
                    peerMeta: this.clientMeta,
                    chainId: opts && opts.chainId ? opts.chainId : null
                  }]
                });
                this.handshakeId = request.id;
                this.handshakeTopic = Object(utils_dist_esm["E" /* uuid */])();

                this._sendSessionRequest(request, "Session update rejected", {
                  topic: this.handshakeTopic
                });

                this._eventManager.trigger({
                  event: "display_uri",
                  params: [this.uri]
                });

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function createSession(_x5) {
        return _createSession.apply(this, arguments);
      }

      return createSession;
    }()
  }, {
    key: "approveSession",
    value: function approveSession(sessionStatus) {
      if (this._connected) {
        throw new Error(ERROR_SESSION_CONNECTED);
      }

      this.chainId = sessionStatus.chainId;
      this.accounts = sessionStatus.accounts;
      this.networkId = sessionStatus.networkId || 0;
      this.rpcUrl = sessionStatus.rpcUrl || "";
      var sessionParams = {
        approved: true,
        chainId: this.chainId,
        networkId: this.networkId,
        accounts: this.accounts,
        rpcUrl: this.rpcUrl,
        peerId: this.clientId,
        peerMeta: this.clientMeta
      };
      var response = {
        id: this.handshakeId,
        jsonrpc: "2.0",
        result: sessionParams
      };

      this._sendResponse(response);

      this._connected = true;

      this._setStorageSession();

      this._eventManager.trigger({
        event: "connect",
        params: [{
          peerId: this.peerId,
          peerMeta: this.peerMeta,
          chainId: this.chainId,
          accounts: this.accounts
        }]
      });
    }
  }, {
    key: "rejectSession",
    value: function rejectSession(sessionError) {
      if (this._connected) {
        throw new Error(ERROR_SESSION_CONNECTED);
      }

      var message = sessionError && sessionError.message ? sessionError.message : ERROR_SESSION_REJECTED;

      var response = this._formatResponse({
        id: this.handshakeId,
        error: {
          message: message
        }
      });

      this._sendResponse(response);

      this._connected = false;

      this._eventManager.trigger({
        event: "disconnect",
        params: [{
          message: message
        }]
      });

      this._removeStorageSession();
    }
  }, {
    key: "updateSession",
    value: function updateSession(sessionStatus) {
      if (!this._connected) {
        throw new Error(ERROR_SESSION_DISCONNECTED);
      }

      this.chainId = sessionStatus.chainId;
      this.accounts = sessionStatus.accounts;
      this.networkId = sessionStatus.networkId || 0;
      this.rpcUrl = sessionStatus.rpcUrl || "";
      var sessionParams = {
        approved: true,
        chainId: this.chainId,
        networkId: this.networkId,
        accounts: this.accounts,
        rpcUrl: this.rpcUrl
      };

      var request = this._formatRequest({
        method: "wc_sessionUpdate",
        params: [sessionParams]
      });

      this._sendSessionRequest(request, "Session update rejected");

      this._eventManager.trigger({
        event: "session_update",
        params: [{
          chainId: this.chainId,
          accounts: this.accounts
        }]
      });

      this._manageStorageSession();
    }
  }, {
    key: "killSession",
    value: function () {
      var _killSession = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee5(sessionError) {
        var message, sessionParams, request;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                message = sessionError ? sessionError.message : "Session Disconnected";
                sessionParams = {
                  approved: false,
                  chainId: null,
                  networkId: null,
                  accounts: null
                };
                request = this._formatRequest({
                  method: "wc_sessionUpdate",
                  params: [sessionParams]
                });
                _context5.next = 5;
                return this._sendRequest(request);

              case 5:
                this._handleSessionDisconnect(message);

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function killSession(_x6) {
        return _killSession.apply(this, arguments);
      }

      return killSession;
    }()
  }, {
    key: "sendTransaction",
    value: function () {
      var _sendTransaction = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee6(tx) {
        var parsedTx, request, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this._connected) {
                  _context6.next = 2;
                  break;
                }

                throw new Error(ERROR_SESSION_DISCONNECTED);

              case 2:
                parsedTx = Object(utils_dist_esm["y" /* parseTransactionData */])(tx);
                request = this._formatRequest({
                  method: "eth_sendTransaction",
                  params: [parsedTx]
                });
                _context6.next = 6;
                return this._sendCallRequest(request);

              case 6:
                result = _context6.sent;
                return _context6.abrupt("return", result);

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function sendTransaction(_x7) {
        return _sendTransaction.apply(this, arguments);
      }

      return sendTransaction;
    }()
  }, {
    key: "signTransaction",
    value: function () {
      var _signTransaction = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee7(tx) {
        var parsedTx, request, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (this._connected) {
                  _context7.next = 2;
                  break;
                }

                throw new Error(ERROR_SESSION_DISCONNECTED);

              case 2:
                parsedTx = Object(utils_dist_esm["y" /* parseTransactionData */])(tx);
                request = this._formatRequest({
                  method: "eth_signTransaction",
                  params: [parsedTx]
                });
                _context7.next = 6;
                return this._sendCallRequest(request);

              case 6:
                result = _context7.sent;
                return _context7.abrupt("return", result);

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function signTransaction(_x8) {
        return _signTransaction.apply(this, arguments);
      }

      return signTransaction;
    }()
  }, {
    key: "signMessage",
    value: function () {
      var _signMessage = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee8(params) {
        var request, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (this._connected) {
                  _context8.next = 2;
                  break;
                }

                throw new Error(ERROR_SESSION_DISCONNECTED);

              case 2:
                request = this._formatRequest({
                  method: "eth_sign",
                  params: params
                });
                _context8.next = 5;
                return this._sendCallRequest(request);

              case 5:
                result = _context8.sent;
                return _context8.abrupt("return", result);

              case 7:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function signMessage(_x9) {
        return _signMessage.apply(this, arguments);
      }

      return signMessage;
    }()
  }, {
    key: "signPersonalMessage",
    value: function () {
      var _signPersonalMessage = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee9(params) {
        var request, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (this._connected) {
                  _context9.next = 2;
                  break;
                }

                throw new Error(ERROR_SESSION_DISCONNECTED);

              case 2:
                params = Object(utils_dist_esm["x" /* parsePersonalSign */])(params);
                request = this._formatRequest({
                  method: "personal_sign",
                  params: params
                });
                _context9.next = 6;
                return this._sendCallRequest(request);

              case 6:
                result = _context9.sent;
                return _context9.abrupt("return", result);

              case 8:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function signPersonalMessage(_x10) {
        return _signPersonalMessage.apply(this, arguments);
      }

      return signPersonalMessage;
    }()
  }, {
    key: "signTypedData",
    value: function () {
      var _signTypedData = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee10(params) {
        var request, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (this._connected) {
                  _context10.next = 2;
                  break;
                }

                throw new Error(ERROR_SESSION_DISCONNECTED);

              case 2:
                request = this._formatRequest({
                  method: "eth_signTypedData",
                  params: params
                });
                _context10.next = 5;
                return this._sendCallRequest(request);

              case 5:
                result = _context10.sent;
                return _context10.abrupt("return", result);

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function signTypedData(_x11) {
        return _signTypedData.apply(this, arguments);
      }

      return signTypedData;
    }()
  }, {
    key: "updateChain",
    value: function () {
      var _updateChain = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee11(chainParams) {
        var request, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (this._connected) {
                  _context11.next = 2;
                  break;
                }

                throw new Error("Session currently disconnected");

              case 2:
                request = this._formatRequest({
                  method: "wallet_updateChain",
                  params: [chainParams]
                });
                _context11.next = 5;
                return this._sendCallRequest(request);

              case 5:
                result = _context11.sent;
                return _context11.abrupt("return", result);

              case 7:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function updateChain(_x12) {
        return _updateChain.apply(this, arguments);
      }

      return updateChain;
    }()
  }, {
    key: "unsafeSend",
    value: function unsafeSend(request, options) {
      var _this3 = this;

      this._sendRequest(request, options);

      this._eventManager.trigger({
        event: "call_request_sent",
        params: [{
          request: request,
          options: options
        }]
      });

      return new Promise(function (resolve, reject) {
        _this3._subscribeToResponse(request.id, function (error, payload) {
          if (error) {
            reject(error);
            return;
          }

          if (!payload) {
            throw new Error(ERROR_MISSING_JSON_RPC);
          }

          resolve(payload);
        });
      });
    }
  }, {
    key: "sendCustomRequest",
    value: function () {
      var _sendCustomRequest = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee12(request, options) {
        var formattedRequest, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (this._connected) {
                  _context12.next = 2;
                  break;
                }

                throw new Error(ERROR_SESSION_DISCONNECTED);

              case 2:
                _context12.t0 = request.method;
                _context12.next = _context12.t0 === "eth_accounts" ? 5 : _context12.t0 === "eth_chainId" ? 6 : _context12.t0 === "eth_sendTransaction" ? 7 : _context12.t0 === "eth_signTransaction" ? 7 : _context12.t0 === "personal_sign" ? 9 : 11;
                break;

              case 5:
                return _context12.abrupt("return", this.accounts);

              case 6:
                return _context12.abrupt("return", Object(utils_dist_esm["f" /* convertNumberToHex */])(this.chainId));

              case 7:
                if (request.params) {
                  request.params[0] = Object(utils_dist_esm["y" /* parseTransactionData */])(request.params[0]);
                }

                return _context12.abrupt("break", 12);

              case 9:
                if (request.params) {
                  request.params = Object(utils_dist_esm["x" /* parsePersonalSign */])(request.params);
                }

                return _context12.abrupt("break", 12);

              case 11:
                return _context12.abrupt("break", 12);

              case 12:
                formattedRequest = this._formatRequest(request);
                _context12.next = 15;
                return this._sendCallRequest(formattedRequest, options);

              case 15:
                result = _context12.sent;
                return _context12.abrupt("return", result);

              case 17:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function sendCustomRequest(_x13, _x14) {
        return _sendCustomRequest.apply(this, arguments);
      }

      return sendCustomRequest;
    }()
  }, {
    key: "approveRequest",
    value: function approveRequest(response) {
      if (Object(utils_dist_esm["r" /* isJsonRpcResponseSuccess */])(response)) {
        var formattedResponse = this._formatResponse(response);

        this._sendResponse(formattedResponse);
      } else {
        throw new Error(ERROR_MISSING_RESULT);
      }
    }
  }, {
    key: "rejectRequest",
    value: function rejectRequest(response) {
      if (Object(utils_dist_esm["q" /* isJsonRpcResponseError */])(response)) {
        var formattedResponse = this._formatResponse(response);

        this._sendResponse(formattedResponse);
      } else {
        throw new Error(ERROR_MISSING_ERROR);
      }
    }
  }, {
    key: "transportClose",
    value: function transportClose() {
      this._transport.close();
    }
  }, {
    key: "_sendRequest",
    value: function () {
      var _sendRequest2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee13(request, options) {
        var callRequest, encryptionPayload, topic, payload, silent;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                callRequest = this._formatRequest(request);
                _context13.next = 3;
                return this._encrypt(callRequest);

              case 3:
                encryptionPayload = _context13.sent;
                topic = typeof (options === null || options === void 0 ? void 0 : options.topic) !== "undefined" ? options.topic : this.peerId;
                payload = JSON.stringify(encryptionPayload);
                silent = typeof (options === null || options === void 0 ? void 0 : options.forcePushNotification) !== "undefined" ? !options.forcePushNotification : Object(utils_dist_esm["u" /* isSilentPayload */])(callRequest);

                this._transport.send(payload, topic, silent);

              case 8:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function _sendRequest(_x15, _x16) {
        return _sendRequest2.apply(this, arguments);
      }

      return _sendRequest;
    }()
  }, {
    key: "_sendResponse",
    value: function () {
      var _sendResponse2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee14(response) {
        var encryptionPayload, topic, payload, silent;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this._encrypt(response);

              case 2:
                encryptionPayload = _context14.sent;
                topic = this.peerId;
                payload = JSON.stringify(encryptionPayload);
                silent = true;

                this._transport.send(payload, topic, silent);

              case 7:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function _sendResponse(_x17) {
        return _sendResponse2.apply(this, arguments);
      }

      return _sendResponse;
    }()
  }, {
    key: "_sendSessionRequest",
    value: function () {
      var _sendSessionRequest2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee15(request, errorMsg, options) {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                this._sendRequest(request, options);

                this._subscribeToSessionResponse(request.id, errorMsg);

              case 2:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function _sendSessionRequest(_x18, _x19, _x20) {
        return _sendSessionRequest2.apply(this, arguments);
      }

      return _sendSessionRequest;
    }()
  }, {
    key: "_sendCallRequest",
    value: function _sendCallRequest(request, options) {
      this._sendRequest(request, options);

      this._eventManager.trigger({
        event: "call_request_sent",
        params: [{
          request: request,
          options: options
        }]
      });

      return this._subscribeToCallResponse(request.id);
    }
  }, {
    key: "_formatRequest",
    value: function _formatRequest(request) {
      if (typeof request.method === "undefined") {
        throw new Error(ERROR_MISSING_METHOD);
      }

      var formattedRequest = {
        id: typeof request.id === "undefined" ? Object(utils_dist_esm["A" /* payloadId */])() : request.id,
        jsonrpc: "2.0",
        method: request.method,
        params: typeof request.params === "undefined" ? [] : request.params
      };
      return formattedRequest;
    }
  }, {
    key: "_formatResponse",
    value: function _formatResponse(response) {
      if (typeof response.id === "undefined") {
        throw new Error(ERROR_MISSING_ID);
      }

      var baseResponse = {
        id: response.id,
        jsonrpc: "2.0"
      };

      if (Object(utils_dist_esm["q" /* isJsonRpcResponseError */])(response)) {
        var error = Object(utils_dist_esm["h" /* formatRpcError */])(response.error);
        var errorResponse = Object.assign(Object.assign(Object.assign({}, baseResponse), response), {
          error: error
        });
        return errorResponse;
      } else if (Object(utils_dist_esm["r" /* isJsonRpcResponseSuccess */])(response)) {
        var successResponse = Object.assign(Object.assign({}, baseResponse), response);
        return successResponse;
      }

      throw new Error(ERROR_INVALID_RESPONSE);
    }
  }, {
    key: "_handleSessionDisconnect",
    value: function _handleSessionDisconnect(errorMsg) {
      var message = errorMsg || "Session Disconnected";

      if (!this._connected) {
        if (this._qrcodeModal) {
          this._qrcodeModal.close();
        }

        Object(utils_dist_esm["B" /* removeLocal */])(utils_dist_esm["w" /* mobileLinkChoiceKey */]);
      }

      if (this._connected) {
        this._connected = false;
      }

      if (this._handshakeId) {
        this._handshakeId = 0;
      }

      if (this._handshakeTopic) {
        this._handshakeTopic = "";
      }

      if (this._peerId) {
        this._peerId = "";
      }

      this._eventManager.trigger({
        event: "disconnect",
        params: [{
          message: message
        }]
      });

      this._removeStorageSession();

      this.transportClose();
    }
  }, {
    key: "_handleSessionResponse",
    value: function _handleSessionResponse(errorMsg, sessionParams) {
      if (sessionParams) {
        if (sessionParams.approved) {
          if (!this._connected) {
            this._connected = true;

            if (sessionParams.chainId) {
              this.chainId = sessionParams.chainId;
            }

            if (sessionParams.accounts) {
              this.accounts = sessionParams.accounts;
            }

            if (sessionParams.peerId && !this.peerId) {
              this.peerId = sessionParams.peerId;
            }

            if (sessionParams.peerMeta && !this.peerMeta) {
              this.peerMeta = sessionParams.peerMeta;
            }

            this._eventManager.trigger({
              event: "connect",
              params: [{
                peerId: this.peerId,
                peerMeta: this.peerMeta,
                chainId: this.chainId,
                accounts: this.accounts
              }]
            });
          } else {
            if (sessionParams.chainId) {
              this.chainId = sessionParams.chainId;
            }

            if (sessionParams.accounts) {
              this.accounts = sessionParams.accounts;
            }

            this._eventManager.trigger({
              event: "session_update",
              params: [{
                chainId: this.chainId,
                accounts: this.accounts
              }]
            });
          }

          this._manageStorageSession();
        } else {
          this._handleSessionDisconnect(errorMsg);
        }
      } else {
        this._handleSessionDisconnect(errorMsg);
      }
    }
  }, {
    key: "_handleIncomingMessages",
    value: function () {
      var _handleIncomingMessages2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee16(socketMessage) {
        var activeTopics, encryptionPayload, payload;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                activeTopics = [this.clientId, this.handshakeTopic];

                if (activeTopics.includes(socketMessage.topic)) {
                  _context16.next = 3;
                  break;
                }

                return _context16.abrupt("return");

              case 3:
                _context16.prev = 3;
                encryptionPayload = JSON.parse(socketMessage.payload);
                _context16.next = 10;
                break;

              case 7:
                _context16.prev = 7;
                _context16.t0 = _context16["catch"](3);
                return _context16.abrupt("return");

              case 10:
                _context16.next = 12;
                return this._decrypt(encryptionPayload);

              case 12:
                payload = _context16.sent;

                if (payload) {
                  this._eventManager.trigger(payload);
                }

              case 14:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this, [[3, 7]]);
      }));

      function _handleIncomingMessages(_x21) {
        return _handleIncomingMessages2.apply(this, arguments);
      }

      return _handleIncomingMessages;
    }()
  }, {
    key: "_subscribeToSessionRequest",
    value: function _subscribeToSessionRequest() {
      this._transport.subscribe(this.handshakeTopic);
    }
  }, {
    key: "_subscribeToResponse",
    value: function _subscribeToResponse(id, callback) {
      this.on("response:".concat(id), callback);
    }
  }, {
    key: "_subscribeToSessionResponse",
    value: function _subscribeToSessionResponse(id, errorMsg) {
      var _this4 = this;

      this._subscribeToResponse(id, function (error, payload) {
        if (error) {
          _this4._handleSessionResponse(error.message);

          return;
        }

        if (Object(utils_dist_esm["r" /* isJsonRpcResponseSuccess */])(payload)) {
          _this4._handleSessionResponse(errorMsg, payload.result);
        } else if (payload.error && payload.error.message) {
          _this4._handleSessionResponse(payload.error.message);
        } else {
          _this4._handleSessionResponse(errorMsg);
        }
      });
    }
  }, {
    key: "_subscribeToCallResponse",
    value: function _subscribeToCallResponse(id) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5._subscribeToResponse(id, function (error, payload) {
          if (error) {
            reject(error);
            return;
          }

          if (Object(utils_dist_esm["r" /* isJsonRpcResponseSuccess */])(payload)) {
            resolve(payload.result);
          } else if (payload.error && payload.error.message) {
            reject(new Error(payload.error.message));
          } else {
            reject(new Error(ERROR_INVALID_RESPONSE));
          }
        });
      });
    }
  }, {
    key: "_subscribeToInternalEvents",
    value: function _subscribeToInternalEvents() {
      var _this6 = this;

      this.on("display_uri", function () {
        if (_this6._qrcodeModal) {
          _this6._qrcodeModal.open(_this6.uri, function () {
            _this6._eventManager.trigger({
              event: "modal_closed",
              params: []
            });
          }, _this6._qrcodeModalOptions);
        }
      });
      this.on("connect", function () {
        if (_this6._qrcodeModal) {
          _this6._qrcodeModal.close();
        }
      });
      this.on("call_request_sent", function (error, payload) {
        var request = payload.params[0].request;

        if (Object(utils_dist_esm["s" /* isMobile */])() && _this6._signingMethods.includes(request.method)) {
          var mobileLinkUrl = Object(utils_dist_esm["j" /* getLocal */])(utils_dist_esm["w" /* mobileLinkChoiceKey */]);

          if (mobileLinkUrl) {
            window.location.href = mobileLinkUrl.href;
          }
        }
      });
      this.on("wc_sessionRequest", function (error, payload) {
        if (error) {
          _this6._eventManager.trigger({
            event: "error",
            params: [{
              code: "SESSION_REQUEST_ERROR",
              message: error.toString()
            }]
          });
        }

        _this6.handshakeId = payload.id;
        _this6.peerId = payload.params[0].peerId;
        _this6.peerMeta = payload.params[0].peerMeta;
        var internalPayload = Object.assign(Object.assign({}, payload), {
          method: "session_request"
        });

        _this6._eventManager.trigger(internalPayload);
      });
      this.on("wc_sessionUpdate", function (error, payload) {
        if (error) {
          _this6._handleSessionResponse(error.message);
        }

        _this6._handleSessionResponse("Session disconnected", payload.params[0]);
      });
    }
  }, {
    key: "_initTransport",
    value: function _initTransport() {
      var _this7 = this;

      this._transport.on("message", function (socketMessage) {
        return _this7._handleIncomingMessages(socketMessage);
      });

      this._transport.on("open", function () {
        return _this7._eventManager.trigger({
          event: "transport_open",
          params: []
        });
      });

      this._transport.on("close", function () {
        return _this7._eventManager.trigger({
          event: "transport_close",
          params: []
        });
      });

      this._transport.on("error", function () {
        return _this7._eventManager.trigger({
          event: "transport_error",
          params: ["Websocket connection failed"]
        });
      });

      this._transport.open();
    }
  }, {
    key: "_formatUri",
    value: function _formatUri() {
      var protocol = this.protocol;
      var handshakeTopic = this.handshakeTopic;
      var version = this.version;
      var bridge = encodeURIComponent(this.bridge);
      var key = this.key;
      var uri = "".concat(protocol, ":").concat(handshakeTopic, "@").concat(version, "?bridge=").concat(bridge, "&key=").concat(key);
      return uri;
    }
  }, {
    key: "_parseUri",
    value: function _parseUri(uri) {
      var result = Object(utils_dist_esm["z" /* parseWalletConnectUri */])(uri);

      if (result.protocol === this.protocol) {
        if (!result.handshakeTopic) {
          throw Error("Invalid or missing handshakeTopic parameter value");
        }

        var handshakeTopic = result.handshakeTopic;

        if (!result.bridge) {
          throw Error("Invalid or missing bridge url parameter value");
        }

        var bridge = decodeURIComponent(result.bridge);

        if (!result.key) {
          throw Error("Invalid or missing key parameter value");
        }

        var key = result.key;
        return {
          handshakeTopic: handshakeTopic,
          bridge: bridge,
          key: key
        };
      } else {
        throw new Error(ERROR_INVALID_URI);
      }
    }
  }, {
    key: "_generateKey",
    value: function () {
      var _generateKey2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee17() {
        var result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (!this._cryptoLib) {
                  _context17.next = 5;
                  break;
                }

                _context17.next = 3;
                return this._cryptoLib.generateKey();

              case 3:
                result = _context17.sent;
                return _context17.abrupt("return", result);

              case 5:
                return _context17.abrupt("return", null);

              case 6:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function _generateKey() {
        return _generateKey2.apply(this, arguments);
      }

      return _generateKey;
    }()
  }, {
    key: "_encrypt",
    value: function () {
      var _encrypt2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee18(data) {
        var key, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                key = this._key;

                if (!(this._cryptoLib && key)) {
                  _context18.next = 6;
                  break;
                }

                _context18.next = 4;
                return this._cryptoLib.encrypt(data, key);

              case 4:
                result = _context18.sent;
                return _context18.abrupt("return", result);

              case 6:
                return _context18.abrupt("return", null);

              case 7:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function _encrypt(_x22) {
        return _encrypt2.apply(this, arguments);
      }

      return _encrypt;
    }()
  }, {
    key: "_decrypt",
    value: function () {
      var _decrypt2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee19(payload) {
        var key, result;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                key = this._key;

                if (!(this._cryptoLib && key)) {
                  _context19.next = 6;
                  break;
                }

                _context19.next = 4;
                return this._cryptoLib.decrypt(payload, key);

              case 4:
                result = _context19.sent;
                return _context19.abrupt("return", result);

              case 6:
                return _context19.abrupt("return", null);

              case 7:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function _decrypt(_x23) {
        return _decrypt2.apply(this, arguments);
      }

      return _decrypt;
    }()
  }, {
    key: "_getStorageSession",
    value: function _getStorageSession() {
      var result = null;

      if (this._sessionStorage) {
        result = this._sessionStorage.getSession();
      }

      return result;
    }
  }, {
    key: "_setStorageSession",
    value: function _setStorageSession() {
      if (this._sessionStorage) {
        this._sessionStorage.setSession(this.session);
      }
    }
  }, {
    key: "_removeStorageSession",
    value: function _removeStorageSession() {
      if (this._sessionStorage) {
        this._sessionStorage.removeSession();
      }
    }
  }, {
    key: "_manageStorageSession",
    value: function _manageStorageSession() {
      if (this._connected) {
        this._setStorageSession();
      } else {
        this._removeStorageSession();
      }
    }
  }, {
    key: "_registerPushServer",
    value: function _registerPushServer(pushServerOpts) {
      if (!pushServerOpts.url || typeof pushServerOpts.url !== "string") {
        throw Error("Invalid or missing pushServerOpts.url parameter value");
      }

      if (!pushServerOpts.type || typeof pushServerOpts.type !== "string") {
        throw Error("Invalid or missing pushServerOpts.type parameter value");
      }

      if (!pushServerOpts.token || typeof pushServerOpts.token !== "string") {
        throw Error("Invalid or missing pushServerOpts.token parameter value");
      }

      var pushSubscription = {
        bridge: this.bridge,
        topic: this.clientId,
        type: pushServerOpts.type,
        token: pushServerOpts.token,
        peerName: "",
        language: pushServerOpts.language || ""
      };
      this.on("connect", /*#__PURE__*/function () {
        var _ref2 = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee20(error, payload) {
          var peerName, response, json;
          return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee20$(_context20) {
            while (1) {
              switch (_context20.prev = _context20.next) {
                case 0:
                  if (!error) {
                    _context20.next = 2;
                    break;
                  }

                  throw error;

                case 2:
                  if (pushServerOpts.peerMeta) {
                    peerName = payload.params[0].peerMeta.name;
                    pushSubscription.peerName = peerName;
                  }

                  _context20.prev = 3;
                  _context20.next = 6;
                  return fetch("".concat(pushServerOpts.url, "/new"), {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(pushSubscription)
                  });

                case 6:
                  response = _context20.sent;
                  _context20.next = 9;
                  return response.json();

                case 9:
                  json = _context20.sent;

                  if (json.success) {
                    _context20.next = 12;
                    break;
                  }

                  throw Error("Failed to register in Push Server");

                case 12:
                  _context20.next = 17;
                  break;

                case 14:
                  _context20.prev = 14;
                  _context20.t0 = _context20["catch"](3);
                  throw Error("Failed to register in Push Server");

                case 17:
                case "end":
                  return _context20.stop();
              }
            }
          }, _callee20, null, [[3, 14]]);
        }));

        return function (_x24, _x25) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }]);

  return Connector;
}();

/* harmony default export */ var core_dist_esm = (esm_Connector);
// EXTERNAL MODULE: ./node_modules/@walletconnect/crypto/dist/esm/browser/index.js
var browser = __webpack_require__(640);

// EXTERNAL MODULE: ./node_modules/@walletconnect/encoding/dist/esm/index.js
var encoding_dist_esm = __webpack_require__(589);

// CONCATENATED MODULE: ./node_modules/@walletconnect/iso-crypto/dist/esm/index.js





function generateKey(_x) {
  return esm_generateKey.apply(this, arguments);
}

function esm_generateKey() {
  esm_generateKey = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(length) {
    var _length, bytes, result;

    return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _length = (length || 256) / 8;
            bytes = browser["randomBytes"](_length);
            result = Object(utils_dist_esm["d" /* convertBufferToArrayBuffer */])(encoding_dist_esm["arrayToBuffer"](bytes));
            return _context.abrupt("return", result);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return esm_generateKey.apply(this, arguments);
}

function verifyHmac(_x2, _x3) {
  return _verifyHmac.apply(this, arguments);
}

function _verifyHmac() {
  _verifyHmac = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2(payload, key) {
    var cipherText, iv, hmac, hmacHex, unsigned, chmac, chmacHex;
    return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cipherText = encoding_dist_esm["hexToArray"](payload.data);
            iv = encoding_dist_esm["hexToArray"](payload.iv);
            hmac = encoding_dist_esm["hexToArray"](payload.hmac);
            hmacHex = encoding_dist_esm["arrayToHex"](hmac, false);
            unsigned = encoding_dist_esm["concatArrays"](cipherText, iv);
            _context2.next = 7;
            return browser["hmacSha256Sign"](key, unsigned);

          case 7:
            chmac = _context2.sent;
            chmacHex = encoding_dist_esm["arrayToHex"](chmac, false);

            if (!(encoding_dist_esm["removeHexPrefix"](hmacHex) === encoding_dist_esm["removeHexPrefix"](chmacHex))) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", true);

          case 11:
            return _context2.abrupt("return", false);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _verifyHmac.apply(this, arguments);
}

function encrypt(_x4, _x5, _x6) {
  return esm_encrypt.apply(this, arguments);
}

function esm_encrypt() {
  esm_encrypt = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee3(data, key, providedIv) {
    var _key, ivArrayBuffer, iv, ivHex, contentString, content, cipherText, cipherTextHex, unsigned, hmac, hmacHex;

    return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _key = encoding_dist_esm["bufferToArray"](Object(utils_dist_esm["b" /* convertArrayBufferToBuffer */])(key));
            _context3.t0 = providedIv;

            if (_context3.t0) {
              _context3.next = 6;
              break;
            }

            _context3.next = 5;
            return generateKey(128);

          case 5:
            _context3.t0 = _context3.sent;

          case 6:
            ivArrayBuffer = _context3.t0;
            iv = encoding_dist_esm["bufferToArray"](Object(utils_dist_esm["b" /* convertArrayBufferToBuffer */])(ivArrayBuffer));
            ivHex = encoding_dist_esm["arrayToHex"](iv, false);
            contentString = JSON.stringify(data);
            content = encoding_dist_esm["utf8ToArray"](contentString);
            _context3.next = 13;
            return browser["aesCbcEncrypt"](iv, _key, content);

          case 13:
            cipherText = _context3.sent;
            cipherTextHex = encoding_dist_esm["arrayToHex"](cipherText, false);
            unsigned = encoding_dist_esm["concatArrays"](cipherText, iv);
            _context3.next = 18;
            return browser["hmacSha256Sign"](_key, unsigned);

          case 18:
            hmac = _context3.sent;
            hmacHex = encoding_dist_esm["arrayToHex"](hmac, false);
            return _context3.abrupt("return", {
              data: cipherTextHex,
              hmac: hmacHex,
              iv: ivHex
            });

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return esm_encrypt.apply(this, arguments);
}

function decrypt(_x7, _x8) {
  return esm_decrypt.apply(this, arguments);
}

function esm_decrypt() {
  esm_decrypt = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee4(payload, key) {
    var _key, verified, cipherText, iv, buffer, utf8, data;

    return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _key = encoding_dist_esm["bufferToArray"](Object(utils_dist_esm["b" /* convertArrayBufferToBuffer */])(key));

            if (_key) {
              _context4.next = 3;
              break;
            }

            throw new Error("Missing key: required for decryption");

          case 3:
            _context4.next = 5;
            return verifyHmac(payload, _key);

          case 5:
            verified = _context4.sent;

            if (verified) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", null);

          case 8:
            cipherText = encoding_dist_esm["hexToArray"](payload.data);
            iv = encoding_dist_esm["hexToArray"](payload.iv);
            _context4.next = 12;
            return browser["aesCbcDecrypt"](iv, _key, cipherText);

          case 12:
            buffer = _context4.sent;
            utf8 = encoding_dist_esm["arrayToUtf8"](buffer);
            _context4.prev = 14;
            data = JSON.parse(utf8);
            _context4.next = 21;
            break;

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](14);
            return _context4.abrupt("return", null);

          case 21:
            return _context4.abrupt("return", data);

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[14, 18]]);
  }));
  return esm_decrypt.apply(this, arguments);
}
// CONCATENATED MODULE: ./node_modules/@walletconnect/client/dist/esm/index.js







var esm_WalletConnect = /*#__PURE__*/function (_Connector) {
  Object(inherits["a" /* default */])(WalletConnect, _Connector);

  var _super = Object(createSuper["a" /* default */])(WalletConnect);

  function WalletConnect(connectorOpts, pushServerOpts) {
    Object(classCallCheck["a" /* default */])(this, WalletConnect);

    return _super.call(this, {
      cryptoLib: iso_crypto_dist_esm_namespaceObject,
      connectorOpts: connectorOpts,
      pushServerOpts: pushServerOpts
    });
  }

  return Object(createClass["a" /* default */])(WalletConnect);
}(core_dist_esm);

/* harmony default export */ var client_dist_esm = (esm_WalletConnect);
// EXTERNAL MODULE: ./node_modules/@walletconnect/qrcode-modal/dist/cjs/index.js
var cjs = __webpack_require__(641);
var cjs_default = /*#__PURE__*/__webpack_require__.n(cjs);

// EXTERNAL MODULE: ./node_modules/@walletconnect/jsonrpc-types/dist/esm/index.js
var jsonrpc_types_dist_esm = __webpack_require__(593);

// CONCATENATED MODULE: ./node_modules/@walletconnect/signer-connection/dist/esm/index.js











var esm_SignerConnection = /*#__PURE__*/function (_IJsonRpcConnection) {
  Object(inherits["a" /* default */])(SignerConnection, _IJsonRpcConnection);

  var _super = Object(createSuper["a" /* default */])(SignerConnection);

  function SignerConnection(opts) {
    var _this;

    Object(classCallCheck["a" /* default */])(this, SignerConnection);

    _this = _super.call(this);
    _this.events = new node_modules_eventemitter3_default.a();
    _this.accounts = [];
    _this.chainId = 1;
    _this.pending = false;
    _this.bridge = "https://bridge.walletconnect.org";
    _this.qrcode = true;
    _this.qrcodeModalOptions = undefined;
    _this.opts = opts;
    _this.chainId = (opts === null || opts === void 0 ? void 0 : opts.chainId) || _this.chainId;
    _this.wc = _this.register(opts);
    return _this;
  }

  Object(createClass["a" /* default */])(SignerConnection, [{
    key: "connected",
    get: function get() {
      return typeof this.wc !== "undefined" && this.wc.connected;
    }
  }, {
    key: "connecting",
    get: function get() {
      return this.pending;
    }
  }, {
    key: "connector",
    get: function get() {
      this.wc = this.register(this.opts);
      return this.wc;
    }
  }, {
    key: "on",
    value: function on(event, listener) {
      this.events.on(event, listener);
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      this.events.once(event, listener);
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      this.events.off(event, listener);
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      this.events.removeListener(event, listener);
    }
  }, {
    key: "open",
    value: function () {
      var _open = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(chainId) {
        var _this2 = this;

        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.connected) {
                  _context.next = 3;
                  break;
                }

                this.onOpen();
                return _context.abrupt("return");

              case 3:
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  _this2.on("error", function (err) {
                    reject(err);
                  });

                  _this2.on("open", function () {
                    resolve();
                  });

                  _this2.create(chainId);
                }));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function open(_x) {
        return _open.apply(this, arguments);
      }

      return open;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2() {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(typeof this.wc === "undefined")) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                if (this.wc.connected) {
                  this.wc.killSession();
                }

                this.onClose();

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: "send",
    value: function () {
      var _send = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee3(payload) {
        var _this3 = this;

        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.wc = this.register(this.opts);

                if (this.connected) {
                  _context3.next = 4;
                  break;
                }

                _context3.next = 4;
                return this.open();

              case 4:
                this.sendPayload(payload).then(function (res) {
                  return _this3.events.emit("payload", res);
                }).catch(function (e) {
                  return _this3.events.emit("payload", Object(esm["formatJsonRpcError"])(payload.id, e.message));
                });

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function send(_x2) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: "register",
    value: function register(opts) {
      if (this.wc) return this.wc;
      this.opts = opts || this.opts;
      this.bridge = (opts === null || opts === void 0 ? void 0 : opts.connector) ? opts.connector.bridge : (opts === null || opts === void 0 ? void 0 : opts.bridge) || "https://bridge.walletconnect.org";
      this.qrcode = typeof (opts === null || opts === void 0 ? void 0 : opts.qrcode) === "undefined" || opts.qrcode !== false;
      this.chainId = typeof (opts === null || opts === void 0 ? void 0 : opts.chainId) !== "undefined" ? opts.chainId : this.chainId;
      this.qrcodeModalOptions = opts === null || opts === void 0 ? void 0 : opts.qrcodeModalOptions;
      var connectorOpts = {
        bridge: this.bridge,
        qrcodeModal: this.qrcode ? cjs_default.a : undefined,
        qrcodeModalOptions: this.qrcodeModalOptions,
        storageId: opts === null || opts === void 0 ? void 0 : opts.storageId,
        signingMethods: opts === null || opts === void 0 ? void 0 : opts.signingMethods,
        clientMeta: opts === null || opts === void 0 ? void 0 : opts.clientMeta
      };
      this.wc = typeof (opts === null || opts === void 0 ? void 0 : opts.connector) !== "undefined" ? opts.connector : new client_dist_esm(connectorOpts);

      if (typeof this.wc === "undefined") {
        throw new Error("Failed to register WalletConnect connector");
      }

      if (this.wc.accounts.length) {
        this.accounts = this.wc.accounts;
      }

      if (this.wc.chainId) {
        this.chainId = this.wc.chainId;
      }

      this.registerConnectorEvents();
      return this.wc;
    }
  }, {
    key: "onOpen",
    value: function onOpen(wc) {
      this.pending = false;

      if (wc) {
        this.wc = wc;
      }

      this.events.emit("open");
    }
  }, {
    key: "onClose",
    value: function onClose() {
      this.pending = false;

      if (this.wc) {
        this.wc = undefined;
      }

      this.events.emit("close");
    }
  }, {
    key: "onError",
    value: function onError(payload) {
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Failed or Rejected Request";
      var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -32000;
      var errorPayload = {
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        error: {
          code: code,
          message: message
        }
      };
      this.events.emit("payload", errorPayload);
      return errorPayload;
    }
  }, {
    key: "create",
    value: function create(chainId) {
      var _this4 = this;

      this.wc = this.register(this.opts);
      this.chainId = chainId || this.chainId;
      if (this.connected || this.pending) return;
      this.pending = true;
      this.registerConnectorEvents();
      this.wc.createSession({
        chainId: this.chainId
      }).then(function () {
        return _this4.events.emit("created");
      }).catch(function (e) {
        return _this4.events.emit("error", e);
      });
    }
  }, {
    key: "registerConnectorEvents",
    value: function registerConnectorEvents() {
      var _this5 = this;

      this.wc = this.register(this.opts);
      this.wc.on("connect", function (err) {
        var _a, _b;

        if (err) {
          _this5.events.emit("error", err);

          return;
        }

        _this5.accounts = ((_a = _this5.wc) === null || _a === void 0 ? void 0 : _a.accounts) || [];
        _this5.chainId = ((_b = _this5.wc) === null || _b === void 0 ? void 0 : _b.chainId) || _this5.chainId;

        _this5.onOpen();
      });
      this.wc.on("disconnect", function (err) {
        if (err) {
          _this5.events.emit("error", err);

          return;
        }

        _this5.onClose();
      });
      this.wc.on("modal_closed", function () {
        _this5.events.emit("error", new Error("User closed modal"));
      });
      this.wc.on("session_update", function (error, payload) {
        var _payload$params$ = payload.params[0],
            accounts = _payload$params$.accounts,
            chainId = _payload$params$.chainId;

        if (!_this5.accounts || accounts && _this5.accounts !== accounts) {
          _this5.accounts = accounts;

          _this5.events.emit("accountsChanged", accounts);
        }

        if (!_this5.chainId || chainId && _this5.chainId !== chainId) {
          _this5.chainId = chainId;

          _this5.events.emit("chainChanged", chainId);
        }
      });
    }
  }, {
    key: "sendPayload",
    value: function () {
      var _sendPayload = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee4(payload) {
        var response;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.wc = this.register(this.opts);
                _context4.prev = 1;
                _context4.next = 4;
                return this.wc.unsafeSend(payload);

              case 4:
                response = _context4.sent;
                return _context4.abrupt("return", this.sanitizeResponse(response));

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](1);
                return _context4.abrupt("return", this.onError(payload, _context4.t0.message));

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 8]]);
      }));

      function sendPayload(_x3) {
        return _sendPayload.apply(this, arguments);
      }

      return sendPayload;
    }()
  }, {
    key: "sanitizeResponse",
    value: function sanitizeResponse(response) {
      return typeof response.error !== "undefined" && typeof response.error.code === "undefined" ? Object(esm["formatJsonRpcError"])(response.id, response.error.message) : response;
    }
  }]);

  return SignerConnection;
}(jsonrpc_types_dist_esm["IJsonRpcConnection"]);
/* harmony default export */ var signer_connection_dist_esm = (esm_SignerConnection);
// CONCATENATED MODULE: ./node_modules/@walletconnect/ethereum-provider/dist/esm/index.js










var esm_WalletConnectProvider = /*#__PURE__*/function () {
  function WalletConnectProvider(opts) {
    Object(classCallCheck["a" /* default */])(this, WalletConnectProvider);

    this.events = new eventemitter3_default.a();
    this.rpc = {
      infuraId: opts === null || opts === void 0 ? void 0 : opts.infuraId,
      custom: opts === null || opts === void 0 ? void 0 : opts.rpc
    };
    this.signer = new provider_JsonRpcProvider(new esm_SignerConnection(opts));
    var chainId = this.signer.connection.chainId || (opts === null || opts === void 0 ? void 0 : opts.chainId) || 1;
    this.http = this.setHttpProvider(chainId);
    this.registerEventListeners();
  }

  Object(createClass["a" /* default */])(WalletConnectProvider, [{
    key: "connected",
    get: function get() {
      return this.signer.connection.connected;
    }
  }, {
    key: "connector",
    get: function get() {
      return this.signer.connection.connector;
    }
  }, {
    key: "accounts",
    get: function get() {
      return this.signer.connection.accounts;
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.signer.connection.chainId;
    }
  }, {
    key: "rpcUrl",
    get: function get() {
      var _a;

      return ((_a = this.http) === null || _a === void 0 ? void 0 : _a.connection).url || "";
    }
  }, {
    key: "request",
    value: function () {
      var _request = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee(args) {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = args.method;
                _context.next = _context.t0 === "eth_requestAccounts" ? 3 : _context.t0 === "eth_accounts" ? 6 : _context.t0 === "eth_chainId" ? 7 : 8;
                break;

              case 3:
                _context.next = 5;
                return this.connect();

              case 5:
                return _context.abrupt("return", this.signer.connection.accounts);

              case 6:
                return _context.abrupt("return", this.signer.connection.accounts);

              case 7:
                return _context.abrupt("return", this.signer.connection.chainId);

              case 8:
                return _context.abrupt("break", 9);

              case 9:
                if (!utils_dist_esm["D" /* signingMethods */].includes(args.method)) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", this.signer.request(args));

              case 11:
                if (!(typeof this.http === "undefined")) {
                  _context.next = 13;
                  break;
                }

                throw new Error("Cannot request JSON-RPC method (".concat(args.method, ") without provided rpc url"));

              case 13:
                return _context.abrupt("return", this.http.request(args));

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function request(_x) {
        return _request.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: "sendAsync",
    value: function sendAsync(args, callback) {
      this.request(args).then(function (response) {
        return callback(null, response);
      }).catch(function (error) {
        return callback(error, undefined);
      });
    }
  }, {
    key: "enable",
    value: function () {
      var _enable = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee2() {
        var accounts;
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.request({
                  method: "eth_requestAccounts"
                });

              case 2:
                accounts = _context2.sent;
                return _context2.abrupt("return", accounts);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function enable() {
        return _enable.apply(this, arguments);
      }

      return enable;
    }()
  }, {
    key: "connect",
    value: function () {
      var _connect = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee3() {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.signer.connection.connected) {
                  _context3.next = 3;
                  break;
                }

                _context3.next = 3;
                return this.signer.connect();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = Object(asyncToGenerator["a" /* default */])( /*#__PURE__*/Object(regeneratorRuntime["a" /* default */])().mark(function _callee4() {
        return Object(regeneratorRuntime["a" /* default */])().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.signer.connection.connected) {
                  _context4.next = 3;
                  break;
                }

                _context4.next = 3;
                return this.signer.disconnect();

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "on",
    value: function on(event, listener) {
      this.events.on(event, listener);
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      this.events.once(event, listener);
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      this.events.removeListener(event, listener);
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      this.events.off(event, listener);
    }
  }, {
    key: "isWalletConnect",
    get: function get() {
      return true;
    }
  }, {
    key: "registerEventListeners",
    value: function registerEventListeners() {
      var _this = this;

      this.signer.connection.on("accountsChanged", function (accounts) {
        _this.events.emit("accountsChanged", accounts);
      });
      this.signer.connection.on("chainChanged", function (chainId) {
        _this.http = _this.setHttpProvider(chainId);

        _this.events.emit("chainChanged", chainId);
      });
      this.signer.on("disconnect", function () {
        _this.events.emit("disconnect");
      });
    }
  }, {
    key: "setHttpProvider",
    value: function setHttpProvider(chainId) {
      var rpcUrl = Object(utils_dist_esm["m" /* getRpcUrl */])(chainId, this.rpc);
      if (typeof rpcUrl === "undefined") return undefined;
      var http = new provider_JsonRpcProvider(new http_HttpConnection(rpcUrl));
      return http;
    }
  }]);

  return WalletConnectProvider;
}();

/* harmony default export */ var ethereum_provider_dist_esm = __webpack_exports__["default"] = (esm_WalletConnectProvider);

/***/ })

}]);
//# sourceMappingURL=1.34d7b15d.chunk.js.map