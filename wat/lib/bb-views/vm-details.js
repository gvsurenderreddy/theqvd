Wat.Views.VMDetailsView = Wat.Views.DetailsView.extend({  
    qvdObj: 'vm',
    editorTemplateName: 'editor-vm',
    detailsTemplateName: 'details-vm',
    detailsSideTemplateName: 'details-vm-side',
    sideContainer: '.bb-details-side',
    
    initialize: function (params) {
        this.model = new Wat.Models.VM(params);
        Wat.Views.DetailsView.prototype.initialize.apply(this, [params]);
    },
    
    render: function () {
        // Add name of the model to breadcrumbs
        this.breadcrumbs.next.next.screen = this.model.get('name');
        
        Wat.Views.DetailsView.prototype.render.apply(this);
        
        this.templateDetailsSide = Wat.A.getTemplate(this.detailsSideTemplateName);
        
        this.template = _.template(
            this.templateDetailsSide, {
                model: this.model
            }
        );
        
        $(this.sideContainer).html(this.template);
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
            'nameAsId': true
        };

        Wat.A.fillSelect(params);
        
        Wat.I.chosenElement('[name="di_tag"]', 'single100');
    },
    
    updateElement: function (dialog) {
        Wat.Views.DetailsView.prototype.updateElement.apply(this, [dialog]);
        
        // Properties to create, update and delete obtained from parent view
        var properties = this.properties;
        
        var arguments = {'properties' : properties};
        
        var context = $('.' + this.cid + '.editor-container');
        
        var name = context.find('input[name="name"]').val();
        var di_tag = context.find('select[name="di_tag"]').val(); 
        var blocked = context.find('input[name="blocked"][value=1]').is(':checked');
        
        var filters = {"id": this.id};
        var arguments = {
            "properties": properties,
            "name": name,
            "di_tag": di_tag,
            "blocked": blocked ? 1 : 0
        };
        
        // If expire is checked
        if (context.find('input.js-expire').is(':checked')) {
            var expiration_soft = context.find('input[name="expiration_soft"]').val();
            var expiration_hard = context.find('input[name="expiration_hard"]').val();
            
            if (!expiration_soft) {
                console.error('undefined soft expiration');
            }
            else {
                arguments['expiration_soft'] = expiration_soft;
            }
            
            if (!expiration_hard) {
                console.error('undefined hard expiration');
            }
            else {
                arguments['expiration_hard'] = expiration_hard;
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