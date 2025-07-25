import re

def format_text(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8') as outfile:
        for line in infile:
            formatted_line = ""
            while '(' in line:
                index = line.find('(')
                formatted_line += line[:index] + '\n('
                line = line[index+1:]
            formatted_line += line
            outfile.write(formatted_line)

input_file = 'reference/table_questions_export.txt'
output_file = 'temp_file.txt'
format_text(input_file, output_file)
