<div class="details-header">
    <span class="fa fa-dot-circle-o h1" data-i18n><%= model.get('disk_image') %></span>
    <a class="button button-right js-button-edit fa fa-pencil" href="javascript:" data-i18n>Edit</a>
</div>

<table class="details details-list">
    <tr>
        <td data-i18n>Id</td>
        <td>
            <%= model.get('id') %>
        </td>
    </tr>
    <tr>
        <td data-i18n>OS Flavour</td>
        <td>
            <a href="#/osf/<%= model.get('osf_id') %>">
                <%= model.get('osf_name') %>
            </a>
        </td>
    </tr>
    <tr>
        <td data-i18n>Blocking</td>
        <td>
            <% 
            if (model.get('blocked')) {
            %>
                <i class="fa fa-lock" data-i18n="[title]Blocked"></i>
            <%
            }
            else {
            %>
                <i class="fa fa-unlock" data-i18n="[title]Unblocked"></i>
            <%
            }
            %>
        </td>
    </tr>
    
    <%
        if (model.get('default')) {
    %>
            <tr>
                <td>
                    <span data-i18n>Default</span>
                </td>
                <td>
                    <i class="fa fa-home"></i>
                </td>
            </tr>
    
    <%
        }
    %>
            
    <%
        if (model.get('head')) {
    %>
           <tr> 
                <td>
                    <span data-i18n>Head</span>
                </td>
                <td>
                    <i class="fa fa-flag-o"></i>
                    <div>
                        <div class="second_row" data-i18n="Last image created on this OSF"></div>
                    </div>
                </td>
            </tr>
    
    <%
        }
    %>
    
    <tr>
        <td data-i18n>Tags</td>
        <td>
        <%
            if (!model.get('tags')) {
        %>
                <span class="no-elements" data-i18n="There are not tags"></span>
        <%
            }
        %>
            <ul class="tags">
                <%
                if (model.get('tags')) {
                    $(model.get('tags').split(',')).each( function (index, tag) {
                %>
                        <li class="fa fa-tag"><%= tag %></li>
                <%
                    });
                }
                %>
            </ul>
        </td>
    </tr>
</table>