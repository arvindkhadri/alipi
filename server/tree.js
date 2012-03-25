var labelType, useGradients, nativeTextSupport, animate;

(function() {
    var ua = navigator.userAgent,
    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
    typeOfCanvas = typeof HTMLCanvasElement,
    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
    textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();


function init(){
    //init data
    var json = {
        "id": "target",
        "name": "Target",
        "children": [
	    // Location
	    {
		"id": "location",
		"name": "Location",
		"data": {
                    "band": "Target",
                    "relation": "coordinators.html"
		},
		"children": [{
                    "id": "bangalore",
                    "name": "Bangalore",
                    "data": {
			"band": "Location",
			"relation": "individual_ranganathan.html"
                    },
                    "children": []
		}, {
                    "id": "mysore",
                    "name": "Mysore",
                    "data": {
			"band": "Location",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		}, {
                    "id": "hyderabad",
                    "name": "Hyderabad",
                    "data": {
			"band": "Location",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		},  {
                    "id": "bengal",
                    "name": "Bengal",
                    "data": {
			"band": "Location",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		},  {
                    "id": "delhi",
                    "name": "Delhi",
                    "data": {
			"band": "Location",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		}, {
                    "id": "chennai",
                    "name": "Chennai",
                    "data": {
			"band": "Location",
			"relation": "individual_muralimohan.html"
                    },
                    "children": []
		}]
            }, 
    // Languages
	    {
		"id": "languages",
		"name": "Languages",
		"data": {
		    "band": "Target",
		    "relation": "cultural.html"
		},
		"children": [{
		    "id": "kannada",
		    "name": "Kannada",
		    "data": {
			"band": "Languages",
			"relation": "project_murals.html"
		    },
		    "children": []
		}, {
		    "id": "english",
		    "name": "English",
		    "data": {
			"band": "Languages",
			"relation": "project_knowledge.html"
		    },
		    "children": []
		}, {
		    "id": "marathi",
		    "name": "Marathi",
		    "data": {
			"band": "Languages",
			"relation": "project_crafts.html"
		    },
		    "children": []
		}, {
		    "id": "hindi",
		    "name": "Hindi",
		    "data": {
			"band": "Languages",
			"relation": "project_interfaces.html"
		    },
		    "children": []
		}, {
		    "id": "tamil",
		    "name": "Tamil",
		    "data": {
			"band": "Languages",
			"relation": "project_intagible.html"
		    },
		    "children": []
		}, {
		    "id": "telgu",
		    "name": "Telgu",
		    "data": {
			"band": "Languages",
			"relation": "project_original.html"
		    },
		    "children": []
		}, {
		    "id": "gujurathi",
		    "name": "Gujurathi",
		    "data": {
			"band": "Languages",
			"relation": "project_memorilization.html"
		    },
		    "children": []
		}, {
		    "id": "bengali",
		    "name": "Bengali",
		    "data": {
			"band": "Languages",
			"relation": "project_design.html"
		    },
		    "children": []
		}]
	    },
	    // Style
	    {
		"id": "style",
		"name": "Style",
		"data": {
		    "band": "Target",
		    "relation": "technology.html"
		},
		"children": [{
		    "id": "summary",
		    "name": "Summary",
		    "data": {
			"band": "Style",
			"relation": "project_features.html"
		    },
		    "children": []
		}, {
		    "id": "abstract",
		    "name": "Abstract",
		    "data": {
			"band": "Style",
			"relation": "project_ontologies.html"
		    },
		    "children": []
		}, {
		    "id": "simplification",
		    "name": "Simplification",
		    "data": {
			"band": "Style",
			"relation": "project_representation.html"
		    },
		    "children": []
		}, {
		    "id": "transilation",
		    "name": "Transilation",
		    "data": {
			"band": "Style",
			"relation": "project_3dsurface.html"
		    },
		    "children": []
		}, {
		    "id": "funny",
		    "name": "Funny",
		    "data": {
			"band": "Style",
			"relation": "project_immersion.html"
		    },
		    "children": []
		}, {
		    "id": "imaginary",
		    "name": "Imaginary",
		    "data": {
			"band": "Style",
			"relation": "project_haptic.html"
		    },
		    "children": []
		}]
	    }],
	"data": {
	    "relation": "index.html"
	}
    };
    //end
    var infovis = document.getElementById('infovis');
    var w = infovis.offsetWidth - 0, h = infovis.offsetHeight - 0;
    
    //init Hypertree
    var ht = new $jit.Hypertree({
	//id of the visualization container
	injectInto: 'infovis',
	//canvas width and height
	width: w,
	height: h,
	//Change node and edge styles such as
	//color, width and dimensions.
	Node: {
            dim: 2.5,
            color: "#555"
	},
	Edge: {
	    lineWidth: 1,
            color: "#222"
	},

	// On hover
	Tips: {  
	    enable: true,  
	    onShow: function(tip, node) {
		ht.tips.config.offsetX = "10";
		ht.tips.config.offsetY = "10";
//		tip.addEventListener("click", alert('hello'), false);
 		tip.innerHTML = "<div id=\"value\" class=\"tip-title\" style=\"text-align:center;\">" + node.name + "</div>";
//		    + node.data.relation + " style=\"color:#fff;\">" + node.name + "</a></div>";    
 	    } 
	},  

	//Attach event handlers and add text to the
	//labels. This method is only triggered on label
	//creation
	onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            $jit.util.addEvent(domElement, 'click', function () {
		ht.onClick(node.id, {
                    onComplete: function() {
			ht.controller.onComplete();
                    }
		});
            });
	},
	//Change node styles when labels are placed
	//or moved.
	onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';
	    ht.controller.Node.transform = false;
	    ht.controller.Edge.alpha = "0.3";
            if (node._depth == 0) {
		style.fontSize = "0.8em";
		style.color = "#111";	    
            } else if(node._depth == 1){
		style.fontSize = "0.9em";
		style.color = "#222";
            }
	    else {
		style.display = 'none';
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
	},
    });
    //load JSON data.
    ht.loadJSON(json);
    //compute positions and plot.
    ht.refresh();
    //end
    ht.controller.onComplete();
}