import { Routes } from '@angular/router';
import { Estuidiante  } from './Components/estuidiante/estuidiante';
import { Profesor } from './Components/profesor/profesor';
import { Nota } from './Components/nota/nota';
import { Home } from './Components/home/home';

export const routes: Routes = [
    { path: 'estudiante', component: Estuidiante },
    { path: 'profesor', component: Profesor },
    { path: 'nota', component: Nota },
    {path: '', component: Home}
];
