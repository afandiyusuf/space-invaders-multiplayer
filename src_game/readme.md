# Game Mechanic

Core game mechanic ada di source ini. File source ini menggunakan base template dari phaser, dimana logic game ditaruhdi Game.js

# Coding convention


Jika ingin membuat class baru Object (oop), bisa dibuat di folder object. Dengan nama class sesuai nama file.


Semua fungsi game ditaruh di BasicGame.Game.prototype inisiasi fungsi dengan cara : 

````
namaFungsi: function (){
	
},
````

Pemanggilan fungsi dengan di dalam class pembuat fungsi

````
this.namaFungsi()
````

Boot.js , Preloader.js, Mainmenu.js masih belum difungsikan. Jika nanti diperlukan akan difungsikan

### Game.js

#### preload
Fungsi dari phaser, dipanggil sebelum class diinisiasi, biasanya load asset (image sound) ditaruh di sini.

#### create
Fungsi dari phaser, dipanggil setelah preload dijalankan, biasanya inisiasi world, player, base logic, di sini.

#### initiateConnection

Fungsi ini dipanggil saat create, menginisiasi semua fungsi websocekt.
Socket tersebut dibuat class, dan berada pada object/Socket.js

#### update

Fungsi dari phaser, dipanggil setiap frame, digunakan utuk fungsi logic game, yang membutuhkan pengecekan secara berkala.

#### Quit game
Fungsi untuk keluar dari permainan. (belum digunakan)

#### createNewPlayer

Fungsi yang dipanggil saat ada koneksi masuk ke game, fungsi ini ditrigger oleh Socket.js (object/Socket.js)

#### removePlayer

Fungsi yang dipanggil saat ada koneksi terputus dari game, fungsi ini ditrigger oleh Socket.js