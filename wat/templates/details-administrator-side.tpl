<div class="side-component js-side-component1">
    <div class="side-header">
        <span class="h2" data-i18n="ACLs tree"></span>
    </div>
    <div class="bb-details-side1">
        <div class="mini-loading"><i class="fa fa-gear fa-spin"></i></div>
    </div>
</div>

<div class="side-component js-side-component2">
    <div class="side-header">
        <span class="h2" data-i18n="Log"></span>
        <% if (Wat.C.checkACL('log.see-main.')) { %>
        <a class="button2 button-right fa fa-arrows-h" href="#/log/object/<%= Wat.CurrentView.qvdObj %>-<%= model.get('id') %>" data-i18n="Extended view"></a>
        <% } %>
    </div>
    <div class="bb-details-side2">
        <div class="mini-loading"><i class="fa fa-gear fa-spin"></i></div>
    </div>
</div>