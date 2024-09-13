import { lazy } from "react";
import { Routes, Route, useParams } from "react-router-dom";

const AccountListPage = lazy(() => import("./AccountList.tsx"));
const AccountEditor = lazy(() => import("./AccountEditPage.tsx"));
function AccountEditorPage() {
  const { id } = useParams();

  return <AccountEditor existingAccountId={id} />;
}

export function Accounting() {
  return (
    <Routes>
      <Route element={<AccountListPage />} index />
      <Route path="edit/:id" element={<AccountEditorPage />} />
    </Routes>
  );
}

export default Accounting;
