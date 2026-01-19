export interface EstudianteModel{
    nombre:string,
    id?:number
}

export interface NuevoEstudianteModel{
    studentId:number,
    studentName:string
}

export interface DeleteEstudianteModel{
    isDelete:boolean
}