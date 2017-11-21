# Joystick Mechanic

Core mechanic untuk joystick, di game ini.
Jika user mengakses url tertentu (lewat smartphone), maka tampilannya hanya berupa joystick sehingga user mengfungsikan smartphonenya sebagai joystick sambil melihat layar game. 

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

#### update

Fungsi dari phaser, dipanggil setiap frame, digunakan utuk fungsi logic game, yang membutuhkan pengecekan secara berkala.

#### emitAction

Fungsi  yang digunakan untuk mentrigger websocket jika kita ingin mentrigger fungsi.

Data yang dikirimkan adalah sebagai berikut

````
	//session player, ini nanti sebagai identitas socket game dari socket lainnya
	data.session = session; 
	
	/* act behaviour, sekarang ada ("down, up") state yang ingin dikirim, singkatnya, 
	*/ jika user menekan tombol, kirim down, jika user melepas tombol kirim up
	data.act_behaviour=act_behaviour; 
	
	/* act name, sekarang ada ("left, right, fire") nama tombol yang sedang dikirim,
	*  singkatnya, ini adalah nama tombol yang nanti dikenali oleh game
	*/
	data.act_name= act_name;  
````



#### Quit game
Fungsi untuk keluar dari permainan. (belum digunakan)

#### createNewPlayer

Fungsi yang dipanggil saat ada koneksi masuk ke game, fungsi ini ditrigger oleh Socket.js (object/Socket.js)

#### removePlayer

Fungsi yang dipanggil saat ada koneksi terputus dari game, fungsi ini ditrigger oleh Socket.js