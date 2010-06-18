goog.provide('kemia.view.SingleUpBondRenderer');
goog.require('kemia.view.BondRenderer');

/**
 * Class to render a Single-Up bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {kemia.view.BondRenderer}
 */
kemia.view.SingleUpBondRenderer = function(controller, graphics, opt_config) {
	kemia.view.BondRenderer.call(this, controller, graphics, opt_config,
			kemia.view.SingleUpBondRenderer.defaultConfig);

}
goog.inherits(kemia.view.SingleUpBondRenderer, kemia.view.BondRenderer);

kemia.view.SingleUpBondRenderer.prototype.render = function(bond, transform, bondPath) {
	kemia.view.SingleUpBondRenderer.superClass_.render.call(this, bond,
			transform);

	var strokeWidth = this.config.get("bond")['stroke']['width'] / 10;

	var theta = kemia.view.BondRenderer.getTheta(bond);
	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var trans1 = new kemia.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* strokeWidth, Math.sin(angle_left) * strokeWidth);

	var target1 = trans1.transformCoords( [ bond.target.coord ])[0];
	
	var trans2 = new kemia.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* strokeWidth, Math.sin(angle_right) * strokeWidth);

	var target2 = trans2.transformCoords( [ bond.target.coord ])[0];


    //make target1 and target2 drop short of the target (prettier)
	if (bond.target.symbol!="C" ) { //TODO -> unless all Carbons are rendered (optional?)
		var correct=3;
	    target1.x= ((target1.x*(correct-1))+(bond.source.coord.x)) / correct;
	    target1.y= ((target1.y*(correct-1))+(bond.source.coord.y)) / correct;
	
	    target2.x= ((target2.x*(correct-1))+(bond.source.coord.x)) / correct;
	    target2.y= ((target2.y*(correct-1))+(bond.source.coord.y)) / correct;
    }

	var coords = transform.transformCoords( [ bond.source.coord, target1,
			target2 ]);

	bondPath.moveTo(coords[0].x, coords[0].y);
	bondPath.lineTo(coords[1].x, coords[1].y);
	bondPath.lineTo(coords[2].x, coords[2].y);

//	this.graphics.drawPath(bondPath, bondStroke, bondFill, group);

}
