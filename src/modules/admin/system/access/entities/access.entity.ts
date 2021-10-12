import { Column, Entity, Unique } from 'typeorm';
import { SharedEntity } from '../../../../shared/entities/shared.entity';
import { StatusEnum } from '@src/enums';

@Entity('access')
@Unique('module_name_delete_at', ['moduleName', 'deletedAt'])
@Unique('action_name_delete_at', ['actionName', 'deletedAt'])
export class AccessEntity extends SharedEntity {
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    name: 'module_name',
    comment: 'Module name',
  })
  moduleName: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    name: 'type',
    comment: 'Type, 1: means module, 2: means menu, 3: means interface (API)',
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'action_name',
    comment: 'Operation name',
  })
  actionName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'api_name',
    comment: 'Interface name',
  })
  apiName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'icon',
    comment: 'Small icon',
  })
  icon: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'url',
    comment: 'url address',
  })
  url: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 10,
    name: 'method',
    comment: 'Request method',
  })
  method: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
    name: 'parent_id',
    comment: 'Parent module id',
  })
  parentId: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 1,
    name: 'sort',
    comment: 'Sort',
  })
  sort: number;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 1,
    name: 'status',
    comment: 'Status, 0 means forbidden, 1 means normal',
  })
  status: StatusEnum;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'description',
    comment: 'Profile',
  })
  description: string;
}
