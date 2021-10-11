import { Column, Entity, Unique, Index } from 'typeorm';
import { SharedEntity } from '../../../../shared/entities/shared.entity';
import { StatusEnum } from '@src/enums';

@Entity('role')
@Unique('name_deleted', ['name', 'deletedAt'])
export class RoleEntity extends SharedEntity {
  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    name: 'name',
    comment: 'Role Name',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'description',
    comment: 'Role profile',
  })
  description: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 1,
    name: 'status',
    comment: 'State 1 means active, 0 means not active',
  })
  status: StatusEnum;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 0,
    name: 'is_default',
    comment: '针对后期提供注册用,1表示默认角色,0表示非默认角色',
  })
  isDefault: number;
}
