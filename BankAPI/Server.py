import sqlite3
from xmlrpc.server import SimpleXMLRPCServer
import os
import jwt
import re 



server = SimpleXMLRPCServer(('localhost', 3000), logRequests=True)
sqliteConnection = sqlite3.connect('BankDB.db')


def executeQuery(query):
    sqliteConnection = sqlite3.connect('BankDB.db')
    print("executing query")
    print(query)
    sqlCursor = sqliteConnection.cursor()
    sqlCursor.execute(query)
    sqlCursor.close()



def decodeToken(token):
    payload = jwt.decode(token, verify=False)
    email = payload["email"]
    return email

def addMoney(token, money):
    try:
        email = decodeToken(token)
        sqliteConnection = sqlite3.connect('BankDB.db')
        sqlCursor = sqliteConnection.cursor()
        sqlCursor.execute("UPDATE customers SET balance = balance + "+str(money)+" WHERE owner = '"+email+"'")
        sqliteConnection.commit()
        sqlCursor.close()
        return "<Response><statuscode>200</statuscode><message>"+str(money) +" is succesfully transfered to the account</message></Response>"
    except:
       return "<Response><statuscode>500</statuscode><message>The transaction failed</message></Response>"

def deductMoney(token, money):
    try:
        email = decodeToken(token)
        sqliteConnection = sqlite3.connect('BankDB.db')
        sqlCursor = sqliteConnection.cursor()
        test = sqlCursor.execute("UPDATE customers SET balance = balance - "+str(money)+" WHERE owner = '"+email+"'")
        print(test)
        sqliteConnection.commit()
        sqlCursor.close()
        return "<Response><statuscode>200</statuscode><message>"+str(money) +" is succesfully deducted from the account</message></Response>"
    except:
       print("error")
       return "<Response><statuscode>500</statuscode><message>The transaction failed</message></Response>"

if __name__ == '__main__':
    try:
        server.register_function(addMoney, "addMoney")
        server.register_function(deductMoney, "deductMoney")
     #   server.register_function(getBalance)
        print("Server is running on port 3000")
        server.serve_forever()
    except:
        print("error")
    finally:
        if (sqliteConnection):
            sqliteConnection.close()
            print("The SQLite connection is closed")


    


