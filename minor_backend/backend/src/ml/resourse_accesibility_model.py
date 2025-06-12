import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
from sklearn.ensemble import GradientBoostingRegressor

# Development thresholds (adjust based on your criteria)
DEVELOPED_TOILET_RATIO = 50  # 1 toilet per 50 people
DEVELOPED_SCHOOL_RATIO = 400  # 1 school per 400 people

def train_priority_model():
    try:
        print("⏳ Training priority model...")
        
        # Create synthetic training data if the real file doesn't exist
        if not os.path.exists('processed_infra_needs.csv'):
            print("ℹ Creating synthetic training data...")
            # Generate synthetic data
            np.random.seed(42)
            n_samples = 200
            synthetic_data = {
                'population': np.random.randint(1000, 20000, n_samples),
                'hospitals': np.random.randint(10, 200, n_samples),
                'schools': np.random.randint(20, 200, n_samples),
                'clinics': np.random.randint(10, 150, n_samples),
                'toilets': np.random.randint(20, 300, n_samples),
                'toilet_priority': np.random.randint(1, 11, n_samples),
                'school_priority': np.random.randint(1, 11, n_samples)
            }
            train_df = pd.DataFrame(synthetic_data)
        else:
            # Load actual training data
            train_df = pd.read_csv('processed_infra_needs.csv')
        
        # Calculate development needs
        train_df['needed_toilets'] = (train_df['population'] / DEVELOPED_TOILET_RATIO).astype(int) - train_df['toilets']
        train_df['needed_schools'] = (train_df['population'] / DEVELOPED_SCHOOL_RATIO).astype(int) - train_df['schools']
        
        # Ensure non-negative values
        train_df['needed_toilets'] = train_df['needed_toilets'].clip(lower=0)
        train_df['needed_schools'] = train_df['needed_schools'].clip(lower=0)
        
        # Prepare features and targets
        features = ['population', 'hospitals', 'schools', 'clinics', 'toilets', 
                    'needed_toilets', 'needed_schools']
        X = train_df[features]
        y = train_df[['toilet_priority', 'school_priority']]  # Separate targets
        
        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train model with multi-output support
        model = MultiOutputRegressor(
            GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, max_depth=5)
        )
        model.fit(X_train_scaled, y_train)
        
        # Evaluate
        preds = model.predict(X_test_scaled)
        mse_toilet = mean_squared_error(y_test['toilet_priority'], preds[:, 0])
        mse_school = mean_squared_error(y_test['school_priority'], preds[:, 1])
        print(f"✓ Toilet Priority MSE: {mse_toilet:.2f}")
        print(f"✓ School Priority MSE: {mse_school:.2f}")
        
        # Save model components
        joblib.dump({'model': model, 'scaler': scaler}, 'priority_model.pkl')
        print("✅ Model trained and saved successfully!")
        
    except Exception as e:
        print(f"❌ Error while training model: {str(e)}")

def process_infrastructure_data(file_path, output_path):
    try:
        # Load input data
        df = pd.read_csv(file_path)
        
        # Check required columns (add 'category' to required columns)
        required_cols = ['latitude', 'longitude', 'area_name', 'city_name', 
                        'population', 'schools', 'toilets', 'category']
        
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            print(f"❌ Missing columns in input file: {missing_cols}")
            return
        
        # Calculate development needs
        df['needed_toilets'] = ((df['population'] / DEVELOPED_TOILET_RATIO).astype(int) 
                               - df['toilets']).clip(lower=0)
        df['needed_schools'] = ((df['population'] / DEVELOPED_SCHOOL_RATIO).astype(int) 
                               - df['schools']).clip(lower=0)

        # Load model and scaler
        model_data = joblib.load('priority_model.pkl')
        model, scaler = model_data['model'], model_data['scaler']
        
        # Prepare features for prediction
        features = ['population', 'hospitals', 'schools', 'clinics', 'toilets','needed_toilets', 'needed_schools']
        
        X = df[features].fillna(0)  # Fill missing values with zero for prediction compatibility
        X_scaled = scaler.transform(X)
        
        # Get predictions for toilet and school priorities (scale: 1-10)
        priorities = model.predict(X_scaled)
        
        df['toilet_priority'] = np.round(priorities[:, 0]).clip(1, 10).astype(int)
        df['school_priority'] = np.round(priorities[:, 1]).clip(1, 10).astype(int)

        # Save results with category printed after toilets column in output file
        output_cols = ['latitude', 'longitude', 'area_name', 'city_name', 
                       'population', 'hospitals', 'schools', 'clinics',
                       'toilets', 'category', 
                       'needed_schools', 'needed_toilets',
                       'school_priority', 'toilet_priority']
        
        df[output_cols].to_csv(output_path, index=False)
        
        print(f"✅ Results saved to {output_path}")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    if not os.path.exists('priority_model.pkl'):
       print("⚠ Model not found. Training a new one...")
       train_priority_model()
    
    input_file_path = input("Enter the path to your input CSV file (e.g., classified_areas.csv): ").strip()
    process_infrastructure_data(input_file_path, "detailed_priorities_with_category.csv")
