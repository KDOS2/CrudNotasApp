import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstudianteModel } from '../Models/EstudianteModel';
import { catchError, Observable } from 'rxjs';
import { GeneralResponse, GetModelError } from '../Models/Generalresponse';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class Estudiante {
  
  private server:string = environment.apiurl;

  constructor(private http: HttpClient) { }  
  
  ///Nuevo estudiante
  public NuevoEstudiante(data:EstudianteModel): Observable<GeneralResponse>{
          
    const headers = new HttpHeaders().set('content-type', 'application/json')          
    const body = `{ "nombre": "${data.nombre}"}`;

    const urlRequest = this.server + environment.nuevoEstudiante;

    return this.http.post<GeneralResponse>(urlRequest, body, {headers:headers})
                    .pipe(
                          catchError((err:HttpErrorResponse) => {
                            let getError:GetModelError;
                            getError = {message : err.error.error, status : err.status, method : "NuevoEstudiante", code : err.status};
                            throw getError;
                          })
                    );  
  }

  ///Actualizar estudiante
  public ActualiarEstudiante(data:EstudianteModel): Observable<GeneralResponse>{
          
    const headers = new HttpHeaders().set('content-type', 'application/json')          
    const body = `{ "id": ${data.id}, "nombre": "${data.nombre}"}`;

    const urlRequest = this.server + environment.actualizarEstudiante;

    return this.http.post<GeneralResponse>(urlRequest, body, {headers:headers})
                    .pipe(
                          catchError((err:HttpErrorResponse) => {
                            let getError:GetModelError;
                            getError = {message : err.error.error, status : err.status, method : "ActualiarEstudiante", code : err.status};
                            throw getError;
                          })
                    );  
  }

  ///eliminar estudiante
  public GetSDeleteEstudiante(id?:number): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.eliminarEstudiante}${id}`;
          
  return this.http.delete<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "t", code : err.status};
                      throw getError;
                    })
                  );    
  }

  ///trae una lista de estudiantes paginada
  public GetEstudiantePaginado(pageNumber:number, pageSize:number): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.consultarEstudiantes}${pageNumber}/${pageSize}`;
          
  return this.http.get<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "GetEstudiantePaginado", code : err.status};
                      throw getError;
                    })
                  );    
  }

  ///trae una lista de estudiantes
  public GetEstudiantes(): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.consultarEstudiante}`;
          
  return this.http.get<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "GetEstudiantes", code : err.status};
                      throw getError;
                    })
                  );    
  }

}
