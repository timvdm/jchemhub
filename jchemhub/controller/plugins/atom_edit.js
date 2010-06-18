goog.provide('jchemhub.controller.plugins.AtomEdit');
goog.require('jchemhub.controller.Plugin');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{jchemhubn.controller.Plugin}s
 */
jchemhub.controller.plugins.AtomEdit = function() {
	jchemhub.controller.Plugin.call(this);

}
goog.inherits(jchemhub.controller.plugins.AtomEdit,
		jchemhub.controller.Plugin);

/**
 * Command implemented by this plugin.
 */
jchemhub.controller.plugins.AtomEdit.COMMAND = 'selectSymbol';

/** @inheritDoc */
jchemhub.controller.plugins.AtomEdit.prototype.isSupportedCommand = function(
		command) {
	return command == jchemhub.controller.plugins.AtomEdit.COMMAND;
};

/** @inheritDoc */
jchemhub.controller.plugins.AtomEdit.prototype.getTrogClassId = goog.functions
		.constant(jchemhub.controller.plugins.AtomEdit.COMMAND);

/**
 * sets atom symbol.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
jchemhub.controller.plugins.AtomEdit.prototype.execCommandInternal = function(
		command, var_args) {
	this.symbol = arguments[1];
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.controller.plugins.AtomEdit.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.controller.plugins.AtomEdit');

jchemhub.controller.plugins.AtomEdit.prototype.handleMouseDown = function(
		e) {
	var target = this.editorObject.findTarget(e);
	if (target instanceof jchemhub.model.Atom) {
		var atom = target;
	if (this.symbol && (this.symbol!=atom.symbol)) {
		this.editorObject.dispatchBeforeChange();
		var new_atom = new jchemhub.model.Atom(this.symbol, atom.coord.x, atom.coord.y);
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

//jchemhub.controller.plugins.AtomEdit.prototype.handleMouseDown = function(e){
//	if(this.symbol){
//		this.editorObject.dispatchBeforeChange();
//		var trans = this.editorObject.reactionRenderer.moleculeRenderer.atomRenderer.transform.createInverse();
//		var coords = trans.transformCoords([new goog.math.Coordinate(e.clientX, e.clientY)]);
//		var atom = new jchemhub.model.Atom(this.symbol, coords[0].x, coords[0].y);
//		var bond = new jchemhub.model.SingleBond(atom, new jchemhub.model.Atom("C", coords[0].x + 1.25, coords[0].y  ));
//		var mol = new jchemhub.model.Molecule();
//		mol.addBond(bond);
//		mol.addAtom(atom);	
//		this.editorObject.getModels().push(mol);
//		this.editorObject.setModels(this.editorObject.getModels());
//		this.editorObject.dispatchChange();
//	}
//}