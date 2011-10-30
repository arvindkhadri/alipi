from flask import Flask
from flask import request
import lxml.html
import cgi
import pymongo
from bson import Code
import urllib2
import StringIO
import gdata.gauth
import gdata.blogger.client
from flask import g
from flask import redirect
app = Flask(__name__)
@app.route('/')
def start_page() :
    d = {}
    d['foruri'] = request.args['foruri']
    myhandler1 = urllib2.Request(d['foruri'],headers={'User-Agent':"Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11"}) #A fix to send user-agents, so that sites render properly.
    a = urllib2.urlopen(myhandler1)
    page = a.read()
    a.close()
    try:
        page = unicode(page,'utf-8')  #Hack to fix improperly displayed chars on wikipedia.
    except UnicodeDecodeError:
        pass #Some pages may not need be utf-8'ed
    root = lxml.html.parse(StringIO.StringIO(page)).getroot()
    if request.args.has_key('lang') == False and request.args.has_key('blog') == False:
        root.make_links_absolute(d['foruri'], resolve_base_href = True)
        script_test = root.makeelement('script')
        root.body.append(script_test)
        script_test.set("src", "http://dev.a11y.in/alipi/ui.js")
        script_test.set("type", "text/javascript")
        
        script_jq_mini = root.makeelement('script')
        root.body.append(script_jq_mini)
        script_jq_mini.set("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js")
        script_jq_mini.set("type", "text/javascript")
        
        style = root.makeelement('link')
        root.body.append(style)
        style.set("rel","stylesheet")
        style.set("type", "text/css")
        style.set("href", "http://dev.a11y.in/alipi/stylesheet.css")

        connection = pymongo.Connection('localhost',27017)
        db = connection['alipi']
        collection = db['post']
        if collection.find_one({"about" : request.args['foruri']}) is not None:
            ren_overlay = root.makeelement('div')
            root.body.append(ren_overlay)
            ren_overlay.set("id", "ren_overlay")
            ren_overlay.text = "Narration(s) available"

            close = root.makeelement('input')
            ren_overlay.append(close)
            close.set("id", "close-button")
            close.set("type", "submit")
            close.set("onClick", "a11ypi.close();")
            close.set("value", "Close")

            overlay1 = root.makeelement('div')
            root.body.append(overlay1)
            overlay1.set("id", "overlay1")

            opt = root.makeelement('option')
            opt.text = "Choose a narration"

            rpl = root.makeelement('select')
            overlay1.append(rpl)
            rpl.append(opt)
            rpl.set("id", "menu-button")
            rpl.set("onclick", "a11ypi.ajax();")
        
        overlay2 = root.makeelement('div')
        root.body.append(overlay2)
        overlay2.set("id", "overlay2")
        
        btn = root.makeelement('input')
        overlay2.append(btn)
        btn.set("id", "edit-button")
        btn.set("type", "submit")
        btn.set("onClick", "a11ypi.testContext();")
        btn.set("value", "EDIT")
        return lxml.html.tostring(root)

    elif request.args.has_key('lang') == True and request.args.has_key('blog') == False:
        d['lang'] = request.args['lang']
        script_test = root.makeelement('script')
        root.body.append(script_test)
        script_test.set("src", "http://dev.a11y.in/alipi/ui.js")
        script_test.set("type", "text/javascript")
        root.body.set("onload","a11ypi.ren()");
        root.make_links_absolute(d['foruri'], resolve_base_href = True)
        return lxml.html.tostring(root)

    elif request.args.has_key('interactive') == True and request.args.has_key('blog') == True:
        script_test = root.makeelement('script')
        root.body.append(script_test)
        script_test.set("src", "http://dev.a11y.in/alipi/ui.js")
        script_test.set("type", "text/javascript")
        root.body.set("onload","a11ypi.filter()");
        root.make_links_absolute(d['foruri'], resolve_base_href = True)
        return lxml.html.tostring(root)

    elif request.args.has_key('interactive') == False and request.args.has_key('blog') == True:    
        script_test = root.makeelement('script')
        root.body.append(script_test)
        script_test.set("src", "http://dev.a11y.in/alipi/ui.js")
        script_test.set("type", "text/javascript")
        
        script_jq_mini = root.makeelement('script')
        root.body.append(script_jq_mini)
        script_jq_mini.set("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js")
        script_jq_mini.set("type", "text/javascript")
        
        style = root.makeelement('link')
        root.body.append(style)
        style.set("rel","stylesheet")
        style.set("type", "text/css")
        style.set("href", "http://dev.a11y.in/alipi/stylesheet.css")

        connection = pymongo.Connection('localhost',27017)
        db = connection['alipi']
        collection = db['post']
        if collection.find_one({"about" : request.args['foruri']}) is not None:
            ren_overlay = root.makeelement('div')
            root.body.append(ren_overlay)
            ren_overlay.set("id", "ren_overlay")
            ren_overlay.text = "Narration(s) available"

            close = root.makeelement('input')
            ren_overlay.append(close)
            close.set("id", "close-button")
            close.set("type", "submit")
            close.set("onClick", "a11ypi.close();")
            close.set("value", "Close")

            overlay1 = root.makeelement('div')
            root.body.append(overlay1)
            overlay1.set("id", "overlay1")

            opt = root.makeelement('option')
            opt.text = "Choose a narration"

            rpl = root.makeelement('select')
            overlay1.append(rpl)
            rpl.append(opt)
            rpl.set("id", "menu-button")
            rpl.set("onclick", "a11ypi.ajax1();")
        
        overlay2 = root.makeelement('div')
        root.body.append(overlay2)
        overlay2.set("id", "overlay2")
        
        btn = root.makeelement('input')
        overlay2.append(btn)
        btn.set("id", "edit-button")
        btn.set("type", "submit")
        btn.set("onClick", "a11ypi.testContext();")
        btn.set("value", "EDIT")
        root.make_links_absolute(d['foruri'], resolve_base_href = True)
        return lxml.html.tostring(root)

@app.route('/login')
def do_login():
    CONSUMER_SECRET = 'xDNhUo4MrsYCdSVLT1UDrkO7'
    CONSUMER_KEY = 'dev.a11y.in'
    client = gdata.blogger.client.BloggerClient(source='Alipi')
    SCOPES = ['http://www.blogger.com/feeds']
    oauth_callback_url = 'http://dev.a11y.in/take_token'
    request_token = client.GetOAuthToken(SCOPES, oauth_callback_url, CONSUMER_KEY, consumer_secret=CONSUMER_SECRET)
    g.my_token = request_token
    return redirect('google.com')
#    return redirect(request_token.generate_authorization_url(),code=302)

@app.route('/take_token')
def post_to_blog():
    request_token = gdata.gauth.AuthorizeRequestToken(g.my_token, request.uri)
    access_token = client.GetAccessToken(request_token)
    client = gdata.blogger.client.BloggerClient(source='yourCo-yourAppName-v1')
    client.auth_token = gdata.gauth.OAuthHmacToken(CONSUMER_KEY, CONSUMER_SECRET, request_token.token,request_token.token_secret, gdata.gauth.ACCESS_TOKEN)
    feed = client.GetFeed()
    for entry in feed.entry:
        return entry

import logging,os
from logging import FileHandler

fil = FileHandler(os.path.join(os.path.dirname(__file__),'logme'),mode='a')
fil.setLevel(logging.ERROR)
app.logger.addHandler(fil)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
