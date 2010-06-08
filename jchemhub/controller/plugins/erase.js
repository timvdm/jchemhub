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
goog.inherits(jchemhub.controller.plugins.Erase,
		jchemhub.controller.Plugin);

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

jchemhub.controller.plugins.Erase.prototype.handleBondMouseDown = function(
		e) {
//erase bond


};

jchemhub.controller.plugins.Erase.prototype.handleAtomMouseDown = function(
		e) {
//erase atom	

};

