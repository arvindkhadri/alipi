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
									   if(this.nodeType == 1)
									   {
									       return (this.parentNode) && this.firstChild.nodeValue.match(/\S/);}}
								       catch(err)
								       {
//									       console.log(err.message);
//									       console.log(this);
								       }}).attr('m4pageedittype','text')}); 


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
                    result.textContent = newContent;
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
	body = document.body;
	overlay = document.createElement("div");
	overlay.setAttribute("id", "renarrated_overlay");
	overlay.setAttribute("class", "ui-widget-header ui-corner-all");
	overlay.setAttribute("style", "position:fixed;top:0;width:80%;align:center;text-align:center;left:10%;z-index:2147483645;");
	body.appendChild(overlay);

	show_box = document.createElement("div");
	show_box.setAttribute("id", "show-box");
	show_box.title = "Please choose one of the languages";
	body.appendChild(show_box);

	show_links = document.createElement("div");
	show_links.setAttribute("id", "show-links");
	show_links.title = "Please choose one of the links";
	body.appendChild(show_links);

	edit_current = document.createElement("input");
        edit_current.setAttribute("id", "edit-current");
	edit_current.setAttribute("type", "submit");
	edit_current.setAttribute("onclick", "a11ypi.editPage();");
	edit_current.setAttribute("value", "Re-narrate this page");
	overlay.appendChild(edit_current);

	see_narration = document.createElement("input");
	see_narration.setAttribute("id", "see-narration");
	see_narration.setAttribute("type", "submit");
	see_narration.setAttribute("onclick", "a11ypi.showBox();");
	see_narration.setAttribute("value", "See narrations");
	see_narration.disabled = true;
	overlay.appendChild(see_narration);
	a11ypi.ajax();

	see_links = document.createElement("input");
	see_links.setAttribute("id", "see-links");
	see_links.setAttribute("type", "submit");
	see_links.setAttribute("onclick", "a11ypi.showBox1();");
	see_links.setAttribute("value", "List of pages narrated");
	see_links.disabled = true;
	overlay.appendChild(see_links);
	a11ypi.ajaxLinks1();

	blog_filter = document.createElement("select");
	blog_filter.setAttribute("id", "blog-filter");
	blog_filter.setAttribute("style", "min-width:200px;max-width:200px;");
	blog_filter.setAttribute("onclick", "a11ypi.blogFilter();");
	blog_option = document.createElement("option");
	blog_option.textContent = "Choose a blog name";
	blog_filter.appendChild(blog_option);
	blog_filter.disabled = true;
	overlay.appendChild(blog_filter);

	go = document.createElement("input");
	go.setAttribute("id", "go");
	go.setAttribute("type", "submit");
	go.setAttribute("onclick", "a11ypi.go();");
	go.setAttribute("value", "Go");
	go.disabled = true;
	overlay.appendChild(go);
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
			blogArray = [];
			for (var i=0; i< menu_list.length; i++)
			{
			    blogArray[i] = menu_list[i].split("http://")[1].split(".com")[0] + ".com";
			}
			blogArray.sort();
			for (var i=0; i < blogArray.length; i++)
			{
			    if ( i == 0 )
			    {
				opt = document.createElement("option");
				opt.textContent = blogArray[0];
				sel.appendChild(opt);
			    }
			    else if(blogArray[i] == blogArray[i-1])
			    { }
			        else 
			    {
				opt = document.createElement("option");
				opt.textContent = blogArray[i];
				sel.appendChild(opt);
			    }
			}
		    }
		}
	    }
	    xhr.open("POST","http://dev.a11y.in/blog",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
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
	a11ypi.testContext(); page_edit('4seiz', '4l85060vb9', '336e2nootv6nxjsvyjov', 'VISUAL', 'false', '');
	document.getElementById("renarrated_overlay").style.display = "none";
    },
};

$('html').bind('keypress', function(e)
	       {
			   if(e.keyCode == 118)
			   {
			       e.preventDefault();
			       //			       $('.blink').delay(400).fadeOut(400).delay(200).fadeIn(400).delay(400).fadeOut(400).delay(200).fadeIn(400);
			       setTimeout("$('.nav').addClass('blink')", 800);
			       setTimeout("$('.nav').removeClass('blink')", 2400);
			   }
		       });