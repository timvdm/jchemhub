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

goog.provide('jchemhub.query.SmilesCompiler');

goog.require('jchemhub.io.smiles');
goog.require('jchemhub.query.MoleculeCompiler');

(function() {

    jchemhub.query.SmilesCompiler = {};

    /**
     * Compile a query from smiles string.
     * @param {String} smiles The smiles string
     * @return {jchemhub.query.Query}
     */
    jchemhub.query.SmilesCompiler.compile = function(smiles) {
        var molecule = jchemhub.io.smiles.parse(smiles);
        var query = jchemhub.query.MoleculeCompiler.compile(molecule);
        return query;
    };
 
})();
