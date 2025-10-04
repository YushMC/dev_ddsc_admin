<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { SelectItem } from "@nuxt/ui";

interface reponse {
  id: number;
  nombre: string;
  logo: string;
  tipo: string;
  alias: string;
  creeated: string;
  slug: string;
  visitas: number;
  isPublic: boolean;
  creadores: string[];
  traductores?: string[];
}

const all_users = ref<reponse[]>([]);
const globalFilter = ref();
const api_url = useRuntimeConfig().public.api_url;
const { token_original } = useAccounts();
const UAvatar = resolveComponent("UAvatar");
const UCheckBox = resolveComponent("UCheckbox");
const UButton = resolveComponent("UButton");

const columns: TableColumn<reponse>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "ID",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => h(UAvatar, { src: row.original.logo }),
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Nombre",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) =>
      h(UButton, {
        to: `/mods/editar?slug=${row.original.slug}`,
        color: "neutral",
        variant: "ghost",
        label: row.original.nombre,
      }),
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Tipo",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Fecha subida",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "creadores",
    header: "Creadores",
  },
  {
    accessorKey: "traductores",
    header: "Traductores",
  },
  {
    accessorKey: "isPublic",
    header: "Activo",
    cell: ({ row }) =>
      h(UCheckBox, {
        defaultModel: !Boolean(row.original.isPublic)
          ? `${Boolean(row.original.isPublic)}`
          : "indeterminate",

        disabled: true,
      }),
  },
];

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

const itemsBread = ref([
  {
    label: "Mods",
    icon: "i-lucide-book",
    to: "/mods",
  },
]);

onBeforeMount(async () => {
  try {
    const response = await $fetch<{
      response: string;
      totoal_rows: number;
      results: reponse[];
    }>(`${api_url}/list-mods`, {
      method: "GET",
      headers: {
        Authorization: token_original.value,
      },
    });

    all_users.value = response.results;
  } catch (error) {}
});
</script>

<template>
  <div>
    <UBreadcrumb :items="itemsBread" />
    <div class="fl_between p-10 w-full" style="align-items: center">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
      <UFormField label="Mods por página">
        <USelect
          v-model="pagination.pageSize"
          value-key="id"
          :items="items"
          class="w-full"
        />
      </UFormField>

      <UButton to="/mods/subir" icon="i-lucide-book-plus"
        >Agregar Nuevo Mod</UButton
      >
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
