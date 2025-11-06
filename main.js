// Esta função "inicia" tudo assim que a página carrega
window.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});

// A função principal que busca os dados do nosso JSON
async function carregarDados() {
    try {
        // 1. LER O ARQUIVO JSON
        // Usamos o 'fetch' para pegar o arquivo 'dados_clima.json'
        // O cache: 'no-cache' força o navegador a pegar o arquivo novo, 
        // e não um antigo que ficou na memória.
        const response = await fetch('dados_clima.json', { cache: 'no-cache' });
        
        // Se der erro ao ler o arquivo (ex: não achou)
        if (!response.ok) {
            throw new Error(`Erro ao carregar o JSON: ${response.statusText}`);
        }
        
        const data = await response.json();

        // 2. ATUALIZAR O HTML (A "MÁGICA")
        // Agora, vamos "injetar" os dados do JSON no HTML
        
        // Pega o elemento do HTML pelo ID e muda o texto dele
        document.getElementById('cidade-nome').textContent = data.cidade_nome;
        
        // Arredonda a temperatura para 1 casa decimal e bota o °C
        document.getElementById('temperatura').textContent = `${data.temperatura.toFixed(1)}°C`;
        document.getElementById('sensacao-termica').textContent = `${data.sensacao_termica.toFixed(1)}°C`;
        document.getElementById('humidade').textContent = `${data.humidade}%`;
        document.getElementById('descricao-clima').textContent = data.descricao_clima;
        document.getElementById('ultima-atualizacao').textContent = data.ultima_atualizacao;

        // Atualiza o ícone do clima
        const iconeUrl = `http://openweathermap.org/img/wn/${data.icone_clima}@2x.png`;
        document.getElementById('icone-clima').src = iconeUrl;
        
        // 3. DESENHAR O GRÁFICO (O que o TCC pedia)
        criarGrafico(data);

    } catch (error) {
        // Se der qualquer erro, mostra no console do navegador
        console.error("Falha ao carregar dados:", error);
        document.getElementById('cidade-nome').textContent = "Erro ao carregar dados.";
    }
}

// Função para criar o gráfico com Chart.js
function criarGrafico(data) {
    // Pega o <canvas> do HTML
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar', // Tipo do gráfico (barra)
        data: {
            // Rótulos do eixo X
            labels: ['Temperatura', 'Sensação Térmrica', 'Humidade'],
            datasets: [{
                label: 'Valores Atuais',
                // Os dados que vêm do nosso JSON
                data: [data.temperatura, data.sensacao_termica, data.humidade],
                // Cores das barras
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', // Vermelho para Temp
                    'rgba(255, 159, 64, 0.7)', // Laranja para Sensação
                    'rgba(54, 162, 235, 0.7)'  // Azul para Humidade
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true // Começa o eixo Y do zero
                }
            },
            plugins: {
                legend: {
                    display: false // Não precisa de legenda para 3 barras óbvias
                }
            }
        }
    });
}