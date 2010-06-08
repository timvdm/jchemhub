goog.provide("jchemhub.view.Renderer");
goog.require("goog.structs.Map");


/**
 * Abstract Class to render a model object to a graphics object
 * 
 * @constructor
 * @param controller {goog.events.EventTarget} controller for this view
 * @param graphics {goog.graphics.AbstractGraphics} graphics to draw on.
 * @param opt_config {object} config to override defaults
 * @defaultConfig {object} object holding default values
 */
jchemhub.view.Renderer = function(controller, graphics, opt_config, defaultConfig) {
	this.controller = controller;
	this.graphics = graphics;

	this.config = new goog.structs.Map(defaultConfig);
	if (opt_config) {
		this.config.addAll(opt_config); // merge optional config into
		// defaults
	}
}

jchemhub.view.Renderer.prototype.render = goog.abstractMethod;

/**
 * 
 * @param {goog.math.Rect}
 *            fromRect
 * @return {jchemhub.graphics.AffineTransform}
 */
jchemhub.view.Renderer.prototype.getTransform = function(fromRect) {

	var toSize = fromRect.getSize().scaleToFit(this.graphics.getSize());
	var scale = this.scale_factor * toSize.width / fromRect.getSize().width;

	var transform = new jchemhub.graphics.AffineTransform(scale, 0, 0, -scale,
			-fromRect.left * scale, -fromRect.top * scale);

	return transform;
};
