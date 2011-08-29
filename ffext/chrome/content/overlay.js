var a11ypi = {
    auth : " ",
    loc:" ",
    elementTagName: " ",
    elementId: " ",
    onLoad: function() {
    // initialization code
	this.initialized = true;
	this.strings = document.getElementById("a11ypi-strings");
	gBrowser.addEventListener('contextmenu', a11ypi.captureElement, false);
    },
    captureElement : function(e)
    {
	elementId = e.originalTarget.id;
	elementTagName = e.originalTarget.tagName;
    },
    test:function(e)
    {
	if(e.originalTarget instanceof HTMLDocument)
	{
	    if(content.window.location.href != 'about:blank' || content.window.location.href != 'about:config')
	    {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
		    if(xhr.readyState == 4)
		    {
			if(xhr.responseText == "empty")
			{
			   
			}
			else
			{
			    var message = 'Re-narration available';
			    var nb = gBrowser.getNotificationBox();
			    var n = nb.getNotificationWithValue('re-narration available');
			    if(n) 
			    {
				n.label = message;
			    } 
			    else 
			    {
				// var buttons = [{
				// 	label: 'Button',
				// 	accessKey: 'B',
				// 	popup: '',
				// 	callback: null
				// }];
				
				const priority = nb.PRIORITY_INFO_HIGH;
				nb.appendNotification(message, 're-narration available',
						      'chrome://browser/skin/Info.png',
						      priority);
			    }
			}
		    }
		};
		xhr.open("POST","http://x.a11y.in/alipi/menu",true);
<<<<<<< HEAD
	//	xhr.open("POST","http://192.168.1.5/menu",true);
=======
>>>>>>> 7e3fb173bc60a771351a0d12954dff0b7240d5e8
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(String(content.window.location.href));
	    }
	}    
    },
    testContext : function()
    {
<<<<<<< HEAD
//    span = document.createElement("span");
    divs = content.document.getElementsByTagName("*");
    for(i=0; i<divs.length; i++) {
     if(divs[i].tagName != "HTML" && divs[i].tagName != "LINK" && divs[i].tagName != "SCRIPT" && divs[i].tagName != "META" && divs[i].tagName != "BODY" && divs[i].tagName != "IMG" && divs[i].m4pageeditcontrol != "true" && divs[i].tagName != "BUTTON") {
			    divs[i].setAttribute("m4pageedittype","text");
			    }
			    else if(divs[i].tagName == "IMG") {
			    divs[i].setAttribute("m4pageedittype","image")
			    }
			    }
			    var v = content.document.getElementsByTagName("body");
			    var a = content.document.createElement("script");
			    for (j=0; j<v.length; j++) {  
						  c = v[0].appendChild(a);
						  c.setAttribute("src","http://x.a11y.in/alipi/wsgi/page_edit.js");
						 // c.setAttribute("src","http://192.168.1.5/page_edit.js");
						  c.setAttribute("type","text/javascript");
						  }
						    //document.getElementById("overlay").style.display = "none";
						   
        /*var el = content.document.createElement('iframe');
	var sel = content.window.getSelection(); //.getRangeAt(0).cloneContents();
	var temp = sel.focusNode;
	if(elementTagName != 'IMG')
	{
	    if(sel.focusNode.parentNode.id == '' || sel.focusNode.parentNode.id == 'undefined')
	    {
		while(temp.parentNode.tagName != 'BODY')
		{
		    temp = temp.parentNode;
		    if(temp.id)
		    {
			var st = content.document.getElementById(temp.id);
			st.style.borderColor = "red";
			st.style.borderStyle = "dotted";
			if(confirm("This is the selection you have made for re-narration.  Do you want to expand the selection?"))
			{
			    st.style.borderColor = "";
			    st.style.borderStyle = "";
			    continue;
			}
			else
			{
			    x = content.document.getElementById(temp.id).appendChild(el);
			    el.setAttribute('src',"http://192.168.100.100/rich/index.html?parent="+encodeURIComponent(content.window.location.href)+"&id="+temp.id);
			    tName = content.document.getElementById(temp.id).tagName
			    el.setAttribute('id','MyFrame');
			    el.setAttribute('width','100%');
			    g = temp.innerHTML.replace('<iframe id="MyFrame" src="http://192.168.100.100/rich/index.html?parent='+encodeURIComponent(content.window.location.href)+'&amp;id='+temp.id+'" width="100%"></iframe>','');
			    h = g.replace(/\s{2,}/g,"");
			    alert("You Have selected "+h);
			    f = el.contentDocument.getElementById('richText');
			    if( tName == 'UL' || tName == 'OL')
			    {
				f.innerHTML = '<' + tName.toLowerCase() +'>' + h + '</' + tName.toLowerCase() +'>' ;
			    }
			    else 
			    {
				f.innerHTML = '<' + XPCNativeWrapper.unwrap(content.window.getSelection().focusNode.parentNode).tagName.toLowerCase() +'>' + sel.focusNode.wholeText + '</' + XPCNativeWrapper.unwrap(content.window.getSelection().focusNode.parentNode).tagName.toLowerCase() + '>';
			    }

			    content.document.getElementById('MyFrame').scrollIntoView();
			    break;
			}
		    }
		}
	    }
	    else
	    {
		var st = content.document.getElementById(temp.parentNode.id);
		content.document.getElementById(temp.parentNode.id).appendChild(el);
		el.setAttribute('src',"http://192.168.100.100/rich/index.html?parent="+encodeURIComponent(content.window.location.href)+"&id="+st.id);
		el.setAttribute('id','MyFrame');
		el.setAttribute('width','100%');
		st.style.borderColor = "red";
		st.style.borderStyle = "dotted";
		g = st.innerHTML.replace('<iframe id="MyFrame" src="http://192.168.100.100/rich/index.html?parent='+encodeURIComponent(content.window.location.href)+'&amp;id='+st.id+'" width="100%"></iframe>','');
		alert("You have selected the below content for re-narration"+g);
		f = el.contentDocument.getElementById('richText');
		f.innerHTML = g;
		a = content.document.getElementById('MyFrame');
		a.scrollIntoView();
	    }
	}
	else
	{
	    var st = content.document.getElementById(elementId);
	    content.document.getElementsByTagName('BODY')[0].appendChild(el);
	    el.setAttribute('src',"http://192.168.100.100/rich/indeximg.html?parent="+encodeURIComponent(content.window.location.href+"&id="+elementId));
	    el.setAttribute('id','MyFrame');
	    el.setAttribute('width','100%');
	    st.style.borderColor = "red";
	    st.style.borderStyle = "dotted";
	    alert("You have selected an image for replacment <img src="+'"'+content.document.getElementById(elementId).src+'"</img>');   
	    a = content.document.getElementById('MyFrame');
	    a.scrollIntoView();
	}*/
=======
    divs = content.document.getElementsByTagName("*");
    for(i=0; i<divs.length; i++) {
	if(divs[i].tagName != "HTML" && divs[i].tagName != "LINK" && divs[i].tagName != "SCRIPT" && divs[i].tagName != "META" && divs[i].tagName != "BODY" && divs[i].tagName != "IMG" && divs[i].m4pageeditcontrol != "true" && divs[i].tagName != "BUTTON") {
	 divs[i].setAttribute("m4pageedittype","text");
     }
     else if(divs[i].tagName == "IMG") {
				divs[i].setAttribute("m4pageedittype","image")
				}
    }
    var v = content.document.getElementsByTagName("body");
    var a = content.document.createElement("script");
    for (j=0; j<v.length; j++) {  
				c = v[0].appendChild(a);
				c.setAttribute("src","http://x.a11y.in/alipi/wsgi/page_edit.js");
				c.setAttribute("type","text/javascript");
			    }
>>>>>>> 7e3fb173bc60a771351a0d12954dff0b7240d5e8
    },
