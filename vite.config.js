import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

function apiContactPlugin() {
  return {
    name: "api-contact-handler",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/contact" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch {
              req.body = {};
            }

            // Minimal Express/Vercel response emulation
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return res;
            };

            try {
              const { default: handler } = await import("./api/contact.js");
              await handler(req, res);
            } catch (err) {
              console.error("[dev-api] Error handling /api/contact:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, message: "Internal server error" }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY;
  if (env.CONTACT_EMAIL) process.env.CONTACT_EMAIL = env.CONTACT_EMAIL;

  return {
    plugins: [react(), tailwindcss(), apiContactPlugin()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "framer-motion", "lenis", "lucide-react"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor-react";
              }
              if (id.includes("framer-motion")) {
                return "vendor-framer";
              }
              if (
                id.includes("lenis") ||
                id.includes("lucide-react") ||
                id.includes("@vercel")
              ) {
                return "vendor-misc";
              }
            }
          },
        },
      },
    },
  };
});
