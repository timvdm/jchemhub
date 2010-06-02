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

goog.provide('jchemhub.query.Query');

(function() {
 
    /**
     * QueryAtom
     */
    jchemhub.query.QueryAtom = function() {
        // query properties
        this.symbols = [];
        this.valence = 0;
        // topology properties
        this.neighbors = [];
    };

    jchemhub.query.QueryAtom.prototype.matches = function(atom) {
        var symbolMatches = true;
        if (this.symbols.length) {
            if (goog.array.indexOf(this.symbols, atom.symbol) === -1) {
                symbolMatches = false;                
            }
        }

        var valenceMatches = this.valence <= atom.countBonds();

        return symbolMatches && valenceMatches;    
    };

    jchemhub.query.QueryAtom.prototype.getNeighbors = function() {
        return this.neighbors;
    };

    /**
     * QueryBond
     */
    jchemhub.query.QueryBond = function(source, target) {
        // query properties
        this.orders = [];
        // topology properties
        this.source = source;
        this.target = target;
    };
    
    jchemhub.query.QueryBond.prototype.matches = function(bond) {
        if (!this.orders.length) {
            return true; // match any bond order
        }
        if (goog.array.indexOf(this.orders, bond.constructor.ORDER) !== -1) {
            return true;
        }
        return false;
    };

    /**
     * Query
     */
    jchemhub.query.Query = function() {
        this.atoms = [];
        this.bonds = [];
    };

    jchemhub.query.Query.prototype.countAtoms = function() {
        return this.atoms.length;
    };

    jchemhub.query.Query.prototype.indexOfAtom = function(atom) {
        return goog.array.indexOf(this.atoms, atom);
    };

    jchemhub.query.Query.prototype.getAtom = function(index) {
        return this.atoms[index];
    };

    jchemhub.query.Query.prototype.addAtom = function(atom) {
        this.atoms.push(atom);
    };

    jchemhub.query.Query.prototype.addBond = function(bond) {
        bond.source.neighbors.push(bond.target);
        bond.target.neighbors.push(bond.source);
        this.bonds.push(bond);
    };

    jchemhub.query.Query.prototype.findBond = function(atom1, atom2) {
        for ( var i = 0, il = this.bonds.length; i < il; i++) {
            var bond = this.bonds[i];
            if ((atom1 === bond.source && atom2 === bond.target) || (atom2 === bond.source && atom1 === bond.target)) {
                return bond;
            }
        }
        return null;
    };

 
}());
