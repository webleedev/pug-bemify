const pug = require('pug'),
    chai = require('chai'),

    expect = chai.expect;

describe('PugLexBemifier', function () {
    const pugBEMLexer = require('../');

    it('can edit the default pug tokens', function () {
        const testPugTxt = `.block.__child Hello World`;

        const result = pug.render(testPugTxt, {
            plugins: [pugBEMLexer()]
        });

        expect(result).to.eql('<div class="block block__child">Hello World</div>');
    });

    it('can parse the bare minimum pug text', function () {
        const testPugTxt = `.block.__child`;

        const result = pug.render(testPugTxt, {
            plugins: [pugBEMLexer()]
        });

        expect(result).to.eql('<div class="block block__child"></div>');
    });

    it('can parse multiple lines', function () {
        const testPugTxt = `.block.__child\n\t.grand-child.__test Hello World`,
            expectedResulted = '<div class="block block__child"><div class="grand-child grand-child__test">Hello World</div></div>';

        const result = pug.render(testPugTxt, {
            plugins: [pugBEMLexer()]
        });

        expect(result).to.eql(expectedResulted);
    })
});