//yass code added
   getIndex : function (currentNode)
    {
    	var kids = currentNode.parentNode.childNodes;
    	var j = 0;
    	for(var i=0; i< kids.length; i++)
    	    {
    		if (currentNode.nodeName == kids[i].nodeName)
    		    j++;
    		if (currentNode == kids[i]) 
    		    {
    			return j; 
    		    }
    		else 
    		    continue;
    	    }
    	return -1;
    },    
//yass code added
    makePath : function (currentNode){
	var path = '';
	while(! currentNode.id)
	    {
		if (currentNode.tagName == 'body' || currentNode.tagName == 'BODY'){
           		path = '//'+currentNode.tagName+'/'+path;
           		path = path.substring(0, path.length -1);
           		return path;
       		}	
       		else{
		index = a11ypi.getIndex(currentNode);
		//alert(index); // 
		path = currentNode.tagName+'['+index+']/'+path;
		currentNode = currentNode.parentNode;
	    }
	}
	path = '//'+currentNode.tagName+'[@id='+"'"+currentNode.id+"'"+']/'+path;
	path = path.substring(0, path.length -1);
	return path;
    },
//yass code added
    getxPath : function (currentNode)
    {	//var currentNode = element;
    	var path = '';
    	var index = -1;
	
    	if (currentNode.nodeName != "#text")
    	    {
    		path = a11ypi.makePath(currentNode);
    	    }
    	else
    	    { 
    		path = a11ypi.makePath(currentNode.parentNode);
    	    }
	//alert("getxPath:\n"+path);
	return path;
    },    

    onMenuPopUp: function(e) {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"] //The service branch which handles the "Window".
	    .getService(Components.interfaces.nsIWindowMediator);
	var recentWindow = wm.getMostRecentWindow("navigator:browser");
	a11ypi.ajax(content.window.location);
	return "True";
    },
    createMenu: function(menu_list) {
	var xyz = document.getElementById("menu-button");
	for(var i in menu_list)
	{
	    var newel = document.createElement("menuitem");
	    newel.setAttribute("label",menu_list[i]);
	    newel.setAttribute("value",menu_list[i]);
	    newel.setAttribute("oncommand","a11ypi.getURL(event.target);");
	    xyz.appendChild(newel);
	}
    },
    clearMenu: function() {
	var xyz = document.getElementById("menu-button");
	while(null!= xyz.firstChild)
	{
	    xyz.removeChild(xyz.firstChild);
	}
    },
    ajax: function(url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == 4)
	    {
<<<<<<< HEAD
		if(xhr.responseText == "None")
=======
		if(xhr.responseText == "empty")
>>>>>>> 7e3fb173bc60a771351a0d12954dff0b7240d5e8
		{
		    a11ypi.clearMenu();
		}
		else
		{
		    a11ypi.createMenu(JSON.parse(xhr.responseText));
		}
	    }
	}
