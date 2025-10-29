from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    """Root endpoint returning a simple JSON greeting."""
    return jsonify({"message": "Hello from Shacks-2025 Flask server"}), 200


@app.route("/health")
def health():
    """Liveness/health check endpoint."""
    return jsonify({"status": "ok"}), 200

@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from Flask!")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
