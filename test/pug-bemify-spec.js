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

    it('can modify multiple shorthand class names', function () {
        const testPugTxt = `.block.--modA.--modB`;

        const result = pug.render(testPugTxt, {
            plugins: [pugBEMLexer()]
        });

        expect(result).to.eql('<div class="block block--modA block--modB"></div>');
    });

    it('can parse multiple lines', function () {
        const testPugTxt = `.block.__child\n\t.grand-child.__test Hello World`,
            expectedResulted = '<div class="block block__child"><div class="grand-child grand-child__test">Hello World</div></div>';

        const result = pug.render(testPugTxt, {
            plugins: [pugBEMLexer()]
        });

        expect(result).to.eql(expectedResulted);
    });

    it('can correctly parse multiple nested blocks', function () {
        const testPugTxt = ".block" +
          "\n\t.__parent" +
          "\n\t\t.__child" +
          "\n\t\t\t.__test_child" +
          "\n\t\t\t.aGranChild" +
          "\n\t\t\t\t.__child" +
          "\n\t\t.__chlid_sibling" +
          "\n\t\t\t.__chlid_sibling_child",

          expectedResulted = '<div class="block">' +
              '<div class="block__parent">' +
                '<div class="block__child">' +
                  '<div class="block__test_child"></div>' +
                  '<div class="aGranChild">' +
                  '<div class="aGranChild__child"></div>' +
                  '</div>' +
                '</div>' +
                '<div class="block__chlid_sibling">' +
                  '<div class="block__chlid_sibling_child"></div>' +
                '</div>' +
              '</div>' +
            '</div>';

        const result = pug.render(testPugTxt, {
            plugins: [pugBEMLexer()]
        });

        expect(result).to.eql(expectedResulted);
    })
});
