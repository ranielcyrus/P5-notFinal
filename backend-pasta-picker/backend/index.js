import app from "./src/app.js";
import { port } from "./src/config/index.js";

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});