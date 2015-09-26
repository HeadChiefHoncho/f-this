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
    def get(self):
        name = self.request.get("name")
        f = Filter(name=name, find="", replace="")
        f.put()

class GetFilterHandler(webapp2.RequestHandler):
    def get(self):
        name = self.request.get("name")
        f = Filter.query(Filter.name == name).fetch(1)
        jsonFilter = f[0].to_dict()
        self.response.headers["Content-Type"] = "application/json"
        self.response.write(json.dumps(jsonFilter))



app = webapp2.WSGIApplication([
    ('/getFilters', GetFiltersHandler),
    ('/createFilter', CreateFilterHandler),
    ('/getFilter', GetFilterHandler)
], debug=True)
