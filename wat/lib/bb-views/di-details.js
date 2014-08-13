Wat.Views.DIDetailsView = Wat.Views.DetailsView.extend({
    editorTemplateName: 'editor-di',
    detailsTemplateName: 'details-di',
    detailsSideTemplateName: 'details-di-side',
    sideContainer: '.bb-details-side',
    
    breadcrumbs: {
        'screen': 'Home',
        'link': '#/home',
        'next': {
            'screen': 'DI list',
            'link': '#/dis',
            'next': {
                'screen': ''
            }
        }
    },
    
    initialize: function (params) {
        this.model = new Wat.Models.DI(params);
        Wat.Views.DetailsView.prototype.initialize.apply(this, [params]);
        
        this.renderSide();
    },
    
    renderSide: function () {
        var slideContainer = '.' + this.cid + ' .bb-details-side1';
        
        // Render Virtual Machines list on side
        var params = {};
        params.whatRender = 'list';
        params.listContainer = slideContainer;
        params.forceListColumns = {name: true, tag: true};
        params.forceSelectedActions = {};
        params.forceListActionButton = null;
        params.block = 5;
        params.filters = {"di_id": this.elementId};
        
        this.sideView = new Wat.Views.VMListView(params);
    },
    
    updateElement: function (dialog) {
        Wat.Views.DetailsView.prototype.updateElement.apply(this, [dialog]);
        
        // Properties to create, update and delete obtained from parent view
        var properties = this.properties;
        
        var arguments = {'properties' : properties};
        
        var context = $('.' + this.cid + '.editor-container');
        
        var name = context.find('input[name="name"]').val();
        
        arguments['name'] = name;
        
        var filters = {"id": this.id};
        
        var tags = context.find('input[name="tags"]').val();
        
        arguments['tags'] = tags
            
        console.log(arguments);
        return;
        var result = Wat.A.performAction('update_di', filters, arguments);

        if (result.status == SUCCESS) {
            this.fetchDetails();
            this.renderSide();

            this.message = 'Successfully updated';
            this.messageType = 'success';
        }
        else {
            this.message = 'Error updating';
            this.messageType = 'error';
        }
        
        dialog.dialog('close');
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
    
    editElement: function(e) {
        this.dialogConf.title = $.i18n.t('Disk image') + ": " + this.model.get('name');
        
        Wat.Views.DetailsView.prototype.editElement.apply(this, [e]);
    },
    
    bindEditorEvents: function() {
        Wat.Views.DetailsView.prototype.bindEditorEvents.apply(this);
    }
});