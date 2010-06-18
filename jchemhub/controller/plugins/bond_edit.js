goog.provide('jchemhub.controller.plugins.BondEdit');
goog.require('jchemhub.controller.Plugin');
goog.require('goog.debug.Logger');
goog.require('jchemhub.model.Bond');

/**
 * @constructor
 * @extends{jchemhub.controller.Plugin}s
 */
jchemhub.controller.plugins.BondEdit = function() {
	jchemhub.controller.Plugin.call(this);

}
goog.inherits(jchemhub.controller.plugins.BondEdit, jchemhub.controller.Plugin);

/**
 * Command implemented by this plugin.
 */
jchemhub.controller.plugins.BondEdit.COMMAND = 'selectBond';

/** @inheritDoc */
jchemhub.controller.plugins.BondEdit.prototype.isSupportedCommand = function(
		command) {
	return command == jchemhub.controller.plugins.BondEdit.COMMAND;
};

/** @inheritDoc */
jchemhub.controller.plugins.BondEdit.prototype.getTrogClassId = goog.functions
		.constant(jchemhub.controller.plugins.BondEdit.COMMAND);

/**
 * sets atom symbol.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
jchemhub.controller.plugins.BondEdit.prototype.execCommandInternal = function(
		command, var_args) {

	this.bond_klass = arguments[1];
};

/**
 * @enum {Object}
 */
jchemhub.controller.plugins.BondEdit.BOND_TYPES = [ {
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
jchemhub.controller.plugins.BondEdit.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.BondEdit');

jchemhub.controller.plugins.BondEdit.prototype.handleMouseDown = function(e) {
	// if (this.isActive) {
	this.editorObject.dispatchBeforeChange();
	var target = this.editorObject.findTarget(e);
	if (target instanceof jchemhub.model.Atom) {
		this.addBondToAtom(target);
	}
	if (target instanceof jchemhub.model.Bond) {
		this.replaceBond(target);
	}
	this.editorObject.dispatchChange();
	// }

};

jchemhub.controller.plugins.BondEdit.prototype.replaceBond = function(bond) {

	if (this.bond_klass) {
		this.editorObject.dispatchBeforeChange();
		if (bond.stereo) {
		//if ((e.bond instanceof jchemhub.model.SingleBondUp && this.bond_klass == jchemhub.model.SingleBondUp)
		//		|| (e.bond instanceof jchemhub.model.SingleBondDown && this.bond_klass == jchemhub.model.SingleBondDown)) {
			var new_bond = new this.bond_klass(bond.target, bond.source);
		} else {
			var new_bond = new this.bond_klass(bond.source, bond.target);
		}
		var molecule = bond.molecule;
		molecule.removeBond(bond);
		molecule.addBond(new_bond);
		this.editorObject.setModels(this.editorObject.getModels());
		this.editorObject.dispatchChange();
	}

};

jchemhub.controller.plugins.BondEdit.prototype.addBondToAtom = function(atom) {
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
