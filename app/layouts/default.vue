<template>
  <ClientOnly>
    <div class="fl_column">
      <UHeader>
        <template #title>
          <figure class="fl_center">
            <img
              loading="lazy"
              decoding="async"
              src="/images/Logo_DDSC.png"
              style="width: 50px"
            />
            <figcaption>DDSC Admin</figcaption>
          </figure>
        </template>

        <template #right>
          <section class="fl_start">
            <USlideover title="Notificaciones">
              <UChip color="error" :show="true">
                <UButton
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-bell"
                />
              </UChip>

              <template #body>
                <section class="fl_column">
                  <h1>Sin Notificaciones</h1>
                </section>
              </template>
            </USlideover>
            <UColorModeSelect />
          </section>
        </template>

        <template #body>
          <UNavigationMenu
            :items="items"
            orientation="vertical"
            class="-mx-2.5"
          />
        </template>
      </UHeader>
      <div class="fl_evenly" style="position: relative">
        <div id="menu">
          <UNavigationMenu orientation="vertical" :items="items" class="w-48" />
        </div>

        <div id="main"><slot /></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const items = ref([
  [
    {
      label: "Administración",
      type: "label",
    },
    {
      label: "Usuarios",
      icon: "i-lucide-user",
      to: "/usuarios",
      defaultOpen: true,
      children: [
        {
          label: "Roles",
          icon: "i-lucide-user-star",
          to: "/usuarios/roles",
        },
      ],
    },
    {
      label: "Mods",
      icon: "i-lucide-book",
      to: "/mods",
      defaultOpen: true,
      children: [
        {
          label: "Categorias",
          icon: "i-lucide-book-heart",
          to: "/mods/categorias",
        },
        {
          label: "Sagas",
          icon: "i-lucide-library-big",
          to: "/mods/sagas",
        },
      ],
    },
  ],
]);
</script>

<style scoped>
#main {
  width: 80%;
  margin-block: 16px;
}

#menu {
  position: sticky;
  top: 10dvh;
}

@media screen and (max-width: 1050px) {
  #menu {
    display: none;
  }
}
</style>
