import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from '@techiediaries/ngx-qrcode';
import {MaterialTag} from 'src/app/models/materialtag.enum';
import {Material} from 'src/app/models/material';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterialsService} from 'src/app/services/materials.service';
import {Router} from '@angular/router';
import {IngredientService} from 'src/app/services/ingredient.service';
import {Ingredient} from 'src/app/models/ingredient';
import {MaterialIngredient} from 'src/app/models/material-ingredient';
import {SaveStatus} from 'src/app/models/save-status.enum';
import {MaterialType} from 'src/app/models/material-type.enum';
import {FileUploadComponent} from '../../file-upload/file-upload.component';
import {Tag} from '../../../models/tag';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfigService} from '../../../services/app-config.service';


@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.css'],
})
export class MaterialFormComponent implements OnInit {
  public readonly maximumSteps: number = Material.MAXIMUM_STEPS;
  public readonly maximumIngredients: number = Material.MAXIMUM_INGREDIENTS;
  public recipeTitle: string;
  public recipeAuthor: string;
  public recipeYear: string;
  public searchFailed = false;
  public materialTagValues: string[];
  public materialTagKeys: string[];
  public materialTypeValues: string[];
  public materialTypeKeys: string[];
  public tags: MaterialTag[]; // Selected tags for view
  public tagKeys: string[]; // Selected tags to be sent towards the API endpoint
  public steps: string[];
  public materialIngredients: MaterialIngredient[];
  public creationDate: Date;
  public sequenceNumber: string;
  public creationFailed = false;
  public saveStatus = SaveStatus;
  public user: User;
  public logoPath: string;
  protected parentId: number = null;
  public materials: Material[] = [];

  @ViewChild('overviewImg') overviewFileUpload: FileUploadComponent;
  @ViewChild('closeUpImg') closeUpFileUpload: FileUploadComponent;

  public elementType = NgxQrcodeElementTypes.URL;
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  public materialForm: FormGroup;
  public bitlyURL: string;

  constructor(protected materialService: MaterialsService, protected ingredientService: IngredientService,
              protected router: Router, protected userService: UserService, protected authService: AuthService,
              protected snackBar: MatSnackBar, protected configService: AppConfigService) {
    this.tags = [];
    this.tagKeys = [];
    this.steps = [];
    this.materialIngredients = [];
    this.creationDate = new Date();

    this.configService.getAll().subscribe(config => {
      this.logoPath = config.logo_path;
    });
  }

