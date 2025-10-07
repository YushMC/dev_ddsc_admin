<template>
  <div class="fl_column">
    <figure class="glass_card fl_evenly" style="cursor: initial">
      <NuxtImg :src="token_data.url_logo" loading="lazy" decoding="async" />
      <section class="fl_column">
        <h1 style="font-size: 2rem">Hola {{ token_data.nombre }}!</h1>
        <h3>Rol: {{ token_data.rol_nombre }}</h3>
      </section>
    </figure>
    <USeparator label="Acciones rápidas" />
    <section class="fl_evenly">
      <div class="glass_card fl_column" @click="router.push('/usuarios')">
        <h1><UIcon name="i-lucide-user" /> Ver usuarios</h1>
      </div>
      <div class="glass_card fl_column" @click="router.push('/mods')">
        <h1><UIcon name="i-lucide-book" /> Ver Mods</h1>
      </div>
      <div
        class="glass_card fl_column"
        @click="router.push('/mods/categorias')"
      >
        <h1><UIcon name="i-lucide-book-heart" /> Ver Categorias</h1>
      </div>
      <div class="glass_card fl_column" @click="router.push('/mods/sagas')">
        <h1><UIcon name="i-lucide-library-big" /> Ver Sagas</h1>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { token_data } = useAccounts();
const router = useRouter();

useHead({
  title: "Panel",
});
</script>

<style scoped>
img {
  width: 200px;
  aspect-ratio: 1/1;
  border-radius: 100%;
}

.glass_card {
  cursor: pointer;
}
</style>
