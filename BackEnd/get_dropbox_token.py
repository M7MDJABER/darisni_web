import dropbox
from dropbox.oauth import DropboxOAuth2FlowNoRedirect
import time
import re

APP_KEY = 'aor2v2twqvrqwwv'
APP_SECRET = 'qut9vmvzb092id2'
ENV_FILE = ".env"
REFRESH_INTERVAL_SECONDS = 3600  # every hour

def get_new_token():
    # Dropbox OAuth2 authorization
    auth_flow = DropboxOAuth2FlowNoRedirect(APP_KEY, APP_SECRET)
    authorize_url = auth_flow.start()
    print("\n🔗 Go to this URL and authorize the app:")
    print(authorize_url)
    auth_code = input("\nPaste the authorization code here: ").strip()

    try:
        result = auth_flow.finish(auth_code)
        print("✅ Got new access token.")
        return result.access_token
    except Exception as e:
        print("❌ Error during Dropbox auth:", e)
        return None

def update_env_token(new_token):
    try:
        with open(ENV_FILE, "r") as f:
            env_content = f.read()

        updated_content = re.sub(
            r"^DPX_TOKEN=.*$", 
            f"DPX_TOKEN={new_token}", 
            env_content, 
            flags=re.MULTILINE
        )

        with open(ENV_FILE, "w") as f:
            f.write(updated_content)

        print("📝 .env file updated with new token.")
    except FileNotFoundError:
        print(f"❌ .env file '{ENV_FILE}' not found.")
    except Exception as e:
        print(f"❌ Failed to update .env file: {e}")

def main():
    print("🔁 Dropbox Token Updater Started (updates every 1 hour)\n")

    token = get_new_token()
    if token:
        update_env_token(token)

        while True:
            time.sleep(REFRESH_INTERVAL_SECONDS)
            print("\n⏰ 1 hour passed — refreshing token...")
            token = get_new_token()
            if token:
                update_env_token(token)

if __name__ == "__main__":
    main()
