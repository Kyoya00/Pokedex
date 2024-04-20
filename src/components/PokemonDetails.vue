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
          <div v-for="type in pokemon.types" :key="type.slot" class="type">{{ type.type.name }}</div>
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
            <li v-for="evolution in evolutionChain" :key="evolution.species.name">{{ evolution.species.name }}</li>
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
        this.processEvolutionChain(evolutionData.chain);
      } catch (error) {
        console.error('Erro ao buscar os detalhes de evolução:', error);
      }
    },
    processEvolutionChain(chain) {
      this.traverseEvolutionChain(chain, this.evolutionChain);
    },
    traverseEvolutionChain(chain, result) {
      result.push({ species: { name: chain.species.name } });
      if (chain.evolves_to && chain.evolves_to.length) {
        chain.evolves_to.forEach(subChain => {
          this.traverseEvolutionChain(subChain, result);
        });
      }
    }
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
  max-height: 80vh; /* Altura máxima do card */
  overflow-y: auto; /* Adiciona scroll quando necessário */
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
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.pokemon-images img {
  margin: 0 5px;
  max-width: 80px;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.type {
  margin: 3px;
  padding: 3px;
  background-color: #f0f0f0;
  border-radius: 3px;
  font-size: 12px;
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

.close-button {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ccc;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
</style>
