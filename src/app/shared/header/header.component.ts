import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private storage: StorageService) { }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.storage.isAuthenticated();
  }

}
