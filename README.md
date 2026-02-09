# RS-X React DEMO


## Getting started

- Make sure you have [Node.js](https://nodejs.org/en) installed.
- Run `npm install` to install the required packages.
- Run `npm run dev ` to start the demo.

## useRsxExpression hook

This demo illustrates the use of the `useRsxExpression` hook . It makes use of the [RS-X framework](https://github.com/robert-sanders-software-ontwikkeling/rs-x/blob/main/readme.md).

It allows you to bind not only to asynchronous data, but also to expressions that are updated **only when the data they depend on changes**.

The main advantage of using **useRsxExpression** is that you can define a data model that is a mix of asynchronous and synchronous data and make it reactive by attaching **RS-X expressions** to it. Expressions can be as simple as identifiers or as complex as full JavaScript formulas.

Your data model is the **single source of truth** that you bind to. You can freely manipulate this model, and RS-X ensures that all linked expressions are automatically updated when the underlying data changes. The **useRsxExpression** hook acts as the bridge that connects your reactive data model to the UI.

For this demo we use the **useRsxExpression** hook in the following scenarios:

- Bind to an expression string  
    ```tsx
      <RsxField
          expression='`${customer.age} (${customer.age > 40 ? "becoming old" : "still young"})`'
          model={item}
      />
    ```

    You could, of course, achieve the same result using standard react bindings. However, this approach is inefficient because React re-evaluates the entire expression every time the component is checked. In a table with many rows, this can quickly become a performance issue.
    ```tsx
    { customer.age + ` (${customer.age > 40 ? 'becoming old' : 'still young'})` }
    ```

    The `rsx-field` component is a simple wrapper using the rsx-pipe:  
    ```ts
    import { useRsxExpression } from '@rs-x/react';

    interface RsxFieldProps {
      expression: string;
      model: object;
    }

    export const RsxField: React.FC<RsxFieldProps> = ({ expression, model }) => {
      const value = useRsxExpression<any>(expression, {model});
      return <>{value}</>;
    };
    ```

- Bind to a parsed expression:  
    ```tsx
   const riskClassification = useRsxExpression<string>(item.riskClassifier.riskClassification);


    return (
      <tr>
        ...
        <td className='risk'>{riskClassification}</td>
      </tr>
    );
    ```

    Here, `riskClassification` is an expression tree returned by the RS-X expression parser. The following code shows how it is created:
    ```ts
    import { BehaviorSubject } from 'rxjs';
    import type { ICustomer } from './customer.interface';
    import type { ICredit } from './credit.interface';
    import type { IRiskCalcParameters } from './risk-calc-parameters.interface';
    import type { IRiskClassifier } from './risk-classifier.interface';
    import type { AbstractExpression, IExpression, IExpressionFactory } from '@rs-x/expression-parser';

    interface IRiskModel {
        readonly customer: BehaviorSubject<ICustomer>;
        readonly credit: BehaviorSubject<ICredit>;
        readonly riskParameters: BehaviorSubject<IRiskCalcParameters>;
    }

    export class RiskClassifier implements IRiskClassifier {
        public readonly riskClassification: AbstractExpression<string>;
        private readonly _model: IRiskModel;
        private _isDisposed = false;

        constructor(
            customer: ICustomer,
            credit: ICredit,
            riskParameters: IRiskCalcParameters,
            expressionFactory: IExpressionFactory) {

            this._model = {
                customer: new BehaviorSubject(customer),
                credit: new BehaviorSubject(credit),
                riskParameters: new BehaviorSubject(riskParameters),
            };
            const basePersonalRisk = expressionFactory.create(
                this._model, `
                (credit.score < 600 ? 0.4 : 0.1) +
                (credit.outstandingDebt / customer.income) * 0.6 -
                (customer.employmentYears * 0.03) 
            `) as IExpression<number>;

            const ageBasedRiskAdjustment = expressionFactory.create(
                this._model, `
                customer.age < 25 ? 0.15 :
                customer.age < 35 ? 0.05 :
                customer.age < 55 ? 0.00 :
                0.08
            `) as IExpression<number>;

            const marketRisk = expressionFactory.create(
                this._model, `
                (riskParameters.risk.volatilityIndex * 0.5) +
                (riskParameters.risk.recessionProbability * 0.5)
            `) as IExpression<number>;

            const interestRateImpact = expressionFactory.create(
                this._model, `
                riskParameters.market.baseInterestRate * 2
            `) as IExpression<number>;

            const riskScore = expressionFactory.create(
                {
                    basePersonalRisk,
                    ageBasedRiskAdjustment,
                    marketRisk,
                    interestRateImpact
                }, `
                basePersonalRisk + 
                ageBasedRiskAdjustment +
                marketRisk + 
                interestRateImpact
            `);

            this.riskClassification = expressionFactory.create(
                {
                    riskScore: riskScore as IExpression<number>,
                    thresholds: {
                        highRisk: 0.75,
                        mediumRisk: 0.45
                    }
                }, `
                riskScore >= thresholds.highRisk
                    ? 'HIGH'
                    : riskScore >= thresholds.mediumRisk
                        ? 'MEDIUM'
                        : 'LOW'
                `
            ) as AbstractExpression<string>;
        }
        public dispose(): void {
            if(this._isDisposed) {
                return;
            }

            this.riskClassification.dispose();
            this._isDisposed = true;
        }

        public setCustomer(customer: ICustomer): void {
            this._model.customer.next(customer);
        }

        public setCredit(credit: ICredit): void {
            this._model.credit.next(credit);
        }

        public setRiskCalcParameters(parameters: IRiskCalcParameters): void {
            this._model.riskParameters.next(parameters);
        }
    }
    ```

## `useRsxModel` hook

The `useRsxModel` hook makes a plain JavaScript object reactive for use in RS-X applications.  

- **Recursive:** Walks through the entire object, including nested objects.  
- **Field Reactivity:** Internally calls `useRsxExpression` for every field to enable reactive updates.  
- **Ignores Methods:** Functions, including regular and arrow functions, are skipped.  
- **Unsupported Collections:** Arrays, Maps, and Sets are **not supported** and will throw an `UnsupportedException`. Using collections may break React’s Hooks order, so the data structure must remain consistent between renders.

In the example below, we make the form model reactive by using `useRsxModel`. After that, you can directly manipulate the form model to trigger updates.

```tsx

useRsxModel(form);

...

<input
  type="number"
  value={form.customer.income}
  onChange={(e) => (form.customer.income = Number(e.target.value))}
/>
```

#### Full example

```tsx
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
```