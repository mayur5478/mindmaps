import { Routes } from '@angular/router';
import { RouterModule }  from '@angular/router';
import { ListOfTopicsComponent } from './list-of-topics/list-of-topics.component';
import { TopicDetailsComponent} from './topic-details/topic-details.component';

const routes: Routes = [
  // map '/topics' to the topic list component
  {
    path: 'topics',
    component: ListOfTopicsComponent,
  },

  // HERE: new route for TopicDetailsComponent
  // map '/topic/:id' to topic details component
  {
    path: 'topics/:name/:uid/:id',
    component: TopicDetailsComponent
  },

  // map '/' to '/topics' as our default route
  {
    path: '',
    redirectTo: '/topics',
    pathMatch: 'full'
  },
];
export const appRouterModule = RouterModule.forRoot(routes);
