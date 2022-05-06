type GetUserMediaFunction = (
  constraints?: MediaStreamConstraints,
) => Promise<[MediaStream, undefined] | [undefined, unknown]>;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
export const getUserMedia: GetUserMediaFunction = async (constraints) => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    return [mediaStream, undefined];
  } catch (error) {
    return [undefined, error];
  }
};
