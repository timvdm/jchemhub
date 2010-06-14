/*
 * Copyright 2010 Tim Vandermeersch 
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License 
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and limitations under the License.
 */
goog.provide('jchemhub.ring.RingFinder');

goog.require('jchemhub.ring.Hanser');
goog.require('jchemhub.ring.SSSR');
goog.require('goog.structs.Set');
goog.require('goog.structs.Set');
goog.require('goog.array');
goog.require('jchemhub.ring.Ring');

(function() {

    jchemhub.ring.RingFinder = {};

    /**
     * The Hanser Ring Finder produces a ring as just a series of atoms.
     * Here we complete this information with the bonds and the ring center,
     * creating a ring object.
     * @param {Object} atoms
     */
    function createRing(atomIndexes, molecule) {
        // Translate atom indexes to atom objects.
        var atoms = [];
        for (var i = 0, li = atomIndexes.length; i < li; i++) {
            atoms.push(molecule.getAtom(atomIndexes[i]));
        }

        // Add the bonds for the ring.
        var bonds = [];
        for (var i = 0, il = atoms.length-1; i < il; i++) {
            bond = molecule.findBond(atoms[i], atoms[i+1]);
            if(bond!=null) {
                bonds.push(bond);
            }
        }
        // Don't forget the bond between first & last atom.
        bond = molecule.findBond(atoms[0], atoms[atoms.length-1]);
        if(bond!=null) {
            bonds.push(bond);
        }
        // Create the ring.
        var ring = new jchemhub.ring.Ring(atoms,bonds);
        return ring;
    }

    function isCandidateInSet(C, Csssr, valences, ringCount) {
        for (var i = 0, li = Csssr.length; i < li; i++) {
            var sssr = Csssr[i];
            // the part from the paper
            if (C.length >= sssr.length) {
                var candidateContainsRing = true;
                for (var j = 0, lj = sssr.length; j < lj; j++) {
                    if (!goog.array.contains(C, sssr[j])) {
                        candidateContainsRing = false;
                    }
                }
                if (candidateContainsRing)
                    return true;
            }
            // updated part
            for (j = 0, lj = C.length; j < lj; j++) {
                if (goog.array.contains(sssr, C[j])) {
                    ringCount[j]++;
                }
            }
        }

        // If the candidate has at least one atom with a ringCount less than the
        // valence minus one, the candidate is a new ring. You can work this out
        // on paper for tetrahedron, cube, ...
        var isNewRing = false;
        for (j = 0, lj = C.length; j < lj; j++) {
            if (ringCount[C[j]] < valences[C[j]] - 1) {
                isNewRing = true;
            }
        }

        if (isNewRing) {
            for (j = 0, lj = C.length; j < lj; j++) {
                ringCount[C[j]]++;
            }
            return false;
        }
        return true;
    };



    function verifySSSR(sssr, nsssr, molecule) {
        // The final SSSR set
        var Csssr = [];
        // store the valences for all atoms
        var valences = [];
        for (var i = 0, li = molecule.countAtoms(); i < li; i++) {
            valences.push(molecule.getAtom(i).countBonds());
        }
        
        var ringCount = goog.array.repeat(0, molecule.countAtoms());
        for (var i = 0, li = sssr.length; i < li; i++) {
            var ring = sssr[i];
            if (!jchemhub.ring.SSSR.isCandidateInSet(ring, Csssr, valences, ringCount)) {
                Csssr.push(ring);
                if (Csssr.length == nsssr) {
                    return Csssr;
                }
            }
        }

        return Csssr; 
    }

    jchemhub.ring.RingFinder.findRings = function(molecule) {

        // If there are no rings, we're done
        var nsssr = molecule.countBonds() - molecule.countAtoms() + 1;
        if (!nsssr) {
            return [];
        }

        var sssr;
        // Use Hanser ring finder to find all 3-6 membered rings.
        var hanser = jchemhub.ring.Hanser.findRings(molecule, 6);
        if (hanser.length >= nsssr) {
            // Use the Hanser rings to make the first SSSR
            sssr = verifySSSR(hanser, nsssr, molecule);
            // Check the size of the first SSSR
            if (sssr.length < nsssr) {
                // Hanser rings don't contain the SSSR, do a full SSSR search
                sssr = jchemhub.ring.SSSR.findRings(molecule);
            }
        } else {
            // Hanser rings don't contain the SSSR, do a full SSSR search (there 
            // are not enough candidates so we skip the candidateSearch.
            sssr = jchemhub.ring.SSSR.findRings(molecule);
        }
        
        var rings = [];
        for (var i = 0, il = sssr.length; i < il; i++) {
            rings.push(createRing(sssr[i], molecule));
        }
        return rings;
    }

}());
