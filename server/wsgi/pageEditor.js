
var pageEditor = {
    startEdit: function(event)
    {
	if($(event.target).attr('m4pageedittype') == 'text')
	{
	    event.target.removeAttribute('m4pageedittype');
	    editor = document.createElement("div");
	    editor.setAttribute("id", "editoroverlay");
	    editor.setAttribute("title", "Edit window");
	    editor.setAttribute("alipielements", "alipi");
	    editor.setAttribute("class", "ui-widget-header ui-corner-all");
	    document.body.appendChild(editor);

	    refLabel= document.createElement("label");
	    refLabel.innerHTML = 'Reference';
	    refLabel.setAttribute("style", "position:absolute;top:5%;left:20%;color:#000;font-size:25px;");
	    editor.appendChild(refLabel);
	    
	    refBox= document.createElement("div");
	    refBox.setAttribute("id","reference");
	    refBox.setAttribute("readonly", 'yes');
	    refBox.setAttribute("style","position:absolute;top:15%;left:4%;min-width:450px;max-width:450px;min-height:370px;max-height:370px;text-align:justify;color:#000;font-weight:normal;");
	    editor.appendChild(refBox);
	    refBox.textContent = '<'+event.target.tagName+'>'+event.target.innerHTML+'</'+event.target.tagName+'>';

	    editLabel= document.createElement("label");
	    editLabel.innerHTML = 'Editor';
	    editLabel.setAttribute("style", "position:absolute;top:5%;left:70%;color:#000;font-size:25px;");
	    editor.appendChild(editLabel);
	    
	    editBox= document.createElement("div");
	    editBox.setAttribute("id","editor");
	    editBox.setAttribute("alipielements", "alipi");
	    editBox.setAttribute("contenteditable", true);
	    editBox.setAttribute("style","position:absolute;top:15%;left:51%;min-width:450px;max-width:450px;min-height:370px;max-height:370px;font-size:15;text-align:justify;color:#000;font-weight:normal;");
	    editor.appendChild(editBox);
	    editBox.innerHTML = event.target.innerHTML;

	    forPrevData = document.createElement("div");
	    forPrevData.setAttribute("id","forPrevData");
	    forPrevData.setAttribute("style","display:none;height:1px;width:1px;");
	    editor.appendChild(forPrevData);
	    $( "#editoroverlay" ).dialog({
		width:1000,
		height:550,
		modal: true,
		buttons: {
		    "+": function() {
			if(document.getElementById('editor').style.fontSize == '30px'){
			    // passthrough
			} else {
			    document.getElementById('editor').style.fontSize = parseFloat(document.getElementById('editor').style.fontSize) + 1 + 'px';
			    document.getElementById('reference').style.fontSize = parseFloat(document.getElementById('reference').style.fontSize) + 1 + 'px';
			}
		    },
		    "-": function() {
			if(document.getElementById('editor').style.fontSize == '10px'){
			} else {
			    document.getElementById('editor').style.fontSize = parseFloat(document.getElementById('editor').style.fontSize) - 1 + 'px';
			    document.getElementById('reference').style.fontSize = parseFloat(document.getElementById('reference').style.fontSize) - 1 + 'px';
			}
		    },
		    OK: function() {
			//textElement = new TextElementPopup(pageEditor, true);
			//textElement.textButtonOnClick();
			event.target.innerHTML = document.getElementById('editor').innerHTML;
			event.target.setAttribute('m4pageedittype','text');
			$( "#editoroverlay" ).remove();
			
		    }				    
		},
		close: function() {
		    //		    document.getElementById("alipiSelectedElement").removeAttribute("id", "alipiSelectedElement");
		    $( "#editoroverlay" ).remove();
		}
	    });
	}
	else if($(event.target).attr('m4pageedittype') == 'image')
	{
	    var src = prompt("Enter the url");
	    $(event.target).attr('src',src);
	    console.log(DOM.getXpath(event.target));
	}
	
    },
};

var DOM = {
    getXpath : function getXPath(element)
    {
	var str = '';
	var currentNode = element;
	var path = '';
	var index = -1;
	// if ( currentNode == undefined) {
	//     currentNode = document.getElementById("alipiSelectedElement");
	// }

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
	if(elt.tagName != 'IMG')
	    elt = elt.parentNode;
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
};