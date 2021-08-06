import { Component, OnInit } from '@angular/core';
import {User} from "../model/user";
import {Post} from "../model/post";
import {HomepageService} from "./homepage.service";
import {FormBuilder} from "@angular/forms";
import {SharedService} from "../shared.service";
import {Friends} from "../model/friends";
import {empty} from "rxjs/internal/Observer";
import {Likes} from "../model/likes";
import {Comment} from "../model/comment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {
  requiredcondition:boolean;
  loading:boolean;
  comments_loaded:boolean;
  uploaded:boolean;
  posts: Post[];
  html_posts: [Post,boolean][];
  friends: Friends[];
  currentuser:number;

  postForm = this.formBuilder.group({
    post_text: ''
  });

  constructor(private service: HomepageService,
              private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private router: Router) {
              this.requiredcondition = false;
              this.loading=false;
  }

  async ngOnInit(){
    this.sharedService.curr_user.subscribe(user => this.currentuser=user);
    this.loadPosts();
  }

  async loadPosts(){
    this.loading=true;
    let temp: Set<Post>;
    let temp_posts: Post[]=[];
    let likes:Likes[]=[];
    let temp_likes: Likes[]=[];
    let friend_likes:Likes[]=[];
    let likes_id:number[]=[];
    temp=new Set<Post>();
    this.html_posts=[];
    this.posts=[];

    await this.service.getPosts(this.currentuser).toPromise().then(post=>this.posts=post);
    await this.service.getFriends(this.currentuser).toPromise().then(response=> this.friends=response);

    //adding our friends' posts into the temporary post list
    for (let f of this.friends) {
      if (f.user_one == this.currentuser) {
        await this.service.getPosts(f.user_two).toPromise().then(response => temp_posts = response);
        await this.service.getUserLikes(f.user_two).toPromise().then(response => temp_likes = response)
      }
      else {
        await this.service.getPosts(f.user_one).toPromise().then(response => temp_posts = response);
        await this.service.getUserLikes(f.user_one).toPromise().then(response => temp_likes = response);
      }
      for(let p of temp_posts)
          temp.add(p)
      for(let l of temp_likes)
          friend_likes.push(l)
    }

    //adding the posts that our friends liked in the temporary post list
    for (let l of friend_likes)
      temp.add(l.post)

    //adding our posts in the temporary post list
    for(let p of this.posts)
      temp.add(p)

    //removing duplicates from temp post list and we keep only 1
    let dupl:number[]=[];
    let deleted:[number,number][]=[];
    let i:number;
    for(let p of temp){
      if(!dupl.includes(p.id))
        dupl.push(p.id)
      else {
        i=0
        for(let p2 of temp)
          if(p2.id==p.id)
            i++
        deleted.push([p.id,i-1])
      }
    }
    for(let d of deleted)
      for(let p of temp)
        if(d[0]==p.id){
          if(d[1]!=0) {
            temp.delete(p)
            d[1]--
          }
          else
            break
        }

    //adding the posts with the boolean indicator aside that shows if the user has liked the current post
    //so the html button will be disabled (you cannot like the same post more than 1 times)
    for (let p of temp) {
      likes_id=[];
      likes=[];
      await this.service.getPostLikes(p.id).toPromise().then(response=>likes=response);
      for(let l of likes)
        likes_id.push(l.user.id)
      if(likes_id.includes(this.currentuser))
        this.html_posts.push([p, true]);
      else
        this.html_posts.push([p, false]);
    }
    this.loading=false;
  }

  async submitPost() {
    this.loading=true;
    this.requiredcondition=false;
    this.uploaded=false;
    //checking if the post we try to upload is empty (you cannot upload an empty post)
    if(this.postForm.value.post_text==="" || this.postForm.value.post_text===null) {
      this.requiredcondition = true;
      this.loading=false;
      this.postForm.reset();
    }
    else {
      this.service.saveNewPost(this.postForm.value.post_text, this.currentuser).subscribe(data => console.log(data));
      await new Promise(f => setTimeout(f, 2000));
      this.postForm.reset();
      this.loading=false;
      this.uploaded=true;
    }
    await this.loadPosts();
  }

  async likePost(p:Post){
    this.loading=true;
    let l:Likes;
    l=new Likes();
    await this.service.getUser(this.currentuser).toPromise().then(response=>l.user=response)
    l.post=p;
    await this.service.saveLike(this.currentuser,l).toPromise().then(response=>console.log(response))
    this.loading=false;
    await this.loadPosts();
  }

  goToPost(id:number){
    this.router.navigate(['../posts/'+id]);
  }

}
