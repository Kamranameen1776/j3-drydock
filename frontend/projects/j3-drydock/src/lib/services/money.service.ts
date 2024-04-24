import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {
  defaultFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
