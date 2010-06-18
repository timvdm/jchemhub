goog.provide('kemia.view.TripleBondRenderer');
goog.require('kemia.view.BondRenderer');

/**
 * Class to render a triple bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {kemia.view.BondRenderer}
 */
kemia.view.TripleBondRenderer = function(controller, graphics, opt_config) {
	kemia.view.BondRenderer.call(this, controller, graphics, opt_config,
			kemia.view.TripleBondRenderer.defaultConfig);

}
goog.inherits(kemia.view.TripleBondRenderer, kemia.view.BondRenderer);

kemia.view.TripleBondRenderer.prototype.render = function(bond, transform) {
	group = kemia.view.TripleBondRenderer.superClass_.render.call(this, bond,
			transform);
	var strokeWidth = this.config.get("bond")['stroke']['width'];
	var bondStroke = new goog.graphics.Stroke(strokeWidth, this.config.get("bond")['stroke']['color']);
	var bondFill = null;

	var theta = kemia.view.BondRenderer.getTheta(bond);

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var bondWidth = goog.math.Coordinate.distance(bond.source.coord,
			bond.target.coord) / 6;
	var transleft = new kemia.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* bondWidth, Math.sin(angle_left) * bondWidth);

	var transright = new kemia.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* bondWidth, Math.sin(angle_right) * bondWidth);

	var leftside = transleft.transformCoords( [ bond.source.coord,
			bond.target.coord ]);
	var rightside = transright.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	var coords = transform.transformCoords( [ bond.source.coord,
			bond.target.coord, leftside[0], leftside[1], rightside[0],
			rightside[1] ]);

	var bondPath = new goog.graphics.Path();
	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);

	bondPath.moveTo(coords[2].x, coords[2].y);
	bondPath.lineTo(coords[3].x, coords[3].y);

	bondPath.moveTo(coords[4].x, coords[4].y);
	bondPath.lineTo(coords[5].x, coords[5].y);

	this.graphics.drawPath(bondPath, bondStroke, bondFill);
}
