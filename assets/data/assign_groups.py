import json

# Nome do arquivo original e do arquivo de saída
input_filename = 'questions.json'
output_filename = 'questions_grouped.json'

# Definição dos grupos e suas palavras-chave (todas em minúsculas)
groups_keywords = {
    "1": ["cia", "autenticação", "privacidade", "ética", "não-repúdio"],
    "2": ["continuidade", "dr", "recuperação"],
    "3": ["acesso", "rbac", "controles físicos", "controles lógicos", "menor privilégio"],
    "4": ["rede", "firewall", "vpn", "ids", "ips", "ddos", "protocolos"],
    "5": ["segurança de dados", "endurecimento", "treinamento", "resposta a incidentes", "forense"]
}

def assign_group(question_text):
    text = question_text.lower()
    # Percorre os grupos na ordem desejada (1 a 5)
    for group, keywords in groups_keywords.items():
        for kw in keywords:
            if kw in text:
                return group
    # Se nenhuma palavra-chave for encontrada, atribui um grupo padrão (por exemplo, "1")
    return "1"

# Abre e lê o arquivo JSON original
with open(input_filename, 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Atualiza cada questão com o campo "group" se não existir
for question in questions:
    if 'group' not in question or not question['group'].strip():
        question['group'] = assign_group(question['question'])

# Salva o JSON atualizado em um novo arquivo
with open(output_filename, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Arquivo com grupos atualizado salvo em '{output_filename}'.")
