function insert_id() {
    span = document.createElement("span");
    divs = document.getElementsByTagName("*");
    for(i=0; i<divs.length; i++) {
     if(divs[i].tagName != "HTML" && divs[i].tagName != "LINK" && divs[i].tagName != "SCRIPT" && divs[i].tagName != "META" && divs[i].tagName != "BODY" && divs[i].tagName != "IMG" && divs[i].m4pageeditcontrol != "true" && divs[i].tagName != "BUTTON") {
			    divs[i].setAttribute("m4pageedittype","text");
			    }
			    else if(divs[i].tagName == "IMG") {
			    divs[i].setAttribute("m4pageedittype","image")
			    }
			    }
			    v = document.getElementsByTagName("BODY");
			    a = document.createElement("script");
			    for (j=0; j<v.length; j++) {  
						  c = v[0].appendChild(a);
						  c.setAttribute("src","page_edit.js");
						  c.setAttribute("type","text/javascript");
						  }
						    document.getElementById("overlay").style.display = "none";
						  }
