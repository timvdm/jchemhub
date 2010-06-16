goog.provide('jchemhub.model.Reaction');

/**
 * Creates a new Reaction.
 * 
 * @constructor
 */
jchemhub.model.Reaction = function() {
	this.header = "";
	this.reactants = [];
	this.products = [];
	this.arrows = [];
	this.pluses = [];
};
// TODO add docs
jchemhub.model.Reaction.prototype.addReactant = function(mol) {
	this.reactants.push(mol);
};
jchemhub.model.Reaction.prototype.addProduct = function(mol) {
	this.products.push(mol);
};
jchemhub.model.Reaction.prototype.addArrow = function(coord){
	this.arrows.push(coord);
	coord.reaction = this;
}
jchemhub.model.Reaction.prototype.removeArrow = function(coord){
	goog.array.remove(this.arrows, coord);
	coord.reaction = undefined;
}
jchemhub.model.Reaction.prototype.addPlus = function(coord){
	this.pluses.push(coord);
	coord.reaction = this;
}
jchemhub.model.Reaction.prototype.removePlus = function(coord){
	goog.array.remove(this.pluses, coord);
	coord.reaction = undefined;
}

jchemhub.model.Reaction.prototype.generatePlusCoords = function(molecules) {
	var previousMol;
	goog.array.forEach(molecules, function(mol) {
		if (previousMol) {
			var center = this.center( [ previousMol, mol ]);
			this.addPlus(center);
		}
		previousMol = mol;
	}, this);

};

jchemhub.model.Reaction.prototype.generateArrowCoords = function(reactants,
		products) {
	this.addArrow(this.center(goog.array.concat(reactants,
			products)));
};

/**
 * finds center of an array of molecules
 * 
 * @return goog.math.Coordinate
 */
jchemhub.model.Reaction.prototype.center = function(molecules) {
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