
goog.provide('kemia.controller.plugins.SelectorRectangle');
goog.require('kemia.controller.Plugin');
goog.require('goog.functions');
goog.require('goog.debug.Logger');


/**
 * simple Plugin for highlighting bonds and atoms
 *
 * @constructor
 * @extends {kemia.controller.Plugin}
 */
kemia.controller.plugins.SelectorRectangle = function() {
  kemia.controller.Plugin.call(this);
};
goog.inherits(kemia.controller.plugins.SelectorRectangle, kemia.controller.Plugin);

/**
 * Commands supported 
 * @enum {string}
 */
kemia.controller.plugins.SelectorRectangle.COMMAND = {
		MOUSEDOWN: 'mousedown',
		MOUSEUP: 'mouseup'
};

/**
 * Inverse map of execCommand strings to
 * {@link kemia.controller.plugins.SelectorRectangle.COMMAND} constants. Used to
 * determine whether a string corresponds to a command this plugin handles
 * @type {Object}
 * @private
 */
kemia.controller.plugins.SelectorRectangle.SUPPORTED_COMMANDS_ =
    goog.object.transpose(kemia.controller.plugins.SelectorRectangle.COMMAND);


/**
 * Whether the string corresponds to a command this plugin handles.
 * @param {string} command Command string to check.
 * @return {boolean} Whether the string corresponds to a command
 *     this plugin handles.
 */
kemia.controller.plugins.SelectorRectangle.prototype.isSupportedCommand =
    function(command) {
  return command in kemia.controller.plugins.SelectorRectangle.SUPPORTED_COMMANDS_;
};

/** @inheritDoc */
kemia.controller.plugins.SelectorRectangle.prototype.getTrogClassId =
    goog.functions.constant('kemia.controller.plugins.SelectorRectangle');

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.SelectorRectangle.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.SelectorRectangle');


kemia.controller.plugins.SelectorRectangle.prototype.handleMouseDown = function(e) {
	this.logger.info('handleMouseDown');
};


