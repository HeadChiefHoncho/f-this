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
        jsonFilters = []
        for f in filters:
            jsonFilters.append(f.to_dict())
        self.response.headers["Content-Type"] = "application/json"
        self.response.write(json.dumps(jsonFilters))

class CreateFilterHandler(webapp2.RequestHandler):
    def get(self):
        name = self.request.get("name")
        f = Filter(name=name, find="", replace="")
        f.put()

app = webapp2.WSGIApplication([
    ('/getFilters', GetFiltersHandler),
    ('/createFilter', CreateFilterHandler)
], debug=True)
