import { createRouter, createWebHistory } from 'vue-router';
import PokemonListView from '../components/PokemonList.vue';
import AboutView from '../views/AboutView.vue'; // Adicionado o import do AboutView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PokemonListView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView // Use o componente AboutView diretamente
    }
  ]
});

export default router;
