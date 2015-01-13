// Config
Wat.C = {
    version: '1.7',
    login: '',
    password: '',
    loggedIn: false,
    // Openstack preprod
    //apiUrl: 'http://172.20.126.12:3000/',
    //apiWSUrl: 'ws://172.20.126.12:3000/ws',  
    //apiAddress: '172.20.126.12:3000',  
    
    // Openstack
    apiUrl: 'http://172.20.126.16:3000/',
    apiWSUrl: 'ws://172.20.126.16:3000/ws',
    apiAddress: '172.20.126.16:3000',  

    // Benja
    //apiUrl: 'http://172.26.9.42/',
    //apiWSUrl: 'ws://172.26.9.42/ws',
    //apiAddress: '172.26.9.42',  

    loginExpirationDays: 1,
    acls: [],
    aclGroups: {},
    sid: '',
    tenantID: -1,
    adminID: -1,

    getBaseUrl: function () {
        if (this.login && this.password) {
            return this.apiUrl + "?login=" + this.login + "&password=" + this.password;
        }
        else {
            return this.apiUrl + "?sid=" + this.sid;
        }
    },
    
    isSuperadmin: function () {
        return this.tenantID == SUPERTENANT_ID;
    },    
    
    isRecoveradmin: function () {
        return this.adminID == RECOVER_USER_ID;
    },
    
    logOut: function () {
        $.removeCookie('qvdWatSid', { path: '/' });
        $.removeCookie('qvdWatLogin', { path: '/' });
        this.loggedIn = false;
        this.sid = '';
        this.login = '';
        this.acls = [];
    },
    
    logIn: function (sid, login) {
        this.loggedIn = true;
        $.cookie('qvdWatSid', sid, { expires: this.loginExpirationDays, path: '/' });
        $.cookie('qvdWatLogin', login, { expires: this.loginExpirationDays, path: '/' });
        Wat.T.initTranslate();
        window.location = '#';
    },
    
    isLogged: function () {
        if (this.loggedIn && this.sid != '' && $.cookie('qvdWatSid') && $.cookie('qvdWatSid') == this.sid && this.login != '' && $.cookie('qvdWatLogin') && $.cookie('qvdWatLogin') == this.login) {
            return true;
        }
        else {
            this.logOut();
            return false;
        }
    },
    
    rememberLogin: function () {
        if ($.cookie('qvdWatSid') && $.cookie('qvdWatLogin')) {
            this.loggedIn = true;
            this.sid = $.cookie('qvdWatSid');
            this.login = $.cookie('qvdWatLogin');
        }
        else {
            this.loggedIn = false;
            this.sid = '';
            this.login = '';
        }
        
        if (this.sid) {
            Wat.A.performAction('current_admin_setup', {}, VIEWS_COMBINATION, {}, this.checkLogin, this, false);
        }
    },
    
    tryLogin: function (user, password) {
        var user = $('input[name="admin_user"]').val() || user;
        var password = $('input[name="admin_password"]').val() || password;
        
        if (!user) {
            Wat.I.showMessage({message: "Empty user", messageType: "error"});
            return;
        }

        this.login = user;
        this.password = password;

        Wat.A.performAction('current_admin_setup', {}, VIEWS_COMBINATION, {}, this.checkLogin, this, false);
    },
    
    checkLogin: function (that) {   
        that.password = '';
        
        if (!that.retrievedData.acls || $.isEmptyObject(that.retrievedData.acls)) {
            Wat.C.logOut();
            Wat.I.showMessage({message: "Wrong user or password", messageType: "error"});
            that.login = '';
            that.sid = '';
            return;
        }
        
        // Store retrieved acls
        Wat.C.acls = that.retrievedData.acls;
        
        // Store language
        Wat.C.language = that.retrievedData.admin_language;
        Wat.C.tenantLanguage = that.retrievedData.tenant_language;
        
        // Store block
        Wat.C.block = that.retrievedData.admin_block;
        Wat.C.tenantBlock = that.retrievedData.tenant_block;
        
        // Restore possible residous views configuration to default values
        Wat.I.restoreListColumns();
        Wat.I.restoreFormFilters();
        
        // Store views configuration
        Wat.C.storeViewsConfiguration(that.retrievedData.views);
        
        // Store tenant ID
        Wat.C.tenantID = that.retrievedData.tenant_id;
        
        // Store admin ID
        Wat.C.adminID = that.retrievedData.admin_id;
        
        // Configure visability
        Wat.C.configureVisibility();
        
        if (Wat.CurrentView.qvdObj == 'login') {
            Wat.C.logIn(that.sid, that.login);
                
            Wat.I.renderMain();

            Wat.Router.app_router.performRoute('', Wat.Views.HomeView);
        }
    },
    
    storeViewsConfiguration: function (viewsConfiguration) {
        $.each (viewsConfiguration, function (iView, view) {
            switch (view.view_type) {
                case 'list_column':
                    if (!Wat.I.listFields[view.qvd_object][view.field]) {
                        Wat.I.listFields[view.qvd_object][view.field] = {
                            'display': view.visible,
                            'noTranslatable': true,
                            'fields': [
                                view.field
                            ],
                            'acls': view.qvd_object + '.see.properties',
                            'property': true,
                            'text': view.field
                        };
                    }
                    
                    Wat.I.listFields[view.qvd_object][view.field].display = view.visible;
                    break;
                case 'filter':
                    if (!Wat.I.formFilters[view.qvd_object][view.field]) {
                        Wat.I.formFilters[view.qvd_object][view.field] = {
                            'filterField': view.field,
                            'type': 'text',
                            'text': view.field,
                            'noTranslatable': true,
                            'property': true,
                            'acls': view.qvd_object + '.filter.properties',
                        };
                    }
                    
                    switch (view.device_type) {
                        case 'mobile':
                            Wat.I.formFilters[view.qvd_object][view.field].displayMobile = view.visible;
                            break;
                        case 'desktop':
                            Wat.I.formFilters[view.qvd_object][view.field].displayDesktop = view.visible;
                            break;
                    }
                    break;
            }
        });
    },
    
    // Given an ACL or an array of ACLs, check if it pass or not due the user configuration
    // Params:
    //      acl: string or array of acls
    //      logic: OR/AND to calculate the pass condition if is array
    checkACL: function (acl, logic) {
        if ($.isArray(acl)) {
            var pass = 0;
            var that = this;
            $.each(acl, function (i, anAcl) {
                if ($.inArray(anAcl, that.acls) != -1) {
                    pass++;
                }
            });
            
            switch(logic) {
                case 'OR':
                    if (pass > 0) {
                        return true;
                    }
                    break;
                case 'AND':
                default:
                    if (pass == acl.length) {
                        return true;
                    }
                    break;
            }
        }
        else {
            return $.inArray(acl, this.acls) != -1;
        }

        return false;
    },
    
    // Check all the ACLs of predifened groups. If any of them is available, return true
    checkGroupACL: function (group) {
        var aclGranted = false;
        
        var that = this;
        $.each(this.aclGroups[group], function (iAcl, acl) {
            if (that.checkACL(acl)) {
                aclGranted = true;
                return false;
            }
        });
        
        return aclGranted;
    },
    
    ifACL: function (string, acl) {
        if (this.checkACL(acl)) {
            return string;
        }
        else {
            return '';
        }
    },
    
    purgeConfigData: function (data) {
        var that = this;
        
        // Check acls on data items to remove forbidden ones
        $.each(data, function (item, itemConfig) {
            if (itemConfig.groupAcls != undefined) {
                itemConfig.acls = that.aclGroups[itemConfig.groupAcls];
            }
            if (itemConfig.acls != undefined) {
                if (!that.checkACL(itemConfig.acls, itemConfig.aclsLogic)) {
                    delete data[item];
                }
            }
        });
        
        return data;
    },
    
    configureVisibility: function () {        
        Wat.I.menu = $.extend(true, {}, Wat.I.menuOriginal);
        Wat.I.userMenu = $.extend(true, {}, Wat.I.menuUserOriginal);
        Wat.I.helpMenu = $.extend(true, {}, Wat.I.menuHelpOriginal);
        Wat.I.configMenu = $.extend(true, {}, Wat.I.menuConfigOriginal);
        Wat.I.setupMenu = $.extend(true, {}, Wat.I.menuSetupOriginal);
        Wat.I.mobileMenu = $.extend(true, {}, Wat.I.mobileMenuOriginal);
        Wat.I.cornerMenu = $.extend(true, {}, Wat.I.cornerMenuOriginal);

        var that = this;

        // Menu visibility
        var aclMenu = {
            'di.see-main.' : 'dis',
            'host.see-main.' : 'hosts',
            'osf.see-main.' : 'osfs',
            'user.see-main.' : 'users',
            'vm.see-main.' : 'vms',
        };
        
        $.each(aclMenu, function (acl, menu) {
            if (!that.checkACL(acl)) {
                delete Wat.I.menu[menu];
                delete Wat.I.mobileMenu[menu];
                delete Wat.I.cornerMenu.platform.subMenu[menu];
            }
        });
        
        // Menu visibility
        var aclSetupMenu = {
            'config.wat.' : 'watconfig',
            'role.see-main.' : 'roles',
            'administrator.see-main.' : 'admins',
            'tenant.see-main.' : 'tenants',
            'views.see-main.' : 'views',
        };
        
        $.each(aclSetupMenu, function (acl, menu) {
            if (!that.checkACL(acl)) {
                delete Wat.I.setupMenu[menu];
                delete Wat.I.cornerMenu.wat.subMenu[menu];
            }
        });
        
        // Recover user will has not profile section
        if (Wat.C.isRecoveradmin()) {
            delete Wat.I.userMenu['profile'];
            delete Wat.I.cornerMenu.user.subMenu['profile'];
        }
        
        // Set to the menu option the link of its first sub-option link
        if (Wat.I.cornerMenu.wat && !$.isEmptyObject(Wat.I.cornerMenu.wat.subMenu)) {
            Wat.I.cornerMenu.wat.link = Wat.I.cornerMenu.wat.subMenu[Object.keys(Wat.I.cornerMenu.wat.subMenu)[0]].link;
        }         
        if (Wat.I.cornerMenu.user && !$.isEmptyObject(Wat.I.cornerMenu.user.subMenu)) {
            Wat.I.cornerMenu.user.link = Wat.I.cornerMenu.user.subMenu[Object.keys(Wat.I.cornerMenu.user.subMenu)[0]].link;
        }        
        if (Wat.I.cornerMenu.platform && !$.isEmptyObject(Wat.I.cornerMenu.platform.subMenu)) {
            Wat.I.cornerMenu.platform.link = Wat.I.cornerMenu.platform.subMenu[Object.keys(Wat.I.cornerMenu.platform.subMenu)[0]].link;
        }
        
        // Hide help option if there are not acls given (not logged)
        if (Wat.C.acls.length == 0) {
            delete Wat.I.cornerMenu.help;
        }
        
        if ($.isEmptyObject(Wat.I.cornerMenu.platform.subMenu)) {
            delete Wat.I.cornerMenu.platform;
        }        
        
        if ($.isEmptyObject(Wat.I.cornerMenu.wat.subMenu)) {
            delete Wat.I.cornerMenu.wat;
        }
        
        if (!that.checkACL('config.qvd.')) {
            delete Wat.I.cornerMenu.config;
        }
        
        // For tenant admins (not superadmins) the acl section tenant will not exist
        if (Wat.C.tenantID != SUPERTENANT_ID && Wat.C.adminID != RECOVER_USER_ID) {
            delete ACL_SECTIONS['tenant'];
            delete ACL_SECTIONS_PATTERNS['tenant'];
        }
    },
    
    sessionExpired: function (response) {
        if (!Wat.Router.app_router) {
            return false;
        }
        else if (response.status == STATUS_NOT_LOGIN || response.status == STATUS_SESSION_EXPIRED) {
            Wat.Router.app_router.trigger('route:logout');
            Wat.I.showMessage({'message': ALL_STATUS[response.status], 'messageType': 'error'});
            return true;
        }
        
        return false;
    },
    
    getBlock: function () {
        if (this.block == 0) {
            return this.tenantBlock;
        }
        else {
            return this.block;
        }
    }
}