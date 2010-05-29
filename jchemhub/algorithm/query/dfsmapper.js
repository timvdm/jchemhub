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

goog.provide('jchemhub.query.DFSMapper');

goog.require('goog.structs.Map');

(function() {

    function simpleSort(a, b) {
        return a - b;
    }

    jchemhub.query.DFSMapper = function(query) {

        var Type = { MapFirst: 0, MapUnique: 1, MapAll: 2 };

        this.query = query;

        /**
         * Since mapping a query can be time slow, it is important to start
         * with the most unique atom. This avoids checking many paths which
         * will lead to no full match.
         */
        function getAtomScore(qatom) {
            if (qatom.symbols.length !== 1) {
                return 0;
            }
            switch (qatom.symbols[0]) {
                case 'H':
                case 'C':
                    return 0;
                case 'N':
                case 'O':
                    return 1;
                case 'P':
                case 'S':
                    return 3;
                case 'F':
                case 'Cl':
                case 'Br':
                case 'I':
                    return 4;
                default:
                    return 5;
            }
        }
        function getAtomUniqueScore(qatom) {
            var score = 3 * getAtomScore(qatom);
            var neighbors = qatom.getNeighbors();
            for (var i = 0, li = neighbors.length; i < li; i++) {
                score += getAtomScore(neighbors[i]);
            }
            return score;
        }
        function getUniqueStartAtom(query) {
            var bestScore = 0;
            var startAtom = query.getAtom(0);
            for (var i = 0, li = query.countAtoms(); i < li; i++) {
                var qatom = query.getAtom(i);
                var score = getAtomUniqueScore(qatom);
                if (score > bestScore) {
                    bestScore = score;
                    startAtom = qatom;
                }
            }
            return startAtom;        
        }


        /**
         * State to represent the current mapped state
         */
        function State(type, query, queried) {
            this.type = type;
            this.query = query;
            this.queried = queried;
            this.queryPath = [];
            this.queriedPath = [];
        }
   
        /**
         * The depth-first isomorphism algorithm.
         */
        function DFS(state, queryAtom, queriedAtom, maps) {
            var queryNbrs = queryAtom.getNeighbors();
            var queriedNbrs = queriedAtom.getNeighbors();
            for (var i = 0, li = queryNbrs.length; i < li; i++) {
                var queryNbr = queryNbrs[i];

                for (var j = 0, lj = queriedNbrs.length; j < lj; j++) {
                    var queriedNbr = queriedNbrs[j];

                    // make sure the neighbor atom isn't in the paths already
                    if (goog.array.indexOf(state.queryPath, queryNbr) !== -1) {
                        continue;
                    }
                    if (goog.array.indexOf(state.queriedPath, queriedNbr) !== -1) {
                        continue;
                    }

                    // check if the atoms match
                    if (!queryNbr.matches(queriedNbr)) { 
                        continue;
                    }

                    var queryBond = state.query.findBond(queryAtom, queryNbr);
                    var queriedBond = state.queried.findBond(queriedAtom, queriedNbr);

                    // check if the bonds match
                    if (!queryBond.matches(queriedBond)) {
                        continue;
                    }

                    // add the neighbors to the paths
                    state.queryPath.push(queryNbr);
                    state.queriedPath.push(queriedNbr);

                    //debug(state.query.indexOfAtom(queryNbr) + " -> " + state.queried.indexOfAtom(queriedNbr));

                    // store the mapping if all atoms are mapped
                    if (state.queryPath.length === state.query.countAtoms()) {
                        //debug("map:");
                        var map = new goog.structs.Map();
                        for (var k = 0, kl = state.queryPath.length; k < kl; k++) {
                            //debug(state.query.indexOfAtom(state.queryPath[k]) + " -> " + state.queried.indexOfAtom(state.queriedPath[k]));
                            map.set(state.query.indexOfAtom(state.queryPath[k]), state.queried.indexOfAtom(state.queriedPath[k]));
                        }
                        if (state.type === Type.MapUnique) {
                            var values = map.getValues();
                            values.sort(simpleSort);
                            var isUnique = true;
                            for (k = 0, kl = maps.length; k < kl; k++) {
                                var kValues = maps[k].getValues();
                                kValues.sort(simpleSort);
                                if (goog.array.equals(values, kValues)) {
                                    isUnique = false;                                
                                }
                            }
                            if (isUnique) {
                                maps.push(map);
                            }
                        } else {
                            maps.push(map);
                        }

                        if (state.type === Type.MapFirst) {
                            return;
                        }
                    }

                    DFS(state, queryNbr, queriedNbr, maps);
                }
            }

            state.queryPath.pop();
            state.queriedPath.pop();
        }


        /**
         * Get all mappings of the query on the queried molecule.
         * @param {jchemhub.model.Molecule} queried The queried molecule.
         * @return {Array.<goog.structs.Set>} The mappings
         */
        this.mapAll = function(queried) {
            var maps = [];
            var queryAtom = getUniqueStartAtom(this.query);
            for (var i = 0, li = queried.countAtoms(); i < li; i++) {
                var state = new State(Type.MapAll, this.query, queried);
                var queriedAtom = queried.getAtom(i);

                if (queryAtom.matches(queriedAtom)) { 
                    state.queryPath.push(queryAtom);
                    state.queriedPath.push(queriedAtom);
                    DFS(state, queryAtom, queriedAtom, maps);
                }
            }

            return maps;
        }; 

        /**
         * Get all unique mappings of the query on the queried molecule.
         * @param {jchemhub.model.Molecule} queried The queried molecule.
         * @return {Array.<goog.structs.Set>} The unique mappings
         */ 
        this.mapUnique = function(queried) {
            var maps = [];
            var queryAtom = getUniqueStartAtom(this.query);
            for (var i = 0, li = queried.countAtoms(); i < li; i++) {
                var state = new State(Type.MapUnique, this.query, queried);
                var queriedAtom = queried.getAtom(i);

                if (queryAtom.matches(queriedAtom)) { 
                    state.queryPath.push(queryAtom);
                    state.queriedPath.push(queriedAtom);
                    DFS(state, queryAtom, queriedAtom, maps);
                }
            }

            return maps;
        }; 


        /**
         * Get the first mappings of the query on the queried molecule.
         * @param {jchemhub.model.Molecule} queried The queried molecule.
         * @return {goog.structs.Set} The mapping
         */ 
        this.mapFirst = function(queried) {
            var maps = [];
            var queryAtom = getUniqueStartAtom(this.query);
            for (var i = 0, li = queried.countAtoms(); i < li; i++) {
                var state = new State(Type.MapFirst, this.query, queried);
                var queriedAtom = queried.getAtom(i);

                if (queryAtom.matches(queriedAtom)) { 
                    state.queryPath.push(queryAtom);
                    state.queriedPath.push(queriedAtom);
                    DFS(state, queryAtom, queriedAtom, maps);
                }

                if (maps.length) {
                    return maps[0];
                }
            }

            return new goog.structs.Map();
        };


    };


}());
