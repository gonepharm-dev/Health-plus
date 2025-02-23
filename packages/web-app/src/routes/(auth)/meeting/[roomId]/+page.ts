import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, url }) => {
  return {
    roomId: params.roomId,
    token: url.searchParams.get('token'),
    initialMicState: url.searchParams.get('mic') !== 'false',
    initialCameraState: url.searchParams.get('camera') !== 'false'
  };
};