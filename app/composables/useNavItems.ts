const items_for_menu_aside = ref([]);
const show_nav = ref(true);

export const useNavItems = () => {
  return {
    items_for_menu_aside,
    show_nav,
  };
};
