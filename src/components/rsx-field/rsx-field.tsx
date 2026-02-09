import { useRsxExpression } from '@rs-x/react';

interface RsxFieldProps {
  expression: string;
  model: object;
}

export const RsxField: React.FC<RsxFieldProps> = ({ expression, model }) => {
  const value = useRsxExpression<any>(expression, {model});
  return <>{value}</>;
};