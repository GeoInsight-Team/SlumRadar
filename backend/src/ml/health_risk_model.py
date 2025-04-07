import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.mixture import GaussianMixture
from sklearn.decomposition import PCA

# Load the dataset
df = pd.read_csv("health.csv")
df.columns = df.columns.str.strip()
df['Population'] = pd.to_numeric(df['Population'], errors='coerce')

# Simulate realistic values based on area category
def enrich_realistic_values(row):
    category = row['Category']
    if category == 'Slum':
        return {
            'Disease Outbreak Risk (%)': np.random.normal(80, 10),
            'Malnutrition Rate (%)': np.random.normal(45, 10),
            'Sanitation Score (0-10)': np.clip(np.random.normal(2.0, 1.0), 0, 10),
            'Waterborne Disease Risk (%)': np.random.normal(75, 10)
        }
    elif category == 'Semi-Developed':
        return {
            'Disease Outbreak Risk (%)': np.random.normal(50, 10),
            'Malnutrition Rate (%)': np.random.normal(25, 8),
            'Sanitation Score (0-10)': np.clip(np.random.normal(5.5, 1.5), 0, 10),
            'Waterborne Disease Risk (%)': np.random.normal(50, 10)
        }
    else:
        return {
            'Disease Outbreak Risk (%)': np.random.normal(25, 8),
            'Malnutrition Rate (%)': np.random.normal(10, 5),
            'Sanitation Score (0-10)': np.clip(np.random.normal(8.5, 1.0), 0, 10),
            'Waterborne Disease Risk (%)': np.random.normal(20, 8)
        }

# Enrich dataset
simulated = df.apply(enrich_realistic_values, axis=1, result_type='expand')
for col in simulated.columns:
    df[col] = np.round(simulated[col], 2)

# Feature selection
features = ['Population', 'Disease Outbreak Risk (%)', 'Malnutrition Rate (%)',
            'Sanitation Score (0-10)', 'Waterborne Disease Risk (%)']
X = df[features]
X_scaled = StandardScaler().fit_transform(X)

# Optional: PCA for dimensionality reduction
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
df['PCA1'], df['PCA2'] = X_pca[:, 0], X_pca[:, 1]

# Gaussian Mixture Model for clustering
gmm = GaussianMixture(n_components=3, random_state=42)
df['GMM_Cluster'] = gmm.fit_predict(X_scaled)

# Map to risk levels based on mean risk of each cluster
cluster_means = df.groupby('GMM_Cluster')[['Disease Outbreak Risk (%)', 'Malnutrition Rate (%)',
                                           'Waterborne Disease Risk (%)']].mean().sum(axis=1)
risk_order = cluster_means.sort_values().index
risk_mapping = {risk_order[0]: 'Low Risk', risk_order[1]: 'Medium Risk', risk_order[2]: 'High Risk'}
df['Clustered Risk Level'] = df['GMM_Cluster'].map(risk_mapping)

# Save result
output_path = "gmm_clustered_health_risk.csv"
df.to_csv(output_path, index=False)
print(f"📁 Clustered health risk data saved to {output_path}")
