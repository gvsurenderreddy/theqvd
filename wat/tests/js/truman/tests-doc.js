function languageDocTest() {
    module( "Documentation tests", {
        setup: function() {
            // prepare something for all following tests
        },
        teardown: function() {
            // clean up after each test
        }
    });
    
        asyncTest("Screens Info modal doc", function() {
            // Number of Assertions we Expect
            var assertions = 0;
            
            assertions += Object.keys(Wat.I.docSections).length * DOC_AVAILABLE_LANGUAGES.length;

            expect(assertions);
            
            stop(assertions-1);
            
            $.each(DOC_AVAILABLE_LANGUAGES, function (iLan, lan) {
                $.each (Wat.I.docSections, function (iSection, section) {
                    Wat.A.fillTemplateString = function (string, target, toc, docParams) {
                        if (docParams.guide == 'multitenant') {
                            equal(string, null, 'Documentation section "' + docParams.sectionId + '" was not found in guide "' + docParams.guide + '" due the administrator has not permissions');
                        }
                        else {
                            notEqual(string, null, 'Documentation section "' + docParams.sectionId + '" was found in guide "' + docParams.guide + '"');
                        }
                        start();
                    };
                    
                    Wat.A.fillDocSection(section.guide, section[lan] + '', false, '../');
                });
            });
        });
}