Wat.Views.NodeListView = Wat.Views.ListView.extend({
    listTemplateName: 'list-nodes',
    editorTemplateName: 'creator-node',
    
    breadcrumbs: {
        'screen': 'Home',
        'link': '#/home',
        'next': {
            'screen': 'Node list'
        }
    },
    
    formFilters: [
        {
            'name': 'name',
            'filterField': 'name',
            'type': 'text',
            'label': 'Search by name',
            'mobile': true
        },
        {
            'name': 'vm',
            'filterField': 'vm_id',
            'type': 'select',
            'label': 'Virtual machine',
            'class': 'chosen-advanced',
            'fillable': true,
            'options': [
                {
                    'value': -1,
                    'text': 'All',
                    'selected': true
                }
                        ]
        }
    ],

    initialize: function (params) { 
        this.collection = new Wat.Collections.Nodes(params);
        
        this.setColumns();
        this.setSelectedActions();
        this.setListActionButton();
        
        this.extendEvents(this.eventsNodes);

        Wat.Views.ListView.prototype.initialize.apply(this, [params]);
    },
    
    eventsNodes: {

    },
    
    setColumns: function () {
        this.columns = [
            {
                'name': 'checks',
                'display': true
            },
            {
                'name': 'info',
                'display': true
            },
            {
                'name': 'id',
                'display': true
            },
            {
                'name': 'name',
                'display': true
            },
            {
                'name': 'state',
                'display': false
            },
            {
                'name': 'address',
                'display': true
            },
            {
                'name': 'vms_connected',
                'display': true
            },
            {
                'name': 'Cosa',
                'display': true
            }
        ];
    },
    
    setSelectedActions: function () {
        this.selectedActions = [
            {
                'value': 'block',
                'text': 'Block'
            },
            {
                'value': 'unblock',
                'text': 'Unblock'
            },
            {
                'value': 'stop_all',
                'text': 'Stop all VMs'
            },
            {
                'value': 'delete',
                'text': 'Delete'
            }
        ];
    },
    
    setListActionButton: function () {
        this.listActionButton = {
            'name': 'new_node_button',
            'value': 'New Node',
            'link': 'javascript:'
        }
    },
    
    newElement: function (e) {
        this.model = new Wat.Models.Node();
        this.dialogConf.title = $.i18n.t('New node');
        
        Wat.Views.ListView.prototype.newElement.apply(this, [e]);
    }
});