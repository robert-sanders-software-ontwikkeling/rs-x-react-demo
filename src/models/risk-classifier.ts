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