import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChangeDetectorRef } from '@angular/core';
import { EstudianteModel } from '../../Models/EstudianteModel';
import { Estudiante } from '../../Services/estudiante';
import { GeneralResponse, GetModelError } from '../../Models/Generalresponse';
import { Modal } from '../../Modal/modal';
import { msgGeneral } from '../../Messages';
import { environment } from '../../environment';

@Component({
  selector: 'app-estuidiante',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, NgxPaginationModule, Modal],
  templateUrl: './estuidiante.html',
  styleUrl: './estuidiante.scss',
})


export class Estuidiante implements OnInit {
  @ViewChild('modalInactive') modalInactive!: Modal;
  studentForm!: FormGroup;
  idStudent:number = 0;
  idNumber:number = 0;
  estudiante:any[] = [];  
  
  messageConst = msgGeneral;
  totalByPage: number = environment.totalByPage;
  pageSizeOptions:number[] = environment.pageSizeOptions;
  totalitems:number=-1;
  p: number = 1;
  
  constructor(
    private fb: FormBuilder,
    private loader: NgxSpinnerService,
    private stService: Estudiante,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  //#region generic methods

  ngOnInit(): void {
    this.InitForm();
    this.GetEstudiantesPaginado(this.p, this.totalByPage);
  }

  private InitForm(): void {
    this.studentForm = this.fb.group({
      nombre: ['', Validators.required],
      id: [0]      
    });
  }

  onSubmit(): void {
    if(this.studentForm.get('id')?.value == null || this.studentForm.get('id')?.value == '')
      this.NuevoEstudiante();
    else
      this.ActualizarEstudiante();
  }

  private ResponseProcess(data: GeneralResponse, isDelete:boolean=false): void {
    if (data.success) {
      if(isDelete)
          this.p = 1;
      
      this.CleanObject();
      this.modalInactive.show = false;
      this.GetEstudiantesPaginado(this.p, this.totalByPage);
      this.toastr.success("Operación realizada exitosamente.");
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido.");
    }
  }  

  public CleanObject(){
    this.studentForm.reset();
    this.studentForm.patchValue({
      id: 0      
    });
    this.idStudent = 0;
    this.cd.detectChanges();
  }

  //#endregion

  //#region Nuevo Estudiante Methods

  private NuevoEstudiante(): void {
    this.loader.show();
    this.stService.NuevoEstudiante(this.SetEstudiante()).subscribe({
      next: (response: GeneralResponse) => {
        this.ResponseProcess(response);
      },
      error: (error: GetModelError) => {
        error.method = `NuevoEstudiante - ${error.method}`;
        this.loader.hide();
        this.toastr.error(error.message ?? this.messageConst.generalProblem);
      },
      complete: () => {
        console.info('<< NuevoEstudiante >>');
        this.CleanObject();
        this.loader.hide();
      }
    });
  }

  private SetEstudiante(): EstudianteModel {
    return {
      id: this.studentForm.get('id')?.value,
      nombre: this.studentForm.get('nombre')?.value
    };
  }

  //#endregion
  
  //#region Delete Estudiante Methods
  public Inactivate(data:EstudianteModel):void{
    this.idStudent = data.id ?? 0;
  }

  public async DeleteEstudiante(): Promise<void> {
    this.loader.show();
    this.stService.GetSDeleteEstudiante(this.idStudent)
        .subscribe({next: async (resposeUser:GeneralResponse) => {  await this.ResponseProcess(resposeUser, true); },
                    error: async (error: GetModelError) => {
                      error.method = `DeleteEstudiante - ${error.method}`;                      
                      this.loader.hide();
                      if(error.message.includes('ya cuenta con notas asignadas'))
                        this.toastr.error(error.message);
                      else  
                        this.toastr.error(this.messageConst.generalProblem);
                    },
                    complete: async () => { console.info('<< LOGUP >>'); this.loader.hide(); this.CleanObject(); }
    });
    
  }
  //#endregion

  //#region Update Estudiante Methods
  public UpdateEstudiante(data:EstudianteModel):void{
    this.studentForm.patchValue({
        id:data.id,
        nombre:data.nombre
    });    
  }

  private ActualizarEstudiante(): void {
    this.loader.show();
    this.stService.ActualiarEstudiante(this.SetEstudiante()).subscribe({
      next: (response: GeneralResponse) => {
        this.ResponseProcess(response);
      },
      error: (error: GetModelError) => {
        error.method = `ActualizarEstudiante - ${error.method}`;
        this.loader.hide();
        this.toastr.error(error.message ?? this.messageConst.generalProblem);
      },
      complete: () => {
        console.info('<< ActualizarEstudiante >>');
        this.CleanObject();
        this.loader.hide();
      }
    });
  }
  //#endregion

  //#region Get Estudiantes Paginado Methods
  public GetEstudiantesPaginado(p:number, totalByPage:number): void {
    this.loader.show();
    this.stService.GetEstudiantePaginado(p,totalByPage).subscribe({
        next: (response: GeneralResponse) => {
          this.ResponseEstudiantesPaginado(response);           
        },
        error: async (error: GetModelError) => {
          error.method = `GetEstudiantesPaginado - ${error.method}`;
          this.loader.hide();
          this.toastr.error(error.message ?? this.messageConst.generalProblem);
        },
        complete: () => {
          this.loader.hide();
          console.info('<< GetEstudiantesPaginado >>');          
        }
      });
  }

  private ResponseEstudiantesPaginado(data: GeneralResponse): void {
    if (data.success) {      
        this.estudiante = data.data.items;
        this.totalitems = data.data.totalRecords;
        this.cd.detectChanges();        
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido cargando la informacion de estudiantes.");
    }
  }

  public LoadPage($page: number):void{
    this.p =  $page;  
    this.GetEstudiantesPaginado(this.p, this.totalByPage);
  }

  onPageSizeChange() {
    this.p = 1;
    this.GetEstudiantesPaginado(this.p, this.totalByPage);
  }
  //#endregion
}