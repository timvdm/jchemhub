goog.provide('kemia.controller.plugins.AtomEdit');
goog.require('kemia.controller.Plugin');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{kemian.controller.Plugin}s
 */
kemia.controller.plugins.AtomEdit = function() {
	kemia.controller.Plugin.call(this);

}
goog.inherits(kemia.controller.plugins.AtomEdit,
		kemia.controller.Plugin);

/**
 * Command implemented by this plugin.
 */
kemia.controller.plugins.AtomEdit.COMMAND = 'selectSymbol';

/** @inheritDoc */
kemia.controller.plugins.AtomEdit.prototype.isSupportedCommand = function(
		command) {
	return command == kemia.controller.plugins.AtomEdit.COMMAND;
};

/** @inheritDoc */
kemia.controller.plugins.AtomEdit.prototype.getTrogClassId = goog.functions
		.constant(kemia.controller.plugins.AtomEdit.COMMAND);

/**
 * sets atom symbol.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
kemia.controller.plugins.AtomEdit.prototype.execCommandInternal = function(
		command, var_args) {
	this.symbol = arguments[1];
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.AtomEdit.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.AtomEdit');

kemia.controller.plugins.AtomEdit.prototype.handleMouseDown = function(
		e) {
	var target = this.editorObject.findTarget(e);
	if (target instanceof kemia.model.Atom) {
		var atom = target;
	if (this.symbol && (this.symbol!=atom.symbol)) {
		this.editorObject.dispatchBeforeChange();
		var new_atom = new kemia.model.Atom(this.symbol, atom.coord.x, atom.coord.y);
		goog.array.forEach(atom.bonds.getValues(), function(bond){
			var new_bond = bond.clone();
			new_bond.molecule = undefined;
			atom==new_bond.source ? new_bond.source = new_atom : new_bond.target = new_atom;
			atom.molecule.addBond(new_bond);
		});
		var molecule = atom.molecule
		molecule.removeAtom(atom);
		molecule.addAtom(new_atom);
		
		this.editorObject.setModels(this.editorObject.getModels());
		this.editorObject.dispatchChange();
	}
	}
};

//kemia.controller.plugins.AtomEdit.prototype.handleMouseDown = function(e){
//	if(this.symbol){
//		this.editorObject.dispatchBeforeChange();
//		var trans = this.editorObject.reactionRenderer.moleculeRenderer.atomRenderer.transform.createInverse();
//		var coords = trans.transformCoords([new goog.math.Coordinate(e.clientX, e.clientY)]);
//		var atom = new kemia.model.Atom(this.symbol, coords[0].x, coords[0].y);
//		var bond = new kemia.model.Bond(atom, new kemia.model.Atom("C", coords[0].x + 1.25, coords[0].y  ));
//		var mol = new kemia.model.Molecule();
//		mol.addBond(bond);
//		mol.addAtom(atom);	
//		this.editorObject.getModels().push(mol);
//		this.editorObject.setModels(this.editorObject.getModels());
//		this.editorObject.dispatchChange();
//	}
//}
