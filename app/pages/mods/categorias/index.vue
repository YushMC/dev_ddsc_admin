<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
const { token_original } = useAccounts();
interface reponse {
  id: number;
  categoria: string;
  slug: string;
  active: number;
  created: string;
}

const all_users = ref<reponse[]>([]);
const globalFilter = ref();
const api_url = useRuntimeConfig().public.api_url;
const category = ref("");
const toast = useToast();
const columns: TableColumn<reponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
  },
  {
    accessorKey: "created",
    header: "Creado el:",
  },
];
const itemsBread = ref([
  {
    label: "Mods",
    icon: "i-lucide-book",
    to: "/mods",
  },
  {
    label: "Categorias",
    icon: "i-lucide-book-heart",
    to: "/mods/categorias",
  },
]);
const addCategory = async () => {
  try {
    const response = await $fetch<{ message: string }>(
      `${api_url}/add-category`,
      {
        method: "POST",
        headers: {
          Authorization: token_original.value,
        },
        body: {
          category_name: category.value,
        },
      }
    );

    toast.add({
      title: "Correcto",
      description: response.message,
      icon: "i-lucide-check",
      color: "success",
    });
    await getCategories();
  } catch (error: any) {
    let msg = "Error desconocido";

    // Si viene como string JSON
    if (typeof error?.data === "string") {
      try {
        const parsed = JSON.parse(error.data);
        msg = parsed.error ?? msg;
      } catch {
        msg = error.data;
      }
    }
    // Si viene ya como objeto
    else if (typeof error?.data === "object" && error?.data?.error) {
      msg = error.data.error;
    }

    toast.add({
      title: "Error",
      description: msg,
      icon: "i-lucide-circle-x",
      color: "error",
    });
  }
};

const getCategories = async () => {
  try {
    const response = await $fetch<{
      response: string;
      totoal_rows: number;
      results: reponse[];
    }>(`${api_url}/categories-mod`);

    all_users.value = response.results;
  } catch (error) {}
};

useHead({
  title: `Categorias de mods`,
});

onBeforeMount(async () => await getCategories());
</script>

<template>
  <div>
    <div class="fl_between w-full" style="align-items: center">
      <UBreadcrumb :items="itemsBread" />
      <UModal title="Agregar Nueva Categoria">
        <UButton icon="i-lucide-book-heart">Agregar Nueva Categoria </UButton>
        <template #body>
          <section class="w-full fl_column">
            <UFormField label="Nombre de la categoria">
              <UInput
                placeholder="Ingresa un nombre para la categoria"
                class="w-full"
                v-model="category"
              />
            </UFormField>
            <UButton @click="addCategory" icon="i-lucide-book-heart"
              >Agregar</UButton
            >
          </section>
        </template>
      </UModal>
    </div>
    <UTable
      ref="table"
      :data="all_users"
      :columns="columns"
      class="flex-1"
      sticky
      v-model:global-filter="globalFilter"
    >
    </UTable>
  </div>
</template>

<style scoped></style>
