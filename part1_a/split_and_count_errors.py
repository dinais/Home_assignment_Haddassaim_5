import os
import re
from collections import Counter

def split_file(file_path, lines_per_file=1000):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = []
        part = 0
        while True:
            for _ in range(lines_per_file):
                line = file.readline()
                if not line:
                    break
                lines.append(line)
            if not lines:
                break
            yield part, lines
            lines = []
            part += 1

def count_errors_in_part(lines):
    error_pattern = r"Error:\s?([A-Za-z0-9_]+)"
    part_counter = Counter()
    for line in lines:
        errors = re.findall(error_pattern, line)
        for error in errors:
            part_counter[error] += 1
    return part_counter

def merge_counters(counters):
    final_counter = Counter()
    for counter in counters:
        final_counter.update(counter)
    return final_counter

def split_and_count_errors(file_path, N):
    part_counters = []
    output_dir = "log_parts"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Split file into parts and process them
    for part_num, lines in split_file(file_path):
        part_file = os.path.join(output_dir, f"log_part_{part_num}.txt")
        with open(part_file, 'w', encoding='utf-8') as out_file:
            out_file.writelines(lines)

        # Count errors in each part
        part_counter = count_errors_in_part(lines)
        part_counters.append(part_counter)
    
    # Merge results from all parts
    final_counter = merge_counters(part_counters)

    # Print the top N most common errors
    print(f"\nTop {N} errors:")
    for error, count in final_counter.most_common(N):
        print(f"{error}: {count} occurrences")

# Usage example
split_and_count_errors("logs.txt", 10)


#תשובה לשאלה 5- ניתוח זמן ריצה ומקום בזכרון:
#ניתוח זמן ריצה:
#אנו קוראים את הקובץ ומחלקים אותו לחקלים- ולכן כל שורה נקראת פעם אחת, ולכן זה O(l) כך ש  l זה מספר השורות בקובץ.
#בכל שורה מחפשים אם יש בה שגיאה, אבל השורות הם באורך קבוע ולכן החיפוש עצמו עבור כל שורה הוא  O(1).
#איחוד הסופרים: לכל חלק יש סופר נפרד, והחיבור בינהם הוא תלוי בכמה שגיאות יש בסה"כ- O(U) אם יש U שגיאות.
#החזרת N השגיאות הכי נפוצות: זה מתבצע על הסופר הראשי שמכיל את כל השגיאות U , מה שקורה מאחורי הלקעים זה מיון ערימה- והוצאה של N הכי גדולים, ולכן זה O(UlogN)
#סה"כ זמן ריצה: O(L + U log N)
#ניתוח מקום בזכרון:
#התוכנית מחזיקה ב-RAM תוך כדי ריצה כל פעם רק חלק מסוים מהקובץ הגדול.
#וזהו מספר קבוע, ולכן בסה"כ זה O(1).
#השמירה של כל החלקים כקבצים נפרדים זה לא נחשב מקום בזכרון שאנו מתיחסים אליו פה- אלא זכרון על הדיסק. פה מדובר על זכרון RAM של התכנית בזמן ריצה.
#ספירת השגיאות: כל שיגאה נשמרת פעם אחת עם המונה שלה- אם יש U סוגי שגיאות שונים נצטרך O(U) מקום בזכרון.
# סה"כ מקום בזכרון: O(U), כאשר U הוא מספר סוגי השגיאות השונים.