<div class="details-header">
    <span class="fa fa-cloud h1"><%= model.get('name') %></span>
    <% if(Wat.C.checkACL('vm.delete.')) { %>
    <a class="button fleft button-icon js-button-delete fa fa-trash" href="javascript:" data-i18n="[title]Delete"></a>
    <% } %>
    
    <% if(Wat.C.checkGroupACL('vmEdit')) { %>
    <a class="button fright button-icon js-button-edit fa fa-pencil" href="javascript:" data-i18n="[title]Edit"></a>
    <% } %>
    
    <% 
    if (Wat.C.checkACL('vm.update.state')) {
        if (model.get('state') != 'stopped') { 
    %>
            <a class="button fright button-icon js-button-stop-vm fa fa-stop fright" href="javascript:" data-i18n="[title]Stop" data-wsupdate="state-button" data-id="<%= model.get('id') %>"></a>
    <% 
        }
        else { 
    %>
            <a class="button fright button-icon js-button-start-vm fa fa-play fright" href="javascript:" data-i18n="[title]Start" data-wsupdate="state-button" data-id="<%= model.get('id') %>"></a>
    <% 
        }
    } 
    %>
    
    <% 
    if (Wat.C.checkACL('vm.update.block')) {
        if(model.get('blocked')) {
    %>
            <a class="button button-icon js-button-unblock fa fa-unlock fright" href="javascript:" data-i18n="[title]Unblock"></a>
    <%
        } 
        else { 
    %>
            <a class="button button-icon js-button-block fa fa-lock fright" href="javascript:" data-i18n="[title]Block"></a>
    <%
        }
    }
    %>
    
    <% 
    if (Wat.C.checkACL('vm.update.disconnect-user') && model.get('user_state') == 'connected') {
    %>
        <a class="button button-icon js-button-disconnect-user fa fa-plug fright" href="javascript:" data-i18n="[title]Disconnect user"></a>
    <%
    }
    %>  
    
</div>

<% 
var runningStyle = 'display: none;';
var stoppedStyle = 'display: none;';
var startingStyle = 'display: none;';
var stoppingStyle = 'display: none;';

switch (model.get('state')) {
    case 'running':
        var runningStyle = '';
        break;
    case 'stopped':
        var stoppedStyle = '';
        break;
    case 'starting':
        var startingStyle = '';
        break;
    case 'stopping':
        var stoppingStyle = '';
        break;
}
%>          

