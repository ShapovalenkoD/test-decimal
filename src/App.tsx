import { Toaster } from "sonner";

import { AppLayout } from "./App.layout";
import { MainPage } from "./routes";

function App() {
  return (
    <>
      <AppLayout>
        <MainPage />
      </AppLayout>
      <Toaster />
    </>
  );
}

export default App;
