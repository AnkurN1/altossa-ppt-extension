from flask import Flask, request, send_file, jsonify, make_response
from ppt_generator import generate_ppt

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate():
    if request.method == "OPTIONS":
        return make_response("", 204)

    data = request.get_json(silent=True) or []
    pptx_file = generate_ppt(data)

    return send_file(
        pptx_file,
        as_attachment=True,
        download_name="Selected_Images.pptx"
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
