<table class="list details-list acls-management acls-management-inherit-roles col-width-100">  
    <tr>
        <th colspan="2">
            <span data-i18n>Roles whose ACLs will be inherited</span>
        </th>
    </tr>   
    <tr>
        <td colspan="2">
            <table class="roles-inherit-table">
                <tr>
                    <td>
                        <span data-i18n>Select a role to be inerithed</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <select name="role"></select>
                        <a class="button add-role-button js-add-role-button fa fa-sitemap" href="javascript:" data-i18n>Inherit</a>
                    </td>
                </tr>
                <%
                    if (Object.keys(model.get('roles')).length > 0) {
                %>
                <tr>
                    <td>
                        <span data-i18n>Inherited roles</span>
                    </td>
                </tr>
                <%
                    }
                %>
                <tr>
                    <td>
                        <%
                            $.each(model.get('roles'), function (iRole, role) {
                        %>
                                <div class="inherited-role-wrapper">
                                    <table class="list inherited-role-table">
                                        <tr>
                                            <th>
                                                <a href="#/setup/role/<%= iRole %>" data-i18n="[title]Click for details">
                                                    <span class="text"><%= role.name %></span>
                                                </a>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="role-acls-wrapper">
                                            <%
                                                if(role.acls.length > 0) {
                                            %>
                                                    <table class="list inherited-role-table">
                                            <%
                                                    $.each(role.acls, function (iACL, acl) {
                                                        var disabledAttr = '';
                                                        $.each(model.get('acls').negative, function (negativeIACL, negativeACL) {
                                                            if (acl == negativeACL) {
                                                                disabledAttr = 'data-disabled';
                                                                return false;
                                                            }
                                                        });
                                            %>
                                                        <tr>
                                                            <td <%= disabledAttr %>>
                                                                <span class="text"><%= acl %></span>
                                                            </td>
                                                        </tr>
                                            <%
                                                    });
                                            %>
                                                    </table>
                                            <%
                                                }
                                                else {
                                            %>
                                                    <span class="text" data-i18n>Empty</span>
                                            <%
                                                }
                                            %>  
                                                </div>                                    
                                                <a class="button2 button-under-floating-box delete-role-button js-delete-role-button fa fa-trash-o" href="javascript:" data-id="<%= iRole %>" data-i18n>Delete</a>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                    
                        <%
                            }); 
                        %>  
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>