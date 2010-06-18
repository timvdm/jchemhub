goog.provide('kemia.controller.plugins.BondEdit');
goog.require('kemia.controller.Plugin');
goog.require('goog.debug.Logger');
goog.require('kemia.model.Bond');

/**
 * @constructor
 * @extends{kemia.controller.Plugin}s
 */
kemia.controller.plugins.BondEdit = function() {
	kemia.controller.Plugin.call(this);

}
goog.inherits(kemia.controller.plugins.BondEdit, kemia.controller.Plugin);

/**
 * Command implemented by this plugin.
 */
kemia.controller.plugins.BondEdit.COMMAND = 'selectBond';

/** @inheritDoc */
kemia.controller.plugins.BondEdit.prototype.isSupportedCommand = function(
		command) {
	return command == kemia.controller.plugins.BondEdit.COMMAND;
};

/** @inheritDoc */
kemia.controller.plugins.BondEdit.prototype.getTrogClassId = goog.functions
		.constant(kemia.controller.plugins.BondEdit.COMMAND);

/**
 * sets atom symbol.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
kemia.controller.plugins.BondEdit.prototype.execCommandInternal = function(
		command, var_args) {

	this.bond_klass = arguments[1];
};

/**
 * @enum {Object}
 */
kemia.controller.plugins.BondEdit.BOND_TYPES = [ {
	caption : "Single",
	klass : kemia.model.Bond
}, {
	caption : "Double",
	klass : kemia.model.Bond
}, {
	caption : "Triple",
	klass : kemia.model.Bond
}, {
	caption : "Quadruple",
	klass : kemia.model.Bond
}, {
	caption : "Single Up",
	klass : kemia.model.Bond
}, {
	caption : "Single Down",
	klass : kemia.model.Bond
}, {
	caption : "Single Up or Down",
	klass : kemia.model.Bond
} ]

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.BondEdit.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.BondEdit');

kemia.controller.plugins.BondEdit.prototype.handleMouseDown = function(e) {
	// if (this.isActive) {
	this.editorObject.dispatchBeforeChange();
	var target = this.editorObject.findTarget(e);
	if (target instanceof kemia.model.Atom) {
		this.addBondToAtom(target);
	}
	if (target instanceof kemia.model.Bond) {
		this.replaceBond(target);
	}
	this.editorObject.dispatchChange();
	// }

};

kemia.controller.plugins.BondEdit.prototype.replaceBond = function(bond) {

	if (this.bond_klass) {
		this.editorObject.dispatchBeforeChange();
		if (bond.stereo) {
		//if ((e.bond instanceof kemia.model.SingleBondUp && this.bond_klass == kemia.model.SingleBondUp)
		//		|| (e.bond instanceof kemia.model.SingleBondDown && this.bond_klass == kemia.model.SingleBondDown)) {
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

kemia.controller.plugins.BondEdit.prototype.addBondToAtom = function(atom) {
	if (this.bond_klass) {
		var angles = goog.array.map(atom.bonds.getValues(), function(bond) {
			return new kemia.math.Line(atom.coord,
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
			var new_atom = new kemia.model.Atom("C", atom.coord.x
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
