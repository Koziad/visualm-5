import {Component, OnInit} from '@angular/core';
import {Material} from 'src/app/models/material';
import {MaterialTag} from 'src/app/models/materialtag.enum';
import {SaveStatus} from 'src/app/models/save-status.enum';
import {MaterialsService} from 'src/app/services/materials.service';
import {Tag} from '../../models/tag';
import {Ingredient} from '../../models/ingredient';
import {MaterialIngredient} from '../../models/material-ingredient';
import {User} from '../../models/user';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public allMaterials: Material[] = [];
  public matchingMaterials: Material[] = [];
  public searchMaterials: Map<Material, number> = new Map<Material, number>();
  public searchQuery: string = '';
  public tagsSelected: boolean = true;
  public numberSelected: boolean = true;
  public titleSelected: boolean = true;
  public ingredientSelected: boolean = true;
  public userSelected: boolean = true;
  public typeSelected: boolean = true;
  public materialTag = MaterialTag;
  loadingDone: boolean = false;
  searchQuerySubscription: Subscription;
  sortedMaterials: Map<Material, number>;

  constructor(private materialService: MaterialsService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.materialService.getAll().subscribe(materials => {
      materials.forEach((material) => {
        const currentMaterial: Material = Object.assign(new Material(), material);

        // Show loading animation
        if (materials) {
          this.loadingDone = true;
        }

        // Only display PUBLISHED labels
        if (currentMaterial.getSaveStatus() === SaveStatus.PUBLISHED) {
          this.allMaterials.push(currentMaterial);
        }
      });
      this.searchQuerySubscription = this.activatedRoute.queryParams.subscribe(value => {
        console.log(value.search);
        if (value.search) {
          this.splitSearchQuery(value.search);
        }
      });
    });
    //By starting the component, all the materials will be visible
    this.matchingMaterials = this.allMaterials;
  }

  //Function to split the search query in different parts, each part will be searched individually
  splitSearchQuery(searchQuery: string) {
    if (!(searchQuery == '')) {
      this.searchQuery = searchQuery;
    }

    this.matchingMaterials = [];
    this.searchMaterials.clear();

    //Remove double spaces
    searchQuery = searchQuery
      .trim()
      .replace(/ {2,}/g, ' ');

    let searchQueryPartsSpace = searchQuery.split(' ');
    let searchQueryPartsCharCount = searchQuery.match(/.{1,3}/g);

    for (let x of searchQueryPartsSpace) {
      this.search(x);
    }

    for (let x of searchQueryPartsCharCount) {
      if (x.length > 2) {
        this.search(x);
      }
    }
    this.search(searchQuery);

    //Search for the sequence number
    this.search(searchQuery.replace('#', '').replace(/^0+/, ''));

    this.matchingMaterials = [...this.sortedMaterials.keys()];
    console.log(this.sortedMaterials);
  }

  //Searches trough the materials and counts the ranking score
  search(searchQuery: string) {
    if (this.tagsSelected) {
      let foundMaterials = this.searchTag(searchQuery);

      foundMaterials.forEach((a, b) => {
          if (this.searchMaterials.get(b) != undefined) {
            foundMaterials.set(b, (a += this.searchMaterials.get(b)));
          }
        }
      );
      this.searchMaterials = new Map([...Array.from(this.searchMaterials.entries()), ...Array.from(foundMaterials.entries())]);
    }
    if (this.numberSelected) {
      let foundMaterials = this.searchNumber(searchQuery);

      foundMaterials.forEach((a, b) => {
          if (this.searchMaterials.get(b) != undefined) {
            foundMaterials.set(b, (a += this.searchMaterials.get(b)));
          }
        }
      );
      this.searchMaterials = new Map([...Array.from(this.searchMaterials.entries()), ...Array.from(foundMaterials.entries())]);
    }
    if (this.titleSelected) {
      let foundMaterials = this.searchTitle(searchQuery);

      foundMaterials.forEach((a, b) => {
          if (this.searchMaterials.get(b) != undefined) {
            foundMaterials.set(b, (a += this.searchMaterials.get(b)));
          }
        }
      );
      this.searchMaterials = new Map([...Array.from(this.searchMaterials.entries()), ...Array.from(foundMaterials.entries())]);
    }
    if (this.userSelected) {
      let foundMaterials = this.searchUser(searchQuery);

      foundMaterials.forEach((a, b) => {
          if (this.searchMaterials.get(b) != undefined) {
            foundMaterials.set(b, (a += this.searchMaterials.get(b)));
          }
        }
      );
      this.searchMaterials = new Map([...Array.from(this.searchMaterials.entries()), ...Array.from(foundMaterials.entries())]);
    }
    if (this.typeSelected) {
      let foundMaterials = this.searchType(searchQuery);

      foundMaterials.forEach((a, b) => {
          if (this.searchMaterials.get(b) != undefined) {
            foundMaterials.set(b, (a += this.searchMaterials.get(b)));
          }
        }
      );
      this.searchMaterials = new Map([...Array.from(this.searchMaterials.entries()), ...Array.from(foundMaterials.entries())]);
    }
    if (this.ingredientSelected) {
      let foundMaterials = this.searchIngredients(searchQuery);

      foundMaterials.forEach((a, b) => {
          if (this.searchMaterials.get(b) != undefined) {
            foundMaterials.set(b, (a += this.searchMaterials.get(b)));
          }
        }
      );
      this.searchMaterials = new Map([...Array.from(this.searchMaterials.entries()), ...Array.from(foundMaterials.entries())]);
    }

    this.sortedMaterials = new Map([...this.searchMaterials.entries()].sort((a, b) => (a[1] > b[1] && -1) || (a[1] === b[1] ? 0 : 1)));
  }

  searchIngredients(searchQuery: string) {
    let foundMaterials: Map<Material, number> = new Map<Material, number>();

    this.allMaterials.forEach((material) => {
      for (let i = 0; i < material.getMaterialIngredients().length; i++) {
        const currentMaterialIngredient: MaterialIngredient = Object.assign(new MaterialIngredient(), material.getMaterialIngredients()[i]);
        const currentIngredient: Ingredient = Object.assign(new Ingredient(), currentMaterialIngredient.getIngredient());
        if (currentIngredient.getName().toLowerCase().includes(searchQuery)) {
          foundMaterials.set(material, 5);
        }
        if (currentIngredient.getName().toLowerCase() == searchQuery) {
          foundMaterials.set(material, 10);
        }
      }
    });
    return foundMaterials;
  }

  searchType(searchQuery: string) {
    let foundMaterials: Map<Material, number> = new Map<Material, number>();

    this.allMaterials.forEach((material) => {
      if (material.getType().toLowerCase().includes(searchQuery)) {
        foundMaterials.set(material, 5);
      }
      if (material.getType().toLowerCase() == searchQuery) {
        foundMaterials.set(material, 10);
      }
    });
    return foundMaterials;
  }

  searchUser(searchQuery: string) {
    let foundMaterials: Map<Material, number> = new Map<Material, number>();

    this.allMaterials.forEach((material) => {
      const currentUser: User = Object.assign(new User(), material.getUser());
      if (currentUser.getFirstname().toLowerCase().includes(searchQuery)) {
        foundMaterials.set(material, 3);
      }
      if (currentUser.getLastname().toLowerCase().includes(searchQuery)) {
        foundMaterials.set(material, 5);
      }
      if (currentUser.getFirstname().toLowerCase() == searchQuery) {
        foundMaterials.set(material, 8);
      }
      if (currentUser.getLastname().toLowerCase() == searchQuery) {
        foundMaterials.set(material, 10);
      }
    });
    return foundMaterials;
  }

  searchTitle(searchQuery: string) {
    let foundMaterials: Map<Material, number> = new Map<Material, number>();

    this.allMaterials.forEach((material) => {
      if (material.getName().toLowerCase().includes(searchQuery)) {
        foundMaterials.set(material, 25);
      }
      if (material.getName().toLowerCase() == searchQuery) {
        foundMaterials.set(material, 35);
      }
    });
    return foundMaterials;
  }

  searchNumber(searchQuery: string) {
    let foundMaterials: Map<Material, number> = new Map<Material, number>();

    this.allMaterials.forEach((material) => {
      if (material.getSequenceNumber().toString().includes(searchQuery)) {
        foundMaterials.set(material, 5);
      }
      if (material.getSequenceNumber().toString() == searchQuery) {
        foundMaterials.set(material, 10);
      }
    });
    return foundMaterials;
  }

  searchTag(searchQuery: string) {
    let foundMaterials: Map<Material, number> = new Map<Material, number>();

    this.allMaterials.forEach((material) => {
      for (let i = 0; i < material.getTags().length; i++) {
        const currentTag: Tag = Object.assign(new Tag(), material.getTags()[i]);
        if (currentTag.getName().toLowerCase().includes(searchQuery)) {
          foundMaterials.set(material, 3);
        }
        if (currentTag.getName().toLowerCase() == searchQuery) {
          foundMaterials.set(material, 5);
        }
      }
    });
    return foundMaterials;
  }

  urlParameters(searchQuery: string) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {search: searchQuery},
        queryParamsHandling: 'merge'
      });
  }

  OnInput(event: any) {
    this.urlParameters(event.target.value.toLowerCase());
  }

  exportLabels(): void {
    let date = (new Date()).toLocaleDateString('nl-NL');

    const csvArray: Array<string> = [];

    //Add header to CSV
    csvArray.push('sep=\t');
    csvArray.push('\n');
    const header = Object.keys(this.matchingMaterials[0]);
    header.forEach(x => {
      if (!(x.toLowerCase().includes('overviewurl')) && !(x.toLowerCase().includes('closeupurl'))) {
        csvArray.push(x + '\t ');
      }
    });
    csvArray.push('\n');

    //Add materials to CSV
    this.matchingMaterials.forEach(x => {
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

        //Assign object type for the ingredients
        for (let i = 0; i < x.getMaterialIngredients().length; i++) {
          const currentMaterialIngredient: MaterialIngredient = Object.assign(new MaterialIngredient(), x.getMaterialIngredients()[i]);
          const currentIngredient: Ingredient = Object.assign(new Ingredient(), currentMaterialIngredient.getIngredient());
          csvArray.push(currentIngredient.getName() + ' ' + currentIngredient.getType() + ' (' + currentIngredient.getId() + ') | ');
        }
        csvArray.push('\t ');

        csvArray.push(
          x.getSaveStatus() + '\t ' +
          x.getType() + '\t '
        );

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
