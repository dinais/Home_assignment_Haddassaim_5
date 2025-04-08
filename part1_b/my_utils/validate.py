def check_invalid_dates(df):
    return df['timestamp'].isnull().sum() == 0

def check_duplicates(df):
    return df.duplicated().sum() == 0

def check_missing_values(df):
    return df['value'].isnull().sum() == 0
