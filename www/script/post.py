import requests
import json

def Post(endpoint,data):
	url = 'https://partner.inkling.com'
	partnerKey = '?access_token=p-970d21fbdd8540e99bd7b23ffb9e0af1'
	req = requests.post(url + endpoint + partnerKey, data=data)
	
	# This is how you can get the header information from a build call. 
	reqHeader = req.headers['location']
	print reqHeader
	return json.loads(req.text)

data = {
'shortname':'sn_b2c2',
'type':'epub'
}

# Make POST call
data = json.dumps(data)
result = Post('/contentbuilds', data)
print result