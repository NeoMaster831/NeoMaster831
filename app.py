from flask import Flask, render_template

app = Flask(__name__)
with open('PGP_KEY', 'r') as f:
    pgp_key = f.read()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/pgp')
def pgp():
    return pgp_key.replace('\n', '<br>')