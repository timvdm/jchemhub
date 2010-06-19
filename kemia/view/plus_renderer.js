goog.provide('kemia.view.PlusRenderer');
goog.require('kemia.view.Renderer');

/**
 * Class to render an Plus object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {kemia.view.Renderer}
 */
kemia.view.PlusRenderer = function(controller, graphics, opt_config) {
	kemia.view.Renderer.call(this, controller, graphics, opt_config,
			kemia.view.PlusRenderer.defaultConfig);
}
goog.inherits(kemia.view.PlusRenderer, kemia.view.Renderer);

kemia.view.PlusRenderer.prototype.render = function(coord, transform) {

	var w = this.config.get('plus')['size'];
	h0 = new goog.math.Coordinate(coord.x, coord.y - w);
	h1 = new goog.math.Coordinate(coord.x, coord.y + w);
	v0 = new goog.math.Coordinate(coord.x - w, coord.y);
	v1 = new goog.math.Coordinate(coord.x + w, coord.y);

	var path = new goog.graphics.Path();
	var stroke = new goog.graphics.Stroke(this.config.get("plus")['stroke']['width'],
			this.config.get("plus")['stroke']['color']);

	var coords = transform.transformCoords( [ h0, h1, v0, v1 ]);

	path.moveTo(coords[0].x, coords[0].y);
	path.lineTo(coords[1].x, coords[1].y);
	path.moveTo(coords[2].x, coords[2].y);
	path.lineTo(coords[3].x, coords[3].y);

	// the visible plus sign
	this.graphics.drawPath(path, stroke, null);
	
}

/**
 * A default configuration for renderer
 */
kemia.view.PlusRenderer.defaultConfig = {
	'plus' : {
		'size' : .25,
		'stroke' : {
			'width' : 2,
			'color' : "black"
		}
	}
}
