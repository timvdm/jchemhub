goog.provide('jchemhub.view.MoleculeRenderer');
goog.require('jchemhub.controller.BondController');
goog.require('jchemhub.view.BondRenderer');
goog.require('jchemhub.view.BondRendererFactory');
goog.require('jchemhub.view.AtomRenderer');
goog.require('jchemhub.controller.AtomController');

/**
 * Class to render a molecule object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.Renderer}
 */
jchemhub.view.MoleculeRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.Renderer.call(this, controller, graphics, opt_config,
			jchemhub.view.MoleculeRenderer.defaultConfig);
	this.scale_factor = 1;
	this.bondController = new jchemhub.controller.BondController(controller);
	this.bondRendererFactory = new jchemhub.view.BondRendererFactory(
			this.bondController, graphics);
	this.atomController = new jchemhub.controller.AtomController(controller);
	this.atomRenderer = new jchemhub.view.AtomRenderer(this.atomController,
			graphics);
}
goog.inherits(jchemhub.view.MoleculeRenderer, jchemhub.view.Renderer);

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.MoleculeRenderer.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.MoleculeRenderer');
jchemhub.view.MoleculeRenderer.prototype.render = function(molecule, trans,
		group) {
	if (!trans) {
		// if not part of a reaction, we need to create a transform
		var coords = goog.array.map(molecule.atoms, function(a) {
			return a.coord;
		});
		var m = Number(this.config.get("margin"));
		var box = goog.math.Box.boundingBox.apply(null, coords);
		var fromRect = goog.math.Rect.createFromBox(box.expand(m, m, m, m));
		trans = this.getTransform(fromRect);
	}
	this.transform = trans;
	//this.logger.info("molecule has " + molecule.bonds.length + " bonds");
	goog.array.forEach(molecule.bonds, function(bond) {
		this.bondRendererFactory.get(bond).render(bond, trans, undefined);
	}, this);
	//this.logger.info("molecule has " + molecule.atoms.length + " atoms");
	goog.array.forEach(molecule.atoms, function(atom) {
		this.atomRenderer.render(atom, trans, this.atomController);
	}, this);
}

/**
 * A default configuration for renderer
 */
jchemhub.view.MoleculeRenderer.defaultConfig = {
	margin : 4
};