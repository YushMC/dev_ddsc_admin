<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

interface reponse {
  id: number;
  rol: string;
}

const all_users = ref<reponse[]>([]);
const globalFilter = ref();
const api_url = useRuntimeConfig().public.api_url;

const UButton = resolveComponent("UButton");

const columns: TableColumn<reponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "rol",
    header: "Rol",
  },
];
const itemsBread = ref([
  {
    label: "Usuarios",
    icon: "i-lucide-user",
    to: "/usuarios",
  },
  {
    label: "Roles",
    icon: "i-lucide-user-star",
  },
]);

useHead({
  title: `Todos los roles`,
});

onBeforeMount(async () => {
  try {
    const response = await $fetch<{
      response: string;
      totoal_rows: number;
      results: reponse[];
    }>(`${api_url}/roles`);

    all_users.value = response.results;
  } catch (error) {}
});
</script>

<template>
  <div>
    <div class="fl_between w-full" style="align-items: center">
      <UBreadcrumb :items="itemsBread" />
    </div>
    <UTable
      ref="table"
      :data="all_users"
      :columns="columns"
      class="flex-1"
      sticky
    >
    </UTable>
  </div>
</template>

<style scoped></style>
