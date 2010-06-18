goog.provide('kemia.controller.MoleculeController');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
kemia.controller.MoleculeController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);

};
goog.inherits(kemia.controller.MoleculeController, goog.events.EventTarget);

kemia.controller.MoleculeController.prototype.handleMouseOver = function(
		molecule, e) {
	this
			.dispatchEvent(new kemia.controller.MoleculeController.MoleculeEvent(
					this, molecule,
					kemia.controller.MoleculeController.EventType.MOUSEOVER));
};

kemia.controller.MoleculeController.prototype.handleMouseOut = function(
		molecule, e) {
	this
			.dispatchEvent(new kemia.controller.MoleculeController.MoleculeEvent(
					this, molecule,
					kemia.controller.MoleculeController.EventType.MOUSEOUT));
};

kemia.controller.MoleculeController.prototype.handleMouseDown = function(
		molecule, e) {
	
	this
			.dispatchEvent(new kemia.controller.MoleculeController.MoleculeEvent(
					this, molecule,
					kemia.controller.MoleculeController.EventType.MOUSEDOWN));
};
/** @enum {string} */
kemia.controller.MoleculeController.EventType = {
	MOUSEOVER : 'molecule_mouseover',
	MOUSEOUT : 'molecule_mouseout',
	MOUSEDOWN : 'molecule_mousedown'
};

/**
 * 
 * @param {kemia.controller.MoleculeController}
 *            controller
 * @param {kemia.model.Molecule}
 *            atom
 * @param {kemia.controller.MoleculeController.EventType}
 *            type
 * @constructor
 * @extends {goog.events.Event}
 */
kemia.controller.MoleculeController.MoleculeEvent = function(controller,
		molecule, type) {
	goog.events.Event.call(this, type, controller);
	this.molecule = molecule;
};

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.MoleculeController.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.MoleculeController');
