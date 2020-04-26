import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

// interface Transaction {
//   id: string;
//   value: number;
//   type: string;
//   category: string;
// }

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    /**
     * Primeira maneira de resolver a logica do metodo getBalance *
     */

    // const income = await (
    //   await this.find({ where: { type: 'income' } })
    // ).reduce((acumulador, transaction) => acumulador + transaction.value, 0);

    // const outcome = await (
    //   await this.find({ where: { type: 'outcome' } })
    // ).reduce((acumulador, transaction) => acumulador + transaction.value, 0);

    // const balance: Balance = {
    //   income,
    //   outcome,
    //   total: income - outcome,
    // };

    /**
     * Segunda maneira de resolver a logica do metodo getBalance *
     */

    const transactions = await this.find();
    const balance: Balance = { income: 0, outcome: 0, total: 0 };
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance.income += +transaction.value;
      } else if (transaction.type === 'outcome') {
        balance.outcome += +transaction.value;
      }
      balance.total = balance.income - balance.outcome;
    });

    // /**
    //  * Terceira maneira de resolver a logica do metodo getBalance *
    //  */

    // const transactions = await this.find();
    // const { income, outcome } = transactions.reduce(
    //   (acumulador: Balance, transaction: Transaction) => {
    //     switch (transaction.type) {
    //       case 'income':
    //         acumulador.income += Number(transaction.value);
    //         break;
    //       case 'outcome':
    //         acumulador.outcome += Number(transaction.value);
    //         break;
    //       default:
    //         break;
    //     }
    //     return acumulador;
    //   },
    //   { income: 0, outcome: 0, total: 0 },
    // );

    // const total = income - outcome;
    // const balance = { total, income, outcome };

    return balance;
  }
}

export default TransactionsRepository;
