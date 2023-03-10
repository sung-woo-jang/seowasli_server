import { Order } from './entities/order.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {}
