import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InterpretationListComponent} from './components/interpretation-list/interpretation-list.component';
import {FormsModule} from '@angular/forms';
import {AutosizeDirective} from './directives/autosize.directive';
import {FilterPipe} from './pipes/filter.pipe';
import {InterpretationService} from './services/interpretation.service';
import { AddInterpretationComponent } from './components/add-interpretation/add-interpretation.component';
import { InterpretationCommentComponent } from './components/interpretation-comment/interpretation-comment.component';
import { AbbreviatePipe } from './pipes/abbreviate.pipe';
import { InterpretationLikeComponent } from './components/interpretation-like/interpretation-like.component';
import { EditInterpretationComponent } from './components/edit-interpretation/edit-interpretation.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { DeleteCommentComponent } from './components/delete-comment/delete-comment.component';
import { EditCommentComponent } from './components/edit-comment/edit-comment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    InterpretationListComponent,
    AutosizeDirective,
    FilterPipe,
    AddInterpretationComponent,
    InterpretationCommentComponent,
    AbbreviatePipe,
    InterpretationLikeComponent,
    EditInterpretationComponent,
    AddCommentComponent,
    DeleteCommentComponent,
    EditCommentComponent
  ],

  exports: [InterpretationListComponent],
  providers: [InterpretationService]
})
export class InterpretationModule { }
