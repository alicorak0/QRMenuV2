import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../services/asset-service';
@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-main-menu-component',
  templateUrl: './mainmenu-component.html',
  styleUrls: ['./mainmenu-component.css']
})




export class MainMenuComponent implements AfterViewInit {

  @ViewChild('bgVideo')
  bgVideo!: ElementRef<HTMLVideoElement>;
  
constructor(public asset: AssetService) {}

  ngAfterViewInit() {
    const vid = this.bgVideo.nativeElement;

    vid.muted = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.bgVideo.nativeElement.play().catch(() => { });
      });
    });

    const tryPlay = () => {
      vid.play().catch(() => {
        setTimeout(() => vid.play(), 300);
      });
    };

    if (vid.readyState >= 2) {
      tryPlay();
    } else {
      vid.onloadeddata = tryPlay;
    }

  }



}
