import os, sys

namespaces = '''
goog={};
goog.array={};
goog.array.forEach={};
goog.debug={};
goog.events={};
goog.events.pools={};
goog.string={};
goog.userAgent={};
goog.userAgent.jscript={};
goog.userAgent.product={};
goog.structs={};
goog.object={};
goog.iter={};
goog.math={};
goog.graphics={};
goog.graphics.VmlGraphics={};
goog.dom={};
goog.dom.classes={};
goog.dom.a11y={};
goog.style={};
goog.ui={};
goog.ui.registry={};
goog.fx={};
goog.editor={};
goog.editor.defines={};
goog.async={};
goog.functions={};
goog.reflect={};
goog.color={};
goog.positioning={};
goog.json={};
goog.asserts={};
goog.i18n={};
jchemhub={};
jchemhub.controller={};
jchemhub.controller.ToolbarFactory={};
jchemhub.controller.DefaultToolbar={};
jchemhub.controller.plugins={};
jchemhub.view={};
jchemhub.math={};
jchemhub.graphics={};
jchemhub.resource={};
jchemhub.model={};
jchemhub.ring={};
jchemhub.ring.Hanser={};
jchemhub.ring.SSSR={};
jchemhub.query={};
jchemhub.io={};
jchemhub.io.json={};
jchemhub.io.mdl={};
var document=this;
'''

if len(sys.argv) < 2:
  print 'Usage: addnamespaces.py file'
else:
  inFilename = sys.argv[1]
  input = open(inFilename)
  outFilename = inFilename
  outFilename.replace('.js', '.node.js')
  if len(sys.argv) > 2:
    outFilename = sys.argv[2]
  output = open(outFilename, 'w')
  isFirstLine = True
  for s in input.xreadlines():
    if (isFirstLine):
      output.write(s.replace('var goog=goog||{};', namespaces))
    else:
      output.write(s)

