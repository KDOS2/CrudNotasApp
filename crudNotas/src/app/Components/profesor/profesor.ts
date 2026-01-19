import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChangeDetectorRef } from '@angular/core';
import { ProfesorModel } from '../../Models/ProfesorModel';
import { ProfesorS } from '../../Services/profesorS';
import { GeneralResponse, GetModelError } from '../../Models/Generalresponse';
import { Modal } from '../../Modal/modal';
import { msgGeneral } from '../../Messages';
import { environment } from '../../environment';

@Component({
  selector: 'app-profesor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, NgxPaginationModule, Modal],
  templateUrl: './profesor.html',
  styleUrl: './profesor.scss',
})


export class Profesor implements OnInit {
  @ViewChild('modalInactive') modalInactive!: Modal;
  teacherForm!: FormGroup;
  idTeacher:number = 0;
  idNumber:number = 0;
  Profesor:any[] = [];  
  
  messageConst = msgGeneral;
  totalByPage: number = environment.totalByPage;
  pageSizeOptions:number[] = environment.pageSizeOptions;
  totalitems:number=-1;
  p: number = 1;
  
  constructor(
    private fb: FormBuilder,
    private loader: NgxSpinnerService,
    private stService: ProfesorS,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  //#region generic methods

  ngOnInit(): void {
    this.InitForm();
    this.GetProfesorPaginado(this.p, this.totalByPage);
  }

  private InitForm(): void {
    this.teacherForm = this.fb.group({
      nombre: ['', Validators.required],
      id: [0, Validators.required]      
    });
  }

  onSubmit(): void {
    if(this.teacherForm.get('id')?.value == null || this.teacherForm.get('id')?.value == '')
      this.NuevoProfesor();
    else
      this.ActualizarProfesor();
  }

  private ResponseProcess(data: GeneralResponse, isDelete:boolean=false): void {
    if (data.success) {
      if(isDelete)
          this.p = 1;
      
      this.CleanObject();
      this.modalInactive.show = false;
      this.GetProfesorPaginado(this.p, this.totalByPage);
      this.toastr.success("Operación realizada exitosamente.");
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido.");
    }
  }  

  public CleanObject(){
    this.teacherForm.reset();
    this.teacherForm.patchValue({
      id:0      
    });
    this.idTeacher = 0;
  }

  //#endregion

  //#region Nuevo Profesor Methods

  private NuevoProfesor(): void {
    this.loader.show();
    this.stService.NuevoProfesor(this.SetProfesor()).subscribe({
      next: (response: GeneralResponse) => {
        this.ResponseProcess(response);
      },
      error: (error: GetModelError) => {
        error.method = `NuevoProfesor - ${error.method}`;
        this.loader.hide();
        this.toastr.error(error.message ?? this.messageConst.generalProblem);
      },
      complete: () => {
        console.info('<< NuevoProfesor >>');
        this.CleanObject();
        this.loader.hide();
      }
    });
  }

  private SetProfesor(): ProfesorModel {
    return {
      id: this.teacherForm.get('id')?.value,
      nombre: this.teacherForm.get('nombre')?.value
    };
  }

  //#endregion
  
  //#region Delete Profesor Methods
  public Inactivate(data:ProfesorModel):void{
    this.idTeacher = data.id ?? 0;
  }

  public async DeleteProfesor(): Promise<void> {
    this.loader.show();
    this.stService.GetSDeleteProfesor(this.idTeacher)
        .subscribe({next: async (resposeUser:GeneralResponse) => {  await this.ResponseProcess(resposeUser, true); },
                    error: async (error: GetModelError) => {
                      error.method = `DeleteProfesor - ${error.method}`;                      
                      this.loader.hide();
                      this.toastr.error(this.messageConst.generalProblem);
                    },
                    complete: async () => { console.info('<< LOGUP >>'); this.loader.hide(); }
    });
    
  }
  //#endregion

  //#region Update Profesor Methods
  public UpdateProfesor(data:ProfesorModel):void{
    this.teacherForm.patchValue({
        id:data.id,
        nombre:data.nombre
    });    
  }

  private ActualizarProfesor(): void {
    this.loader.show();
    this.stService.ActualiarProfesor(this.SetProfesor()).subscribe({
      next: (response: GeneralResponse) => {
        this.ResponseProcess(response);
      },
      error: (error: GetModelError) => {
        error.method = `ActualizarProfesor - ${error.method}`;
        this.loader.hide();
        this.toastr.error(error.message ?? this.messageConst.generalProblem);
      },
      complete: () => {
        console.info('<< ActualizarProfesor >>');
        this.CleanObject();
        this.loader.hide();
      }
    });
  }
  //#endregion

  //#region Get Profesors Paginado Methods
  public GetProfesorPaginado(p:number, totalByPage:number): void {
    this.loader.show();
    this.stService.GetProfesoresPaginado(p,totalByPage).subscribe({
        next: (response: GeneralResponse) => {
          this.ResponseProfesorsPaginado(response);
        },
        error: async (error: GetModelError) => {
          error.method = `GetProfesorsPaginado - ${error.method}`;
          this.loader.hide();
          this.toastr.error(error.message ?? this.messageConst.generalProblem);
        },
        complete: () => {
          this.loader.hide();
          console.info('<< GetProfesorsPaginado >>');          
        }
      });
  }

  private ResponseProfesorsPaginado(data: GeneralResponse): void {
    if (data.success) {      
        this.Profesor = data.data.items;
        this.totalitems = data.data.totalRecords;
        this.cd.detectChanges();        
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido cargando la informacion de Profesors.");
    }
  }

  public LoadPage($page: number):void{
    this.p =  $page;  
    this.GetProfesorPaginado(this.p, this.totalByPage);
  }

  onPageSizeChange() {
    this.p = 1;
    this.GetProfesorPaginado(this.p, this.totalByPage);
  }
  //#endregion
}