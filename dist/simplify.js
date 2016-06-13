/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _simplify = __webpack_require__(1);

	window.simplify = _simplify.simplify;

	exports.default = _simplify.simplify;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Vertex = function Vertex(v) {
	  _classCallCheck(this, Vertex);

	  this.v = new THREE.Vector3().set(v.x, v.y, v.z);
	  this.quadric = new THREE.Matrix4();
	};

	var Face = function Face(v1, v2, v3) {
	  _classCallCheck(this, Face);

	  this.v1 = v1;
	  this.v2 = v2;
	  this.v3 = v3;

	  this.removed = false;
	};

	var Pair = function () {
	  function Pair(A, B) {
	    _classCallCheck(this, Pair);

	    // TODO fix
	    if (B.less(A)) {
	      A, B = B, A;
	    }
	    this.A = A;
	    this.B = B;
	    this.index = 0;
	    this.removed = false;
	    this.cachedError = 9001;

	    this.quadric = this.quadric.bind(this);
	  }

	  _createClass(Pair, [{
	    key: 'vector',
	    value: function vector() {
	      // magic to give nicest vector given two vertices
	    }
	  }, {
	    key: 'quadric',
	    value: function quadric() {
	      return this.A.Quadric.Add(this.B.Quadric);
	    }
	  }]);

	  return Pair;
	}();

	var PriorityQueue = function PriorityQueue() {
	  // TODO make, or find package

	  _classCallCheck(this, PriorityQueue);
	};

	var simplify = exports.simplify = function simplify(_ref) {
	  var mesh = _ref.mesh;
	  var _ref$factor = _ref.factor;
	  var factor = _ref$factor === undefined ? 1 : _ref$factor;
	  var _ref$threshold = _ref.threshold;
	  var threshold = _ref$threshold === undefined ? 0 : _ref$threshold;

	  console.log(mesh);
	  console.log(factor);

	  var triangles = mesh.geometry.faces;

	  // Map of distinct vertices
	  // TODO ensure distinct
	  // TODO better name
	  var vectorToVertex = [];

	  var computeTriangleQuadric = function computeTriangleQuadric(triangle) {
	    // const { a, b, c } = triangle
	    var v1 = vectorToVertex[triangle.a];
	    var v2 = vectorToVertex[triangle.b];
	    var v3 = vectorToVertex[triangle.c];
	    console.log(v1.v, v2.v, v3.v);

	    var e1 = new THREE.Vector3().subVectors(v2.v, v1.v);
	    var e2 = new THREE.Vector3().subVectors(v3.v, v1.v);
	    console.log(e1, e2);

	    var n = new THREE.Vector3().crossVectors(e1, e2).normalize();

	    var _v1$v = v1.v;
	    var x = _v1$v.x;
	    var y = _v1$v.y;
	    var z = _v1$v.z;
	    // const { x as a, y as b, z as c } = n

	    var a = n.x;
	    var b = n.y;
	    var c = n.z;
	    var d = -a * x - b * y - c * z;

	    var mat = new THREE.Matrix4().set(a * a, a * b, a * c, a * d, a * b, b * b, b * c, b * d, a * c, b * c, c * c, c * d, a * d, b * d, c * d, d * d);

	    return mat;

	    // e1 := t.V2.Sub(t.V1)
	    // e2 := t.V3.Sub(t.V1)
	    // n := e1.Cross(e2).Normalize()
	    // x, y, z := t.V1.X, t.V1.Y, t.V1.Z
	    // a, b, c := n.X, n.Y, n.Z
	    // d := -a*x - b*y - c*z
	    // return Matrix{
	    // 	a * a, a * b, a * c, a * d,
	    // 	a * b, b * b, b * c, b * d,
	    // 	a * c, b * c, c * c, c * d,
	    // 	a * d, b * d, c * d, d * d,
	    // }
	  };

	  for (var i = 0; i < triangles.length; i++) {
	    // a, b, c are vertex indices
	    var _triangles$i = triangles[i];
	    var a = _triangles$i.a;
	    var b = _triangles$i.b;
	    var c = _triangles$i.c;

	    vectorToVertex[a] = new Vertex(mesh.geometry.vertices[a]);
	    vectorToVertex[b] = new Vertex(mesh.geometry.vertices[b]);
	    vectorToVertex[c] = new Vertex(mesh.geometry.vertices[c]);
	  }

	  // ===========================================================================
	  // 1. Compute Q for all initial vertices
	  // ===========================================================================
	  for (var _i = 0; _i < triangles.length; _i++) {
	    var triangle = triangles[_i];
	    var q = computeTriangleQuadric(triangle);
	    console.log(q);

	    var a = triangle.a;
	    var b = triangle.b;
	    var c = triangle.c;

	    var v1 = vectorToVertex[a];
	    var v2 = vectorToVertex[b];
	    var v3 = vectorToVertex[c];

	    // assumes add mutates it
	    v1.quadric = addMatrix4(v1.quadric, q);
	    v2.quadric = addMatrix4(v2.quadric, q);
	    v3.quadric = addMatrix4(v3.quadric, q);
	  }

	  var vertexToFaces = {};
	  for (var _i2 = 0; _i2 < triangles.length; _i2++) {
	    var _triangles$_i = triangles[_i2];
	    var a = _triangles$_i.a;
	    var b = _triangles$_i.b;
	    var c = _triangles$_i.c;

	    var _v = vectorToVertex[a];
	    var _v2 = vectorToVertex[b];
	    var _v3 = vectorToVertex[c];

	    var face = new Face(_v, _v2, _v3);

	    // TODO fix
	    vertexToFaces[_v] = [].concat(_toConsumableArray(vertexToFaces[_v])).push(face);
	    vertexToFaces[_v2] = [].concat(_toConsumableArray(vertexToFaces[_v2])).push(face);
	    vertexToFaces[_v3] = [].concat(_toConsumableArray(vertexToFaces[_v3])).push(face);
	  }

	  // ===========================================================================
	  // 2. Select all valid pairs (edge or distance < threshold)
	  // ===========================================================================
	  // TODO threshold
	  var pairs = {};
	  for (var _i3 = 0; _i3 < triangles.length; _i3++) {
	    var _triangles$_i2 = triangles[_i3];
	    var a = _triangles$_i2.a;
	    var b = _triangles$_i2.b;
	    var c = _triangles$_i2.c;

	    var _v4 = vectorToVertex[a];
	    var _v5 = vectorToVertex[b];
	    var _v6 = vectorToVertex[c];

	    pairs[{ v1: _v4, v2: _v5 }] = new Pair(_v4, _v5);
	    pairs[{ v2: _v5, v3: _v6 }] = new Pair(_v5, _v6);
	    pairs[{ v3: _v6, v1: _v4 }] = new Pair(_v6, _v4);
	  }

	  // where?
	  // ===========================================================================
	  // 3. Compute q for each (v1, v2) pair. Cost = q^T(Q1+Q2)q
	  // ===========================================================================

	  // ===========================================================================
	  // 4. Heap keyed on cost with min. at top
	  // ===========================================================================
	  var queue = new PriorityQueue();
	  var vertexToPairs = {};
	  for (var _i4 = 0; _i4 < pairs.length; _i4++) {
	    queue.push(p);

	    // TODO make append, or otherwise
	    vertexToPairs[p.A] = append(vertexToPairs[p.A], p);
	    vertexToPairs[p.B] = append(vertexToPairs[p.B], p);
	  }

	  // ===========================================================================
	  // 5. Iteratively remove (v1, v2) of least cost, contract, update costs of
	  // everything with v1
	  // ===========================================================================
	  var numFaces = triangles.length;
	  var target = numFaces * factor;

	  var _loop = function _loop() {
	    var p = queue.pop();

	    if (p.removed) return 'continue';
	    p.removed = true;

	    var distinctFaces = {};
	    for (var _i7 = 0; _i7 < vertexToFaces[p.A].length; _i7++) {
	      var _face = vertexToFaces[p.A][_i7];
	      if (!_face.removed) {
	        distinctFaces[_face] = true;
	      }
	    }
	    for (var _i8 = 0; _i8 < vertexToFaces[p.B].length; _i8++) {
	      var _face2 = vertexToFaces[p.B][_i8];
	      if (!_face2.removed) {
	        distinctFaces[_face2] = true;
	      }
	    }

	    var distinctPairs = {}[('A', 'B')].forEach(function (it) {
	      for (var _i9 = 0; _i9 < vertexToPairs[p[it]].length; _i9++) {
	        var _q = vertexToPairs[p[it]][_i9];

	        if (!_q.removed) {
	          distinctPairs[_q] = true;
	        }
	      }
	    });

	    var v = new Vertex(p.vector(), p.quadric())[('A', 'B')].forEach(function (it) {
	      return delete (vertexToFaces, p[it]);
	    });
	    for (var _i10 = 0; _i10 < distinctFaces.length; _i10++) {
	      var _face3 = distinctFaces[_i10];
	      _face3.removed = true;
	      numFaces--;

	      var _v10 = _face3.v1;
	      var _v11 = _face3.v2;
	      var _v12 = _face3.v3;

	      if (_v10 === p.A || _v10 === p.B) _v10 = v;
	      if (_v11 === p.A || _v11 === p.B) _v11 = v;
	      if (_v12 === p.A || _v12 === p.B) _v12 = v;

	      var _f = new Face(_v10, _v11, _v12);

	      if (!_f.Degenerate()) {
	        numFaces++;
	        vertexToFaces[_v10] = append(vertexFaces[_v10], _f);
	        vertexToFaces[_v11] = append(vertexFaces[_v11], _f);
	        vertexToFaces[_v12] = append(vertexFaces[_v12], _f);
	      }
	    }

	    ['A', 'B'].forEach(function (it) {
	      return delete (vertexToPairs, p[it]);
	    });
	    var seen = {};
	    for (var _i11 = 0; _i11 < distinctPairs.length; _i11++) {
	      var _q2 = distinctPairs[_i11];
	      _q2.removed = true;
	      queue.pop(_q2.index);

	      var a = _q2.a;
	      var b = _q2.b;

	      if (a === p.A || a === p.B) a = v;
	      if (b === p.A || b === p.B) b = v;
	      if (b === v) a, b = b, a; // swap so that a == v

	      if (seen[b.vector]) continue;

	      seen[b.vector] = true;

	      var q2 = new Pair(a, b);
	      queue.push(q2);
	      vertexToPairs[a] = append(vertexToPairs[a], _q2);
	      vertexToPairs[b] = append(vertexToPairs[b], _q2);
	    }
	  };

	  while (numFaces > target) {
	    var _ret = _loop();

	    if (_ret === 'continue') continue;
	  }

	  // find disctinct faces
	  var distinctFaces = {};
	  for (var _i5 = 0; _i5 < vertexToFaces.length; _i5++) {
	    for (var j = 0; j < vertexToFaces[_i5].length; j++) {
	      var f = vertexToFaces[_i5][j];
	      if (!f.removed) distinctFaces[f] = true;
	    }
	  }

	  // construct resulting mesh
	  var newTriangles = [];
	  for (var _i6 = 0; _i6 < distinctFaces.length; _i6++) {
	    var _distinctFaces$_i = distinctFaces[_i6];
	    var _v7 = _distinctFaces$_i.v1;
	    var _v8 = _distinctFaces$_i.v2;
	    var _v9 = _distinctFaces$_i.v3;


	    newTriangles[_i6] = new Triangle(_v7, _v8, _v9);
	  }

	  return new Mesh(newTriangles);
	};

/***/ }
/******/ ]);