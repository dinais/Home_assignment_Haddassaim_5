import pandas as pd

def read_and_prepare_file(file_path):
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        raise ValueError("Unsupported file format. Please use a CSV file.")
    df['timestamp'] = pd.to_datetime(df['timestamp'], format="%Y-%m-%d %H:%M:%S", errors='coerce')
    return df
