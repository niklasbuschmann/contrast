(function() {
var provide = function(namespace) {
	var subspaces = namespace.split('.');
	var object = window;
	subspaces.forEach(function(subspace) {
		object[subspace] = object[subspace] || {};
		object = object[subspace];
	});
};

var require = function(namespace) {
	var subspaces = namespace.split('.');
	var object = window;
	subspaces.forEach(function(subspace) {
		object = object[subspace];
		if (!object) {
			throw namespace + ' required but ' + subspace + ' not provided.';
		}
	});
};
provide('recipe');

recipe.INGREDIENT_SELECTOR = 'li';

recipe.init = function(rootNode) {
	recipe.rootNode = rootNode;
	recipe.bindAdjuster();
	recipe.markIngredients();
};

/**
 * Replace the static text indicating how much the recipe produces
 * with a dynamic number stepper that changes the ingredient proportions.
 */
recipe.bindAdjuster = function() {
	recipe.rootNode.innerHTML = recipe.rootNode.innerHTML.replace(/(serves )(\d+)/i,
			function(unused_match, serves, quantity) {
		return serves + '<input type="number" min="0" value="' + quantity + '" step="' + quantity/4 + '" onchange="recipe.adjustIngredients(this.value/' + quantity + ')"/>'
	});
};

/**
 * Parses ingredient quantity and unit information.
 */
recipe.markIngredients = function() {
	var ingredients = recipe.rootNode.querySelectorAll(recipe.INGREDIENT_SELECTOR);
	Array.prototype.forEach.call(ingredients, function(ingredient) {
		recipe.markIngredient(ingredient);
	});
};

recipe.markIngredient = function(ingredient) {
	ingredient.innerHTML = ingredient.textContent.replace(
			/^([\d\/?[^\s&]*)(?:&nbsp;|\s)(\w*)/g,
			function(match, quantity, unit) {
	  var n = new recipe.Number(quantity);
		var i = new recipe.Ingredient(n, unit);
		var serializedQuantity = n.isFraction() ? n.toImproperFraction() : n;
		return '<span class="ingredient" data-quantity="' +
				serializedQuantity.toString() +
				'" data-unit="' + i.getSingularUnit() + '">' + match + '</span>';
	});
};

/**
 * Change the proportion of the ingredient.
 */
recipe.adjustIngredients = function(scale) {
	var ingredients = document.getElementsByClassName('ingredient');
	Array.prototype.forEach.call(ingredients, function(ingredient) {
  	recipe.adjustIngredient(ingredient, scale);
  });
};

recipe.adjustIngredient = function(ingredient, scale) {
	var quantity = ingredient.dataset['quantity'];
	var unit = ingredient.dataset['unit'];
	var scaledQuantity = new recipe.Number(quantity).multiply(scale);
	ingredient.textContent = new recipe.Ingredient(scaledQuantity, unit).convertUnits().toString();
};
provide('recipe.Number');

/**
 * Creates a Number object from a string of any of forms:
 *   * W
 *   * N/D
 *   * W N/D
 *   * W&nbsp;N/D
 * where W, N, and D are non-negative integers.
 *
 * @constructor
 * @param {string} number The string representation of the number.
 */
recipe.Number = function(number) {
	var match = number.match(/^(?:(\d+)|(?:(\d+)(?: |&nbsp;))?(?:(\d+)\/(\d+))?)$/);
	if (!match || !match[0] || match[4] == '0') {
		throw 'Invalid number: "' + number + '".';
	}
	this.wholeNumber = +(match[1] || match[2]);
	this.numerator = +match[3];
	this.denominator = +match[4];
};

/**
 * Determines if the number is a fraction.
 * @this {recipe.Number}
 * @return {boolean} If the number is a fraction.
 */
recipe.Number.prototype.isFraction = function() {
	return !!(this.numerator && this.denominator);
};

/**
 * Determines if the fraction is proper, which is defined as
 * the numerator being strictly less than the denominator.
 * @this {recipe.Number}
 * @return {boolean} If the fraction is proper.
 */
recipe.Number.prototype.isProperFraction = function() {
	return this.numerator < this.denominator;
};

/**
 * Determines if the fraction is improper, which is defined as
 * the numerator being greater than or equal to the denominator.
 * @this {recipe.Number}
 * @return {boolean} If the fraction is improper.
 */
recipe.Number.prototype.isImproperFraction = function() {
	return this.numerator >= this.denominator;
};

/**
 * Determines if the fraction is mixed, which is defined as
 * a whole number with a proper fraction.
 * @this {recipe.Number}
 * @return {boolean} If the fraction is mixed.
 */
recipe.Number.prototype.isMixedFraction = function() {
	return this.isProperFraction() && !isNaN(this.wholeNumber);
};

/**
 * Simplifies fractions. Examples:
 *   3/2 = 1 1/2
 *   4/2 = 2
 *   1 3/2 = 2 1/2
 *   0/1 = 0
 *   1 0/1 = 1
 * @this {recipe.Number}
 * @return {recipe.Number} The instance.
 */
recipe.Number.prototype.simplifyFraction = function() {
	if (this.isImproperFraction()) {
		this.wholeNumber |= 0;
		this.wholeNumber += Math.floor(this.numerator / this.denominator);
		var modulus = this.numerator % this.denominator;
		if (modulus) {
			this.numerator = modulus;
		}
		else {
			this.numerator = this.denominator = NaN;
		}
	}
	else if (this.numerator == 0) {
		this.wholeNumber |= 0;
		this.numerator = this.denominator = NaN;
	}
	return this;
};

/**
 * Reduces a fraction. Examples:
 *   2/6 = 1/3
 *   6/2 = 3/1
 * @this {recipe.Number}
 * @return {recipe.Number} The instance.
 */
recipe.Number.prototype.reduceFraction = function() {
	if (this.isFraction()) {
		var gcd = recipe.Number.gcd(this.numerator, this.denominator);
		this.numerator /= gcd;
		this.denominator /= gcd;
	}
	return this;
};

/**
 * Converts proper fractions to improper fractions. Examples:
 *   1 1/2 = 3/2
 *   3/2 = 3/2
 *   1/2 = 1/2
 *   2 = 2
 *
 * @this {recipe.Number}
 * @return {recipe.Number} The instance.
 */
recipe.Number.prototype.toImproperFraction = function() {
	if (!isNaN(this.wholeNumber)) {
		this.numerator |= 0;
		this.denominator = this.denominator || 1;
		this.numerator += this.wholeNumber * this.denominator;
		this.wholeNumber = NaN;
	}
	return this;
};

/**
 * Multiplies the number by some decimal value.
 * @param {number} multiplier The multiplier.
 * @this {recipe.Number}
 * @return {recipe.Number} The instance.
 */
recipe.Number.prototype.multiply = function(multiplier) {
	this.toImproperFraction();
	this.numerator *= multiplier;
	return this.reduceFraction().simplifyFraction();
};

/**
 * Gets a string representation of the number.
 * @this {recipe.Number}
 * @return {string} The string representation of the number.
 */
recipe.Number.prototype.toString = function() {
	var number = '';
	var fraction = '';
	if (!isNaN(this.wholeNumber)) {
		number += this.wholeNumber;
	}
	if (this.isFraction()) {
		fraction = this.numerator + '/' + this.denominator;
	}
	if (number && fraction) {
		number += ' ' + fraction;
	}
	return number || fraction;
};

/**
 * Gets a numeric representation of the number.
 * @this {recipe.Number}
 * @return {number} The numeric representation of the number.
 */
recipe.Number.prototype.valueOf = function() {
	var value = this.wholeNumber || 0;
	value += (this.numerator / this.denominator) || 0;
	return value;
};

/**
 * Euclid's algorithm to find the greatest common divisor of two numbers.
 * @param {number} a One number.
 * @param {number} b Another number.
 * @return {number} The GCD of the numbers.
 */
recipe.Number.gcd = function gcd(a, b){
	return b ? recipe.Number.gcd(b, a % b) : a;
};
provide('recipe.Ingredient');

recipe.Ingredient = function(quantity, unit) {
	this.quantity = quantity;
	this.unit = unit;
};

recipe.Ingredient.prototype.isSingular = function() {
	return this.quantity > 0 && this.quantity <= 1;
};

recipe.Ingredient.prototype.pluralize = function() {
	if (this.isSingular()) {
		return this.unit;
	}
	else {
		return this.unit + 's';
	}
};

recipe.Ingredient.prototype.getSingularUnit = function() {
	if (this.isSingular()) {
		return this.unit;
	}
	else {
		return this.unit.replace(/s$/, '');
	}
};

recipe.Ingredient.prototype.toString = function() {
	return this.quantity.toString() + ' ' + this.pluralize();
};

recipe.Ingredient.prototype.convertUnits = function() {
	var conversion = recipe.Ingredient.CONVERSIONS[this.unit] || {};
	if (conversion.min && this.quantity < conversion.min.value) {
		this.unit = conversion.min.next;
		this.quantity.multiply(conversion.to[this.unit]);
	}
	else if (conversion.max && this.quantity >= conversion.max.value) {
		this.unit = conversion.max.next;
		this.quantity.multiply(conversion.to[this.unit]);
	}
	return this;
};

recipe.Ingredient.CONVERSIONS = {
	cup: {
		to: {
			tablespoon: 16
		},
		min: {
			value: 1/4,
			next: 'tablespoon'
		}
	},
	tablespoon: {
		to: {
			teaspoon: 3,
			cup: 1/16
		},
		min: {
			value: 1,
			next: 'teaspoon'
		},
		max: {
			value: 4,
			next: 'cup'
		}
	},
	teaspoon: {
		to: {
			tablespoon: 1/3
		},
		max: {
			value: 3,
			next: 'tablespoon'
		}
	}
};
})();
