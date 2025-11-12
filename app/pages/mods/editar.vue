<script setup lang="ts">
const {
  fetchMod,
  data_mod,
  setConfigs,
  optionsForSelects,
  all_data_options,
  updatePutAlls,
  updateCategories,
  updateImages,
  addSaga,
} = useModUpdate();
import DOMPurify from "dompurify";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const toast = useToast();
const route = useRoute().query.slug;
const itemsBread = ref<any[]>([]);
const api_url = useRuntimeConfig().public.api_url;
interface data_selected {
  personaje: number;
  estado: number;
  duracion: number;
  generos: number[];
  logo?: File;
  portada?: File;
  capturas?: File[];
  saga?: number;
  tipo_saga?: number;
  categorias?: number[];
  id_saga?: number;
}

const options_all_selected = ref<data_selected>({
  personaje: 0,
  estado: 0,
  duracion: 0,
  generos: [],
  categorias: [],
});

const setDataReadySeledted = () => {
  const index_character = all_data_options.value.focus.findIndex(
    (item) => item.enfoque === data_mod.value.personaje
  );
  if (all_data_options.value.focus[index_character])
    options_all_selected.value.personaje =
      all_data_options.value.focus[index_character].id;

  const index_status = all_data_options.value.status.findIndex(
    (item) => item.estado === data_mod.value.estado
  );
  if (all_data_options.value.status[index_status])
    options_all_selected.value.estado =
      all_data_options.value.status[index_status].id;

  const index_duration = all_data_options.value.durations.findIndex(
    (item) => item.duracion === data_mod.value.duracion
  );
  if (all_data_options.value.durations[index_duration])
    options_all_selected.value.duracion =
      all_data_options.value.durations[index_duration].id;

  options_all_selected.value.generos = all_data_options.value.generes
    .filter((g) => data_mod.value.generos.includes(g.genero))
    .map((g) => g.id);

  options_all_selected.value.categorias = data_mod.value.categorias.map(
    (item) => item.id
  );
};

const showMessage = (response: { sucess: boolean; message: string }) => {
  if (response.sucess) {
    toast.add({
      title: "Correcto",
      description: response.message,
      icon: "i-lucide-check",
      color: "success",
    });
  } else {
    toast.add({
      title: "Error",
      description: response.message,
      icon: "i-lucide-circle-x",
      color: "error",
    });
  }
};

const changeDescription = async () => {
  const response = await updatePutAlls(
    1,
    data_mod.value.descripcion,
    data_mod.value.id
  );
  showMessage(response);
};

const changeStatus = async () => {
  const response = await updatePutAlls(
    2,
    options_all_selected.value.estado,
    data_mod.value.id
  );
  showMessage(response);
};

const changePc = async () => {
  const response = await updatePutAlls(3, data_mod.value.pc, data_mod.value.id);
  showMessage(response);
};

const changeAndroid = async () => {
  const response = await updatePutAlls(
    4,
    data_mod.value.android,
    data_mod.value.id
  );
  showMessage(response);
};

const changeNSFW = async () => {
  const response = await updatePutAlls(
    5,
    data_mod.value.isNSFW,
    data_mod.value.id
  );
  showMessage(response);
};

const changeFocus = async () => {
  const response = await updatePutAlls(
    6,
    options_all_selected.value.personaje,
    data_mod.value.id
  );
  showMessage(response);
};

const changeDuration = async () => {
  const response = await updatePutAlls(
    7,
    options_all_selected.value.duracion,
    data_mod.value.id
  );
  showMessage(response);
};

const changeActive = async () => {
  const response = await updatePutAlls(
    8,
    data_mod.value.isPublic,
    data_mod.value.id
  );
  showMessage(response);
};

const updateCategory = async () => {
  const response = await updateCategories(
    options_all_selected.value.categorias ?? []
  );
  showMessage(response);
};

const changeLogo = async () => {
  if (!options_all_selected.value.logo) return;
  const response = await updateImages(
    1,
    options_all_selected.value.logo,
    data_mod.value.id
  );
  showMessage(response);
};

const changePortada = async () => {
  if (!options_all_selected.value.portada) return;
  const response = await updateImages(
    2,
    options_all_selected.value.portada,
    data_mod.value.id
  );
  showMessage(response);
};

const addNewSaga = async () => {
  const response = await addSaga(data_mod.value.id, options_all_selected.value);
  showMessage(response);
};

const openWindowMod = () => {
  if (data_mod.value.isPublic)
    window.open(`http://191.101.251.98/mods/${data_mod.value.slug}`, "_blank");
};

