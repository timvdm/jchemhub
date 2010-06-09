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
			graphics, opt_config);
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

jchemhub.view.MoleculeRenderer.prototype.render = function(molecule, trans) {
	var atom_coords = goog.array.map(molecule.atoms, function(a) {
		return a.coord;
	});
	var box = goog.math.Box.boundingBox.apply(null, atom_coords);
	var group = this.graphics.createGroup();
	var stroke = null;
	var fill = new goog.graphics.SolidFill("green", 0.001);//'transparent' fill
	
	if (!trans) {
		// if not part of a reaction, we need to create a transform
		var m = Number(this.config.get("margin"));
		var fromRect = goog.math.Rect.createFromBox(box.expand(m, m, m, m));
		
		trans = this.getTransform(fromRect);
	}
	this.transform = trans;
	var center = new goog.math.Coordinate((box.left + box.right)/2, (box.top + box.bottom)/2);
	var t_center = this.transform.transformCoords([center])[0];
	var rx = Math.abs(this.transform.getScaleX() * (box.right - box.left)/2);
	var ry = Math.abs(this.transform.getScaleY() * (box.bottom - box.top)/2);
	
	this.graphics.drawEllipse(t_center.x, t_center.y,rx, ry,stroke, fill, group);
	// this.logger.info("molecule has " + molecule.bonds.length + " bonds");
	goog.array.forEach(molecule.bonds, function(bond) {
		this.bondRendererFactory.get(bond).render(bond, trans, undefined);
	}, this);
	// this.logger.info("molecule has " + molecule.atoms.length + " atoms");
	goog.array.forEach(molecule.atoms, function(atom) {
		this.atomRenderer.render(atom, trans, this.atomController);
	}, this);
	
	group.addEventListener(goog.events.EventType.MOUSEOVER, goog.bind(
			this.controller.handleMouseOver, this.controller, molecule));
	group.addEventListener(goog.events.EventType.MOUSEOUT, goog.bind(
			this.controller.handleMouseOut, this.controller, molecule));
	group.addEventListener(goog.events.EventType.MOUSEDOWN, goog.bind(
			this.controller.handleMouseDown, this.controller, molecule));
}

/**
 * A default configuration for renderer
 */
jchemhub.view.MoleculeRenderer.defaultConfig = {
	margin : 4
};