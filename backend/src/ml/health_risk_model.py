import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# Function to load and preprocess the dataset
def load_and_preprocess_data(file_path):
    try:
        # Load user-provided dataset
        health_data = pd.read_csv(file_path)
        
        # Clean column names (remove leading/trailing spaces)
        health_data.columns = health_data.columns.str.strip()

        # Drop completely blank or unnamed columns
        health_data = health_data.loc[:, ~health_data.columns.str.contains('^Unnamed')]

        # Print column names for debugging
        print("\n📋 Columns in your dataset after removing blank columns:")
        print(health_data.columns.tolist())

        # Remove commas and convert numeric columns to float
        numeric_columns = ['Population', 'Disease Outbreak Risk (%)', 'Malnutrition Rate (%)',
                           'Sanitation Score (0-10)', 'Waterborne Disease Risk (%)']
        for col in numeric_columns:
            health_data[col] = health_data[col].replace(',', '', regex=True).apply(pd.to_numeric, errors='coerce')

        # Handle missing or invalid values (e.g., NaN after conversion)
        missing_rows = health_data[health_data[numeric_columns].isnull().any(axis=1)]
        print(f"\n❌ Rows dropped during preprocessing due to missing or invalid values: {len(missing_rows)}")
        print(missing_rows)

        # Drop rows with missing values in numeric columns
        health_data = health_data.dropna(subset=numeric_columns)

        # Create 'health_risk' label based on rules
        health_data['health_risk'] = np.where(
            (health_data['Disease Outbreak Risk (%)'] > 50) |
            (health_data['Malnutrition Rate (%)'] > 30) |
            (health_data['Sanitation Score (0-10)'] < 4),
            'High Risk',
            np.where(
                (health_data['Disease Outbreak Risk (%)'] > 20) |
                (health_data['Malnutrition Rate (%)'] > 10) |
                (health_data['Sanitation Score (0-10)'] < 7),
                'Medium Risk',
                'Low Risk'
            )
        )
        
        return health_data

    except KeyError as e:
        print(f"❌ Error: Missing column in the dataset - {e}")
        exit()
    except Exception as e:
        print(f"❌ Error while loading or preprocessing data: {e}")
        exit()

# Function to train the Random Forest model
def train_model(health_data):
    try:
        # Define features (X) and target (y)
        X = health_data[['Population', 'Disease Outbreak Risk (%)', 'Malnutrition Rate (%)',
                         'Sanitation Score (0-10)', 'Waterborne Disease Risk (%)']]
        y = health_data['health_risk']

        # Encode target labels
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)

        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

        # Train Random Forest
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Evaluate
        y_pred = model.predict(X_test)
        print("\n✅ Model Evaluation")
        print("Accuracy:", accuracy_score(y_test, y_pred))
        print("Classification Report:\n", classification_report(y_test, y_pred))
        print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

        return model, label_encoder

    except Exception as e:
        print(f"❌ Error while training the model: {e}")
        exit()

# Function to make predictions and save to CSV without including 'health_risk' column
def predict_and_save_health_risk(model, label_encoder, input_data, output_file):
    try:
        input_data = input_data.copy()
        
        # Add predicted health risk column
        input_data['Predicted Health Risk'] = label_encoder.inverse_transform(
            model.predict(input_data[['Population', 'Disease Outbreak Risk (%)',
                                      'Malnutrition Rate (%)', 'Sanitation Score (0-10)',
                                      'Waterborne Disease Risk (%)']])
        )
        
        # Drop the original 'health_risk' column from the output
        input_data.drop(columns=['health_risk'], inplace=True)
        
        # Save the modified data to a new CSV file
        input_data.to_csv(output_file, index=False)
        
        print(f"📁 Results saved to: {output_file}")

    except Exception as e:
        print(f"❌ Error while making predictions or saving results: {e}")
        exit()

# Main execution flow
if __name__ == "__main__":
    try:
        # Ask user for file path
        input_csv = input("📂 Enter the path to your health dataset CSV file: ").strip()

        # Load and preprocess data
        data = load_and_preprocess_data(input_csv)

        # Train model
        model, label_encoder = train_model(data)

        # Predict and save results to new CSV without including 'health_risk'
        output_csv = "predicted_health_risk_output.csv"
        
        predict_and_save_health_risk(model, label_encoder, data, output_csv)

    except FileNotFoundError:
         print(f"❌ Error: The file '{input_csv}' was not found. Please make sure it exists in the specified path.")
    except Exception as e:
         print(f"❌ Unexpected error: {e}")
