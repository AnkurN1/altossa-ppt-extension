from flask import Flask, request, send_file
from flask_cors import CORS
from ppt_generator import generate_ppt

app = Flask(__name__)
CORS(app)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    pptx_file = generate_ppt(data)
    return send_file(pptx_file, as_attachment=True)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)