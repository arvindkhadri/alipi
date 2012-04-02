var a11ypi = {
    auth : " ",
    loc:" ",
    elementTagName: " ",
    elementId: " ",
    flag : 0,
    showbox : 0,
    showlinks : 0,
    blog_flag: false,
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
	
	
	
	// noteLabel= document.createElement("label");
	// noteLabel.setAttribute("id", "note-label");
	// noteLabel.innerHTML = ' Magnify or Demagnify  ';
	// noteLabel.setAttribute("style", "color:#000;font-size:15px;");
	// $(noteLabel).insertAfter($(document.getElementsByClassName('ui-button-text')[0].parentNode));
	
	//	document.getElementsByClassName('ui-button-text')[1].parentNode.style.marginRight = '635px';
	//	document.getElementsByClassName('ui-button-text')[2].parentNode.style.marginRight = '25px';
	//	document.getElementById("ui-dialog-title-editoroverlay").setAttribute("style","font-size:25px;");

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
	    newel.setAttribute("href","http://dev.a11y.in/web?foruri="+page+"&lang="+menu_list[i]+"&interactive=1");
	    para.appendChild(newel);
	    xyz.appendChild(para);
	}
    },
    clearMenu: function() {
	var xyz = document.getElementById("menu-button");
	while(null!= xyz.firstChild)
	{
	    xyz.removeChild(xyz.firstChild);
	}
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
			document.getElementById("see-narration").disabled = false;
			document.getElementById("blog-filter").disabled = false;
			document.getElementById("go").disabled = false;
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
	var lang= a['lang'];
	var data="url="+url+"&lang="+encodeURIComponent(lang);
	
	xhr.open("POST","http://dev.a11y.in/replace",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
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
                    result.setAttribute('src',newContent.split(',')[1]);  //A hack to display images properly, the size has been saved in the database.
		    width = newContent.split(',')[0].split('x')[0];
		    height = newContent.split(',')[0].split('x')[1];
		    result.setAttribute('width',width);
		    result.setAttribute('height', height);
		    result.setAttribute('class','blink');
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
	var icon_template = '<div id="icon_on_overlay" class="alipi ui-widget-header ui-corner-all" '+
	    'onClick="a11ypi.hide_overlays();"> <input class="alipi" type="image" <img style="width:100%;height:100%;" '+
	    'src="http://y.a11y.in/alipi.gif" /></input></div>';

	var overlay_template = '<div id="renarrated_overlay" class="alipi ui-widget-header ui-corner-all">'+
            '<input id="edit-current" class="alipi" type="submit" onclick="a11ypi.editPage();" value="Renarrate this page">'+
            '<input id="see-narration" class="alipi" type="submit" onclick="a11ypi.showBox();" value="See Narrations">'+
            '<input id="see-links" class="alipi" type="submit" onclick="a11ypi.showBox1();" value="List of Pages Narrated">'+
            '<select id="blog-filter" class="alipi" onclick="a11ypi.blogFilter();"><option>Choose a blog</option></select>'+
            '<input id="go" class="alipi" type="submit" onclick="a11ypi.go();" value="Go">'+
            '</div><div id="show-box"></div><div id="show-links" class="alipi"></div>';
	
	var pub_overlay_template = '<div id="pub_overlay" class="alipi ui-widget-header ui-corner-all">'+
	    '<input id="exit-mode" class="alipi" type="submit" onclick="a11ypi.exitMode();" value="EXIT">'+
            '<input id="edit-current" class="alipi" type="submit" onclick="a11ypi.help_window();" value="Help">'+
            '<input id="see-narration" class="alipi" type="submit" onclick="a11ypi." value="Undo">'+
            '<input id="see-links" class="alipi" type="submit" onclick="a11ypi.publish();" value="Publish">';	

	var element_edit_overlay_template = '<div id="element_edit_overlay" class="alipi ui-widget-header ui-corner-all">'+
	    '<input id="edit-text" class="alipi" type="submit" onclick="a11ypi.displayEditor();" value="Edit Text" disabled=true>'+
            '<input id="add-audio" type="submit" onclick="a11ypi.help_window();" class="alipi" value="Add Audio" disabled=true>'+
            '<input id="add-link" type="submit" onclick="a11ypi.showBox();" class="alipi" value="Add Link" disabled=true>'+
            '<input id="replace-image" type="submit" onclick="a11ypi.imageReplacer();" class="alipi" value="Replace Image" disabled=true>';
	
	var imageInputTemplate = '<div id="imageInputElement" title="Enter url" class="alipi ui-widget-header ui-corner-all">'+
            '<input type="text" id="imageInput" placeholder="http://foo.com/baz.jpg" class="alipi" value=""/></div>';

	var publish_template = '<div id="targetoverlay" class="alipi ui-widget-header ui-corner-all">Target'+
	    '<div id="infovis" class="alipi"></div><label class="alipi" style="position:absolute;top:12%; '+
	    'left:72%;color:#000;"> TARGET</label> '+
	    '<label class="alipi" style="position:absolute;top:25%;left:62%;color:#000;">Location :</label> '+
	    '<label class="alipi" id="loc-select" style="position:absolute;top:25%;left:75%;color:#000;"></label>'+
	    '<label class="alipi" style="position:absolute;top:40%;left:62%;color:#000;">Language :</label> '+
	    '<label id="lang-select" class="alipi" style="position:absolute;top:40%;left:75%;color:#000;"></label>'+
	    '<label class="alipi" style="position:absolute;top:55%;left:62%;color:#000;">Style :</label> '+
	    '<label id="style-select" class="alipi" style="position:absolute;top:55%;left:75%;color:#000;"></label>'+
	    '<label class="alipi" style="position:absolute;top:70%;left:62%;color:#000;">Author :</label> '+
	    '<input id="auth-select" class="alipi" type="text" style="position:absolute;top:70%;left:75%; '+
	    'width:160px;"></input><input id="our-check" class="alipi" type="radio"name="blog"style= '+
	    '"position:absolute;top:85%;left:52%;width:160px;"></input><label class="alipi" style="position:absolute; '+
	    'top:85%;left:64%;color:#000;">Our Blog</label><input id="your-check" class="alipi" type="radio" '+
	    'name="blog" style="position:absolute;top:85%;left:75%;"></input><label class="alipi" style= '+
	    '"position:absolute;top:85%;left:78%;color:#000;">Your Blog</label></div>';

	$('body').append(icon_template);
	$('body').append(overlay_template);
	$('body').append(pub_overlay_template);
	$('body').append(element_edit_overlay_template);
	$('body').append(imageInputTemplate);
	$('body').append(publish_template);

	$(document).addEventListener("DOMActivate", init, false);
	a11ypi.ajax();
	a11ypi.ajaxLinks1();
	go.disabled = true;
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
	$('#pub_overlay').slideToggle();
	$('#element_edit_overlay').slideToggle();
    },
    publish: function() {
	
	$(function() {
	    $( "#targetoverlay" ).dialog( "destroy" );
	    $( "#targetoverlay" ).dialog({
		height:500,
		width:800,
		modal: true,
		buttons: {
		    OK: function() {
			overlayBar = new OverlayBar(pageEditor);
			overlayBar.blogpost();
		    } 
		},
		close: function() {
		    $( "#targetoverlay" ).hide();
		    document.removeEventListener("DOMActivate", init, false);
		}
	    });
	});
    },
    
    showBox: function() {
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
		    document.getElementById("see-links").disabled = false;
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
	var xyz = document.getElementById("show-links");
	xyz.innerHTML = "";
	menu_list = a11ypi.showlinks;
	for(var i=0; i<menu_list.length;i++)
	{
	    var para = document.createElement("p");
	    var newel = document.createElement("a");
	    newel.textContent = menu_list[i];
	    newel.setAttribute("href", "http://dev.a11y.in/web?foruri="+encodeURIComponent(menu_list[i]));
	    newel.setAttribute("class","alipiShowLink");
	    para.appendChild(newel);
	    xyz.appendChild(para);
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
			    document.getElementById('show-links').title = x;
			}
		    }
		}
		xhr.open("POST","http://dev.a11y.in/menu",true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send('url='+encodeURIComponent($(this).attr('href'))) ;
	    },
	    function () {document.getElementById('show-links').title= '';}
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
			var sel = document.getElementById("blog-filter");
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
			    sel.appendChild(opt);
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
	if (document.getElementById("blog-filter").value == "Choose a blog name")
	{    }
	else {
	    window.open("http://dev.a11y.in/web?foruri=" + a['foruri'] + "&blog=" + document.getElementById("blog-filter").value);
	}},
    editPage: function() {
	a11ypi.testContext();
	$('#renarrated_overlay').hide();
	$('#icon_on_overlay').show();
	$('#pub_overlay').show();
	$('#element_edit_overlay').show();

	$('body *').contents().filter(function(){
	    {
		try{
		    if(!($(this).hasClass('alipi')))
			return this;
		}
		catch(err)
		{
		    //pass
		}}}).click(pageEditor.startEdit);
	$(document).click(pageEditor.startEdit);
	$(document).mouseover(a11ypi.highlightOnHover);
	$(document).mouseout(a11ypi.unhighlightOnMouseOut);
    },

    displayEditor: function() {
	    $( "#editoroverlay" ).dialog({
		width:1000,
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
			} 
			else {

			    var font = parseFloat($('#editor').css('font-size')) - 1;
			    $('#editor').css('font-size', font+'px');
			    font = parseFloat($('#reference').css('font-size')) - 1;
			    $('#reference').css('font-size', font+'px');

			}
		    },
		    OK: function() {
			pageEditor.cleanUp(pageEditor.event.target);
			manager.updateText(pageEditor.event.target);
			$( "#editoroverlay" ).remove();

		    }
		},
		close: function() {
		    pageEditor.cleanUp(pageEditor.event.target);
		    $("#editoroverlay" ).remove();
		}
	    });
    },

    imageReplacer: function() {
	$( "#imageInputElement" ).dialog({
		width:300,
		height:200,
		modal: true,
		buttons: {
		    OK: function() {
			
			var formValue = $('#imageInput').val();
			if(formValue != '\/S/')
			{
			    pageEditor.cleanUp(pageEditor.event.target);
			    console.log(formValue);
			    manager.updateImage(pageEditor.event.target, formValue);
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
    
    highlightOnHover: function() {
	if( !$(event.target).hasClass('alipi') ) {
	    $(event.target).addClass('highlightElement');
	}
    },

    unhighlightOnMouseOut: function() {
	$(event.target).removeClass('highlightElement');
    },

    showTopBar: function() {
	
    },
};

// $('html').bind('keypress', function(e)
// 	       {
// 			   if(e.keyCode == 118)
// 			   {
// 			       e.preventDefault();
// 			  //     $('.blink').delay(400).fadeOut(400).delay(200).fadeIn(400).delay(400).fadeOut(400).delay(200).fadeIn(400);
// 			       setTimeout("$('.blink').addClass('blinks')", 800);
// 			       setTimeout("$('.blink').removeClass('blinks')", 2400);
// 			   }
// 		       });
