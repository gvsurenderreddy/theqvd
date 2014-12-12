<table>
    <% if (Wat.C.checkACL('tenant.update.name')) { %>
    <tr>
        <td data-i18n="Name"></td>
        <td>
            <input type="text" class="" name="name" value="<%= model.get('name') %>" data-required>
        </td>
    </tr>
    <% } %>
    <% if (Wat.C.checkACL('tenant.update.language')) { %>
    <tr>
        <td data-i18n="Language"></td>
        <td>
            <select class="" name="language">
                <%
                    $.each(WAT_LANGUAGE_TENANT_OPTIONS, function (lanCode, lanText) {
                        var selected = '';
                        if (lanCode == model.get('language')) {
                            selected = 'selected="selected"';
                        }
                %>
                        <option <%= selected %> value="<%= lanCode %>" data-i18n="<%= lanText %>"></option>
                <%
                    });
                %>
            </select>
        </td>
    </tr>
    <% } %>
 </table>