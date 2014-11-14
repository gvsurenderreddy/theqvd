function userTestFake () {
    module( "Fake tests", {
        setup: function() {
            // prepare something for all following tests
            this.server = sinon.fakeServer.create();
        },
        teardown: function() {
            // clean up after each test
            this.server.restore();
        }
    });

        test("User details processing", function() {
            var callback = sinon.spy();

            var fakeValues = WatTests.fakeValues.user;

            // Number of Assertions we Expect
            expect( Object.keys(fakeValues).length + 2 );

            var fakeResponse = {
                "failures": {},
                "status": 0,
                "result": {
                    "rows" : [
                        fakeValues
                    ]
                },
                "message": "Successful completion."
            };

            this.server.respondWith(
                "POST", 
                Wat.C.apiUrl + '?sid=' + Wat.C.sid  + '&action=user_get_details&filters={"id":' + fakeValues.id + '}',
                [
                    200, 
                    { "Content-Type": "application/json" },
                    JSON.stringify(fakeResponse)
                ]
           );

            Wat.Router.app_router.trigger('route:detailsUser', [fakeValues.id]);

            // Bind to the change event on the model
            Wat.CurrentView.model.bind('change', callback);

            this.server.respond();

            ok(callback.called, "Server call");

            $.each(fakeValues, function (fieldName, fieldValue) {
                if (typeof fieldValue == 'object') {
                    deepEqual(callback.getCall(0).args[0].attributes[fieldName], fieldValue, "User fetching should recover '" + fieldName + "' properly (Random generated: " + JSON.stringify(fieldValue) + ")");
                }
                else {
                    equal(callback.getCall(0).args[0].attributes[fieldName], fieldValue, "User fetching should recover '" + fieldName + "' properly (Random generated: " + fieldValue + ")");
                }
            });

            deepEqual(callback.getCall(0).args[0], Wat.CurrentView.model, "Spied result and Backbone model should be equal");
        });
}

function userTestReal () {
    module( "Real tests", {
        setup: function() {
            // prepare something for all following tests
        },
        teardown: function() {
            // clean up after each test
        }
    });

        QUnit.asyncTest("User CRUD", function() {
            // Number of Assertions we Expect
            var assertions = 0;
            assertions += Object.keys(WatTests.fakeValues.user).length * 2; // Create & Update verifications. (Password will not be verified because is not returned)
            assertions +=3; // Create, Update and Delete verifications

            expect(assertions);

            Wat.Router.app_router.trigger('route:listUser');

            Wat.CurrentView.model = new Wat.Models.User();

            //////////////////////////////////////////////////////////////////
            // Create User
            //////////////////////////////////////////////////////////////////
            Wat.CurrentView.createModel(WatTests.values.user, function (e) { 
                equal(e.retrievedData.status, STATUS_SUCCESS, "User created succesfully (" + JSON.stringify(WatTests.values.user) + ")");

                if(e.retrievedData.status == STATUS_SUCCESS) {
                    WatTests.values.user.id = e.retrievedData.rows[0].id;
                }
                else {
                    start();
                    return;
                }

                //////////////////////////////////////////////////////////////////
                // After create, get list of users matching by the created name
                //////////////////////////////////////////////////////////////////
                WatTests.models.user = new Wat.Models.User({
                    id: WatTests.values.user.id
                });            

                WatTests.models.user.fetch({      
                    complete: function () {
                        $.each (WatTests.fakeValues.user, function (fieldName) {
                            var valRetrieved = WatTests.models.user.attributes[fieldName];

                            if (fieldName == 'properties' && WatTests.values.user['__properties__'] != undefined) {
                                deepEqual(valRetrieved, WatTests.values.user['__properties__'], "User field '" + fieldName + "' retrieved successfully and match with created value (" + JSON.stringify(valRetrieved) + ")");
                            }
                            else if (WatTests.values.user[fieldName] != undefined) {
                                equal(valRetrieved, WatTests.values.user[fieldName], "User field '" + fieldName + "' retrieved successfully and match with created value (" + valRetrieved + ")");
                            }
                            else {
                                notEqual(WatTests.models.user.attributes[fieldName], undefined, "User field '" + fieldName + "' retrieved successfully (" + valRetrieved + ")");
                            }
                        });

                        // Perform changes in testing user values
                        performUpdation(WatTests.values.user, WatTests.updateValues.user);

                        //////////////////////////////////////////////////////////////////
                        // After get list of users, update it
                        //////////////////////////////////////////////////////////////////
                        Wat.CurrentView.updateModel(WatTests.updateValues.user, {'id': WatTests.values.user.id}, function (e) { 
                            equal(e.retrievedData.status, STATUS_SUCCESS, "User updated succesfully (" + JSON.stringify(WatTests.updateValues.user) + ")");

                            //////////////////////////////////////////////////////////////////
                            // After update, get list of users matching by name
                            //////////////////////////////////////////////////////////////////
                            WatTests.models.user.fetch({   
                                complete: function (e) {
                                    WatTests.values.user.id = WatTests.models.user.attributes['id'];
                                    $.each (WatTests.fakeValues.user, function (fieldName) {
                                        var valRetrieved = WatTests.models.user.attributes[fieldName];

                                        if (fieldName == 'properties' && WatTests.values.user['__properties__'] != undefined) {
                                            deepEqual(valRetrieved, WatTests.values.user['__properties__'], "User field '" + fieldName + "' retrieved successfully and match with created value (" + JSON.stringify(valRetrieved) + ")");
                                        }
                                        else if (WatTests.values.user[fieldName] != undefined) {
                                            equal(valRetrieved, WatTests.values.user[fieldName], "User field '" + fieldName + "' retrieved successfully and match with created value (" + valRetrieved + ")");
                                        }
                                        else {
                                            notEqual(WatTests.models.user.attributes[fieldName], undefined, "User field '" + fieldName + "' retrieved successfully (" + valRetrieved + ")");
                                        }
                                    });


                                    //////////////////////////////////////////////////////////////////
                                    // After match the updated user, delete it
                                    //////////////////////////////////////////////////////////////////
                                    Wat.CurrentView.deleteModel({'id': WatTests.values.user.id}, function (e) { 
                                        equal(e.retrievedData.status, 0, "User deleted succesfully (ID: " + JSON.stringify(WatTests.values.user.id) + ")");

                                        // Unblock task runner
                                        start();
                                    }, Wat.CurrentView.model);
                                }
                            });
                        }, Wat.CurrentView.model);
                    }
                });
            });
        });
}