from flask import Flask, request, jsonify
from google import genai

app = Flask(__name__)

# Endpoint to receive POST requests
@app.route('/translate', methods=['POST'])
def translate_request():
    for i in range(3): # retry
        try:
            return original_request()
        except Exception as e:
            return jsonify({"error": "An error occurred", "details": str(e)}), 500


def original_request():
    # Parse JSON data from the POST request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid or missing JSON data"}), 400

    # Extract relevant data (example: assuming 'input_text' key exists in the request)
    product = data.get('product')
    if product == 'default':
        API_KEY = 'default'
    else:
        API_KEY = 'default'
    target_language = data.get('target')
    contents = data.get('q')

    client = genai.Client(
        api_key=API_KEY
    )
    response = client.models.generate_content(
        model='gemini-2.0-flash-exp', contents=f'Translate to {target_language} if not; else output “”. Only the translation. Input: {contents}'
    )
    print('output: ', response.text)
    result_text = response.text
    print (result_text)
    if result_text in ('""', '""\n', '""\\n', '""\\\n'):
        result_text = ""

    # Check for errors in the Gemini model response
    # if gemini_response.status_code != 200:
    # if not response.text:
    #     return jsonify({"error": "Error from Gemini model", "details": response.text}), 500
    return jsonify({"translatedText": result_text})

# Run the Flask server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1996)