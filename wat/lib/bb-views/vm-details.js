Wat.Views.VMDetailsView = Wat.Views.DetailsView.extend({  
    qvdObj: 'vm',
    liveFields: ['state', 'user_state', 'ip', 'host_id', 'host_name', 'ssh_port', 'vnc_port', 'serial_port', 'di_id_in_use', 'di_name_in_use', 'di_version_in_use'],

    relatedDoc: {
        image_update: "Images update guide"
    },
    
    initialize: function (params) {
        this.model = new Wat.Models.VM(params);
        Wat.Views.DetailsView.prototype.initialize.apply(this, [params]);
    },
    
    events: {
        'click .js-execution-params-button': 'showExecutionParams'
    },
    
    showExecutionParams: function () {
        $('.js-execution-params-button-row').hide();
        $('.js-execution-params').show();
    },
    
    openEditElementDialog: function(e) {
        this.dialogConf.title = $.i18n.t('Edit Virtual machine') + ": " + this.model.get('name');
        
        Wat.Views.DetailsView.prototype.openEditElementDialog.apply(this, [e]);
        
        // Virtual machine form include a date time picker control, so we need enable it
        Wat.I.enableDataPickers();
                
        var params = {
            'action': 'tag_tiny_list',
            'selectedId': this.model.get('di_tag'),
            'controlName': 'di_tag',
            'filters': {
                'osf_id': this.model.get('osf_id')
            },
            'nameAsId': true,
            'chosenType': 'single100'
        };

        Wat.A.fillSelect(params);
    },
    
    renderSide: function () {
        // No side rendered
        if (this.checkSide({'vm.see.state': '.js-side-component1', 'vm.see.log': '.js-side-component2'}) === false) {
            return;
        }
        
        var sideContainer = '.' + this.cid + ' .bb-details-side2';

        // Render Related log list on side
        var params = this.getSideLogParams(sideContainer);

        this.sideView = new Wat.Views.LogListView(params);
    },
    
    updateElement: function (dialog) {
        var valid = Wat.Views.DetailsView.prototype.updateElement.apply(this, [dialog]);
        
        if (!valid) {
            return;
        }
        
        // Properties to create, update and delete obtained from parent view
        var properties = this.properties;
        
        var context = $('.' + this.cid + '.editor-container');
        
        var name = context.find('input[name="name"]').val();
        var di_tag = context.find('select[name="di_tag"]').val(); 
        
        var filters = {"id": this.id};
        var arguments = {};
        
        if (Wat.C.checkACL('vm.update.name')) {
            arguments['name'] = name;
        }     
        
        if (Wat.C.checkACL('vm.update.di-tag')) {
            arguments['di_tag'] = di_tag;
        }
        
        if (properties.delete.length > 0 || !$.isEmptyObject(properties.set)) {
            arguments["__properties_changes__"] = properties;
        }
        
        if (Wat.C.checkACL('vm.update.expiration')) {
            // If expire is checked
            if (context.find('input.js-expire').is(':checked')) {
                var expiration_soft = context.find('input[name="expiration_soft"]').val();
                var expiration_hard = context.find('input[name="expiration_hard"]').val();

                if (expiration_soft != undefined) {
                    arguments['expiration_soft'] = expiration_soft;
                }

                if (expiration_hard != undefined) {
                    arguments['expiration_hard'] = expiration_hard;
                }
            }
            else {
                // Delete the expiration if exist
                arguments['expiration_soft'] = '';
                arguments['expiration_hard'] = '';
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
    },
    
    startVM: function () {
        var messages = {
            'success': 'Successfully required to be started',
            'error': 'Error starting Virtual machine'
        }
        
        Wat.A.performAction ('vm_start', {}, {id: this.elementId}, messages, function(){
            // After start/stop VM render side to update log
            Wat.CurrentView.renderSide();
        }, this);
    },
    
    stopVM: function () {
        var messages = {
            'success': 'Stop request successfully performed',
            'error': 'Error stopping Virtual machine'
        }
        
        Wat.A.performAction ('vm_stop', {}, {id: this.elementId}, messages, function(){
            // After start/stop VM render side to update log
            Wat.CurrentView.renderSide();
        }, this);
    },
    
    
    restartVM: function () {   
        Wat.CurrentView.restarting = true;
        Wat.stopVM();
    },  
});