#A mudoule to have utilities.  Right now it contains the xpath module
import lxml.html
import pymongo
import random
from lxml import etree
import re
def getCount(elt):
    count = 1
    temp = elt
    for i in elt.itersiblings(tag=elt.tag, preceding=True):
        count+=1
    return count

def makePath(elt):
#An element is passed to this function and the xpath of that element is returned#
    path = ''
    i = elt
    while(i is not None):
        try:
            if i.attrib['id'] is not None:
                path = "//*[@id='"+i.attrib['id']+"']"+path
                break
        except KeyError:
            idx = getCount(i)
            tagName = i.tag
            if idx > 1:
                tagName += "[" + str(idx) + "]"
            path = "/" + tagName + path
            i=i.getparent()
    return path

def doScrape(url):
# Crawling is a utility, pass the url to be crawled.  Alipi attributes will be indexed from the given url. #
    connection = pymongo.Connection('localhost', 27017)
    db = connection['dev_alipi']
    collection = db['post']
    root = lxml.html.parse(url).getroot()
    elements = root.xpath('//@alipius/..')
    store_list = []
    ren_id = random.random()
    pat = re.compile('<.*?>')
    for element in elements:
        temp = {}
        for i in element.attrib['alipius'].split(','):
            try:
                temp[i.split(':')[0]] = i.split(':')[1]
            except IndexError:
                temp['location'] += ','+i
        if temp['elementtype'] == 'audio/ogg':
            temp['about'] = element.attrib['about']
            temp['xpath'] = element.attrib['xpath']
            temp['data'] = element.attrib['src']
            temp['blog'] = url
            temp['bxpath'] = makePath(element)
            temp['ren_id'] = ren_id
            store_list.append(temp)
        elif temp['elementtype'] == 'image':
            temp['about'] = element.attrib['about']
            temp['xpath'] = element.attrib['xpath']
            temp['data'] = element.attrib['width']+'x'+element.attrib['height']+','+element.attrib['src']
            temp['blog'] = url
            temp['bxpath'] = makePath(element)
            temp['ren_id'] = ren_id
            store_list.append(temp)
        else:
            temp['about'] = element.attrib['about']
            temp['xpath'] = element.attrib['xpath']
            data =''
            ret = pat.search(lxml.html.tostring(element))
            data = lxml.html.tostring(element).partition(ret.group())[2]
            data = data.rpartition('</p>')[0]
            temp['data'] = data
            temp['blog'] = url
            temp['bxpath'] = makePath(element)
            temp['ren_id'] = ren_id
            store_list.append(temp)
    for z in store_list:
        collection.insert(z)
    connection.disconnect()
    return 'ok'
