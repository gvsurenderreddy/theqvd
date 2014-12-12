<div class="details-header">
    <span class="<%= CLASS_ICON_TENANTS %> h1"><%= model.get('name') %></span>
    <% if(Wat.C.checkACL('tenant.delete.')) { %>
    <a class="button fleft button-icon js-button-delete fa fa-trash" href="javascript:" data-i18n="[title]Delete"></a>
    <% } %>
    <% if(Wat.C.checkGroupACL('tenantEdit')) { %>
    <a class="button fright button-icon js-button-edit fa fa-pencil" href="javascript:" data-i18n="[title]Edit"></a>
    <% } %>
</div>

<% 
if (Wat.C.checkACL('tenant.see.language')) { 
%>
    <table class="details details-list col-width-100">
        <tr>
            <td><i class="fa fa-globe"></i><span data-i18n="Language"></span></td>
            <td>
                <span data-i18n="<%= WAT_LANGUAGE_TENANT_OPTIONS[model.get('language')] %>"></span>
                <%
                switch (model.get('language')) {
                    case  'auto':
                %>
                        <div class="second_row" data-i18n="Language will be detected from the browser"></div>
                <%
                        break;
                }
                %>
            </td>
        </tr>
    </table>
<% 
} 
%>
