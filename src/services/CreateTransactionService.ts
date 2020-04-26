import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {

    const categoryRepository = getRepository(Category);
    const transacRepository = getCustomRepository(TransactionRepository);

    const { total } = await transacRepository.getBalance();

    // verfica se o saldo é suficiente
    if (type === 'outcome' && total < value) {
      throw new AppError('Saldo Insuficiente');
    };

    let checkCategoryExist = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!checkCategoryExist) {
      //Utilizo a mesma variavel para criar a nova categoria
      checkCategoryExist = categoryRepository.create({
        title: category

      })
      await categoryRepository.save(checkCategoryExist)
    }

    // if (!['income', 'outcome'].includes(type)) {
    //   throw new Error('Operaçao Invalida');
    // }


    const transaction = transacRepository.create({
      title,
      value,
      type,
      category: checkCategoryExist
    });

    await transacRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
