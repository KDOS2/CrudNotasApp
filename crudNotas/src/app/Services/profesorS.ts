import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralResponse, GetModelError } from '../Models/Generalresponse';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environment';
import { ProfesorModel } from '../Models/ProfesorModel';

@Injectable({
  providedIn: 'root',
})
export class ProfesorS {
  private server:string = environment.apiurl;

  constructor(private http: HttpClient) { }  
  
  ///Nuevo profesor
  public NuevoProfesor(data:ProfesorModel): Observable<GeneralResponse>{
          
    const headers = new HttpHeaders().set('content-type', 'application/json')          
    const body = `{ "nombre": "${data.nombre}"}`;

    const urlRequest = this.server + environment.nuevoProfesor;

    return this.http.post<GeneralResponse>(urlRequest, body, {headers:headers})
                    .pipe(
                          catchError((err:HttpErrorResponse) => {
                            let getError:GetModelError;
                            getError = {message : err.error.error, status : err.status, method : "NuevoProfesor", code : err.status};
                            throw getError;
                          })
                    );  
  }

  ///Actualizar profesor
  public ActualiarProfesor(data:ProfesorModel): Observable<GeneralResponse>{
          
    const headers = new HttpHeaders().set('content-type', 'application/json')          
    const body = `{ "id": ${data.id}, "nombre": "${data.nombre}"}`;

    const urlRequest = this.server + environment.actualizarProfesor;

    return this.http.post<GeneralResponse>(urlRequest, body, {headers:headers})
                    .pipe(
                          catchError((err:HttpErrorResponse) => {
                            let getError:GetModelError;
                            getError = {message : err.error.error, status : err.status, method : "ActualiarProfesor", code : err.status};
                            throw getError;
                          })
                    );  
  }

  ///eliminar profesor
  public GetSDeleteProfesor(id?:number): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.eliminarProfesor}${id}`;
          
  return this.http.delete<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "GetSDeleteProfesor", code : err.status};
                      throw getError;
                    })
                  );    
  }

  ///trae una lista de profesores paginada
  public GetProfesoresPaginado(pageNumber:number, pageSize:number): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.consultarProfesores}${pageNumber}/${pageSize}`;
          
  return this.http.get<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "GetprofesoresPaginado", code : err.status};
                      throw getError;
                    })
                  );    
  }

  ///trae una lista de profesores
  public GetProfesores(): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.consultarProfesor}`;
          
  return this.http.get<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "GetProfesores", code : err.status};
                      throw getError;
                    })
                  );    
  }

}