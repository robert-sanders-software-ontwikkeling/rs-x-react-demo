import { useRsxModel } from '@rs-x/react';
import React, { useEffect, useState } from "react";
import type { ICustomerCreditRisk } from "../../models/customer-credit-risk.interface";

interface Props {
  form: ICustomerCreditRisk ;
  onSave: () => void;
  onCancel: () => void;
  isValid: boolean;
}

export const CustomerCreditTemplate: React.FC<Props> = ({
  form,
  onSave,
  onCancel,
  isValid,
}) => {
  const [visible, setVisible] = useState(false);

  // Trigger fade-in when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10); // small delay for transition
    return () => clearTimeout(timer);
  }, []);

  // Handle closing with fade-out
  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => onCancel(), 200); // wait for transition
  };

  useRsxModel(form);
 
  return (
    <div className={`backdrop ${visible ? "visible" : ""}`} onClick={handleCancel}>
      <div className={`panel ${visible ? "visible" : ""}`} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Customer Credit</h3>

        <form>
          {/* CUSTOMER */}
          <fieldset>
            <legend>Customer</legend>

            <label>
              Age
              <input
                type="number"
                value={form.customer.age}
                onChange={(e) => (form.customer.age = Number(e.target.value))}
              />
            </label>

            <label>
              Income
              <input
                type="number"
                value={form.customer.income}
                onChange={(e) => (form.customer.income = Number(e.target.value))}
              />
            </label>

            <label>
              Employment Years
              <input
                type="number"
                value={form.customer.employmentYears}
                onChange={(e) => (form.customer.employmentYears = Number(e.target.value))}
              />
            </label>
          </fieldset>

          {/* CREDIT */}
          <fieldset>
            <legend>Credit</legend>

            <label>
              Credit Score
              <input
                type="number"
                value={form.credit.score}
                onChange={(e) => (form.credit.score = Number(e.target.value))}
              />
            </label>

            <label>
              Outstanding Debt
              <input
                type="number"
                value={form.credit.outstandingDebt}
                onChange={(e) => (form.credit.outstandingDebt = Number(e.target.value))}
              />
            </label>
          </fieldset>

          <div className="actions">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={onSave} disabled={!isValid}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};