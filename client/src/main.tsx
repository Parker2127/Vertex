import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide the initial HTML loading screen once React loads
const initialLoader = document.getElementById('initial-loader');
if (initialLoader) {
  initialLoader.style.display = 'none';
}

createRoot(document.getElementById("root")!).render(<App />);
