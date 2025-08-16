from flask import Flask, request, jsonify, send_file
from collections import defaultdict
import base64
import io

app = Flask(__name__)
sessions = defaultdict(list)

@app.route('/snapshot', methods=['POST'])
def snapshot():
    data = request.json
    session_id = data.get('session_id', 'default')
    sessions[session_id].append(data)
    return {'status': 'ok'}

@app.route('/timeline/<session_id>', methods=['GET'])
def timeline(session_id):
    return jsonify(sessions.get(session_id, []))

@app.route('/screenshot/<session_id>/<int:step>', methods=['GET'])
def screenshot(session_id, step):
    timeline = sessions.get(session_id, [])
    if 0 <= step < len(timeline):
        snap = timeline[step]
        img_b64 = snap.get('screenshot')
        if img_b64:
            img_bytes = base64.b64decode(img_b64)
            return send_file(io.BytesIO(img_bytes), mimetype='image/png')
    return '', 404

if __name__ == '__main__':
    app.run(port=5000, debug=True) 