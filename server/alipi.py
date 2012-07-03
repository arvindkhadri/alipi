from flask import Flask
from flask import request
from flask import render_template
import lxml.html
import pymongo
from bson import Code
import urllib2
import StringIO
from flask import g
from flask import redirect
from urllib import quote_plus
from urllib import unquote_plus
import conf
import oursql
from flask import jsonify
app = Flask(__name__)
@app.before_request
def first():
    g.connection = pymongo.Connection('localhost',27017) #Create the object once and use it.
    g.db = g.connection[conf.MONGODB[0]]
@app.teardown_request
def close(exception):
    g.connection.disconnect()
@app.route('/')
def start_page() :
    d = {}
    d['foruri'] = request.args['foruri']
    myhandler1 = urllib2.Request(d['foruri'],headers={'User-Agent':"Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11"}) #A fix to send user-agents, so that sites render properly.
    try:
        a = urllib2.urlopen(myhandler1)
        if a.geturl() != d['foruri']:
            return "There was a server redirect, please click on the <a href='http://dev.a11y.in/web?foruri={0}'>link</a> to continue.".format(quote_plus(a.geturl()))
        else:
            page = a.read()
            a.close()
    except ValueError:
        return "The link is malformed, click <a href='http://dev.a11y.in/web?foruri={0}&lang={1}&interactive=1'>here</a> to be redirected.".format(quote_plus(unquote_plus(d['foruri'].encode('utf-8'))),request.args['lang'])
    except urllib2.URLError:
        return render_template('error.html')
    try:
        page = unicode(page,'utf-8')  #Hack to fix improperly displayed chars on wikipedia.
    except UnicodeDecodeError:
        pass #Some pages may not need be utf-8'ed
    try:
        g.root = lxml.html.parse(StringIO.StringIO(page)).getroot()
    except ValueError:
        g.root = lxml.html.parse(d['foruri']).getroot() #Sometimes creators of the page lie about the encoding, thus leading to this execption. http://lxml.de/parsing.html#python-unicode-strings
    if request.args.has_key('lang') == False and request.args.has_key('blog') == False:
        g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
        for i in g.root.iterlinks():
            if i[1] == 'href' and i[0].tag != 'link':
                try:
                    i[0].attrib['href'] = 'http://{0}?foruri={1}'.format(conf.DEPLOYURL[0],quote_plus(i[0].attrib['href']))
                except KeyError:
                    i[0].attrib['href'] = '{0}?foruri={1}'.format(conf.DEPLOYURL[0],quote_plus(i[0].attrib['href'].encode('utf-8')))
        setScripts() 
        g.root.body.set("onload","a11ypi.loadOverlay();")
        return lxml.html.tostring(g.root)

    elif request.args.has_key('lang') == True and request.args.has_key('interactive') == True and request.args.has_key('blog') == False:
        setScripts()
        setSocialScript()
        g.root.body.set("onload","a11ypi.ren();a11ypi.tweet(); a11ypi.facebook(); a11ypi.loadOverlay();")
        g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
        return lxml.html.tostring(g.root)
        
    elif request.args.has_key('lang') == True and request.args.has_key('blog') == False:
        script_jq_mini = g.root.makeelement('script')
        g.root.body.append(script_jq_mini)
        script_jq_mini.set("src", conf.JQUERYURL[0] + "/jquery-1.7.min.js")
        script_jq_mini.set("type", "text/javascript")
        d['lang'] = request.args['lang']
        script_test = g.root.makeelement('script')
        g.root.body.append(script_test)
        script_test.set("src", conf.APPURL[0] + "/server/ui.js")
        script_test.set("type", "text/javascript")
        g.root.body.set("onload","a11ypi.ren()");
        return lxml.html.tostring(g.root)

    elif request.args.has_key('interactive') == True and request.args.has_key('blog') == True and request.args.has_key('lang') == True:
        setScripts()
        setSocialScript()
        g.root.body.set("onload","a11ypi.filter(); a11ypi.tweet(); a11ypi.facebook(); a11ypi.loadOverlay();");
        g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
        return lxml.html.tostring(g.root)

    elif request.args.has_key('interactive') == False and request.args.has_key('blog') == True:    
        setScripts()
        g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
        g.root.body.set('onload', 'a11ypi.loadOverlay();')
        return lxml.html.tostring(g.root)

