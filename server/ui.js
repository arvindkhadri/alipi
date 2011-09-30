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
	var v = content.document.getElementsByTagName("body");
	var a = content.document.createElement("script");
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
	    xhr.open("POST","http://localhost/alipi/menu",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    xhr.send(String(content.window.location.search.split('=')[1]));
	}
    },
    getURL: function(e) {
	content.window.location = content.window.location.href + "&lang=" + e.value;
	window.reload();
    },
    close_msg: function() {
	// var v = content.document.getElementsByTagName("body");
	// v[0].removeChild(document.getElementById('ren_overlay'));
	document.getElementById('ren_overlay').style.display = 'none';
    },

};