<<<<<<< HEAD
	xhr.open("POST","http://192.168.100.100/menu",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(String(url));
    },
//yass code added    
    evaluate: function(path,newContent){
        //evaluate the path
        var nodes = content.document.evaluate(path, content.document, null, XPathResult.ANY_TYPE,null);
        try{
            var result = nodes.iterateNext();
            while (result)
                {
                    if (result.nameTag == "img" || result.nameTag =='IMG'){
                        result.setAttribute('src',newContent);
                    }
                    else{
                        result.textContent = newContent;
                    }
                    result=nodes.iterateNext();
                }
        }
        catch (e)
            {
                dump( 'error: Document tree modified during iteration ' + e );
            }
    },
//yass code added
=======
	xhr.open("POST","http://x.a11y.in/alipi/menu",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(String(url));
    },
>>>>>>> 7e3fb173bc60a771351a0d12954dff0b7240d5e8
    getURL: function(e) {
	//var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	//var recentWindow = wm.getMostRecentWindow("navigator:browser");
	//recentWindow ? recentWindow.content.document.location : null;
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
			    
			    d ={}
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
			    a11ypi.evaluate(path,newContent);
			    }
			}
		}
	}
	var url = content.window.location;
	var lang=e.getAttribute("value");
	var data="url="+encodeURIComponent(url)+"&lang="+encodeURIComponent(lang);
	
<<<<<<< HEAD
	xhr.open("POST","http://192.168.100.100/replace",true);
=======
	xhr.open("POST","http://x.a11y.in/alipi/replace",true);
>>>>>>> 7e3fb173bc60a771351a0d12954dff0b7240d5e8
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
	
	///content.window.location = "http://localhost/replace?url="+url+"&lang="+e.getAttribute("value");
	//content.window.reload();
     },
<<<<<<< HEAD

    getNarration: function() {
	var doc = content.document;
    	//we get the selections 
    	var selection =  content.window.getSelection();
    	var str = '';
    	var currentNode = selection.getRangeAt(0).commonAncestorContainer;
	var xpath = a11ypi.getxPath(currentNode);
	
	var xhr = new XMLHttpRequest();
	var url = content.window.location;
	var data="url="+encodeURIComponent(url)+"&xpath="+encodeURIComponent(xpath);

	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == 4)
		{
		    if(xhr.responseText =='empty')
			{
			    alert("There is no re-narration available for this element!");
			}
		    else
			{
			    //alert(xhr.responseText);
			    d ={}
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
			    data = d['data'];
			    alert(path+'\n'+data);
			    }
			}
		}
	}
		
	xhr.open("POST","http://localhost/narration",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
	
	///content.window.location = "http://localhost/replace?url="+url+"&lang="+e.getAttribute("value");
	//content.window.reload();
    },

     
   /* getURL: function(e) {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"] //The service branch which handles the "Window".
	    .getService(Components.interfaces.nsIWindowMediator);
	var recentWindow = wm.getMostRecentWindow("navigator:browser");
	recentWindow ? recentWindow.content.document.location : null;
	var url = content.window.location;
	content.window.location = "http://192.168.100.100/replace?url="+url+"&lang="+e.getAttribute("value");
	content.window.reload();
    },*/
=======
    evaluate: function(path,newContent){

        //evaluate the path

        var nodes = content.document.evaluate(path, content.document, null, XPathResult.ANY_TYPE,null);

        try{

            var result = nodes.iterateNext();

            while (result)

                {

                    if (result.nameTag == "img" || result.nameTag =='IMG'){

                        result.setAttribute('src',newContent);

                    }

                    else{

                        result.textContent = newContent;

                    }

                    result=nodes.iterateNext();

                }

        }

        catch (e)

            {

                dump( 'error: Document tree modified during iteration ' + e );

            }

    }, 
>>>>>>> 7e3fb173bc60a771351a0d12954dff0b7240d5e8
};
window.addEventListener("load", function () { a11ypi.onLoad(); }, false);gBrowser.addEventListener("DOMContentLoaded", a11ypi.test, false);
