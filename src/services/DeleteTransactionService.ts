import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository'

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const deleteTransacition = getCustomRepository(TransactionRepository);

    const transaction = await deleteTransacition.findOne(id)
    if (!transaction) {
      throw new AppError('Transação não existe')
    }

    await deleteTransacition.remove(transaction)

  }
}

export default DeleteTransactionService;
