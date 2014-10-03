<div class="details-header">
    <span class="fa fa-suitcase h1" data-i18n><%= model.get('name') %></span>
    <a class="button button-right js-button-edit fa fa-pencil" href="javascript:" data-i18n>Edit</a>
</div>

<table class="details details-list col-width-100">
    <tr">
        <td><i class="fa fa-male"></i><span data-i18n>Id</span></td>
        <td>
            <%= model.get('id') %>
        </td>
    </tr>
    <tr>
        <td><i class="fa fa-building"></i><span data-i18n>Tenant</span></td>
        <td>
            <%= model.get('tenant_name') %>
        </td>
    </tr>
    <tr>
        <td><i class="fa fa-graduation-cap"></i><span data-i18n>Assigned roles</span></td>
        <td>
            <%
                $.each(model.get('roles'), function (iRole, role) {
            %>
                    <a href="#/setup/role/<%= iRole %>" data-i18n="[title]Click for details">
                        <span class="text"><%= role %></span>
                    </a>
            <%
                }); 
            %>  
        </td>
    </tr>
</table>