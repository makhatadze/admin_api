import { Entity, Unique, Column } from 'typeorm';
import { SharedEntity } from '../../../../shared/entities/shared.entity';

@Entity('role_access')
@Unique('role_access_type_deleted', ['roleId', 'accessId', 'type', 'deletedAt'])
export class RoleAccessEntity extends SharedEntity {
  @Column({
    type: 'int',
    nullable: false,
    name: 'role_id',
    comment: 'Role id',
  })
  roleId: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'access_id',
    comment: 'Resource id',
  })
  accessId: number;

  @Column({
    type: 'tinyint',
    name: 'type',
    comment: 'Resource type: 2: indicates the menu, 3: indicates the interface (API)',
  })
  type: number;
}
