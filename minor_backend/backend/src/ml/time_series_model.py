import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import warnings
import pmdarima as pm
from statsmodels.tsa.arima.model import ARIMA
import time
from tqdm import tqdm
import os

# Try to import TensorFlow, but provide alternative if not available
try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Input
    from tensorflow.keras.callbacks import EarlyStopping
    from sklearn.model_selection import train_test_split
    TF_AVAILABLE = True
except ImportError:
    print("TensorFlow not available. Using ARIMA-only approach.")
    TF_AVAILABLE = False

# Load the data from your CSV file
data = pd.read_csv('multi_region_slum_growth_1995_2025.csv')

# Rename the 'Year' column to 'time' for consistency
data.rename(columns={'Year': 'time'}, inplace=True)

def predict_with_arima(df, forecast_steps):
    """Fallback prediction using only ARIMA"""
    try:
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore")
            # Simplified ARIMA with limited parameter search
            arima_model = pm.auto_arima(df['Slum Growth (%)'], seasonal=False, 
                                      max_p=2, max_d=1, max_q=2,
                                      stepwise=True, suppress_warnings=True,
                                      error_action='ignore', max_order=5)
            arima_order = arima_model.order
            arima_model_fit = ARIMA(df['Slum Growth (%)'], order=arima_order).fit()
            predictions = arima_model_fit.forecast(steps=forecast_steps).tolist()
            return predictions
    except Exception as e:
        # Even simpler fallback if ARIMA fails
        values = df['Slum Growth (%)'].values
        window = min(3, len(values))
        avg = np.mean(values[-window:])
        # Simple increasing trend based on historical data
        growth_rate = 0.1
        if len(values) > 1:
            growth_rate = np.mean(np.diff(values)) if np.mean(np.diff(values)) > 0 else 0.1
        return [avg + growth_rate*i for i in range(forecast_steps)]

def predict_slum_probability_combined(area_df, sequence_length, forecast_steps):
    """Optimized prediction function"""
    df = area_df[['time', 'Slum Growth (%)']].copy()
    df.loc[:, 'Slum Growth (%)'] = pd.to_numeric(df['Slum Growth (%)'], errors='coerce')
    df.dropna(subset=['Slum Growth (%)'], inplace=True)
    df.loc[:, 'time'] = pd.to_datetime(df['time'], format='%Y').dt.year
    df.set_index('time', inplace=True)
    
    # If TensorFlow is not available, use ARIMA only
    if not TF_AVAILABLE or len(df) <= sequence_length + 1:
        return predict_with_arima(df, forecast_steps)
    
    # LSTM model code (only runs if TensorFlow is available)
    target_col = 'Slum Growth (%)'
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[[target_col]])
    
    # Prepare time series data
    X, y = [], []
    for i in range(len(scaled_data) - sequence_length):
        X.append(scaled_data[i:i + sequence_length, 0])
        y.append(scaled_data[i + sequence_length, 0])
    X, y = np.array(X), np.array(y)
    
    # Create and train model with fixed parameters (no GridSearchCV)
    model = Sequential()
    model.add(Input(shape=(sequence_length, 1)))
    model.add(LSTM(50, activation='relu'))
    model.add(Dense(1))
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), loss='mse')
    
    # Add early stopping to prevent unnecessary training
    early_stopping = EarlyStopping(monitor='loss', patience=10)
    
    X_reshaped = np.reshape(X, (X.shape[0], X.shape[1], 1))
    model.fit(X_reshaped, y, epochs=50, batch_size=16, verbose=0, callbacks=[early_stopping])
    
    # Generate LSTM predictions
    last_sequence = X[-1].reshape((1, sequence_length, 1))
    lstm_predictions = []
    for _ in range(forecast_steps):
        next_pred = model.predict(last_sequence, verbose=0)[0, 0]
        lstm_predictions.append(next_pred)
        last_sequence = np.append(last_sequence[0, 1:, 0], next_pred).reshape((1, sequence_length, 1))
    
    lstm_predictions = scaler.inverse_transform(np.array(lstm_predictions).reshape(-1, 1)).flatten().tolist()
    
    # Get ARIMA predictions
    arima_predictions = predict_with_arima(df, forecast_steps)
    
    # Combine predictions
    combined_predictions = [(lstm + arima) / 2 for lstm, arima in zip(lstm_predictions, arima_predictions)]
    return combined_predictions

# Main processing loop with results collection for CSV
unique_areas = data['Region'].unique()
sequence_length = 3
forecast_steps = 5
results = []

# Process each region with progress indicator
for area in tqdm(unique_areas, desc="Processing regions"):
    area_data = data[data['Region'] == area]
    if len(area_data) > 0:
        try:
            start_time = time.time()
            predictions = predict_slum_probability_combined(area_data, sequence_length, forecast_steps)
            processing_time = time.time() - start_time
            
            # Get the last year in the data
            last_year = int(area_data['time'].max())
            
            # Add predictions to results
            for i, pred in enumerate(predictions):
                results.append({
                    'Region': area,
                    'Year': last_year + i + 1,
                    'Predicted Slum Growth (%)': round(pred, 2),
                    'Processing Time (s)': round(processing_time, 2)
                })
            print(f"Region {area}: {len(predictions)} predictions in {processing_time:.2f}s")
        except Exception as e:
            print(f"Error processing {area}: {str(e)}")
    else:
        print(f"No data for {area}")

# Create and save CSV file
results_df = pd.DataFrame(results)
output_file = 'slum_growth_predictions.csv'
results_df.to_csv(output_file, index=False)
print(f"Predictions saved to '{os.path.abspath(output_file)}'")