import type { IMarket } from './market.interface';
import type { IRisk } from './risk.interface';

export interface IRiskCalcParameters {
  readonly market: IMarket;
  readonly risk: IRisk;
}