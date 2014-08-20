<div class="h1">
    <span data-i18n>Remote administration</span>
</div>
<div class="remote_administration-buttons">
    <%
        var disabledClass = ' disabled ';
        if (vmState == 'running') {
            disabledClass = '';
        }
    %>
    <a class="button2 fa fa-external-link <%= disabledClass %>" data-i18n>VNC viewer</a>
    <a class="button2 fa fa-desktop <%= disabledClass %>" data-i18n>VNC local client</a>
    <a class="button2 fa fa-terminal <%= disabledClass %>" data-i18n>Telnet viewer</a>
</div>

<table class="list">
<tbody>
    <tr>
        <td><span data-i18n>State</span></td>
        <td data-i18n>
            <% 
                var vmState = model.get('state');
                switch(vmState) {
                    case 'stopped':
                        print('Stopped');
                        break;
                    case 'running':
                        print('Running');
                        break;
                }
            %>
        </td>
    </tr>
    <tr>
        <td><span data-i18n>Node</span></td>
        <td>
            <a href="#/node/<%= model.get('host_id') %>">
                <%= model.get('host_name') %>
            </a>
        </td>
    </tr>
    <tr>
        <td><span data-i18n>IP address</span></td>
        <td><%= model.get('ip') %></td>
    </tr>
    <tr>
        <td><span data-i18n>Next boot IP</span></td>
        <td><%= model.get('next_boot_ip') %></td>
    </tr>
    <tr>
        <td><span data-i18n>SSH port</span></td>
        <td><%= model.get('ssh_port') %></td>
    </tr>
    <tr>
        <td><span data-i18n>VNC port</span></td>
        <td><%= model.get('vnc_port') %></td>
    </tr>
    <tr>
        <td><span data-i18n>Serial port</span></td>
        <td><%= model.get('serial_port') %></td>
    </tr>
</tbody>
</table>