  ngOnInit(): void {
    const whitespaceCheck: RegExp = new RegExp('\\S');

    this.materialForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(25),
        Validators.pattern(whitespaceCheck)]),
      'url': new FormControl(null, this.validURL.bind(this)),
      'step': new FormControl(null, this.emptySteps.bind(this)),
      'changes': new FormControl(null, [Validators.required, Validators.pattern(whitespaceCheck),
        Validators.maxLength(200)]),
      'sequenceNumber': new FormControl(null),
      'variationOn': new FormControl(false),
      'referenceAuthor': new FormControl(null, [Validators.required, Validators.pattern(whitespaceCheck)]),
      'referenceTitle': new FormControl(null, [Validators.required, Validators.pattern(whitespaceCheck)]),
      'referenceYear': new FormControl(null, [Validators.required, Validators.pattern(new RegExp('\\d')),
        Validators.minLength(4)]),
      'ingredient': new FormControl(null, this.emptyIngredients.bind(this)),
      'ingredientType': new FormControl(null),
      'amount': new FormControl(null, Validators.pattern('^[0-9]*$')),
      'status': new FormControl(SaveStatus.DRAFT, Validators.required),
      'type': new FormControl(null, Validators.required)
    });

    this.setVariationOnValidators();

    this.materialTagValues = Object.values(MaterialTag);
    this.materialTagKeys = Object.keys(MaterialTag);
    this.materialTypeValues = Object.values(MaterialType);
    this.materialTypeKeys = Object.keys(MaterialType);

    this.userService.getUserProfile(this.authService.currentUser.getId()).subscribe(user => {
      this.user = Object.assign(new User(), user);
    });
  }

  private setVariationOnValidators(): void {
    this.materialForm.get('variationOn').valueChanges.subscribe(required => {
      const sequenceNumberControl: AbstractControl = this.materialForm.get('sequenceNumber');
      const referenceAuthorControl: AbstractControl = this.materialForm.get('referenceAuthor');
      const referenceTitleControl: AbstractControl = this.materialForm.get('referenceTitle');
      const referenceYearControl: AbstractControl = this.materialForm.get('referenceYear');

      sequenceNumberControl.setValidators(null);
      referenceAuthorControl.setValidators(Validators.required);
      referenceTitleControl.setValidators(Validators.required);
      referenceYearControl.setValidators([Validators.required, Validators.pattern(new RegExp('\\d')), Validators.minLength(4)]);

      if (required) {
        sequenceNumberControl.setValidators([Validators.required]);
        referenceAuthorControl.setValidators(null);
        referenceTitleControl.setValidators(null);
        referenceYearControl.setValidators(null);
      }

      sequenceNumberControl.updateValueAndValidity();
      referenceAuthorControl.updateValueAndValidity();
      referenceTitleControl.updateValueAndValidity();
      referenceYearControl.updateValueAndValidity();
    });
  }

  public onSubmit(): void {
    if (!this.materialForm.valid && this.materialForm.get('status').value === 'Published') {
      this.materialForm.markAllAsTouched();

      this.snackBar.open('Oops something went wrong :( Check all the fields for errors ', 'Close', {
        duration: 20000,
        horizontalPosition: 'center', verticalPosition: 'bottom'
      });

      return;
    }

    let changes = "No changes";
    if (this.materialForm.get('changes').value != null) {
      changes = this.materialForm.get('changes').value.trim();
    }
    let reference = `By ${this.recipeAuthor} - ${this.recipeTitle} - ${this.recipeYear}`;

    if (!this.materialForm.get('variationOn').value) {
      if (this.materialForm.get('referenceAuthor').value != null || this.materialForm.get('referenceTitle').value != null) {
        reference = `By ${this.materialForm.get('referenceAuthor').value.trim()} - ${this.materialForm.get('referenceTitle').value.trim()} - ${this.materialForm.get('referenceYear').value}`;
      } else {
        reference = "No references"
      }
      this.parentId = null;
    }

    const tags: Tag[] = [];

    this.tagKeys.forEach(value => {
      const tag: Tag = new Tag((Object.keys(MaterialTag).indexOf(value) + 1), value);
      tags.push(tag);
    });

    if (this.bitlyURL == null) {
      this.bitlyURL = 'No link added';
    }

    let title = "Untitled";
    if (this.materialForm.get('title').value != null) {
      title = this.materialForm.get('title').value.trim();
    }

    if (this.steps.length == 0) {
      this.steps.push("No Steps added yet")
    }

    const material: Material = new Material(0, title,
      changes, this.steps.join('|'), this.bitlyURL, tags, this.materialIngredients,
      this.materialForm.get('status').value, this.materialForm.get('type').value, this.user, this.parentId, reference);

    material.setOverviewURL(this.overviewFileUpload.mediaDataURL);
    material.setCloseUpURL(this.closeUpFileUpload.mediaDataURL);

    let publishedSequenceNumbers = [];
    let sequenceNumberPublished = 0;

    this.materialService.getAll().subscribe(materials => {
      materials.forEach((material) => {
        const currentMaterial: Material = Material.trueCopy(material);

        // Only display PUBLISHED labels
        if (currentMaterial.getSaveStatus() === SaveStatus.PUBLISHED) {
          this.materials.push(currentMaterial);
        }
      });

      this.materials.forEach(material => {publishedSequenceNumbers.push(material.getSequenceNumberPublished())});

      sequenceNumberPublished = (Math.max.apply(Math, publishedSequenceNumbers))+1;

      if (!isFinite(sequenceNumberPublished)) {
        sequenceNumberPublished = 1;
      }
      material.setSequenceNumberPublished(sequenceNumberPublished);

      this.materialService.save(material).subscribe(data => {
        this.creationFailed = false;
        this.router.navigate(['/home']);
      }, error => {
        console.log(error);
        this.creationFailed = true;
      });
    });
  }

  public validURL(control: FormControl): { [s: string]: boolean } {
    if (!control.value) {
      return {'urlIsEmpty': true};
    }

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const result = control.value.match(reg);

    if (!result) {
      return {'urlIsInvalid': true};
    }

    if (!this.bitlyURL) {
      return {'bitlyNotCreated': true};
    }

    if (this.bitlyURL !== control.value) {
      return {'valuesNotEqual': true};
    }

    return null;
  }

  public emptySteps(control: FormControl): { [s: string]: boolean } {
    if (this.steps.length === 0) {
      return {'stepsIsEmpty': true};
    }

    return null;
  }

  public emptyIngredients(control: FormControl): { [s: string]: boolean } {
    if (this.materialIngredients.length === 0) {
      return {'ingredientsIsEmpty': true};
    }

    return null;
  }

  public generateQRCode(): void {
    const urlControl: AbstractControl = this.materialForm.get('url');

    // Check if URL is valid
    if (!urlControl.errors.urlIsInvalid || !urlControl.errors.valuesNotEqual) {
      this.materialService.createBitlyLinkFromURL(urlControl.value).subscribe(
        data => {
          this.bitlyURL = data.link;
          urlControl.reset();
          urlControl.setValue(data.link);
        }
      );
    } else {
      this.bitlyURL = null;
    }
  }

  public updateTags(event: any, data: string): void {
    if (event.target.checked) {
      this.tags.push(MaterialTag[data]);
      this.tagKeys.push(data);
    } else {
      const removeIndexValues = this.tags.findIndex(item => item === MaterialTag[data]);
      const removeIndexKeys = this.tagKeys.findIndex(item => item === data);

      // Make sure a tag has been found in the array
      if (removeIndexValues !== -1) {
        this.tags.splice(removeIndexValues, 1);
      }

      if (removeIndexKeys !== -1) {
        this.tagKeys.splice(removeIndexKeys, 1);
      }
    }
  }

  public addStep(): void {
    const stepControl: AbstractControl = this.materialForm.get('step');

    if (stepControl.value && this.steps.length < this.maximumSteps) {
      this.steps.push(stepControl.value.trim());
      stepControl.reset();
    }
  }

  public addIngredient(): void {
    const ingredientControl: AbstractControl = this.materialForm.get('ingredient');
    const amountControl: AbstractControl = this.materialForm.get('amount');
    const ingredientTypeControl: AbstractControl = this.materialForm.get('ingredientType');

    const typeValue = ingredientTypeControl.value ? ingredientTypeControl.value.trim() : null;

    const selectedIngredient = new Ingredient(0, ingredientControl.value.trim(), typeValue);
    // Add ingredient when value has been set
    if (selectedIngredient != null && ingredientControl.value && amountControl.value
      && this.materialIngredients.length < this.maximumIngredients) {
      const materialIngredient: MaterialIngredient = new MaterialIngredient(selectedIngredient, amountControl.value);

      this.materialIngredients.push(materialIngredient);

      ingredientControl.reset();
      amountControl.reset();
      ingredientTypeControl.reset();
    }
  }

  public removeFromList(data: string): void {
    const removeIndex = this.steps.findIndex(item => item === data);

    if (removeIndex !== -1) {
      this.steps.splice(removeIndex, 1);
    }

    this.materialForm.get('step').reset();
  }

  public removeFromMaterialIngredients(ingredient: Ingredient): void {
    const removeIndex = this.materialIngredients.findIndex(item => item.getIngredient() === ingredient);

    if (removeIndex !== -1) {
      this.materialIngredients.splice(removeIndex, 1);
    }
  }

  public onSequenceNumberSearch(): void {
    const seqNumberControl: AbstractControl = this.materialForm.get('sequenceNumber');

    if (isNaN(seqNumberControl.value)) {
      this.searchFailed = true;
      return;
    }

    this.materialService.getBySequenceNumber(Number(seqNumberControl.value)).subscribe(
      data => {
        this.searchFailed = true;
        this.recipeTitle = '';
        this.recipeAuthor = '';

        if (data) {
          this.searchFailed = false;
          const foundMaterial: Material = Material.trueCopy(data);
          this.parentId = foundMaterial.getSequenceNumber();
          const author = User.trueCopy(foundMaterial.getUser());
          this.recipeTitle = foundMaterial.getName();
          this.recipeAuthor = `By ${author.getFirstname()} ${author.getLastname()}`;
          this.recipeYear = new Date(foundMaterial.getCreationDate()).getFullYear().toString();
        } else {
          seqNumberControl.reset();
        }
      },
      error => {
        this.searchFailed = true;
        seqNumberControl.reset();
      }
    );
  }
}
