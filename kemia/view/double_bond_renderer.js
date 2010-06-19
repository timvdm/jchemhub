goog.provide('kemia.view.DoubleBondRenderer');
goog.require('kemia.view.BondRenderer');

/**
 * Class to render a double bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {kemia.view.BondRenderer}
 */
kemia.view.DoubleBondRenderer = function(controller, graphics, opt_config) {
	kemia.view.BondRenderer.call(this, controller, graphics, opt_config,
			kemia.view.DoubleBondRenderer.defaultConfig);

}
goog.inherits(kemia.view.DoubleBondRenderer, kemia.view.BondRenderer);


function triangleSign(a, b, c)
{
    return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
}

function isOnSameSide(bond, p1, p2) {
    return (triangleSign(bond.source.coord, bond.target.coord, p1) * triangleSign(bond.source.coord, bond.target.coord, p2) > 0);
}


kemia.view.DoubleBondRenderer.prototype.render = function(bond, transform, bondPath) {
	kemia.view.DoubleBondRenderer.superClass_.render.call(this, bond,
			transform);
	var ring = kemia.view.DoubleBondRenderer.getFirstRing(bond);

	if (ring) {
            // create the bondvector
            var bv = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.difference(bond.target.coord, bond.source.coord));
            var bondLength = bv.magnitude();
            var bondWidth = bondLength / 6;
            bv.scale(1 / bondLength * bondWidth);
            // create a vector orthogonal to the bond vector
            var orthogonal = new goog.math.Vec2(bv.y, -bv.x);
            // check the side, invert orthogonal if needed
            var side = goog.math.Coordinate.sum(bond.source.coord, orthogonal);
            var center = ring.ringCenter;
            if (!isOnSameSide(bond, side, center)) {
                orthogonal.invert();
            }

            // the inner line coords
            var coord1 = goog.math.Coordinate.sum(bond.source.coord, orthogonal);
            var coord2 = goog.math.Coordinate.sum(bond.target.coord, orthogonal);
            var coord3 = bond.source.coord;
            var coord4 = bond.target.coord;

            // adjust for symbols if needed
            if (kemia.view.BondRenderer.hasSymbol(bond.source)) {
                var space = bv.clone();
                space.normalize();
                space.scale(0.2);
                coord1 = goog.math.Coordinate.sum(coord1, space);
                coord3 = goog.math.Coordinate.sum(coord3, space)
            } else {
                coord1 = goog.math.Coordinate.sum(coord1, bv);
            }
            if (kemia.view.BondRenderer.hasSymbol(bond.target)) {
                var space = bv.clone();
                space.normalize();
                space.scale(0.2);
                coord2 = goog.math.Coordinate.difference(coord2, space);
                coord4 = goog.math.Coordinate.difference(coord4, space)
            } else {
                coord2 = goog.math.Coordinate.difference(coord2, bv);
            }

            var coords = transform.transformCoords( [ coord1, coord2, coord3, coord4 ]);

	    bondPath.moveTo(coords[0].x, coords[0].y);
	    bondPath.lineTo(coords[1].x, coords[1].y);
	    bondPath.moveTo(coords[2].x, coords[2].y);
	    bondPath.lineTo(coords[3].x, coords[3].y);
	} else {
            // create the bondvector
            var bv = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.difference(bond.target.coord, bond.source.coord));
            var bondLength = bv.magnitude();
            var bondWidth = bondLength / 12;
            bv.scale(1 / bondLength * bondWidth);
            // create a vector orthogonal to the bond vector
            var orthogonal = new goog.math.Vec2(bv.y, -bv.x);

            var coord1 = goog.math.Coordinate.sum(bond.source.coord, orthogonal);
            var coord2 = goog.math.Coordinate.sum(bond.target.coord, orthogonal);
            var coord3 = goog.math.Coordinate.difference(bond.source.coord, orthogonal);
            var coord4 = goog.math.Coordinate.difference(bond.target.coord, orthogonal);

            // adjust for symbols if needed
            if (kemia.view.BondRenderer.hasSymbol(bond.source)) {
                var space = bv.clone();
                space.normalize();
                space.scale(0.2);
                coord1 = goog.math.Coordinate.sum(coord1, space);
                coord3 = goog.math.Coordinate.sum(coord3, space)
            } 
            if (kemia.view.BondRenderer.hasSymbol(bond.target)) {
                var space = bv.clone();
                space.normalize();
                space.scale(0.2);
                coord2 = goog.math.Coordinate.difference(coord2, space);
                coord4 = goog.math.Coordinate.difference(coord4, space)
            } 

            var coords = transform.transformCoords( [ coord1, coord2, coord3, coord4 ]);

	    bondPath.moveTo(coords[0].x, coords[0].y);
	    bondPath.lineTo(coords[1].x, coords[1].y);
	    bondPath.moveTo(coords[2].x, coords[2].y);
	    bondPath.lineTo(coords[3].x, coords[3].y);
	}

};

/**
 * 
 * @return{kemia.ring.Ring} first ring that contains this bond
 */
kemia.view.DoubleBondRenderer.getFirstRing = function(bond) {
	return goog.array.find(bond.molecule.getRings(), function(ring) {
		return goog.array.contains(ring.bonds, this);
	}, bond);
}
