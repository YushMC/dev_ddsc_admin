<script setup lang="ts">
useHead({
  title: "Subir Mod",
});
const router = useRouter();

import type { StepperItem, AccordionItem, SelectMenuItem } from "@nuxt/ui";
const toast = useToast();
const { fetchAllUsers } = useAccounts();
const { fetchOptions } = OptionsMods();
const { sendMod } = useModUpload();
const active = ref(0);
const traductores_register = ref<SelectMenuItem[]>([]);
const traductores_no_register = ref<string[]>([]);
const creators_register = ref<SelectMenuItem[]>([]);
const creators_no_register = ref<string[]>([]);
const showSagas = ref(false);
const steps = [
  {
    slot: "info" as const,
    title: "Información",
    description: "Agrega información básica",
    icon: "i-lucide-book-type",
  },
  {
    slot: "details" as const,
    title: "Detalles",
    description: "Agrega algunos detalles",
    icon: "i-lucide-book-text",
  },
  {
    slot: "images" as const,
    title: "Imágenes",
    description: "Agregar imágenes",
    icon: "i-lucide-book-image",
  },
  {
    slot: "credits" as const,
    title: "Créditos",
    description: "Agregar personas involucradas",
    icon: "i-lucide-book-user",
  },
  {
    slot: "public" as const,
    title: "Resumen",
    description: "Revisa la infomación",
    icon: "i-lucide-file-text",
  },
  {
    slot: "finish" as const,
    title: "Subir",
    description: "Pública tu mod",
    icon: "i-lucide-upload",
  },
] satisfies StepperItem[];

const items = ref([
  {
    label: "Mods",
    icon: "i-lucide-book",
    to: "/mods",
  },
  {
    label: "Subir Mod",
    icon: "i-lucide-upload",
    to: "/mods/subir",
  },
]);

const itemAccordion = [
  {
    label: "CREADOR(ES) existe en DDSC",
    icon: "i-lucide-user",
    slot: "user" as const,
  },
  {
    label: "CREADOR(ES) NO existe en DDSC",
    icon: "i-lucide-user-x",
    slot: "userno" as const,
  },
  {
    label: "TRADUCTOR(ES) existe en DDSC",
    icon: "i-lucide-user",
    slot: "trad" as const,
  },
  {
    label: "TRADDUCTOR(ES) NO existe en DDSC",
    icon: "i-lucide-user-x",
    slot: "tradno" as const,
  },
] satisfies AccordionItem[];

const itemsSaga = [
  {
    label: "Selecciona un tipo y saga",
    icon: "i-lucide-info",
    slot: "saga" as const,
  },
] satisfies AccordionItem[];

const mod_info = ref<ModInterfaceToUpload>({
  nombre: "",
  descripcion: "",
  slug: "",
  duracion: 1,
  estado: 1,
  personaje: 1,
  isNSFW: 0,
  tipo: 1,
  generos: [1],
  creadores: [],
  id_saga: 0,
  id_tipo_saga: 0,
  pc: "",
  android: "",
});

interface optionsSelectd {
  generes: SelectMenuItem[];
  focus: SelectMenuItem[];
  people: SelectMenuItem[];
  status: SelectMenuItem[];
  types: SelectMenuItem[];
  durations: SelectMenuItem[];
  sagas: SelectMenuItem[];
  tiposagas: SelectMenuItem[];
}
const optionsForSelects = ref<optionsSelectd>({
  generes: [],
  focus: [],
  people: [],
  status: [],
  types: [],
  durations: [],
  sagas: [],
  tiposagas: [],
});

const itemsNSFW = ref<SelectMenuItem[]>([
  {
    label: "Si",
    id: 1,
  },
  {
    label: "No",
    id: 0,
  },
]);

const itemsTipo = ref<SelectMenuItem[]>([
  {
    label: "Traducción",
    id: 1,
  },
  {
    label: "Mod Original",
    id: 2,
  },
]);

function slugify(name: string): string {
  let slug = name.trim().toLowerCase();
  slug = slug.replace(/ /g, "-");
  slug = slug.replace(/\./g, "");
  slug = slug.replace(/,/g, "");
  slug = slug.replace(/:/g, "-");

  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug.replace(/[^\w\-]+/g, "");

  return slug;
}

watch(
  () => mod_info.value.nombre,
  (newValue) => {
    mod_info.value.slug = slugify(newValue);
  }
);

