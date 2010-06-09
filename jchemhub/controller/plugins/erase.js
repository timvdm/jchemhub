goog.provide('jchemhub.controller.plugins.Erase');

goog.require('jchemhub.controller.Plugin');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{jchemhubn.controller.Plugin}s
 */
jchemhub.controller.plugins.Erase = function() {
	jchemhub.controller.Plugin.call(this);

}
goog.inherits(jchemhub.controller.plugins.Erase, jchemhub.controller.Plugin);

/**
 * Command implemented by this plugin.
 */
jchemhub.controller.plugins.Erase.COMMAND = 'erase';

/** @inheritDoc */
jchemhub.controller.plugins.Erase.prototype.isSupportedCommand = function(
		command) {
	return command == jchemhub.controller.plugins.Erase.COMMAND;
};

/** @inheritDoc */
jchemhub.controller.plugins.Erase.prototype.getTrogClassId = goog.functions
		.constant(jchemhub.controller.plugins.Erase.COMMAND);

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.Erase.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.Erase');

/**
 * clears the editor.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
jchemhub.controller.plugins.Erase.prototype.execCommandInternal = function(
		command, active) {
	this.isActive = active;

};

jchemhub.controller.plugins.Erase.prototype.handleBondMouseDown = function(e) {

	if (this.isActive) {
		this.editorObject.dispatchBeforeChange();
		this.eraseBond(e.bond);
		this.editorObject.dispatchChange();
	}

};

jchemhub.controller.plugins.Erase.prototype.handleAtomMouseDown = function(e) {
	if (this.isActive) {
		this.editorObject.dispatchBeforeChange();
		var atom = e.atom;
		var molecule = atom.molecule;
		goog.array.forEach(atom.bonds.getValues(), function(bond){
			molecule.removeBond(bond);
		});
		molecule.removeAtom(atom);
		this.editorObject.setModels(this.editorObject.getModels());
		this.editorObject.dispatchChange();
	}
};

jchemhub.controller.plugins.Erase.prototype.eraseBond=function(bond){
	var molecule = bond.molecule;
	molecule.removeBond(bond);
	this.editorObject.setModels(this.editorObject.getModels());

};