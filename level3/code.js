
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

var articles = data.articles
var carts = data.carts
var deliveryFees = data.delivery_fees;
var discounts = data.discounts;

var result = {};


var cartsArray = [];

// Parcours de chaque cart :
carts.forEach( function(cart, index) {
	// console.log(cart);
	// console.log('++++++++');
	var total = 0;
	var id = cart['id'];

	// Pour chaque cart, parcours de chaque élément de 'items' :
	cart['items'].forEach( function(item, indx) {

		var article_id = item['article_id'];
		var quantity = item['quantity'];

		//Récupération du prix de l'élément en s'indexant :
		// Puis multiplication par la quantité
		var itemPrice = articles[article_id - 1]['price'];

		var discountToApply = 0;

		// Parcours des promotions afin d'ajuster le prix de l'article : 
		discounts.forEach( function(discount, index) {
			// si on trouve l'article dans les promos, on calcule le nouveau prix et on sort
			if(discount['article_id'] === article_id){
				// Récupération du type de remise et de la valeur :
				var type = discount['type'];
				var value = discount['value'];
				if(type === 'amount'){
					discountToApply = -value;
				}
				else if (type === 'percentage') {
					discountToApply = -(itemPrice * value/100);
				}
				// Si on trouve, on sort :
				return;
			}
		});

		var price = (itemPrice + discountToApply) * quantity;

		// var price = itemPrice*quantity;

		total += price;
		// console.log('total');
		// console.log(total);

	});

	// Parcours des delivery fees afin de voir dans quelle tranche
	// le prix du cart se situe:
	var feeToApply = 0;

	deliveryFees.forEach( function(typeFee, index) {

		minPrice = typeFee['eligible_transaction_volume']['min_price'];
		
		// console.log('minPrice');
		// console.log(minPrice);
		
		maxPrice = typeFee['eligible_transaction_volume']['max_price'];
		
		// console.log('maxPrice');
		// console.log(maxPrice);
		
		// Je fais le choix d'inclure le minPrice et d'exclure le maxPrice
		// car les inclusions de bornes ne sont pas précisées
		if (total >= minPrice && total < maxPrice ) {
			feeToApply = typeFee['price'];
			return;
		}
	});

	// Rajout des frais de livraison au total du cart:
	total += feeToApply; 

	cartsArray.push({
		'id': id,
		'total': total
	});
});

result = {
	"carts": cartsArray
};

fs.writeFile('output.json', JSON.stringify(result, null, 2));