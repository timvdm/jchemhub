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
			this.bondController, graphics, this.config);
	this.atomController = new jchemhub.controller.AtomController(controller);
	this.atomRenderer = new jchemhub.view.AtomRenderer(this.atomController,
			graphics, this.config);
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

	if (!trans) {
		// if not part of a reaction, we need to create a transform
		var m = this.config.get("margin");
		var ex_box = box.expand(m, m, m, m);
		trans = this.buildTransform(ex_box);
	}
	this.transform = trans;
	var center = new goog.math.Coordinate((box.left + box.right) / 2,
			(box.top + box.bottom) / 2);
	var t_center = this.transform.transformCoords( [ center ])[0];
	var rx = Math.abs(this.transform.getScaleX() * (box.right - box.left) / 2);
	var ry = Math.abs(this.transform.getScaleY() * (box.bottom - box.top) / 2);

	var bondStroke = new goog.graphics.Stroke(
			this.config.get("bond")['stroke']['width'],
			this.config.get("bond")['stroke']['color']);
	var bondFill = new goog.graphics.SolidFill(
			this.config.get("bond")['fill']['color']);

	var bondPath = new goog.graphics.Path();
	goog.array.forEach(molecule.bonds, function(bond) {
		this.bondRendererFactory.get(bond).render(bond, trans, bondPath);
	}, this);
	this.graphics.drawPath(bondPath, bondStroke, bondFill);

	// this.logger.info("molecule has " + molecule.atoms.length + " atoms");
	goog.array.forEach(molecule.atoms, function(atom) {
		this.atomRenderer.render(atom, trans);
	}, this);

}

/**
 * A default configuration for renderer
 */
jchemhub.view.MoleculeRenderer.defaultConfig = {
	'bond' : {
		'stroke' : {
			'width' : 2,
			'color' : 'black'
		},
		'fill' : {
			'color' : 'black'
		}
	},
	'margin' : 4
};
