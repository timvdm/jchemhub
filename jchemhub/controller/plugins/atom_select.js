goog.provide('jchemhub.controller.plugins.AtomSelect');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{jchemhubn.controller.Plugin}s
 */
jchemhub.controller.plugins.AtomSelect = function() {
	jchemhub.controller.Plugin.call(this);
}
goog.inherits(jchemhub.controller.plugins.AtomSelect,
		jchemhub.controller.Plugin);

/**
 * Command implemented by this plugin.
 */
jchemhub.controller.plugins.AtomSelect.COMMAND = 'insertAtom';

/** @inheritDoc */
jchemhub.controller.plugins.AtomSelect.prototype.getTrogClassId = goog.functions
		.constant(jchemhub.controller.plugins.AtomSelect.COMMAND);

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.AtomSelect.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.AtomSelect');

jchemhub.controller.plugins.AtomSelect.prototype.handleAtomMouseDown = function(e) {
	this.logger.info(e.atom.symbol);
};