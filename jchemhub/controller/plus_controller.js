goog.provide('jchemhub.controller.PlusController');
goog.provide('jchemhub.controller.PlusController.PlusEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.controller.PlusController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);
};
goog.inherits(jchemhub.controller.PlusController, goog.events.EventTarget);

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.PlusController.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.PlusController');

jchemhub.controller.PlusController.prototype.handleMouseOver = function(coord, e) {
	this.dispatchEvent(new jchemhub.controller.PlusController.PlusEvent(this,
			coord, jchemhub.controller.PlusController.EventType.MOUSEOVER));
};

jchemhub.controller.PlusController.prototype.handleMouseOut = function(coord, e) {
	this.dispatchEvent(new jchemhub.controller.PlusController.PlusEvent(this,
			coord, jchemhub.controller.PlusController.EventType.MOUSEOUT));
};

jchemhub.controller.PlusController.prototype.handleMouseDown = function(coord, e) {
	this.logger.info("handleMouseDown");
	e.stopPropagation();
	this.dispatchEvent(new jchemhub.controller.PlusController.PlusEvent(this,
			coord, jchemhub.controller.PlusController.EventType.MOUSEDOWN));
};
/** @enum {string} */
jchemhub.controller.PlusController.EventType = {
	MOUSEOVER : 'plus_mouseover',
	MOUSEOUT : 'plus_mouseout',
	MOUSEDOWN : 'plus_mousedown'
};
/**
 * 
 * @param {jchemhub.controller.PlusController}
 *            controller
 * @param {goog.math.Coordiante}
 *            coord
 * @param {jchemhub.controller.PlusController.EventType}
 *            type
 * @constructor
 * @extends {goog.events.Event}
 */
jchemhub.controller.PlusController.PlusEvent = function(controller, coord, type) {
	goog.events.Event.call(this, type, controller);
	this.coord = coord;
};
goog.inherits(jchemhub.controller.PlusController.PlusEvent, goog.events.Event);