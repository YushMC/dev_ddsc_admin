<script setup lang="ts">
definePageMeta({
  layout: "loginregister",
});
const { token_data } = useAccounts();
const toast = useToast();

const image = ref("/ddlc_bg/Monika_CoverArt_4K.webp");
const images = [
  "/ddlc_images/2.png",
  "/ddlc_images/10.png",
  "/ddlc_images/n_cg3_base.png",
  "/ddlc_images/s_cg1.png",
  "/ddlc_images/s_cg2_base2.png",
  "/ddlc_images/s_cg3.png",
  "/ddlc_images/y_cg1_base.png",
  "/ddlc_images/y_cg2.png",
  "/ddlc_images/y_cg3_base.png",
];
const router = useRouter();
const show = ref(false);

const login_data = ref<loginInterface>({
  email: "",
  password: "",
});

function randomIndex(lenght: number) {
  return Math.floor(Math.random() * lenght);
}

let index = randomIndex(images.length) ?? 0;
image.value = images[index] ?? "/ddlc_bg/Monika_CoverArt_4K.webp";

const loginfetch = async () => {
  interface api_response {
    success: boolean;
    token_decodificado: TokenDataInterface;
  }

  try {
    await $fetch("/api/accounts/login", {
      method: "POST",
      body: login_data.value,
    });
  } catch (error: any) {
    const msg =
      error?.statusMessage || // de createError
      error?.message || // fallback genérico
      "Error desconocido";

    toast.add({
      title: "Error",
      description: msg,
      color: "error",
      icon: "i-lucide-circle-x",
    });
  }
  const response2 = await $fetch<api_response>("/api/accounts/checkSession", {
    credentials: "include",
  });

  if (response2.token_decodificado) {
    token_data.value = response2.token_decodificado;
    router.push("/");
  }
};

const redirectToMainPage = () => {
  window.open("https://new.dokidokispanish.club");
};

useHead({
  title: "Cuenta DDSC",
});

onBeforeMount(() => {
  let index = randomIndex(images.length) ?? 0;
  image.value = images[index] ?? "/ddlc_bg/Monika_CoverArt_4K.webp";
});
</script>

<template>
  <main :style="{ backgroundImage: `url(${image})` }" class="fl_center">
    <article class="fl_column">
      <figure
        class="fl_evenly"
        @click="redirectToMainPage"
        title="ir a página principal"
      >
        <img src="/images/Logo_DDSC.png" />
        <figcaption>Cuenta DDSC (Admin)</figcaption>
      </figure>
      <section class="fl_column" style="margin-top: 30px">
        <UFormField label="Correo Electrónico" size="xl">
          <UInput
            v-model="login_data.email"
            placeholder="ejemplo@email.com"
            class="w-full"
            type="email"
          />
        </UFormField>
        <UFormField label="Contraseña" size="xl">
          <UInput
            v-model="login_data.password"
            placeholder="*********"
            class="w-full"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>
        <UButton icon="i-lucide-log-in" @click="loginfetch">Entrar</UButton>
      </section>
    </article>
  </main>
</template>

<style scoped>
main {
  height: 100dvh;
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  transition: all 0.3s linear;
  align-items: center;
  gap: 0;
}

article {
  width: 500px;
  height: fit-content;
  padding: 2%;
  background: var(--ui-bg);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  margin-block: auto;
  transition: all 0.3s linear;
}

figure {
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  align-items: center;
  img {
    width: 100px;
  }

  figcaption {
    font-size: 2rem;
  }
}
</style>
