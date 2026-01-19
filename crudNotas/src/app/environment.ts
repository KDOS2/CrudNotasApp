export const patterns = {
    //emailValidate: '\S+@\S+\.\S+',
    emailValidate: /^["']/,
    numberValidate:/^[0-9]*$/,
    //decimalNote:/^\d+(\.\d{1,2})?$/
    decimalNote:/^[0-9](\.[0-9]{1,2})?$/
}

export const environment = {
    apiurl: 'https://localhost:7146/',   
    totalByPage:5,
    pageSizeOptions: [5, 10, 15, 20, 50],    
    
    nuevoEstudiante:'Estudiante/NuevoEstudiante',
    actualizarEstudiante:'Estudiante/ActualizarEstudiante',
    eliminarEstudiante:'Estudiante/EliminarEstudiante/',
    consultarEstudiante:'Estudiante/ConsultarEstudiante',
    consultarEstudiantes:'Estudiante/ConsultarEstudiantes/',

    nuevoProfesor:'Profesor/NuevoProfesor',
    actualizarProfesor:'Profesor/ActualizarProfesor',
    eliminarProfesor:'Profesor/EliminarProfesor/',
    consultarProfesor:'Profesor/ConsultarProfesor',
    consultarProfesores:'Profesor/ConsultarProfesores/',

    nuevaNota:'Nota/NuevaNota',
    actualizarNota:'Nota/ActualizarNota',
    eliminarNota:'Nota/EliminarNota/',
    consultarNota:'Nota/ConsultarNota/',
    consultarNotas:'Nota/ConsultarNotas/'
}