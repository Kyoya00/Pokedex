<template>
  <div class="pokemon-details" v-if="pokemon" @click.self="closeDetails">
    <div class="pokemon-card" @click.stop>
      <div class="pokemon-header">
        <h3>{{ pokemon.name }}</h3>
      </div>
      <div class="pokemon-info">
        <div class="pokemon-images">
          <img v-for="(sprite, key) in filteredSprites" :key="key" :src="sprite" :alt="`Sprite of ${pokemon.name}`">
        </div>
        <div class="pokemon-types">
          <div v-for="type in pokemon.types" :key="type.slot" :style="{ backgroundColor: getTypeColor(type.type.name) }" class="type">{{ type.type.name }}</div>
        </div>
        <div>
          <h4>Attacks</h4>
        </div>
        <div class="pokemon-attacks">
          <div class="attack" v-for="(move, index) in pokemon.moves" :key="index">{{ move.move.name }}</div>
        </div>
        <div>
          <h4>Evolutions</h4>
        </div>
        <div class="pokemon-evolutions" v-if="evolutionChain.length">
          <ul>
            <li v-for="evolution in evolutionChain" :key="evolution.species.name">
              <img :src="evolution.species.sprite" :alt="`Sprite of ${evolution.species.name}`">
              <span>{{ evolution.species.name }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4>Games</h4>
        </div>
        <div class="pokemon-games">
          <div class="game" v-for="(game, index) in pokemon.game_indices" :key="index">{{ game.version.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTypeColor } from '../pokemonUtils'; // Importa a função getTypeColor

export default {
  props: {
    pokemon: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      evolutionChain: [] // Array para armazenar as evoluções do Pokémon
    };
  },
  computed: {
    filteredSprites() {
      return Object.values(this.pokemon.sprites).filter(sprite => typeof sprite === 'string' && sprite.trim() !== '');
    }
  },
  methods: {
    closeDetails() {
      this.$emit('close');
    },
    async fetchEvolutionDetails(pokemonId) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const data = await response.json();
        const evolutionChainUrl = data.evolution_chain.url;
        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionData = await evolutionResponse.json();
        await this.processEvolutionChainWithSprites(evolutionData.chain);
      } catch (error) {
        console.error('Erro ao buscar os detalhes de evolução:', error);
      }
    },
    async processEvolutionChainWithSprites(chain) {
      // Limpa o array de evoluções
      this.evolutionChain = [];
      // Adiciona as evoluções com sprites
      await this.traverseEvolutionChainWithSprites(chain, this.evolutionChain);
    },
    async traverseEvolutionChainWithSprites(chain, result) {
      // Adiciona a espécie atual com a sprite
      const sprite = await this.fetchPokemonSprite(chain.species.name);
      result.push({ 
        species: { 
          name: chain.species.name, 
          sprite: sprite 
        } 
      });
      // Se houver evoluções, processa cada uma delas
      if (chain.evolves_to && chain.evolves_to.length) {
        for (let i = 0; i < chain.evolves_to.length; i++) {
          await this.traverseEvolutionChainWithSprites(chain.evolves_to[i], result);
        }
      }
    },
    async fetchPokemonSprite(pokemonName) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
        const data = await response.json();
        return data.sprites.front_default;
      } catch (error) {
        console.error('Erro ao buscar a sprite do Pokémon:', error);
        return null;
      }
    },
    getTypeColor // Adiciona o método getTypeColor
  },
  mounted() {
    // Chama a função para buscar as evoluções do Pokémon
    this.fetchEvolutionDetails(this.pokemon.id);
  }
};
</script>

<style scoped>
/* Estilos do componente PokemonDetails */
.pokemon-details {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokemon-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  max-width: 300px; /* Define um tamanho máximo para o card */
  margin: 0 auto; /* Centraliza o card horizontalmente */
  overflow-y: auto; /* Adiciona uma barra de rolagem vertical quando necessário */
  max-height: 600px; /* Define uma altura máxima para o card */
}

.pokemon-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokemon-info {
  text-align: center;
}

.pokemon-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Duas colunas */
  gap: 10px; /* Espaçamento entre as imagens */
  justify-content: center; /* Centraliza horizontalmente as colunas */
}

.pokemon-images img {
  max-width: 100%; /* Assegura que as imagens não ultrapassem a largura da coluna */
  padding: 0px 20px;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  gap: 10px;
}

.type {
  padding: 5%;
  border-radius: 10px;
  line-height: 30px;
  max-width: 100px;
  width: 150%;
  text-align: center;
  color: white;
  box-shadow: 3px 2px black;
}

.pokemon-attacks {
  margin-top: 10px;
}

.attack {
  margin-bottom: 5px;
  font-size: 12px;
}

.pokemon-attacks {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colunas */
  gap: 5px;
}

.pokemon-evolutions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pokemon-evolutions h4 {
  margin-top: 10px;
  font-size: 14px;
}

.pokemon-evolutions ul li {
  display: flex;
  align-items: center;
}

.pokemon-evolutions ul li img {
  max-width: 50px;
  margin-right: 10px;
}

.pokemon-games {
  margin-top: 10px;
}

.game {
  margin-bottom: 5px;
  font-size: 12px;
}

.pokemon-games {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 colunas */
  gap: 5px;
}
</style>
