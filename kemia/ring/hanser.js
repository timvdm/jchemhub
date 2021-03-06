/*
 * Copyright [2010] [Mark Rijnbeek] 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License 
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and limitations under the License.
 * 
 * Ring finder classes, a JavaScript->Java conversion using
 * the MX Hanser ring finder classes.
 * For MX Java source see:
 * http://github.com/rapodaca/mx/tree/master/src/com/metamolecular/mx/ring/
 * http://metamolecular.com/mx
 */
goog.provide('kemia.ring.Hanser');

goog.require('goog.structs.Set');
goog.require('goog.structs.Set');
goog.require('goog.array');
goog.require('kemia.ring.Ring');

/**
 * Hansen ring finder.
 *
 * For details see:
 * Th. Hanser, Ph. Jauffret, and G. Kaufmann
 * A New Algorithm for Exhaustive Ring Perception in a Molecular Graph
 * J. kemia. Inf. Comput. Sci. 1996, 36, 1146-1152
 */
//_____________________________________________________________________________
// Hanser
//_____________________________________________________________________________
kemia.ring.Hanser = function(){
}

/**
 * Hanser main loop, produces the rings for a given molecule.
 * @param {Object} _molecule
 */
kemia.ring.Hanser.findRings = function(_molecule,maxLen){

    var molecule = _molecule;
    var atomOnlyRings = [];

    graph = new kemia.ring.PathGraph(molecule)

    for (var i = 0,il = molecule.countAtoms(); i < il; i++) {
        var edges = graph.remove(molecule.getAtom(i),maxLen);
        for (var j = 0; j < edges.length; j++) {
            edge = edges[j];
            atom_ring = edge.atoms;
            //Hanser last atom is same as first atom, remove it..
            goog.array.removeAt(atom_ring, atom_ring.length - 1);
            for (var k = 0, lk = atom_ring.length; k < lk; k++) {
                atom_ring[k] = molecule.indexOfAtom(atom_ring[k]);
            }
            atomOnlyRings.push(atom_ring);
        }
    }
    //xtra: sort array according to ring size
    goog.array.sort(atomOnlyRings);

    return atomOnlyRings;
/*    
	var rings=new Array();
    for (var i = 0, il = atomOnlyRings.length; i < il; i++) {
		rings.push(this.createRing(atomOnlyRings[i],molecule));
	}
    return rings;
        */
}

/**
 * The Hanser Ring Finder produces a ring as just a series of atoms.
 * Here we complete this information with the bonds and the ring center,
 * creating a ring object.
 * @param {Object} atoms
 */
kemia.ring.Hanser.createRing = function(atoms,molecule){
	
    var bonds = new Array();
    for (var i = 0, il = atoms.length-1; i < il; i++) {
		bond = molecule.findBond(atoms[i],atoms[i+1]);
		if(bond!=null) {
			bonds.push(bond);
		}
	}
    //Hanser last atom is same as first atom, remove it..
    goog.array.removeAt(atoms, atoms.length - 1);
    
	var ring = new kemia.ring.Ring(atoms,bonds);  
    return ring;
}


//_____________________________________________________________________________
// PathGraph
//_____________________________________________________________________________

kemia.ring.PathGraph = function(molecule){
    this.edges = new Array();
    this.atoms = new Array();
    // load edges
    for (var i = 0,il = molecule.countBonds(); i < il; i++) {
        bond = molecule.getBond(i);
        var edge = [bond.source, bond.target];
        this.edges.push(new kemia.ring.PathEdge(edge));
    }
    // load atoms
    for (var i = 0,il=molecule.countAtoms(); i < il; i++) {
        this.atoms.push(molecule.getAtom(i));
    }
}

