goog.provide('kemia.controller.AtomController');
goog.provide('kemia.controller.AtomController.AtomEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
kemia.controller.AtomController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);
};
goog.inherits(kemia.controller.AtomController, goog.events.EventTarget);

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.AtomController.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.AtomController');

kemia.controller.AtomController.prototype.handleMouseOver = function(atom, e) {
	this.dispatchEvent(new kemia.controller.AtomController.AtomEvent(this,
			atom, kemia.controller.AtomController.EventType.MOUSEOVER));
};

kemia.controller.AtomController.prototype.handleMouseOut = function(atom, e) {
	this.dispatchEvent(new kemia.controller.AtomController.AtomEvent(this,
			atom, kemia.controller.AtomController.EventType.MOUSEOUT));
};

kemia.controller.AtomController.prototype.handleMouseDown = function(atom, e) {
	this.logger.info("handleMouseDown");
	e.stopPropagation();
	this.dispatchEvent(new kemia.controller.AtomController.AtomEvent(this,
			atom, kemia.controller.AtomController.EventType.MOUSEDOWN));
};
/** @enum {string} */
kemia.controller.AtomController.EventType = {
	MOUSEOVER : 'atom_mouseover',
	MOUSEOUT : 'atom_mouseout',
	MOUSEDOWN : 'atom_mousedown'
};
/**
 * 
 * @param {kemia.controller.AtomController}
 *            controller
 * @param {kemia.model.Atom}
 *            atom
 * @param {kemia.controller.AtomController.EventType}
 *            type
 * @constructor
 * @extends {goog.events.Event}
 */
kemia.controller.AtomController.AtomEvent = function(controller, atom, type) {
	goog.events.Event.call(this, type, controller);
	this.atom = atom;
};
goog.inherits(kemia.controller.AtomController.AtomEvent, goog.events.Event);
