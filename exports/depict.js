goog.require('jchemhub.graphics.AffineTransform');
goog.require('jchemhub.controller.ReactionEditor');
goog.require('jchemhub.io.mdl');

goog.require('jchemhub.exports')



jchemhub.exportClass('jchemhub.controller.ReactionEditor', jchemhub.controller.ReactionEditor)
        .add('setModels', jchemhub.controller.ReactionEditor.prototype.setModels)
        ;

jchemhub.exportSymbol('jchemhub.io.mdl.readMolfile', jchemhub.io.mdl.readMolfile);

/*
goog.exportSymbol('jchemhub.controller.ReactionEditor', jchemhub.controller.ReactionEditor);
goog.exportSymbol('jchemhub.controller.ReactionEditor.prototype.setModels', jchemhub.controller.ReactionEditor.prototype.setModels);
goog.exportSymbol('jchemhub.io.mdl', jchemhub.io.mdl);
goog.exportSymbol('jchemhub.io.mdl.readMolfile', jchemhub.io.mdl.readMolfile);
*/



