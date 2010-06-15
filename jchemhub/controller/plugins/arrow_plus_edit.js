goog.provide('jchemhub.controller.plugins.ArrowPlusEdit');
goog.require('jchemhub.controller.Plugin');
goog.require('goog.debug.Logger');


/**
 * @constructor
 * @extends{jchemhubn.controller.Plugin}s
 */
jchemhub.controller.plugins.ArrowPlusEdit = function() {
	this.activeCommand = {};
	jchemhub.controller.Plugin.call(this);
}
goog.inherits(jchemhub.controller.plugins.ArrowPlusEdit,
		jchemhub.controller.Plugin);

/**
 * Commands implemented by this plugin.
 * 
 * @enum {string}
 */
jchemhub.controller.plugins.ArrowPlusEdit.COMMAND = {
	EDIT_ARROW : 'editArrow',
	EDIT_PLUS : 'editPlus'
};

/**
 * Inverse map of execCommand strings to
 * {@link jchemhub.controller.plugins.ArrowPlusEdit.COMMAND} constants. Used to
 * determine whether a string corresponds to a command this plugin handles
 * 
 * @type {Object}
 * @private
 */
jchemhub.controller.plugins.ArrowPlusEdit.SUPPORTED_COMMANDS_ = goog.object
		.transpose(jchemhub.controller.plugins.ArrowPlusEdit.COMMAND);

/** @inheritDoc */
jchemhub.controller.plugins.ArrowPlusEdit.prototype.isSupportedCommand = function(
		command) {
	return command in jchemhub.controller.plugins.ArrowPlusEdit.SUPPORTED_COMMANDS_;
};

/** @inheritDoc */
jchemhub.controller.plugins.ArrowPlusEdit.prototype.getTrogClassId = goog.functions
		.constant("ArrowPlusEdit");

/**
 * sets atom symbol.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
jchemhub.controller.plugins.ArrowPlusEdit.prototype.execCommandInternal = function(
		command, value, active) {
	this.activeCommand[command] = active;
	this.logger.info(command + " active=" + active);
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.ArrowPlusEdit.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.ArrowPlusEdit');

