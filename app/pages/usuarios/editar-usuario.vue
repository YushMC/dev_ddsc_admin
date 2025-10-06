<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";
interface response_user {
  id: number;
  user: string;
  email: string;
  alias: string;
  slug: string;
  id_rol: number;
  rol_nombre: string;
  url_logo: string;
  verify: boolean;
  isVisible: boolean;
}
interface roles_api {
  id: number;
  rol: string;
}
const { changeEmail, changeRol, changeVisibility, verifyUser } =
  useUserUpdate();
const toast = useToast();
const route = useRoute().query.slug;
const api_url = useRuntimeConfig().public.api_url;
const { token_original } = useAccounts();
const itemsBread = ref<any[]>([]);
const data_user = ref<response_user>({
  id: 0,
  user: "",
  email: "",
  alias: "",
  slug: "",
  id_rol: 0,
  rol_nombre: "",
  url_logo: "",
  verify: false,
  isVisible: false,
});
const itemsSelect = ref<SelectMenuItem[]>([]);
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

const fetchUserSlug = async (slug: string) => {
  try {
    const response = await $fetch<{ results: response_user }>(
      `${api_url}/user-info/${slug}`,
      {
        method: "GET",
        headers: {
          Authorization: token_original.value,
        },
      }
    );

    data_user.value = response.results;
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
    return { sucess: false, message: msg };
  }
};

const fetchRoles = async () => {
  try {
    const response = await $fetch<{ results: roles_api[] }>(
      `${api_url}/roles`,
      {
        method: "GET",
      }
    );

    response.results.forEach((item) => {
      itemsSelect.value.push({
        label: item.rol,
        id: item.id,
      });
    });
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
    return { sucess: false, message: msg };
  }
};

const changeVisibilityCheckBox = async () => {
  const response = await changeVisibility(
    data_user.value.id,
    data_user.value.isVisible
  );
  showMessage(response);
};

const changeVerifyCheckBox = async () => {
  const response = await verifyUser(data_user.value.id);
  showMessage(response);
};

const changeEmailtext = async () => {
  const response = await changeEmail(data_user.value.id, data_user.value.email);
  showMessage(response);
};

const changeRolSelect = async () => {
  const response = await changeRol(data_user.value.id, data_user.value.id_rol);
  showMessage(response);
};

useHead({
  title: `Editar usuario `,
});

watch(
  () => route,
  async (newValue) => {
    if (newValue) {
      await fetchUserSlug(newValue.toString());
      itemsBread.value = [
        {
          label: "Usuarios",
          icon: "i-lucide-user",
          to: "/usuarios",
        },
        {
          label: `Editar Usuario: ${data_user.value.user}`,
          icon: "i-lucide-pencil",
          to: `/usuarios/editar-usuario?slug=${data_user.value.slug}`,
        },
      ];
    }
  }
);

onBeforeMount(async () => {
  if (route) {
    await fetchRoles();
    await fetchUserSlug(route.toString());
    itemsBread.value = [
      {
        label: "Usuarios",
        icon: "i-lucide-user",
        to: "/usuarios",
      },
      {
        label: `Editar Usuario: ${data_user.value.user}`,
        icon: "i-lucide-pencil",
        to: `/usuarios/editar-usuario?slug=${data_user.value.slug}`,
      },
    ];
  }
});
</script>

<template>
  <div class="fl_column">
    <UBreadcrumb :items="itemsBread" />
    <section
      class="fl_center glass_card"
      id="info"
      style="padding: 1%; height: 100px !important; min-height: inherit"
    >
      <figure class="fl_center">
        <NuxtImg
          :src="`https://api.dokidokispanish.club/${data_user.url_logo}`"
          loading="lazy"
          decoding="async"
          style="height: 50px; aspect-ratio: 1/1"
        />
        <figcaption style="font-size: 2rem; font-weight: 500">
          {{ data_user.user }}
          <span style="font-size: 1rem">({{ data_user.alias }})</span>
        </figcaption>
      </figure>
    </section>
    <USeparator label="Acciones Administrativas" />
    <section class="fl_center" id="info" style="padding: 1%">
      <div class="glass_card fl_column">
        <UFormField label="Rol">
          <USelect
            v-model="data_user.id_rol"
            value-key="id"
            :items="itemsSelect"
            class="w-full"
          />
        </UFormField>
        <UButton icon="i-lucide-save" color="neutral" @click="changeRolSelect"
          >Cambiar Rol</UButton
        >
      </div>
      <div class="glass_card fl_column">
        <UAlert
          v-if="!data_user.verify"
          title="IMPORTANTE"
          color="warning"
          icon="i-lucide-triangle-alert"
          description="Verifca este usuario solo si estas seguro de continuar"
        />
        <UCheckbox
          label="¿Verificar Usuario?"
          v-model="data_user.verify"
          :disabled="data_user.verify"
          @change="changeVerifyCheckBox"
        />
        <USeparator label="Visibilidad" />
        <UCheckbox
          label="Activo"
          v-model="data_user.isVisible"
          @change="changeVisibilityCheckBox"
        />
      </div>
      <div class="glass_card fl_column">
        <UAlert
          title="IMPORTANTE"
          color="warning"
          icon="i-lucide-triangle-alert"
          description="Cambia en caso de que la persona lo haya solicitado"
        />
        <UFormField label="Correo Electrónico">
          <UInput type="email" class="w-full" v-model="data_user.email" />
        </UFormField>
        <UButton color="neutral" icon="i-lucide-save" @click="changeEmailtext">
          Guardar Correo</UButton
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.glass_card {
  width: 350px;
  min-height: 300px;
}
.fl_column {
  justify-content: start;
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
