import React from 'react';
import type { ICustomerCredit, ICustomerCreditRisk } from '../../models/customer-credit-risk.interface';
import { CustomerCreditTemplate } from './customer-credit-edit.component.template';
import './customer-credit-edit.component.css';

interface Props {
  customerCreditRisk: ICustomerCreditRisk;
  onSave: (credit: ICustomerCredit) => void;
  onCancel: () => void;
}

export const CustomerCreditEdit: React.FC<Props> = ({ customerCreditRisk, onSave, onCancel }) => {
  // Clone input object to create a local reactive form
  const form: ICustomerCreditRisk = {
    ...customerCreditRisk,
    customer: { ...customerCreditRisk.customer },
    credit: { ...customerCreditRisk.credit },
  };

  // Form validity
  const isValid =
    form.customer.age !== undefined &&
    form.customer.income !== undefined &&
    form.customer.employmentYears !== undefined &&
    form.credit.score !== undefined &&
    form.credit.outstandingDebt !== undefined;

  // Save handler — copy form back to original object
  const handleSave = () => {
    if (!isValid) return;

    const updated: ICustomerCredit = {
      id: form.id,
      customer: { ...form.customer },
      credit: { ...form.credit },
    };

    onSave(updated);
  };

  return (
    <CustomerCreditTemplate
      form={form}
      onSave={handleSave}
      onCancel={onCancel}
      isValid={isValid}
    />
  );
};