"use strict";

(function (win, doc, $) {
    // Extend jQuery with pseudo selector :blank
    (function($) {
        $.extend($.expr[":"], {
            // http://docs.jquery.com/Plugins/Validation/blank
            blank: function(a) {
                return !$.trim(a.value);
            },
        });
    })(jQuery);
    
	$(doc).ready(function() {
        // Setup jQuery ajax to store all requests in a requests queue
        $.ajaxSetup({
            beforeSend: function(jqXHR) {
                Wat.C.requests.push(jqXHR);
            },
            complete: function(jqXHR) {
                var index = $.inArray(jqXHR, Wat.C.requests);
                if (index > -1) {
                    Wat.C.requests.splice(index, 1);
                }
            }
        });
        
        Wat.C.afterLogin = function () {
            // Load translation file
            Wat.T.initTranslate();

            // Interface onfiguration
            Wat.I.renderMain();

            //Wat.I.bindCornerMenuEvents();
            Wat.I.tooltipConfiguration();

            // Binding events manually because backbone doesnt allow bind events to dialogs loaded dinamically
            Wat.B.bindCommonEvents();

            if (Wat.C.isLogged()) {
                Wat.I.setCustomizationFields();
            }
            
            if (!Wat.C.routerHistoryStarted) {
                // Instantiate the router
                Wat.Router.app_router = new Wat.Router;

                // ------- List sections ------- //
                Wat.Router.app_router.on('route:listVM', function (field, value) {   
                    var params = {};
                    if (field !== null) {
                        switch(field) {
                            case 'user':
                                params.filters = {"user_id": value};
                                break;
                            case 'host':
                                params.filters = {"host_id": value};
                                break;
                            case 'osf':
                                params.filters = {"osf_id": value};
                                break;
                            case 'di':
                                params.filters = {"di_id": value};
                                break;
                            case 'state':
                                params.filters = {"state": value};
                                break;
                            case 'blocked':
                                params.filters = {"blocked": value};
                                break;
                        }
                    }

                    Wat.Router.app_router.performRoute('vms', Wat.Views.VMListView, params);
                });        

                Wat.Router.app_router.on('route:listUser', function (field, value) {   
                    var params = {};
                    if (field !== null) {
                        switch(field) {
                            case 'blocked':
                                params.filters = {"blocked": value};
                                break;
                        }
                    }

                    Wat.Router.app_router.performRoute('users', Wat.Views.UserListView, params);
                });       

                Wat.Router.app_router.on('route:listHost', function (field, value) {   
                    var params = {};
                    if (field !== null) {
                        switch(field) {
                            case 'state':
                                params.filters = {"state": value};
                                break;
                            case 'blocked':
                                params.filters = {"blocked": value};
                                break;
                        }
                    }

                    Wat.Router.app_router.performRoute('hosts', Wat.Views.HostListView, params);
                });      

                Wat.Router.app_router.on('route:listOSF', function () {
                    Wat.Router.app_router.performRoute('osfs', Wat.Views.OSFListView);
                });    

                Wat.Router.app_router.on('route:listDI', function (field, value) {
                    var params = {};

                    if (field !== null) {
                        switch(field) {
                            case 'osf':
                                params.filters = {"osf_id": value};
                                break;
                            case 'blocked':
                                params.filters = {"blocked": value};
                                break;
                        }
                    }

                    Wat.Router.app_router.performRoute('dis', Wat.Views.DIListView, params);
                });



                // ------- Details sections ------- //
                Wat.Router.app_router.on('route:detailsUser', function (id) {
                    Wat.Router.app_router.performRoute('users', Wat.Views.UserDetailsView, {"id": id});
                });

                Wat.Router.app_router.on('route:detailsVM', function (id) {
                    Wat.Router.app_router.performRoute('vms', Wat.Views.VMDetailsView, {"id": id});
                });

                Wat.Router.app_router.on('route:detailsHost', function (id) {
                    Wat.Router.app_router.performRoute('hosts', Wat.Views.HostDetailsView, {"id": id});
                });

                Wat.Router.app_router.on('route:detailsOSF', function (id) {
                    Wat.Router.app_router.performRoute('osfs', Wat.Views.OSFDetailsView, {"id": id});
                });

                Wat.Router.app_router.on('route:detailsDI', function (id) {
                    Wat.Router.app_router.performRoute('dis', Wat.Views.DIDetailsView, {"id": id});
                });



                // ------- Configuration sections ------- //
                Wat.Router.app_router.on('route:setupCustomize', function () {
                    Wat.Router.app_router.performRoute('views', Wat.Views.SetupCustomizeView);
                });    
                Wat.Router.app_router.on('route:setupConfig', function (token) {
                    var params = {};
                    if (token) {
                        params.currentTokensPrefix = token;
                    }
                    Wat.Router.app_router.performRoute('config', Wat.Views.ConfigQvdView, params);
                });       
                Wat.Router.app_router.on('route:watConfig', function () {
                    Wat.Router.app_router.performRoute('watconfig', Wat.Views.ConfigWatView);
                });    
                Wat.Router.app_router.on('route:listTenant', function () {
                    Wat.Router.app_router.performRoute('tenants', Wat.Views.TenantListView);
                });            
                Wat.Router.app_router.on('route:detailsTenant', function (id) {
                    Wat.Router.app_router.performRoute('tenants', Wat.Views.TenantDetailsView, {"id": id});
                });    
                Wat.Router.app_router.on('route:listAdmin', function () {
                    Wat.Router.app_router.performRoute('administrators', Wat.Views.AdminListView);
                });
                Wat.Router.app_router.on('route:detailsAdmin', function (id) {
                    Wat.Router.app_router.performRoute('administrators', Wat.Views.AdminDetailsView, {"id": id});
                });    
                Wat.Router.app_router.on('route:listRole', function () {
                    Wat.Router.app_router.performRoute('roles', Wat.Views.RoleListView);
                });        
                Wat.Router.app_router.on('route:detailsRole', function (id) {
                    Wat.Router.app_router.performRoute('roles', Wat.Views.RoleDetailsView, {"id": id});
                });         
                Wat.Router.app_router.on('route:listLog', function (field, value) {
                    var params = {};
                    
                    if (field != null) {
                        switch(field) {
                            case 'object':
                                params.filters = {
                                    "qvd_object": value.split('-')[0],
                                    "object_id": value.split('-')[1]
                                };
                                break;
                        }
                    }
                    
                    Wat.Router.app_router.performRoute('log', Wat.Views.LogListView, params);
                });             
                Wat.Router.app_router.on('route:detailsLog', function (id) {
                    Wat.Router.app_router.performRoute('log', Wat.Views.LogDetailsView, {"id": id});
                });    


                // ------- Help sections ------- //
                Wat.Router.app_router.on('route:about', function (actions) {
                    Wat.Router.app_router.performRoute('about', Wat.Views.AboutView);
                });
                Wat.Router.app_router.on('route:documentation', function (actions) {
                    Wat.Router.app_router.performRoute('documentation', Wat.Views.DocView);
                });
                Wat.Router.app_router.on('route:documentationGuide', function (guide, section) {
                    Wat.Router.app_router.performRoute('documentation', Wat.Views.DocView, {
                        "guide": guide,
                        "section": section
                    });
                });
                Wat.Router.app_router.on('route:documentationSearch', function (searchKey) {
                    Wat.Router.app_router.performRoute('documentation', Wat.Views.DocView, {
                        "searchKey": searchKey
                    });
                });



                 // ------- Current administrator ------- //
                Wat.Router.app_router.on('route:logout', function (actions) {
                    Wat.C.logOut();

                    Wat.C.configureVisibility();
                    Wat.I.renderMain();

                    Wat.Router.app_router.performRoute();
                });          
                Wat.Router.app_router.on('route:profile', function (actions) {
                    Wat.Router.app_router.performRoute('profile', Wat.Views.ProfileView);
                });             
                Wat.Router.app_router.on('route:myviews', function (actions) {
                    Wat.Router.app_router.performRoute('myviews', Wat.Views.MyViewsView);
                });       


                // ------- Default load ------- //
                Wat.Router.app_router.on('route:defaultRoute', function (actions) {
                    Wat.Router.app_router.performRoute('', Wat.Views.HomeView);
                });

                // Start Backbone history
                Backbone.history.start();   
                
                Wat.C.routerHistoryStarted = true;
            }
        
        };
                
        var continueStart = function () {
            // Remember login from cookies
            Wat.C.rememberLogin();
        };
        
        var templates = {
            main: {
                name: 'main'
            },
            menu: {
                name: 'menu'
            },
            editorCommon: {
                name: 'editor-common'
            },
            relatedDoc: {
                name: 'documentation-related-links'
            },
            setupCommon: {
                name: 'setup-common'
            },
            setupCustomize: {
                name: 'setup-customize'
            },
            setupFormCustomize: {
                name: 'setup-customize-form'
            }
        }

        Wat.A.getTemplates(templates, continueStart);
	});
})(window, document, jQuery)
