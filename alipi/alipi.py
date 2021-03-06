from flask import Flask
from flask import request
from flask import render_template
from flask import make_response
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
import sweetmaker
import oursql
import requests
from flask import jsonify
import json
from flask import url_for

app = Flask(__name__)
@app.before_request
def first():
    g.connection = pymongo.MongoClient('localhost',27017) #Create the object once and use it.
    g.db = g.connection[conf.MONGODB[0]]

# @app.after_request
# def set_secret(response):
#     response.set_cookie("key", conf.SWEET_SECRET_KEY[0])


@app.teardown_request
def close(exception):
    g.connection.disconnect()


@app.route('/')
def start_page() :
    d = {}
    d['foruri'] = request.args['foruri']
    myhandler1 = urllib2.Request(d['foruri'],headers={'User-Agent':"Mozilla/5.0 (X11; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0)"}) #A fix to send user-agents, so that sites render properly.
    try:
        a = urllib2.urlopen(myhandler1)
        if a.geturl() != d['foruri']:
            return "There was a server redirect, please click on the <a href='http://y.a11y.in/web?foruri={0}'>link</a> to continue.".format(quote_plus(a.geturl()))
        else:
            page = a.read()
            a.close()
    except ValueError:
        return "The link is malformed, click <a href='http://y.a11y.in/web?foruri={0}&lang={1}&interactive=1'>here</a> to be redirected.".format(quote_plus(unquote_plus(d['foruri'].encode('utf-8'))),request.args['lang'])
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
        response = make_response()
        response.data = lxml.html.tostring(g.root)
        return response

    elif request.args.has_key('lang') == True and request.args.has_key('interactive') == True and request.args.has_key('blog') == False:
        setScripts()
        setSocialScript()
        g.root.body.set("onload","a11ypi.ren();a11ypi.tweet(); a11ypi.facebook(); a11ypi.loadOverlay();")
        g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
        response = make_response()
        response.data = lxml.html.tostring(g.root)
        return response


    elif request.args.has_key('lang') == True and request.args.has_key('blog') == False:
        script_jq_mini = g.root.makeelement('script')
        g.root.body.append(script_jq_mini)
        script_jq_mini.set("src", conf.JQUERYURL[0] + "/jquery.min.js")
        script_jq_mini.set("type", "text/javascript")
        d['lang'] = request.args['lang']
        script_test = g.root.makeelement('script')
        g.root.body.append(script_test)
        script_test.set("src", conf.APPURL[0] + "/alipi/ui.js")
        script_test.set("type", "text/javascript")
        g.root.body.set("onload","a11ypi.ren()");
        response = make_response()
        response.data = lxml.html.tostring(g.root)
        return response


    elif request.args.has_key('interactive') == True and request.args.has_key('blog') == True and request.args.has_key('lang') == True:
        setScripts()
        setSocialScript()
        g.root.body.set("onload","a11ypi.filter(); a11ypi.tweet(); a11ypi.facebook(); a11ypi.loadOverlay();");
        g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
        response = make_response()
        response.data = lxml.html.tostring(g.root)
        return response

    elif request.args.has_key('interactive') == False and request.args.has_key('blog') == True:
        setScripts()
        g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
        g.root.body.set('onload', 'a11ypi.loadOverlay();')
        response = make_response()
        response.data = lxml.html.tostring(g.root)
        return response


def setScripts():
    script_test = g.root.makeelement('script')
    script_auth = g.root.makeelement('script')

    g.root.body.append(script_auth)
    g.root.body.append(script_test)

    script_test.set("src", conf.APPURL[0] + "/alipi/pack.min.js")
    script_test.set("type", "text/javascript")

    style = g.root.makeelement('link')
    g.root.body.append(style)
    style.set("rel","stylesheet")
    style.set("type", "text/css")
    style.set("href", conf.APPURL[0] + "/alipi/pack.min.css")


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
    tweet.set("data-url", "http://y.a11y.in/web?foruri={0}&lang={1}&interactive=1".format(quote_plus(request.args['foruri']),(request.args['lang']).encode('unicode-escape')))
    tweet.textContent = "Tweet"
    tweetroot.append(tweet)

    fblike = g.root.makeelement("div")
    fblike.set("id", "fb-like")
    fblike.set("class", "alipi fb-like")
    fblike.set("style", "display:none;padding:10px;")
    fblike.set("data-href", "http://y.a11y.in/web?foruri={0}&lang={1}&interactive=1".format(quote_plus(request.args['foruri']),(request.args['lang']).encode('unicode-escape')))
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
    style.set("href", "http://y.a11y.in/alipi/stylesheet.css")


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

    print query

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
    for i in coll.find().sort('_id',direction=-1):
        if i['data'] != '<br/>':
            i['_id'] = str(i['_id'])
            d[cntr] = i
            cntr+=1
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/about', methods=['GET'])
def serve_authors():
    coll = g.db['post']
    d = {}
    cntr = 0
    for i in coll.find({"about":unquote_plus(request.args['about'])}):
        i['_id'] = str(i['_id'])
        d[cntr] = i
        cntr+=1
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
#Retrieve all information about a specific $about and a given $author.
@app.route('/author', methods=['GET'])
def serve_author():
    coll = g.db['post']
    d = {}
    cntr = 0
    for i in coll.find({"about":unquote_plus(request.args['about']),"author":unquote_plus(request.args['author'])}):
        i['_id'] = str(i['_id'])
        d[cntr] = i
        cntr += 1
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/getAllLang', methods=['GET'])
def get_all_lang():
    term = request.args['term']
    connection = oursql.Connection(conf.DBHOST[0],conf.DBUSRNAME[0],conf.DBPASSWD[0],db=conf.DBNAME[0])
    cursor = connection.cursor(oursql.DictCursor)
    cursor.execute('select * from `languages` as l  where l.name like ?', (term+'%',))
    r = cursor.fetchall()
    connection.close()
    d = {}
    d['return'] = r
    response = jsonify(d)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/publish', methods=['POST'])
