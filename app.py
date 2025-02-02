from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/hyro')
def hyro():
    return render_template('hyro.html')