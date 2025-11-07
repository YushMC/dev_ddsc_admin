const navigation_pages = ref({
  users: 1,
  mods: 1,
});

export const useNavigation = () => {
  return {
    navigation_pages,
  };
};