kemia.ring.PathGraph.prototype.remove = function(atom,maxLen){
    var oldEdges = this.getEdges(atom);
    result = new Array();
    for (var i = 0, il = oldEdges.length; i < il; i++) {
        if (oldEdges[i].isCycle()) {
            result.push(oldEdges[i]);
        }
    }

    for (var i = 0,il = result.length; i < il; i++) {
        if (goog.array.contains(oldEdges, result[i])) {
            goog.array.remove(oldEdges, result[i]);
        }
        if (goog.array.contains(this.edges, result[i])) {
            goog.array.remove(this.edges, result[i]);
        }
    }
    
    newEdges = this.spliceEdges(oldEdges);
    
    for (var i = 0,il=oldEdges.length; i < il; i++) {
        if (goog.array.contains(this.edges, oldEdges[i])) {
            goog.array.remove(this.edges, oldEdges[i]);
        }
    }

    /*
            for (Path newPath : newPaths) {
            if (maxPathLen == null || newPath.size() <= (maxPathLen+1)) {
                paths.add(newPath);
            }
        }
     */
    
    for (var i = 0,il=newEdges.length; i < il; i++) {
        if (!goog.array.contains(this.edges, newEdges[i])  && (newEdges[i].atoms.length<=maxLen+1) ) {
            this.edges.push(newEdges[i]);


        }
    }
    goog.array.remove(this.atoms, atom);
    return result;
}


kemia.ring.PathGraph.prototype.getEdges = function(atom){
    var result = new Array();
    
    for (var i = 0,il=this.edges.length; i < il; i++) {
        edge = this.edges[i];
        
        if (edge.isCycle()) {
            if (goog.array.contains(edge.atoms, atom)) {
                result.push(edge);
            }
        }
        else {
            var lastAtomPos = edge.atoms.length - 1;
            if ((edge.atoms[0] == atom) || (edge.atoms[lastAtomPos] == atom)) {
                result.push(edge);
            }
        }
    }
    return result;
}

kemia.ring.PathGraph.prototype.spliceEdges = function(_edges){
    var result = new Array();
    
    for (var i = 0,il=_edges.length; i < il; i++) {
        for (var j = i + 1; j < il; j++) {
            spliced = _edges[j].splice(_edges[i]);
            if (spliced != null) {
                result.push(spliced);
            }
        }
    }
    return result;
}



//_____________________________________________________________________________
// PathEdge
//_____________________________________________________________________________

kemia.ring.PathEdge = function(_atoms){
    this.atoms = _atoms;
}

kemia.ring.PathEdge.prototype.isCycle = function(){
    var lastAtomPos = this.atoms.length - 1;
    return (this.atoms.length > 2 && this.atoms[0] == this.atoms[lastAtomPos]);
}


kemia.ring.PathEdge.prototype.splice = function(other){
    intersection = this.getIntersection(other.atoms);
    newAtoms = new Array();
    for (var i = 0,il=this.atoms.length; i < il; i++) {
        newAtoms.push(this.atoms[i]);
    }
    
    if (this.atoms[0] == intersection) {
        newAtoms.reverse();
    }
    
    if (other.atoms[0] == intersection) {
        for (var i = 1,il=other.atoms.length; i < il; i++) {
            newAtoms.push(other.atoms[i]);
        }
    }
    else {
        for (var i = other.atoms.length - 2; i >= 0; i--) {
            newAtoms.push(other.atoms[i]);
        }
    }
    
    if (!this.isRealPath(newAtoms)) {
        return null;
    }
    
    return new kemia.ring.PathEdge(newAtoms);
}


kemia.ring.PathEdge.prototype.isRealPath = function(atoms){
    for (var i = 1,il=atoms.length - 1; i < il; i++) {
        for (var j = 1; j < il; j++) {
            if (i == j) {
                continue;
            }
            if (atoms[i] == atoms[j]) {
                return false;
            }
        }
    }
    return true;
}

kemia.ring.PathEdge.prototype.getIntersection = function(others){
    var lastAtomPos = this.atoms.length - 1;
    var lastOtherPos = others.length - 1;
    if (this.atoms[lastAtomPos] == others[0] || this.atoms[lastAtomPos] == others[lastOtherPos]) {
        return this.atoms[lastAtomPos];
    }
    if (this.atoms[0] == others[0] || this.atoms[0] == others[lastOtherPos]) {
        return this.atoms[0];
    }
    throw "Couldn't splice - no intersection";
}
