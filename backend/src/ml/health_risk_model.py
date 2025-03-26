import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# Function to load and preprocess the dataset
def load_and_preprocess_data(dataset_path):
    # Load the synthetic dataset
    health_data = pd.read_csv(dataset_path)

    # Define health risk categories based on thresholds
    health_data['health_risk'] = np.where(
        (health_data['disease_outbreak_risk (%)'] > 50) | 
        (health_data['malnutrition_rate (%)'] > 30) | 
        (health_data['sanitation_score (0-10)'] < 4),
        'High Risk',
        np.where(
            (health_data['disease_outbreak_risk (%)'] > 20) | 
            (health_data['malnutrition_rate (%)'] > 10) | 
            (health_data['sanitation_score (0-10)'] < 7),
            'Medium Risk',
            'Low Risk'
        )
    )
    
    return health_data

# Function to train the Random Forest model
def train_model(health_data):
    # Define features (X) and target variable (y)
    X = health_data[['population', 'disease_outbreak_risk (%)', 'malnutrition_rate (%)', 
                     'sanitation_score (0-10)', 'waterborne_disease_risk (%)']]
    y = health_data['health_risk']

    # Encode categorical variables (e.g., health_risk)
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    # Train a Random Forest Classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model's performance
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    class_report = classification_report(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    print("Accuracy:", accuracy)
    print("Classification Report:")
    print(class_report)
    print("Confusion Matrix:")
    print(conf_matrix)

    return model, label_encoder

# Function to predict health risks for new data
def predict_health_risk(model, label_encoder, input_data):
    predictions = model.predict(input_data)
    predicted_risks = label_encoder.inverse_transform(predictions)
    
    return predicted_risks

# Example usage for testing the module
if __name__ == "__main__":
    # Path to the dataset
    dataset_path = 'synthetic_health_data_from_training.csv'

    # Load and preprocess data
    health_data = load_and_preprocess_data(dataset_path)

    # Train the model and get the label encoder
    model, label_encoder = train_model(health_data)

    # Predict health risks for new data
    new_data = pd.DataFrame({
        "population": [15000, 45000, 8000],
        "disease_outbreak_risk (%)": [15.5, 35.2, 75.1],
        "malnutrition_rate (%)": [5.2, 20.1, 40.3],
        "sanitation_score (0-10)": [8.5, 5.0, 2.1],
        "waterborne_disease_risk (%)": [10.0, 50.0, 90.0]
    })

    new_risks = predict_health_risk(model, label_encoder, new_data)

    print("\nPredicted Health Risks for New Data:")
    for i, risk in enumerate(new_risks):
        print(f"Data Point {i+1}: {risk}")
