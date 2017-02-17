function PugLexBemifier() {
    this.bemBlocks = this.bemBlocks || [];
    this.tokens = this.tokens || [];
}

PugLexBemifier.prototype = {

    bemify: function (lexer, token) {
        var mostRecentBEMBlock = this.bemBlocks[this.bemBlocks.length - 1],
            prevToken = lexer.tokens[lexer.tokens.length - 1];

        this.tokens.push(token);

        if (this.stop){
            this.stop = false;
        }
        if (mostRecentBEMBlock && /divider/.test(mostRecentBEMBlock.val)){
            this.stop = true;
        }
        if (prevToken){
            switch(prevToken.type){
                case 'outdent':
                case 'newline':
                    if (mostRecentBEMBlock  && token.col <= mostRecentBEMBlock.col) {
                        this.bemBlocks.pop();
                    }
                    // update BEM state
                    mostRecentBEMBlock = this.bemBlocks[this.bemBlocks.length - 1];
            }
        }
        if (token.type == 'class') {
            if (token.val.match(/^[a-zA-Z]/) && !(prevToken && prevToken.type == 'class')) {
                this.bemBlocks.push(token);
            } else if (mostRecentBEMBlock && token.val.match(/^\-/)) {
                token.val = token.val.replace(/^\-\-?/, mostRecentBEMBlock.val + '--');
            } else if (mostRecentBEMBlock && token.val.match(/^\_/)) {
                token.val = token.val.replace(/^\_\_?/, mostRecentBEMBlock.val + '__');
            }
        }
    },

    reset: function(){
        this.tokens = [];
    }
};

module.exports = function () {
    var bemifier = new PugLexBemifier();
    return {
        postLex: function (tokens) {
            bemifier.reset();
            tokens.forEach(function (token) {
                bemifier.bemify(bemifier, token);
            });
            return bemifier.tokens;
        }
    }
};
