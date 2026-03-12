from flask import Flask, render_template, request, jsonify # type: ignore
import whisper # type: ignore
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = whisper.load_model("base")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/transcribe", methods=["POST"])
def transcribe():

    audio = request.files["audio"]

    filepath = os.path.join(UPLOAD_FOLDER, audio.filename)
    audio.save(filepath)

    result = model.transcribe(filepath)

    return jsonify({
        "text": result["text"]
    })

if __name__ == "__main__":
    app.run(debug=True, port=7860)