import { CircularProgress } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { Routes, Route, useParams } from "react-router-dom";

export function Accounting() {
  return (
    <Routes>
      <Route element={<ListRoute />} index />
      <Route path="edit/:id" element={<EditRoute />} />
    </Routes>
  );
}

const EditPage = lazy(() => import("./AccountEditPage.tsx"));
function EditRoute() {
  const { id } = useParams();
  return (
    <Suspense fallback={<CircularProgress isIndeterminate />}>
      <EditPage existingAccountId={id} />
    </Suspense>
  );
}

const ListPage = lazy(() => import("./AccountList.tsx"));
function ListRoute() {
  return (
    <Suspense fallback={<CircularProgress isIndeterminate />}>
      <ListPage />
    </Suspense>
  );
}
export default Accounting;
