import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {MaterialsService} from '../../services/materials.service';
import {Material} from '../../models/material';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Report} from '../../models/report';
import {ReportService} from '../../services/report.service';
import {MaterialIngredient} from '../../models/material-ingredient';
import {Tag} from '../../models/tag';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {AppConfigService} from '../../services/app-config.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
  public users: User[] = [];
  public materials: Material[] = [];
  public matchingMaterials: Material[] = [];
  public reports: Report[] = [];
  materialDataSource: MatTableDataSource<Material>;
  materialColumns: string[] = ['sequenceNumber', 'name', 'saveStatus', 'creationDate','user', 'action'];
  materialDataColumns: string[] = this.materialColumns;
  userDataSource: MatTableDataSource<User>;
  userColumns: string[] = ['id', 'email', 'name', 'action'];
  userDataColumns: string[] = this.userColumns;
  reportDataSource: MatTableDataSource<Report>;
  reportColumns: string[] = ['id', 'message', 'user', 'solved', 'action'];
  reportDataColumns: string[] = this.reportColumns;
  isHidden: boolean = false;
  popupHidden: boolean = true;
  edit: any;
  add: any;
  config: any;
  user: User;
  updateFailed: boolean = false;
  selectedProfile: any;
  adminSelected: boolean = false;
  emailVerified: boolean = false;
  solved: boolean = false;
  popupAddUserHidden: boolean = true;
  popupImportExportHidden: boolean = true;
  public selectedId: number;
  deletePopup: boolean = false;
  deleteSelected: any;

  @ViewChild('paginatorMaterial') paginatormaterial: MatPaginator;
  @ViewChild('paginatorUser') paginatorUser: MatPaginator;
  @ViewChild('paginatorReport') paginatorReport: MatPaginator;

  @ViewChild('sortMaterial') sortMaterial: MatSort;
  @ViewChild('sortUser') sortUser: MatSort;
  @ViewChild('sortReport') sortReport: MatSort;

  @ViewChild(MatTableDataSource, {static: true}) table: MatTableDataSource<any>;

  constructor( private materialsService: MaterialsService, private userService: UserService,
              private router: Router, public dialog: MatDialog, private authService: AuthService, private reportService: ReportService,
              private configService: AppConfigService, private snackBar: MatSnackBar) {
    this.config = {
      email_suffix: '',
      organisation: '',
      logo_path: ''
    };
  }

  ngOnInit(): void {
    this.edit = {
      'firstname': '',
      'lastname': '',
      'organisation': ''
    };
    this.add = {
      'firstname': '',
      'lastname': '',
      'password': '',
      'passwordRepeat': '',
      'organisation': ''
    };

     this.getUserProfile();

    this.userService.getAll().subscribe(users => {
      users.forEach((user) => {
        const currentUser: User = Object.assign(new User(), user);
        this.users.push(currentUser);

      });
      this.userDataSource = new MatTableDataSource<User>(this.users);
      this.userDataSource.paginator = this.paginatorUser;
      this.userDataSource.sort = this.sortUser;
    });



    this.materialsService.getAll().subscribe(materials => {
      materials.forEach((material) => {
        const currentMaterial: Material = Object.assign(new Material(), material);
        this.materials.push(currentMaterial);
      });

      this.materialDataSource = new MatTableDataSource<Material>(this.materials);
      this.materialDataSource.paginator = this.paginatormaterial;
      this.materialDataSource.sort = this.sortMaterial;
    });

    this.reportService.getAll().subscribe(reports => {
      reports.forEach((report) => {
        const currentReport: Report = Object.assign(new Report(), report);
        this.reports.push(currentReport);
      });

      this.reportDataSource = new MatTableDataSource<Report>(this.reports);
      this.reportDataSource.paginator = this.paginatorReport;
      this.reportDataSource.sort = this.sortReport;
    });

    // Load saved settings from db
    this.configService.getAll().subscribe(config => {
      this.config.email_suffix = config.email_suffix;
      this.config.organisation = config.organisation;
      this.config.logo_path = config.logo_path;
    });

  }

  onDeletePopup(element): void {
    this.deleteSelected = element
    this.deletePopup = true;
  }

  onDelete(): void {

    if (this.deleteSelected instanceof Material) {
      this.materialsService.delete(this.deleteSelected.getSequenceNumber());
      this.materialDataSource.data.splice(this.materialDataSource.data.indexOf(this.deleteSelected), 1);
      this.materialDataSource._updateChangeSubscription();
      this.deletePopup = false;
    }
    if (this.deleteSelected instanceof User) {
      this.userService.delete(this.deleteSelected.getId());
      this.userDataSource.data.splice(this.userDataSource.data.indexOf(this.deleteSelected), 1);
      this.userDataSource._updateChangeSubscription();
      this.deletePopup = false;
    }
    if (this.deleteSelected instanceof Report) {
      this.reportService.delete(this.deleteSelected.getId());
      this.reportDataSource.data.splice(this.reportDataSource.data.indexOf(this.deleteSelected), 1);
      this.reportDataSource._updateChangeSubscription();
      this.deletePopup = false;
    }
  }

  onEditUserClick(element): void {
    this.edit.email = element.getEmail();
    this.edit.firstname = element.getFirstname();
    this.edit.lastname = element.getLastname();
    this.edit.organisation = element.getOrganisation();
    this.popupHidden = false;
    this.selectedProfile = element;
    this.adminSelected = this.selectedProfile.isAdmin();
    this.emailVerified = this.selectedProfile.isVerified();
  }

  onAddUserClick(): void {
    this.popupAddUserHidden = false;
  }

  closePopup(): void {
    this.popupHidden = true;
    this.popupImportExportHidden = true;
    this.popupAddUserHidden = true;
    this.deletePopup = false;
  }

  onEditUser(f: NgForm): void {
    if (!f.valid) {
      return;
    }

    if (this.selectedProfile instanceof User) {
      const user: User = Object.assign(new User(this.edit.email, '', this.selectedProfile.getId(), this.edit.firstname, this.edit.lastname, this.edit.organisation, this.adminSelected, this.emailVerified));
      this.userService.updateUserProfile(this.selectedProfile.getId(), user).subscribe(data => {

        this.userDataSource.data[this.userDataSource.data.indexOf(this.selectedProfile)] = user;
        this.userDataSource._updateChangeSubscription();
        this.updateFailed = false;
        this.popupHidden = true;

      }, error => {
        this.updateFailed = true;
        this.popupHidden = true;
      });
    }
  }

  onAddUser(f: NgForm): void {
    if (!f.valid) {
      return;
    }
    const user: User = new User(this.add.email.toLowerCase(), this.add.password, 0, this.add.firstname, this.add.lastname, this.add.organisation, this.adminSelected, this.emailVerified);

    this.authService.signup(user).subscribe(data => {
      this.popupAddUserHidden = true;

      const newUserDataSource = this.userDataSource.data;
      newUserDataSource.push(User.trueCopy(data));
      this.userDataSource.connect().next(newUserDataSource);

    }, error => {
      this.updateFailed = true;
      this.popupAddUserHidden = true;
    });

  }

  onImportExportClick(): void {
    this.popupImportExportHidden = false;
  }

  getUserProfile(): void {
    this.userService.getUserProfile(this.authService.currentUser.getId()).subscribe(data => {

      this.user = Object.assign(new User(), data);

    }, error => {
      console.log(error);
    });
  }



  applyFilterMaterial(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    if (this.materialDataSource.paginator) {
      this.materialDataSource.filter = filterValue.trim().toLowerCase();
      this.materialDataSource.paginator.firstPage();
    }

  }

  applyFilterReport(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    if (this.reportDataSource.paginator) {
      this.reportDataSource.filter = filterValue.trim().toLowerCase();
      this.reportDataSource.paginator.firstPage();
    }

  }

  applyFilterUser(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    if (this.userDataSource.paginator) {
      this.userDataSource.filter = filterValue.trim().toLowerCase();
      this.userDataSource.paginator.firstPage();
    }
  }

  _setDataSource(indexNumber) {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          this.materialDataSource.paginator = null;
          this.userDataSource.paginator = null;
          this.reportDataSource.paginator = null;

          this.materialDataSource.sort = null;
          this.userDataSource.sort = null;
          this.reportDataSource.sort = null;
          break;
        case 1:
          this.materialDataSource.paginator = this.paginatormaterial;
          this.userDataSource.paginator = null;
          this.reportDataSource.paginator = null;

          this.materialDataSource.sort = this.sortMaterial;
          this.userDataSource.sort = null;
          this.reportDataSource.sort = null;
          break;
        case 2:
          this.userDataSource.paginator = this.paginatorUser;
          this.materialDataSource.paginator = null;
          this.reportDataSource.paginator = null;

          this.userDataSource.sort = this.sortUser;
          this.materialDataSource.sort = null;
          this.reportDataSource.sort = null;
          break;

        case 3:
          this.reportDataSource.paginator = this.paginatorReport;
          this.materialDataSource.paginator = null;
          this.userDataSource.paginator = null;

          this.reportDataSource.sort = this.sortReport;
          this.materialDataSource.sort = null;
          this.userDataSource.sort = null;
          break;
      }
    });

  }

  onReportEdit(element): void {
    if (!element.solved) {
      const report: Report = Object.assign(new Report(element.id, element.reportMessage, true, element.user, element.material));

      this.reportService.update(element.id, report).subscribe(data => {
        this.reportDataSource.data[this.reportDataSource.data.indexOf(element)] = report;
        this.reportDataSource._updateChangeSubscription();
      }, error => {
        console.log(error);
      });
    } else {
      const report: Report = Object.assign(new Report(element.id, element.reportMessage, false, element.user, element.material));

      this.reportService.update(element.id, report).subscribe(data => {
        this.reportDataSource.data[this.reportDataSource.data.indexOf(element)] = report;
        this.reportDataSource._updateChangeSubscription();
      }, error => {
        console.log(error);
      });
    }
  }

  onConfigSubmit(configForm: NgForm): void {
    if (!configForm.form.valid) {
      this.snackBar.open('Please fill in the required fields', 'Close', {
        duration: 1000,
        horizontalPosition: 'center', verticalPosition: 'bottom'
      });
      return;
    }

    this.configService.update(this.config).subscribe(value => {
      this.snackBar.open('Configuration has been successfully saved', 'Close', {
        duration: 1000,
        horizontalPosition: 'center', verticalPosition: 'bottom'
      });
    });
  }

  exportLabels(): void {
    let date = (new Date()).toLocaleDateString('nl-NL');

    const csvArray: Array<string> = [];

    //Add header to CSV
    csvArray.push('sep=\t');
    csvArray.push('\n');
    const header = Object.keys(this.materials[0]);
    header.forEach(x => {
      if (!(x.toLowerCase().includes('overviewurl')) && !(x.toLowerCase().includes('closeupurl'))) {
        csvArray.push(x + '\t ');
      }
    });
    csvArray.push('\n');

    //Add materials to CSV
    this.materials.forEach(x => {
        csvArray.push(
          x.getSequenceNumber() + '\t ' +
          x.getName() + '\t ' +
          x.getChanges() + '\t ' +
          x.getCreationDate() + '\t ' +
          x.getSteps() + '\t ' +
          x.getQRCodeURL() + '\t ');

        //Assign object type for the tags
        for (let i = 0; i < x.getTags().length; i++) {
          const currentTag: Tag = Object.assign(new Tag(), x.getTags()[i]);
          csvArray.push(currentTag.getName() + ' (' + currentTag.getId() + ') | ');
        }
        csvArray.push('\t ');



        //Assign object type for the user
        const currentUser: User = Object.assign(new User(), x.getUser());
        csvArray.push(currentUser.getOrganisation() + ' ' + currentUser.getFirstname() + ' ' + currentUser.getLastname() + ' (' + currentUser.getId() + ')');
        csvArray.push('\t ');

        if (x.getParentId() == null) {
          csvArray.push('No parent' + '\t ');
        } else {
          csvArray.push(
            x.getParentId() + '\t '
          );
        }

        csvArray.push(
          x.getReference() + '\t ' + '\n'
        );
      }
    );

    const myblob = new Blob(csvArray, {
      type: 'text/csv'
    });

    const a = document.createElement('a');
    const url = window.URL.createObjectURL(myblob);

    a.href = url;
    a.download = 'LabelExport - ' + date + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
