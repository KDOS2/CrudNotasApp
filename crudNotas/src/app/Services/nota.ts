import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstudianteModel } from '../Models/EstudianteModel';
import { catchError, Observable } from 'rxjs';
import { GeneralResponse, GetModelError } from '../Models/Generalresponse';
import { environment } from '../environment';
import { NuevaNotaModel } from '../Models/NotaModel';

@Injectable({
  providedIn: 'root',
})
export class NotaS {
  
  private server:string = environment.apiurl;

  constructor(private http: HttpClient) { }  
  
  ///Nuevo Nota
  public NuevaNota(data:NuevaNotaModel): Observable<GeneralResponse>{
          
    const headers = new HttpHeaders().set('content-type', 'application/json')          
    const body = `{ "idProfesor": ${data.idProfesor}, "idEstudiante": ${data.idEstudiante}, "nombre": "${data.nombre}", "valor": ${data.valor} }`;

    const urlRequest = this.server + environment.nuevaNota;

    return this.http.post<GeneralResponse>(urlRequest, body, {headers:headers})
                    .pipe(
                          catchError((err:HttpErrorResponse) => {
                            let getError:GetModelError;
                            getError = {message : err.error.error, status : err.status, method : "NuevaNota", code : err.status};
                            throw getError;
                          })
                    );  
  }

  ///Actualizar nota
  public ActualiarNota(data:NuevaNotaModel): Observable<GeneralResponse>{
          
    const headers = new HttpHeaders().set('content-type', 'application/json')          
    const body = `{ "id": ${data.id}, "nombre": "${data.nombre}", "idProfesor": ${data.idProfesor}, "idEstudiante": ${data.idEstudiante}, "valor": ${data.valor} }`;

    const urlRequest = this.server + environment.actualizarNota;

    return this.http.post<GeneralResponse>(urlRequest, body, {headers:headers})
                    .pipe(
                          catchError((err:HttpErrorResponse) => {
                            let getError:GetModelError;
                            getError = {message : err.error.error, status : err.status, method : "ActualiarNota", code : err.status};
                            throw getError;
                          })
                    );  
  }

  ///eliminar nota
  public DeleteNota(id?:number): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.eliminarNota}${id}`;
          
  return this.http.delete<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "DeleteNota", code : err.status};
                      throw getError;
                    })
                  );    
  }

  ///trae una lista de nota paginada
  public GetNotaPaginado(pageNumber:number, pageSize:number): Observable<GeneralResponse>{
      
  const urlRequest = `${this.server}${environment.consultarNotas}${pageNumber}/${pageSize}`;
          
  return this.http.get<GeneralResponse>(urlRequest)
                  .pipe(
                    catchError((err:HttpErrorResponse) => {
                      let getError:GetModelError;
                      getError = {message : err.error.error, status : err.status, method : "GetNotaPaginado", code : err.status};
                      throw getError;
                    })
                  );    
  }

}
