/*
 *
 * Copyright 2019 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ProgramRuleAction } from 'src/models';

@Entity()
export class ProgramRuleEntity {
  @PrimaryColumn() id: string;
  @Column() displayName: string;
  @Column('simple-json') condition: string;
  @Column({ nullable: true, type: 'simple-json' }) description: string;
  @Column('simple-json') program: { id: string };
  @Column({ nullable: true, type: 'simple-json' })
  programRuleActions: ProgramRuleAction[];
}

@Entity()
export class ProgramRuleActionEntity {
  @PrimaryColumn() id: string;
  @Column() programRuleActionType: string;
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true, type: 'simple-json' }) data: string;
  @Column({ nullable: true, type: 'simple-json' }) content: string;
  @Column('simple-json') programRule: { id: string };
  @Column({ nullable: true, type: 'simple-json' }) dataElement: { id: string };
  @Column({ nullable: true, type: 'simple-json' }) trackedEntityAttribute: {
    id: string;
  };
  @Column({ nullable: true, type: 'simple-json' }) programStageSection: {
    id: string;
  };
  @Column({ nullable: true, type: 'simple-json' }) programStage: { id: string };
}

@Entity()
export class ProgramRuleVariableEntity {
  @PrimaryColumn() id: string;
  @Column() displayName: string;
  @Column() programRuleVariableSourceType: string;
  @Column('simple-json') program: { id: string };
  @Column({ nullable: true, type: 'simple-json' }) dataElement: { id: string };
  @Column({ nullable: true, type: 'simple-json' }) trackedEntityAttribute: {
    id: string;
  };
  @Column({ nullable: true, type: 'simple-json' }) programStageSection: {
    id: string;
  };
  @Column({ nullable: true, type: 'simple-json' }) programStage: { id: string };
}
