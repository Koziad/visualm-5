import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MaterialsService} from '../../../services/materials.service';
import {Subscription} from 'rxjs';
import {Material} from '../../../models/material';
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from '@techiediaries/ngx-qrcode';
import {User} from '../../../models/user';
import {MaterialType} from '../../../models/material-type.enum';
import {MaterialTag} from '../../../models/materialtag.enum';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {AuthService} from '../../../services/auth.service';
import {SaveStatus} from '../../../models/save-status.enum';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ReportService} from '../../../services/report.service';
import {Report} from '../../../models/report';
import {AppConfigService} from '../../../services/app-config.service';
import {MaterialIngredient} from '../../../models/material-ingredient';
import {Ingredient} from '../../../models/ingredient';
import {isElementScrolledOutsideView} from '@angular/cdk/overlay/position/scroll-clip';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit, OnDestroy {
  users: User;
  public material: Material;
  public parentMaterial: Material;
  public parentAuthor: User;
  private paramSubscription: Subscription = null;
  public steps: string[];
  public user: User;
  status: string [] = ['a4', 'a5', 'a6'];
  public materialType = MaterialType;
  public materialTag = MaterialTag;
  isHidden: boolean = true;
  public selectedFormat: string;
  public canGeneratePDF = false;
  public canDuplicate = false;
  public canReport = false;
  loadingDone: boolean = false;
  public reportMessage: string;
  public ratio: string;

  public elementType = NgxQrcodeElementTypes.URL;
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  canEdit = true;
  public logoPath: string;

  constructor(private router: Router, private materialService: MaterialsService, private activatedRoute: ActivatedRoute,
              private authService: AuthService, private snackBar: MatSnackBar, private reportService: ReportService,
              private configService: AppConfigService) {
    this.configService.getAll().subscribe(config => {
      this.logoPath = config.logo_path;
    });
  }

  ngOnInit(): void {
    this.paramSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params.sequence_number) {
        this.materialService.getBySequenceNumber(params.sequence_number).subscribe(material => {
          this.material = Material.trueCopy(material);

          if (material) {
            this.loadingDone = true;
          }

          // Remove display of edit button if label already published
          if (this.material.getSaveStatus() === SaveStatus.PUBLISHED && !this.authService.isAdmin()) {
            this.canEdit = false;
          }

          this.steps = this.material.getSteps().split('|');
          this.user = Object.assign(new User(), this.material.getUser());

          // Be sure to check this only when a user is logged in
          if (this.authService.isLoggedIn()) {
            this.canDuplicate = true;
            this.canGeneratePDF = (this.user.getId() === this.authService.currentUser.getId()) || this.authService.currentUser.isAdmin();
            this.canReport = (this.user.getId() !== this.authService.currentUser.getId());
          }

          if (this.material.getParentId()) {
            this.materialService.getBySequenceNumber(this.material.getParentId()).subscribe(parentMaterial => {
              this.parentMaterial = Material.trueCopy(parentMaterial);
              this.parentAuthor = User.trueCopy(this.parentMaterial.getUser());

            });
          }
          this.calculateRatio();
        }, error => {
          if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        });
      }
    });
  }

  calculateRatio(): void {
    let totalVolume = 0;
    this.ratio = "Ratio of ";

    for (let i = 0; i < this.material.getMaterialIngredients().length; i++) {
      const currentMaterialIngredient: MaterialIngredient = Object.assign(new MaterialIngredient(), this.material.getMaterialIngredients()[i]);
      totalVolume += currentMaterialIngredient.getAmount();
    }

      let partOfRatio = totalVolume/100;

    for (let i = 0; i < this.material.getMaterialIngredients().length; i++) {
      const currentMaterialIngredient: MaterialIngredient = Object.assign(new MaterialIngredient(), this.material.getMaterialIngredients()[i]);
      const currentIngredient: Ingredient = Object.assign(new Ingredient(), currentMaterialIngredient.getIngredient());
      this.ratio += currentIngredient.getName() + " " + (Math.round(((currentMaterialIngredient.getAmount()/partOfRatio) + Number.EPSILON) * 100) / 100) + "%: "
    }

    this.ratio += "by weight";
  }

  onSelect(value): void {
    this.selectedFormat = value;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  generatePdf(): void {
    const title = this.material.getName();
    const sequenceNr = this.material.getSequenceNumber();
    const data = window.document.getElementById('pdfLabel');
    data.style.display = 'block';

    html2canvas(data, {
      scale: 2
    }).then(canvas => {
      data.style.display = 'none';
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', this.selectedFormat);
      pdf.addImage(contentDataURL, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      if (this.selectedFormat === 'a4' || this.selectedFormat == null) {
        // crop mark links boven
        pdf.line(10, 0, 10, 7); // vertical
        pdf.line(0, 10, 7, 10); // horizontal

        // crop mark rechts boven
        pdf.line(200, 0, 200, 7); // vertical
        pdf.line(203, 10, 210, 10); // horizontal

        // crop mark links onder
        pdf.line(10, 291, 10, 300); // vertical
        pdf.line(0, 288, 7, 288); // horizontal

        // crop mark rechts onder
        pdf.line(200, 291, 200, 300); // vertical
        pdf.line(203, 288, 210, 288); // horizontal

        pdf.setLineDashPattern([0.5, 0.5], 0);
        pdf.setDrawColor(211,211,211);
        pdf.line(16, 50, 200, 50); //1st line
        pdf.line(16, 90, 200, 90); // 2nd line
        pdf.line(16, 100, 200, 100); // 3rd line
        pdf.line(79.4, 116, 136, 116); // 4th horizontal line
        pdf.line(78.2, 100, 79.4, 116); // left vertical line
        pdf.line(137.2, 100, 136, 116); // right vertical line
      }

      if (this.selectedFormat === 'a5') {
        // crop mark links boven
        pdf.line(7, 0, 7, 5.5); // vertical
        pdf.line(0, 7, 5, 7); // horizontal

        // crop mark rechts boven
        pdf.line(141, 0, 141, 5.5); // vertical
        pdf.line(143.5, 7, 148, 7); // horizontal

        // crop mark links onder
        pdf.line(7, 206, 7, 212); // vertical
        pdf.line(0, 204, 5, 204); // horizontal

        // crop mark rechts onder
        pdf.line(141, 206, 141, 212); // vertical
        pdf.line(143.5, 204, 148, 204); // horizontal

        pdf.setLineDashPattern([0.5, 0.5], 0);
        pdf.setDrawColor(211,211,211);
        pdf.line(13, 35, 138, 35); //1st line
        pdf.line(13, 62, 138, 62); // 2nd line
        pdf.line(13, 70, 138, 70); // 3rd line
        pdf.line(54.8, 84, 99.2, 84); // 4th horizontal line
        pdf.line(54, 70, 54.8, 84); // left vertical line
        pdf.line(100, 70, 99.2, 84); // right vertical line
      }

      if (this.selectedFormat === 'a6') {
        // crop mark links boven
        pdf.line(5, 0, 5, 3.7); // vertical
        pdf.line(0, 5, 3.5, 5); // horizontal

        // crop mark rechts boven
        pdf.line(100, 0, 100, 3.7); // vertical
        pdf.line(101.5, 5, 105, 5); // horizontal

        // crop mark links onder
        pdf.line(5, 145, 5, 149); // vertical
        pdf.line(0, 143.5, 3.5, 143.5); // horizontal

        // crop mark rechts onder
        pdf.line(100, 145, 100, 149); // vertical
        pdf.line(101.5, 143.5, 105, 143.5); // horizontal

        pdf.setLineDashPattern([0.5, 0.5], 0);
        pdf.setDrawColor(211,211,211);
        pdf.line(10, 25, 98, 25); //1st line
        pdf.line(10, 44, 98, 44); // 2nd line
        pdf.line(10, 48.5, 98, 48.5); // 3rd line
        pdf.line(40, 56, 69.2, 56); // 4th horizontal line
        pdf.line(39.5, 48.5, 40, 56); // left vertical line
        pdf.line(69.7, 48.5, 69.2, 56); // right vertical line
      }

      pdf.save(title + ' ' + sequenceNr);
    });
  }

  onReport() {
    const report: Report = new Report(0, this.reportMessage, false, this.authService.currentUser, this.material);

    this.reportService.save(report).subscribe(data => {
    }, error => {
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }
}
