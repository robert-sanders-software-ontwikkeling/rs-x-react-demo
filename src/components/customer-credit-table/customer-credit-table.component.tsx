import { useRsxExpression } from '@rs-x/react';
import React from 'react';
import type { ICustomerCredit, ICustomerCreditRisk } from '../../models/customer-credit-risk.interface';
import { getCustomerCreditRiskService } from '../../services/customer-credit-risk.service';
import { CustomerCreditEdit } from '../customer-credit-edit/customer-credit-edit.component';
import './customer-credit-table.component.css';
import { CustomerCreditTableTemplate } from './customer-credit-table.component.template';

interface ICustomerCreditTableModel {
  selected: ICustomerCreditRisk | null;
  editing: ICustomerCreditRisk | null;
  customerCredits: Promise<ICustomerCreditRisk[]>;
}

export const CustomerCreditTable: React.FC = () => {
  const service = getCustomerCreditRiskService();
  const modelRef = React.useRef<ICustomerCreditTableModel>({
    selected: null,
    customerCredits: service.getAll(),
    editing: null
  });
  const model = modelRef.current;

  const customerCredits = useRsxExpression<ICustomerCreditRisk[]>(
    'customerCredits',
   {model}
  ) ?? [];
  useRsxExpression<ICustomerCreditRisk[]>(
    'selected',
     {model}
  );
  useRsxExpression<ICustomerCreditRisk[]>(
    'editing',
     {model}
  );

  const select = (item: ICustomerCreditRisk) => model.selected = item;

  const edit = (item: ICustomerCreditRisk) => {
    model.selected = item;
    model.editing = item;
  };

  const closeEditor = () => model.editing = null;

  const alertDelay = 250;

  const save = async (updated: ICustomerCredit) => {
    try {
       model.customerCredits = service.update(updated.id, updated);
      closeEditor();
      window.setTimeout(() => alert(`Customer credit with ${updated.id} updated successfully.`), alertDelay);

    } catch (error) {
      alert(`Error updating customer credit with id ${updated.id}: ${error}`);
    }
  };

  const deleteItem = async (item: ICustomerCreditRisk) => {
    try {
      model.customerCredits = service.delete(item.id);
      if (model.selected === item) {
        model.selected = null;
      }
       window.setTimeout(() => alert(`Customer credit with id ${item.id} deleted successfully.`), alertDelay);
    } catch (error) {
       window.setTimeout(() => alert(`Error deleting customer credit with id ${item.id}: ${error}`), alertDelay);
    }
  };

  const isEditing = (item: ICustomerCreditRisk) => model.editing === item;

  return (
    <CustomerCreditTableTemplate
      customerCredits={customerCredits}
      selected={model.selected}
      editing={model.editing}
      onSelect={select}
      onEdit={edit}
      onDelete={deleteItem}
      onCloseEditor={closeEditor}
      onSave={save}
      isEditing={isEditing}
    >
      {model.editing && (
        <CustomerCreditEdit
          customerCreditRisk={model.editing}
          onCancel={closeEditor}
          onSave={save}
        />
      )}
    </CustomerCreditTableTemplate>
  );
};