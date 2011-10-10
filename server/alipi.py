from flask import Flask
from flask import request
import lxml.html
import cgi
import pymongo
from bson import Code
import urllib2
import StringIO
app = Flask(__name__)
@app.route('/')
def start_page() :
    d = {}
    d['foruri'] = request.args['foruri']
#    myhandler = urllib2.ProxyHandler({'http':'http://proxy.iiit.ac.in:8080/'})
#    opener = urllib2.build_opener(myhandler)
#    urllib2.install_opener(opener)
    a = urllib2.urlopen(d['foruri'])
    page = a.read()
    a.close()
    root = lxml.html.parse(StringIO.StringIO(page)).getroot()
    if request.args.has_key('lang') == False:
        root.make_links_absolute(d['foruri'], resolve_base_href = True)
        script_test = root.makeelement('script')
        root[0].append(script_test)
        script_test.set("src", "http://192.168.100.100/server/ui.js")
        script_test.set("type", "text/javascript")
        
        script_jq_mini = root.makeelement('script')
        root[0].append(script_jq_mini)
        script_jq_mini.set("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js")
        script_jq_mini.set("type", "text/javascript")
        
        style = root.makeelement('link')
        root[0].append(style)
        style.set("rel","stylesheet")
        style.set("type", "text/css")
        style.set("href", "http://192.168.100.100/server/stylesheet.css")

        connection = pymongo.Connection('localhost',27017)
        db = connection['alipi']
        collection = db['post']
        if collection.find_one({"url" : request.args['foruri']}) is not None:
            ren_overlay = root.makeelement('div')
            root[0].append(ren_overlay)
            ren_overlay.set("id", "ren_overlay")
            ren_overlay.text = "Narration(s) available"

            close = root.makeelement('input')
            ren_overlay.append(close)
            close.set("id", "close-button")
            close.set("type", "submit")
            close.set("onClick", "a11ypi.close();")
            close.set("value", "Close")

            overlay1 = root.makeelement('div')
            root[0].append(overlay1)
            overlay1.set("id", "overlay1")

            opt = root.makeelement('option')
            opt.text = "Choose a narration"

            rpl = root.makeelement('select')
            overlay1.append(rpl)
            rpl.append(opt)
            rpl.set("id", "menu-button")
            rpl.set("onclick", "a11ypi.ajax();")
        
        overlay2 = root.makeelement('div')
        root[0].append(overlay2)
        overlay2.set("id", "overlay2")
        
        btn = root.makeelement('input')
        overlay2.append(btn)
        btn.set("id", "edit-button")
        btn.set("type", "submit")
        btn.set("onClick", "a11ypi.testContext();")
        btn.set("value", "EDIT")
        return lxml.html.tostring(root)

    else:
        d['lang'] = request.args['lang']
        script_test = root.makeelement('script')
        root[0].append(script_test)
        script_test.set("src", "http://192.168.100.100/server/ui.js")
        script_test.set("type", "text/javascript")
        root.body.set("onload","a11ypi.ren()");
        # connection = pymongo.Connection('localhost',27017)
        # db = connection['alipi']
        # collection = db['post']
        # query = collection.group(
        #     key = Code('function(doc){return {"xpath" : doc.xpath, "url": doc.url}}'),
        #     condition={"url" : request.args['foruri'], "lang" : request.args['lang']},
        #     initial={'narration': []},
        #     reduce=Code('function(doc,out){out.narration.push(doc);}')
        #     )
        # if len(query)==0:
        #     return 'empty'
        # else:
        #     for key in query:
        #         post = key['narration'][len(key['narration'])-1] #for now, we only take the first re-narations, after we'll pick regarding filters.
           
        #         el = root.xpath('.//*[' + post['xpath'].split('/',2)[2].split('[',1)[1].lower())
        #         el[0].text = post['data']

        root.make_links_absolute(d['foruri'], resolve_base_href = True)
        return lxml.html.tostring(root)

import logging
from logging import FileHandler

fil = FileHandler('/var/www/logme',mode='a')
fil.setLevel(logging.ERROR)
app.logger.addHandler(fil)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
