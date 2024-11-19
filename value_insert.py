import pandas as pd
file_path = 'CPSC304_Node_Project-main/UBC_EATS_FINAL_DATABASE_STRUCTURE.xlsx'
excel_data = pd.ExcelFile(file_path)

insert_script = ''

for sheet_name in excel_data.sheet_names:
    # Load
    df = excel_data.parse(sheet_name)

    # Use sheet name as table names
    table_name = sheet_name.replace(' ', '_')

    # Generate INSERT INTO statements for each row
    for _, row in df.iterrows():
        values = ', '.join([f"'{str(value).replace("'", "''")}'" for value in row.values])
        insert_script += f"INSERT INTO {table_name} VALUES ({values});\n"
    
    insert_script += '\n' 

# Save the SQL insert script to a file
output_path = 'insertions.sql'
with open(output_path, 'w') as f:
    f.write(insert_script)

output_path
