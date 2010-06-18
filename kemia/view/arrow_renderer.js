goog.provide('kemia.view.ArrowRenderer');
goog.require('kemia.view.Renderer');
goog.require('goog.graphics');


/**
 * Class to render an Arrow object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {kemia.view.Renderer}
 */
kemia.view.ArrowRenderer = function(controller, graphics, opt_config) {
	kemia.view.Renderer.call(this, controller, graphics, opt_config,
			kemia.view.ArrowRenderer.defaultConfig);
}
goog.inherits(kemia.view.ArrowRenderer, kemia.view.Renderer);

kemia.view.ArrowRenderer.prototype.render = function(coord, transform) {

	var w = this.config.get('arrow')['width'];
	var h = this.config.get('arrow')['height'];
	
	var nock = new goog.math.Coordinate(coord.x - w/2, coord.y);
	var tip = new goog.math.Coordinate(nock.x + w, nock.y);
	var head1 = new goog.math.Coordinate(tip.x-h, tip.y + h/2);
	var head2 = new goog.math.Coordinate(tip.x-h, tip.y - h/2);
			
	var path = new goog.graphics.Path();
	var stroke = new goog.graphics.Stroke(
			this.config.get("arrow")['stroke']['width'], 
			this.config.get("arrow")['stroke']['color']);
	var fill = new goog.graphics.SolidFill("yellow", .001);
	var coords = transform.transformCoords( [ nock,
			tip, head1, head2 ]);

	path.moveTo(coords[0].x, coords[0].y);
	path.lineTo(coords[1].x, coords[1].y);
	path.lineTo(coords[2].x, coords[2].y);
	path.moveTo(coords[1].x, coords[1].y);
	path.lineTo(coords[3].x, coords[3].y);

	// visible arrow
	this.graphics.drawPath(path, stroke, fill);		
}

/**
 * A default configuration for renderer
 */
kemia.view.ArrowRenderer.defaultConfig = {
	'arrow' : {
	        'width': 2,
        	'height': .5,
		'stroke' : {
			'width' : 2,
			'color' : "black"
		}
	}
}
