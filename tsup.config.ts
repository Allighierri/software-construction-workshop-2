import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
});
