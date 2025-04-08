from my_utils import (
    read_and_prepare_file,
    check_invalid_dates,
    check_duplicates,
    check_missing_values,  
)
import pandas as pd
import os

def clean_data(df):
    # Cleans data by removing invalid dates, duplicates, and missing values
    if not check_invalid_dates(df):
        df = df.dropna(subset=['timestamp'])
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    if not check_duplicates(df):
        df = df.drop_duplicates()
    if not check_missing_values(df):
        df = df.dropna(subset=['value'])
    return df

def compute_hourly_average(file_path):
    # Computes hourly averages from a time series file
    df = read_and_prepare_file(file_path)
    df['hour'] = df['timestamp'].dt.floor('h')
    avg_df = df.groupby('hour')['value'].mean().reset_index()
    avg_df.columns = ['Starting time', 'Average']
    return avg_df

def split_and_save_by_day(df, output_folder='daily_chunks'):
    # Splits data by day and saves each day as a separate CSV file
    os.makedirs(output_folder, exist_ok=True)
    df['date'] = df['timestamp'].dt.date

    for date, group in df.groupby('date'):
        filename = os.path.join(output_folder, f"{date}.csv")
        group.drop(columns='date').to_csv(filename, index=False)

def main(file_path):
    # Main function to process the input file and generate hourly averages
    if file_path.endswith('.parquet'):
        df = pd.read_parquet(file_path)

        if set(df.columns).issuperset({'timestamp', 'mean_value'}):
            final_df = df.rename(columns={'timestamp': 'Starting time', 'mean_value': 'Average'})
            final_df = final_df[['Starting time', 'Average']]
        else:
            df = read_and_prepare_file(file_path)
            df = clean_data(df)
            split_and_save_by_day(df)
            all_results = []
            for filename in os.listdir('daily_chunks'):
                if filename.endswith('.csv'):
                    daily_path = os.path.join('daily_chunks', filename)
                    hourly_avg = compute_hourly_average(daily_path)
                    all_results.append(hourly_avg)
            final_df = pd.concat(all_results)
            final_df.sort_values(by='Starting time', inplace=True)
    else:
        df = read_and_prepare_file(file_path)
        df = clean_data(df)
        split_and_save_by_day(df)
        all_results = []
        for filename in os.listdir('daily_chunks'):
            if filename.endswith('.csv'):
                daily_path = os.path.join('daily_chunks', filename)
                hourly_avg = compute_hourly_average(daily_path)
                all_results.append(hourly_avg)
        final_df = pd.concat(all_results)
        final_df.sort_values(by='Starting time', inplace=True)

    output_file = 'final_hourly_avg.csv'
    final_df.to_csv(output_file, index=False)
    print(f"Saved hourly averages to: {output_file}")

if __name__ == '__main__':
    # Runs the main function with a default file
    main('time_series.parquet')

#תשובה לשאלה 3:
#אם הנתונים מגיעים בזרימה במקום מקובץ, כיצד תתכנני את הפתרון כדי לעדכן את הממוצעים השעתיים בזמן אמת?  
#נשמור מידע מצטבר לכל שעה- במקום לחשב כל פעם מחדש את כל הממוצעים...
#נעשה את זה בצורה הבאה: נשמור מילון שהמפחות בו יהיו השעה.
#עבור כל מפתח (שעה) יהיו 2 ערכים- סכום הערכים לשעה זו, ומספר הערכים שהתקבלו עד כה לשעה זו.
#בכל פעם שיגיע ערך חדש נחשב את השעה שלו, ונעדכן את הערכים במפתח המתאים במילון.
#נעלה את המספר הערכים שהתקבלו עד כה ב1, וכמובן- נוסיף את הערך לסכום הערכים לשעה זו.
#ומיד אחרי העדכונים האלה כמובן נעדכן את הממוצע לשעה זו ע"י הסכום חלקי מספר הערכים...
#וכך אני חוסכים את הי=חישוב בכל פעם מחדש של הממוצע - כי אנו עושים פה פעולות מאד זולות מבחנית זמן ריצה
# (גישה למפתח במילון ועדכונים מתאימים זה o(1))

#תשובה לשאלה 4:
#למה כדאי להשתמש ב־Parquet?
#יעילות באחסון – קבצי Parquet דחוסים הרבה יותר מ־CSV.
#מהירות – קריאה וכתיבה של Parquet מהירה בהרבה, במיוחד עם הרבה שורות.
#שמירה על טיפוסי נתונים – בפורמט Parquet נשמר המידע על הסוגים (datetime, מספרים וכו'), מה שדורש פחות עיבוד מאוחר יותר.
#מובנה – מדובר בפורמט עמודות (columnar), מה שמאפשר קריאה סלקטיבית לפי עמודות – מועיל במיוחד עם דאטה גדול.

