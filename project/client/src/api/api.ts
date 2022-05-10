const SERVER_URL = '';

const createFetch = async <T = any>(
  url: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${SERVER_URL}/${url}`, init);
  return response.json();
};

export const newSession = async () => {
  const sessionId = await createFetch('new_session');
  console.log('sessionId = ', sessionId);
  return sessionId;
};

export const getBpm = async (sessionId: number) => {
  const bpm = await createFetch(`get_bpm/${sessionId}`);
  console.log('bpm = ', bpm);
  return bpm;
};

export const uploadPicture = async (img: string, sessionId: number) => {
  const formData = { frame: img };
  const options = {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(formData),
  };
  const res = await createFetch(`new_data/${sessionId}`, options);
  console.log('Upload res = ', res);
  return res;
};
