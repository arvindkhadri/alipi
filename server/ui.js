//-*-coding: utf-8 -*-
var a11ypi = {
    auth : " ",
    loc:" ",
    elementTagName: " ",
    elementId: " ",
    flag : 0,
    fflag  : 0,
    showbox : 0,
    showlinks : 0,
    blog_flag: false,
    target : false,
    pageHtml:'',
    d: {},
    responseJSON:'',
    testContext : function()
    {	
	if(document.getElementById('social_overlay') != null)
	    document.body.removeChild(document.getElementById('social_overlay'));
 	$(document).ready(function(){$('body *').contents().filter(function() 
								   {
								       try{
									   if(this.nodeType == 3 && !($(this).hasClass('alipi')))
									   {
									       return (this.nodeType == 3) && this.nodeValue.match(/\S/);}}
								       catch(err)
								       {
								       }}).parent().attr('m4pageedittype','text')}); 
	
	vimg = document.getElementsByTagName('img');
	for(i=0; i<vimg.length; i++)
	{
	    vimg[i].setAttribute('m4pageedittype','image');
	}
    },

    createMenu: function(type) {
	var xyz = '';
	if(type == 'renarration')
	    xyz = document.getElementById("show-box");
	else 
	    xyz = document.getElementById("show-comment");
	xyz.innerHTML = '';
	a = a11ypi.getParams();
	for(var i in a11ypi.showbox)
	{
	    if(a11ypi.showbox[i]['type'] == type)
	    {
		var para  = document.createElement("p");
		var newel = document.createElement("a");
		newel.textContent = a11ypi.showbox[i]['lang'];
		if(type == 'renarration')
		    $(newel).attr("href",config.deploy+"/?foruri="+a['foruri']+"&lang="+a11ypi.showbox[i]['lang']+"&interactive=1"+"&type="+type);
		else
		    $(newel).attr("href",config.deploy+"/?foruri="+a['foruri']+"&lang="+a11ypi.showbox[i]['lang']+"&interactive=0"+"&type="+type);
		para.appendChild(newel);
		xyz.appendChild(para);
	    }
	}
    },
    
    ajax: function() {
	if(a11ypi.flag == '0')
	{
	    a11ypi.flag = 1;
	    a = a11ypi.getParams();
	    $.getJSON(config.deploy+'/menu?', {"url":decodeURIComponent(a['foruri'])}, function(data)
	    	      {
	    		  a11ypi.showbox = data;
			  $('#see-narration').show();
			  $("#blog-filter").show(); a11ypi.blogFilter();
			  $("#go").show();
	    	     });

	    req = {"about":decodeURIComponent(a['foruri']), "lang":a['lang']};
	    $.getJSON(config.deploy+'/info?', req, function(data)
	    	      {
	    		  a11ypi.responseJSON = data;
	    	     });
	}
    },
    ajax1: function() {
	if(a11ypi.fflag == '0')
	{
	    a11ypi.fflag = 1;
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
		if(xhr.readyState == 4)
		{
		    if(xhr.responseText == "empty")
		    {
//			a11ypi.clearMenu();
		    }
		    else
		    {
			a11ypi.createMenuFilter(JSON.parse(xhr.responseText));
		    }
		}
	    }
	    xhr.open("POST",config.root+"/menu",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    a = a11ypi.getParams();
	    data = 'url='+a['foruri']+'&option='+a['blog'];
	    xhr.send(data) ;
	}
    },

    getURL: function(e) {
	window.location = window.location.href + "&lang=" + e.value;
	window.reload();
    },
    ren: function()
    {
	a = a11ypi.getParams();
	var url = decodeURIComponent(a['foruri']);
	var lang = a['lang'];
	var type = a['type'];
	$.getJSON(config.deploy+"/replace?",{"url":url,"lang":lang,"type":type},function(data)
		  {
		      for(var i=0;i<data['r'].length;i++)
		      {
			  for(var x in data['r'][i]['narration'])
			  {
			      // path = data['r'][i]['narration'][x]['xpath'];
			      // newContent = data['r'][i]['narration'][x]['data'];
			      // elementType = data['r'][i]['narration'][x]['elementtype'];
			      a11ypi.evaluate(data['r'][i]['narration'][x]);
			  }
		      }
		  });
    },
    evaluate: function(a)
    {
	try{
	    var nodes = document.evaluate(a['xpath'], document, null, XPathResult.ANY_TYPE,null);

	}
	catch(e)
	{
	    console.log(e);
	}
        if(a['type'] == 'renarrration')
	{ 
	    try{
		var result = nodes.iterateNext();
		while (result)
		{
		    if (a['elementtype'] == 'image')
		    {
			if(a['data'] != '')
			{
			    result.setAttribute('src',a['data'].split(',')[1]);  //A hack to display images properly, the size has been saved in the database.
			    width = a['data'].split(',')[0].split('x')[0];
			    height = a['data'].split(',')[0].split('x')[1];
			    result.setAttribute('width',width);
			    result.setAttribute('height', height);
			    result.setAttribute('class','blink');
			}
			else
			    $(result).hide();
                    }
		    else if(a['elementtype'] == 'audio/ogg')
		    {
			a['data'] = decodeURIComponent(a['data']);
			audio = '<audio controls="controls" src="'+a['data']+'" style="display:table;"></audio>';
			$(result).before(audio);
			result.setAttribute('class','blink');
		    }
                    else{
			result.innerHTML = a['data'];
			result.setAttribute('class','blink');
                    }
                    result=nodes.iterateNext();
		}
            }
        catch (e)
        {
	    //            dump( 'error: Document tree modified during iteration ' + e );
        }
	}
	else if(a['type']=='5el') 
	{
	     
	    try{
		var result = nodes.iterateNext();
		while (result)
		{
		    $(result).html($(result).html()+a['data']);
		    $(result).get(0).scrollIntoView();
		    result=nodes.iterateNext();
		}
	    }
	    catch (e)
            {
		//dump( 'error: Document tree modified during iteration ' + e );
            }
	}
    },
    filter: function()
    {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == 4)
	    {
		if(xhr.responseText =='empty')
		{
//		    a11ypi.clearMenu();
//		    alert("An internal server error occured, please try later.");
		}
		else
		{
		    
		    d ={};
		    var response=xhr.responseText.substring(3).split('###');
		    for (var j= 0; j< response.length ; j++){
			chunk = response[j].substring(1).split('&');
			
			for (var i= 0; i< chunk.length ; i++){
			    pair =chunk[i].split("::");
			    key = pair[0];
			    value = pair[1];
			    d[key] = value;
			}
			path = d['xpath'];
			newContent = d['data'];
			elementType = d['elementtype'];
			a11ypi.evaluate(path,newContent,elementType);
		    }
		}
	    }
	}
	a = a11ypi.getParams();
	var url = a['foruri'];
	var lang= a['lang'];
	var blog= a['blog'];
	var data="url="+url+"&lang="+encodeURIComponent(lang)+"&blog="+encodeURIComponent(blog);
	
	xhr.open("POST",config.root+"/filter",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
    },
    createMenuFilter: function(menu_list) {
	var xyz = document.getElementById("show-box");
	xyz.innerHTML = '';
	d = window.location.search.split('?')[1];
	a = a11ypi.getParams();
	var page = a['foruri'];
	var blog = a['blog'];
	for(var i=0;i<menu_list.length;i++)
	{
	    var para  = document.createElement("p");
	    var newel = document.createElement("a");
	    newel.textContent = menu_list[i];
	    $(newel).attr("href",config.deploy+"/?foruri="+page+"&blog="+blog+"&lang="+menu_list[i]+"&interactive=1");
	    para.appendChild(newel);
	    xyz.appendChild(para);
	}
    },
    clearMenuFilter: function() {
	var xyz = document.getElementById("menu-button");
	while(null!= xyz.firstChild)
	{
	    xyz.removeChild(xyz.firstChild);
	}
    },
    getURLFilter: function(e) {
	a= a11ypi.getParams();
	window.location = config.deploy+"/?foruri="+a['foruri']+"&blog="+a['blog'] + "&lang=" + e.value+"&interactive=1";
	window.reload();
    },
    showOriginal: function(){
	var url=decodeURIComponent(window.location.search.split("=")[1].split("&")[0]);
	window.open(url);
    },
    tweet:function(){
	!function(d,s,id){
	    var js,fjs=d.getElementsByTagName(s)[0];
	    if(!d.getElementById(id)){
		js=d.createElement(s);
		js.id=id;js.src="//platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js,fjs);
	    }
	}
	(document,"script","twitter-wjs");
    },
    facebook: function() {
	(function(d, s, id) {
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) return;
	    js = d.createElement(s); js.id = id;
	    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
	    fjs.parentNode.insertBefore(js, fjs);
	}
	 (document, 'script', 'facebook-jssdk'));
    },
    loadOverlay: function()
    {
	var overlay_template = '<div id="renarrated_overlay" class="alipi ui-widget-header ui-corner-all">'+
            '<button id="outter-down-button" class="alipi" onclick="a11ypi.outterToggle();" up="true" title="Move this bar to top">Move</button> '+
	    '<button id="outter-up-button" class="alipi" onclick="a11ypi.outterToggle();" title="Move this bar to bottom">Move</button> '+
	    '<button id="edit-current" class="alipi" onclick="a11ypi.editPage();" title="Allow to edit this page">Re-narrate</button> '+
	    '<button id="see-narration" class="alipi" onclick="a11ypi.showBox();" title="See other renarrations, which are in same or other languages"> '+
	    'Re-narrations</button>'+
	    '<button id="see-comment" class="alipi" onclick="a11ypi.showComment();" title="5el"> '+
	    '5el</button>'+
            '<button id="see-links" class="alipi" onclick="a11ypi.showBox1();" title="See other re-narrated pages of this domain">Re-narrated Pages '+
	    '</button>'+
            '<select id="blog-filter" class="alipi" onChange="a11ypi.checkSelect();" title="Select one of the blog name"></select>'+
            '<button id="go" class="alipi ui-icon-circle-arrow-e" onclick="a11ypi.go();" title="Filter by blog" >|Y|</button>'+
            '<div id="show-box" title="Choose a narration"></div> '+
	    '<div id="show-comment" title="Comments for"></div> '+
	    '<div id="show-links" title="List of pages narrated in this domain" class="alipi"></div> '+
	    '<div id="share-box" class="alipi" title="Share this page in any following social network"></div>';
	
	var pub_overlay_template = '<div id="pub_overlay" class="alipi ui-widget-header ui-corner-all">'+
	    '<button id="icon-up" class="alipi" down="true" onClick="a11ypi.hide_overlays();" title="Move this bar to top">Move</button>'+ //&#x25B2
	    '<button id="icon-down" class="alipi" onClick="a11ypi.hide_overlays();" title="Move this bar to bottom">Move</button>'+ //&#x25BC
	    '<button id="exit-mode" class="alipi" onclick="a11ypi.exitMode();" title="Do not want to save any changes, just take me out of this editing"> '+
	    'Exit</button>'+
            '<button id="help-window" class="alipi" onclick="a11ypi.help_window();" title="How may I help you in editing this page?">Help</button>'+
            '<button id="undo-button" class="alipi" onclick="util.undoChanges();"title="Undo previous change, one by one">Undo changes</button>'+
            '<button id="publish-button" class="alipi" onclick="a11ypi.publish();"title="Publish your changes to blog">Publish</button></div>';	

         var element_edit_overlay_template = '<div id="element_edit_overlay" class="alipi ui-widget-header ui-corner-all" >'+
	    '<button id="edit-text" class="alipi" onclick="a11ypi.displayEditor();" title="Help you to edit this element by providing an editor on right'+
	    ' & reference on left.">Edit Text</button>'+
            '<button id="add-audio" class="alipi" onclick="a11ypi.addAudio();" title="Allow you to give an audio file(.ogg) link to add your audio '+
	    'to this element ">Add Audio</button>'+
            '<button id="replace-image" class="alipi" onclick="a11ypi.imageReplacer();" title="Allow you to give an image file(jpeg/jpg/gif/png) '+
	    'link to replace with this image">Replace Image</button>'+
	    '<button id="delete-image" class="alipi" onclick="pageEditor.deleteImage();" title="Remove this image from page">Delete Image</button>'+
	    '<button id="close-element" class="alipi" onclick="pageEditor.cleanUp();" title="Close" ></button>'+
	    '<label id="cant-edit" class="alipi">No selection / Too large selection </label> '+
	    '</div>';

	$('body').append(overlay_template);
	$('body').append(pub_overlay_template);
	$('body').append(element_edit_overlay_template);
	
	$('#outter-up-button').show();
	$('#go').button({disabled : true});
	$('#undo-button').button({ disabled: true});
	$('#publish-button').button({ disabled: true});
	$('input:.alipi, select:.alipi').button();

	$("#outter-down-button").button({icons:{primary:"ui-icon-circle-arrow-n"},text:false});  $('#outter-down-button').children().addClass('alipi');
	$("#outter-up-button").button({icons:{primary:"ui-icon-circle-arrow-s"},text:false});  $('#outter-up-button').children().addClass('alipi');
	$("#edit-current").button({icons:{primary:"ui-icon-pencil"}});  $('#edit-current').children().addClass('alipi');
	$("#see-narration").button({icons:{primary:"ui-icon-document-b"}});  $('#see-narration').children().addClass('alipi');
	$("#see-comment").button({icons:{primary:"ui-icon-document-b"}});  $('#see-comment').children().addClass('alipi');
	$("#see-links").button({icons:{primary:"ui-icon-link"}});  $('#see-links').children().addClass('alipi');
	/*$("#blog-filter").button({icons:{secondary:"ui-icon-triangle-1-s"}}); */ $('#blog-filter').children().addClass('alipi');
	$("#go").button({icons:{primary:"ui-icon-arrowthick-1-e"},text:false});  $('#go').children().addClass('alipi');
	$("#share").button({icons:{primary:"ui-icon-signal-diag"}});  $('#share').children().addClass('alipi');
	$("#orig-button").button({icons:{primary:"ui-icon-extlink"}});  $('#orig-button').children().addClass('alipi');
	$("#info").button({icons:{primary:"ui-icon-info"}});  $('#info').children().addClass('alipi');

	$("#icon-up").button({icons:{primary:"ui-icon-circle-arrow-n"},text:false});  $('#icon-up').children().addClass('alipi');
	$("#icon-down").button({icons:{primary:"ui-icon-circle-arrow-s"},text:false});  $('#icon-down').children().addClass('alipi');
	$("#exit-mode").button({icons:{primary:"ui-icon-power"}});  $('#exit-mode').children().addClass('alipi');
	$("#help-window").button({icons:{primary:"ui-icon-help"}});  $('#help-window').children().addClass('alipi');
	$("#undo-button").button({icons:{primary:"ui-icon-arrowreturnthick-1-w"}});  $('#undo-button').children().addClass('alipi');
	$("#publish-button").button({icons:{primary:"ui-icon-circle-check"}});  $('#publish-button').children().addClass('alipi');

	$("#edit-text").button({icons:{primary:"ui-icon-pencil"}});   $('#edit-text').children().addClass('alipi');
	$("#add-audio").button({icons:{primary:"ui-icon-circle-plus"}}); $('#add-audio').children().addClass('alipi');
	$("#replace-image").button({icons:{primary:"ui-icon-transferthick-e-w"}}); $('#replace-image').children().addClass('alipi');
	$("#delete-image").button({icons:{primary:"ui-icon-trash"}}); $('#delete-image').children().addClass('alipi');
	$("#close-element").button({icons:{primary:"ui-icon-circle-close"},text:false}); $("#close-element").children().addClass('alipi');

	$('#renarrated_overlay').addClass('barOnTop');
	a11ypi.ajax();
	a11ypi.ajaxLinks1();
	$('#edit-current').show();

	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	if(a['blog'] != undefined ) {
	    $('#go').hide();
	    $('#blog-filter').hide();
	} else { 
	}

	if($('#orig-button').text() == 'Original Page')  {
	    $('#share').insertAfter($('#go'));  $('#share').show();
	    $('#info').insertAfter($('#go')); $('#info').show();
	    $('#orig-button').insertAfter($('#go'));  $('#orig-button').show();
	    $('#share-box').append($('#fb-like')); $('#share-box').append($('#tweet-root'));
	}
    },
    checkSelect: function()
    {
	if($('#blog-filter').val() != "Choose a blog") {
	    $('#go').button({disabled : false});
	} else {
	    $('#go').button({disabled : true});
	}
    },

    help_window: function() {
	var help_template = '<div id="helpwindow" class="alipi ui-widget-header ui-corner-all">'+
            '<label id="txtlab" class="alipi" style="color:#aaa;font-size:100%;">TEXT :- It will popup a '+
	    'window and allow you to modify/replace text of select element on editor(right) box.'+
	    '<p class="alipi">To delete - Empty the editor(right) box and press "Save changes".'+
	    '</p><p class="alipi" style="margin-left:50px";>Add Audio - It allows you to '+
	    'enter audio URL.</p>IMAGE:- <p class="alipi" style="margin-left:50px";> Replace - It allows you to enter '+
	    'image URL.</p> UNDO:- Use it when you want to revert back to '+
	    'previous change.'+
	    'PUBLISH:- To publish your crafted changes to database and blog (Alipi/Personal).'+
	    '<p class="alipi" style="margin-left:50px";>States - The place you are targetting to.</p><p class="alipi" '+
	    'style="margin-left:50px";>Languages - In language you publishing.</p><p class="alipi" style= '+
	    '"margin-left:50px";>Style - In what style you crafted?</p><p class="alipi" style="margin-left:50px";> '+
	    'Author - Who is a crafter?</p><p class="alipi" style="margin-left:50px";>'+
	    'Alipi blog - If you don\'t have blogspot ID then check this to post it to our blog.</p></div>';

	$('body').append(help_template);
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

	$(function() {
	    $( "#helpwindow" ).dialog({
		width:800,
		height:550,
		modal: true,
		close: function() {
		    $("#helpwindow").remove();
		}
	    });
	});
    },  
    
    exitMode: function() {
	var exit = window.confirm("Do you really want to exit from edit mode?");
	if (exit == true) {
	    window.location.reload();
	}
    },

    hide_overlays: function() {
	if($('#icon-up').attr('down') == 'true') {
	    $('#icon-up').attr('down', 'false');
	    $('#icon-up').show(); $('#icon-down').hide();
	    $('#pub_overlay').addClass('barOnBottom'); $('#pub_overlay').removeClass('barOnTop');
	} else {
	    $('#icon-up').attr('down', 'true');
	    $('#icon-down').show(); $('#icon-up').hide();
	    $('#pub_overlay').addClass('barOnTop'); $('#pub_overlay').removeClass('barOnBottom');

	}
    },
    
    outterToggle: function() {
	if($('#outter-down-button').attr('up') == 'true' ) {
	    $('#outter-down-button').attr('up', 'false'); 
	    $('#outter-up-button').hide(); $('#outter-down-button').show();
	    $('#renarrated_overlay').addClass('barOnBottom'); $('#renarrated_overlay').removeClass('barOnTop');
	} else {
	    $('#outter-down-button').attr('up', 'true');
	    $('#outter-up-button').show(); $('#outter-down-button').hide();
	    $('#renarrated_overlay').addClass('barOnTop'); $('#renarrated_overlay').removeClass('barOnBottom');
	}
    },
    
    
    getLoc: function() {

 	$( "#loc-select" ).autocomplete({
            source: function(req, add){

                //pass request to server
                $.getJSON(config.deploy+"/getLoc?", req, function(data) {
		    $('#loc-img').hide();

                    //create array for response objects
                    var suggestions = [];

                    //process response
                    $.each(data['return'], function(i,val){
                        suggestions.push(val['name']+', '+val['country_name']);
                    });
                    //pass array to callback
                    add(suggestions);
                });
		$('#loc-img').show();
            },
        });         
    },

    getLang: function() {
	$( "#lang-select" ).autocomplete({
            source: function(req, add){

                //pass request to server
                $.getJSON(config.deploy+"/getLang?", req, function(data) {
		    $('#lang-img').hide();

                    //create array for response objects
                    var suggestions = [];

                    //process response
                    $.each(data['return'], function(i, val){
                        //suggestions.push(val.country);
                        suggestions.push(val['name']);
                    });
                    //pass array to callback
                    add(suggestions);
                });
		$('#lang-img').show();
            },
        });                             


    },

    publish: function() {
	if(util.hasChangesPending())
	{
	    $('#pub_overlay').slideUp();
	    $('#element_edit_overlay').slideUp(); 
	    $('#icon_on_overlay').slideUp();
	    if (a11ypi.target == false ) {
		var publish_template = '<div id="targetoverlay" title="Who are you narrating to?" class="alipi ui-widget-header ui-corner-all"> '+
		    //		    '<div id="infovis" class="alipi"> </div>'+
		    '<label id="tar-lab1" class="alipi" >Enter few attributes of the target community </label>'+
		    '<label id="tar-lab2" class="alipi" >Location of the target community: </label> '+
		    '<input id="loc-select" class="alipi" placeholder="Type city/town name"/> '+
		    '<img id="loc-img" src="http://dev.a11y.in/wsgi/images/db_loading.gif" /> '+
		    '<label id="tar-lab3" class="alipi" >Language of re-narration: </label> '+
		    '<input id="lang-select" class="alipi" placeholder="Type language name"/>'+
  		    '<img id="lang-img" src="http://dev.a11y.in/wsgi/images/db_loading.gif"/> '+
		    '<label id="tar-lab4" class="alipi" >Select a style of re-narration: </label> '+
		    '<select id="style-select" class="alipi" > '+
		    '<option>Translation</option><option>Technical</option><option>Fun</option><option>Simplification</option> '+
		    '<option>Correction</option><option>Evolution</option><option>Other</option></select>'+
		    '<label id="tar-lab5" class="alipi" >Enter an author name for your contribution: </label> '+
		    '<input id="auth-select" class="alipi" type="text" placeholder="John" /> '+
		    '<div id="blogset" > You can choose to post this in your own blog or in the default Alipi blog</div> '+
		    '<p id="tar-p" ><input id="our-check" class="alipi" type="radio"name="blog" /> '+
		    '<label id="tar-lab6" class="alipi" > Alipi Blog</label><input id="your-check" class="alipi" type="radio" name="blog" /> '+
		    '<label id="tar-lab7" class="alipi">Personal Blog</label></p></div>';
		
		$('body').append(publish_template);
		a11ypi.getLoc();
		a11ypi.getLang();
		a11ypi.target = true;
	    }

	    $(document).unbind('mouseover'); // Unbind the css on mouseover
	    $(document).unbind('mouseout'); // Unbind the css on mouseout

	    $('#pub_overlay').slideUp();
	    $('#element_edit_overlay').slideUp(); 
//	    $('#icon_on_overlay').slideUp();

	    $(function() {
		$( "#targetoverlay" ).dialog({
		    height:550,
		    width:600,
		    modal: true,
		    buttons: {
			Publish: function() {
			    util.publish();
			} 
		    },
		    close: function() {
			$('#pub_overlay').slideDown();
//			$('#element_edit_overlay').slideDown(); 
//			$('#icon_on_overlay').slideDown();
			$( "#targetoverlay" ).hide();
		    }
		});
	    });
	}
    },

    hideAll: function() {
	var boxes = '#show-links, #show-box, #show-comment';	
	$(boxes).dialog('close');
    },
    
    showBox: function() {
	this.hideAll();
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

	$(function() {
	    $( "#show-box" ).dialog( "destroy" );
	    
	    $( "#show-box" ).dialog({
		width: 300,
		height: 300,
		modal: true
	    });
	});
	d = window.location.search.split('?')[1];
	var a = a11ypi.getParams();
	if (a['blog'] === undefined ) {
	    a11ypi.createMenu('renarration');
	}
	else {
	    $('#show-box').attr('title', 'Choose a re-narration from the blog you specified.');
	    a11ypi.ajax1();
	}
    },
    showComment: function() {
	this.hideAll();
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout
	
	$(function() {
	    $( "#show-comment" ).dialog( "destroy" );
	    
	    $( "#show-comment" ).dialog({
		width: 300,
		height: 300,
		modal: true
	    });
	});
	a11ypi.createMenu('5el');
    },

    ajaxLinks1: function() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == 4)
	    {
		if(xhr.responseText == "empty")
		{ }
		else
		{
		    $('#see-links').show();
		    a11ypi.showlinks = JSON.parse(xhr.responseText);
		}
	    }
	}
	xhr.open("POST",config.root+"/domain",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	d = window.location.search.split('?')[1];
	a = a11ypi.getParams();
	xhr.send('url='+a['foruri'])
    },
    showBox1: function() {
	this.hideAll();
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

	$(function() {
	    $( "#show-links" ).dialog( "destroy" );
	    
	    $( "#show-links" ).dialog({
		width: 500,
		height: 300,
		modal: true
	    });
	});
	a11ypi.createDomainMenu();
    },
    createDomainMenu: function() {
	var xyz = $("#show-links");
	xyz.html('');
	menu_list = a11ypi.showlinks;
	for(var i=0; i<menu_list.length;i++)
	{
	    var para = document.createElement("p");
	    var newel = document.createElement("a");
	    newel.textContent = menu_list[i];
	    newel.setAttribute("href", config.deploy+"/?foruri="+encodeURIComponent(menu_list[i]));
	    newel.setAttribute("class","alipiShowLink");
	    para.appendChild(newel);
	    xyz.append(para);
	}
	$('.alipiShowLink').hover(
	    function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
		    if(xhr.readyState == 4)
		    {
			if(xhr.responseText == "empty")
			{ }
			else
			{
			    menu_list = JSON.parse(xhr.responseText);
			    x = '';
			    for(i=0; i<menu_list.length; i++) {
				if (i == menu_list.length-1) {
				    x += menu_list[i];
				} else {
				    x += menu_list[i] + ", ";
				}
			    }
			    $('#show-links').title = x;
			}
		    }
		}
		xhr.open("POST",config.root+"/menu",true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send('url='+encodeURIComponent($(this).attr('href'))) ;
	    },
	    function () {$('#show-links').title= '';}
	);
    },
    blogFilter: function() {
	if (a11ypi.blog_flag == false) {
	    a11ypi.blog_flag = true;
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
		if(xhr.readyState == 4)
		{
		    if(xhr.responseText == "empty")
		    { }
		    else
		    {
			var sel = $("#blog-filter");
			var menu_list = JSON.parse(xhr.responseText);
			opt = document.createElement("option");
			opt.textContent = "Choose a blog";
			sel.append(opt);
			for (var i=0; i < menu_list.length; i++)
			{
			    opt = document.createElement("option");
			    opt.textContent = menu_list[i];
			    sel.append(opt);
			}
		    }
		}
	    }
	    xhr.open("POST",config.root+"/blog",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    a = a11ypi.getParams();
	    xhr.send('url='+a['foruri']);
	}
    },
    go: function() {
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	if ($("#blog-filter").val() == null)
	{    }
	else {
	    window.open(config.deploy+"/?foruri=" + a['foruri'] + "&blog=" + $("#blog-filter").val());
	}
    },
    share: function() {
	$('#fb-like').css('display', 'block'); 
	$('#tweet-root').css('display', 'block');
	$( "#share-box" ).dialog({
	    position: 'center',
	    width:450,
	    height:180,
	    modal: true,
	});
    },
    editPage: function() {
	this.hideAll();
	a11ypi.testContext();
	$('#pub_overlay').show(); $('#pub_overlay').addClass('barOnTop'); 
	$('#icon-down').show();
	$('#renarrated_overlay').hide();
	$('body *').contents().filter(function(){
	    {
		try{
		    if(!($(this).hasClass('alipi')) && $(this).attr('m4pageedittype') )
			return this;
		} 
		catch(err)
		{
		    //pass
		}
	    }
	}).click(pageEditor.startEdit);

	$('body *').contents().filter(function(){ 
	    {
		try{
		    if(!($(this).hasClass('alipi')) || $(this).attr('m4pageedittype'))
			return this;
		} 
		catch(err)
		{
		    //pass
		}
	    }
	}).click(pageEditor.noEdit);
	
	$(document).mouseover(a11ypi.highlightOnHover);
	$(document).mouseout(a11ypi.unhighlightOnMouseOut);
    },

    displayEditor: function() {
	var template = '<div id="editoroverlay" title="Editor" class="alipi ui-widget-header ui-corner-all">'+
	    '<button id="close-adv" class="alipi" onclick="a11ypi.closeAdv();" title="Want to close View Source & display without HTML code?"> '+
	    'Render source</button> '+
	    '<button id="adv-ref" class="alipi" onclick="a11ypi.showAdv();" title="Want to see HTML code? Then click me !!">View Source</button> '+
            '<label id="ref-lab" class="alipi" style="left:3%;">Here is original piece (Reference)</label>'+
            '<div id="reference" class="alipi" readonly="yes"></div>'+
	    '<textarea id="adv-reference" class="alipi" readonly="yes"></textarea> '+
            '<label id="edit-lab" class="alipi" style="left:53%;">Where you should edit (Editor)</label>'+
            '<div id="editor" class="alipi" contenteditable="true" '+ 
            '</div>';
	$('body').append(template);
	$('#pub_overlay').slideUp();
	$('#element_edit_overlay').hide(); 

	var tag = pageEditor.event.target.nodeName;
	$(pageEditor.event.target).removeAttr('m4pageedittype');
	$(pageEditor.event.target).children().removeAttr('m4pageedittype');
	
	$('#adv-reference').text('<'+tag+'>'+$(pageEditor.event.target).html()+'</'+tag+'>');
	$('#reference').html($(pageEditor.event.target).html());
	$('#editor').html($(pageEditor.event.target).html());
	$("#adv-ref").button({icons:{primary:"ui-icon-script"},text:true});  $('#adv-ref').children().addClass('alipi');
	$("#close-adv").button({icons:{primary:"ui-icon-bookmark"},text:true});  $('#close-adv').children().addClass('alipi');
	$('#close-adv').hide();
	$('#adv-ref').button();

	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

	$( "#editoroverlay" ).dialog({
	    position: 'center',
	    width:$(window).width()-10,
	    height:$(window).height()-50,
	    modal: true,
	    buttons: {
		"+": function() {
		    if($('#editor').css('font-size') >= '30px') {
			// passthrough
		    } 
		    else {
			var font = parseFloat($('#editor').css('font-size')) + 1;
			$('#editor').css('font-size', font+'px');
			font = parseFloat($('#reference').css('font-size')) + 1;
			$('#reference').css('font-size', font+'px');
			font = parseFloat($('#adv-reference').css('font-size')) + 1;
			$('#adv-reference').css('font-size', font+'px');
		    }
		},
		"-": function() {
		    if($('#editor').css('font-size') <= '10px') {
			//passthrough
		    } 
		    else {
			var font = parseFloat($('#editor').css('font-size')) - 1;
			$('#editor').css('font-size', font+'px');
			font = parseFloat($('#reference').css('font-size')) - 1;
			$('#reference').css('font-size', font+'px');
			font = parseFloat($('#adv-reference').css('font-size')) - 1;
			$('#adv-reference').css('font-size', font+'px');
		    }
		},
		"Add Link": function() {
		    pageEditor.handler();
		},
		"Save changes": function() {
		    $('#pub_overlay').slideDown();
		    $('#element_edit_overlay').slideDown(); 
		    $('#icon_on_overlay').slideDown();
		    manager.recordText(pageEditor.event.target);
		    pageEditor.cleanUp(pageEditor.event.target);
		    $( "#editoroverlay" ).remove();		    
		}
	    },
	    close: function() {
		pageEditor.cleanUp(pageEditor.event.target);
		$("#editoroverlay" ).remove();
	    }
	});

	$($($('<label>').insertAfter($('.ui-dialog-buttonset').children()[0])).html('Magnify or Demagnify')); // Element added externally with css
	$($('.ui-dialog-buttonset').children()[1]).attr('id','mag-demag');
	$($('.ui-dialog-buttonset').children()[0]).attr('id','mag'); // '+' 
	$($('.ui-dialog-buttonset').children()[2]).attr('id','demag'); // '-' 
	$($('.ui-dialog-buttonset').children()[3]).attr('id','add-link'); // 'Link'
	$($('.ui-dialog-buttonset').children()[4]).attr('id','save-changes'); // 'Save Changes'

	$('#adv-reference').height($('#editor').height() + 40);
	$('#reference').height($('#editor').height());
	$('#mag').attr('title', 'To magnify letters/Increase font size');
	$('#demag').attr('title', 'To demagnify letters/Decrease font size');
	$('#add-link').attr('title', 'Add link(href) to the selected text portion (Before clicking this button, select some portion of text in "Editor")');
	$('#save-changes').attr('title', 'Save edited text onto the page')
    },

    showAdv: function() {
	$('#reference').hide();
	$('#adv-reference').show();
	$('#adv-ref').hide();
	$('#close-adv').show();
    },
    closeAdv: function() {
	$('#reference').show();
	$('#adv-reference').hide();
	$('#close-adv').hide();
	$('#adv-ref').show();
    },
    
    reflectInReference: function() {
	var tag = pageEditor.event.target.nodeName;
	$("#reference").html() = $("#editor").html();
    },

    imageReplacer: function() {
	var imageInputTemplate = '<div id="imageInputElement" title="Enter url" class="alipi ui-widget-header ui-corner-all">'+
            '<input type="text" id="imageInput" placeholder="http://foo.com/baz.jpg" class="alipi" value=""/></div>';

	$('body').append(imageInputTemplate);
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

	$('#pub_overlay').slideUp();
	$('#element_edit_overlay').slideUp();
	$('#icon_on_overlay').slideUp();

	$( "#imageInputElement" ).dialog({
	    width:300,
	    height:200,
	    modal: true,
	    buttons: {
		OK: function() {
		    var formValue = $('#imageInput').val();
		    if(formValue != '\/S/')
		    {
			manager.recordImage(pageEditor.event.target, formValue);
			pageEditor.cleanUp(pageEditor.event.target);
			$( "#imageInputElement" ).remove();
		    }
		}
	    },
	    close: function() {
		pageEditor.cleanUp(pageEditor.event.target);
		$("#imageInputElement" ).remove();
	    }
	});
	
    },

    addAudio: function() {
	var audioInputTemplate = '<div id="audioInputElement" title="Enter url" class="alipi ui-widget-header ui-corner-all">'+
            '<input type="text" id="audioInput" placeholder="http://foo.com/baz.ogg" class="alipi" value=""/></div>';

	$('body').append(audioInputTemplate);
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

	$('#pub_overlay').slideUp();
	$('#element_edit_overlay').slideUp();
	$('#icon_on_overlay').slideUp();

	$( "#audioInputElement" ).dialog({
	    width:300,
	    height:200,
	    modal: true,
	    buttons: {
		OK: function() {
		    pageEditor.addAudio();
		    pageEditor.cleanUp(pageEditor.event.target);
		    $( "#audioInputElement" ).remove();
		}
	    },
	    close: function() {
		pageEditor.cleanUp(pageEditor.event.target);
		$("#audioInputElement" ).remove();
	    }
	});
    },
    
    highlightOnHover: function(event) {
	if( !($(event.target).hasClass('alipi')) ) {
	    $(event.target).addClass('highlightElement');
	}
    },

    unhighlightOnMouseOut: function(event) {
	$(event.target).removeClass('highlightElement');
    },
    showInfo: function(data) {
	infoWindow = window.open(config.deploy+'/blank','Info page');
	window.setTimeout(function(){a11ypi.pushInfo(infoWindow.document.getElementById('info_content'),infoWindow,data);},2500);
    },
    pushInfo: function(ele, win, data) //ele contains the info_content element from blank.html
    {
	win.infoFullJSON = a11ypi.responseJSON;
	win.onLoad();
    },
    getParams: function()
    {
	var a = [];
	if(window.location.hostname ==  config.hostname)
	{
	    d = window.location.search.split('?')[1];
	    for (var i = 0;i<d.split('&').length;i++){ 
		a[d.split('&')[i].split('=')[0]] = decodeURIComponent(d.split('&')[i].split('=')[1]);
	    }
	    return a;
	}
	else
	{
	    a['foruri'] = window.location.href;
	    return a;
	}
    }    
};

