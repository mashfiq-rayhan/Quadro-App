// let x = ["monday", "tuesday", "thursday", "friday", "saturday", "sunday", "x", "y"];

// console.log(days);

let days = {
	monday: true,
	tuesday: false,
	wednesday: true,
	thursday: false,
	friday: false,
	saturday: true,
	sunday: false,
};
let output = [];
for (key in days) {
	if (days[key]) output.push(key);
}
console.log(output);
