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

goog.provide('kemia.query.SmilesCompiler');

goog.require('kemia.io.smiles');
goog.require('kemia.query.MoleculeCompiler');

(function() {

    /**
     * The Smiles Query Compiler compiles SMILES strings into queries. This
     * class implements {@link kemia.query.IQueryCompiler}. See the 
     * <a href="../Substructure Search.html">Substructure Search</a> page for more
     * information.
     * @class Smiles Query Compiler
     * @see kemia.query.IQueryCompiler
     * @implements kemia.query.IQueryCompiler
     */
    kemia.query.SmilesCompiler = {};

    /**
     * Compile a query from smiles string.
     * @param smiles The smiles string
     * @return {kemia.query.IQuery}
     */
    kemia.query.SmilesCompiler.compile = function(/**string*/smiles) {
        var molecule = kemia.io.smiles.parse(smiles);
        var query = kemia.query.MoleculeCompiler.compile(molecule);
        return query;
    };
 
}());
