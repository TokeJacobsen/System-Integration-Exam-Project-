import jwt
import re 
token  = "lol"
payload = jwt.decode(token, verify=False)
email = payload["email"]
print(email)
regex = "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
if not re.search(regex,email):
    print("??")
    raise ValueError('Email invalid')