watchEffect(() => {
  if (active.value == 4) setFinalTradutors();
  if (!showSagas.value) {
    mod_info.value.id_saga = 0;
    mod_info.value.id_tipo_saga = 0;
  }
  if (mod_info.value.descripcion && mod_info.value.descripcion.length > 1000) {
    mod_info.value.descripcion.slice(0, 1000);
  }
});

onBeforeMount(async () => {
  try {
    const response2 = await fetchAllUsers();
    if (response2) {
      response2.forEach((item) => {
        optionsForSelects.value.people.push({
          label: item.nombre,
          id: item.id,
        });
      });
    }
    const response = await fetchOptions();
    if (response) {
      response.durations.forEach((item) => {
        optionsForSelects.value.durations.push({
          label: item.duracion,
          id: item.id,
        });
      });
      response.focus.forEach((item) => {
        optionsForSelects.value.focus.push({
          label: item.enfoque,
          id: item.id,
        });
      });
      response.status.forEach((item) => {
        optionsForSelects.value.status.push({
          label: item.estado,
          id: item.id,
        });
      });
      response.generes.forEach((item) => {
        optionsForSelects.value.generes.push({
          label: item.genero,
          id: item.id,
        });
      });
      response.sagas.forEach((item) => {
        optionsForSelects.value.sagas.push({
          label: item.titulo,
          id: item.id,
        });
      });
      response.tiposagas.forEach((item) => {
        optionsForSelects.value.tiposagas.push({
          label: item.tipo,
          id: item.id,
        });
      });
    }
  } catch (error) {
    toast.add({
      title: "Error",
      description: String(error),
      color: "error",
      icon: "i-lucide-circle-x",
    });
  }
});

const setFinalTradutors = () => {
  // Asegurar siempre arrays vacíos al inicio
  mod_info.value.creadores = [];

  // Cargar creadores registrados
  creators_register.value.forEach((item: any) => {
    mod_info.value.creadores.push({
      id: item.id,
      nombre: item.label,
    });
  });

  // Cargar creadores no registrados
  creators_no_register.value.forEach((item: any) => {
    mod_info.value.creadores.push({
      nombre: item,
    });
  });

  // Si tipo = 1, no agregar traductores
  if (mod_info.value.tipo === 1) {
    mod_info.value.traductores = [];
    // Cargar traductores registrados
    traductores_register.value.forEach((item: any) => {
      //@ts-ignore
      mod_info.value.traductores.push({
        id: item.id,
        nombre: item.label,
      });
    });

    // Cargar traductores no registrados
    traductores_no_register.value.forEach((item: any) => {
      //@ts-ignore
      mod_info.value.traductores.push({
        nombre: item,
      });
    });
  }
};

const upload = async () => {
  toast.add({
    title: "Procesando",
    description: "Se esta guardando la información",
    color: "info",
    icon: "i-lucide-clock",
  });
  const response = await sendMod(mod_info.value);

  if (response.sucess) {
    toast.add({
      title: "Correcto",
      description: String(response?.message),
      color: "primary",
      icon: "i-lucide-check",
    });
    router.push(`/mods/${mod_info.value.slug}`);
  } else {
    toast.add({
      title: "error",
      description: String(response.message),
      color: "error",
      icon: "i-lucide-circle-x",
    });
  }
};
</script>

