import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ClearCartModal } from './clear-cart-modal';

describe('ClearCartModal', () => {
  let component: ClearCartModal;
  let fixture: ComponentFixture<ClearCartModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearCartModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearCartModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit "closed" when close() is called', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    component.close();

    expect(closedSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit "confirmed" when confirm() is called', () => {
    const confirmedSpy = vi.fn();
    component.confirmed.subscribe(confirmedSpy);

    component.confirm();

    expect(confirmedSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit "closed" when clicking on the overlay itself', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('div') as HTMLElement;
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closedSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT emit "closed" when clicking inside the modal content', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);
    fixture.detectChanges();

    const modalContent = fixture.nativeElement.querySelector('.modal') as HTMLElement;
    modalContent.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closedSpy).not.toHaveBeenCalled();
  });

  it('should emit "closed" on Escape keydown when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(closedSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT emit "closed" on Escape keydown when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(closedSpy).not.toHaveBeenCalled();
  });
});
