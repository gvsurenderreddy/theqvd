Wat.Views.ViewsView = Wat.Views.MainView.extend({
    setupCommonTemplateName: 'setup-common',
    setupCustomizeTemplateName: 'setup-customize',
    setupCustomizeFormTemplateName: 'setup-customize-form',
    sideContainer: '.bb-setup-side',
    setupContainer: '.bb-setup',
    setupFormContainer: '.bb-customize-form',
    setupOption: 'customize',
    selectedSection: 'user',
    selectedTenant: '0',

    initialize: function (params) {
        Wat.Views.MainView.prototype.initialize.apply(this, [params]);
        
        // If administrator is superadmin, use selected tenant. Otherwise, his tenant
        if (!Wat.C.isSuperadmin()) {
            this.selectedTenant = undefined;
        }
    },
    
    events: {
        'change select[name="obj-qvd-select"]': 'changeSection',
        'change select[name="tenant-select"]': 'changeSection',
        'change .js-desktop-fields>input': 'checkDesktopFilter',
        'change .js-mobile-fields>input': 'checkMobileFilter',
        'change .js-field-check>input': 'checkListColumn',
    },
    
    checkDesktopFilter: function (e) {
        var checked = $(e.target).is(':checked');
        var fieldName = $(e.target).parent().attr('data-name');
        
        var qvdObj = this.selectedSection;

        if (!this.currentFilters[fieldName] || this.currentFilters[fieldName].displayDesktop != checked) {
            var args = {
                'field': fieldName,
                'view_type': 'filter',
                'device_type': 'desktop',
                'visible': checked,
                'qvd_object': qvdObj,
                'property': !this.currentFilters[fieldName] || this.currentFilters[fieldName].property
            };
            
            this.addIDToArgs(args);

            Wat.A.performAction(this.setAction, args, {}, {'error': i18n.t('Error updating'), 'success': i18n.t('Successfully updated')}, function () {}, this, false);
            
            if (this.retrievedData.status == STATUS_SUCCESS) {
                // If update is perfermed successfuly, update in memory
                if (this.currentFilters[fieldName]) {
                    this.currentFilters[fieldName].displayDesktop = checked;
                }
                else {
                    this.currentFilters[fieldName] = {
                        acls: qvdObj + ".see.properties",
                        displayDesktop: checked,
                        displayMobile: 0,
                        filterField: fieldName,
                        noTranslatable: true,
                        property: true,
                        text: fieldName,
                        type: "text",
                    };
                }
                
                if (this.viewKind == 'admin') {
                    Wat.I.formFilters[qvdObj][fieldName] = this.currentFilters[fieldName];
                }
            }
            else {
                // If update fails, change ckeckbox to previous state
                $(e.target).prop('checked', !checked);
            }
        }
    },
    
    checkMobileFilter: function (e) {
        var checked = $(e.target).is(':checked');
        var fieldName = $(e.target).parent().attr('data-name');
        
        var qvdObj = this.selectedSection;
        
        if (!this.currentFilters[fieldName] || this.currentFilters[fieldName].displayMobile != checked) {
            var args = {
                'field': fieldName,
                'view_type': 'filter',
                'device_type': 'mobile',
                'visible': checked,
                'qvd_object': qvdObj,
                'property': !this.currentFilters[fieldName] || this.currentFilters[fieldName].property
            };
            
            this.addIDToArgs(args);

            Wat.A.performAction(this.setAction, args, {}, {'error': i18n.t('Error updating'), 'success': i18n.t('Successfully updated')}, function () {}, this, false);
            
            if (this.retrievedData.status == STATUS_SUCCESS) {
                // If update is perfermed successfuly, update in memory
                if (this.currentFilters[fieldName]) {
                    this.currentFilters[fieldName].displayMobile = checked;
                }
                else {
                    this.currentFilters[fieldName] = {
                        acls: qvdObj + ".see.properties",
                        displayDesktop: 0,
                        displayMobile: checked,
                        filterField: fieldName,
                        noTranslatable: true,
                        property: true,
                        text: fieldName,
                        type: "text",
                    };
                }
                
                if (this.viewKind == 'admin') {
                    Wat.I.formFilters[qvdObj][fieldName] = this.currentFilters[fieldName];
                }
            }
            else {
                // If update fails, change ckeckbox to previous state
                $(e.target).prop('checked', !checked);
            }
        }
    },
    
    checkListColumn: function (e) {
        var checked = $(e.target).is(':checked');
        var fieldName = $(e.target).parent().attr('data-name');
        
        var qvdObj = this.selectedSection;
        
        if (!this.currentColumns[fieldName] || this.currentColumns[fieldName].display != checked) {
            var args = {
                'field': fieldName,
                'view_type': 'list_column',
                'device_type': 'desktop',
                'visible': checked,
                'qvd_object': qvdObj,
                'property': !this.currentColumns[fieldName] || this.currentColumns[fieldName].property
            };
            
            this.addIDToArgs(args);

            Wat.A.performAction(this.setAction, args, {}, {'error': i18n.t('Error updating'), 'success': i18n.t('Successfully updated')}, function () {}, this, false);
            
            if (this.retrievedData.status == STATUS_SUCCESS) {
                // If update is perfermed successfuly, update in memory
                if (this.currentColumns[fieldName]) {
                    this.currentColumns[fieldName].display = checked;
                }
                else {
                    this.currentColumns[fieldName] = {
                        acls: qvdObj + ".see.properties",
                        display: checked,
                        fields: [fieldName],
                        noTranslatable: true,
                        property: true,
                        text: fieldName,
                    };
                }
                
                if (this.viewKind == 'admin') {
                    Wat.I.listFields[qvdObj][fieldName] = this.currentColumns[fieldName];
                }
            }
            else {
                // If update fails, change ckeckbox to previous state
                $(e.target).prop('checked', !checked);
            }
        }
    },
    
    changeSection: function (e) {
        this.selectedSection = $('select[name="obj-qvd-select"]').val();
        
        if (Wat.C.isSuperadmin()) {
            this.selectedTenant = $('select[name="tenant-select"]').val();
        }
        else {
            this.selectedTenant = undefined;
        }
        
        this.renderForm();
    },
    
    render: function () {
        this.templateSetupCommon = Wat.A.getTemplate(this.setupCommonTemplateName);
        
        // Fill the html with the template and the model
        this.template = _.template(
            this.templateSetupCommon, {
                model: this.model,
                cid: this.cid,
                selectedOption: this.setupOption,
                setupMenu: this.sideMenu
            }
        );
        
        $(this.el).html(this.template);
        
        this.renderBlock();
    },
    
    renderBlock: function () {
        this.templateSetupCustomize = Wat.A.getTemplate(this.setupCustomizeTemplateName);
        
        this.template = _.template(
            this.templateSetupCustomize, {
                selectedSection: this.selectedSection,
                limitByACLs: this.limitByACLs,
                viewKind: this.viewKind,
            }
        );
        
        $(this.setupContainer).html(this.template);
        
        // Store as selected the current selected section
        this.selectedSection = $('select[name="obj-qvd-select"]').val();
        
        // Fill OSF select on virtual machines creation form
        var params = {
            'action': 'tenant_tiny_list',
            'controlName': 'tenant-select'
        };
        
        Wat.A.fillSelect(params);  
        
        this.renderForm();
    },
    
    renderForm: function () {
        this.templateSetupFormCustomize = Wat.A.getTemplate(this.setupCustomizeFormTemplateName);
                
        this.template = _.template(
            this.templateSetupFormCustomize, {
                filters: this.currentFilters,
                columns: this.currentColumns,
                limitByACLs: this.limitByACLs
            }
        );
        
        $(this.setupFormContainer).html(this.template);
        
        Wat.T.translate();
        
        this.printBreadcrumbs(this.breadcrumbs, '');
        
        var args = {
            qvd_object: this.selectedSection
        };
        
        if (Wat.C.isSuperadmin() && this.selectedTenant != 0) {
            args.tenant_id = this.selectedTenant;
        }
        
        Wat.A.performAction('properties_by_qvd_object', {}, args, {}, this.addProperties, this, false);
    },
    
    addProperties: function (that) {    
        var objProperties = that.retrievedData.result.rows;
        
        // Add properties retrieved from QVD Objects
        var templatePropertiesColumns = $('.js-column-property-template');
        var templatePropertiesFilters = $('.js-filter-property-template');
        
        $.each(objProperties, function (iProp, prop) {  
            // If any property doesnt exist in database configuration, we add it to the editor
            if (!that.currentColumns[prop]) {    
                // Add property to columns table
                var propRow = templatePropertiesColumns.clone();
                propRow.removeClass('hidden');
                propRow.find('.js-prop-name').html(prop);
                propRow.attr('data-name', prop);
                propRow.find('.js-field-check').attr('data-name', prop);
                propRow.find('.js-field-check').attr('data-fields', prop);
                propRow.insertBefore(templatePropertiesColumns);
            }

            // If any property doesnt exist in database configuration, we add it to the editor
            if (!that.currentFilters[prop]) {    
                // Add property to filters table
                var propRow = templatePropertiesFilters.clone();
                propRow.removeClass('hidden');
                propRow.find('.js-prop-name').html(prop);
                propRow.attr('data-name', prop);
                propRow.find('.js-desktop-fields').attr('data-name', prop);
                propRow.find('.js-mobile-fields').attr('data-name', prop);
                propRow.find('.js-desktop-fields').attr('data-fields', prop);
                propRow.find('.js-mobile-fields').attr('data-fields', prop);
                propRow.insertBefore(templatePropertiesFilters);
            }
        });
    },
    
    addIDToArgs: function (args) {
        switch (this.viewKind) {
            case 'admin':
                args['admin_id'] = Wat.C.adminID;
                break;
            case 'tenant':
                // If administrator is superadmin, use selected tenant. Otherwise, no tenant filter will be used
                if (Wat.C.isSuperadmin()) {
                    args['tenant_id'] = this.selectedTenant;
                }
                break;
        }        
    }

});