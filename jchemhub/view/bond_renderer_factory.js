goog.provide('jchemhub.view.BondRendererFactory');
goog.require('jchemhub.view.SingleBondRenderer');
goog.require('jchemhub.view.DoubleBondRenderer');
goog.require('jchemhub.view.TripleBondRenderer');
goog.require('jchemhub.view.QuadrupleBondRenderer');
goog.require('jchemhub.view.SingleUpBondRenderer');
goog.require('jchemhub.view.SingleDownBondRenderer');
goog.require('jchemhub.view.SingleUpOrDownBondRenderer');

/**
 * factory class for BondRenderers
 * 
 * @param {goog.graphics.AbstractGraphics} graphics
 * @param {Object} opt_config
 * @constructor
 */
jchemhub.view.BondRendererFactory = function(controller, graphics, opt_config) {
    this.controller = controller;
    this.graphics = graphics;
    this.config = new goog.structs.Map();
    if (opt_config) {
        this.config.addAll(opt_config); // merge optional config
    }
}

jchemhub.view.BondRendererFactory.prototype.get = function(bond) {
    if (bond.order == 1) {
        if (!bond.stereo.length) {
	    if (!this.singleBondRenderer) {
		this.singleBondRenderer = new jchemhub.view.SingleBondRenderer(this.controller, this.graphics, this.config);
	    }
	    return this.singleBondRenderer;
	}
        if (bond.stereo == 'up') {
            if (!this.singleUpBondRenderer) {
                this.singleUpBondRenderer = new jchemhub.view.SingleUpBondRenderer(this.controller, this.graphics, this.config);
            }
            return this.singleUpBondRenderer;
	}
        if (bond.stereo == 'down') {
            if (!this.singleDownBondRenderer) {
                this.singleDownBondRenderer = new jchemhub.view.SingleDownBondRenderer(this.controller, this.graphics, this.config);
            }
            return this.singleDownBondRenderer;
	}
        if (bond.stereo == 'up_or_down') {
            if (!this.singleUpOrDownBondRenderer) {
                this.singleUpOrDownBondRenderer = new jchemhub.view.SingleUpOrDownBondRenderer(this.controller, this.graphics, this.config);
            }
            return this.singleUpOrDownBondRenderer;
	}
    }
    if (bond.order == 2) {
        if (!this.doubleBondRenderer) {
            this.doubleBondRenderer = new jchemhub.view.DoubleBondRenderer(
                    this.controller, this.graphics, this.config);
        }
        return this.doubleBondRenderer;
    }
    if (bond.order == 3) {
        if (!this.tripleBondRenderer) {
            this.tripleBondRenderer = new jchemhub.view.TripleBondRenderer(
                    this.controller, this.graphics, this.config);
        }
        return this.tripleBondRenderer;
    }
    if (bond.order == 4) {
        if (!this.quadrupleBondRenderer) {
            this.quadrupleBondRenderer = new jchemhub.view.QuadrupleBondRenderer(
                    this.controller, this.graphics, this.config);
        }
        return this.quadrupleBondRenderer;
    }
};
