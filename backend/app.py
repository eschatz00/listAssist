from flask import Flask, request, jsonify
from flask_cors import CORS  
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store categorized lists temporarily
food_items = []
reminders_items = []

# NLP STUFF
classifier = pipeline('zero-shot-classification', model='facebook/bart-large-mnli')

def categorize_item(item):
    labels = ['food', 'reminders']
    result = classifier(item, labels)
    category = result['labels'][0]  # Get the most likely category
    return category


#REST API STUFF
@app.route('/api/add-item', methods=['POST'])
def add_item():
    data = request.get_json()
    item = data.get('item')

    category = categorize_item(item) #NLP categorization

    if category == 'food':
        food_items.append(item)
    elif category == 'reminders':
        reminders_items.append(item)


    return jsonify({'item': item, 'category': category}), 201

@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify({
        'food': food_items,
        'reminders': reminders_items
    }), 200

if __name__ == '__main__':
    app.run(debug=True)