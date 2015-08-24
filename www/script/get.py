import requests
import json

def Get(endpoint, s9ID):
	url = 'https://partner.inkling.com'
	partnerKey = '?access_token=p-970d21fbdd8540e99bd7b23ffb9e0af1'
	req = requests.get(url + endpoint + '/' + s9ID + partnerKey)
	return json.loads(req.text)

s9ID = '082df23d7c79961406ba9ce12ce2d448806'

# Make GET call
result = Get('/contentbuilds', s9ID)
return result
print result