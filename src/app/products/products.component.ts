import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { element } from 'protractor';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  isWishlistOpen = false;
  wishlistItems: any[] = [];

  toggleWishlist() {
    this.isWishlistOpen = !this.isWishlistOpen;
    this.loadWishlistItems();
  }

  loadWishlistItems() {
    this.wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
  }

  addToWishlist(item: any): void {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.some((wishItem: any) => wishItem.product_number === item.product_number)) {
      wishlist.push(item);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.wishlistItems = wishlist;
    }
  }

  removeFromWishlist(productNumber: string) {
    const wishlist = this.wishlistItems.filter(item => item.product_number !== productNumber);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    this.wishlistItems = wishlist;
  }

  orderViaWhatsApp() {
    const phoneNumber = ''; // Add your WhatsApp number here
    const productNumbers = this.wishlistItems.map(item => item.product_number);
    let formattedNumbers = productNumbers.length === 2 
      ? productNumbers.join(' and ')
      : productNumbers.length > 2
        ? productNumbers.slice(0, -1).join(', ') + ' and ' + productNumbers[productNumbers.length - 1]
        : productNumbers[0];
    const message = `Hello, I would like to order the following products: ${formattedNumbers}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
  dataArray
  isModalOpen = false;
  selectedImage: string;
  constructor( private fs:AngularFirestore, private elementRef: ElementRef) { 
    this.fs.collection('products').snapshotChanges().subscribe(data=>{
      this.dataArray = data.map(element => {
        return { 
          product_number: element.payload.doc.data()['product_number'],
          product_name: element.payload.doc.data()['product_name'],
          product_price: element.payload.doc.data()['product_price'],
          product_image: element.payload.doc.data()['product_image'],
          product_size: element.payload.doc.data()['product_size'],
          currency:element.payload.doc.data()['currency']
        }
      })
    })
  }

  ngOnInit(): void {
    this.loadWishlistItems();
  }
  openModal(image: string) {
    this.selectedImage = image;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedImage = null;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const wishlistButton = this.elementRef.nativeElement.querySelector('.wishlist-button');
    const wishlistPanel = this.elementRef.nativeElement.querySelector('.wishlist-panel');
    
    if (!wishlistButton.contains(event.target) && 
        !wishlistPanel?.contains(event.target) && 
        this.isWishlistOpen) {
      this.isWishlistOpen = false;
    }
  }
}
