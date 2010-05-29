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

goog.provide('jchemhub.query.DFSMapper')

goog.require('goog.structs.Map');

(function() {

    jchemhub.query.DFSMapper = function(query) {

        var Type = { MapFirst: 0, MapUnique: 1, MapAll: 2 };

        this.query = query;

        function State(type, query, queried) {
            this.type = type;
            this.query = query;
            this.queried = queried;
            this.queryPath = [];
            this.queriedPath = [];
        }
    
        function DFS(state, queryAtom, queriedAtom, maps) {
            var queryNbrs = queryAtom.getNeighbors();
            var queriedNbrs = queriedAtom.getNeighbors();
            for (var i = 0, li = queryNbrs.length; i < li; i++) {
                var queryNbr = queryNbrs[i];

                for (var j = 0, lj = queriedNbrs.length; j < lj; j++) {
                    var queriedNbr = queriedNbrs[j];

                    // make sure the neighbor atom isn't in the paths already
                    if (goog.array.indexOf(state.queryPath, queryNbr) != -1) {
                        continue;
                    }
                    if (goog.array.indexOf(state.queriedPath, queriedNbr) != -1) {
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
                    if (state.queryPath.length == state.query.countAtoms()) {
                        //debug("map:");
                        var map = new goog.structs.Map();
                        for (var k = 0, kl = state.queryPath.length; k < kl; k++) {
                            //debug(state.query.indexOfAtom(state.queryPath[k]) + " -> " + state.queried.indexOfAtom(state.queriedPath[k]));
                            map.set(state.query.indexOfAtom(state.queryPath[k]), state.queried.indexOfAtom(state.queriedPath[k]));
                        }
                        if (state.type == Type.MapUnique) {
                            var values = map.getValues();
                            values.sort(function(a,b){return a-b;});
                            var isUnique = true;
                            for (var k = 0, kl = maps.length; k < kl; k++) {
                                var kValues = maps[k].getValues();
                                kValues.sort(function(a,b){return a-b;});
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

                        if (state.type == Type.MapFirst) {
                            return;
                        }
                    }

                    DFS(state, queryNbr, queriedNbr, maps);
                }
            }

            state.queryPath.pop();
            state.queriedPath.pop();
        }


        this.mapAll = function(queried) {
            var maps = [];
            var queryAtom = this.query.getAtom(0);
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

        this.mapUnique = function(queried) {
            var maps = [];
            var queryAtom = this.query.getAtom(0);
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


        this.mapFirst = function(queried) {
            var maps = [];
            var queryAtom = this.query.getAtom(0);
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


})();
