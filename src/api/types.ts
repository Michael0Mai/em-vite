import { ListCache } from 'element-plus'

export interface LoginResponse {
    refresh:string
    access:string
}

export interface departmentParams {
    name__icontains:string
    abbreviation:string
    is_delete:boolean
}

export interface departmentType {
    id:string
    name:string
    abbreviation:string
    is_delete:boolean
}

export interface postdepartmentType {
    name:string
    abbreviation:string
}

// ==================================

export interface staffParams {
    name__icontains:string
    department:string
    page:number
    is_delete:boolean
}

export interface postStaffType {
    name:string
    phone:string
    department:string
}
