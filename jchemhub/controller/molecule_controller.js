goog.provide('jchemhub.controller.MoleculeController');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jchemhub.controller.MoleculeController = function(parentController) {
	goog.events.EventTarget.call(this);
	this.setParentEventTarget(parentController);

};
goog.inherits(jchemhub.controller.MoleculeController, goog.events.EventTarget);

jchemhub.controller.MoleculeController.prototype.handleMouseOver = function(
		molecule, e) {
	this
			.dispatchEvent(new jchemhub.controller.MoleculeController.MoleculeEvent(
					this, molecule,
					jchemhub.controller.MoleculeController.EventType.MOUSEOVER));
};

jchemhub.controller.MoleculeController.prototype.handleMouseOut = function(
		molecule, e) {
	this
			.dispatchEvent(new jchemhub.controller.MoleculeController.MoleculeEvent(
					this, molecule,
					jchemhub.controller.MoleculeController.EventType.MOUSEOUT));
};

jchemhub.controller.MoleculeController.prototype.handleMouseDown = function(
		molecule, e) {
	
	this
			.dispatchEvent(new jchemhub.controller.MoleculeController.MoleculeEvent(
					this, molecule,
					jchemhub.controller.MoleculeController.EventType.MOUSEDOWN));
};
/** @enum {string} */
jchemhub.controller.MoleculeController.EventType = {
	MOUSEOVER : 'molecule_mouseover',
	MOUSEOUT : 'molecule_mouseout',
	MOUSEDOWN : 'molecule_mousedown'
};

/**
 * 
 * @param {jchemhub.controller.MoleculeController}
 *            controller
 * @param {jchemhub.model.Molecule}
 *            atom
 * @param {jchemhub.controller.MoleculeController.EventType}
 *            type
 * @constructor
 * @extends {goog.events.Event}
 */
jchemhub.controller.MoleculeController.MoleculeEvent = function(controller,
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
jchemhub.controller.MoleculeController.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.MoleculeController');
