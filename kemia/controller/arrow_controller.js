goog.provide('kemia.controller.ArrowController');
goog.provide('kemia.controller.ArrowController.ArrowEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
kemia.controller.ArrowController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);
};
goog.inherits(kemia.controller.ArrowController, goog.events.EventTarget);

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.ArrowController.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.ArrowController');

kemia.controller.ArrowController.prototype.handleMouseOver = function(coord,
		e) {
	this.dispatchEvent(new kemia.controller.ArrowController.ArrowEvent(this,
			coord, e.currentTarget,
			kemia.controller.ArrowController.EventType.MOUSEOVER));
};

kemia.controller.ArrowController.prototype.handleMouseOut = function(coord,
		e) {
	this.dispatchEvent(new kemia.controller.ArrowController.ArrowEvent(this,
			coord, e.currentTarget,
			kemia.controller.ArrowController.EventType.MOUSEOUT));
};

kemia.controller.ArrowController.prototype.handleMouseDown = function(coord,
		e) {
	// this.logger.info("handleMouseDown");
	// e.stopPropagation();
	this.dispatchEvent(new kemia.controller.ArrowController.ArrowEvent(this,
			coord, e, kemia.controller.ArrowController.EventType.MOUSEDOWN));
};
/** @enum {string} */
kemia.controller.ArrowController.EventType = {
	MOUSEOVER : 'arrow_mouseover',
	MOUSEOUT : 'arrow_mouseout',
	MOUSEDOWN : 'arrow_mousedown'
};
/**
 * 
 * @param {kemia.controller.ArrowController}
 *            controller
 * @param {goog.math.Coordinate}
 *            coord
 * @param {kemia.controller.ArrowController.EventType}
 *            type
 * @constructor
 * @extends {goog.events.Event}
 */
kemia.controller.ArrowController.ArrowEvent = function(controller, coord,
		group, type) {
	goog.events.Event.call(this, type, controller);
	this.coord = coord;
	this.group = group;
};
goog
		.inherits(kemia.controller.ArrowController.ArrowEvent,
				goog.events.Event);
