goog.provide('kemia.model.Bond');
goog.require('kemia.model.Atom');

/**
 * Base class representing a Bond
 * 
 * @param {kemia.model.Atom}
 *            source, Atom at one end of bond.
 * @param {kemia.model.Atom}
 *            target, Atom at other end of bond.
 * @constructor
 */
kemia.model.Bond = function(source, target, opt_order, opt_molecule) {
	/**
	 * source Atom
	 * 
	 * @type {kemia.model.Atom}
	 */
	this.source = source;
	/**
	 * target Atom
	 * 
	 * @type{kemia.model.Atom}
	 */
	this.target = target;

	if (opt_molecule) {
		this.molecule = opt_molecule;
	}

        /**
         * The bond order.
         * @type {number}
         */
        this.order = opt_order ? opt_order : 1;

        /**
         * Aromatic flag.
         * @type {boolean}
         */
        this.aromatic = false;

        /**
         * Stereo flag (i.e. 'up', 'down', 'up_or_down', 'cis_or_trans')
         * @type {string}
         */
        this.stereo = '';
};

/**
 * Get the other bond atom
 * 
 * @return {kemia.model.Atom} The other bond atom or null if the specified
 *         atom is not part of the bond.
 */
kemia.model.Bond.prototype.otherAtom = function(atom) {
    if (atom === this.source) {
        return this.target;
    }
    if (atom === this.target) {
        return this.source
    }
    return null;
};

/**
 * 
 * @return {kemia.model.Bond}
 */
kemia.model.Bond.prototype.clone = function() {
    var bond = new kemia.model.Bond(this.source, this.target, this.order, this.molecule);
    bond.aromatic = this.aromatic;
    bond.stereo = this.stereo;
    return bond;
}
