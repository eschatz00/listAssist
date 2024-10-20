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

# For storing lists dynamically
lists = {
    'Groceries': {'label': 'food', 'items': []},
    'To-Do': {'label': 'reminders', 'items': []}
}


def categorize_item(item):
    """Classify the item using list labels."""
    labels = [data['label'] for data in lists.values()]  # Use NLP labels
    result = classifier(item, candidate_labels=labels)
    label = result['labels'][0]

    # Find the matching list name based on the label
    for list_name, data in lists.items():
        if data['label'] == label:
            return list_name

    return None  # In case no matching list is found


#REST API STUFF
@app.route('/api/add-item', methods=['POST'])
def add_item():
    data = request.get_json()
    item = data.get('item')

    # Classify the item and add it to the correct list
    list_name = categorize_item(item)
    if list_name:
        lists[list_name]['items'].append(item)
        return jsonify({'item': item, 'listName': list_name}), 201
    else:
        return jsonify({'error': 'No matching list found'}), 400


@app.route('/api/add-list', methods=['POST'])
def add_list():
    """Add a new list with a name and NLP label."""
    data = request.get_json()
    name = data.get('name')
    label = data.get('label')

    if not name or not label:
        return jsonify({'error': 'Invalid input'}), 400

    print('Received data:', data)  # Debugging log to see incoming request data


    if name not in lists:
        lists[name] = {'label': label, 'items': []}
        print(f"Adding new list: {name} with label: {label}")  # Debugging log
        return jsonify({'message': f'List {name} added successfully.'}), 201
    else:
        return jsonify({'error': f'List {name} already exists.'}), 400


@app.route('/api/remove-item', methods=['DELETE'])
def remove_item():
    data = request.get_json()
    list_name = data.get('listName')
    item = data.get('item')

    if list_name in lists and item in lists[list_name]['items']:
        lists[list_name]['items'].remove(item)
        return jsonify({'message': f'Item {item} removed from {list_name}'}), 200
    else:
        return jsonify({'error': 'Item not found'}), 404



@app.route('/api/items', methods=['GET'])
def get_items():
    """Fetch all categorized items."""
    return jsonify(lists), 200  # Return the `lists` dictionary directly


if __name__ == '__main__':
    app.run(debug=True)