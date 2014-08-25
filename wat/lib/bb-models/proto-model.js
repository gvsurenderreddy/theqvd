Wat.Models.Model = Backbone.Model.extend({
    defaults: {},
    id: 0,
    url: "",
    detailsView: false,
    operation: '',
    
    parse: function(response) {
            if (this.detailsView) {
                return response.result.rows[0];
            }
            else {
                return response;
            }
    },
    
    initialize: function (params) {
        if (params !== undefined) {
            this.id = params.id;
        }
    },
    
    getDetailsUrl: function () {
        return Wat.C.getBaseUrl() + 
            "&action=" + this.actionPrefix + "_get_details" + 
            "&filters={\"id\":" + this.id + "}";
    },
    
    setOperation: function (operation) {
        switch (operation) {
            case 'create':
                this.operation = this.actionPrefix + "_create";
                break;
            case 'update':
                this.operation = this.actionPrefix + "_update_custom";
                break;
            case 'delete':
                this.operation = this.actionPrefix + "_delete";
                break;
        }
    },
    
    sync: function(method, model, options) {
        this.detailsView = true;
        
        var that = this;
        var params = _.extend({
            type: 'POST',
            dataType: 'json',
            url: that.getDetailsUrl(),
            processData: false
        }, options);
        
        return $.ajax(params);
    },
    
    save: function(attributes, options) {        
        options = {
            url: Wat.C.getBaseUrl() + 
                "&action=" + this.operation +
                "&filters=" + JSON.stringify(options.filters) + 
                "&arguments=" + JSON.stringify(attributes)
        };
        
        return Backbone.Model.prototype.save.call(this, attributes, options);
    }
});