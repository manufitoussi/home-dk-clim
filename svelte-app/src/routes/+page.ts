import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  // const title = window.api.settings.getTitle();

  return await parent();
};
