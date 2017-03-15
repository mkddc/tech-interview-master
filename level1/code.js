var fs = require('fs');
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

var articles = data.articles
var carts = data.carts

var result = {};

var cartsArray = [];

// Parcours de chaque cart :
carts.forEach( function(cart, index) {
	// console.log('cart :');	
	// console.log(cart);
	// console.log('++++++++');
	var total = 0;
	var id = cart['id'];

	// Pour chaque cart, parcours de chaque élément de 'items' :
	cart['items'].forEach( function(item, indx) {
		// console.log('item :');	
		// console.log(item);
		// console.log('++++++++');

		var article_id = item['article_id'];
		var quantity = item['quantity'];

		//Récupération du prix de l'élément en s'indexant :
		// Puis multiplication par la quantité
		var itemPrice = articles[article_id - 1]['price'];
		var price = itemPrice*quantity;


		total += price;
	});

	cartsArray.push({
		'id': id,
		'total': total
	});
});

result = {
	"carts": cartsArray
};


fs.writeFile('output.json', JSON.stringify(result, null, 2));
