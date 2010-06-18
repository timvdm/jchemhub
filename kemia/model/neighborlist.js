goog.provide('kemia.model.NeighborList');
goog.require('goog.math.Vec2');
goog.require('goog.array');

(function () {

    function debug(text, noNewLine) {
        var logDiv = document.getElementById("logDiv");
        if (!logDiv) {
        var body = document.getElementsByTagName("body")[0];
            logDiv = document.createElement("div");
            logDiv.id = "logDiv";
            body.appendChild(logDiv);
        }
        if (noNewLine) {
            logDiv.innerHTML += text;
        } else {
        logDiv.innerHTML += text + "<br>";
        }
    };

    /**
     * Class for computing the object for a specified coordinate.
     *
     * <pre class="code">
     * var neighborList = new kemia.model.NeighborList(molecule);
     * neighborList.getNearest({ x: 4, y: 5 });
     * </pre>
     *
     * @class Class for computing objects for a specfied coordinate.
     * @param {Array.<Object>} objects The objects to initialize the grid.
     * @param {Number} opt_cellSize The cell size, default is 2. This is in atomic units.
     * @param {Number} opt_tolerance The tolerance to consider an atom close enough
     *        to the specified coordinate. The default is 0.3. This is in atomic units.
     */
    kemia.model.NeighborList = function(objects, opt_cellSize, opt_tolerance) {
        this.cells = [];
        this.cellSize = opt_cellSize ? opt_cellSize : 2;
        this.tolerance = opt_tolerance ? opt_tolerance : 0.3;
        this.xMin = 100000;
        this.yMin = 100000;
        this.xMax = -100000;
        this.yMax = -100000;

        // find min/max values for the grid
        for (var i = 0, li = objects.length; i < li; i++) {
            var obj = objects[i];
            if (obj instanceof kemia.model.Molecule) {
                for (var j = 0, lj = obj.countAtoms(); j < lj; j++) {
                    var atom = obj.atoms[j];
                    if (atom.coord.x < this.xMin) {
                        this.xMin = atom.coord.x;
                    }
                    if (atom.coord.x > this.xMax) {
                        this.xMax = atom.coord.x;
                    }
                    if (atom.coord.y < this.yMin) {
                        this.yMin = atom.coord.y;
                    }
                    if (atom.coord.y > this.yMax) {
                        this.yMax = atom.coord.y;
                    }
                }
            }
        }

        this.xMin -= 1;
        this.yMin -= 1;
        this.xMax += 1;
        this.yMax += 1;


        // compute number of cells and create them
        this.width = this.xMax - this.xMin;
        this.height = this.yMax - this.yMin;
        this.xDim = Math.ceil(this.width / this.cellSize);
        this.yDim = Math.ceil(this.height / this.cellSize);
        for (var i = 0, li = this.xDim * this.yDim; i < li; i++) {
            this.cells.push([]);
        }

        // add the objects to the grid    
        goog.array.forEach(objects, function(obj){
        	if (obj instanceof kemia.model.Molecule) {
        		 var molecule = obj;
        		 goog.array.forEach(molecule.atoms, function(atom){
                     var x = Math.floor((atom.coord.x - this.xMin) / this.cellSize);
                     var y = Math.floor((atom.coord.y - this.yMin) / this.cellSize);
                     this.cells[y * this.xDim + x].push(atom);
        		 },this);
        		 goog.array.forEach(molecule.bonds, function(bond){
                     var midPoint = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.sum(bond.source.coord, bond.target.coord));
                     midPoint.scale(0.5);
                     bond.midPoint = midPoint;
                     var x = Math.floor((midPoint.x - this.xMin) / this.cellSize);
                     var y = Math.floor((midPoint.y - this.yMin) / this.cellSize);
                     this.cells[y * this.xDim + x].push(bond);
        		 }, this);
        	}
        }, this);
    };


    function cellsAroundCoord(self, coord) {
        var cells = [];
        var x = Math.floor((coord.x - self.xMin) / self.cellSize);
        var y = Math.floor((coord.y - self.yMin) / self.cellSize);

        for (var i = x - 1, li = x + 2; i < li; i++) {
            if (i < 0 || i >= self.xDim) {
                continue;
            }
            for (var j = y - 1, lj = y + 2; j < lj; j++) {
                if (j < 0 || j >= self.yDim) {
                    continue;
                }
                cells.push(j * self.xDim + i);
            }
        }

        return cells;    
    }

    function triangleSign(a, b, c)
    {
        return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
    }

    function isCoordInBondBoundingBox(coord, bond, tolerance) {
        var bv = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.difference(bond.source.coord, bond.target.coord));
        var bondLength = bv.magnitude();
        bv.scale(1 / bondLength);
        var orthogonal = new goog.math.Vec2(bv.y, -bv.x);
        orthogonal.scale(tolerance);
        var corners = [ goog.math.Coordinate.sum(bond.source.coord, orthogonal),
                        goog.math.Coordinate.sum(bond.target.coord, orthogonal),
                        goog.math.Coordinate.difference(bond.target.coord, orthogonal),
                        goog.math.Coordinate.difference(bond.source.coord, orthogonal) ];
        var sign1 = triangleSign(corners[0], corners[1], coord);
        var sign2 = triangleSign(corners[1], corners[2], coord);
        var sign3 = triangleSign(corners[2], corners[3], coord);
        var sign4 = triangleSign(corners[3], corners[0], coord);
        if (sign1 * sign2 > 0 && sign3 * sign4 > 0 && sign2 * sign3 > 0) {
            return true;
        }
        return false;
    }

 

    /**
     * Get the nearest object for the specified coordinate. Atoms have higher priority
     * than bonds since bonds will overlap with atoms. For atoms, the distance from the
     * specified coordinate to the atom coordinate is checked. If this is within the 
     * used tolerance, the atom is a candidate. The search goes on untill all near atoms
     * in the neighboring cells are checked and the nearest atom is returned. For bonds,
     * a bounding box with a 2 * tolerance width and length of the bond is used to check
     * is within the (rotated) box. Any bond matching the coordinate are assigned the
     * tolerance as distance resulting in atoms having a higher priority (The atom will
     * be closer than tolerance...).
     */       
    kemia.model.NeighborList.prototype.getNearest = function(coord) {
        var cells = cellsAroundCoord(this, coord);
        var rMin = this.tolerance, nearest = null;
        for (i = 0, li = cells.length; i < li; i++) {
            var cell = this.cells[cells[i]];
            for (j = 0, lj = cell.length; j < lj; j++) {
                var obj = cell[j];
                if (obj instanceof kemia.model.Atom) {
                    var r = goog.math.Coordinate.distance(obj.coord, coord);
                    if (r < rMin) {
                        rMin = r;
                        nearest = obj;
                    }
                } else
                if (obj instanceof kemia.model.Bond) {
                    if (!nearest && isCoordInBondBoundingBox(coord, obj, this.tolerance)) {
                        rMin = this.tolerance;
                        nearest = obj;
                    }
                }
            }
        }

        return nearest;
    };
   
    /**
     * Get a list of all objects for the specified coordinate. See getNearest for details.
     */
    kemia.model.NeighborList.prototype.getNearestList = function(coord) {
        var nearest = [];
        var cells = cellsAroundCoord(this, coord);
        var rMin = this.tolerance;
        for (i = 0, li = cells.length; i < li; i++) {
            var cell = this.cells[cells[i]];
            for (j = 0, lj = cell.length; j < lj; j++) {
                var obj = cell[j];
                if (obj instanceof kemia.model.Atom) {
                    var r = goog.math.Coordinate.distance(obj.coord, coord);
                    if (r < this.tolerance) {
                        nearest.push({ obj: obj, distance: r });
                    }
                } else
                if (obj instanceof kemia.model.Bond) {
                    if (isCoordInBondBoundingBox(coord, obj, this.tolerance)) {
                        nearest.push({ obj: obj, distance: this.tolerance });
                    }
                }
            }
        }

        nearest.sort(function (a,b) { return a.distance - b.distance; });

        return nearest;
    };


})();
