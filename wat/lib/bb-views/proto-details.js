Wat.Views.DetailsView = Wat.Views.MainView.extend({
    elementId: 0,
    detailsContainer: '.bb-details',
    sideContainer: '.bb-details-side',

    editorTemplateName: '',
    detailsTemplateName: '',
    detailsSideTemplateName: '',
    
    /*
    ** params:
    **  id (numeric): Id of the element which details will be shown
    */
    
    initialize: function (params) {
        Wat.Views.MainView.prototype.initialize.apply(this);

        this.elementId = params.id;
        
        // Define template names from qvd Object type
        this.editorTemplateName = 'editor-' + this.qvdObj,
        this.detailsTemplateName = 'details-' + this.qvdObj,
        this.detailsSideTemplateName = 'details-' + this.qvdObj + '-side',
        
        this.setBreadCrumbs();

        this.templateDetailsCommon = Wat.A.getTemplate('details-common');
        this.templateDetails = Wat.A.getTemplate(this.detailsTemplateName);
        this.template404 = Wat.A.getTemplate('404');

        this.fetchDetails();
        
        // Extend the common events
        this.extendEvents(this.eventsDetails);
    },
    
    setBreadCrumbs: function () {
        this.breadcrumbs = Wat.I.getDetailsBreadCrumbs(this.qvdObj);
    },
    
    afterRender: function () {
        // If this view have Side component, render it after render
        if (this.renderSide) {
            this.renderSide();
        }
    },
    
    fetchDetails: function (that) {
        var that = that || this;
        that.model.fetch({      
            complete: function () {
                that.render();
            }
        });
    },
    
    eventsDetails: {
        'click .js-button-edit': 'openEditElementDialog',
        'click .js-button-unblock': 'applyUnblock' ,
        'click .js-button-block': 'applyBlock', 
        'click .js-button-delete': 'askDelete' 
    },

    render: function () {        
        
        // If screen attribute of last breadcrumb is not defined, element wasnt found
        var lastScreen = undefined;
        var nextBread = this.breadcrumbs.next;
        while (1) {
            if (!nextBread.next) {
                lastScreen = nextBread.screen;
                break;
            }
            
            nextBread = nextBread.next;
        }
        
        // Add name of the model to breadcrumbs if not exist
        nextBread.screen = nextBread.screen || this.model.get('name');
        
        if (lastScreen === undefined) {
            this.template = _.template(
                this.template404, {
                }
            );

            $(this.el).html(this.template);
            
            nextBread.screen = '-';
            this.printBreadcrumbs(this.breadcrumbs, '');
        }
        else { 
            // Fill the html with the template and the model
            this.template = _.template(
                this.templateDetailsCommon, {
                    model: this.model,
                    enabledProperties: $.inArray(this.qvdObj, QVD_OBJS_WITH_PROPERTIES) != -1,
                    cid: this.cid
                }
            );

            $(this.el).html(this.template);
        
            this.printBreadcrumbs(this.breadcrumbs, '');

            this.template = _.template(
                this.templateDetails, {
                    model: this.model
                }
            );

            $(this.detailsContainer).html(this.template);
        }
        
        this.templateDetailsSide = Wat.A.getTemplate(this.detailsSideTemplateName);
        
        this.template = _.template(
            this.templateDetailsSide, {
                model: this.model
            }
        );
        
        $(this.sideContainer).html(this.template);
        
        Wat.T.translate();
    },
    
    applyBlock: function () {
        this.updateModel({blocked: 1}, {id: this.elementId}, this.fetchDetails);
    },   
    
    applyUnblock: function () {
        this.updateModel({blocked: 0}, {id: this.elementId}, this.fetchDetails);
    },  
    
    askDelete: function () {
        Wat.I.confirm('dialog-confirm-undone', this.applyDelete, this);
    },
        
    applyDelete: function (that) {
        that.deleteModel({id: that.elementId}, that.afterDelete, that.model);
    },
    
    afterDelete: function (that) {
        //Find the last link to rederect to it after deletion
        var lastLink = '';
        var crumb = that.breadcrumbs;
        while (1) {
            if (crumb.link != undefined) {
                lastLink = crumb.link;
                crumb = crumb.next;
            }
            else {
                break;
            }
        }
        
        window.location = lastLink;
    }
});
