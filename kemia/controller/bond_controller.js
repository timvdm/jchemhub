goog.provide('kemia.controller.BondController');
goog.provide('kemia.controller.BondController.BondEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
kemia.controller.BondController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);
};
goog.inherits(kemia.controller.BondController, goog.events.EventTarget);

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.BondController.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.BondController');


kemia.controller.BondController.prototype.handleMouseOver = function(bond, e) {

	this.dispatchEvent(new kemia.controller.BondController.BondEvent(this,
			bond, kemia.controller.BondController.EventType.MOUSEOVER));
};

kemia.controller.BondController.prototype.handleMouseOut = function(bond, e) {
	this.dispatchEvent(new kemia.controller.BondController.BondEvent(this,
			bond, kemia.controller.BondController.EventType.MOUSEOUT));
};

kemia.controller.BondController.prototype.handleMouseDown = function(bond, e) {
	this.dispatchEvent(new kemia.controller.BondController.BondEvent(this,
			bond, kemia.controller.BondController.EventType.MOUSEDOWN));
};

/** @enum {string} */
kemia.controller.BondController.EventType = {
	MOUSEOVER : 'bond_mouseover',
	MOUSEOUT : 'bond_mouseout',
	MOUSEDOWN : 'bond_mousedown'
};

/**
 * 
 * @param {kemia.controller.BondController} controller
 * @param {kemia.model.Bond} bond
 * @param {kemia.controller.BondController.EventType} type
 * @constructor
 * @extends {goog.events.Event}
 */
kemia.controller.BondController.BondEvent = function(controller, bond, type) {
	goog.events.Event.call(this, type, controller);
	this.bond = bond;
};
goog.inherits(kemia.controller.BondController.BondEvent, goog.events.Event);
