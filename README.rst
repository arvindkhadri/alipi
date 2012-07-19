***NOTE***
Directory ffext contains files related to Firefox extension.  
Directory server contains the server side code.

***Installation***
1. Flask
   $ sudo pip install Flask
2. lxml
   $ sudo pip install lxml
3. pymongo
   $ sudo pip install pymongo
4. MongoDB
   Check http://mongodb.org for installation notes.
5. mod_wsgi
   $ sudo aptitude install libapache2-mod-wsgi
6. oursql
   $ sudo aptitude install libmysqlclient-dev 
   $ sudo pip install oursql

***How to run ***
$ python alipi.py
That would run "alipi" as a flask application.  It can also be configured to run using wsgi. "launcher.wsgi" is the entry point for wsgi, configure apache to run that script.
