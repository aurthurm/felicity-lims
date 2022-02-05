import Store from '../src/store/index';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof Store;
  }
}