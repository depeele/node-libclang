// Copyright 2013 Timothy J Fontaine <tjfontaine@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE
'use strict';

const Clang = require('./clang-c');
const Lib   = Clang.libclang;
const Util  = require('./util');
const Ref   = require('ref');
const File  = require('./file').File;

class Location extends Object {
  constructor(instance) {
    super();

    this._instance = instance;
  }

  get presumedLocation() {
    const self    = this;
    const file    = Ref.alloc( Clang.CXString );
    const line    = Ref.alloc( Ref.types.uint32 );
    const column  = Ref.alloc( Ref.types.uint32 );

    Lib.clang_getPresumedLocation(self._instance,
                                          file, line, column);

    return {
      filename: Util.toString(file.deref()),
      line:     line.deref(),
      column:   column.deref(),
    };
  }

  get fileLocation() {
    const self    = this;
    const file    = Ref.alloc( Clang.CXFile );
    const line    = Ref.alloc( Ref.types.uint32 );
    const column  = Ref.alloc( Ref.types.uint32 );
    const offset  = Ref.alloc( Ref.types.uint32 );

    Lib.clang_getFileLocation( self._instance,
                               file, line, column, offset);

    return {
      filename: new File(file.deref()).name,
      line:     line.deref(),
      column:   column.deref(),
      offset:   offset.deref(),
    };
  }

  get expansionLocation() {
    const self    = this;
    const file    = Ref.alloc( Clang.CXFile );
    const line    = Ref.alloc( Ref.types.uint32 );
    const column  = Ref.alloc( Ref.types.uint32 );
    const offset  = Ref.alloc( Ref.types.uint32 );

    Lib.clang_getExpansionLocation( self._instance,
                                    file, line, column, offset);

    return {
      filename: new File(file.deref()).name,
      line:     line.deref(),
      column:   column.deref(),
      offset:   offset.deref(),
    };
  }

  get isInSystemHeader() {
    Lib.clang_Location_isInSystemHeader( this._instance );
  }

  get isFromMainFile() {
    Lib.clang_Location_isFromMainFile( this._instance );
  }
}

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    Location,
  Location:   Location,
}
