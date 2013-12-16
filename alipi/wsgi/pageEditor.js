var pageEditor = {
  event: 0 , //Use this var to store the event object, which will be passed for editor.
  m4pageedittype: '',
  savedHtml: '',
  url:'',
  selection:'',
  startEdit: function(event)
  {
		if(event.target.nodeName != 'AUDIO'){
	    event.stopPropagation();
	    event.preventDefault();
		}
		pageEditor.event = event;
		pageEditor.m4pageedittype = $(event.target).attr('m4pageedittype');
		$('*').removeClass('highlightOnSelect');

		if (pageEditor.event) {
	    xAxis = pageEditor.event.clientX;
	    yAxis = pageEditor.event.clientY;
	    $("#element_edit_overlay").css("top", yAxis);
	    $("#element_edit_overlay").css("left", xAxis);
		}

		if($(event.target).attr('m4pageedittype') == 'text') {
	    $(event.target).addClass('highlightOnSelect'); // To show selected element

	    $('#edit-text').show();
	    $('#add-audio').show();
	    $('#close-element').show();
	    $('#replace-image').hide();
	    $('#delete-image').hide();
	    $('#cant-edit').hide();
	    $("body").css("overflow", "hidden");
	    $('#pub_overlay').slideDown();
	    $('#element_edit_overlay').slideDown();
	    // At this point 'displayEditor' function will be performed on click of 'Edit Text' button
	    // displayEditor function is in ui.js file
		}
		else if($(event.target).attr('m4pageedittype') == 'image') {
	    $(event.target).addClass('highlightOnSelect'); // To show selected element

	    $('#replace-image').show();
	    $('#delete-image').show();
	    $('#close-element').show();
	    $('#add-audio').hide();
	    $('#edit-text').hide();
	    $('#cant-edit').hide();
	    $("body").css("overflow", "hidden");
	    $('#element_edit_overlay').slideDown();
	    $('#pub_overlay').slideDown();
	    // At this point 'imageReplacer' function will be performed on click of 'Replace Image' button
	    // imageReplacer function is in ui.js
		}
  },

  noEdit: function(event)
  {
		if (event) {
	    xAxis = event.clientX;
	    yAxis = event.clientY;
	    $("#element_edit_overlay").css("top", yAxis);
	    $("#element_edit_overlay").css("left", xAxis);
		}
		$('*').removeClass('highlightOnSelect');
		if(!($(event.target).attr('m4pageedittype'))) {
	    $('#edit-text').hide();
	    $('#add-audio').hide();
	    $('#replace-image').hide();
	    $('#delete-image').hide();
	    $('#close-element').hide();
	    $('#cant-edit').show();
	    window.setTimeout("$('#cant-edit').hide();", 3000);
	    $("body").css("overflow", "auto");
	    $('#pub_overlay').slideDown();
	    $('#element_edit_overlay').slideDown();
		}
  },

  handler: function()
  {
		var sel = window.getSelection();
		y = sel.anchorOffset;
		z = sel.focusOffset;
		if(y != z)
		{
	    pageEditor.savedHtml = $('#editor').html();
	    var url = prompt("Enter url");
	    if(url)
	    {
				sel.anchorNode.textContent = sel.anchorNode.textContent.substr(0,y)+'<a href="'+url+'">'+sel.anchorNode.textContent.substr(y,z-y)+"</a>"+sel.anchorNode.textContent.substr(z);
				abc = $('#editor').html();
				abc = abc.replace(/(&lt;)/g,'<');
				abc = abc.replace(/(&gt;)/g,'>');
				$('#editor').html(abc);
	    }
	    else
	    {
				$('#dialog-message').html('<p>Please enter a valid url</p>');
				$('#dialog-message').dialog({
					modal: true,
					buttons:{
						OK:function(){
							$(this).dialog("close");
							$(this).html('');
						}
					}});
	    }
		}
		else{
	    $('#dialog-message').html('<p>Please choose a portion of text and then click <b>Add link</b>.</p>');
	    $('#dialog-message').dialog({
				modal: true,
				buttons:{
					OK:function(){
						$(this).dialog("close");
						$(this).html('');
					}
				}});
		}
  },

  addAudio: function(){
		url = $('#audioInput').val();
		if(url.substr(-4) =='.ogg'){
	    manager.recordAudio(pageEditor.event.target);
		}
		// else{
		//     $('#dialog-message').html('<p>Please enter a valid url</p>');
		//     $('#dialog-message').dialog({
		// 	modal: true,
		// 	buttons:{
		// 	    OK:function(){
		// 		$(this).dialog("close");
		// 		$(this).html('');
		// 	    }
		// 	}});
		// }
  },

  deleteImage: function(){
		manager.deleteImage(pageEditor.event.target);
		pageEditor.cleanUp(pageEditor.event.target);
  },

  cleanUp: function(element)
  {
		if(util.hasChangesPending()) {
	    $('#undo-button').button('option', 'disabled', false); // Another way of enabling UI-JQUERY button
	    $('#publish-button').button({ disabled: false}); // Enabling UI-JQUERY button
		} else {
	    $('#undo-button').button({ disabled: true}); // Disabling button
	    $('#publish-button').button({ disabled: true}); // Disabling button
		}

		$(element).attr('m4pageedittype', pageEditor.m4pageedittype);
		$(element).children().attr('m4pageedittype', pageEditor.m4pageedittype);
		//	$('#icon_on_overlay').slideDown();
		$('#pub_overlay').slideDown();
		$('#element_edit_overlay').hide();
		$("body").css("overflow", "auto");
		$('*').removeClass('highlightOnSelect');
		//	$('#element_edit_overlay').slideDown();
		$(document).mouseover(a11ypi.highlightOnHover);
		$(document).mouseout(a11ypi.unhighlightOnMouseOut);
		//	$(pageEditor.event.target).removeClass('highlightOnSelect'); // Remove hightlight of selected element
  },
};

