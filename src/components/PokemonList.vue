<template>
  <div class="pokemon-list">
    <!-- Filtros -->
    <div class="filters">
      <input type="text" v-model="searchTerm" placeholder="Search by name or ID...">
      <select v-model="selectedType" @change="filterPokemonsByType">
        <option value="">All Types</option>
        <option v-for="type in allTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
    
    <!-- Lista de Pokémon -->
    <div class="pokemon-list-container">
      <div class="pokemon-item" v-for="pokemon in filteredPokemons" :key="pokemon.id" @click="showDetails(pokemon)" :style="{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }">
        <div class="pokemon-id">#{{ pokemon.id }}</div>
        <div class="pokemon-name">{{ pokemon.name }}</div>
        <div class="pokemon-info">
          <div class="pokemon-details">
            <div class="pokemon-types">
              <div v-for="type in pokemon.types" :key="type.slot" :style="{ backgroundColor: getTypeColor(type.type.name) }" class="type">{{ type.type.name }}</div>
            </div>
          </div>
          <img :src="pokemon.sprites.other.showdown.front_default" alt="Sprite of {{ pokemon.name }}" class="pokemon-sprite">
        </div>
      </div>
    </div>

    <!-- Mostrar loading quando estiver carregando mais Pokémon -->
    <div v-if="loading" class="loading">Loading...</div>

    <!-- Detalhes do Pokémon -->
    <PokemonDetails :pokemon="selectedPokemon" v-if="showPokemonDetails" @close="closeDetails" />
  </div>
</template>

<script>
import axiosInstance from '@/axiosConfig';
import PokemonDetails from './PokemonDetails.vue';

export default {
  components: {
    PokemonDetails
  },
  data() {
    return {
      pokemons: [],
      filteredPokemons: [],
      searchTerm: '',
      selectedType: '',
      loading: false,
      offset: 0,
      limit: 50, // Número de Pokémon a buscar por vez
      allTypes: [], // Lista de todos os tipos disponíveis
      showPokemonDetails: false,
      selectedPokemon: null
    };
  },
  mounted() {
    this.fetchPokemons();
    this.fetchAllTypes();

    // Adiciona um event listener para o evento de scroll na janela
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    fetchPokemons() {
      if (!this.loading) {
        this.loading = true;
        axiosInstance.get(`pokemon?offset=${this.offset}&limit=${this.limit}`)
          .then(response => {
            // Recupera os detalhes adicionais de cada Pokémon, incluindo os tipos
            const pokemonDetailsPromises = response.data.results.map(result =>
              axiosInstance.get(result.url)
            );
            Promise.all(pokemonDetailsPromises)
              .then(pokemonDetailsResponses => {
                this.pokemons.push(...pokemonDetailsResponses.map(response => response.data));
                this.filteredPokemons = this.filterPokemons();
                this.offset += this.limit;
                this.loading = false;
              })
              .catch(error => {
                console.error('Erro ao buscar os detalhes dos Pokémon:', error);
                this.loading = false;
              });
          })
          .catch(error => {
            console.error('Erro ao buscar os Pokémon:', error);
            this.loading = false;
          });
      }
    },
    fetchAllTypes() {
      axiosInstance.get(`type`)
        .then(response => {
          this.allTypes = response.data.results.map(result => result.name);
        })
        .catch(error => {
          console.error('Erro ao buscar os tipos de Pokémon:', error);
        });
    },
    filterPokemons() {
      return this.pokemons.filter(pokemon => {
        // Filtra por nome, ID ou espécie
        const nameOrIdMatch = pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          pokemon.id.toString().includes(this.searchTerm.toLowerCase()) ||
          pokemon.species.name.toLowerCase().includes(this.searchTerm.toLowerCase());
        // Filtra por tipo, se selecionado
        const typeMatch = !this.selectedType || pokemon.types.some(type => type.type.name === this.selectedType);
        return nameOrIdMatch && typeMatch;
      });
    },
    filterPokemonsByType() {
      this.filteredPokemons = this.filterPokemons();
    },
    // Função para lidar com o evento de scroll
    handleScroll() {
      // Verifica se o usuário chegou ao fim da página
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // Carrega mais Pokémon
        this.fetchPokemons();
      }
    },
    showDetails(pokemon) {
      this.selectedPokemon = pokemon;
      this.showPokemonDetails = true;
    },
    closeDetails() {
      this.showPokemonDetails = false;
      this.selectedPokemon = null;
    },
    getTypeColor(type) {
      const colors = {
        normal: '#AAAA99',
        fighting: '#BB5544',
        flying: '#8899FF',
        poison: '#AA5599',
        ground: '#DDBB55',
        rock: '#BBAA66',
        bug: '#AABB22',
        ghost: '#6666BB',
        steel: '#AAAABB',
        fire: '#FF4422',
        water: '#3399FF',
        grass: '#77CC55',
        electric: '#FFCC33',
        psychic: '#FF5599',
        ice: '#66CCFF',
        dragon: '#7766EE',
        dark: '#775544',
        fairy: '#EE99EE',
      };
      return colors[type.toLowerCase()] || '#FFFFFF'; // Retorna a cor correspondente ao tipo ou branco se não houver correspondência
    }
    
  },
  watch: {
    // Assista às alterações do filtro de pesquisa e atualize a lista filtrada
    searchTerm() {
      this.filteredPokemons = this.filterPokemons();
    }
  },
  beforeDestroy() {
    // Remove o event listener quando o componente for destruído
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped>
/* Estilos do componente PokemonList */
.pokemon-list {
  padding: 3% 20%;
}

.filters {
  display: flex;
  justify-content: center;
  align-items: right;
  margin-bottom: 50px;
}

.filters input, .filters select {
  margin-right: 10px;
}

.pokemon-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px; /* Espaçamento entre os Pokémon */
  justify-content: center; /* Centraliza os itens horizontalmente */
}

.pokemon-item {
    width: 200px;
    height: 200px;
    display: grid;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    border-right: solid;
    border-bottom: solid;
    border-top: outset;
    cursor: pointer;
    background: linear-gradient(to left, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.3) 90%, rgba(0, 0, 0, 0.3) 100%);
    transition: transform 0.3s ease;
}

.pokemon-item:hover {
  transform: translateY(-2px);
}

.pokemon-info {
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: center;
  gap: 60px;
}

.pokemon-id {
  text-align: right;
  margin: 5px;
  padding: 1% 8%;
  color: white;
}

.pokemon-sprite {
  width: 65px; /* Tamanho da sprite do Pokémon */
  height: 69px; /* Altura automática para manter a proporção */
}

.pokemon-details {
  margin-top: 10px; /* Espaçamento entre a sprite e os detalhes */
}

.pokemon-name {
  padding-left: 25px;
  font-weight: bold;
  font-size: 25px;
  color: white;
  text-shadow: 2px 2px #000000;
}

.pokemon-types {
  display: flex;
  flex-direction: column; /* Empilha os tipos verticalmente */
  align-items: flex-start; /* Alinha os tipos à esquerda */
  gap: 5px;
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

.loading {
  margin-top: 10px;
  text-align: center;
  font-style: italic;
}
</style>
