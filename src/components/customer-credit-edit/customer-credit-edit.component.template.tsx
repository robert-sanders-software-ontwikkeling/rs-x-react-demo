import { useRsxModel } from '@rs-x/react';
import React, { useEffect, useState } from "react";
import type { ICustomerCreditRisk } from "../../models/customer-credit-risk.interface";

interface Props {
  form: ICustomerCreditRisk;
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

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => onCancel(), 200);
  };

  useRsxModel(form);

  return (
    <div className={`backdrop ${visible ? "visible" : ""}`} onClick={handleCancel}>
      <div className={`panel ${visible ? "visible" : ""}`} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Customer Credit</h3>

        <form>
          <fieldset>
            <legend>Customer</legend>
            <div className="form-grid">
              <label>
                <span>Age</span>
                <input
                  type="number"
                  value={form.customer.age}
                  onChange={(e) => (form.customer.age = Number(e.target.value))}
                />
              </label>

              <label>
                <span>Income</span>
                <input
                  type="number"
                  value={form.customer.income}
                  onChange={(e) => (form.customer.income = Number(e.target.value))}
                />
              </label>

              <label>
                <span>Employment Years</span>
                <input
                  type="number"
                  value={form.customer.employmentYears}
                  onChange={(e) => (form.customer.employmentYears = Number(e.target.value))}
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Credit</legend>
            <div className="form-grid">
              <label>
                <span>Credit Score</span>
                <input
                  type="number"
                  value={form.credit.score}
                  onChange={(e) => (form.credit.score = Number(e.target.value))}
                />
              </label>

              <label>
                <span>Outstanding Debt</span>
                <input
                  type="number"
                  value={form.credit.outstandingDebt}
                  onChange={(e) => (form.credit.outstandingDebt = Number(e.target.value))}
                />
              </label>
            </div>
          </fieldset>

          <div className="actions">
            <button type="button" className="cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="save" onClick={onSave} disabled={!isValid}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};