goog.provide('kemia.view.BondRendererFactory');
goog.require('kemia.view.SingleBondRenderer');
goog.require('kemia.view.DoubleBondRenderer');
goog.require('kemia.view.TripleBondRenderer');
goog.require('kemia.view.QuadrupleBondRenderer');
goog.require('kemia.view.SingleUpBondRenderer');
goog.require('kemia.view.SingleDownBondRenderer');
goog.require('kemia.view.SingleUpOrDownBondRenderer');

/**
 * factory class for BondRenderers
 * 
 * @param {goog.graphics.AbstractGraphics} graphics
 * @param {Object} opt_config
 * @constructor
 */
kemia.view.BondRendererFactory = function(controller, graphics, opt_config) {
    this.controller = controller;
    this.graphics = graphics;
    this.config = new goog.structs.Map();
    if (opt_config) {
        this.config.addAll(opt_config); // merge optional config
    }
}

kemia.view.BondRendererFactory.prototype.get = function(bond) {
    if (bond.order == 1) {
        if (!bond.stereo.length) {
	    if (!this.singleBondRenderer) {
		this.singleBondRenderer = new kemia.view.SingleBondRenderer(this.controller, this.graphics, this.config);
	    }
	    return this.singleBondRenderer;
	}
        if (bond.stereo == 'up') {
            if (!this.singleUpBondRenderer) {
                this.singleUpBondRenderer = new kemia.view.SingleUpBondRenderer(this.controller, this.graphics, this.config);
            }
            return this.singleUpBondRenderer;
	}
        if (bond.stereo == 'down') {
            if (!this.singleDownBondRenderer) {
                this.singleDownBondRenderer = new kemia.view.SingleDownBondRenderer(this.controller, this.graphics, this.config);
            }
            return this.singleDownBondRenderer;
	}
        if (bond.stereo == 'up_or_down') {
            if (!this.singleUpOrDownBondRenderer) {
                this.singleUpOrDownBondRenderer = new kemia.view.SingleUpOrDownBondRenderer(this.controller, this.graphics, this.config);
            }
            return this.singleUpOrDownBondRenderer;
	}
    }
    if (bond.order == 2) {
        if (!this.doubleBondRenderer) {
            this.doubleBondRenderer = new kemia.view.DoubleBondRenderer(
                    this.controller, this.graphics, this.config);
        }
        return this.doubleBondRenderer;
    }
    if (bond.order == 3) {
        if (!this.tripleBondRenderer) {
            this.tripleBondRenderer = new kemia.view.TripleBondRenderer(
                    this.controller, this.graphics, this.config);
        }
        return this.tripleBondRenderer;
    }
    if (bond.order == 4) {
        if (!this.quadrupleBondRenderer) {
            this.quadrupleBondRenderer = new kemia.view.QuadrupleBondRenderer(
                    this.controller, this.graphics, this.config);
        }
        return this.quadrupleBondRenderer;
    }
};
