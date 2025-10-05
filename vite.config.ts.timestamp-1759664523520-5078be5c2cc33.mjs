// vite.config.ts
import { defineConfig } from "file:///C:/Users/suraj/Downloads/edumaster40-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/suraj/Downloads/edumaster40-main/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///C:/Users/suraj/Downloads/edumaster40-main/node_modules/vite-plugin-svgr/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\suraj\\Downloads\\edumaster40-main";
var vite_config_default = defineConfig({
  plugins: [
    svgr({
      include: "**/*.svg?react"
    }),
    react({
      include: "**/*.{jsx,tsx}"
    })
  ],
  assetsInclude: ["**/*.svg"],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  define: {
    global: "globalThis"
  }
  // Removed proxy configuration since we're using direct API calls
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzdXJhalxcXFxEb3dubG9hZHNcXFxcZWR1bWFzdGVyNDAtbWFpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc3VyYWpcXFxcRG93bmxvYWRzXFxcXGVkdW1hc3RlcjQwLW1haW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3N1cmFqL0Rvd25sb2Fkcy9lZHVtYXN0ZXI0MC1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc3Zncih7XG4gICAgICBpbmNsdWRlOiBcIioqLyouc3ZnP3JlYWN0XCIsXG4gICAgfSksXG4gICAgcmVhY3Qoe1xuICAgICAgaW5jbHVkZTogXCIqKi8qLntqc3gsdHN4fVwiLFxuICAgIH0pXG4gIF0sXG4gIGFzc2V0c0luY2x1ZGU6IFsnKiovKi5zdmcnXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgZ2xvYmFsOiAnZ2xvYmFsVGhpcycsXG4gIH1cbiAgLy8gUmVtb3ZlZCBwcm94eSBjb25maWd1cmF0aW9uIHNpbmNlIHdlJ3JlIHVzaW5nIGRpcmVjdCBBUEkgY2FsbHNcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVQsU0FBUyxvQkFBb0I7QUFDcFYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLE1BQ0osU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLGVBQWUsQ0FBQyxVQUFVO0FBQUEsRUFDMUIsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUMvQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVE7QUFBQSxFQUNWO0FBQUE7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
