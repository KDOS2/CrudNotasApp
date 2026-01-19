import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChangeDetectorRef } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { GeneralResponse, GetModelError } from '../../Models/Generalresponse';
import { Modal } from '../../Modal/modal';
import { msgGeneral } from '../../Messages';
import { environment } from '../../environment';
import { NotaS } from '../../Services/nota';
import { NuevaNotaModel } from '../../Models/NotaModel';
import { Estudiante } from '../../Services/estudiante';
import { ProfesorS } from '../../Services/profesorS';
import { DirectiveNumber } from '../../number.directive';

@Component({
  selector: 'app-nota',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, NgxPaginationModule, Modal, DirectiveNumber],
  templateUrl: './nota.html',
  styleUrl: './nota.scss',
})


export class Nota implements OnInit {
  @ViewChild('modalInactive') modalInactive!: Modal;
  noteForm!: FormGroup;
  idNota:number = 0;
  idNumber:number = 0;
  nota:any[] = [];  
  estudiantes:any[] = [];
  profesores:any[] = [];
  
  messageConst = msgGeneral;
  totalByPage: number = environment.totalByPage;
  pageSizeOptions:number[] = environment.pageSizeOptions;
  totalitems:number=-1;
  p: number = 1;
  
  constructor(
    private fb: FormBuilder,
    private loader: NgxSpinnerService,
    private ntService: NotaS,
    private stService: Estudiante,
    private tcService: ProfesorS,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  //#region generic methods

  ngOnInit(): void {
    this.InitForm();
    this.GetnotasPaginado(this.p, this.totalByPage);
    this.GetProfesores();
    this.GetEstudiantes();
  }

  private InitForm(): void {
    this.noteForm = this.fb.group({
      valor: ['', Validators.required],
      idprofesor: ['', Validators.required],
      idestudiante: ['', Validators.required],
      nombre: ['', Validators.required],
      id: [0, Validators.required]      
    });
  }

  onSubmit(): void {
    if(this.noteForm.get('id')?.value == null || this.noteForm.get('id')?.value == '')
      this.NuevaNota();
    else
      this.ActualizarNota();
  }

  private ResponseProcess(data: GeneralResponse, isDelete:boolean=false): void {
    if (data.success) {
      if(isDelete)
          this.p = 1;
      
      this.CleanObject();
      this.modalInactive.show = false;
      this.GetnotasPaginado(this.p, this.totalByPage);
      this.toastr.success("Operación realizada exitosamente.");
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido.");
    }
  }  

  public CleanObject(){
    this.noteForm.reset();
    this.noteForm.patchValue({
      id:0      
    });
    this.idNota = 0;
  }

  private GetEstudiantes(): void {
    this.stService.GetEstudiantes().subscribe({
        next: (response: GeneralResponse) => {
          this.ResponseEstudiantes(response);
        },
        error: async (error: GetModelError) => {
          error.method = `GetnotasPaginado - ${error.method}`;
          this.toastr.error(error.message ?? this.messageConst.generalProblem);
        },
        complete: () => {
          console.info('<< GetnotasPaginado >>');          
        }
      });
  }

  private ResponseEstudiantes(data: GeneralResponse): void {
    if (data.success) {      
        this.estudiantes = data.data;
        this.cd.detectChanges();        
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido cargando la informacion de estudiantes.");
    }
  }

  private GetProfesores(): void {
    this.tcService.GetProfesores().subscribe({
        next: (response: GeneralResponse) => {
          this.ResponseProfesores(response);
        },
        error: async (error: GetModelError) => {
          error.method = `GetProfesores - ${error.method}`;
          this.toastr.error(error.message ?? this.messageConst.generalProblem);
        },
        complete: () => {
          console.info('<< GetProfesores >>');          
        }
      });
  }

  private ResponseProfesores(data: GeneralResponse): void {
    if (data.success) {      
        this.profesores = data.data;
        this.cd.detectChanges();        
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido cargando la informacion de profesores.");
    }
  }

  //#endregion

  //#region Nuevo nota Methods

  private NuevaNota(): void {
    this.loader.show();
    this.ntService.NuevaNota(this.SetNota()).subscribe({
      next: (response: GeneralResponse) => {
        this.ResponseProcess(response);
      },
      error: (error: GetModelError) => {
        error.method = `NuevaNota - ${error.method}`;
        this.loader.hide();
        this.toastr.error(error.message ?? this.messageConst.generalProblem);
      },
      complete: () => {
        console.info('<< NuevaNota >>');
        this.CleanObject();
        this.loader.hide();
      }
    });
  }

  private SetNota(): NuevaNotaModel {
    return {
      id:this.noteForm.get('id')?.value,
      nombre: this.noteForm.get('nombre')?.value,
      idEstudiante: this.noteForm.get('idestudiante')?.value,
      idProfesor: this.noteForm.get('idprofesor')?.value,
      valor: this.noteForm.get('valor')?.value
    };
  }

  //#endregion
  
  //#region Delete nota Methods
  public Inactivate(data:NuevaNotaModel):void{
    this.idNota = data.id ?? 0;
  }

  public async DeleteNota(): Promise<void> {
    this.loader.show();
    this.ntService.DeleteNota(this.idNota)
        .subscribe({next: async (resposeUser:GeneralResponse) => {  await this.ResponseProcess(resposeUser, true); },
                    error: async (error: GetModelError) => {
                      error.method = `Deletenota - ${error.method}`;                      
                      this.loader.hide();
                      this.toastr.error(this.messageConst.generalProblem);
                    },
                    complete: async () => { console.info('<< LOGUP >>'); this.loader.hide(); this.CleanObject(); }
    });
    
  }
  //#endregion

  //#region Update nota Methods
  public UpdateNota(data:NuevaNotaModel):void{
    this.noteForm.patchValue({
        id:data.id,
        nombre:data.nombre,
        valor: data.valor,
        idprofesor: data.idProfesor,
        idestudiante: data.idEstudiante      
    });    
  }

  private ActualizarNota(): void {
    this.loader.show();
    this.ntService.ActualiarNota(this.SetNota()).subscribe({
      next: (response: GeneralResponse) => {
        this.ResponseProcess(response);
      },
      error: (error: GetModelError) => {
        error.method = `ActualizarNota - ${error.method}`;
        this.loader.hide();
        this.toastr.error(error.message ?? this.messageConst.generalProblem);
      },
      complete: () => {
        console.info('<< ActualizarNota >>');
        this.CleanObject();
        this.loader.hide();
      }
    });
  }
  //#endregion

  //#region Get notas Paginado Methods
  private GetnotasPaginado(p:number, totalByPage:number): void {
    this.loader.show();
    this.ntService.GetNotaPaginado(p,totalByPage).subscribe({
        next: (response: GeneralResponse) => {
          this.ResponsenotasPaginado(response);
        },
        error: async (error: GetModelError) => {
          error.method = `GetnotasPaginado - ${error.method}`;
          this.loader.hide();
          this.toastr.error(error.message ?? this.messageConst.generalProblem);
        },
        complete: () => {
          this.loader.hide();
          console.info('<< GetnotasPaginado >>');          
        }
      });
  }

  private ResponsenotasPaginado(data: GeneralResponse): void {
    if (data.success) {      
        this.nota = data.data.items;
        this.totalitems = data.data.totalRecords;
        this.cd.detectChanges();        
    } else {
      this.toastr.error(data.error ?? "Se ha producido un error desconocido cargando la informacion de notas.");
    }
  }

  public LoadPage($page: number):void{
    this.p =  $page;  
    this.GetnotasPaginado(this.p, this.totalByPage);
  }

  onPageSizeChange() {
    this.p = 1;
    this.GetnotasPaginado(this.p, this.totalByPage);
  }
  //#endregion
}