import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-myproducts',
  templateUrl: './myproducts.component.html',
  styleUrls: ['./myproducts.component.css']
})
export class MyproductsComponent implements OnInit {
  Uid: string;
  dataArray: any[] = [];
  isModalOpen = false;
  selectedImage: string;

  constructor(private fs: AngularFirestore, private as: AuthService) {
    this.as.user.subscribe(user => {
      if (user) {
        this.Uid = user.uid;
        this.loadUserProducts(); 
      }
    });
  }

  ngOnInit(): void {
  }

  loadUserProducts() {
    this.fs.collection('products', ref => ref.where('uid', '==', this.Uid)).snapshotChanges().subscribe(data => {
      this.dataArray = data.map(element => {
        return {
          id: element.payload.doc.id,
          product_number: element.payload.doc.data()['product_number'],
          product_name: element.payload.doc.data()['product_name'],
          product_price: element.payload.doc.data()['product_price'],
          product_image: element.payload.doc.data()['product_image'],
          product_size:element.payload.doc.data()['product_size'],
          currency: element.payload.doc.data()['currency'],
          uid: element.payload.doc.data()['uid']
        };
      });
    });
  }

  addprodcut(f) {
    let data = f.value;
    this.fs.collection('products').add({
      product_number: data.product_number,
      product_name: data.product_name,
      product_price: data.product_price,
      currency: data.currency,
      product_size:data.product_size,
      product_image: data.product_image,
      uid: this.Uid
    }).then(() => {
      console.log('added');
      f.resetForm();
    });
  }

  openModal(image: string) {
    this.selectedImage = image;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedImage = null;
  }
 
  confirmDelete(productId: string) {
    const confirmation = confirm('Do you want to delete this product?');
    if (confirmation) {
        this.deleteProduct(productId);
    }
}

deleteProduct(productId: string) {
    this.fs.collection('products').doc(productId).delete().then(() => {
        console.log('Product deleted successfully');
        this.dataArray = this.dataArray.filter(item => item.id !== productId);
    }).catch(error => {
        console.error('Error deleting product: ', error);
    });
}
}