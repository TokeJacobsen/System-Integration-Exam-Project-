from flask import Flask

app = Flask(__name__)

@app.route('/validate', methods=['POST'])
def validate:
    

if __name__ == '__main__':
    app.run(port=3333)

def connectToDB():
    