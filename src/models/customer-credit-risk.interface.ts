import type { ICredit } from './credit.interface';
import type { ICustomer } from './customer.interface';
import type { IRiskClassifier } from './risk-classifier.interface';

export interface ICustomerCredit {
    id: number;
    customer: ICustomer;
    credit: ICredit;
}

export interface ICustomerCreditRisk extends ICustomerCredit,  Record<string, unknown> {
    riskClassifier: IRiskClassifier
}