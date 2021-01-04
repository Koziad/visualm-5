import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {NgForm, NgModel} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {User} from '../../models/user';
import {ProfilePictureUploadComponent} from './profile-picture-upload/profile-picture-upload.component';
import {ImageCroppedEvent, ImageTransform} from 'ngx-image-cropper';
import {Material} from '../../models/material';
import {SaveStatus} from '../../models/save-status.enum';
import {MaterialsService} from '../../services/materials.service';
import {MaterialTag} from '../../models/materialtag.enum';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],

})

export class ProfileComponent implements OnInit {
  materials: Material[] = [];
  materialTag = MaterialTag;
  user: User;
  email: string = '';
  edit: any;
  isHidden: boolean = false;
  popupHidden: boolean = true;
  public creationFailed = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropReady: boolean = false;
  loadingDone: boolean = false;
  loadingMaterialsDone: boolean = false;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  transform: ImageTransform = {};
  private paramSubscription: Subscription = null;
  notLoggedinUser:boolean = false;

  @ViewChild('file') pictureUploadComponent: ProfilePictureUploadComponent;

  constructor(private userService: UserService, private router: Router, private materialService: MaterialsService,
              private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.edit = {
      'firstname': '',
      'lastname': '',
      'organisation': ''
    };
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.getUserProfile();
    this.getUserLabels();
  }

  onClick(): void {
    if (this.email === '') {
      this.email = this.user.getEmail();
    } else {
      this.email = '';
    }
  }

  onEdit(): void {
    if (this.isHidden) {
      this.isHidden = false;
    } else {
      this.isHidden = true;
      this.edit.firstname = this.user?.getFirstname();
      this.edit.lastname = this.user?.getLastname();
      this.edit.organisation = this.user?.getOrganisation();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onSubmit(f: NgForm) {
    if (!f.valid) {
      return;
    }

    const user: User = Object.assign(new User(this.user.getEmail(), '', this.user.getId(), this.edit.firstname, this.edit.lastname,
      this.user.getOrganisation(), this.user.isAdmin(), this.user.isVerified()));

    if (this.pictureUploadComponent.mediaDataURL && this.cropReady) {
      user.setMediaURL(this.croppedImage);
    }

    this.userService.updateUserProfile(this.user.getId(), user).subscribe(data => {

      this.creationFailed = false;
      this.isHidden = false;
      this.popupHidden = true;

      this.getUserProfile();
    }, error => {
      this.creationFailed = true;
      console.log(error);
    });

  }

  getUserProfile(): void {
    this.paramSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
          this.userService.getUserProfile(params.id).subscribe(data => {
            if (data) {
              this.loadingDone = true;
            }
            this.notLoggedinUser = params.id != this.user.getId();
            this.user = Object.assign(new User(), data);
            this.userService.updatedUser.next(this.user);
          }, error => {
            if (error.status === 404) {
              this.router.navigate(['/not-found']);
            }
          });
      } else {
        this.notLoggedinUser = false;
        this.userService.getUserProfile(this.user.getId()).subscribe(data => {
          if (data) {
            this.loadingDone = true;
          }
          this.user = Object.assign(new User(), data);
          this.userService.updatedUser.next(this.user);
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      if (error.status === 404) {
        this.router.navigate(['/not-found']);
      }
    });
  }

  getUserLabels(): void {
    this.paramSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.materialService.getMaterialByUser(params.id).subscribe(materials => {
          materials.forEach((material) => {
            const currentMaterial: Material = Material.trueCopy(material);

            if (materials) {
              this.loadingMaterialsDone = true;
            }

            if (currentMaterial.getSaveStatus() === SaveStatus.PUBLISHED) {
              this.materials.push(currentMaterial);
            }
          });
        });
      } else {
        this.materialService.getMaterialByUser(this.user.getId()).subscribe(materials => {
          materials.forEach((material) => {
            const currentMaterial: Material = Material.trueCopy(material);

            if (materials) {
              this.loadingMaterialsDone = true;
            }

            this.materials.push(currentMaterial);
          });
        });
      }
    }, error => {
      if (error.status === 404) {
        this.router.navigate(['/not-found']);
      }
    });
  }

  onOpenCrop(): void {
    this.popupHidden = false;
  }

  onSelectCrop(): void {
    this.popupHidden = true;
  }

  onCloseCrop(): void {
    this.popupHidden = true;
    this.cropReady = false;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  imageLoaded(): void {
  }

  cropperReady(): void {
    this.cropReady = true;
  }

  loadImageFailed(): void {
    // show message
  }

  rotateLeft(): void {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight(): void {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate(): void {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal(): void {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical(): void {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut(): void {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn(): void {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  updateRotation(): void {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }
}