def setScripts():
    script_test = g.root.makeelement('script')
    script_edit = g.root.makeelement('script')
    g.root.body.append(script_test)
    g.root.body.append(script_edit)
    script_test.set("src", conf.APPURL[0] + "/server/ui.js")
    script_test.set("type", "text/javascript")
    script_edit.set("src", conf.APPURL[0] + "/server/wsgi/pageEditor.js")
    script_edit.set("type","text/javascript")
    script_config = g.root.makeelement('script')
    g.root.body.append(script_config)
    script_config.set("src", conf.APPURL[0] + "/server/config.js")
    script_config.set("type", "text/javascript")

    
    script_jq_mini = g.root.makeelement('script')
    g.root.body.append(script_jq_mini)
    script_jq_mini.set("src", conf.JQUERYURL[0] + "/jquery-1.7.min.js")
    script_jq_mini.set("type", "text/javascript")
    
    style = g.root.makeelement('link')
    g.root.body.append(style)
    style.set("rel","stylesheet")
    style.set("type", "text/css")
    style.set("href", conf.APPURL[0] + "/server/stylesheet.css")

    script_jq_cust = g.root.makeelement('script')
    g.root.body.append(script_jq_cust)
    script_jq_cust.set("src", conf.JQUERYUI[0] + "/jquery-ui.min.js")
    script_jq_cust.set("type", "text/javascript")

    style_cust = g.root.makeelement('link')
    style_cust.set("rel","stylesheet")
    style_cust.set("type", "text/css")
    style_cust.set("href", conf.JQUERYCSS[0] + "/jquery-ui.css")
    g.root.body.append(style_cust)
    
def setSocialScript():
    info_button = g.root.makeelement('button')
    g.root.body.append(info_button)
    info_button.set("id", "info")
    info_button.set("class", "alipi")
    info_button.set("onClick", "a11ypi.showInfo(a11ypi.responseJSON);")
    info_button.text =  "Info"
    info_button.set("title", "Have a look at the information of each renarrated element")
    
    share_button = g.root.makeelement('button')
    g.root.body.append(share_button)
    share_button.set("id", "share")
    share_button.set("class", "alipi")
    share_button.set("onClick", "a11ypi.share();")
    share_button.text =  "Share"
    share_button.set("title", "Share your contribution in your social network")
    
    see_orig = g.root.makeelement('button')
    g.root.body.append(see_orig)
    see_orig.set("id", "orig-button")
    see_orig.set("class", "alipi")
    see_orig.set("onClick", "a11ypi.showOriginal();")
    see_orig.text = "Original Page"
    see_orig.set("title", "Go to Original link, the original page of this renarrated")
    
    tweetroot = g.root.makeelement("div")
    tweetroot.set("id", "tweet-root")
    tweetroot.set("class", "alipi")
    tweetroot.set("style", "display:none;padding:10px;")
    g.root.body.append(tweetroot)

    tweet = g.root.makeelement("a")
    tweet.set("id", "tweet")
    tweet.set("href", "https://twitter.com/share")
    tweet.set("class", "alipi twitter-share-button")
    tweet.set("data-via", "a11ypi")
    tweet.set("data-lang", "en")
    tweet.set("data-url", "http://dev.a11y.in/web?foruri={0}&lang={1}&interactive=1".format(quote_plus(request.args['foruri']),request.args['lang']))
    tweet.textContent = "Tweet"
    tweetroot.append(tweet)

    fblike = g.root.makeelement("div")
    fblike.set("id", "fb-like")
    fblike.set("class", "alipi fb-like")
    fblike.set("style", "display:none;padding:10px;")
    fblike.set("data-href", "http://dev.a11y.in/web?foruri={0}&lang={1}&interactive=1".format(quote_plus(request.args['foruri']),request.args['lang']))
    fblike.set("data-send", "true")
    fblike.set("data-layout", "button_count")
    fblike.set("data-width", "50")
    fblike.set("data-show-faces", "true")
    fblike.set("data-font", "arial")
    g.root.body.append(fblike)
    
    style = g.root.makeelement('link')
    g.root.body.append(style)
    style.set("rel","stylesheet")
    style.set("type", "text/css")
    style.set("href", "http://dev.a11y.in/server/stylesheet.css")

    
