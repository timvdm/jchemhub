goog.provide('jchemhub.model.QuadrupleBond');
goog.require('jchemhub.model.Bond');

/**
 * Class representing a Quadruple Bond
 * @param {jchemhub.model.Atom} source Atom at one end of bond.
 * @param {jchemhub.model.Atom} target Atom at other end of bond.
 * @constructor
 * @extends {jchemhub.model.Bond}
 */
jchemhub.model.QuadrupleBond = function(source, target, opt_molecule){
	jchemhub.model.Bond.call(this, source, target, opt_molecule);
        this.order = 4;
}
goog.inherits(jchemhub.model.QuadrupleBond, jchemhub.model.Bond);

jchemhub.model.QuadrupleBond.clone = function(bond){
	return new jchemhub.model.QuadrupleBond(this.source, this.target, this.molecule);
}
