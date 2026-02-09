import React from "react";
import { CustomerCreditTable } from "./components/customer-credit-table/customer-credit-table.component";
import "./app.css";

export const App: React.FC = () => {
  return (
    <div className="app">
      <CustomerCreditTable />
    </div>
  );
};

export default App;