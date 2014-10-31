<div class="customize-options js-customize-options">
<div class="js-customize-columns customize-columns customize-block">
    <span class="h1" data-i18n="Columns"></span>
    <table class="customize-fields">
        <tr>
            <th class="center max-1-icons" data-i18n="[title]A column in list view"><i class="fa fa-columns auto"></i></th>
            <th data-i18n="Column"></th>
        </tr>
        <%
        $.each(columns, function(fName, field) {
                if (field.fixed) {
                    return;
                }
                
                if (limitByACLs) {                        
                    if (field.groupAcls) {
                        if (!Wat.C.checkGroupACL(field.groupAcls)) {
                            return;
                        }
                    }
                    else if (field.acls) {
                        if (!Wat.C.checkACL(field.acls)) {
                            return;
                        }
                    }
                }
        %>  
                <tr class="<%= field.property ? 'js-is-property' : '' %>" data-name="<%= fName %>">
                    <td class="center">
                        <div class="js-field-check" data-name="<%= fName %>" data-fields="<%= field.fields.join(',') %>">
                            <%= Wat.I.controls.CheckBox({checked: field.display}) %>
                        </div>
                    </td>
                    <td>
        <%


                if (field.property) {
        %>
                    <span class="second_row"><span data-i18n="Property"></span>:</span>
        <%
                }

                if (field.noTranslatable) {
        %>  
                    <span>
                        <%= field.text %>
                    </span>
        <%
                }
                else {
        %>
                    <span data-i18n="<%= field.text %>">
                        <%= i18n.t(field.text) %>
                    </span>
        <%
                }
        %>
                    </td>
                </tr>
        <%
        });
        %>
            <tr class="js-is-property js-column-property-template hidden" data-name="">
                <td class="center">
                    <div class="js-field-check" data-name="" data-fields="">
                        <%= Wat.I.controls.CheckBox({checked: false}) %>
                    </div>
                </td>
                <td>
                    <span class="second_row"><span data-i18n="Property"></span>:</span>

                    <span class="js-prop-name">
                    </span>
                </td>
            </tr>
    </table>
</div>
<div class="js-customize-filters customize-filters customize-block">
    <span class="h1" data-i18n="Filters"></span>
    <table class="customize-fields">
        <tr>
            <th class="center max-1-icons" data-i18n="[title]Desktop version"><i class="fa fa-desktop auto"></i></th>
            <th class="center max-1-icons" data-i18n="[title]Mobile version"><i class="fa fa-mobile auto"></i></th>
            <th data-i18n="Filter control"></th>
        </tr>
        <%
        $.each(filters, function(fName, filter) {
                if (filter.fixed) {
                    return;
                }
                
                if (limitByACLs) {
                    if (filter.groupAcls) {
                        if (!Wat.C.checkGroupACL(filter.groupAcls)) {
                            return;
                        }
                    }
                    else if (filter.acls) {
                        if (!Wat.C.checkACL(filter.acls)) {
                            return;
                        }
                    }
                }
        %>  
                <tr class="<%= filter.property ? 'js-is-property' : '' %>" data-name="<%= fName %>">
                    <td class="center">
                        <div  data-name="<%= fName %>" data-field="<%= filter.filterField %>" class="js-desktop-fields">
                            <%= Wat.I.controls.CheckBox({checked: filter.displayDesktop}) %>
                        </div>
                    </td>                    
                    <td class="center">
                        <div data-name="<%= fName %>" data-field="<%= filter.filterField %>" class="js-mobile-fields">
                            <%= Wat.I.controls.CheckBox({checked: filter.displayMobile}) %>
                        </div>
                    </td>
                    <td>
        <%

                if (filter.property) {
        %>
                    <span class="second_row"><span data-i18n="Property"></span>:</span>
        <%
                }

                if (filter.noTranslatable) {
        %>  
                    <span>
                        <%= filter.text %>
                    </span>
        <%
                }
                else {
        %>
                    <span data-i18n="<%=filter.text%>">
                        <%= i18n.t(filter.text) %>
                    </span>
        <%
                }

                filterType = Wat.I.getFieldTypeName(filter.type);
        %>
                    <div class="second_row" data-i18n="<%= filterType %>"><%= i18n.t(filterType) %></div>
                    </td>
                </tr>
        <%
        });
        %>
            <tr class="js-is-property js-filter-property-template hidden" data-name="">
                <td class="center">
                    <div class="js-desktop-fields" data-name="" data-fields="">
                        <%= Wat.I.controls.CheckBox({checked: false}) %>
                    </div>
                </td>
                <td class="center">
                    <div class="js-mobile-fields" data-name="" data-field="">
                        <%= Wat.I.controls.CheckBox({checked: false}) %>
                    </div>
                </td>
                <td>
                    <span class="second_row"><span data-i18n="Property"></span>:</span>
                    
                    <span class="js-prop-name">
                    </span>
                    
                    <div class="second_row" data-i18n="Text input"><%= i18n.t('Text input') %></div>
                </td>
            </tr>
    </table>
</div>
</div>