goog.provide('jchemhub.view.ReactionRenderer');
goog.require('jchemhub.view.Renderer');
goog.require('jchemhub.controller.MoleculeController');
goog.require('jchemhub.controller.ArrowController');
goog.require('jchemhub.controller.PlusController');
goog.require('jchemhub.view.MoleculeRenderer');
goog.require('jchemhub.view.ArrowRenderer');
goog.require('jchemhub.view.PlusRenderer');
goog.require("goog.math.Coordinate");
goog.require("jchemhub.graphics.AffineTransform");

/**
 * Class to render a reaction object to a graphics object
 * 
 * @constructor
 * @param parentEventTarget
 *            {goog.events.EventTarget}
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.ReactionRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.Renderer.call(this, controller, graphics, opt_config,
			jchemhub.view.ReactionRenderer.defaultConfig);
	this.scale_factor = 1;
	this.moleculeController = new jchemhub.controller.MoleculeController(
			controller);
	this.moleculeRenderer = new jchemhub.view.MoleculeRenderer(
			this.moleculeController, graphics, this.config);
	this.arrowController = new jchemhub.controller.ArrowController(controller);
	this.arrowRenderer = new jchemhub.view.ArrowRenderer(this.arrowController, graphics,
			this.config);
	this.plusController = new jchemhub.controller.PlusController(controller);
	this.plusRenderer = new jchemhub.view.PlusRenderer(this.plusController, graphics,
			this.config);
}
goog.inherits(jchemhub.view.ReactionRenderer, jchemhub.view.Renderer);
/**
 * 
 * @param {jchemhub.model.Reaction}
 *            reaction
 * @return {goog.graphics.GroupElement}
 */
jchemhub.view.ReactionRenderer.prototype.render = function(reaction) {
	var molecules = goog.array.concat(reaction.reactants, reaction.products);
	var box = this.boundingBox(molecules);
	var m = this.config.get("margin");
	box.expand(m.top, m.right, m.bottom, m.left);
// this.logger.info("box t: " + box.top + " r: " + box.right
// + " b: " + box.bottom + " l: " + box.left);
	var transform = this.getTransform(box);
	
	// var group = this.graphics.createGroup();
	goog.array.forEach(molecules, function(mol) {

		this.moleculeRenderer.render(mol, transform);
	}, this);
	goog.array.forEach(reaction.pluses, function(plus){
		this.plusRenderer.render(plus, transform);
	},this)
	goog.array.forEach(reaction.arrows, function(arrow){
		this.arrowRenderer.render(arrow, transform);
	},this)


	// return group;
}



/**
 * finds bounding box of an array of molecules
 * 
 * @param molecules
 *            {Array.<jchemhub.model.Molecule>}
 * @return {goog.math.Box}
 */

jchemhub.view.ReactionRenderer.prototype.boundingBox = function(molecules) {
	var atoms = goog.array.flatten(goog.array.map(molecules, function(mol) {
		return mol.atoms;
	}));
	var coords = goog.array.map(atoms, function(a) {
		return a.coord;
	})
	return goog.math.Box.boundingBox.apply(null, coords);
}

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.ReactionRenderer.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.ReactionRenderer');



/**
 * A default configuration for renderer
 */
jchemhub.view.ReactionRenderer.defaultConfig = {
	margin : 2
};
