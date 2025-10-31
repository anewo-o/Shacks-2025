from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

@app.route('/test', methods=['POST'])
def get_directions():
    data = request.get_json()
    start = data.get('start')
    destination = data.get('destination')

    if not start or not destination:
        return jsonify({'error': 'Missing coordinates'}), 400
    
    # Simulation
    route = [start, [(start[0]+destination[0])/2, (start[1]+destination[1])/2], destination]

    return jsonify({ "route": route})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