def publish():
    data = json.loads(request.form['data'])
    collection = g.db['post']
    page = {}
    if type(data) is unicode: #A hack to fix malformed data. FIXME.
        data = json.loads(data)
    content = []
    for i in data: #Create content objects here for posting to blog.  DELETEME.
        if 'comments' in i:
            page['comments'] = i['comments']
        else:
            contentobj = {}
            contentobj['type'] = i['elementtype']
            contentobj['attr'] = {"language":i['lang'], "location":i['location'], "about":i['about'], "xpath":i['xpath']}
            contentobj['data'] = i['data']
            content.append(contentobj)
            i['bxpath'] = ''
            collection.insert(i)

    page['title'] = "Re-narration of " + content[0]['attr']['about']
    page['name'] = "About " + content[0]['attr']['about']
    page['content'] = content

    g.response_from_blogger = requests.api.post(conf.CUSTOM_BLOG_POST_URL[0], json.dumps(page), headers={"content-type":"application/json"})
    print "response from blogger " + repr(g.response_from_blogger)
    sweet(data)
    reply = make_response()
    return reply


def sweet(data):
    """ A function to sweet the data that is inserted.  Accepts a <list of dicts>. """
    for i in data:
        if 'type' in i:
            del(i['_id'])
            sweetmaker.sweet(conf.SWEET_STORE_ADD[0], [{"what":i['type'], "who":i['author'], "where":i['about']+i['xpath'], "how":conf.CUSTOM_BLOG_URL[0]+"/#"+g.response_from_blogger.json()['name']+' {lang: '+i["lang"]+',loc: '+i["location"]+'}'}])
    return True
        # data = json.dumps(data)
    # req = requests.api.post(conf.SWEETURL[0]+"/add",{'data':data})
    # if req.status_code == 200:
    #     reply = make_response()
    #     return reply


@app.route("/askSWeeT", methods=['POST'])
def askSweet():
    data = json.loads(request.form['data'])
    for i in data:
        response = requests.api.get(conf.SWEETURL[0]+"/query/"+i['id'])
        collection = g.db['post']
        rep = response.json()
        rep['bxpath'] = ''
        if response.status_code == 200:
            collection.insert(rep)
    reply = make_response()
    return reply

@app.route("/menu",methods=['GET'])
def menuForDialog():
    if request.args.has_key('option') == False:
        collection = g.db['post']
        c = {}
        cntr = 0
        print request.args['url']
        for i in collection.find({"about":request.args['url']}).distinct('lang'):
            for j in collection.find({"about":request.args['url'],'lang':i}).distinct('type'):
                d = {}
                d['lang'] = i
                d['type'] = j
                c[cntr] = d
                cntr += 1
        print c
        return jsonify(c)
    else:
        collection = g.db['post']
        #get the ren languages for the received url
        langForUrl = collection.group(
            key = Code('function(doc){return {"about" : doc.about}}'),
            condition={"about" : d['url'],"blog":{'$regex':'/'+d['option']+'.*/'}},
            initial={'lang': []},
            reduce=Code('function(doc, out){if (out.lang.indexOf(doc.lang) == -1) out.lang.push(doc.lang)}') #here xpath for test
            )

        #send the response
        if (langForUrl):
            connection.disconnect()
            return json.dumps(langForUrl[0]['lang'])
        else:
            connection.disconnect()
            return "empty"


@app.route("/domain")
def serve_domain_info():
    collection = g.db['post']
    url = request.args['url']
    #all re-narrations of the same xpath are grouped
    query = collection.group(
        key = None,
        condition={"about" :{'$regex':url+'*'}},
        initial={'narration': []},
        reduce=Code('function(doc,out){out.narration.push(doc["about"]);}')
    )

    string=''
    if len(query)==0:
        return jsonify({'0':'empty'})
    else:
        otherlist = {}
        cntr = -1
        mylist = query[0]['narration']
        for i in mylist:
            if i in otherlist:
                pass
            else:
                cntr += 1
                otherlist[cntr] = str(i)
                return jsonify(otherlist)


import logging,os
from logging import FileHandler

fil = FileHandler(os.path.join(os.path.dirname(__file__),'logme'),mode='a')
fil.setLevel(logging.ERROR)
app.logger.addHandler(fil)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')
