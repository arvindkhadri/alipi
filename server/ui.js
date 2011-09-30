var a11ypi = {
    auth : " ",
    loc:" ",
    elementTagName: " ",
    elementId: " ",
    flag : 0,
    testContext : function()
    {
	$(document).ready(function(){$('body *').contents().filter(function() {return (this.nodeType == 3) && this.nodeValue.match(/\S/);}).wrap('<span m4pageedittype=text/>')});
	vimg = document.getElementsByTagName('img');
	for(i=0;i<vimg.length;i++)
	{
	    vimg[i].setAttribute('m4pageedittype','image');
	}
<<<<<<< Updated upstream
	var v = document.getElementsByTagName("body");
	var a = document.createElement("script");
	c = v[0].appendChild(a);
	c.setAttribute("src","http://192.168.100.104/wsgi/page_edit.js");
	c.setAttribute("type","text/javascript");

	v[0].removeChild(document.getElementById('ren_overlay'));
	v[0].removeChild(document.getElementById('overlay1'));
	v[0].removeChild(document.getElementById('overlay2'));

	msg_overlay = document.createElement("div");
	v[0].appendChild(msg_overlay);
	msg_overlay.setAttribute("id", "msg-overlay");
	msg_overlay.textContent = "Now your page is ready to edit... Enjoy editing !!";

	setTimeout("document.getElementById('msg-overlay').style.display='none'", 30000);	
=======
	var v = content.document.getElementsByTagName("body");
	var a = content.document.createElement("script");
	for (j=0; j<v.length; j++) {  
	    c = v[0].appendChild(a);
	    c.setAttribute("src","http://192.168.100.100/server/wsgi/page_edit.js");

	    c.setAttribute("type","text/javascript");
	}
>>>>>>> Stashed changes
    },
    createMenu: function(menu_list) {
	var xyz = document.getElementById("menu-button");
	for(var i in menu_list)
	{
	    var newel = document.createElement("option");
	    newel.textContent = menu_list[i];
	    newel.setAttribute("value",menu_list[i]);
	    newel.setAttribute("onclick","a11ypi.getURL(event.target);");
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
			a11ypi.createMenu(JSON.parse(xhr.responseText));
		    }
		}
	    }
<<<<<<< Updated upstream
	    xhr.open("POST","http://localhost/alipi/menu",true);
=======
	    xhr.open("POST","http://192.168.100.100/wsgi/menu",true);
>>>>>>> Stashed changes
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    xhr.send(String(content.window.location.search.split('=')[1]));
	}
    },
    getURL: function(e) {
	content.window.location = content.window.location.href + "&lang=" + e.value;
	window.reload();
<<<<<<< Updated upstream
=======
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
			a11ypi.evaluate(path,newContent);
		    }
		}
	    }
	}
	var url = window.location.search.split('?')[1].split('=')[1].split('&')[0];
	var lang= window.location.search.split('&')[1].split('=')[1];
	var data="url="+encodeURIComponent(url)+"&lang="+encodeURIComponent(lang);
	
	xhr.open("POST","http://192.168.100.100/wsgi/replace",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
    },
    evaluate: function()
    {
	var nodes = content.document.evaluate(path, content.document, null, XPathResult.ANY_TYPE,null);

        try{

            var result = nodes.iterateNext();

            while (result)

            {

                if (result.tagName == "img" || result.tagName =='IMG'){
                    result.setAttribute('src',newContent.split(',')[1]);  //A hack to display images properly, the size has been saved in the database.
		    width = newContent.split(',')[0].split('x')[0];
		    height = newContent.split(',')[0].split('x')[1];
		    result.setAttribute('width',width);
		    result.setAttribute('height', height);

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

>>>>>>> Stashed changes
    },
    close_msg: function() {
	// var v = document.getElementsByTagName("body");
	// v[0].removeChild(document.getElementById('ren_overlay'));
	document.getElementById('ren_overlay').style.display = 'none';
    },

};
