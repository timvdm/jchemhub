goog.provide('jchemhub.model.NeighborList');

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

    jchemhub.model.NeighborList = function(objects) {
        this.cells = [];
        this.cellSize = 5;
        this.tolerance = 5;
        this.xMin = 100000;
        this.yMin = 100000;
        this.xMax = -100000;
        this.yMax = -100000;

        // find min/max values for the grid
        for (var i = 0, li = objects.length; i < li; i++) {
            var obj = objects[i];
            if (obj instanceof jchemhub.model.Molecule) {
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
        for (var i = 0, li = objects.length; i < li; i++) {
            var obj = objects[i];
            if (obj instanceof jchemhub.model.Molecule) {
                var molecule = obj;
                for (var i = 0, li = molecule.atoms.length; i < li; i++) {
                    var atom = molecule.atoms[i]
                    var x = Math.floor((atom.coord.x - this.xMin) / this.cellSize);
                    var y = Math.floor((atom.coord.y - this.yMin) / this.cellSize);
                    this.cells[y * this.xDim + x].push(atom);
                }
                for (i = 0, li = molecule.bonds.length; i < li; i++) {
                    var bond = molecule.bonds[i];
                    var midPoint = goog.math.Vec2.fromCoordinate(goog.math.Coodinate.sum(bond.source.coord, bond.target.coord));
                    midPoint.scale(0.5);
                    bond.midPoint = midPoint;
                    var x = Math.floor((midPoint.x - this.xMin) / this.cellSize);
                    var y = Math.floor((midPoint.y - this.yMin) / this.cellSize);
                    this.cells[y * this.xDim + x].push(bond);
                }
            }
        }
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

       
    jchemhub.model.NeighborList.prototype.getNearest = function(coord) {
        var cells = cellsAroundCoord(this, coord);
        var rMin = this.tolerance, nearest = null;
        for (i = 0, li = cells.length; i < li; i++) {
            var cell = this.cells[cells[i]];
            for (j = 0, lj = cell.length; j < lj; j++) {
                var obj = cell[j];
                if (obj instanceof jchemhub.model.Atom) {
                    var r = goog.math.Coordinate.distance(obj.coord, coord);
                    if (r < rMin) {
                        rMin = r;
                        nearest = obj;
                    }
                } else
                if (obj instanceof jchemhub.model.Bond) {
                    var r = goog.math.Coordinate.distance(obj.midPoint, coord);
                    if (r < rMin) {
                        rMin = r;
                        nearest = obj;
                    }
                }
            }
        }

        return nearest;
    };
    
    jchemhub.model.NeighborList.prototype.getNearestList = function(coord) {
        var nearest = [];
        var cells = cellsAroundCoord(this, coord);
        var rMin = this.tolerance;
        for (i = 0, li = cells.length; i < li; i++) {
            var cell = this.cells[cells[i]];
            for (j = 0, lj = cell.length; j < lj; j++) {
                var obj = cell[j];
                if (obj instanceof jchemhub.model.Atom) {
                    var r = goog.math.Coordinate.distance(obj.coord, coord);
                    if (r < this.tolerance) {
                        nearest.push({ obj: obj, distance: r });
                    }
                } else
                if (obj instanceof jchemhub.model.Bond) {
                    var r = goog.math.Coordinate.distance(obj.midPoint, coord);
                    if (r < this.tolerance) {
                        nearest.push({ obj: obj, distance: r });
                    }
                }
            }
        }

        nearest.sort(function (a,b) { return a.distance - b.distance; });

        return nearest;
    };


})();
