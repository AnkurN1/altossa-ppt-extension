from flask import Flask, request, send_file
from flask_cors import CORS
from ppt_generator import generate_ppt

CORS(
    app,
    resources={r"/generate": {"origins": "*"}},
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"]
)

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    data = request.get_json()
    pptx_file = generate_ppt(data)
    return send_file(
        pptx_file,
        as_attachment=True,
        download_name="Selected_Images.pptx"
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)