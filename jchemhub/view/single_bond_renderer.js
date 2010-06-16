goog.provide('jchemhub.view.SingleBondRenderer');
goog.require('jchemhub.view.BondRenderer');
goog.require('goog.math.Vec2');
goog.require('goog.math.Coordinate');

/**
 * Class to render a single bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.BondRenderer}
 */
jchemhub.view.SingleBondRenderer = function(parentEventTarget, graphics, opt_config) {
	jchemhub.view.BondRenderer.call(this, parentEventTarget, graphics, opt_config,
			jchemhub.view.SingleBondRenderer.defaultConfig);
};

goog.inherits(jchemhub.view.SingleBondRenderer, jchemhub.view.BondRenderer);

jchemhub.view.SingleBondRenderer.prototype.render = function(bond, transform, bondPath) {

    // the bond coordinates
    var coords = [ bond.source.coord, bond.target.coord ];
    // bond vector
    var bv = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.difference(coords[1], coords[0]));
    // normalize and scale vector to length 0.2
    bv.scale(1 / bv.magnitude() * 0.2);

    // adjust source coord for symbol if needed
    if (jchemhub.view.BondRenderer.hasSymbol(bond.source)) {
        coords[0] = goog.math.Coordinate.sum(coords[0], bv);
    }
    // adjust target coord for symbol if needed
    if (jchemhub.view.BondRenderer.hasSymbol(bond.target)) {
        coords[1] = goog.math.Coordinate.difference(coords[1], bv);
    }

    // apply the transformation
    coords = transform.transformCoords( [ coords[0], coords[1] ]);

    // add the line to the bond path
    bondPath.moveTo(coords[0].x, coords[0].y);
    bondPath.lineTo(coords[1].x, coords[1].y);

}
