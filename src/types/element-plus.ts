import { ElForm, ElDialog, ElTree, ElDescriptions } from 'element-plus'
import { FormItemRule } from 'element-plus/packages/form/src/form.type'

export type IElForm = InstanceType<typeof ElForm>
export type IElDialog = InstanceType<typeof ElDialog>
export type IElTree = InstanceType<typeof ElTree>
export type IElDescriptions = InstanceType<typeof ElDescriptions>

export type IFormRule = Record<string, FormItemRule[]>
