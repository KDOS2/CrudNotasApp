export interface NotaModel{
    Id:number,
    IdProfesor:number,
    IdEstudiante:number,
    Nombre:string,
    NombreProfesor:string,
    NombreEstudiante:string,
    Valor:number
}

export interface NuevaNotaModel{
    id:number,
    idProfesor:number,
    idEstudiante:number,
    nombre:string,    
    valor:number
}

export interface DeleteNotaModel{
    isDelete:boolean
}