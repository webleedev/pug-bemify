function PugBEMAST(ast, options) {
    this.ast = ast;
    this.modifierRegExp = options && options.modifierRegExp || /^'--?/;
    this.elementRegExp = options && options.elementRegExp || /^'__?/;
}

PugBEMAST.prototype = {
    recursiveBemify: function (node, parent) {
        var self = this;
        var nodes = node && node.nodes || node && node.block && node.block.nodes || [];
        var attrs = node && node.attrs || [];
        var parentBEMParams = parent && parent.nodeBEMParams || {
            classAttr: null,
            isElementClassAttr: null,
            isModifierClassAttr: null,
            isBlock: null,
            blockAttr: null
        };
        var nodeBEMParams = {
            classAttr: null,
            isElementClassAttr: null,
            isModifierClassAttr: null,
            isBlock: null,
            blockAttr: null
        };

        attrs.forEach(function (nodeAttr, attrIndex) {
            var isClassAttr = nodeAttr.name === 'class';
            if (isClassAttr) {
                nodeBEMParams.classAttr = nodeAttr;
                nodeBEMParams.isElementClassAttr = self.elementRegExp.test(nodeAttr.val);
                nodeBEMParams.isModifierClassAttr = self.modifierRegExp.test(nodeAttr.val);
                nodeBEMParams.isBlock = !nodeBEMParams.isElementClassAttr && !nodeBEMParams.isModifierClassAttr;

                if ((!parentBEMParams.blockAttr || attrIndex === 0) && nodeBEMParams.isBlock) {
                    parentBEMParams.blockAttr = nodeBEMParams.classAttr;
                }

                nodeBEMParams.blockAttr = parentBEMParams.blockAttr;

                if (nodeBEMParams.isModifierClassAttr && nodeBEMParams.blockAttr) {
                    var modifierClassPrefix = nodeBEMParams.blockAttr.val.replace(/'$/, '--');
                    nodeBEMParams.classAttr.val = nodeBEMParams.classAttr.val.replace(self.modifierRegExp, modifierClassPrefix);
                }

                if (nodeBEMParams.isElementClassAttr && nodeBEMParams.blockAttr) {
                    var elementClassPrefix = nodeBEMParams.blockAttr.val.replace(/'$/, '__');
                    nodeBEMParams.classAttr.val = nodeBEMParams.classAttr.val.replace(self.elementRegExp, elementClassPrefix);
                }
            }
        });


        nodes.forEach(function (childNode) {
            node.nodeBEMParams = nodeBEMParams;
            self.recursiveBemify(childNode, node);
            delete node.nodeBEMParams;
        });

        return node;
    },

    toPugAST: function () {
        return this.recursiveBemify(this.ast);
    }
};

module.exports = function () {
    return {
        postParse: function (ast) {
            var bemAST = new PugBEMAST(ast);

            return bemAST.toPugAST();
        }
    }
};
