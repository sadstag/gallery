# type: ignore
# untyped google API client

from os.path import abspath, dirname, exists

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

from cli.exceptions import ConfigurationException

parentDir = abspath(f"{dirname(__file__)}/..")

tokenFilename = f"{parentDir}/token.json"
credentialsFilename = f"{parentDir}/credentials.json"

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]


def getCredentials():
    creds = None

    if exists(tokenFilename):
        creds = Credentials.from_authorized_user_file(tokenFilename, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            try:
                flow = InstalledAppFlow.from_client_secrets_file(
                    credentialsFilename, SCOPES
                )
            except FileNotFoundError:
                raise ConfigurationException(
                    f"Please create file '{credentialsFilename}' as explained in README.md"
                )
            creds = flow.run_local_server(port=0)

        with open(tokenFilename, "w") as token:
            token.write(creds.to_json())

    return creds
