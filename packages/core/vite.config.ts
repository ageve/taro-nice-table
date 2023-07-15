import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "taro-chat",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@tarojs/taro",
        "@tarojs/react",
        "@tarojs/components",
      ],
    },
  },
  plugins: [dts()], // 生成 TS 类型文件
});
