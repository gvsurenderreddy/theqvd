<table>
    <% 
    if (Wat.C.checkACL('user.update.password')) { 
    %>
        <tr>
            <td data-i18n="Change password"></td>
            <td>
                <input type="checkbox" class="js-change-password" name="change_password" value="1">
            </td>
        </tr>
        <tr class="hidden new_password_row">
            <td data-i18n="New password"></td>
            <td>
                <input type="password" name="password" value="" data-required data-equal="password">
            </td>
        </tr>
        <tr class="hidden new_password_row">
            <td data-i18n="Re-type new password"></td>
            <td>
                <input type="password" name="password2" value="" data-required data-equal="password">
            </td>
        </tr>
    <% 
    } 
    %>
 </table>