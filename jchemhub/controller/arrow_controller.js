goog.provide('jchemhub.controller.ArrowController');
goog.provide('jchemhub.controller.ArrowController.ArrowEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.controller.ArrowController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);
};
goog.inherits(jchemhub.controller.ArrowController, goog.events.EventTarget);

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.ArrowController.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.ArrowController');

jchemhub.controller.ArrowController.prototype.handleMouseOver = function(coord, e) {
	this.dispatchEvent(new jchemhub.controller.ArrowController.ArrowEvent(this,
			coord, jchemhub.controller.ArrowController.EventType.MOUSEOVER));
};

jchemhub.controller.ArrowController.prototype.handleMouseOut = function(coord, e) {
	this.dispatchEvent(new jchemhub.controller.ArrowController.ArrowEvent(this,
			coord, jchemhub.controller.ArrowController.EventType.MOUSEOUT));
};

jchemhub.controller.ArrowController.prototype.handleMouseDown = function(coord, e) {
	this.logger.info("handleMouseDown");
	e.stopPropagation();
	this.dispatchEvent(new jchemhub.controller.ArrowController.ArrowEvent(this,
			coord, jchemhub.controller.ArrowController.EventType.MOUSEDOWN));
};
/** @enum {string} */
jchemhub.controller.ArrowController.EventType = {
	MOUSEOVER : 'arrow_mouseover',
	MOUSEOUT : 'arrow_mouseout',
	MOUSEDOWN : 'arrow_mousedown'
};
/**
 * 
 * @param {jchemhub.controller.ArrowController}
 *            controller
 * @param {goog.math.Coordiante}
 *            coord
 * @param {jchemhub.controller.ArrowController.EventType}
 *            type
 * @constructor
 * @extends {goog.events.Event}
 */
jchemhub.controller.ArrowController.ArrowEvent = function(controller, coord, type) {
	goog.events.Event.call(this, type, controller);
	this.coord = coord;
};
goog.inherits(jchemhub.controller.ArrowController.ArrowEvent, goog.events.Event);