<table class="details details-list details-right">
    <tbody class="js-body-state" data-wsupdate="state-running" data-id="<%= model.get('id') %>" style="<%= runningStyle %>">
        <%
        if (Wat.C.checkACL('vm.see.host')) {
            var hostHtml = Wat.C.ifACL('<a href="#/host/' + model.get('host_id') + '">', 'host.see-details.') + model.get('host_name') + Wat.C.ifACL('</a>', 'host.see-details.');
        %>
            <tr>
                <td colspan=2 class="center" data-wsupdate="host" data-id="<%= model.get('id') %>"><i class="fa fa-play"></i><%= i18n.t('Running at __node__', {'node': hostHtml}) %></td>
            </tr>
        <%
        }
        else { 
        %>
            <tr>
                <td colspan=2 class="center"><i class="fa fa-play"></i><span data-i18n="Running"></span></td>
            </tr>
        <%
        }
        %>
        <tr class="js-execution-params-button-row">
            <td colspan=2><a class="fa fa-eye button2 col-width-100 center js-execution-params-button" href="javascript:" data-i18n="See execution parameters"></a></td>
        </tr>
        <%
        if (Wat.C.checkACL('vm.see.host')) { 
        %>
            <tr class="js-execution-params execution-params">
                <td><i class="<%= CLASS_ICON_HOSTS %>"></i><span data-i18n="Node"></span></td>
                <td data-wsupdate="host" data-id="<%= model.get('id') %>">
                    <%= hostHtml %>
                </td>
            </tr>
        <%
        }
        if (Wat.C.checkACL('vm.see.ip')) { 
        %>
            <tr class="js-execution-params execution-params">
                <td><i class="fa fa-ellipsis-h"></i><span data-i18n="IP address"></span></td>
                <td class="col-width-100" data-wsupdate="ip" data-id="<%= model.get('id') %>">
                    <%= model.get('ip') %>
                </td>
            </tr>
        <%
        }
        if (Wat.C.checkACL('vm.see.di')) { 
        %>
            <tr class="js-execution-params execution-params">
                <td><i class="<%= CLASS_ICON_DIS %>"></i><span data-i18n="Disk image"></span></td>
                <td>
                    <a href="#/di/<%= model.get('di_id_in_use') %>">
                        <%= model.get('di_name_in_use') %>
                    </a>
                </td>
            </tr>
        <% 
        }
        if (Wat.C.checkACL('vm.see.user-state')) { 
        %>
            <tr class="js-execution-params execution-params">
                <td><i class="fa fa-plug"></i><span data-i18n="User state"></span></td>
                <td>
                    <% 
                    if (model.get('user_state') == 'connected') {
                    %>
                        <span data-i18n data-wsupdate="user_state-text" data-id="<%= model.get('id') %>">Connected</span>
                    <%
                    }
                    else {
                    %>
                        <span data-i18n data-wsupdate="user_state-text" data-id="<%= model.get('id') %>">Disconnected</span>
                    <%
                    }
                    %>
                </td>
            </tr>
        <% 
        }
        if (Wat.C.checkACL('vm.see.port-ssh')) { 
        %>
            <tr class="js-execution-params execution-params">
                <td><i class="fa fa-angle-double-right"></i><span data-i18n="SSH port"></span></td>
                <td data-wsupdate="ssh_port" data-id="<%= model.get('id') %>"><%= model.get('ssh_port') == "0" ? '-' : model.get('ssh_port') %></td>
            </tr>
        <% 
        }
        if (Wat.C.checkACL('vm.see.port-vnc')) { 
        %>
            <tr class="js-execution-params execution-params">
                <td><i class="fa fa-angle-double-right"></i><span data-i18n="VNC port"></span></td>
                <td data-wsupdate="vnc_port" data-id="<%= model.get('id') %>"><%= model.get('vnc_port') == "0" ? '-' : model.get('vnc_port') %></td>
            </tr>
        <% 
        }
        if (Wat.C.checkACL('vm.see.port-serial')) { 
        %>
            <tr class="js-execution-params execution-params">
                <td><i class="fa fa-angle-double-right"></i><span data-i18n="Serial port"></span></td>
                <td data-wsupdate="serial_port" data-id="<%= model.get('id') %>"><%= model.get('serial_port') == "0" ? '-' : model.get('serial_port') %></td>
            </tr>
        <% 
        }
        %>
    </tbody>
    <tbody class="js-body-state" data-wsupdate="state-stopped" data-id="<%= model.get('id') %>" style="<%= stoppedStyle %>">
        <tr>
            <td colspan=2 class="center"><i class="fa fa-stop"></i><span data-i18n="Stopped"></span></td>
        </tr>
    </tbody>
    <tbody class="js-body-state" data-wsupdate="state-starting" data-id="<%= model.get('id') %>" style="<%= startingStyle %>">
        <tr>
            <td colspan=2 class="center"><i class="fa fa-spinner fa-spin"></i><span data-i18n="Starting"></span></td>
        </tr>
    </tbody>
    <tbody class="js-body-state" data-wsupdate="state-stopping" data-id="<%= model.get('id') %>" style="<%= stoppingStyle %>">
        <tr>
            <td colspan=2 class="center"><i class="fa fa-spinner fa-spin"></i><span data-i18n="Stopping"></span></td>
        </tr>
    </tbody>
</table>

