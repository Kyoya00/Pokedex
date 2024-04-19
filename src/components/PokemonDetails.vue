<template>
  <div class="pokemon-details" v-if="pokemon">
    <div class="pokemon-card">
      <div class="pokemon-header">
        <h2>{{ pokemon.name }}</h2>
      </div>
      <div class="pokemon-info">
        <img :src="pokemon.sprites.front_default" :alt="`Sprite of ${pokemon.name}`">
        <div class="pokemon-types">
          <div v-for="type in pokemon.types" :key="type.slot" class="type">{{ type.type.name }}</div>
        </div>
        <div class="pokemon-stats">
          <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat">
            <span>{{ stat.stat.name }}:</span> {{ stat.base_stat }}
          </div>
        </div>
      </div>
      <button class="close-button" @click="closeDetails">Close</button>
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
  methods: {
    closeDetails() {
      this.$emit('close');
    }
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
  padding: 20px;
}

.pokemon-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokemon-info {
  text-align: center;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.type {
  margin: 5px;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.pokemon-stats {
  margin-top: 10px;
}

.stat {
  margin-bottom: 5px;
}

.close-button {
  margin-top: 20px; /* Espaço entre os stats e o botão */
  background-color: #ccc;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
