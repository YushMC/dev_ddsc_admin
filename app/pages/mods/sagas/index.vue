<script setup lang="ts">
import type { TableColumn, SelectItem } from "@nuxt/ui";
const { token_original } = useAccounts();
interface reponse {
  id: number;
  titulo_saga: string;
  slug_saga: string;
}

const all_users = ref<reponse[]>([]);
const globalFilter = ref();
const api_url = useRuntimeConfig().public.api_url;
const saga = ref("");
const toast = useToast();
const columns: TableColumn<reponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "titulo_saga",
    header: "Nombre",
  },
];
const itemsBread = ref([
  {
    label: "Mods",
    icon: "i-lucide-book",
    to: "/mods",
  },
  {
    label: "Sagas",
    icon: "i-lucide-library-big",
    to: "/mods/sagas",
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
          category_name: saga.value,
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
    }>(`${api_url}/mods/sagas`);

    all_users.value = response.results;
  } catch (error) {}
};
const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
});

// elementos visibles en la página actual
const paginatedItems = computed(() => {
  const start = (pagination.value.pageIndex - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return all_users.value.slice(start, end);
});

const items = ref<SelectItem[]>([
  {
    label: "5",
    id: 5,
  },
  {
    label: "10",
    id: 10,
  },
  {
    label: "25",
    id: 25,
  },
  {
    label: "50",
    id: 50,
  },
  {
    label: "100",
    id: 100,
  },
]);

onBeforeMount(async () => await getCategories());
</script>

<template>
  <div>
    <div class="fl_between w-full" style="align-items: center">
      <UBreadcrumb :items="itemsBread" />
      <UModal title="Agregar Nueva Saga">
        <UButton icon="i-lucide-library-big">Agregar Nueva Saga</UButton>
        <template #body>
          <section class="w-full fl_column">
            <UFormField label="Nombre de la Saga">
              <UInput
                placeholder="Ingresa un nombre para la saga"
                class="w-full"
                v-model="saga"
              />
            </UFormField>
            <UButton @click="" icon="i-lucide-library-big">Agregar</UButton>
          </section>
        </template>
      </UModal>
    </div>
    <div class="fl_between p-5 w-full" style="align-items: center">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
      <UFormField label="Mods por página">
        <USelect
          v-model="pagination.pageSize"
          value-key="id"
          :items="items"
          class="w-full"
        />
      </UFormField>
    </div>
    <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        v-model:page="pagination.pageIndex"
        :total="all_users.length"
        :sibling-count="1"
        :items-per-page="pagination.pageSize"
      />
    </div>
    <UTable
      ref="table"
      :data="paginatedItems"
      :columns="columns"
      class="flex-1"
      sticky
      v-model:global-filter="globalFilter"
      v-model:pagination="pagination"
    >
    </UTable>
  </div>
</template>

<style scoped></style>
