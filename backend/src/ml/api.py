from flask import Flask, request, jsonify
from model1 import load_and_preprocess_data, train_model, predict_health_risk

app = Flask(__name__)

# Load and preprocess data once during initialization
dataset_path = 'synthetic_100_entries_with_health_risk_category.csv'
health_data = load_and_preprocess_data(dataset_path)
model, label_encoder = train_model(health_data)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from request
        input_data = request.get_json()
        df = pd.DataFrame(input_data)  # Convert JSON to DataFrame

        # Make predictions using the model
        predictions = predict_health_risk(model, label_encoder, df)

        # Return predictions as JSON response
        return jsonify({"predictions": predictions.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000)
