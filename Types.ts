// Types.ts

// This is the *type* that FullScreenModal will use
export type ModalAnimationType = 'none' | 'slide' | 'fade';

// This is a helper object so you can call ModalAnimationType.Fade, etc.
export const ModalAnimationType = {
  None: 'none' as ModalAnimationType,
  Slide: 'slide' as ModalAnimationType,
  Fade: 'fade' as ModalAnimationType,
};