const searchIdModInSagas = async (id: number) => {
  interface response {
    response: boolean;
    results: any;
  }
  try {
    const response = await $fetch<response>(
      `${api_url}/mods/sagas/exist/${id}`
    );
    if (response.response) {
      options_all_selected.value.saga = response.results.saga_id;
    } else {
      options_all_selected.value.saga = 0;
    }
  } catch (error) {}
};
useHead({
  title: `Editar mod ${data_mod.value.nombre}`,
});

watch(
  () => route,
  async (newValue) => {
    if (newValue) await fetchMod(newValue.toString());
    searchIdModInSagas(data_mod.value.id);
    itemsBread.value = [
      {
        label: "Mods",
        icon: "i-lucide-book",
        to: "/mods",
      },
      {
        label: `Editar Mod: ${data_mod.value.nombre}`,
        icon: "i-lucide-pencil",
        to: `/mods/editar?slug=${data_mod.value.slug}`,
      },
    ];
    options_all_selected.value = {
      personaje: 0,
      estado: 0,
      duracion: 0,
      generos: [],
    };
    setDataReadySeledted();
    useHead({
      title: `Editar mod ${data_mod.value.nombre}`,
    });
  }
);

onBeforeMount(async () => {
  if (route) {
    await fetchMod(route.toString());
    searchIdModInSagas(data_mod.value.id);
    itemsBread.value = [
      {
        label: "Mods",
        icon: "i-lucide-book",
        to: "/mods",
      },
      {
        label: `Editar Mod: ${data_mod.value.nombre}`,
        icon: "i-lucide-pencil",
        to: `/mods/editar?slug=${data_mod.value.slug}`,
      },
    ];
  }
  await setConfigs();
  setDataReadySeledted();
});
</script>

