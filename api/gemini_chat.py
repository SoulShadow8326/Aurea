from flask import Blueprint, request, jsonify

bp = Blueprint('gemini_chat', __name__)

def call_gemini_llm(message):
    # Replace this with actual Gemini API call
    return f"Echo: {message}"

@bp.route('/api/gemini-chat', methods=['POST'])
def gemini_chat():
    data = request.get_json()
    message = data.get('message', '')
    reply = call_gemini_llm(message)
    return jsonify({'reply': reply})
