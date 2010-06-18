goog.provide('jchemhub.controller.plugins.Highlight');

goog.require('jchemhub.controller.Plugin');
goog.require('goog.functions');
goog.require('goog.debug.Logger');

/**
 * simple Plugin for highlighting bonds and atoms
 * 
 * @constructor
 * @extends {jchemhub.controller.Plugin}
 */
jchemhub.controller.plugins.Highlight = function() {
	jchemhub.controller.Plugin.call(this);
};
goog
		.inherits(jchemhub.controller.plugins.Highlight,
				jchemhub.controller.Plugin);

/** @inheritDoc */
jchemhub.controller.plugins.Highlight.prototype.getTrogClassId = goog.functions
		.constant('jchemhub.controller.plugins.Highlight');

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.Highlight.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.Highlight');

jchemhub.controller.plugins.Highlight.prototype.handleMouseMove = function(e) {

	var target = this.editorObject.findTarget(e);
	if (e.currentTarget.highlightGroup) {
		e.currentTarget.highlightGroup.clear();
	}

	if (target instanceof jchemhub.model.Atom) {

		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightAtom(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightAtom(target,
					e.currentTarget.atomHighlightGroup);
		}
	} else if (target instanceof jchemhub.model.Bond) {
		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightBond(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightBond(target,
					e.currentTarget.bondHighlightGroup);
		}

	} else {
		e.currentTarget.highlightGroup = undefined;
	}
}

jchemhub.controller.plugins.Highlight.prototype.highlightBond = function(bond,
		opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.bondRendererFactory
			.get(bond).highlightOn(bond, opt_group);
};

jchemhub.controller.plugins.Highlight.prototype.highlightAtom = function(atom,
		opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.atomRenderer
			.highlightOn(atom, opt_group);
};