var DOM = {
  getXpath : function (element)
  {
		var str = '';
		var currentNode = element;
		var path = '';
		var index = -1;

		if (currentNode.nodeName != "#text")
		{
	    path = DOM.makePath(currentNode);
		}
		else
		{
	    path = DOM.makePath(currentNode.parentNode);
		}


		return path;
  },
  getElementIdx : function getElementIdx(elt)
  {
		var count = 1;
		for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)
		{
	    if(sib.nodeType == 1 && sib.tagName == elt.tagName)count++
		}

		return count;
  },

  makePath : function makePath(elt){
		var path = '';
		for (; elt && elt.nodeType == 1; elt = elt.parentNode)
		{
	    if(elt.id == "")
	    {
				idx = DOM.getElementIdx(elt);
				xname = elt.tagName;
				if (idx > 1)
					xname += "[" + idx + "]";
				path = "/" + xname + path;
	    }
	    else
	    {
				path = "//*[@id='"+elt.id+"']"+path;
				break;
	    }
		}
		return path;
  },
  settextContent : function(element, content){
		$(element).html(content);
  },
  gettextContent:function(element)
  {
		return $(element).html();
  },
};

var util = {
  history: [],
  command: [],

  forEach : function(array, callback) {
		var i = 0, length = array.length, value;

		if (length) {
	    for (value = array[0]; i < length && callback.call(value, i, value) !== false; value = array[++i]) {
	    }
		}
  },
  hasChangesPending : function(){
		return util.history.length > 0;
  },
  formUncomplete : function formUnomplete(){
		return (locName == '' &&  langName=='' && styleName == '' );
  },

  makeChanges: function (command, selectedElement) {
		var poofPosition, poofDiv;
		util.command = command;
		switch (util.command.command) {
    case 'TEXT_UPDATE':
	    DOM.settextContent(util.command.element, util.command.data);
	    break;
    case 'IMAGE_DELETE':
	    $(selectedElement).hide();
	    break;
    case 'IMAGE_SRC_UPDATE':
	    imageMatcher = new RegExp("(\\d+)x(\\d+),(.+)").exec(util.command.data);
	    imageWidth = imageMatcher[1];
	    imageHeight = imageMatcher[2];
	    imageSrc = imageMatcher[3];

	    if (imageSrc && util.command.element.src != imageSrc) {
				util.command.element.src = imageSrc;
	    }
	    if (imageWidth == 0) {
				util.command.element.removeAttribute('width');
	    } else {
				util.command.element.width = imageWidth;
	    }

	    if (imageHeight == 0) {
				util.command.element.removeAttribute('height');
	    } else {
				util.command.element.height = imageHeight;
	    }
	    break;

    case 'ANCHOR_UPDATE':
	    $(util.command.element).attr('href', util.command.data);
	    break;

    case 'ANCHOR_CREATE':
	    anchorElement = DOM.BUILDER.A({ 'href' : util.command.data });
	    util.command.element.parentNode.replaceChild(anchorElement, util.command.element);
	    anchorElement.appendChild(util.command.element);
	    util.command.previousData = anchorElement;
	    break;

		case 'AUDIO_UPDATE':
	    util.command.element.setAttribute('src', util.command.data);
	    //pageEditor.showMessage('Audio changed');
	    break;

    case 'AUDIO_CREATE':
	    audioElement = document.createElement('audio');
	    audioElement.setAttribute("class", "alipi");
	    audioElement.setAttribute('src',util.command.data);
	    audioElement.setAttribute('controls','controls');
	    audioElement.setAttribute('mime-type','audio/ogg');
	    $(audioElement).insertBefore($(selectedElement));
	    util.command.element = audioElement;
	    break;

    default:
	    console.error('Unknown util.command:', util.command);
		}

		util.history.push(util.command);
  },

  undoChanges:function () {
		var imageElement, command=util.command;

		if (util.hasChangesPending()) {
	    command = util.history.pop();
	    switch (command.command) {
	    case 'TEXT_UPDATE':
				command.element.innerHTML = command.previousData;
				break;

	    case 'DELETE':
				DOM.restoreStyleProperty(command.element, 'display', '');
				break;

	    case 'IMAGE_SRC_UPDATE':
				command.element.src = command.previousData.src;
				if (command.previousData.size.width) {
					command.element.width = command.previousData.size.width;
				} else {
					command.element.removeAttribute('width');
				}
				if (command.previousData.size.height) {
					command.element.height = command.previousData.size.height;
				} else {
					command.element.removeAttribute('height');
				}
				break;

	    case 'AUDIO_CREATE':
				$(command.element).remove();
				break;
	    case 'ANCHOR_UPDATE':
				command.element.setAttribute('href', command.previousData);
				break;

	    case 'ANCHOR_CREATE':
				command.previousData.parentNode.replaceChild(command.element, command.previousData);
				break;
	    case 'IMAGE_DELETE':
				$(command.element).show();
				break;
	    default:
				console.error('Unknown command:', command);
	    }
	    pageEditor.cleanUp(pageEditor.event.target);
		} else {
		}
  },
  checkHistoryChanges: function()
  {
		if(util.hasChangesPending())
		{
	    $('#undo-button').attr('disabled',false);
	    $('#publish-button').attr('disabled',false);
		}
		else{
	    $('#undo-button').attr('disabled',true);
	    $('#publish-button').attr('disabled',true);
		}
  },

  publish:function (){
		var result;
		if ($('#loc-select').val() == '' || $('#lang-select').val() == ''  || $('input:checked') == undefined) {
	    alert("please furnish all the details");
		} else {
	    if($('input:checked') == $("#your-check"))
	    {
				localStorage.myContent = util.buildDataString();
				window.location.href = "http://dev.a11y.in/test.html";
	    }
	    else{
			$(function(){
				$( "#targetoverlay" ).dialog('close');
				$('#pub_overlay').slideUp();
				$('#element_edit_overlay').hide();
					//		    $('#icon_on_overlay').slideUp();
					// $( "#success-dialog" ).dialog({
					// modal: true,
					// });
				var success_template = '<div id="success-dialog" title="Posting your changes" class="alipi ui-widget-header ui-corner-all" '+
					'<p style="color:#aaa"><b>Please wait !!!</b></p><p style="color:#aaa">Your contribution is being posted</p></div>';
				$('body').append(success_template);
				$(function() {
				$( "#success-dialog" ).dialog({
						modal: true,
						});
				});
			});
				$.post(config.deploy+'/publish',	{"data" : JSON.stringify(util.buildDataString())},
						function(data){
								window.location.reload();
								});

						 //+'&title='+encodeURIComponent(document.title)
//				}).done(function(){
				//	console.log("test");
				//window.location.reload();
//				});
	    }
		}
  },

  buildDataString : function (){
		var check_xpath = [], temp_history = [], index = [];
		for(x=0; x<util.history.length; x++) {
	    check_xpath.push(util.history[x].xpath);
		}
		for(i=0; i<check_xpath.length-1; i++) {
	    for(j=i+1; j<check_xpath.length; j++) {
				if ((check_xpath[i] == check_xpath[j]) && (util.history[i].elementType == util.history[j].elementType)) {
					index.push(i);
				}
	    }
		}
		if (index.length > 0) {
	    for (var z=0; z<index.length; z++) {
				delete util.history[index[z]];
	    }
		}

		for (var x=0; x<util.history.length; x++) {
	    if (util.history[x] != undefined) {
				temp_history.push(util.history[x]);
	    }
		}

		util.history = temp_history;
		var command = util.command, buffer;
		// buffer = new StringUtil.StringBuffer();

		var buff = [];
		util.forEach(util.history, function(index, command) {
			var dict = {};
			dict['type'] = "re-narration"; //TYPE
			dict['about'] = decodeURIComponent(window.location.search.split('=')[1]);
			dict['lang'] = $('#lang-select').val();
			dict["location"] = $('#loc-select').val();
			dict["style"] = $('#style-select').val();
			dict["blog"] = config.sweet;
			dict["elementtype"] = command.elementType;
			dict["xpath"] = command.xpath;
			dict["data"] = command.data;
			/*if ($('#auth-select').val() == '' || $('#auth-select').val() == /\S/) {
				dict["author"] = "Anonymous";
			} else {
				dict["author"] = $('#auth-select').val();
			}*/
      dict['author'] = $('#tar-uname').val() || $('#tar-name').val() || 'Anonymous';
			buff.push(dict);

			// buffer.append('###'); //separates the commands
	    // buffer.append('about=');  //url=about    //removed '&' on purpose
	    // buffer.append(window.location.search.split('=')[1]);
	    // buffer.append('&lang=');//lang
	    // buffer.append(encodeURIComponent($('#lang-select').val()));
	    // buffer.append('&location=');//location
	    // buffer.append(encodeURIComponent($('#loc-select').val()));
	    // buffer.append('&style=');//style
	    // buffer.append(encodeURIComponent($('#style-select').val()));
	    // buffer.append('&blog=');  //blog where to post
	    // buffer.append(encodeURIComponent("blog"));
	    // buffer.append('&elementtype='); // text, audio, img
	    // buffer.append(encodeURIComponent(command.elementType));
	    // buffer.append('&xpath=');//xpath
	    // buffer.append(encodeURIComponent(command.xpath));
	    // buffer.append('&data=');  //data
	    // buffer.append(encodeURIComponent(command.data));
	    // buffer.append('&author='); //author
	    // if ($('#auth-select').val() == '' || $('#auth-select').val() == /\S/) {
			// 	buffer.append(encodeURIComponent('Anonymous'));
	    // } else {
			// 	buffer.append(encodeURIComponent($('#auth-select').val()));
	    // }
		});
		// return buffer.toString().substring(3);
    buff.push({'comments': $("#tar-comment").val()});
    console.log(buff);
		return buff;
  },
};

