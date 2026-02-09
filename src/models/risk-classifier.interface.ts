import type { IDisposable } from '@rs-x/core';
import type { ICustomer } from './customer.interface';
import type { ICredit } from './credit.interface';
import type { IRiskCalcParameters } from './risk-calc-parameters.interface';
import type { AbstractExpression } from '@rs-x/expression-parser';


export interface IRiskClassifier extends IDisposable {
    readonly riskClassification: AbstractExpression<string>;
    setCustomer(customer: ICustomer): void
    setCredit(credit: ICredit): void;
    setRiskCalcParameters(parameters: IRiskCalcParameters): void;
}