<template>
  <div class="fl_column">
    <UBreadcrumb :items="itemsBread" />
    <section class="fl_center glass_card" id="info" style="padding: 1%">
      <figure class="fl_center" @click="openWindowMod">
        <NuxtImg
          :src="data_mod.logo"
          loading="lazy"
          decoding="async"
          style="height: 50px; aspect-ratio: 1/1"
        />
        <figcaption style="font-size: 2rem; font-weight: 500">
          {{ data_mod.nombre }}
        </figcaption>
      </figure>
    </section>
    <USeparator label="Información General" />
    <section class="fl_between">
      <div class="glass_card fl_column">
        <UFormField label="Editar Descripción" size="xl">
          <QuillEditor
            contentType="html"
            toolbar="essential"
            placeholder="Tu descripción aquí"
            v-model:content="data_mod.descripcion"
          />
        </UFormField>
        <UButton
          size="xl"
          icon="i-lucide-save"
          color="neutral"
          @click="changeDescription"
          >Guardar</UButton
        >
      </div>
      <div class="fl_column">
        <div class="glass_card fl_column">
          <UFormField label="Editar Estado" size="xl">
            <USelect
              color="info"
              v-model="options_all_selected.estado"
              value-key="id"
              :items="optionsForSelects.status"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UButton
            size="xl"
            icon="i-lucide-save"
            color="neutral"
            @click="changeStatus"
            >Guardar</UButton
          >
        </div>
        <div class="glass_card fl_column">
          <UFormField label="Editar Enfoque" size="xl">
            <USelect
              color="info"
              v-model="options_all_selected.personaje"
              value-key="id"
              :items="optionsForSelects.focus"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UButton
            size="xl"
            icon="i-lucide-save"
            color="neutral"
            @click="changeFocus"
            >Guardar</UButton
          >
        </div>

        <UCheckbox
          label="¿Tiene contendio NSFW o +18?"
          class="w-full p-2"
          color="warning"
          v-model="data_mod.isNSFW"
          @change="changeNSFW"
        />
      </div>
      <div class="fl_column">
        <div class="glass_card fl_column" v-if="data_mod.generos.length === 0">
          <UFormField label="Editar Generos" size="xl" error="Proximamente">
            <USelect
              color="info"
              v-model="options_all_selected.generos"
              multiple
              value-key="id"
              :items="optionsForSelects.generes"
              autoresize
              class="w-full"
              disabled
            />
          </UFormField>
          <UButton size="xl" icon="i-lucide-save" color="neutral" disabled
            >Guardar</UButton
          >
        </div>
        <div class="glass_card fl_column">
          <UFormField label="Editar Duración" size="xl">
            <USelect
              color="info"
              v-model="options_all_selected.duracion"
              value-key="id"
              :items="optionsForSelects.durations"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UButton
            size="xl"
            icon="i-lucide-save"
            color="neutral"
            @click="changeDuration"
            >Guardar</UButton
          >
        </div>
        <UCheckbox
          label="¿Es público?"
          class="w-full p-2"
          v-model="data_mod.isPublic"
          @change="changeActive"
        />
      </div>
    </section>
    <USeparator label="Enlaces" />
    <section class="fl_evenly">
      <div class="glass_card fl_column">
        <UFormField label="Editar Enlace PC" size="xl">
          <UInput v-model="data_mod.pc" class="w-full" />
        </UFormField>
        <UButton
          size="xl"
          icon="i-lucide-save"
          color="neutral"
          @click="changePc"
          >Guardar</UButton
        >
      </div>
      <div class="glass_card fl_column">
        <UFormField label="Editar Enlace Android" size="xl">
          <UInput v-model="data_mod.android" class="w-full" />
        </UFormField>
        <UButton
          size="xl"
          icon="i-lucide-save"
          color="neutral"
          @click="changeAndroid"
          >Guardar</UButton
        >
      </div>
    </section>
    <USeparator label="Imágenes" />
    <section class="fl_evenly">
      <div class="glass_card fl_column">
        <UFormField label="Editar Logo" size="xl">
          <UFileUpload
            v-model="options_all_selected.logo"
            accept="image/jpeg,image/png"
            :dropzone="true"
            layout="list"
            description="PNG o JPG (max. 2MB)"
          />
        </UFormField>
        <UButton
          size="xl"
          icon="i-lucide-save"
          color="neutral"
          @click="changeLogo"
          >Guardar</UButton
        >
      </div>
      <div class="glass_card fl_column">
        <UFormField label="Editar Portada" size="xl">
          <UFileUpload
            v-model="options_all_selected.portada"
            accept="image/jpeg,image/png"
            :dropzone="true"
            layout="list"
            description="PNG o JPG (max. 2MB)"
          />
        </UFormField>
        <UButton
          size="xl"
          icon="i-lucide-save"
          color="neutral"
          @click="changePortada"
          >Guardar</UButton
        >
      </div>
      <div class="glass_card fl_column" v-if="data_mod.capturas.length === 0">
        <UFormField label="Otras Capturas" size="xl" hint="opcional">
          <UFileUpload
            v-model="options_all_selected.capturas"
            accept="image/jpeg,image/png"
            multiple
            :dropzone="true"
            layout="list"
            color="primary"
            description="PNG o JPG (max. 2MB)"
          />
        </UFormField>
        <UButton size="xl" icon="i-lucide-save" color="neutral">Subir</UButton>
      </div>
    </section>
    <USeparator label="Categorias" />
    <UAlert
      title="IMPORTANTE"
      color="warning"
      icon="i-lucide-triangle-alert"
      description="Las categorias no pueden ser eliminadas despues de haber sido agregadas, solo pueden añadirse nuevas categorias."
    />
    <UAlert
      v-if="options_all_selected.saga === 0"
      title="IMPORTANTE"
      color="warning"
      icon="i-lucide-triangle-alert"
      description="Los mods no puede ser cambiada de sagas despues de haber sido agregadas por primera vez, solo cambia esta información en caso de ser necesario."
    />
    <section class="fl_evenly">
      <div class="glass_card fl_column">
        <UFormField label="Categoria" size="xl">
          <USelect
            color="info"
            v-model="options_all_selected.categorias"
            value-key="id"
            :items="optionsForSelects.categorias"
            autoresize
            class="w-full"
            multiple
          />
        </UFormField>
        <UButton
          size="xl"
          icon="i-lucide-save"
          color="neutral"
          @click="updateCategory"
          >Guardar</UButton
        >
      </div>
      <div class="glass_card fl_center" style="width: fit-content">
        <div class="glass_card fl_column">
          <UFormField label="Saga" size="xl">
            <USelect
              color="info"
              v-model="options_all_selected.saga"
              value-key="id"
              :items="optionsForSelects.sagas"
              autoresize
              class="w-full"
            />
          </UFormField>
        </div>
        <div class="glass_card fl_column">
          <UFormField label="Tipo" size="xl">
            <USelect
              color="info"
              v-model="options_all_selected.tipo_saga"
              value-key="id"
              :items="optionsForSelects.tiposagas"
              autoresize
              class="w-full"
            />
          </UFormField>
        </div>
        <UButton
          size="xl"
          icon="i-lucide-save"
          color="neutral"
          @click="addNewSaga"
          >Guardar</UButton
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.glass_card {
  width: 350px;
}
#info {
  width: 100%;
  position: sticky;
  top: 8dvh;
  z-index: 100;
}
@media screen and (max-width: 1000px) {
  .glass_card,
  .fl_column {
    width: 100%;
  }
}
</style>
