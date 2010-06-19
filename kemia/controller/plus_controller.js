goog.provide('kemia.controller.PlusController');
goog.provide('kemia.controller.PlusController.PlusEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
kemia.controller.PlusController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);
};
goog.inherits(kemia.controller.PlusController, goog.events.EventTarget);

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.PlusController.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.PlusController');

kemia.controller.PlusController.prototype.handleMouseOver = function(coord, e) {
	this.dispatchEvent(new kemia.controller.PlusController.PlusEvent(this,
			coord, kemia.controller.PlusController.EventType.MOUSEOVER));
};

kemia.controller.PlusController.prototype.handleMouseOut = function(coord, e) {
	this.dispatchEvent(new kemia.controller.PlusController.PlusEvent(this,
			coord, kemia.controller.PlusController.EventType.MOUSEOUT));
};

kemia.controller.PlusController.prototype.handleMouseDown = function(coord, e) {
	this.logger.info("handleMouseDown");
	e.stopPropagation();
	this.dispatchEvent(new kemia.controller.PlusController.PlusEvent(this,
			coord, kemia.controller.PlusController.EventType.MOUSEDOWN));
};
/** @enum {string} */
kemia.controller.PlusController.EventType = {
	MOUSEOVER : 'plus_mouseover',
	MOUSEOUT : 'plus_mouseout',
	MOUSEDOWN : 'plus_mousedown'
};
/**
 * 
 * @param {kemia.controller.PlusController}
 *            controller
 * @param {goog.math.Coordiante}
 *            coord
 * @param {kemia.controller.PlusController.EventType}
 *            type
 * @constructor
 * @extends {goog.events.Event}
 */
kemia.controller.PlusController.PlusEvent = function(controller, coord, type) {
	goog.events.Event.call(this, type, controller);
	this.coord = coord;
};
goog.inherits(kemia.controller.PlusController.PlusEvent, goog.events.Event);
