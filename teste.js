var string = "Ça été Mičić. ÀÉÏÓÛ";
console.log(string);

var string_norm = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
console.log(string_norm);