let paisEscolhido = null;
let tentativas = 0;
const paises = [];
const dicas = [];

const regioes = {
    'SouthernAsia': 'Sul da Ásia',
    'WesternAsia': 'Ásia Ocidental',
    'South-easternAsia': 'Sudeste Asiático',
    'CentralAsia': 'Ásia central',
    'EasternAsia': 'Ásia Oriental',
    'NorthernAfrica': 'Norte da África',
    'MiddleAfrica': 'África Central',
    'WesternAfrica': 'África Ocidental',
    'SouthernAfrica': 'Sul da África',
    'EasternAfrica': 'Leste da África',
    'EasternEurope': 'Leste da Europa',
    'NorthernEurope': 'Norte da Europa',
    'WesternEurope': 'Oeste da Europa',
    'SouthernEurope': 'Sul da Europa',
    'CentralAmerica': 'América Central',
    'NorthernAmerica': 'América do Norte',
    'SouthAmerica': 'América do Sul',
    'Polynesia': 'Polinésia',
    'Caribbean': 'Caribe'
};

// Carregar CSV
Papa.parse("/stats_paises.csv", {
    download: true,
    header: true,
    complete: function(results) {
        paises.push(...results.data);
        console.log('Paises carregados:', paises);
        sortearPais();
        // Habilitar entrada e botão após carregar dados
        document.getElementById('guess').disabled = false;
        document.getElementById('guessButton').disabled = false;

        // Adicionar evento para enviar palpite com a tecla Enter
        document.getElementById('guess').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                checkGuess();
            }
        });
    },
    error: function(error) {
        console.error('Erro ao carregar CSV:', error);
    }
});


function sortearPais() {
    paisEscolhido = paises[Math.floor(Math.random() * paises.length)];
    console.log('Pais escolhido:', paisEscolhido);
    listarColunas(paisEscolhido);
}

function listarColunas(pais) {
    console.log('Colunas disponíveis no país escolhido:');
    for (let coluna in pais) {
        if (pais.hasOwnProperty(coluna)) {
            console.log(`${coluna}: ${pais[coluna]}`);
        }
    }
}

function checkGuess() {
    if (!paisEscolhido) {
        alert('Os dados dos países ainda não foram carregados. Por favor, tente novamente.');
        return;
    }

    const palpite = document.getElementById('guess').value;
    const message = document.getElementById('message');
    const hint = document.getElementById('hint');
    tentativas++;
    console.log(`Tentativa ${tentativas}: ${palpite}`);

    if (palpite.toLowerCase() === paisEscolhido['country'].toLowerCase()) {
        message.textContent = `Parabéns! Você adivinhou o país em ${tentativas} tentativas.`;
        hint.textContent = '';
        preencherInformacoesPais(paisEscolhido);
        document.getElementById('countryInfo').style.display = 'block';
        document.getElementById('playAgainButton').style.display = 'block';
    } else {
        message.textContent = 'Palpite errado! Tente novamente.';
        let dicaMostrada = false;

        while (!dicaMostrada && tentativas <= 8) {
            switch (tentativas) {
                case 1:
                    dicas.push(`Dica 1: O PIB per capita é ${paisEscolhido['GDP per capita (current US$)'] || 'não disponível'} dólares por ano.`);
                    dicaMostrada = paisEscolhido['GDP per capita (current US$)'] != -99;
                    break;
                case 2:
                    dicas.push(`Dica 2: A proporção da agricultura na economia é ${paisEscolhido['Economy: Agriculture (% of GVA)'] || 'não disponível'}%.`);
                    dicaMostrada = paisEscolhido['Economy: Agriculture (% of GVA)'] != -99;
                    break;
                case 3:
                    dicas.push(`Dica 3: A taxa de desemprego é ${paisEscolhido['Unemployment (% of labour force)'] || 'não disponível'}%.`);
                    dicaMostrada = paisEscolhido['Unemployment (% of labour force)'] != -99;
                    break;
                case 4:
                    dicas.push(`Dica 4: A mortalidade infantil é ${paisEscolhido['Infant mortality rate (per 1000 live births)'] || 'não disponível'} por 1.000 nascimentos.`);
                    dicaMostrada = paisEscolhido['Infant mortality rate (per 1000 live births)'] != -99;
                    break;
                case 5:
                    dicas.push(`Dica 5: A área do país é ${paisEscolhido['Surface area (km2)'] || 'não disponível'} km².`);
                    dicaMostrada = paisEscolhido['Surface area (km2)'] != -99;
                    break;
                case 6:
                    dicas.push(`Dica 6: A densidade populacional é ${paisEscolhido['Population density (per km2, 2017)'] || 'não disponível'} habitantes/km².`);
                    dicaMostrada = paisEscolhido['Population density (per km2, 2017)'] != -99;
                    break;
                case 7:
                    const populacao = paisEscolhido['Population in thousands (2017)'] ? paisEscolhido['Population in thousands (2017)'] * 1000 : 'não disponível';
                    dicas.push(`Dica 7: A população é ${populacao}.`);
                    dicaMostrada = paisEscolhido['Population in thousands (2017)'] != -99;
                    break;
                case 8:
                    dicas.push(`Dica 8: A localização é ${regioes[paisEscolhido['Region']] || 'não disponível'}.`);
                    dicaMostrada = paisEscolhido['Region'] != -99;
                    break;
                default:
                    dicas.push('Sem mais dicas disponíveis.');
                    dicaMostrada = true;
                    break;
            }

            if (!dicaMostrada) {
                tentativas++;
            }
        }

        // Atualizar todas as dicas
        hint.innerHTML = dicas.join('<br>');

        // Limpar o campo de entrada após palpite errado
        document.getElementById('guess').value = '';
    }
}

function preencherInformacoesPais(pais) {
    document.getElementById('countryName').textContent = pais['country'] || 'não disponível';
    document.getElementById('countryGDP').textContent = pais['GDP per capita (current US$)'] || 'não disponível';
    document.getElementById('countryAgriculture').textContent = pais['Economy: Agriculture (% of GVA)'] || 'não disponível';
    document.getElementById('countryUnemployment').textContent = pais['Unemployment (% of labour force)'] || 'não disponível';
    document.getElementById('countryInfantMortality').textContent = pais['Infant mortality rate (per 1000 live births)'] || 'não disponível';
    document.getElementById('countryArea').textContent = pais['Surface area (km2)'] || 'não disponível';
    document.getElementById('countryDensity').textContent = pais['Population density (per km2, 2017)'] || 'não disponível';
    document.getElementById('countryPopulation').textContent = pais['Population in thousands (2017)'] ? pais['Population in thousands (2017)'] * 1000 : 'não disponível';
    document.getElementById('countryRegion').textContent = regioes[pais['Region']] || 'não disponível';
}

function playAgain() {
    document.getElementById('message').textContent = '';
    document.getElementById('hint').textContent = '';
    document.getElementById('guess').value = '';
    document.getElementById('countryInfo').style.display = 'none';
    document.getElementById('playAgainButton').style.display = 'none';
    tentativas = 0;
    dicas.length = 0; // Limpar dicas
    sortearPais();
}
