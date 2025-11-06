import requests
import json
import time # Importamos para saber a hora

# Linha nova (JEITO CERTO):
import os
API_KEY = os.environ.get("OPENWEATHER_API_KEY")

if not API_KEY:
    raise ValueError("Chave de API 'OPENWEATHER_API_KEY' não encontrada nas variáveis de ambiente.")
CIDADE = "Belo Horizonte" # Ou a cidade que você escolheu
UNITS = "metric"
LANGUAGE = "pt_br"

# Nome do arquivo que o site vai ler
ARQUIVO_DE_SAIDA = "dados_clima.json" 

# --- O SCRIPT ---
print(f"Buscando dados para {CIDADE}...")
url = f"https://api.openweathermap.org/data/2.5/weather?q={CIDADE}&appid={API_KEY}&units={UNITS}&lang={LANGUAGE}"

try:
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()

        # --- ANÁLISE DOS DADOS ---
        # Pegamos SÓ o que nos interessa
        
        analise = {
            "cidade_nome": data['name'],
            "temperatura": data['main']['temp'],
            "sensacao_termica": data['main']['feels_like'],
            "humidade": data['main']['humidity'],
            "descricao_clima": data['weather'][0]['description'].capitalize(),
            "icone_clima": data['weather'][0]['icon'], # O ícone do clima!
            "ultima_atualizacao": time.strftime("%d/%m/%Y %H:%M:%S") # A hora que rodamos
        }
        
        # --- SALVANDO O ARQUIVO (A PARTE NOVA!) ---
        # Vamos salvar o dicionário 'analise' em um arquivo JSON
        with open(ARQUIVO_DE_SAIDA, 'w', encoding='utf-8') as f:
            json.dump(analise, f, indent=4, ensure_ascii=False)
        
        print(f"Sucesso! Dados salvos em '{ARQUIVO_DE_SAIDA}'")
        print("--- Dados Salvos ---")
        print(json.dumps(analise, indent=4, ensure_ascii=False))

    else:
        print(f"Erro ao buscar dados. Código: {response.status_code}")
        print(f"Mensagem: {response.text}")

except Exception as e:
    print(f"Ocorreu um erro na requisição: {e}")
