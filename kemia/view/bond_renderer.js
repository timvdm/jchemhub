goog.provide('kemia.view.BondRenderer');
goog.require('kemia.view.Renderer');
goog.require('kemia.math.Line');

/**
 * Class to render a bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {kemia.view.Renderer}
 */
kemia.view.BondRenderer = function(controller, graphics, opt_config, defaultConfig) {
	kemia.view.Renderer.call(this, controller, graphics, opt_config,
			kemia.view.BondRenderer.defaultConfig);
}
goog.inherits(kemia.view.BondRenderer, kemia.view.Renderer);
/**
 * 
 * @param {kemia.model.Bond} bond
 * @param {kemia.graphics.AffineTransform} transform
 * @return {goog.graphics.GroupElement}
 */
kemia.view.BondRenderer.prototype.render = function(bond, transform) {
	this.transform = transform;

};

kemia.view.BondRenderer.prototype.highlightOn = function(bond, opt_group) {

	var strokeWidth = this.config.get("bond")['stroke']['width'] * 2;
	var color = this.config.get("highlight")['color'];
	var stroke = new goog.graphics.Stroke(strokeWidth, color);
	var fill = null;
	var radius = this.config.get("highlight")['radius']
			* this.transform.getScaleX();
	var theta = -kemia.view.BondRenderer.getTheta(bond) * 180 / Math.PI;
	var angle = theta + 90;

	var arcExtent;
	if (theta <= 0) {
		arcExtent = (bond.source.coord.y <= bond.target.coord.y) ? 180 : -180;
	} else {
		arcExtent = (bond.source.coord.y > bond.target.coord.y) ? 180 : -180;
	}

	var coords = this.transform.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	var path = new goog.graphics.Path();
	path.arc(coords[0].x, coords[0].y, radius, radius, angle, arcExtent);
	path.arc(coords[1].x, coords[1].y, radius, radius, angle, -arcExtent);

	if (!opt_group) {
		opt_group = this.graphics.createGroup();
	}
	this.graphics.drawPath(path, stroke, fill, opt_group);
	return opt_group;
}

/**
 * 
 * @return{number} bond angle of elevation
 */
kemia.view.BondRenderer.getTheta = function(bond) {
	return new kemia.math.Line(bond.source.coord, bond.target.coord)
			.getTheta();
}


kemia.view.BondRenderer.hasSymbol = function(atom) {
    return (atom.symbol != "C" || atom.countBonds() == 1);
}

/**
 * A default configuration for renderer
 */
kemia.view.BondRenderer.defaultConfig = {
	'bond' : {
		'stroke' : {
			'width' : 2,
			'color' : 'black'
		},
		'fill' : {
			'color' : 'black'
		}
	},
	'highlight' : {
		'radius' : .3,
		'color' : 'blue'
	}
};



