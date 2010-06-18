goog.provide('jchemhub.controller.plugins.BondSelect');
goog.require('jchemhub.controller.Plugin');
goog.require('goog.debug.Logger');
goog.require('jchemhub.model.Bond');

/**
 * @constructor
 * @extends{jchemhubn.controller.Plugin}s
 */
jchemhub.controller.plugins.BondSelect = function() {
	jchemhub.controller.Plugin.call(this);

}
goog.inherits(jchemhub.controller.plugins.BondSelect,
		jchemhub.controller.Plugin);

/**
 * Command implemented by this plugin.
 */
jchemhub.controller.plugins.BondSelect.COMMAND = 'selectBond';

/** @inheritDoc */
jchemhub.controller.plugins.BondSelect.prototype.isSupportedCommand = function(
		command) {
	return command == jchemhub.controller.plugins.BondSelect.COMMAND;
};

/** @inheritDoc */
jchemhub.controller.plugins.BondSelect.prototype.getTrogClassId = goog.functions
		.constant(jchemhub.controller.plugins.BondSelect.COMMAND);

/**
 * sets atom symbol.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
jchemhub.controller.plugins.BondSelect.prototype.execCommandInternal = function(
		command, var_args) {

	this.bond_klass = arguments[1];
};

/**
 * @enum {Object}
 */
jchemhub.controller.plugins.BondSelect.BOND_TYPES = [ {
	caption : "Single",
	klass : jchemhub.model.Bond
}, {
	caption : "Double",
	klass : jchemhub.model.Bond
}, {
	caption : "Triple",
	klass : jchemhub.model.Bond
}, {
	caption : "Quadruple",
	klass : jchemhub.model.Bond
}, {
	caption : "Single Up",
	klass : jchemhub.model.Bond
}, {
	caption : "Single Down",
	klass : jchemhub.model.Bond
}, {
	caption : "Single Up or Down",
	klass : jchemhub.model.Bond
} ]

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.BondSelect.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.BondSelect');

jchemhub.controller.plugins.BondSelect.prototype.handleBondMouseDown = function(
		e) {

	if (this.bond_klass) {
		this.editorObject.dispatchBeforeChange();
		if (e.bond.stereo) {
		//if ((e.bond instanceof jchemhub.model.SingleBondUp && this.bond_klass == jchemhub.model.SingleBondUp)
		//		|| (e.bond instanceof jchemhub.model.SingleBondDown && this.bond_klass == jchemhub.model.SingleBondDown)) {
			var new_bond = new this.bond_klass(e.bond.target, e.bond.source);
		} else {
			var new_bond = new this.bond_klass(e.bond.source, e.bond.target);
		}
		var molecule = e.bond.molecule;
		molecule.removeBond(e.bond);
		molecule.addBond(new_bond);
		this.editorObject.setModels(this.editorObject.getModels());
		this.editorObject.dispatchChange();
	}

};

jchemhub.controller.plugins.BondSelect.prototype.handleAtomMouseDown = function(
		e) {

	this.editorObject.dispatchBeforeChange();
	this.addBondToAtom(e.atom);
	this.editorObject.dispatchChange();

};

jchemhub.controller.plugins.BondSelect.prototype.addBondToAtom = function(atom) {
	if (this.bond_klass) {
		var angles = goog.array.map(atom.bonds.getValues(), function(bond) {
			return new jchemhub.math.Line(atom.coord,
					bond.otherAtom(atom).coord).getTheta();
		});

		// this.logger.info("angles.length " + angles.length);
		// this.logger.info("angles[0] " + angles[0]);

		var new_angle;

		if (angles.length == 0) {
			new_angle = 0;
		}
		if (angles.length == 1) {
			if (angles[0] > 0) {
				new_angle = angles[0] - Math.PI * 2 / 3;
			} else {
				new_angle = angles[0] + Math.PI * 2 / 3;
			}
		} else if (angles.length == 2) {
			var sum_angles = goog.array.reduce(angles, function(r, v) {
				return r + v;
			}, 0);

			new_angle = Math.PI + (sum_angles / angles.length);
		}
		if (new_angle) {
			var new_atom = new jchemhub.model.Atom("C", atom.coord.x
					+ Math.cos(new_angle) * 1.25, atom.coord.y
					+ Math.sin(new_angle) * 1.25);
			var new_bond = new this.bond_klass(atom, new_atom);
			var molecule = atom.molecule;
			molecule.addBond(new_bond);
			molecule.addAtom(new_atom);
			this.editorObject.setModels(this.editorObject.getModels());
		}
	}
}
