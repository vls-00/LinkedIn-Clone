import { Component, OnInit } from '@angular/core';
import {SharedService} from "../shared.service";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../model/user";
import {JobsService} from "./jobs.service";
import {Job} from "../model/job";
import {Observable} from "rxjs";
import {Post} from "../model/post";
import {JobLike} from "../model/joblike";
import {flatMap} from "rxjs/internal/operators";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  loading:boolean
  currentUser: number
  posted: boolean
  user: User
  requiredcondition:boolean;
  uploadcondition: boolean;
  dataLoaded: boolean;
  all_jobs: Job[];
  likedJobs: Map<Job, boolean>;

  jobForm = this.formBuilder.group({
    job_text: ''
  });

  constructor(private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private service: JobsService) {
    this.requiredcondition = false;
    this.posted = false;
    this.likedJobs = new Map();
  }

  async ngOnInit() {
    this.posted=false;
    this.dataLoaded=false;
    this.sharedService.curr_user.subscribe(user => this.currentUser=user);
    await this.service.getUser(this.currentUser).toPromise().then((response) => this.user = response);

    await this.service.getJobsBySkills(this.user.skills).toPromise().then(response => this.all_jobs=response);
    console.log(this.user.skills);
    var flag: boolean;
    for (let job of this.all_jobs){
      job.user.img = 'data:image/jpeg;base64,'+job.user.img.picByte;
      flag = false;
      console.log(job);
      var likes: JobLike[] = [];
      await this.service.getJobLikes(job.id).toPromise().then(response => likes=response);
      for (let like of likes) {
        console.log(like.id);
        if (like.user.id == this.currentUser) {
          this.likedJobs.set(job, true);
          flag=true;
          break;
        }
      }
      if (flag==false){
        this.likedJobs.set(job, false);
      }
    }
    // await this.webService.getFriends(this.currentUser).toPromise().then(friend => this.friends_=friend);
    // for(let friend of this.friends_){
    //   if(friend.user_one==this.currentUser)
    //     await this.service.getUser(friend.user_two).toPromise().then(user=>this.chat_users.push(user));
    //   else
    //     await this.service.getUser(friend.user_one).toPromise().then(user=>this.chat_users.push(user));
    // }
    // this.user=this.chat_users[0];
    // await this.openChat(this.chat_users[0].id);

    this.dataLoaded=true;
  }

  onSubmit(): void {
    console.log('on submit ' + this.jobForm.value.job_text);
    if(this.jobForm.value.job_text==="" || this.jobForm.value.job_text===null) {
      this.requiredcondition = true;
    }
    else {
      this.service.saveNewJob(this.jobForm.value.job_text,this.user).subscribe(data=>this.uploadcondition=true);
      this.jobForm.reset();
      this.posted=true;
    }
  }

  likeJob(job: Job): void{
    var jl = new JobLike();
    jl.job = job;
    jl.user = this.user;
    jl.createdDate = new Date();
    console.log(jl);
    this.service.saveLike(jl).subscribe((data=>console.log(data)));
    this.likedJobs.set(job,true);
  }


}
