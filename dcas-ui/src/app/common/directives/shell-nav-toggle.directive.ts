import { UserContextService } from './../services/user-context.service';
import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: '[dcas-shell-nav-toggle]',
})
export class ShellNavToggleDirective {

  constructor(private userContextService:UserContextService){}

  @HostListener('click', ['$event'])
  onClick(e) {
    this.toggleMenu();
  }

  toggleMenu(){
    let ctx = this.userContextService.get();
    ctx.isMenuOpen = !ctx.isMenuOpen;
    this.userContextService.update(ctx);
  }
}
