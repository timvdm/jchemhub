goog.provide("jchemhub.view.Renderer");
goog.require("goog.structs.Map");
goog.require("goog.debug.Logger");

/**
 * Abstract Class to render a model object to a graphics object
 * 
 * @constructor
 * @param controller
 *            {goog.events.EventTarget} controller for this view
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @param opt_config
 *            {object} config to override defaults
 * @defaultConfig {object} object holding default values
 */
jchemhub.view.Renderer = function(controller, graphics, opt_config,
		defaultConfig) {
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
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.Renderer.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.Renderer');

/**
 * 
 * @param {goog.math.Box}
 *            fromRect
 * @return {jchemhub.graphics.AffineTransform}
 */
jchemhub.view.Renderer.prototype.getTransform = function(fromBox) {

	var size = goog.math.Rect.createFromBox(fromBox).getSize();
	var fromWidth = size.width;
	size.scaleToFit(this.graphics.getSize());
	var toWidth = size.width;
	var scale = this.scale_factor * toWidth / fromWidth;
	var top = Math.max(fromBox.top, fromBox.bottom);
	var left = Math.min(fromBox.left, fromBox.right);	
	var transform = new jchemhub.graphics.AffineTransform(scale, 0, 0, -scale,
			-left * scale, top * scale);


	return transform;
};
