import {Component, OnInit} from '@angular/core';
import {Material} from 'src/app/models/material';
import {MaterialTag} from 'src/app/models/materialtag.enum';
import {SaveStatus} from 'src/app/models/save-status.enum';
import {MaterialsService} from 'src/app/services/materials.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public materials: Material[] = [];
  public materialTag = MaterialTag;
  loadingDone: boolean = false;

  constructor(private materialService: MaterialsService) {
  }

  ngOnInit(): void {
    this.materialService.getAll().subscribe(materials => {
      materials.forEach((material) => {
        const currentMaterial: Material = Material.trueCopy(material);

        if (material) {
          this.loadingDone = true;
        }

        // Only display PUBLISHED labels
        if (currentMaterial.getSaveStatus() === SaveStatus.PUBLISHED) {
          this.materials.push(currentMaterial);
        }
      });
    });
  }
}
