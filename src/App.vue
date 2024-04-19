<template>
  <div id="app">
    <PokemonList />
  </div>
</template>

<script>
import PokemonList from './components/PokemonList.vue';

export default {
  components: {
    PokemonList
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>