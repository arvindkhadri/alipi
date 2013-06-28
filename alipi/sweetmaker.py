# SwtMaker
# -------
# Server-side component to make sweets and post them to specified 
# sweet store
#
# License: BSD, see LICENSE for more details.
# Servelots 2013
# Authors:
#   Arvind Khadri <arvind@servelots.com>
#   Anon Ray <rayanon@servelots.com>

import requests
import json
from datetime import datetime

TIMESTAMP_FORMAT = '%d-%m-%Y %H:%M:%S'

def sweet(sweet_url, sweet_list):
    sweets = makeSweet(sweet_list)
    if not sweets:
        return False
    else:
        request = requests.api.post(sweet_url, {'data': json.dumps(sweets)})
        if request.status_code == 200:
            return True
        else:
            return False

def makeSweet(sweet_list):
    for sweet in sweet_list:
        if len(sweet['who']) and len(sweet['what']) and len(sweet['where'])\
           and len(sweet['how']):
            sweet['created'] = datetime.utcnow().strftime(TIMESTAMP_FORMAT)
        else:
            return False
    return sweet_list
