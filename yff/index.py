import time
from datetime import datetime, timedelta
from yahoo_oauth import OAuth2
import requests

def run_script():
    oauth = OAuth2(None, None, from_file='oauth2.json')

    if not oauth.token_is_valid():
        oauth.refresh_access_token()
    else:
        headers = {'Authorization': 'Bearer ' + oauth.access_token, 'x-li-format': 'json'}
        response = requests.post('http://localhost:3001/auth/yahoo', headers=headers, data={'access_token': oauth.access_token})
        print(response.text)

def schedule_next_run():
    # Get the current date and time
    now = datetime.now()

    # Calculate the next Wednesday 7:20 PM
    next_wednesday = now + timedelta(days=(2 - now.weekday() + 7) % 7)
    next_run_time = next_wednesday.replace(hour=19, minute=20, second=0, microsecond=0)

    return next_run_time

if __name__ == "__main__":
    next_run_time = schedule_next_run()
    print('Next run time: ' + str(next_run_time))
    # while True:
    #     current_time = datetime.now()

    #     if current_time >= next_run_time:
    run_script()
        #     next_run_time += timedelta(weeks=1)  # Schedule for the next Wednesday
        # else:
        #     time.sleep((next_run_time - current_time).total_seconds())
