import { useRsxExpression } from '@rs-x/react';
import type { ICustomerCredit, ICustomerCreditRisk } from '../../models/customer-credit-risk.interface';
import { RsxField } from '../rsx-field/rsx-field';
import React from 'react';

// --- New child component for each row ---
interface CreditRowProps {
  item: ICustomerCreditRisk;
  selected: ICustomerCreditRisk | null;
  onSelect: (item: ICustomerCreditRisk) => void;
  onEdit: (item: ICustomerCreditRisk) => void;
  onDelete: (item: ICustomerCreditRisk) => void;
  isEditing: (item: ICustomerCreditRisk) => boolean;
}

const CreditRow: React.FC<CreditRowProps> = ({
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
  isEditing
}) => {
  const riskClassification = useRsxExpression<string>(item.riskClassifier.riskClassification);

  return (
    <tr
      key={item.id}
      className={item === selected ? 'selected' : ''}
      onClick={() => onSelect(item)}
    >
      <td>{item.id}</td>
      <td>
        <RsxField
          expression='`${customer.age} (${customer.age > 40 ? "becoming old" : "still young"})`'
          model={item}
        />
      </td>
      <td>{item.customer.income}</td>
      <td>{item.customer.employmentYears}</td>
      <td>{item.credit.score}</td>
      <td>{item.credit.outstandingDebt}</td>
      <td className='risk'>{riskClassification}</td>
      <td className='actions'>
        {!isEditing(item) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            ✏️
          </button>
        )}
        <button
          className='danger'
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        >
          🗑
        </button>
      </td>
    </tr>
  );
};

// --- Updated table template ---
export interface CustomerCreditTableTemplateProps {
  customerCredits: ICustomerCreditRisk[];
  selected: ICustomerCreditRisk | null;
  editing: ICustomerCreditRisk | null;
  onSelect: (item: ICustomerCreditRisk) => void;
  onEdit: (item: ICustomerCreditRisk) => void;
  onDelete: (item: ICustomerCreditRisk) => void;
  onCloseEditor: () => void;
  onSave: (updated: ICustomerCredit) => void;
  isEditing: (item: ICustomerCreditRisk) => boolean;
  children?: React.ReactNode;
}

export const CustomerCreditTableTemplate: React.FC<CustomerCreditTableTemplateProps> = ({
  customerCredits,
  selected,
  onSelect,
  onEdit,
  onDelete,
  isEditing,
  children,
}) => {
  return (
    <div>
      <h2>Customer Credit Table</h2>
      <table className='customer-credit-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>Income</th>
            <th>Years</th>
            <th>Score</th>
            <th>Debt</th>
            <th>Risk</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customerCredits.map(item => (
            <CreditRow
              key={item.id}
              item={item}
              selected={selected}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              isEditing={isEditing}
            />
          ))}
        </tbody>
      </table>
      {children}
    </div>
  );
};