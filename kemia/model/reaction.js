goog.provide('kemia.model.Reaction');

/**
 * Creates a new Reaction.
 * 
 * @constructor
 */
kemia.model.Reaction = function() {
	this.header = "";
	this.reactants = [];
	this.products = [];
	this.arrows = [];
	this.pluses = [];
};
// TODO add docs
kemia.model.Reaction.prototype.addReactant = function(mol) {
	this.reactants.push(mol);
};
kemia.model.Reaction.prototype.addProduct = function(mol) {
	this.products.push(mol);
};
kemia.model.Reaction.prototype.addArrow = function(coord){
	this.arrows.push(coord);
	coord.reaction = this;
}
kemia.model.Reaction.prototype.removeArrow = function(coord){
	goog.array.remove(this.arrows, coord);
	coord.reaction = undefined;
}
kemia.model.Reaction.prototype.addPlus = function(coord){
	this.pluses.push(coord);
	coord.reaction = this;
}
kemia.model.Reaction.prototype.removePlus = function(coord){
	goog.array.remove(this.pluses, coord);
	coord.reaction = undefined;
}

kemia.model.Reaction.prototype.generatePlusCoords = function(molecules) {
	var previousMol;
	goog.array.forEach(molecules, function(mol) {
		if (previousMol) {
			var center = this.center( [ previousMol, mol ]);
			this.addPlus(center);
		}
		previousMol = mol;
	}, this);

};

kemia.model.Reaction.prototype.generateArrowCoords = function(reactants,
		products) {
	this.addArrow(this.center(goog.array.concat(reactants,
			products)));
};

/**
 * finds center of an array of molecules
 * 
 * @return goog.math.Coordinate
 */
kemia.model.Reaction.prototype.center = function(molecules) {
	var atoms = goog.array.flatten(goog.array.map(molecules, function(mol) {
		return mol.atoms;
	}));
	var coords = goog.array.map(atoms, function(a) {
		return a.coord;
	})
	var bbox = goog.math.Box.boundingBox.apply(null, coords);

	return new goog.math.Coordinate((bbox.left + bbox.right) / 2,
			(bbox.top + bbox.bottom) / 2);
}
