<div class="related-doc">
    <div class="related-doc-title" data-i18n="Related documentation">Related documentation</div>

    <%
    $.each(relatedDoc, function (docSection, docName) {
        if (Wat.I.docSections[docSection] == undefined || !Wat.C.isValidDocGuide(Wat.I.docSections[docSection].guide)) {
            return;    
        }
    %>
        <a href="javascript:" class="fa fa-book button2" data-docsection="<%= docSection %>" data-i18n="<%= docName %>"></a>
    <%
    });
    %>
</div>