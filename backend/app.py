from flask import Flask, request, jsonify

app = Flask(__name__)

# Store categorized lists temporarily, possibly replace with a database later? if there is time
grocery_items = []
todo_items = []

@app.route('/api/add-item', methods=['POST'])
def add_item():
    data = request.get_json()
    item = data.get('item')

    # Placeholder: Simple categorization logic
    if 'buy' in item.lower():
        grocery_items.append(item)
        category = 'grocery'
    else:
        todo_items.append(item)
        category = 'todo'

    return jsonify({'item': item, 'category': category}), 201

@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify({
        'grocery': grocery_items,
        'todo': todo_items
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
