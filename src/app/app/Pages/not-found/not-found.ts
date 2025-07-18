import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../../navigation/header/header';

@Component({
    selector: 'app-not-found',
    imports: [
        RouterLink,
        HeaderComponent
    ],
    templateUrl: './not-found.html',
    styleUrl: './not-found.scss'
})
export class NotFound {

}
