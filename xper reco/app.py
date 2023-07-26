from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

# Create a list to store the recorded actions
recorded_actions = []

# Home page (index.html) with login form


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        email = request.form.get('email')
        # Perform the authentication logic (for simplicity, we assume any email is valid)
        # In a real-world scenario, you would verify the email against a database or other means.
        if email:
            return redirect(url_for('recording'))
    return render_template('index.html')

# Recording page (recording.html)


@app.route('/recording', methods=['GET', 'POST'])
def recording():
    if request.method == 'POST':
        # Get the action data from the frontend and add it to the recorded_actions list
        action_data = request.get_json()
        recorded_actions.append(action_data)
        return jsonify({'message': 'Action recorded successfully!'})
    return render_template('recording.html')

# API endpoint to get the recorded actions in JSON format


@app.route('/get_recorded_actions', methods=['GET'])
def get_recorded_actions():
    return jsonify(recorded_actions)


if __name__ == '__main__':
    app.run(debug=True)
