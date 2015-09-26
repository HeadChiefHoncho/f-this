import webapp2
import json
from google.appengine.ext import ndb

class Filter(ndb.Model):
    name = ndb.StringProperty()
    find = ndb.StringProperty()
    replace = ndb.StringProperty()

class GetFiltersHandler(webapp2.RequestHandler):
    def get(self):
        filters = Filter.query().order(Filter.name).fetch()
        jsonFilterNames = []
        for f in filters:
            jsonFilterNames.append(f.name)
        self.response.headers["Content-Type"] = "application/json"
        self.response.write(json.dumps(jsonFilterNames))

class CreateFilterHandler(webapp2.RequestHandler):
    def post(self):
        name = self.request.get("name")
        find = self.request.get("find")
        replace = self.request.get("replace")
        f = ndb.Key(Filter, name).get()
        if (f == None and find != "" and name != ""):
            f2 = Filter(name=name, find=find, replace=replace, id=name)
            f2.put()
            self.response.write(name);
        else:
            self.response.set_status(400)
            self.response.write("YOU FOOL! 400")

class GetFilterHandler(webapp2.RequestHandler):
    def get(self):
        name = self.request.get("name")
        if (name == ""):
            self.response.set_status(400)
            self.response.write("YOU FOOL! AGAIN! 400")
            return
        f = ndb.Key(Filter, name).get()
        if (f != None):
            jsonFilter = f.to_dict()
            self.response.headers["Content-Type"] = "application/json"
            self.response.write(json.dumps(jsonFilter))
        else:
            self.response.set_status(400)
            self.response.write("YOU FOOL! AGAIN! 400")



app = webapp2.WSGIApplication([
    ('/getFilters', GetFiltersHandler),
    ('/createFilter', CreateFilterHandler),
    ('/getFilter', GetFilterHandler)
], debug=True)
