from yahoo_oauth import OAuth2
import requests
oauth = OAuth2(None, None, from_file='oauth2.json')
if not oauth.token_is_valid():
    oauth.refresh_access_token()
else:
    headers = {'Authorization': 'Bearer ' + oauth.access_token, 'x-li-format': 'json'}
    response = requests.post('http://localhost:3001/auth/yahoo', headers=headers, data={'access_token': oauth.access_token})
    print(response.text)