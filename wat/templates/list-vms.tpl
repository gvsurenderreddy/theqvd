<table class="list">
    <thead>
        <tr>    
            <% 
                _.each(columns, function(col) {
                    if (col.display == false) {
                        return;
                    }
                    
                    switch(col.name) {
                        case 'checks':
            %>
                            <th class="max-1-icons">
                                <input type="checkbox" class="check_all">
                            </th>
            <%
                            break;
                        case 'info':
            %>
                            <th class="max-3-icons" data-i18n="Info">
                                <%= i18n.t('Info') %>
                            </th>
            <%
                            break;
                        case 'id':
            %>
                            <th class="sortable desktop col-width-8" data-sortby="id" data-i18n="Id">
                                <%= i18n.t('Id') %>
                            </th>
            <%
                            break;
                        case 'name':
            %>
                            <th class="sortable" data-sortby="name" data-i18n="Name">
                                <%= i18n.t('Name') %>
                            </th>
            <%
                            break;
                        case 'node':
            %>
                            <th class="sortable desktop" data-sortby="host_id" data-i18n="Node">
                                <%= i18n.t('Node') %>
                            </th>
            <%
                            break;
                        case 'user':
            %>
                            <th class="sortable desktop" data-sortby="user_name" data-i18n="User">
                                <%= i18n.t('User') %>
                            </th>
            <%
                            break;
                        case 'osf/tag':
            %>
                            <th class="sortable desktop" data-sortby="osf_name" data-i18n="OSF / Tag">
                                <%= i18n.t('OSF / Tag') %>
                            </th>
            <%
                            break;
                        case 'tag':
            %>
                            <th class="sortable desktop" data-sortby="di_tag" data-i18n="Tag">
                                <%= i18n.t('Tag') %>
                            </th>
            <%
                            break;
                        default:
            %>
                            <th class="sortable desktop" data-sortby="<%= col.name %>" data-i18n="<%= col.name %>">
                                <%= col.name %>
                            </th>
            <%
                            break;
                    }
                });
            %>
                
        </tr>
    </thead>
    <tbody>
        <% 
        if (models.length == 0) {
        %>  
            <tr>
                <td colspan="<%= columns.length %>">
                    <span class="no-elements" data-i18n="There are not elements">
                        <%= i18n.t('There are not elements') %>
                    </span>
                </td>
            </tr>
        <%
        }
        _.each(models, function(model) { %>
            <tr>
                <% 
                    _.each(columns, function(col) {
                        if (col.display == false) {
                            return;
                        }
                    
                        switch(col.name) {
                            case 'checks':
                %>
                                <td>
                                    <input type="checkbox" name="check_<%= model.get('id') %>" class="check-it js-check-it">
                                </td>
                <%
                                break;
                            case 'info':
                %>
                                <td>
                                    <%
                                    if (model.get('state') == 'stopped') {
                                    %>
                                        <i class="fa fa-pause icon-pause" title="Stopped Virtual machine" data-i18n="[title]Stopped"></i>
                                    <%
                                    }
                                    else {
                                    %>
                                        <i class="fa fa-play icon-play" data-i18n="[title]Running"></i>
                                    <%
                                    }
                                    if (model.get('blocked')) {
                                    %>
                                        <!--<i class="fa fa-warning icon-warning"></i>-->
                                        <i class="fa fa-lock" data-i18n="[title]Blocked"></i>
                                    <%
                                    }
                                    %>
                                </td>
                <%
                                break;
                            case 'id':
                %>
                                <td class="desktop">
                                    <%= model.get('id') %>
                                </td>
                <%
                                break;
                            case 'name':
                %>
                                <td>
                                    <a href="#/vm/<%= model.get('id') %>" data-i18n="[title]Click for details">
                                        <i class="fa fa-search"></i>
                                        <%= model.get('name') %>
                                    </a>
                                </td>
                <%
                                break;
                            case 'node':
                %>
                                <td class="desktop">
                                    <a href="#">
                                        <%= model.get('host_name') %>
                                    </a>
                                </td>
                <%
                                break;
                            case 'user':
                %>
                                <td class="desktop">
                                    <a href="#/user/<%= model.get('user_id') %>">
                                        <%= model.get('user_name') %>
                                    </a>
                                </td>
                <%
                                break;
                            case 'osf/tag':
                %>
                                <td class="desktop">
                                    <a href="#/osf/<%= model.get('osf_id') %>">
                                        <%= model.get('osf_name') %>
                                    </a>
                                    <div class="second_row">
                                        <%= model.get('di_tag') %>
                                    </div>
                                </td>
                <%
                                break;
                            case 'tag':
                %>
                                <td class="desktop">
                                    <%= model.get('di_tag') %>
                                </td>
                <%
                                break;
                            default:
                %>
                                <td class="desktop">
                                    <%= model.get(col.name) %>
                                </td>
                <%
                                break;
                        }
                    });
                %>

            </tr>
        <% }); %>
    </tbody>
</table>