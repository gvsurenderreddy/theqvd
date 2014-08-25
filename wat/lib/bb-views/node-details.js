Wat.Views.NodeDetailsView = Wat.Views.DetailsView.extend({
    editorTemplateName: 'editor-node',
    detailsTemplateName: 'details-node',
    detailsSideTemplateName: 'details-node-side',
    sideContainer: '.bb-details-side',
    
    breadcrumbs: {
        'screen': 'Home',
        'link': '#/home',
        'next': {
            'screen': 'Node list',
            'link': '#/nodes',
            'next': {
                'screen': ''
            }
        }
    },

    initialize: function (params) {
        this.model = new Wat.Models.Node(params);
        Wat.Views.DetailsView.prototype.initialize.apply(this, [params]);
    },
    
    renderSide: function () {
        var sideContainer = '.' + this.cid + ' .bb-details-side1';
        
        // Render Virtual Machines list on side
        var params = {};
        params.whatRender = 'list';
        params.listContainer = sideContainer;
        params.forceListColumns = {checks: true, info: true, name: true};
        params.forceSelectedActions = {disconnect: true};
        params.forceListActionButton = null;
        params.block = 5;
        params.filters = {"host_id": this.elementId};
        
        this.sideView = new Wat.Views.VMListView(params);
    },
    
    updateElement: function (dialog) {
        Wat.Views.DetailsView.prototype.updateElement.apply(this, [dialog]);
        
        // Properties to create, update and delete obtained from parent view
        var properties = this.properties;
                
        var context = $('.' + this.cid + '.editor-container');
        
        var name = context.find('input[name="name"]').val();
        var address = context.find('input[name="address"]').val();
        var blocked = context.find('input[name="blocked"][value=1]').is(':checked');
        
        var filters = {"id": this.id};
        var arguments = {
            "properties": properties,
            "name": name,
            "address": address,
            "blocked": blocked ? 1 : 0
        }

        this.updateModel(arguments, filters, this.fetchDetails);
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
    
    openEditElementDialog: function() {
        this.dialogConf.title = $.i18n.t('Edit node') + ": " + this.model.get('name');
        
        Wat.Views.DetailsView.prototype.openEditElementDialog.apply(this);
    },
    
    bindEditorEvents: function() {
        Wat.Views.DetailsView.prototype.bindEditorEvents.apply(this);
    }
});