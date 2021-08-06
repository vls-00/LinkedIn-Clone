import { BrowserModule} from '@angular/platform-browser';
import { RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { UserService} from './user/user.service';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import {LoginService} from "./login/login.service";
import { AdminHomepageComponent } from './admin-homepage/admin-homepage.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {AuthGuard} from "./guards/auth.guard";
import { ErrorInterceptor} from './helpers/error.interceptor';
import { JwtInterceptor} from './helpers/jwt.interceptor';
import {RegisterService} from "./register/register.service";
import {HomepageService} from "./homepage/homepage.service";
import { MywebComponent } from './myweb/myweb.component';
import { InfoComponent } from './info/info.component';
import { EditComponent } from './info/edit/edit.component';
import { SearchComponent } from './myweb/search/search.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import {SettingsComponent} from "./settings/settings.component";
import { ChatComponent } from './chat/chat.component';
import { JobsComponent } from './jobs/jobs.component';
import { PostsComponent } from './posts/posts.component';


const appRoutes: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'login', children: [{path: '', component: LoginComponent},{path: 'register', redirectTo: '/register', pathMatch: 'full'}]},
  {path: 'home', component: HomepageComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'myweb', children:[{path: '', component: MywebComponent} , {path:'search',component: SearchComponent}]},
  {path: 'admin', component: AdminHomepageComponent/**, canActivate: [AuthGuard]*/},
  {path: 'settings', component: SettingsComponent },
  {path: 'info', children: [{path: '', component: InfoComponent}, {path: 'edit', component: EditComponent}]},
  {path: 'jobs', component: JobsComponent},
  {path: ':id', component: UserinfoComponent},
  {path: 'users', component: UserComponent},
  {path: 'posts', children:[{path:'',component: HomepageComponent},{path: ':id',component: PostsComponent}]}]

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    LoginComponent,
    HomepageComponent,
    RegisterComponent,
    AdminHomepageComponent,
    InfoComponent,
    EditComponent,
    WelcomeComponent,
    MywebComponent,
    SearchComponent,
    UserinfoComponent,
    SettingsComponent,
    ChatComponent,
    JobsComponent,
    PostsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [
    UserService,
    LoginService,
    RegisterService,
    HomepageService,
/**{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
