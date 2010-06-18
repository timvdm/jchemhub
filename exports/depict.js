goog.require('kemia.graphics.AffineTransform');
goog.require('kemia.controller.ReactionEditor');
goog.require('kemia.io.mdl');

goog.require('kemia.exports')



kemia.exportClass('kemia.controller.ReactionEditor', kemia.controller.ReactionEditor)
        .add('setModels', kemia.controller.ReactionEditor.prototype.setModels)
        ;

kemia.exportSymbol('kemia.io.mdl.readMolfile', kemia.io.mdl.readMolfile);

/*
goog.exportSymbol('kemia.controller.ReactionEditor', kemia.controller.ReactionEditor);
goog.exportSymbol('kemia.controller.ReactionEditor.prototype.setModels', kemia.controller.ReactionEditor.prototype.setModels);
goog.exportSymbol('kemia.io.mdl', kemia.io.mdl);
goog.exportSymbol('kemia.io.mdl.readMolfile', kemia.io.mdl.readMolfile);
*/



