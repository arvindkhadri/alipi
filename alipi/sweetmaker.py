import requests
import json

def sweet(sweet_url, what, who, where, how):
    sweet = {}
    sweet['what'] = what
    sweet['who'] = who
    sweet['where'] = where
    sweet['how'] = how
    sweet_list = []
    sweet_list.append(sweet)
    request = requests.api.post(sweet_url, {'data':json.dumps(sweet_list)})
    if request.status_code == 200:
        return True
    else:
        return False