export interface ProfesorModel{
    nombre:string,
    id?:number
}

export interface NuevoProfesorModel{
    studentId:number,
    studentName:string
}

export interface DeleteProfesorModel{
    isDelete:boolean
}