@app.route('/directory')
def show_directory():
    collection = g.db['post']
    query = collection.group(
        key = Code('function(doc){return {"about" : doc.about,"lang":doc.lang}}'),
        condition={"about":{'$regex':'^[/\S/]'}},
        initial={'na': []},
        reduce=Code('function(doc,out){out.na.push(doc.blog)}')
        )
    query.reverse()
    return render_template('directory.html', name=query, mymodule = quote_plus, myset=set, mylist= list)

@app.route('/getLoc', methods=['GET'])
def get_loc():

    term = request.args['term']
    connection = oursql.Connection(conf.DBHOST[0],conf.DBUSRNAME[0],conf.DBPASSWD[0],db=conf.DBNAME[0])
    cursor = connection.cursor(oursql.DictCursor)
    cursor.execute('select l.name, c.country_name from `location` as l, `codes` as c where l.name like ? and l.code=c.code limit ?', (term+'%', 5))
    r = cursor.fetchall()
    connection.close()
    d = {}
    d['return'] = r
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
@app.route('/getLang', methods=['GET'])
def get_lang():
    term = request.args['term']
    connection = oursql.Connection(conf.DBHOST[0],conf.DBUSRNAME[0],conf.DBPASSWD[0],db=conf.DBNAME[0])
    cursor = connection.cursor(oursql.DictCursor)
    cursor.execute('select * from `languages` as l  where l.name like ? limit ?', (term+'%',5))
    r = cursor.fetchall()
    connection.close()
    d = {}
    d['return'] = r
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
@app.route('/blank', methods=['GET'])
def serve_blank():
    return render_template('blank.html')

@app.route('/info', methods=['GET'])
def serve_info():
    coll = g.db['post']
    d = {}
    cntr = 0
    for i in coll.find({"about":unquote_plus(request.args['about']),"lang":request.args['lang']}):
        i['_id'] = str(i['_id'])
        d[cntr] = i
        cntr+=1
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
@app.route("/replace", methods=['GET'])
def replace():
    collection = g.db['post']
    lang = request.args['lang']
    url = request.args['url']
    query = collection.group(
        key = Code('function(doc){return {"xpath" : doc.xpath, "about": doc.url}}'),
        condition={"about" : url, "lang" : lang,"elementtype":"text"},
        initial={'narration': []},
        reduce=Code('function(doc,out){out.narration.push(doc);}') 
        )
    
    audio_query =collection.group(
        key = Code('function(doc){return {"xpath" : doc.xpath, "about": doc.url}}'),
        condition={"about" : url, "lang" : lang, 'elementtype':"audio/ogg"},
        initial={'narration': []},
        reduce=Code('function(doc,out){out.narration.push(doc);}') 
        )

    image_query =collection.group(
        key = Code('function(doc){return {"xpath" : doc.xpath, "about": doc.url}}'),
        condition={"about" : url, "lang" : lang, 'elementtype':"image"},
        initial={'narration': []},
        reduce=Code('function(doc,out){out.narration.push(doc);}') 
        )
    try:
        for i in audio_query:
            query.append(i)
    except IndexError:
        pass
    try:
        for i in image_query:
            query.append(i)
    except IndexError:
        pass

    for i in query:
        for y in i['narration']:
            del(y['_id'])
    d = {}
    d['r'] = query
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/feeds', methods=['GET'])
def serve_feed_temp():
    return render_template("feeds.html")

@app.route('/feed', methods=['GET'])
def serve_feed():
    coll = g.db['post']
    d = {}
    cntr = 0
    for i in coll.find():
        if i['data'] != '<br/>':
            i['_id'] = str(i['_id'])
            d[cntr] = i
            cntr+=1
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


import logging,os
from logging import FileHandler

fil = FileHandler(os.path.join(os.path.dirname(__file__),'logme'),mode='a')
fil.setLevel(logging.ERROR)
app.logger.addHandler(fil)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
