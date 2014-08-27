Wat.Views.UserListView = Wat.Views.ListView.extend({
    shortName: 'user',
    listTemplateName: 'list-users',
    editorTemplateName: 'creator-user',
    
    breadcrumbs: {
        'screen': 'Home',
        'link': '#/home',
        'next': {
            'screen': 'User list'
        }
    },

    initialize: function (params) {
        this.collection = new Wat.Collections.Users(params);
        
        Wat.Views.ListView.prototype.initialize.apply(this, [params]);
    },
        
    // This events will be added to view events
    listEvents: {
        
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
                'value': 'disconnect_all',
                'text': 'Disconnect from all VMs'
            },
            {
                'value': 'delete',
                'text': 'Delete'
            }
        ];
    },
    
    setListActionButton: function () {
        this.listActionButton = {
            'name': 'new_user_button',
            'value': 'New User',
            'link': 'javascript:'
        }
    },
    
    openNewElementDialog: function (e) {
        this.model = new Wat.Models.User();
        this.dialogConf.title = $.i18n.t('New user');
        Wat.Views.ListView.prototype.openNewElementDialog.apply(this, [e]);
    },
    
    createElement: function () {
        Wat.Views.ListView.prototype.createElement.apply(this);
        
        // Properties to create, update and delete obtained from parent view
        var properties = this.properties;
                
        var context = $('.' + this.cid + '.editor-container');

        var blocked = context.find('input[name="blocked"][value=1]').is(':checked');
        
        var arguments = {
            "properties" : properties.create,
            "blocked": blocked ? 1 : 0
        };
        
        var name = context.find('input[name="name"]').val();
        if (!name) {
            console.error('name empty');
        }
        else {
            arguments["name"] = name;
        }
        
        var password = context.find('input[name="password"]').val();
        var password2 = context.find('input[name="password2"]').val();
        if (!password || !password2) {
            console.error('password empty');
        }
        else if (password != password2) {
            console.error('password missmatch');
        }
        else {
            arguments['password'] = password;
        }
                        
        this.createModel(arguments);
    }
});