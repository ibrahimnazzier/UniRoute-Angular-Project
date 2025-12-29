import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SearchResults } from './pages/search-results/search-results';
import { RedirectComponent } from './components/redirect/redirect';
import { LiveBoardComponent } from './pages/live-board/live-board';
import { TripDetailsComponent } from './pages/trip-details/trip-details';
import { CompanySearchComponent } from './pages/company-search/company-search';

export const routes: Routes = [{ path: '', component: Home },
        { path: 'search-result', component: SearchResults },
        { path: 'redirect', component: RedirectComponent },
        { path: 'live-board', component: LiveBoardComponent },
        { path: 'operators', component: CompanySearchComponent },
        { 
    path: 'trip/:id',        // :id is the dynamic parameter (e.g., 31)
    component: TripDetailsComponent 
  }
];