<template>
  <article class="fl_column" style="margin-bottom: 16px">
    <UBreadcrumb :items="items" />
    <UStepper v-model="active" :items="steps" class="w-full" size="lg">
      <template #info>
        <section class="fl_column glass_card">
          <UFormField label="Nombre del Mod" size="xl">
            <UInput
              color="info"
              v-model="mod_info.nombre"
              placeholder="Mi mod"
              class="w-full"
              :maxlength="100"
            />
          </UFormField>
          <UFormField
            label="Slug"
            size="xl"
            description="Generado automaticamente"
          >
            <UInput
              color="info"
              v-model="mod_info.slug"
              placeholder="Mi mod"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Descripción" size="xl">
            <UTextarea
              color="info"
              v-model="mod_info.descripcion"
              autoresize
              class="w-full"
              :maxlength="1000"
            />
          </UFormField>
          <UFormField label="Tipo de mod" size="xl">
            <USelect
              color="info"
              v-model="mod_info.tipo"
              value-key="id"
              :items="itemsTipo"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UCheckbox
            v-model="showSagas"
            label="El mod pertenece a una saga"
            size="xl"
          />
          <UAccordion :items="itemsSaga" v-if="showSagas">
            <template #saga>
              <UFormField label="Saga" size="xl">
                <USelect
                  color="info"
                  v-model="mod_info.id_saga"
                  value-key="id"
                  :items="optionsForSelects.sagas"
                  autoresize
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Tipo" size="xl">
                <USelect
                  color="info"
                  v-model="mod_info.id_tipo_saga"
                  value-key="id"
                  :items="optionsForSelects.tiposagas"
                  autoresize
                  class="w-full"
                />
              </UFormField>
            </template>
          </UAccordion>
        </section>
      </template>

      <template #details>
        <section class="fl_column glass_card">
          <UFormField label="Estado" size="xl">
            <USelect
              color="info"
              v-model="mod_info.estado"
              value-key="id"
              :items="optionsForSelects.status"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Duración" size="xl">
            <USelect
              color="info"
              v-model="mod_info.duracion"
              value-key="id"
              :items="optionsForSelects.durations"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Personaje de mayor prioridad" size="xl">
            <USelect
              color="info"
              v-model="mod_info.personaje"
              value-key="id"
              :items="optionsForSelects.focus"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Generos" size="xl">
            <USelect
              color="info"
              v-model="mod_info.generos"
              multiple
              value-key="id"
              :items="optionsForSelects.generes"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Restricción de edad"
            size="xl"
            description="¿El mod incluye contenido no apto para menores de edad?"
          >
            <USelect
              color="info"
              v-model="mod_info.isNSFW"
              :items="itemsNSFW"
              value-key="id"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Enlace de descarga (PC)" size="xl" hint="opcional">
            <UInput
              color="info"
              v-model="mod_info.pc"
              placeholder="https://..."
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Enlace de descarga (Android)"
            size="xl"
            hint="opcional"
          >
            <UInput
              color="info"
              v-model="mod_info.android"
              placeholder="https://..."
              class="w-full"
            />
          </UFormField>
        </section>
      </template>

      <template #images>
        <section class="fl_column glass_card">
          <UFormField label="Logo" size="xl">
            <UFileUpload
              v-model="mod_info.logo"
              accept="image/jpeg,image/png"
              :dropzone="true"
              size="xs"
              layout="list"
              color="primary"
              highlight
              label="Suelta la imagen del logo aquí"
              description="PNG o JPG (max. 2MB)"
            />
          </UFormField>
          <UFormField label="Portada" size="xl">
            <UFileUpload
              v-model="mod_info.portada"
              accept="image/jpeg,image/png"
              :dropzone="true"
              size="xs"
              layout="list"
              color="primary"
              highlight
              label="Suelta la imagen de portada aquí"
              description="PNG o JPG (max. 2MB)"
            />
          </UFormField>
          <UFormField label="Otras Capturas" size="xl" hint="opcional">
            <UFileUpload
              v-model="mod_info.capturas"
              accept="image/jpeg,image/png"
              multiple
              :dropzone="true"
              size="xl"
              layout="list"
              color="primary"
              highlight
              label="Suelta la imagen de portada aquí"
              description="PNG o JPG (max. 2MB)"
            />
          </UFormField>
        </section>
      </template>

      <template #credits>
        <section class="fl_column glass_card">
          <UAccordion :items="itemAccordion">
            <template #user>
              <UFormField label="Creador(es)" size="xl">
                <UInputMenu
                  color="info"
                  v-model="creators_register"
                  :items="optionsForSelects.people"
                  multiple
                  class="w-full"
                />
              </UFormField>
            </template>
            <template #userno>
              <UFormField
                label="Creador(es)"
                size="xl"
                hint="Coloca uno o más nombres"
              >
                <UInputTags
                  color="info"
                  v-model="creators_no_register"
                  class="w-full"
                />
              </UFormField>
            </template>
            <template #trad>
              <UFormField label="Traductor(es)" size="xl">
                <UInputMenu
                  color="info"
                  v-model="traductores_register"
                  :items="optionsForSelects.people"
                  multiple
                  class="w-full"
                />
              </UFormField>
            </template>
            <template #tradno>
              <UFormField
                label="Traductor(es)"
                size="xl"
                hint="Coloca uno o más nombres"
              >
                <UInputTags
                  color="info"
                  v-model="traductores_no_register"
                  class="w-full"
                />
              </UFormField>
            </template>
          </UAccordion>
        </section>
      </template>

      <template #public>
        <section class="fl_column glass_card">
          <UAlert
            color="warning"
            title="Importante"
            description="Revisa la información antes de continuar"
            icon="i-lucide-triangle-alert"
          />
          <UFormField label="Nombre del Mod" size="xl">
            <UInput
              color="info"
              v-model="mod_info.nombre"
              placeholder="Mi mod"
              class="w-full"
              :maxlength="100"
            />
          </UFormField>
          <UFormField
            label="Slug"
            size="xl"
            description="Generado automaticamente"
          >
            <UInput
              color="info"
              disabled
              v-model="mod_info.slug"
              placeholder="Mi mod"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Descripción" size="xl">
            <UTextarea
              color="info"
              v-model="mod_info.descripcion"
              autoresize
              class="w-full"
              :maxlength="1000"
            />
          </UFormField>
          <UFormField label="Tipo de mod" size="xl">
            <USelect
              color="info"
              v-model="mod_info.tipo"
              value-key="id"
              :items="itemsTipo"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Saga" size="xl" v-if="showSagas">
            <USelect
              color="info"
              v-model="mod_info.id_saga"
              value-key="id"
              :items="optionsForSelects.sagas"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Tipo en la saga" size="xl" v-if="showSagas">
            <USelect
              color="info"
              v-model="mod_info.id_tipo_saga"
              value-key="id"
              :items="optionsForSelects.tiposagas"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Estado" size="xl">
            <USelect
              color="info"
              v-model="mod_info.estado"
              value-key="id"
              :items="optionsForSelects.status"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Duración" size="xl">
            <USelect
              color="info"
              v-model="mod_info.duracion"
              value-key="id"
              :items="optionsForSelects.durations"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Personaje de mayor prioridad" size="xl">
            <USelect
              color="info"
              v-model="mod_info.personaje"
              value-key="id"
              :items="optionsForSelects.focus"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Generos" size="xl">
            <USelect
              color="info"
              v-model="mod_info.generos"
              multiple
              value-key="id"
              :items="optionsForSelects.generes"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Restricción de edad"
            size="xl"
            description="¿El mod incluye contenido no apto para menores de edad?"
          >
            <USelect
              color="info"
              v-model="mod_info.isNSFW"
              :items="itemsNSFW"
              value-key="id"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UFormField label="Enlace de descarga (PC)" size="xl" hint="opcional">
            <UInput
              color="info"
              v-model="mod_info.pc"
              placeholder="https://..."
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Enlace de descarga (Android)"
            size="xl"
            hint="opcional"
          >
            <UInput
              color="info"
              v-model="mod_info.android"
              placeholder="https://..."
              class="w-full"
            />
          </UFormField>
          <UFormField label="Logo" size="xl">
            <UFileUpload
              v-model="mod_info.logo"
              :dropzone="true"
              size="xs"
              layout="list"
              color="primary"
              highlight
              label="Suelta la imagen del logo aquí"
              description="PNG o JPG (max. 2MB)"
            />
          </UFormField>
          <UFormField label="Portada" size="xl">
            <UFileUpload
              v-model="mod_info.portada"
              :dropzone="true"
              size="xs"
              layout="list"
              color="primary"
              highlight
              label="Suelta la imagen de portada aquí"
              description="PNG o JPG (max. 2MB)"
            />
          </UFormField>
          <UFormField label="Otras Capturas" size="xl" hint="opcional">
            <UFileUpload
              v-model="mod_info.capturas"
              multiple
              :dropzone="true"
              size="xl"
              layout="list"
              color="primary"
              highlight
              label="Suelta la imagen de portada aquí"
              description="PNG o JPG (max. 2MB)"
            />
          </UFormField>
          <section
            v-if="mod_info.tipo === 1"
            class="fl_column"
            style="width: 100%"
          >
            <h1>Creadores</h1>
            <hr />
            <ul class="fl_start">
              <li v-for="value in mod_info.creadores">{{ value.nombre }}</li>
            </ul>
          </section>
          <section
            v-if="mod_info.tipo === 1"
            class="fl_column"
            style="width: 100%"
          >
            <h1>Traductores</h1>
            <hr />
            <ul class="fl_start">
              <li v-for="value in mod_info.traductores">{{ value.nombre }}</li>
            </ul>
          </section>
        </section>
      </template>
      <template #finish>
        <section class="glass_card fl_start">
          <UButton
            @click="upload"
            class="w-full"
            icon="i-lucide-upload"
            size="xl"
            color="success"
            >Subir Mod</UButton
          >
        </section>
      </template>
    </UStepper>
  </article>
</template>

<style scoped>
section {
  width: 80%;
  margin: auto;
}
.glass_card {
  border: solid 2px var(--ui-primary);
}

.glass_card:hover {
  transform: none !important;
}
</style>
