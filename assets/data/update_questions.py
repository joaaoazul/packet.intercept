import json

# Nome do arquivo original com as perguntas
input_filename = 'questions.json'
# Nome do arquivo de saída com as perguntas atualizadas
output_filename = 'questions_updated.json'

# Valores padrão para os campos que faltam
default_category = "Geral"
default_difficulty = "Médio"

# Abre e lê o arquivo JSON original
with open(input_filename, 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Atualiza cada pergunta com os valores padrão se os campos estiverem ausentes
for question in questions:
    if 'category' not in question:
        question['category'] = default_category
    if 'difficulty' not in question:
        question['difficulty'] = default_difficulty

# Salva o JSON atualizado em um novo arquivo
with open(output_filename, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Arquivo atualizado salvo em '{output_filename}'.")
