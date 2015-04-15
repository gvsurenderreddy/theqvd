Wat.Collections.Collection = Backbone.Collection.extend({
    model: {},
    elementsTotal: 0,
    status: 0,
    offset: 1,

    filters: {},
    // Order by id by default
    sort: {"field": "id", "order": "-desc"},
    
    initialize: function (params) {
        params = params || {};
        
        this.block = params.block || Wat.C.getBlock();
        this.offset = params.offset || this.offset;
        this.filters = params.filters || this.filters;
        this.action = params.action || this.actionPrefix + '_get_list';
        this.sort = params.sort || this.sort;
    },
    
    getListUrl: function () {
        var fullUrl = Wat.C.getBaseUrl()  + 
            "&action=" + this.action +
            "&offset=" + this.offset + 
            "&block=" + this.block + 
            "&filters=" + JSON.stringify(this.filters) + 
            "&order_by=" + JSON.stringify(this.sort);

        return fullUrl;
    },
    
    setFilters: function (filters) {
        this.filters = filters;
    }, 
        
    deleteFilter: function (filterDelete) {
        delete this.filters[filterDelete];
    }, 
    
    setSort: function (sort) {
        this.sort = sort;
    },

    parse: function(response) {
        if (Wat.C.sessionExpired(response)) {
            return;
        }
        
        this.status = response.status;
        this.elementsTotal = response.total || 0;
        return response.rows;
    },

    sync: function(method, model, options) {
        var that = this;
        
        var params = _.extend({
            type: 'POST',
            dataType: 'json',
            url: that.getListUrl(),
            processData: false
        }, options);
        
        return $.ajax(params);
    }
});