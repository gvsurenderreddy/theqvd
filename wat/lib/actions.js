Wat.A = {
    getTemplate: function(templateName, cache) {
        if (cache == undefined) {
            cache = true;
        }
        
        if ($('#template_' + templateName).html() == undefined || !cache) {
            var tmplDir = APP_PATH + 'templates';
            var tmplUrl = tmplDir + '/' + templateName + '.tpl';
            var tmplString = '';

            $.ajax({
                url: tmplUrl,
                method: 'GET',
                async: false,
                contentType: 'text',
                cache: false,
                success: function (data) {
                    tmplString = data;
                }
            });
            
            if (cache) {
                $('head').append('<script id="template_' + templateName + '" type="text/template">' + tmplString + '<\/script>');
            }
        }

        if (cache) {
            return $('#template_' + templateName).html();
        }
        else {
            return tmplString;
        }
    },
    
    performAction: function (action, arguments, filters, messages, successCallback, that, async) {
        if (async == undefined) {
            async = true;
        }
        
        var url = Wat.C.getBaseUrl() + 
            '&action=' + action;
        
        if (filters && !$.isEmptyObject(filters)) {
            url += '&filters=' + JSON.stringify(filters);
        }
        
        if (arguments && !$.isEmptyObject(arguments)) {
            url += '&arguments=' + JSON.stringify(arguments);
        }

        messages = messages || {};
        var that2 = that;

        successCallback = successCallback || function () {};   
        var params = {
            url: url,
            type: 'POST',
            dataType: 'json',
            processData: false,
            parse: true,
            async: async,
            error: function (response) {
                if (that) {
                    that.retrievedData = response;
                }
                
                successCallback(that);

                if (!$.isEmptyObject(messages)) {
                    that.message = messages.error;
                    that.messageType = 'error';

                    var messageParams = {
                        message: that.message,
                        messageType: that.messageType
                    };

                    Wat.I.showMessage(messageParams, response);
                }                   
            },
            success: function (response, result, raw) {
                if (Wat.C.sessionExpired(response)) {
                    return;
                }
                
                if (raw.getResponseHeader('sid')) {
                    Wat.C.sid = raw.getResponseHeader('sid');
                }
                else {
                    //console.log('NO SID FOUND');
                }
                
                if (that) {
                    that.retrievedData = response;
                }

                successCallback(that);
                
                if (!$.isEmptyObject(messages)) {
                    if (response.status == 0) {
                        that.message = messages.success;
                        that.messageType = 'success';
                    }
                    else {
                        that.message = messages.error;
                        that.messageType = 'error';
                    }

                    var messageParams = {
                        message: that.message,
                        messageType: that.messageType
                    };

                    Wat.I.showMessage(messageParams, response);
                }                
            }
        };
        
        $.ajax(params);
    },
    
    // Fill filter selects 
    fillSelect: function (params) {
        if (params.controlSelector) {
            var controlSelector = params.controlSelector;
        }
        else if (params.controlId) {
            var controlSelector = 'select#' + params.controlId;
        }
        else if (params.controlName) {
            var controlSelector = 'select[name="' + params.controlName + '"]';
        }
        else {
            return;
        }
            
        // Some starting options can be added as first options
        if (params.startingOptions) {
            $.each($(controlSelector), function () {
                var combo = $(this);
                
                $.each(params.startingOptions, function (id, name) {
                    var selected = '';
                    if (params.selectedId !== undefined && params.selectedId == id) {
                        selected = 'selected="selected"';
                    }
                    
                    var additionalAttributes = '';
                    if (params.translateOptions !== undefined && $.inArray(id, params.translateOptions) != -1) {
                        additionalAttributes = 'data-i18n';
                        combo.attr('data-contain-i18n', '');
                    }
                    
                    combo.append('<option ' + additionalAttributes + ' value="' + id + '" ' + selected + '>' + 
                                                               name + 
                                                               '<\/option>');
                });
            });
        }

        // If action is defined, add retrieved items from ajax to select
        if (params.action) {
            var jsonUrl = Wat.C.getBaseUrl() + '&action=' + params.action;

            if (params.filters) {
                jsonUrl += '&filters=' + JSON.stringify(params.filters);
            }
            
            if (params.order_by) {
                jsonUrl += '&order_by=' + JSON.stringify(params.order_by);
            }

            $.ajax({
                url: jsonUrl,
                type: 'POST',
                async: false,
                dataType: 'json',
                processData: false,
                parse: true,
                success: function (data) {
                    if (Wat.C.sessionExpired(data)) {
                        return;
                    }
                    $.each($(controlSelector), function () {
                        var combo = $(this);
                        
                        var options = '';
                        
                        if (params.group) {
                            //combo.append('<optgroup label="' + params.group + '">');
                        }

                        var optGroup = '';
                        $(data.rows).each(function(i,option) {
                            var selected = '';

                            var id = option.id;
                            if (params.action == 'di_tiny_list') {
                                var name = option.disk_image;
                            }
                            else {
                                var name = option.name;
                            }

                            if (params.nameAsId) {
                                id = name;
                            }

                            // If one option is defined in starting options, will be ignored
                            if (params.startingOptions && params.startingOptions[id]) {
                                return;
                            }

                            if (params.selectedId !== undefined && params.selectedId == id) {
                                selected = 'selected="selected"';
                            }

                            options += '<option value="' + id + '" ' + selected + '>' + 
                                                                        name + 
                                                                        '<\/option>';
                        });

                        if (params.group) {
                            combo.append('<optgroup label="' + params.group + '">' + options + '</optgroup>');
                        }
                        else {
                            combo.append(options);
                        }

                    });
                }
            });
        }
    },
    
    getDocBody: function (selectedGuide) {
        // Load language
        var lan = $.i18n.options.lng;
        
        if ($.inArray(lan, DOC_AVAILABLE_LANGUAGES) === -1) {
            lan = DOC_DEFAULT_LANGUAGE;
        }
            
        var templateDoc = Wat.A.getTemplate('documentation-' + lan + '-' + selectedGuide, false);

        var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im
        var array_matches = pattern.exec(templateDoc);
        
        return array_matches[1];
    },
    
    getDocSection: function (guide, sectionId, toc, imagesPrefix) {
        if (toc == undefined) {
            toc = false;
        }
        
        var docBody = Wat.A.getDocBody(guide);
        
        if (toc) {
            var guideHeader = $.parseHTML(docBody)[1].outerHTML;
            var guideToc = $.parseHTML(guideHeader)[1].childNodes[3].outerHTML;
        }
        
        var pattern = new RegExp('(<h[1|2|3|4] id="' + sectionId + '"[^>]*>((.|[\n\r])*))', 'im');
        var array_matches2 = pattern.exec(docBody); 
        
        if (!array_matches2) {
            return null;
        }
        
        // When doc sections are retrieved from different path than standard (i.e. tests), we can add a prefix to the images path
        if (imagesPrefix) {
            array_matches2[1] = array_matches2[1].replace(/src="images/g, 'src="../images');
        }
        
        var secBody = $.parseHTML('<div>' + array_matches2[1])[0].innerHTML;
        
        if (toc) {
            return '<div id="content">' + guideToc + secTitle + secBody + '</div>';
        }
        else {
            return '<div class="doc-text" style="height: 50vh;">' + secBody + '</div>';
        }
    }
};