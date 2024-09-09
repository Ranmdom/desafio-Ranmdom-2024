class RecintosZoo {
    constructor() {
        this.recintos = [
            {numero: 1, bioma: 'savana', tamanho: 10, animais: {macacos: 3}},
            {numero: 2, bioma: 'floresta', tamanho: 5, animais: {}},
            {numero: 3, bioma: 'savana e rio', tamanho: 7, animais: {gazela: 1}},
            {numero: 4, bioma: 'rio', tamanho: 8, animais: {}},
            {numero: 5, bioma: 'savana', tamanho: 9, animais: {leao: 1}}
        ];

        this.animais = {
            LEAO: {tamanho: 3, biomas: ['savana'], carnivoro: true}, 
            LEOPARDO: {tamanho: 2, biomas: ['savana'], carnivoro: true},
            CROCODILO: {tamanho: 3, biomas: ['rio'], carnivoro: true},
            MACACO: {tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false},
            GAZELA: {tamanho: 2, biomas: ['savana'], carnivoro: false},
            HIPOPOTAMO: {tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false}
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        tipoAnimal = tipoAnimal.toUpperCase();

        if (typeof tipoAnimal !== 'string' || typeof quantidade !== 'number') {
            return { erro: "Tipo de dado inválido" };
        }

        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const recintosViaveis = [];
        for (const recinto of this.recintos) {
            const espacoDisponivel = this.calculaEspacoDisponivel(recinto, tipoAnimal, quantidade);
            if (espacoDisponivel >= 0) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanho})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }
    calculaEspacoDisponivel(recinto, tipoAnimal, quantidade) {
        const animalInfo = this.animais[tipoAnimal];
    
        // Verifica se o bioma do recinto é compatível
        const biomaAdequado = animalInfo.biomas.includes(recinto.bioma) || (animalInfo.biomas.includes('savana') && recinto.bioma === 'savana e rio');
        if (!biomaAdequado) {
            return -1;
        }
    
        // Verifica se há carnívoros no recinto
        const temCarnivoro = Object.keys(recinto.animais).some(
            tipo => this.animais[tipo.toUpperCase()]?.carnivoro
        );
    
        // Macacos não podem estar com carnívoros
        if (tipoAnimal === 'MACACO' && temCarnivoro) {
            return -1;
        }
    
        const espacoNecessario = animalInfo.tamanho * quantidade;
        let espacoOcupado = Object.entries(recinto.animais).reduce((sum, [tipo, qtd]) => {
            const tipoExistente = Object.keys(this.animais).find(
                t => t.toLowerCase() === tipo.toLowerCase().replace(/s$/, '')
            );
    
            if (!tipoExistente) {
                console.error(`Tipo de animal existente não encontrado: ${tipo}`);
                return sum;
            }
    
            return sum + (this.animais[tipoExistente].tamanho * qtd);
        }, 0);
    
        // Regra específica para o Recinto 1:
        if (recinto.numero === 1 && tipoAnimal === 'MACACO') {
            // Calcula o espaço ocupado apenas pelos macacos
            espacoOcupado += espacoNecessario;
    
            // Verifica se há espaço suficiente
            const espacoRestante = recinto.tamanho - espacoOcupado;
            return espacoRestante >= 0 ? espacoRestante : -1;
        }
    
        // Verifica se há múltiplas espécies no recinto
        const especiesPresentes = Object.keys(recinto.animais).map(tipo => tipo.toUpperCase());
        const numeroDeEspecies = new Set(especiesPresentes).size;
    
        // Adiciona espaço extra corretamente se houver múltiplas espécies no recinto
        if (numeroDeEspecies > 1 || (numeroDeEspecies === 1 && !especiesPresentes.includes(tipoAnimal))) {
            espacoOcupado += 1;
        }
    
        // Verifica regras de convivência para carnívoros
        if (animalInfo.carnivoro && Object.keys(recinto.animais).length > 0 && !recinto.animais[tipoAnimal.toLowerCase()]) {
            return -1; // Carnívoros não podem habitar com outras espécies
        }
    
        // Regras para o hipopótamo
        if (tipoAnimal === 'HIPOPOTAMO' && Object.keys(recinto.animais).length > 0 && recinto.bioma !== 'savana e rio') {
            return -1;
        }
    
        const espacoRestante = recinto.tamanho - espacoOcupado - espacoNecessario;
    
        return espacoRestante >= 0 ? espacoRestante : -1;
    }
    
    
}

export { RecintosZoo };

// Testando com os diferentes animais e quantidades
const zoo = new RecintosZoo();
const tiposDeAnimais = [
    {tipo: 'MACACO', quantidade: 2},
    {tipo: 'LEOPARDO', quantidade: 1},
    {tipo: 'CROCODILO', quantidade: 1},
    {tipo: 'HIPOPOTAMO', quantidade: 1}
];

tiposDeAnimais.forEach(animal => {
    console.log(`Analisando recintos para ${animal.quantidade} ${animal.tipo}(s):`);
    console.log(zoo.analisaRecintos(animal.tipo, animal.quantidade));
});

