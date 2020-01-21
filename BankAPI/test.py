
import sqlite3
money = 20001300
email = "a@a.com"
sqliteConnection = sqlite3.connect('BankDB.db')
sqlCursor = sqliteConnection.cursor()
sqlCursor.execute("SELECT * FROM customers")
test = sqlCursor.fetchall()
print(test)
sqlCursor = sqliteConnection.cursor()
sqlCursor.execute("UPDATE customers SET balance = balance - "+str(money)+" WHERE owner = '"+email+"'")
sqliteConnection.commit()
sqlCursor = sqliteConnection.cursor()
sqlCursor.execute("SELECT * FROM customers")
test = sqlCursor.fetchall()
print(test)
sqlCursor.close()

sqliteConnection.close()