<table class="details details-list details-left">
    <% 
    if (detailsFields['id'] != undefined) { 
    %>
        <tr>
            <td><i class="fa fa-male"></i><span data-i18n="Id"></span></td>
            <td>
                <%= model.get('id') %>
            </td>
        </tr>  
    <% 
    }
    if (detailsFields['user'] != undefined) { 
    %>
        <tr>
            <td><i class="<%= CLASS_ICON_USERS %>"></i><span data-i18n="User"></span></td>
            <td>
                <a href="#/user/<%= model.get('user_id') %>">
                    <%= model.get('user_name') %>
                </a>
                    <% 
                    if (model.get('user_state') == 'connected') {
                    %>
                        (<span data-i18n data-wsupdate="user_state-text" data-id="<%= model.get('id') %>">Connected</span>)
                    <%
                    }
                    else {
                    %>
                        (<span data-i18n data-wsupdate="user_state-text" data-id="<%= model.get('id') %>">Disconnected</span>)
                    <%
                    }
                    %>
                </td>
        </tr>  
    <% 
    }
    if (detailsFields['ip'] != undefined) { 
    %>
        <tr>
            <td><i class="fa fa-ellipsis-h"></i><span data-i18n="IP address"></span></td>
            <td>
                <%= model.get('ip') %>
            </td>
        </tr>  
    <% 
    }
    if (detailsFields['mac'] != undefined) { 
    %>
        <tr>
            <td><i class="fa fa-ellipsis-h"></i><span data-i18n="MAC address"></span></td>
            <td>
                <%= model.get('mac') %>
            </td>
        </tr>  
    <% 
    }
    if (detailsFields['osf'] != undefined) { 
    %>
        <tr>
            <td><i class="<%= CLASS_ICON_OSFS %>"></i><span data-i18n="OS Flavour"></span></td>
            <td>
                <a href="#/osf/<%= model.get('osf_id') %>">
                    <%= model.get('osf_name') %>
                </a>
            </td>
        </tr>
    <% 
    }
    if (detailsFields['tag'] != undefined) { 
    %>
        <tr>
            <td><i class="fa fa-tag"></i><span data-i18n="Image tag"></span></td>
            <td>
                <%= model.get('di_tag') %>
            </td>
        </tr>
    <% 
    }
    if (detailsFields['disk_image'] != undefined) { 
    %>
        <tr>
            <td><i class="<%= CLASS_ICON_DIS %>"></i><span data-i18n="Disk image"></span></td>
            <td>
                <a href="#/di/<%= model.get('di_id') %>">
                    <%= model.get('di_name') %>
                </a>
            </td>
        </tr>
    <% 
    }
    if (detailsFields['expiration'] != undefined) { 
    %>
        <tr>
            <td><i class="fa fa-warning"></i><span data-i18n="Expiration"></span></td>
                <%
                    var expiration_soft = model.get('expiration_soft');
                    var expiration_hard = model.get('expiration_hard');
                    if (!expiration_soft && !expiration_hard) {
                %>
                    <td>
                        <div class="no-elements" data-i18n="No"></div>
                    </td>
                <%
                    }
                    else {
                        var remainingTimes = {
                            soft: { 
                                rawTime: model.get('time_until_expiration_soft')
                            },
                            hard: { 
                                rawTime: model.get('time_until_expiration_hard')
                            }
                        };
                        
                        $.each (remainingTimes, function (iRema, rema) { 
                            var processedRemainingTime = Wat.U.processRemainingTime(rema.rawTime);

                            remainingTimes[iRema].priorityClass = processedRemainingTime.priorityClass;
                            remainingTimes[iRema].remainingTime = '';
                            remainingTimes[iRema].returnType = processedRemainingTime.returnType;
                            remainingTimes[iRema].remainingTimeAttr = '';
                            
                            switch (processedRemainingTime.returnType) {
                                case 'exact':
                                    remainingTimes[iRema].remainingTime = processedRemainingTime.remainingTime;
                                    break;
                                case 'days':
                                    remainingTimes[iRema].remainingTimeAttr = 'data-days="' + processedRemainingTime.remainingTime + '"';
                                    break;
                                case 'months':
                                    remainingTimes[iRema].remainingTimeAttr = 'data-months="' + processedRemainingTime.remainingTime + '"';
                                    break;
                                case '>year':
                                    remainingTimes[iRema].remainingTimeAttr = 'data-years="' + processedRemainingTime.remainingTime + '"';
                                    break;
                            }
                        });                        
                %>        
                    <td class="inner-table">
                        <table class="expiration-table">
                            <tbody>
                                <%
                                    if (expiration_soft) {
                                %>
                                    <tr>
                                        <td class="<%= remainingTimes.soft.priorityClass %>" data-i18n="Soft"></td>
                                        <td class="<%= remainingTimes.soft.priorityClass %>"><%= model.get('expiration_soft').replace('T',' ') %></td>
                                        <td class="<%= remainingTimes.soft.priorityClass %>" <%= remainingTimes.soft.remainingTimeAttr %>><%= remainingTimes.soft.remainingTime %></td>
                                    </tr>
                                <%
                                    }
                                    if (expiration_hard) {
                                %>
                                    <tr>
                                        <td class="<%= remainingTimes.hard.priorityClass %>" data-i18n="Hard"></td>
                                        <td class="<%= remainingTimes.hard.priorityClass %>"><%= model.get('expiration_hard').replace('T',' ') %></td>
                                        <td class="<%= remainingTimes.hard.priorityClass %>" <%= remainingTimes.hard.remainingTimeAttr %>><%= remainingTimes.hard.remainingTime %></td>
                                    </tr>
                                <%
                                    }
                                %>
                            </tbody>
                        </table>
                    </td>
                <%
                    }
                %>
        </tr>
    <% 
    }
    if (detailsFields['block'] != undefined) { 
    %>
        <tr>
            <td><i class="fa fa-lock"></i><span data-i18n="Blocking"></span></td>
            <td>
                <% 
                if (model.get('blocked')) {
                %>
                    <!--
                    <i class="fa fa-lock" data-i18n="[title]Blocked"></i>
                    -->
                    <span data-i18n="Blocked"></span>
                <%
                }
                else {
                %>
                    <!--
                    <i class="fa fa-unlock" data-i18n="[title]Unblocked"></i>
                    -->
                    <span data-i18n="Unblocked"></span>
                <%
                }
                %>
            </td>
        </tr>
    <% 
    }
    %>
    <tbody class="bb-properties">
        <tr>
            <td colspan=2 class="center"><i class="fa fa-heart"></i><span data-i18n="State"></span></td>
        </tr>
    </tbody>
</table>