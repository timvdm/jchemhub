/*
 * Copyright 2010 Tim Vandermeersch
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License.
 */

goog.provide('jchemhub.query.MoleculeCompiler');

goog.require('jchemhub.query.Query');

(function() {

    jchemhub.query.MoleculeCompiler = {};

    /**
     * Compile a query from an exising molecule.
     * @param {jchemhub.model.Molecule} molecule The molecule
     * @return {jchemhub.query.Query}
     */
    jchemhub.query.MoleculeCompiler.compile = function(molecule) {
        var query = new jchemhub.query.Query();

        for (var i = 0, li = molecule.countAtoms(); i < li; i++) {
            var qatom = query.addAtom();
            qatom.symbols.push(molecule.getAtom(i).symbol);
        }

        for (i = 0, li = molecule.countBonds(); i < li; i++) {
            var bond = molecule.bonds[i];
            var source = query.getAtom(molecule.indexOfAtom(bond.source));
            var target = query.getAtom(molecule.indexOfAtom(bond.target));
            var qbond = query.addBond(source, target);
            qbond.orders.push(bond.constructor.ORDER);
        }

        return query;
    }; 


}());
