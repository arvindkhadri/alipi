import requests
import json
import conf
def make(what, who, where, how):
    sweet = {}
    sweet['what'] = what
    sweet['who'] = who
    sweet['where'] = where
    sweet['how'] = how
    print sweet
    sweet_list = []
    sweet_list.append(sweet)
    return sweet_list


def send(sweet):
    request = requests.api.post(conf.SWEET_STORE_ADD[0],{'data':json.dumps(sweet)})
    if request.status_code == 200:
        return True
    else:
        return False