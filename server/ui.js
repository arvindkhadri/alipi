var a11ypi = {
    auth : " ",
    loc:" ",
    elementTagName: " ",
    elementId: " ",
    flag : 0,
    showbox : 0,
    showlinks : 0,
    blog_flag: false,
    target : false,
    pageHtml:'',
    d: {},
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

	var v = document.getElementsByTagName("body");
	// 	var a = document.createElement("script");
	// 	a.setAttribute("src","http://dev.a11y.in/alipi/wsgi/page_edit.js");
	// //	a.setAttribute("src","http://localhost/alipi-1/server/wsgi/page_edit.js");
	// 	a.setAttribute("type","text/javascript");
	// 	v[0].appendChild(a);
	var alltags = document.getElementsByTagName('*');
	for (x=0; x<alltags.length; x++) {
	    if (alltags[x].id == 'ren_overlay' || alltags[x].id == 'overlay1' ) {
		if(document.getElementById('overlay1') != null)
		{
		    v[0].removeChild(document.getElementById('overlay1'));
		}
	    }
	}
	if(document.getElementById('overlay2') != null)
	    v[0].removeChild(document.getElementById('overlay2'));
    },

    createMenu: function(menu_list) {
	var xyz = document.getElementById("show-box");
	xyz.innerHTML = '';
	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	var page = a['foruri'];
	for(var i=0;i<menu_list.length;i++)
	{
	    var para  = document.createElement("p");
	    var newel = document.createElement("a");
	    newel.textContent = menu_list[i];
	    $(newel).attr("href","http://dev.a11y.in/web?foruri="+page+"&lang="+menu_list[i]+"&interactive=1");
	    para.appendChild(newel);
	    xyz.appendChild(para);
	}
    },
    
	
    clearMenu: function() {
	// var xyz = document.getElementById("menu-button");
	// while(null!= xyz.firstChild)
	// {
	//     xyz.removeChild(xyz.firstChild);
	// }
    },
    ajax: function() {
	if(a11ypi.flag == '0')
	{
	    a11ypi.flag = 1;
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
		if(xhr.readyState == 4)
		{
		    if(xhr.responseText == "empty")
		    {
			a11ypi.clearMenu();
		    }
		    else
		    {
			$('#see-narration').button('option', 'disabled', false);
			$("#blog-filter").button('option', 'disabled', false);
			$("#go").button('option', 'disabled', false);
			a11ypi.showbox = JSON.parse(xhr.responseText);
		    }
		}
	    }
	    xhr.open("POST","http://dev.a11y.in/menu",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    d = window.location.search.split('?')[1];
	    var a =[];
	    for (var i = 0;i<d.split('&').length;i++){ 
		a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	    }
	    var url = a['foruri'];
	    xhr.send('url='+url);
	}
    },
    ajax1: function() {
	if(a11ypi.flag == '0')
	{
	    a11ypi.flag = 1;
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
		if(xhr.readyState == 4)
		{
		    if(xhr.responseText == "empty")
		    {
			a11ypi.clearMenu();
		    }
		    else
		    {
			a11ypi.createMenuFilter(JSON.parse(xhr.responseText));
		    }
		}
	    }
	    xhr.open("POST","http://dev.a11y.in/menu",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    d = window.location.search.split('?')[1];
	    var a =[];
	    for (var i = 0;i<d.split('&').length;i++){ 
		a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	    }
	    var url = a['foruri'];
	    var option = a['blog'];
	    data = 'url='+url+'&option='+option;
	    xhr.send(data) ;
	}
    },

    getURL: function(e) {
	window.location = window.location.href + "&lang=" + e.value;
	window.reload();
    },
    ren: function()
    {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == 4)
	    {
		if(xhr.responseText =='empty')
		{
		    a11ypi.clearMenu();
		    alert("An internal server error occured, please try later.");
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
	
	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	var url = a['foruri'];
	var lang = a['lang'];
	var data="url="+url+"&lang="+encodeURIComponent(lang);
	xhr.open("POST","http://dev.a11y.in/replace",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);
    },
    evaluate: function()
    {
	try{
	    var nodes = document.evaluate(path, document, null, XPathResult.ANY_TYPE,null);

	}
	catch(e)
	{
	    console.log(e);
	}
        try{
            var result = nodes.iterateNext();
	    while (result)
            {
		if (elementType == 'image')
		{
		    if(newContent != '')
		    {
			result.setAttribute('src',newContent.split(',')[1]);  //A hack to display images properly, the size has been saved in the database.
			width = newContent.split(',')[0].split('x')[0];
			height = newContent.split(',')[0].split('x')[1];
			result.setAttribute('width',width);
			result.setAttribute('height', height);
			result.setAttribute('class','blink');
		    }
		    else
			$(result).hide();
                }
		else if(elementType == 'audio/ogg')
		{
		    newContent = decodeURIComponent(newContent);
		    audio = '<audio controls="controls" src="'+newContent+'" style="display:table;"></audio>';
		    $(result).before(audio);
		    result.setAttribute('class','blink');
		}
                else{
                    result.innerHTML = newContent;
		    result.setAttribute('class','blink');
                }
                result=nodes.iterateNext();
            }
        }
        catch (e)
        {
            dump( 'error: Document tree modified during iteration ' + e );
        }
    },
    close: function() {
	document.getElementById('ren_overlay').style.display = 'none';
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
		    a11ypi.clearMenu();
		    alert("An internal server error occured, please try later.");
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
	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	var url = a['foruri'];
	var lang= a['lang'];
	var blog= a['blog'];
	var data="url="+url+"&lang="+encodeURIComponent(lang)+"&blog="+encodeURIComponent(blog);
	
	xhr.open("POST","http://dev.a11y.in/filter",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
    },
    createMenuFilter: function(menu_list) {
	var xyz = document.getElementById("menu-button");
	for(var i in menu_list)
	{
	    var newel = document.createElement("option");
	    newel.textContent = menu_list[i];
	    newel.setAttribute("value",menu_list[i]);
	    newel.setAttribute("onclick","a11ypi.getURLFilter(event.target);");
	    xyz.appendChild(newel);
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
	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}

	window.location = "http://dev.a11y.in/web?foruri="+a['foruri']+"&blog="+a['blog'] + "&lang=" + e.value+"&interactive=1";
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
	var icon_template = '<div id="icon_on_overlay" class="alipi demo ui-widget-header ui-corner-all" '+
	    'onClick="a11ypi.hide_overlays();"> <input id="icon-button" class="alipi" type="submit" value="Hide Bar"'+
	    // <img style="width:100%;height:100%;" '+
	    // 'src="http://y.a11y.in/alipi.gif" />
	    '</input></div>';

	var overlay_template = '<div id="renarrated_overlay" class="alipi ui-widget-header ui-corner-all">'+
            '<input id="edit-current" class="alipi" type="submit" onclick="a11ypi.editPage();" value="Re-narrate this page">'+
            '<input id="see-narration" class="alipi" type="submit" onclick="a11ypi.showBox();" value="See re-narrations">'+
            '<input id="see-links" class="alipi" type="submit" onclick="a11ypi.showBox1();" value="List of pages narrated">'+
            '<select id="blog-filter" class="alipi" onclick="a11ypi.blogFilter();" value="choose a blog"></select>'+
            '<input id="go" class="alipi" type="submit" onclick="a11ypi.go();" value="Go">'+
            '</div><div id="show-box" title="Choose a narration"></div><div id="show-links" title="List of pages narrated in this domain" class="alipi"></div>';
	
	var pub_overlay_template = '<div id="pub_overlay" class="alipi ui-widget-header ui-corner-all">'+
	    '<input id="exit-mode" class="alipi" type="submit" onclick="a11ypi.exitMode();" value="Exit">'+
            '<input id="help-window" class="alipi" type="submit" onclick="a11ypi.help_window();" value="Help">'+
            '<input id="undo-button" class="alipi" type="submit" onclick="util.undoChanges();" value="Undo" ; >'+
            '<input id="publish-button" class="alipi" type="submit" onclick="a11ypi.publish();" value="Publish" ></div>';	

	var element_edit_overlay_template = '<div id="element_edit_overlay" class="alipi ui-widget-header ui-corner-all" >'+
	    '<input id="edit-text" class="alipi" type="submit" onclick="a11ypi.displayEditor();" value="Edit Text" style="display:none;" >'+
            '<input id="add-audio" type="submit" onclick="a11ypi.addAudio();" class="alipi" value="Add Audio" style="display:none;" >'+
            '<input id="replace-image" type="submit" onclick="a11ypi.imageReplacer();" class="alipi" value="Replace Image" style="display:none;" >'+
	    '<input id="delete-image" type="submit" onclick="pageEditor.deleteImage();" class="alipi" value="Delete Image" style="display:none;" >'+
	    '</div>';

	$('body').append(icon_template);
	$('body').append(overlay_template);
	$('body').append(pub_overlay_template);
	$('body').append(element_edit_overlay_template);

	
	$('#undo-button').button({ disabled: true});
	$('#publish-button').button({ disabled: true});
	$('input:.alipi, select:.alipi').button();
	
	a11ypi.ajax();
	a11ypi.ajaxLinks1();
	$('#go').button('option','disabled', true);
	$('#blog-filter').button('option', 'disabled', true);
	$("#see-links").button('option', 'disabled', true);
	$("#see-narration").button('option', 'disabled', true);
//	$('#element_edit_overlay').slideUp();
	//go.disabled = true; //This throws a warning.  FIX IT.
    },
    
    help_window: function() {
	var help_template = '<div id="helpwindow" class="alipi ui-widget-header ui-corner-all">'+
            '<label id="txtlab" class="alipi" style="color:#000;font-weight:normal;">TEXT :- It will popup a '+
	    'window and allow you to modify/replace text of select element on editor(right) box.'+
	    '<p class="alipi">To delete - Empty the editor(right) box and press "OK".'+
	    '</p><p class="alipi" style="margin-left:50px";>See narrations - If the selected element has other narrations '+
	    'then it will list, on click.</p><p class="alipi" style="margin-left:50px";>Audio - It allows you to '+
	    'enter audio URL.</p>IMAGE:- <p class="alipi" style="margin-left:50px";> Replace - It allows you to enter '+
	    'image URL.</p><p class="alipi" style="margin-left:50px";> See narrations - If the selected element has other '+
	    'image narration then it will show, on click.</p> UNDO:- Use it when you want to revert back to '+
	    'previous change.<p class="alipi" style="margin-left:50px";> Revert deleted - Press \'Undo\' button twice.</p>'+
	    'PUBLISH:- To publish your crafted changes to database and blog (our/your).'+
	    '<p class="alipi" style="margin-left:50px";>States - To the place you are targetting.</p><p class="alipi" '+
	    'style="margin-left:50px";>Languages - In language you publishing.</p><p class="alipi" style= '+
	    '"margin-left:50px";>Style - In what style you crafted?</p><p class="alipi" style="margin-left:50px";> '+
	    'Author - Who is a crafter?</p><p class="alipi" style="margin-left:50px";>'+
	    'Our blog - If you don\'t have blogspot ID then check this to post it to our blog.</p></div>';

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
	if($('#icon-button').val() == 'Hide Bar') {
	    $('#icon-button').attr('value', 'Show Bar');
	    $('#pub_overlay').slideUp();
	    $('#element_edit_overlay').slideUp();
	} else {
	    $('#icon-button').val('Hide Bar');
	    $('#pub_overlay').slideDown();
	    if( $('#element_edit_overlay').children()[0].style.display != 'none' || $('#element_edit_overlay').children()[2].style.display != 'none' ) {
	    $('#element_edit_overlay').slideDown();	    
	    }
	}
    },

    publish: function() {
	if(util.hasChangesPending())
	{
	    $('#pub_overlay').slideUp();
	    $('#element_edit_overlay').slideUp(); 
	    $('#icon_on_overlay').hide();
	    if (a11ypi.target == false ) {
		var publish_template = '<div id="targetoverlay" title="Target Window" class="alipi ui-widget-header ui-corner-all"> '+
		    '<div id="infovis" class="alipi"> </div>'+
		    '<label class="alipi" style="position:absolute;top:10%;left:800px;color:#000;">Target </label>'+
		    '<label class="alipi" style="position:absolute;top:20%;left:700px;color:#000;">Location: </label> '+
		    '<label id="loc-select" class="alipi" style="position:absolute;top:20%;left:770px;color:#000;"></label>'+
		    '<label class="alipi" style="position:absolute;top:35%;left:700px;color:#000;">Language: </label> '+
		    '<label id="lang-select" class="alipi" style="position:absolute;top:35%;left:780px;color:#000;"></label>'+
		    '<label class="alipi" style="position:absolute;top:50%;left:700px;color:#000;">Style: </label> '+
		    '<label id="style-select" class="alipi" style="position:absolute;top:50%;left:745px;color:#000;"></label>'+
		    '<label class="alipi" style="position:absolute;top:65%;left:700px;color:#000;">Author: </label> '+
		    '<input id="auth-select" class="alipi" type="text" style="position:absolute;top:65%;left:760px; '+
		    'width:160px;" /><div id="blogset" style="position:absolute;top:80%;left:700px;width:250px;"><input id="our-check" class="alipi" '+
		    'type="radio"name="blog"style="position:relative;" /><label class="alipi" style="position:relative; '+
		    'color:#000;">Alipi Blog</label><input id="your-check" class="alipi" type="radio" '+
		    'name="blog" style="position:relative;margin-left:10%;" /><label class="alipi" style= '+
		    '"position:relative;color:#000;">Personal Blog</label></div></div>';
		
		$('body').append(publish_template);
		document.addEventListener("DOMActivate", init, false);
		a11ypi.target = true;
	    }

	    $(document).unbind('mouseover'); // Unbind the css on mouseover
	    $(document).unbind('mouseout'); // Unbind the css on mouseout

	    $(function() {
		$( "#targetoverlay" ).dialog({
		    height:600,
		    width:$(window).width()-180,
		    modal: true,
		    buttons: {
			Publish: function() {
			$( "#targetoverlay" ).hide();
			    util.publish();
			} 
		    },
		    close: function() {
			$('#pub_overlay').slideDown();
			$('#element_edit_overlay').slideDown(); 
			$('#icon_on_overlay').show();
			$( "#targetoverlay" ).hide();
			$('#pub_overlay').slideDown();
			$('#element_edit_overlay').slideDown();
			$('#icon-button').slideDown();
			document.removeEventListener("DOMActivate", init, false);
		    }
		});
			    $('#pub_overlay').slideUp();
			    $('#element_edit_overlay').slideUp();
			    $('#icon-button').slideUp();

	    });
	}
    },
    
    showBox: function() {
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
	a11ypi.createMenu(a11ypi.showbox);
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
		    $("#see-links").button('option', 'disabled', false);
		    a11ypi.showlinks = JSON.parse(xhr.responseText);
		}
	    }
	}
	xhr.open("POST","http://dev.a11y.in/domain",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	xhr.send('url='+a['foruri'])
    },
    showBox1: function() {
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
	    newel.setAttribute("href", "http://dev.a11y.in/web?foruri="+encodeURIComponent(menu_list[i]));
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
		xhr.open("POST","http://dev.a11y.in/menu",true);
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
			//		blogArray = [];
			// for (var i=0; i< menu_list.length; i++)
			// {
			//     blogArray[i] = menu_list[i].split("http://")[1].split(".com")[0] + ".com";
			// }
			// blogArray.sort();
			for (var i=0; i < menu_list.length; i++)
			{
			    // if ( i == 0 )
			    // {
			    opt = document.createElement("option");
			    opt.textContent = menu_list[i];
			    sel.append(opt);
			}
			// else if(blogArray[i] == blogArray[i-1])
			// { }
			//     else 
			// {
			// 	opt = document.createElement("option");
			// 	opt.textContent = blogArray[i];
			// 	sel.appendChild(opt);
			// }
			
		    }
		}
	    }
	    xhr.open("POST","http://dev.a11y.in/blog",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    d = window.location.search.split('?')[1];
	    var a =[];
	    for (var i = 0;i<d.split('&').length;i++){ 
		a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	    }
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
	    window.open("http://dev.a11y.in/web?foruri=" + a['foruri'] + "&blog=" + $("#blog-filter").val());
	}
    },
    editPage: function() {
	a11ypi.testContext();
	$('#renarrated_overlay').hide();
	$('#icon_on_overlay').show();
	$('#pub_overlay').show();
	$('#element_edit_overlay').slideUp(); // When 1st time page entered in edit mode
	
	$('body *').contents().filter(function(){
	    {
		try{
		    if(!($(this).hasClass('alipi')) || $(this).attr('m4pageedittype') )
			return this;
		}
		catch(err)
		{
		    //pass
		}
	    }
	}).click(pageEditor.startEdit);
	//	$(document).click(pageEditor.startEdit);
	$(document).mouseover(a11ypi.highlightOnHover);
	$(document).mouseout(a11ypi.unhighlightOnMouseOut);
    },

    displayEditor: function() {
	var template = '<div id="editoroverlay" title="Editor" class="alipi ui-widget-header ui-corner-all">'+
            '<label class="alipi" style="left: 20%;">Reference</label>'+
            '<div id="reference" class="alipi" readonly="yes"></div>'+
            '<label class="alipi" style="left: 70%;">Editor</label>'+
            '<div id="editor" class="alipi" contenteditable="true"></div>'+
            '<div id="forPrevData" class="alipi"></div>'+
            '</div>';
	var url_template = '<div id="url-template" title="Enter a URL">'+
	    '<input type="text" id="url"></input>'+
	    '</div>';
	var message_template = '<div id="dialog-message" title="Attention!!">'+
	    '</div>';
	
	$('body').append(template);
	$('body').append(message_template);
	//$('body').append(url_template);
	$('#pub_overlay').slideUp();
	$('#element_edit_overlay').slideUp(); 
	$('#icon_on_overlay').hide();

	var tag = pageEditor.event.target.nodeName;
	$(pageEditor.event.target).removeAttr('m4pageedittype');
	$(pageEditor.event.target).children().removeAttr('m4pageedittype');
	
	$('#reference').text('<'+tag+'>'+$(pageEditor.event.target).html()+'</'+tag+'>');
	$('#editor').html($(pageEditor.event.target).html());

	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

	$( "#editoroverlay" ).dialog({
	    position: 'center',
	    width:$(window).width()-100,
	    height:550,
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
		    }
		},
		"Add Link": function() {
		    pageEditor.handler();
		},
		"Save changes": function() {
		    $('#pub_overlay').slideDown();
		    $('#element_edit_overlay').slideDown(); 
		    $('#icon_on_overlay').show();
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

	$($($('<label>').insertAfter($('.ui-dialog-buttonset').children()[0])).html('Magnify or Demagnify')).css({}); // Element added externally with css
	$($('.ui-dialog-buttonset').children()[1]).css({'position':'absolute','left':'100','font-weight':'bold','margin-top':'10'});
	$($('.ui-dialog-buttonset').children()[0]).css({'position':'absolute','left':'45'}); // '+' CSS for postioning button on editor
	$($('.ui-dialog-buttonset').children()[2]).css({'position':'absolute','left':'270'}); // '-' CSS for postioning button on editor
	$($('.ui-dialog-buttonset').children()[3]).css({'position':'absolute','left':'54%'}) // 'Link' CSS for postioning button on editor
    },
    
    imageReplacer: function() {
	var imageInputTemplate = '<div id="imageInputElement" title="Enter url" class="alipi ui-widget-header ui-corner-all">'+
            '<input type="text" id="imageInput" placeholder="http://foo.com/baz.jpg" class="alipi" value=""/></div>';

	$('body').append(imageInputTemplate);
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

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
            '<input type="text" id="audioInput" placeholder="http://foo.com/baz.jpg" class="alipi" value=""/></div>';

	$('body').append(audioInputTemplate);
	$(document).unbind('mouseover'); // Unbind the css on mouseover
	$(document).unbind('mouseout'); // Unbind the css on mouseout

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

    showTopBar: function() {
	
    },
};