var manager = {
  recordText:function (selectedElement) {
		var prevData = $(selectedElement).html();
		var command = {
	    command : 'TEXT_UPDATE',
	    element : selectedElement,
	    url : window.location.href,
	    xpath : DOM.getXpath(selectedElement),
	    elementType : 'text',
	    data : DOM.gettextContent($('#editor')),
	    previousData : prevData
    };
		util.makeChanges(command, selectedElement);
  },
  recordAudio:function(selectedElement){
		var command = {
			command : 'AUDIO_CREATE',
			element : selectedElement,
			url : window.location.href,
			xpath : DOM.getXpath(selectedElement),
			elementType: 'audio/ogg',
			data : url,
			previousData : ''

		};
		util.makeChanges(command,selectedElement);
  },
  deleteElement : function(selectedElement) {
		var command = {
	    command : 'DELETE',
	    element : selectedElement,
	    url : '',
	    elementType : 'text',
	    data : '',
	    xpath : '',
	    data : '',
	    previousData : ''
		};
		util.makeChanges(command, selectedElement);
  },
  recordImage: function(selectedElement, url)
  {
		var command = {
	    command : 'IMAGE_SRC_UPDATE',
	    element : selectedElement,
	    elementType : 'image',
	    xpath : DOM.getXpath(selectedElement),
	    url : window.location.href,
	    data : new StringUtil.StringBuffer().append(selectedElement.width).append('x').append(selectedElement.height).append(',').append(url).toString(),
	    previousData : {
				'src' : selectedElement.src,
				'size' : { width: selectedElement.width, height: selectedElement.height }
	    }
		};
		util.makeChanges(command, selectedElement);
  },
  deleteImage : function(selectedElement) {
		var command = {
	    command : 'IMAGE_DELETE',
	    element : selectedElement,
	    url : window.location.href,
	    elementType : 'image',
	    data : '',
	    xpath : '',
	    data : '',
	    previousData : {
				'src' : selectedElement.src,
				'size' : { width: selectedElement.width, height: selectedElement.height }
	    }
		};
		util.makeChanges(command, selectedElement);
  },

};
//Implementing the class for doing StringBuffer.
var StringUtil = StringUtil || {};
(function(StringUtil){
  StringUtil.StringBuffer = function StringBuffer() {
		var buffer = [];
		this.append = function append(string) {
	    buffer.push(string);
	    return this;
		};

		this.toString = function toString() {
	    return buffer.join('');
		};
  };
})(StringUtil);
