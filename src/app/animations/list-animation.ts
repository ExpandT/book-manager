import {animate, query, stagger, style, transition, trigger} from "@angular/animations";

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-15px)' }),
      stagger(50, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true }),
    query(':leave', [
      stagger(50, [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-15px)' }))
      ])
    ], { optional: true })
  ])
]);
