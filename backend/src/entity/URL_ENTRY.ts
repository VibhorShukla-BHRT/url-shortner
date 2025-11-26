import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class URL_ENTRY {
    @PrimaryColumn()
    surl!: string

    @Column()
    ourl!: string
}

@Entity()
export class LAST{
    @PrimaryColumn()
    id!: number

    @Column("int", {array: true})
    last!: number[]
}
