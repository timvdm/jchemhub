import os, sys

namespaces = '''
var sys = require('sys');
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
kemia={};
kemia.controller={};
kemia.controller.ToolbarFactory={};
kemia.controller.DefaultToolbar={};
kemia.controller.plugins={};
kemia.view={};
kemia.math={};
kemia.graphics={};
kemia.resource={};
kemia.model={};
kemia.ring={};
kemia.ring.Hanser={};
kemia.ring.SSSR={};
kemia.query={};
kemia.io={};
kemia.io.json={};
kemia.io.mdl={};
kemia.io.smiles={};
kemia.query={};
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

