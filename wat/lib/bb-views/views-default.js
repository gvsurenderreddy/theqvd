Wat.Views.SetupCustomizeView = Wat.Views.ViewsView.extend({
    setupOption: 'customize',
    qvdObj: 'views',

    limitByACLs: false,
    
    setAction: 'tenant_view_set',
    
    viewKind: 'tenant',

    breadcrumbs: {
        'screen': 'Home',
        'link': '#',
        'next': {
            'screen': 'WAT Management',
            'next': {
                'screen': 'Default views'
            }
        }
    },
    
    initialize: function (params) {
        Wat.Views.ViewsView.prototype.initialize.apply(this, [params]);
                
        // Get side menu
        var cornerMenu = Wat.I.getCornerMenu();
        this.sideMenu = null;
        
        this.render();
    },
    
    renderForm: function () {
        // Get filters and columns
        Wat.I.storeTenantFormFilters (this.selectedSection, this.selectedTenant, this);
        Wat.I.storeTenantListColumns (this.selectedSection, this.selectedTenant, this);
        
        Wat.Views.ViewsView.prototype.renderForm.apply(this);
    }
});