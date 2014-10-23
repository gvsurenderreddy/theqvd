Wat.Views.AdminDetailsView = Wat.Views.DetailsView.extend({  
    setupCommonTemplateName: 'setup-common',
    setupOption: 'admins',
    secondaryContainer: '.bb-setup',
    qvdObj: 'admin',

    initialize: function (params) {
        this.model = new Wat.Models.Admin(params);
                
        this.setBreadCrumbs();
       
        // Clean previous item name
        this.breadcrumbs.next.next.next.screen="";
        
        
        this.params = params;
        
        this.renderSetupCommon();
    },
    
    render: function () {
        Wat.Views.DetailsView.prototype.render.apply(this);

        this.renderManagerRoles();
    },
    
    
    renderManagerRoles: function () {
        var inheritedRolesTemplate = Wat.A.getTemplate('details-admin-roles');
        // Fill the html with the template and the model
        this.template = _.template(
            inheritedRolesTemplate, {
                model: this.model
            }
        );
        $('.bb-admin-roles').html(this.template);

        var params = {
            'action': 'role_tiny_list',
            'selectedId': '',
            'controlName': 'role',
            'filters': {
            }
        };

        Wat.A.fillSelect(params);
        
        // Remove from inherited roles selector, current role and already inherited ones
        $('select[name="role"] option[value="' + this.elementId + '"]').remove();
 
        $.each(this.model.get('roles'), function (iRole, role) {
            $('select[name="role"] option[value="' + iRole + '"]').remove();
        });
        
        Wat.I.chosenConfiguration();
        
        // Hack to avoid delays
        setTimeout(function(){
            Wat.I.chosenElement('[name="role"]', 'advanced');
        }, 100);
    },    
    
    renderSetupCommon: function () {

        this.templateSetupCommon = Wat.A.getTemplate(this.setupCommonTemplateName);
        var cornerMenu = Wat.I.getCornerMenu();
        
        // Fill the html with the template and the model
        this.template = _.template(
            this.templateSetupCommon, {
                model: this.model,
                cid: this.cid,
                selectedOption: this.setupOption,
                setupMenu: cornerMenu.setup.subMenu
            }
        );
        
        $(this.el).html(this.template);
        
        this.printBreadcrumbs(this.breadcrumbs, '');

        // After render the side menu, embed the content of the view in secondary container
        this.embedContent();
    },
    
    embedContent: function () {
        $(this.secondaryContainer).html('<div class="bb-content-secondary"></div>');

        this.el = '.bb-content-secondary';
        Wat.Views.DetailsView.prototype.initialize.apply(this, [this.params]);
    },
    
    afterUpdateRoles: function () {
        this.render();
    },
    
    openEditElementDialog: function(e) {
        this.dialogConf.title = $.i18n.t('Edit Administrator') + ": " + this.model.get('name');
        
        Wat.Views.DetailsView.prototype.openEditElementDialog.apply(this, [e]);
        
        // Virtual machine form include a date time picker control, so we need enable it
        Wat.I.enableDataPickers();
                
        var params = {
            'action': 'role_tiny_list',
            'selectedId': '',
            'controlName': 'role',
            'filters': {
            }
        };

        Wat.A.fillSelect(params);
        
        $.each(this.model.get('roles'), function (iRole, role) {
            $('select[name="role"] option[value="' + iRole + '"]').remove();
        });
        
        Wat.I.chosenElement('[name="role"]', 'single100');
    },
    
    renderSide: function () {
        if (this.checkSide({'administrator.see.acl-list': '.js-side-component1'}) === false) {
            return;
        }
        
        var sideContainer = '.' + this.cid + ' .bb-details-side1';

        // Render ACLs list on side
        var params = {};
        params.whatRender = 'list';
        params.listContainer = sideContainer;
        params.forceListColumns = {name: true};
        // If Administrator has permission and more than one role assigned, show origin of ACLs
        if (Wat.C.checkACL('administrator.see.acl-list-roles')) {
            params.forceListColumns.roles = true;
        }
        params.forceSelectedActions = {};
        params.forceListActionButton = null;
        params.block = 10;
        params.filters = {"admin_id": this.elementId};
        params.action = 'get_acls_in_admins';
        
        this.sideView = new Wat.Views.ACLListView(params);
    },
    
    updateElement: function (dialog) {
        var valid = Wat.Views.DetailsView.prototype.updateElement.apply(this, [dialog]);
        
        if (!valid) {
            return;
        }
        
        var filters = {"id": this.id};
        var arguments = {};
        
        // If change password is checked
        if (context.find('input.js-change-password').is(':checked')) {
            var password = context.find('input[name="password"]').val();
            var password2 = context.find('input[name="password2"]').val();
            if (password && password2 && password == password2) {
                arguments['password'] = password;
            }
        }
        
        this.updateModel(arguments, filters, this.fetchDetails);
    },
    
    bindEditorEvents: function() {
        Wat.Views.DetailsView.prototype.bindEditorEvents.apply(this);
        
        // Toggle controls for new password
        this.bindEvent('change', 'input[name="change_password"]', this.vmEditorBinds.toggleNewPassword);
    },
    
    vmEditorBinds: {
        toggleNewPassword: function () {
            $('.new_password_row').toggle();
        }
    }
});