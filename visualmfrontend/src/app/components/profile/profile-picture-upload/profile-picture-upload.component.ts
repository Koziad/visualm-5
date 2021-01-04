import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-picture-upload',
  templateUrl: './profile-picture-upload.component.html',
  styleUrls: ['./profile-picture-upload.component.css']
})
export class ProfilePictureUploadComponent implements OnInit {

  // 20MB in bytes
  private static readonly MAX_SIZE: number = 20000000;
  private static readonly WHITELIST: [string, string, string] = ["jpg", "png", "jpeg"];
  public mediaDataURL: string;
  private valid: boolean;
  private errorMessage: string;
  private fileName: string;

  constructor() {
    this.valid = true;
    this.fileName = "";
  }

  ngOnInit(): void {
  }

  public handleFileUpload(files: FileList) {
    const file: File = files.item(0);

    if (this.validate(file)) {
      this.fileName = file.name;

      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.mediaDataURL = reader.result.toString();
      }
    }
  }

  private validate(file: File): boolean {
    const fileType: string = file.type.split("/")[1];

    this.valid = true;
    this.errorMessage = "";

    if (file.size > ProfilePictureUploadComponent.MAX_SIZE) {
      this.valid = false;
      this.errorMessage = "File size cannot exceed 20MB.";
    }

    if (!ProfilePictureUploadComponent.WHITELIST.includes(fileType)) {
      this.valid = false;
      this.errorMessage = `File cannot be of type: ${fileType}`;
    }

    return this.valid;
  }

  public isValid(): boolean {
    return this.valid;
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public getFileName(): string {
    return this.fileName;
  }
}
